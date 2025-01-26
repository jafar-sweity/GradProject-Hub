import React from "react";

interface LightboxProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageUrls: string[];
  currentIndex: number;
  onNavigate: (direction: "next" | "prev") => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onRequestClose,
  imageUrls,
  currentIndex,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <img
          src={imageUrls[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
        >
          Close
        </button>
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
          >
            &#8592; {/* Left Arrow */}
          </button>
        )}
        {currentIndex < imageUrls.length - 1 && (
          <button
            onClick={() => onNavigate("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700"
          >
            &#8594; {/* Right Arrow */}
          </button>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
