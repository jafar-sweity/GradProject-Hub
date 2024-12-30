import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatarurl: string | undefined;
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
      src={avatarurl || "https://via.placeholder.com/150?text=Avatar"}
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
