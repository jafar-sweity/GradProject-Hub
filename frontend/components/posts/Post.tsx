import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { PostMoreButton } from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import LikeButton from "./LikeButton";
import { fa, tr } from "@faker-js/faker";
import { MessageSquare } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import Comments from "../comments/Comments";
import Lightbox from "./Lightbox"; // Import the Lightbox component

interface PostProps {
  post: {
    id: any;
    bookmarks: any;
    post_id: string;
    user_id: string;
    content: string;
    likes: number;
    username: string;
    avatarurl: string;
    createdAt: Date;
    isLikedByUser: boolean;
    isBookmarkedByUser: boolean;
    comments: number;
    photoUrls?: string[]; // Add this field for media (photos)
  };
}

export default function Post({ post }: PostProps) {
  const { user } = useAuth();
  const createdAtDate = new Date(post.createdAt);

  const [showComments, setShowComments] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const handleViewAllPhotos = () => {
    setShowAllPhotos(true);
  };
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Function to handle photo click (open lightbox)
  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const renderPhotos = () => {
    if (!post.photoUrls || post.photoUrls.length === 0) return null;

    const photoCount = post.photoUrls.length;

    switch (photoCount) {
      case 1:
        return (
          <div className="relative h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={post.photoUrls[0]}
              alt="Post media"
              fill
              className="object-cover cursor-pointer"
              onClick={() => handlePhotoClick(0)}
            />
          </div>
        );

      case 2:
        return (
          <div className="grid h-96 grid-cols-2 gap-2">
            {post.photoUrls.map((url, index) => (
              <div key={url} className="relative overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`Post media ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer"
                  onClick={() => handlePhotoClick(index)}
                />
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="grid h-96 grid-cols-2 gap-2">
            <div className="relative row-span-2 overflow-hidden rounded-lg">
              <Image
                src={post.photoUrls[0]}
                alt="Post media 1"
                fill
                className="object-cover cursor-pointer"
                onClick={() => handlePhotoClick(0)}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={post.photoUrls[1]}
                alt="Post media 2"
                fill
                className="object-cover cursor-pointer"
                onClick={() => handlePhotoClick(1)}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={post.photoUrls[2]}
                alt="Post media 3"
                fill
                className="object-cover cursor-pointer"
                onClick={() => handlePhotoClick(2)}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="grid h-96 grid-cols-2 gap-2">
            <div className="relative row-span-2 overflow-hidden rounded-lg">
              <Image
                src={post.photoUrls[0]}
                alt="Post media 1"
                fill
                className="object-cover cursor-pointer"
                onClick={() => handlePhotoClick(0)}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={post.photoUrls[1]}
                alt="Post media 2"
                fill
                className="object-cover cursor-pointer"
                onClick={() => handlePhotoClick(1)}
              />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={post.photoUrls[2]}
                alt="Post media 3"
                fill
                className="object-cover cursor-pointer"
                onClick={() => handlePhotoClick(2)}
              />
              {photoCount > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-2xl font-bold text-white">
                    +{photoCount - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between  gap-3">
        <div className="flex  gap-3">
          <div className="flex flex-wrap gap-3">
            <UserTooltip username={post.username}>
              <Link href={`/users/${post.username}`}>
                <UserAvatar
                  avatarurl={post.avatarurl}
                  // avatarurl= {post.user.avatarurl}
                />
              </Link>
            </UserTooltip>
          </div>
          <div>
            <Link
              href={`/users/${post.username}`}
              className="block font-medium hover:underline"
            >
              {/* {post.user.displayName} */}
              {post.username}
            </Link>
            <Link
              // href={`/posts/${post.id}`}
              href={`/posts/${post.post_id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {/* {formatRelativeDate(post.createdAt)} */}
              {formatRelativeDate(createdAtDate)}
            </Link>
          </div>
        </div>
        {post.user_id === user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {/* Post Media (Photos) */}
      {post.photoUrls && post.photoUrls.length > 0 && (
        <div className="space-y-2">{renderPhotos()}</div>
      )}
      {lightboxOpen && post.photoUrls && (
        <Lightbox
          isOpen={lightboxOpen}
          onRequestClose={closeLightbox}
          imageUrls={post.photoUrls}
          currentIndex={lightboxIndex}
          onNavigate={(direction) => {
            setLightboxIndex((prevIndex) => {
              if (direction === "next") {
                return Math.min(prevIndex + 1, post.photoUrls ? post.photoUrls.length - 1 : 0);
              }
              if (direction === "prev") {
                return Math.max(prevIndex - 1, 0);
              }
              return prevIndex;
            });
          }}
        />
      )}

      {/* Lightbox for Full-Screen Photos */}

      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.post_id}
            initialState={{
              likes: post.likes,
              isLikedByUser: post.isLikedByUser,
            }}
          />
          {/*  want to print it in screen  showComments :  */}

          <CommentButton
            post={post}
            onClick={() => {
              setShowComments(!showComments);
            }}
          />
        </div>
        <BookmarkButton
          postId={post.post_id}
          initialState={{
            isBookmarkedByUser: post.isBookmarkedByUser,
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}
interface commentProps {
  post: {
    id: any;
    bookmarks: any;
    post_id: string;
    user_id: string;
    content: string;
    likes: number;
    username: string;
    avatarurl: string;
    createdAt: Date;
    isLikedByUser: boolean;
    isBookmarkedByUser: boolean;
    comments: number;
  };
  onClick: () => void;
}

function CommentButton({ post, onClick }: commentProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post.comments} <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
