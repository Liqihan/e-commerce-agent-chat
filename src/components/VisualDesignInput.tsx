import React, { useRef, useEffect, useState } from "react";
import { X, Send, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { ImageItem } from "../App";

interface VisualDesignInputProps {
  action: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  selectedImages?: ImageItem[];
  onSelectionChange?: (images: ImageItem[]) => void;
}

export function VisualDesignInput({ action, onSubmit, onCancel, selectedImages = [], onSelectionChange }: VisualDesignInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProductPopover, setShowProductPopover] = useState(false);
  // Remove local state: const [selectedProducts, setSelectedProducts] = useState<typeof mockProducts>([]);

  // Mock products
  const mockProducts = [
    { id: "p1", img: "https://picsum.photos/seed/p1/100/100", name: "梓晨新款透明桌布餐桌茶几台面保护垫免洗防水防油防烫进口母婴级" },
    { id: "p2", img: "https://picsum.photos/seed/p2/100/100", name: "【AI提效手册】豆包即梦剪映飞书扣子5合1实操指南 从入门到精通" },
    { id: "p3", img: "https://picsum.photos/seed/p3/100/100", name: "梓晨四季通用雪尼尔沙发垫轻奢高级感高档防滑坐垫直排沙发套罩巾" },
    { id: "p4", img: "https://picsum.photos/seed/p4/100/100", name: "ins风简约现代纯色棉麻抱枕套不含芯客厅沙发靠垫办公室腰靠背" },
    { id: "p5", img: "https://picsum.photos/seed/p5/100/100", name: "北欧轻奢高档大气花瓶摆件客厅插花干花鲜花玻璃透明水养装饰品" },
  ];

  // Determine initial HTML based on action
  const getInitialHtml = () => {
    const inputChip = (placeholder: string) => `<span class="chip-input" contenteditable="true">${placeholder}</span>`;

    switch (action) {
      case 'main_image_gen':
        return ``;
      case 'search_main_image_gen':
        return `<div>搜索参考图并生成主图，关键词：${inputChip("输入搜索关键词")}</div>`;
      case 'detail_page_gen':
        return `<div>请设计 <b>详情页</b>，重点展示：${inputChip("输入核心卖点/参数")}</div>`;
      case 'buyer_show_gen':
        return `<div>请生成 <b>买家秀</b> 图片，场景：${inputChip("输入使用场景/佩戴效果")}</div>`;
      default:
        return `<div>请进行视觉设计，要求：${inputChip("输入设计要求")}</div>`;
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = getInitialHtml();
    }
  }, [action]);

  const handleToggleProduct = (product: typeof mockProducts[0]) => {
    if (!onSelectionChange) return;
    
    const exists = selectedImages.find(p => p.id === product.id);
    if (exists) {
      onSelectionChange(selectedImages.filter(p => p.id !== product.id));
    } else {
      if (selectedImages.length >= 3) {
        alert("最多只能选择3个商品/图片");
        return;
      }
      onSelectionChange([...selectedImages, { id: product.id, url: product.img, name: product.name }]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    if (onSelectionChange) {
      onSelectionChange(selectedImages.filter(p => p.id !== productId));
    }
  };

  const handleSubmit = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerText;
    onSubmit({ 
      action, 
      prompt: content,
      images: selectedImages 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-3 bg-white relative"
    >
      <style>{`
        .chip-input {
          background-color: #F0F1FF;
          color: #4338ca;
          padding: 2px 8px;
          border-radius: 6px;
          margin: 0 4px;
          font-size: 13px;
          display: inline-block;
          min-width: 60px;
          border: 1px solid transparent;
        }
        .chip-input:focus {
          outline: none;
          border-color: #6366f1;
          background-color: #fff;
        }
      `}</style>

      {/* Selected Images Area */}
      {selectedImages.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {selectedImages.map(p => (
            <div key={p.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-2 py-1 max-w-[160px]">
              <img src={p.url} alt={p.name} className="w-5 h-5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
              <span className="text-xs text-slate-600 truncate flex-1">{p.name}</span>
              <button 
                onClick={() => handleRemoveProduct(p.id)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div 
        ref={editorRef}
        contentEditable
        placeholder="输入创作内容..."
        className="w-full min-h-[80px] outline-none text-sm text-slate-700 whitespace-pre-wrap empty:before:content-[attr(placeholder)] empty:before:text-slate-400"
        suppressContentEditableWarning
      />

      <div className="flex justify-between items-center pt-2 relative">
        {/* Add Product Button */}
        <div className="relative">
          <button
            onClick={() => setShowProductPopover(!showProductPopover)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>商品 {selectedImages.length > 0 && `(${selectedImages.length}/3)`}</span>
          </button>

          {/* Product Popover */}
          <AnimatePresence>
            {showProductPopover && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 w-[320px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20"
              >
                <div className="p-3 border-b border-slate-50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="输入名称或链接，围绕商品创作"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="p-2 bg-slate-50/50">
                  <div className="flex justify-between items-center px-2 pb-1">
                    <div className="text-[10px] text-slate-500">商品</div>
                    <div className="text-[10px] text-slate-400">{selectedImages.length}/3</div>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {mockProducts.map((p) => {
                      const isSelected = selectedImages.some(sp => sp.id === p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleToggleProduct(p)}
                          className={`w-full flex items-start gap-3 p-2 rounded-lg transition-colors text-left group border ${
                            isSelected 
                              ? "bg-indigo-50 border-indigo-200" 
                              : "hover:bg-white border-transparent"
                          }`}
                        >
                          <div className="relative">
                            <img src={p.img} alt={p.name} className="w-10 h-10 rounded object-cover shrink-0 bg-slate-200" referrerPolicy="no-referrer" />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center border border-white">
                                <span className="text-white text-[10px]">✓</span>
                              </div>
                            )}
                          </div>
                          <span className={`text-xs line-clamp-2 transition-colors ${
                            isSelected ? "text-indigo-700 font-medium" : "text-slate-700 group-hover:text-indigo-600"
                          }`}>
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleSubmit}
          className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
        >
          <Send size={16} className="ml-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
