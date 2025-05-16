import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ImageGrid } from './ImageGrid';

/**
 * ImageStream component that displays a grid of images fetched from the server.
 * Shows a loading spinner while images are being fetched.
 * Once loaded, renders the images in a grid layout using ImageGrid component.
 * @returns React component that displays either a loading spinner or grid of images
 */
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
