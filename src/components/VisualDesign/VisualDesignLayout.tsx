import React, { useState } from "react";
import { CanvasBoard } from "./CanvasBoard";
import { ImageItem } from "../../App";

interface VisualDesignLayoutProps {
  selectedImages?: ImageItem[];
  onSelectionChange?: (images: ImageItem[]) => void;
}

export function VisualDesignLayout({ selectedImages = [], onSelectionChange }: VisualDesignLayoutProps) {
  const [canvasImages, setCanvasImages] = useState<Array<{ id: string; src: string; x: number; y: number }>>([
    { id: "img1", src: "https://picsum.photos/seed/fashion1/300/400", x: 100, y: 100 },
    { id: "img2", src: "https://picsum.photos/seed/product2/300/300", x: 450, y: 150 },
    { id: "img3", src: "https://picsum.photos/seed/shoes3/300/400", x: 200, y: 550 },
  ]);

  const handleUpdateImage = (id: string, newAttrs: any) => {
    setCanvasImages(canvasImages.map(img => img.id === id ? { ...img, ...newAttrs } : img));
  };

  const handleImageClick = (id: string) => {
    if (!onSelectionChange) return;

    const clickedImage = canvasImages.find(img => img.id === id);
    if (!clickedImage) return;

    const isSelected = selectedImages.some(img => img.id === id);

    if (isSelected) {
      onSelectionChange(selectedImages.filter(img => img.id !== id));
    } else {
      if (selectedImages.length >= 3) {
        alert("最多只能选择3个商品/图片");
        return;
      }
      onSelectionChange([...selectedImages, { id: clickedImage.id, url: clickedImage.src, name: `图片 ${clickedImage.id}` }]);
    }
  };

  const handleBackgroundClick = () => {
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Infinite Canvas */}
        <div className="flex-1 relative bg-slate-100">
          <CanvasBoard 
            images={canvasImages} 
            onUpdateImage={handleUpdateImage} 
            selectedImageIds={selectedImages.map(img => img.id)}
            onImageClick={handleImageClick}
            onBackgroundClick={handleBackgroundClick}
          />
          
          {/* Floating Input for AI Generation (Simulated) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <div className="bg-white/90 backdrop-blur shadow-lg rounded-xl p-2 border border-slate-200 flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="描述你想生成的画面..." 
                className="flex-1 bg-transparent border-none outline-none text-sm px-2"
              />
              <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                生成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
