import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

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
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleLike = async (imageId: Id<'images'>) => {
    try {
      await toggleLike({ imageId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to like image');
    }
  };

  const openModal = useCallback((image: ImageType, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  }, []);

  const navigateImages = useCallback(
    (direction: 'prev' | 'next') => {
      const validImages = images.filter((img) => img.url);
      if (validImages.length <= 1) return;

      let newIndex = currentIndex;
      if (direction === 'prev') {
        newIndex = (currentIndex - 1 + validImages.length) % validImages.length;
      } else {
        newIndex = (currentIndex + 1) % validImages.length;
      }

      const newImage = validImages[newIndex];
      if (newImage && newImage.url) {
        setSelectedImage(newImage);
        setCurrentIndex(newIndex);
      }
    },
    [images, currentIndex],
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateImages('prev');
          break;
        case 'ArrowRight':
          navigateImages('next');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal, navigateImages]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map(
          (image, index) =>
            image.url && (
              <ImageCard
                key={image._id}
                image={{ ...image, url: image.url }}
                onLike={() => void handleLike(image._id)}
                onDelete={onDelete ? () => onDelete(image._id) : undefined}
                onClick={() => openModal(image, index)}
              />
            ),
        )}
      </div>

      {isModalOpen && selectedImage && selectedImage.url && (
        <ImageModal
          image={selectedImage}
          onClose={closeModal}
          onPrev={() => navigateImages('prev')}
          onNext={() => navigateImages('next')}
          hasMultipleImages={images.filter((img) => img.url).length > 1}
        />
      )}
    </>
  );
}

function ImageCard({
  image,
  onLike,
  onDelete,
  onClick,
}: {
  image: Omit<ImageType, 'url'> & { url: string };
  onLike: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}) {
  const isLiked = useQuery(api.likes.isLiked, { imageId: image._id });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <img src={image.url} alt={image.description || ''} className="h-full w-full object-cover" />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent triggering the parent onClick
                void onLike();
              }}
              className="transform transition-transform hover:scale-110"
            >
              {isLiked ? (
                <span className="text-3xl">❤️</span>
              ) : (
                <span className="text-3xl">🤍</span>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                onLike();
              }}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
              <span className="text-sm font-medium">{image.likeCount}</span>
            </button>
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                onDelete();
              }}
              className="text-gray-400 transition-colors hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
            {image.description}
          </p>
        )}

        <div className="mt-1 text-[10px] text-gray-400">
          {new Date(image._creationTime).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function ImageModal({
  image,
  onClose,
  onPrev,
  onNext,
  hasMultipleImages,
}: {
  image: ImageType;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasMultipleImages: boolean;
}) {
  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] scale-100 transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-300 dark:bg-gray-800">
        <div className="flex max-h-[90vh] flex-col md:flex-row">
          {/* Image container */}
          <div className="relative flex items-center justify-center bg-black/20 dark:bg-black/40 md:max-w-[60vw]">
            <img
              src={image.url || ''}
              alt={image.description || ''}
              className="max-h-[50vh] max-w-full object-contain md:max-h-[90vh]"
            />

            {/* Navigation arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  className="absolute left-2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Image details */}
          <div className="flex flex-col overflow-y-auto p-4 md:w-80 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Image Details
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {image.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {image.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Uploaded on
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(image._creationTime).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Likes</h4>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-lg">❤️</span>
                  <span className="text-sm font-medium">{image.likeCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
