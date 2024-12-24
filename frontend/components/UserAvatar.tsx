import Image from "next/image";
import { cn } from "@/lib/utils";
import image from "../public/icons/image.png";
import { CldImage, CloudinaryUploadWidgetInfo } from "next-cloudinary";

interface UserAvatarProps {
  avatarurl: string | CloudinaryUploadWidgetInfo | null;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarurl,
  size,
  className,
}: UserAvatarProps) {
  return (
    // <Image
    //   src={avatarurl || image}
    //   alt="avatar"
    //   width={size || 48}
    //   height={size || 48}
    //   className={cn(
    //     "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
    //     className
    //   )}
    // />
    <CldImage
      src={
        "https://res.cloudinary.com/dnvhhx04c/image/upload/v1734993018/avatars/sqv59ml3ubw4doaybkme.jpg"
      }
      width={size || 48}
      height={size || 48}
      crop="fill"
      alt="avatar"
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
    />
  );
}
