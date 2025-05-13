import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { ImageGrid } from "./ImageGrid";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

export function MyPhotos() {
  const images = useQuery(api.images.listMyImages);
  const deleteImage = useMutation(api.images.deleteImage);
  
  if (!images) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleDelete = async (imageId: Id<"images">) => {
    try {
      await deleteImage({ imageId });
      toast.success("Image deleted");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return <ImageGrid images={images} onDelete={handleDelete} />;
}
