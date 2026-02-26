import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, X, ArrowRight, Link as LinkIcon, FileText, Image as ImageIcon, Send, Sparkles, Info, ChevronDown, Plus } from "lucide-react";
import { cn } from "../lib/utils";

interface TaskFormProps {
  category: string;
  action: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function TaskForm({ category, action, onSubmit, onCancel }: TaskFormProps) {
  // State for Planning Form
  const [formData, setFormData] = useState({
    reportLink: "",
    userNeeds: "",
    sellingPoints: "",
    marketingCopy: true
  });

  // State for Generation Form
  const [genData, setGenData] = useState({
    selectedProduct: null as string | null,
    prompt: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action.includes('gen')) {
      onSubmit(genData);
    } else {
      onSubmit(formData);
    }
  };

  // Mock products for selection
  const mockProducts = [
    { id: "p1", img: "https://picsum.photos/seed/p1/100/100", name: "梓晨新款透明桌布餐桌茶几台面保护垫免洗防水防油防烫进口母婴级" },
    { id: "p2", img: "https://picsum.photos/seed/p2/100/100", name: "【AI提效手册】豆包即梦剪映飞书扣子5合1实操指南 从入门到精通" },
    { id: "p3", img: "https://picsum.photos/seed/p3/100/100", name: "梓晨四季通用雪尼尔沙发垫轻奢高级感高档防滑坐垫直排沙发套罩巾" },
  ];

  // Render Generation Form (Visual Design)
  if (action.includes('gen')) {
    const selectedProductDetail = mockProducts.find(p => p.id === genData.selectedProduct);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 relative bg-white"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Header */}
          <div className="flex items-baseline gap-2 pb-1">
            <span className="text-indigo-600 font-semibold text-sm">
              {action === 'main_image_gen' ? '主图生成' : '搜索主图生成'}
            </span>
            <span className="text-slate-700 text-xs">请选择参考商品/图片并输入提示词：</span>
          </div>

          {/* Product Selection Area */}
          {!genData.selectedProduct ? (
            <div className="space-y-2">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入名称或链接，围绕商品创作"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 rounded-lg border border-indigo-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                />
              </div>
              
              {/* Product List */}
              <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-50 text-xs text-slate-500 font-medium">
                  商品
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {mockProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setGenData({...genData, selectedProduct: p.id})}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                    >
                      <img src={p.img} alt={p.name} className="w-10 h-10 rounded object-cover shrink-0 bg-slate-100" referrerPolicy="no-referrer" />
                      <span className="text-sm text-slate-700 line-clamp-2">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Selected Product Chip */}
              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <img 
                  src={selectedProductDetail?.img} 
                  alt={selectedProductDetail?.name} 
                  className="w-10 h-10 rounded object-cover shrink-0 bg-slate-100" 
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm text-slate-700 line-clamp-1 flex-1">{selectedProductDetail?.name}</span>
                <button
                  type="button"
                  onClick={() => setGenData({...genData, selectedProduct: null})}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Prompt Input */}
              <div className="relative">
                <textarea
                  value={genData.prompt}
                  onChange={(e) => setGenData({...genData, prompt: e.target.value})}
                  placeholder="输入创作内容和要求"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2 rounded-lg border border-indigo-100 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm min-h-[80px] resize-none"
                  autoFocus
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                    title="优化提示词"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions (Only show when product is selected to match the flow, or keep visible but disabled) */}
          {genData.selectedProduct && (
            <div className="flex items-center justify-end pt-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-[10px] font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <span className="font-serif italic">S</span>
                  <span>-5</span>
                </div>
                <button
                  type="submit"
                  disabled={!genData.prompt}
                  className="w-8 h-8 bg-slate-400 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-400 text-white rounded-md flex items-center justify-center transition-colors shadow-sm"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    );
  }

  // Generic form for other actions (fallback)
  if (action !== "main_image_planning") {
    return (
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-900">任务配置: {action}</h3>
        </div>
        <div className="p-4 text-center rounded-lg border border-dashed border-indigo-200 bg-slate-50">
          <p className="text-xs text-slate-500">此处将显示 <span className="font-medium text-slate-900">{action}</span> 的配置表单。</p>
          <button 
            onClick={() => onSubmit({ action, generic: true })}
            className="mt-3 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
          >
            开始任务 (演示)
          </button>
        </div>
      </div>
    );
  }

  // Specific form for Main Image Planning (Default)
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#F8F9FE] p-3 relative"
    >
      <button 
        onClick={onCancel} 
        className="absolute top-2 right-2 p-1 hover:bg-indigo-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <X size={14} />
      </button>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Header - Removed as per request to keep it cleaner inside input box, 
            but kept the prompt text as part of the form flow */}
        <div className="flex items-baseline gap-2 pb-1">
          <span className="text-slate-700 text-xs">请根据以下信息为我生成 <span className="text-indigo-600 font-semibold">商品主图</span> 的设计脚本：</span>
        </div>

