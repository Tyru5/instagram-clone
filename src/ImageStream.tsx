import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ImageGrid } from './ImageGrid';

export function ImageStream() {
  const images = useQuery(api.images.listImages);

  if (!images) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <ImageGrid images={images} />;
}
