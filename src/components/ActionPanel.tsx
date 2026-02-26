import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Zap, 
  Palette, 
  Search, 
  Image as ImageIcon, 
  FileText, 
  Users, 
  MessageCircle, 
  ShoppingBag,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "../lib/utils";

export type CategoryType = "unlimited" | "insight" | "hit_product" | "visual_design";

interface ActionPanelProps {
  onSelectAction: (category: CategoryType, action: string) => void;
  activeCategory?: CategoryType | null;
  activeAction?: string | null;
  className?: string;
  onClose?: () => void;
}

export function ActionPanel({ onSelectAction, activeCategory: propActiveCategory, activeAction, className, onClose }: ActionPanelProps) {
  const [internalActiveCategory, setInternalActiveCategory] = useState<CategoryType | null>(null);
  
  // Sync internal state with prop if provided
  useEffect(() => {
    if (propActiveCategory !== undefined) {
      setInternalActiveCategory(propActiveCategory);
    }
  }, [propActiveCategory]);

  const activeCategory = internalActiveCategory;

  const handleCategoryClick = (categoryId: CategoryType) => {
    if (categoryId === 'unlimited') {
      setInternalActiveCategory('unlimited');
      onSelectAction('unlimited', 'unlimited');
      return;
    }

    if (activeCategory === categoryId) {
      // Already selected, do nothing or toggle? 
      // User wants to hide top layer when selected. 
      // If we click it, it is selected, so top layer hides.
      setInternalActiveCategory(categoryId);
    } else {
      setInternalActiveCategory(categoryId);
    }
  };

  const handleClose = () => {
    setInternalActiveCategory(null);
    if (onClose) onClose();
  };

  const categories = [
    {
      id: "unlimited" as const,
      title: "不限",
      icon: Sparkles,
      actions: []
    },
    {
      id: "insight" as const,
      title: "洞察规划",
      icon: BarChart3,
      actions: [
        { id: "keyword_analysis", label: "关键词分析", icon: Search },
        { id: "category_analysis", label: "类目分析", icon: ShoppingBag },
        { id: "product_analysis", label: "商品分析", icon: FileText },
        { id: "review_analysis", label: "评价分析", icon: MessageCircle },
        { id: "qa_analysis", label: "问大家分析", icon: Users },
      ]
    },
    {
      id: "hit_product" as const,
      title: "爆款打造",
      icon: Zap,
      actions: [
        { id: "search_main_image_planning", label: "搜索主图策划", icon: Search },
        { id: "main_image_planning", label: "主图策划", icon: ImageIcon },
        { id: "detail_page_planning", label: "详情图策划", icon: FileText },
        { id: "buyer_show_planning", label: "买家秀策划", icon: Users },
      ]
    },
    {
      id: "visual_design" as const,
      title: "视觉设计",
      icon: Palette,
      actions: [
        { id: "search_main_image_gen", label: "搜索主图生成", icon: Search },
        { id: "main_image_gen", label: "主图生成", icon: ImageIcon },
        { id: "detail_page_gen", label: "详情图生成", icon: FileText },
        { id: "buyer_show_gen", label: "买家秀生成", icon: Users },
      ]
    }
  ];

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Level 1: Main Categories - Hide when a category is active (except unlimited which resets immediately) */}
      {!activeCategory && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                activeCategory === category.id 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              <category.icon size={14} />
              {category.title}
            </button>
          ))}
        </div>
      )}

      {/* Level 2: Sub Actions + Close Button */}
      <AnimatePresence mode="wait">
        {activeCategory && activeCategory !== 'unlimited' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 pb-1">
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors shrink-0"
                title="返回"
              >
                <X size={12} />
              </button>

              <div className="w-px h-4 bg-slate-200 mx-1 shrink-0" />

              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {categories
                  .find((c) => c.id === activeCategory)
                  ?.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => onSelectAction(activeCategory, action.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all whitespace-nowrap",
                        activeAction === action.id
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200"
                      )}
                    >
                      <action.icon size={14} />
                      {action.label}
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
