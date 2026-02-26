import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { VisualDesignLayout } from "./components/VisualDesign/VisualDesignLayout";
import { cn } from "./lib/utils";

interface ActiveTask {
  category: string;
  action: string;
}

export interface ImageItem {
  id: string;
  url: string;
  name: string;
}

export default function App() {
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);

  const isVisualDesignMode = activeTask?.category === "visual_design";

  const handleSelectionChange = (images: ImageItem[]) => {
    setSelectedImages(images);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar className="hidden md:flex shrink-0" />
      <main className="flex-1 flex h-full relative overflow-hidden">
        {/* Chat Area - Shrinks when in visual design mode */}
        <div 
          className={cn(
            "flex flex-col h-full transition-all duration-300 ease-in-out border-r border-slate-200",
            isVisualDesignMode ? "w-[450px]" : "w-full"
          )}
        >
          <ChatArea 
            activeTask={activeTask} 
            onTaskChange={setActiveTask}
            className="h-full"
            selectedImages={selectedImages}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {/* Visual Design Canvas - Appears on the right */}
        {isVisualDesignMode && (
          <div className="flex-1 h-full bg-slate-100 animate-in fade-in slide-in-from-right-4 duration-300">
            <VisualDesignLayout 
              selectedImages={selectedImages}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}
