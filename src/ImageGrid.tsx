import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { toast } from 'sonner';
import { useState } from 'react';

type ImageType = {
  _id: Id<'images'>;
  url: string | null;
  likeCount: number;
  _creationTime: number;
  description?: string;
  storageId: Id<'_storage'>;
  userId: Id<'users'>;
};

export function ImageGrid({
  images,
  onDelete,
}: {
  images: ImageType[];
  onDelete?: (imageId: Id<'images'>) => void;
}) {
  const toggleLike = useMutation(api.likes.toggleLike);

  const handleLike = async (imageId: Id<'images'>) => {
    try {
      await toggleLike({ imageId });
    } catch (error) {
      toast.error('Failed to like image');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {images.map(
        (image) =>
          image.url && (
            <ImageCard
              key={image._id}
              image={{ ...image, url: image.url }}
              onLike={() => handleLike(image._id)}
              onDelete={onDelete ? () => onDelete(image._id) : undefined}
            />
          ),
      )}
    </div>
  );
}

function ImageCard({
  image,
  onLike,
  onDelete,
}: {
  image: Omit<ImageType, 'url'> & { url: string };
  onLike: () => void;
  onDelete?: () => void;
}) {
  const isLiked = useQuery(api.likes.isLiked, { imageId: image._id });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={image.url}
          alt={image.description || ''}
          className="w-full aspect-square object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike();
              }}
              className="transform hover:scale-110 transition-transform"
            >
              {isLiked ? (
                <span className="text-4xl">❤️</span>
              ) : (
                <span className="text-4xl">🤍</span>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
              <span className="font-medium">{image.likeCount}</span>
            </button>
          </div>

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {image.description && (
          <p className="mt-2 text-gray-600 text-sm line-clamp-2">{image.description}</p>
        )}

        <div className="mt-2 text-xs text-gray-400">
          {new Date(image._creationTime).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
