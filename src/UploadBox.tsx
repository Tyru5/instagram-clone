import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export function UploadBox() {
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const processAndStoreImage = useMutation(api.images.processAndStoreImage);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const file = acceptedFiles[0];
        if (!file) return;

        // Resize image
        const resized = await resizeImage(file);

        // Get upload URL
        const postUrl = await generateUploadUrl();

        // Upload to storage
        const result = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': resized.type },
          body: resized,
        });
        const { storageId } = await result.json();

        // Save to database
        await processAndStoreImage({ storageId });
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl, processAndStoreImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      void onDrop(acceptedFiles);
    },
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative rounded-xl overflow-hidden transition-all duration-200
          ${isDragActive ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        `}
      >
        <input {...getInputProps()} />
        <div
          className={`
          p-8 text-center border-2 border-dashed rounded-xl
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}
        `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-500"></div>
              <p className="text-gray-600 font-medium">Uploading your image...</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-purple-600 font-medium">Drop your image here</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Drag & drop your image here</p>
                <p className="text-gray-400 text-sm">or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate dimensions
      const maxSize = 800;
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      // Make it square
      const size = Math.min(width, height);
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate cropping
      const offsetX = (width - size) / 2;
      const offsetY = (height - size) / 2;

      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not create blob'));
          return;
        }
        resolve(blob);
      }, file.type);
    };
    img.onerror = () => reject(new Error('Could not load image'));
  });
}