        {/* Row 1: User Needs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
          <span className="whitespace-nowrap">用户需求表达：</span>
          <span className="text-red-500">*</span>
          
          <div className="relative group flex-1 min-w-[160px]">
            <input
              type="text"
              placeholder="粘贴报告链接自动解读报告"
              value={formData.reportLink}
              onChange={(e) => setFormData({...formData, reportLink: e.target.value})}
              className="w-full bg-[#EBEBFF] text-indigo-900 placeholder:text-indigo-300 px-2.5 py-1 rounded border-none focus:ring-1 focus:ring-indigo-400 text-xs transition-all h-7"
            />
            <Info size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-300" />
          </div>
          
          <span className="text-slate-500 text-[10px]">或</span>
          <span className="text-red-500">*</span>

          <div className="relative flex-1 min-w-[160px]">
            <input
              type="text"
              placeholder="输入用户需求/人群/场景"
              value={formData.userNeeds}
              onChange={(e) => setFormData({...formData, userNeeds: e.target.value})}
              className="w-full bg-[#EBEBFF] text-indigo-900 placeholder:text-indigo-300 px-2.5 py-1 rounded border-none focus:ring-1 focus:ring-indigo-400 text-xs transition-all h-7"
            />
          </div>
          <span>;</span>
        </div>

        {/* Row 2: Selling Points & Image & Marketing Copy */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
          <span className="whitespace-nowrap">商品卖点信息：</span>
          <div className="flex-1 min-w-[140px]">
            <input
              type="text"
              placeholder="输入商品卖点信息"
              value={formData.sellingPoints}
              onChange={(e) => setFormData({...formData, sellingPoints: e.target.value})}
              className="w-full bg-[#EBEBFF] text-indigo-900 placeholder:text-indigo-300 px-2.5 py-1 rounded border-none focus:ring-1 focus:ring-indigo-400 text-xs transition-all h-7"
            />
          </div>
          <span>;</span>

          <span className="whitespace-nowrap ml-1">商品参考图：</span>
          <button type="button" className="flex items-center gap-1 bg-[#EBEBFF] text-indigo-400 px-2.5 py-1 rounded hover:bg-indigo-100 transition-colors h-7">
            <Upload size={12} />
            <span className="text-xs">上传商品图片</span>
            <Info size={12} />
          </button>
          <span>;</span>

          <span className="whitespace-nowrap ml-1">我的主图上</span>
          <span className="text-red-500">*</span>
          <div className="relative">
            <select
              value={formData.marketingCopy ? "need" : "none"}
              onChange={(e) => setFormData({...formData, marketingCopy: e.target.value === "need"})}
              className="appearance-none bg-[#EBEBFF] text-indigo-600 font-medium pl-2.5 pr-6 py-1 rounded border-none focus:ring-1 focus:ring-indigo-400 text-xs cursor-pointer h-7"
            >
              <option value="need">需要</option>
              <option value="none">不需要</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          </div>
          <span>营销文案</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 text-[10px] font-medium text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Plus size={10} />
              <span>添加商品</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              <span className="font-serif italic">S</span>
              <span>-5</span>
            </div>
            <button
              type="submit"
              className="w-7 h-7 bg-slate-400 hover:bg-indigo-600 text-white rounded-md flex items-center justify-center transition-colors shadow-sm"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
