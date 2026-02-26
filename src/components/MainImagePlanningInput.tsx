import React, { useRef, useEffect, useState } from "react";
import { X, Send, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MainImagePlanningInputProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function MainImagePlanningInput({ onSubmit, onCancel }: MainImagePlanningInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProductPopover, setShowProductPopover] = useState(false);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Mock products
  const mockProducts = [
    { id: "p1", img: "https://picsum.photos/seed/p1/100/100", name: "梓晨新款透明桌布餐桌茶几台面保护垫免洗防水防油防烫进口母婴级" },
    { id: "p2", img: "https://picsum.photos/seed/p2/100/100", name: "【AI提效手册】豆包即梦剪映飞书扣子5合1实操指南 从入门到精通" },
    { id: "p3", img: "https://picsum.photos/seed/p3/100/100", name: "梓晨四季通用雪尼尔沙发垫轻奢高级感高档防滑坐垫直排沙发套罩巾" },
  ];

  // Initial Template HTML
  const initialHtml = `<div>请根据以下信息为我生成 商品主图 的设计脚本：</div><div class="leading-loose">用户需求表达：<span class="chip-input" contenteditable="true">粘贴报告链接自动解读报告</span> 或 <span class="chip-input" contenteditable="true">输入用户需求/人群/场景</span> ;</div><div class="leading-loose">商品卖点信息：<span class="chip-input" contenteditable="true">输入商品卖点信息</span> ; 商品参考图：<span class="chip-action upload" contenteditable="false">📤 上传商品图片</span> ; 我的主图上 <span class="chip-action select" contenteditable="false">需要 ∨</span> 营销文案</div>`;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, []);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedRange) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    saveSelection();
    const target = e.target as HTMLElement;
    
    // Handle Upload Click
    if (target.closest('.upload')) {
      fileInputRef.current?.click();
    }
    
    // Handle Select Click (Toggle)
    if (target.closest('.select')) {
      const el = target.closest('.select') as HTMLElement;
      if (el.innerText.includes('需要')) {
        el.innerText = '不需要 ∨';
      } else {
        el.innerText = '需要 ∨';
      }
    }
  };

  const handleEditorKeyUp = () => {
    saveSelection();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Find the upload chip and update text
      const uploadChip = editorRef.current?.querySelector('.upload');
      if (uploadChip) {
        uploadChip.innerHTML = `🖼️ ${file.name}`;
        uploadChip.classList.add('text-indigo-600', 'bg-indigo-50');
      }
    }
  };

  const handleInsertProduct = (product: typeof mockProducts[0]) => {
    restoreSelection();
    
    // Create product chip
    const span = document.createElement('span');
    span.className = 'chip-product';
    span.contentEditable = 'false';
    span.innerText = `🛍️ ${product.name.substring(0, 6)}...`;
    span.title = product.name;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
      
      // Move cursor after the inserted node
      range.setStartAfter(span);
      range.setEndAfter(span);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (editorRef.current) {
      // Fallback: append to end if no selection
      editorRef.current.appendChild(span);
    }

    setShowProductPopover(false);
  };

  const handleSubmit = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerText;
    onSubmit({ prompt: content });
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
        .chip-action {
          background-color: #F0F1FF;
          color: #4338ca;
          padding: 2px 8px;
          border-radius: 6px;
          margin: 0 4px;
          font-size: 13px;
          cursor: pointer;
          display: inline-block;
          user-select: none;
        }
        .chip-action:hover {
          background-color: #E0E7FF;
        }
        .chip-product {
          background-color: #FFF1F2;
          color: #BE123C;
          padding: 2px 8px;
          border-radius: 6px;
          margin: 0 4px;
          font-size: 13px;
          display: inline-block;
          user-select: none;
          border: 1px solid #FECDD3;
        }
      `}</style>

      <div 
        ref={editorRef}
        contentEditable
        onClick={handleEditorClick}
        onKeyUp={handleEditorKeyUp}
        className="w-full min-h-[100px] outline-none text-sm text-slate-700 whitespace-pre-wrap"
        suppressContentEditableWarning
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
      />

      <div className="flex justify-between items-center pt-2 relative">
        {/* Add Product Button */}
        <div className="relative">
          <button
            onClick={() => setShowProductPopover(!showProductPopover)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>商品</span>
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
                  <div className="text-[10px] text-slate-500 px-2 pb-1">商品</div>
                  <div className="max-h-[200px] overflow-y-auto space-y-1">
                    {mockProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleInsertProduct(p)}
                        className="w-full flex items-start gap-3 p-2 hover:bg-white rounded-lg transition-colors text-left group"
                      >
                        <img src={p.img} alt={p.name} className="w-10 h-10 rounded object-cover shrink-0 bg-slate-200" referrerPolicy="no-referrer" />
                        <span className="text-xs text-slate-700 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {p.name}
                        </span>
                      </button>
                    ))}
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
