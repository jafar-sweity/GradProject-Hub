import Image from "next/image";
import { cn } from "@/lib/utils";
import image from "../public/icons/image.png";

interface UserAvatarProps {
  avatarurl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarurl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarurl || image}
      alt="avatar"
      width={size || 48}
      height={size || 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
    />
  );
}
