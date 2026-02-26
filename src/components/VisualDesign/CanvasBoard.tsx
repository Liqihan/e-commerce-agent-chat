import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

interface CanvasImageProps {
  imageSrc: string;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}

const CanvasImage = ({ imageSrc, x, y, isSelected, onSelect, onChange }: CanvasImageProps) => {
  const [image] = useImage(imageSrc, 'anonymous');
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        image={image}
        x={x}
        y={y}
        draggable
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface CanvasBoardProps {
  images: Array<{ id: string; src: string; x: number; y: number }>;
  onUpdateImage: (id: string, newAttrs: any) => void;
  selectedImageIds?: string[];
  onImageClick?: (id: string) => void;
  onBackgroundClick?: () => void;
}

export function CanvasBoard({ images, onUpdateImage, selectedImageIds = [], onImageClick, onBackgroundClick }: CanvasBoardProps) {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);
    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  return (
    <div className="w-full h-full bg-slate-100 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-slate-500 pointer-events-none border border-slate-200">
        Infinite Canvas (Scroll to Zoom, Drag to Pan)
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            if (onBackgroundClick) onBackgroundClick();
          }
        }}
        draggable
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
        onWheel={handleWheel}
        onDragEnd={(e) => {
            // Update stage position state only if dragging stage (not shapes)
            if (e.target === e.target.getStage()) {
                setStagePos({
                    x: e.target.x(),
                    y: e.target.y()
                });
            }
        }}
      >
        <Layer>
          {images.map((img, i) => (
            <CanvasImage
              key={img.id}
              imageSrc={img.src}
              x={img.x}
              y={img.y}
              isSelected={selectedImageIds.includes(img.id)}
              onSelect={() => {
                if (onImageClick) onImageClick(img.id);
              }}
              onChange={(newAttrs) => onUpdateImage(img.id, newAttrs)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
