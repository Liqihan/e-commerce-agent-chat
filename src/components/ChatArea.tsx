import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActionPanel, CategoryType } from "./ActionPanel";
import { TaskForm } from "./TaskForm";
import { MainImagePlanningInput } from "./MainImagePlanningInput";
import { VisualDesignInput } from "./VisualDesignInput";
import { cn } from "../lib/utils";
import { VisualDesignLayout } from "./VisualDesign/VisualDesignLayout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | React.ReactNode;
  timestamp: Date;
}

interface ActiveTask {
  category: string;
  action: string;
}

import { ImageItem } from "../App";

interface ChatAreaProps {
  activeTask: ActiveTask | null;
  onTaskChange: (task: ActiveTask | null) => void;
  className?: string;
  selectedImages?: ImageItem[];
  onSelectionChange?: (images: ImageItem[]) => void;
}

export function ChatArea({ activeTask, onTaskChange, className, selectedImages, onSelectionChange }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我是你的电商智能助手。我可以帮你进行市场洞察、打造爆款商品，或者设计视觉素材。请选择上方的功能开始吧！",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      // Convert messages to API format
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || "抱歉，我无法处理您的请求。";

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，连接服务器时出现错误，请稍后重试。",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTaskSubmit = async (data: any) => {
    // Add user submission to chat
    const submissionMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: (
        <div className="space-y-2">
          <p className="font-medium text-indigo-600">提交任务: {activeTask?.action}</p>
          <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200">
            <pre className="whitespace-pre-wrap font-sans text-slate-600">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ),
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, submissionMessage];
    setMessages(updatedMessages);
    onTaskChange(null);
    setIsTyping(true);

    try {
      // Construct a prompt for the task
      const prompt = `请根据以下任务配置执行${activeTask?.action}：\n${JSON.stringify(data, null, 2)}`;
      
      const apiMessages = [
        ...updatedMessages.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : "用户提交了一个任务表单"
        })),
        { role: "user", content: prompt }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const resData = await response.json();
      const assistantContent = resData.choices?.[0]?.message?.content || "任务处理完成。";

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Task Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，处理任务时出现错误。",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectAction = (category: CategoryType, action: string) => {
    // If action is 'unlimited', clear the active task to show the default chat input
    if (action === 'unlimited') {
      onTaskChange(null);
      setInputValue(""); // Clear any previous input or set a default greeting if needed
    } else {
      onTaskChange({ category, action });
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-white relative", className)}>
      {/* Header */}
      <header className="h-14 border-b border-slate-200 flex items-center px-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-sm">电商智能助手</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500">在线</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-3xl mx-auto",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
              message.role === "user" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-indigo-100"
            )}>
              {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={cn(
              "rounded-2xl px-4 py-3 shadow-sm max-w-[80%] text-sm leading-relaxed",
              message.role === "user" 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
            )}>
              {typeof message.content === 'string' ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                message.content
              )}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-3xl mx-auto"
          >
            <div className="w-8 h-8 rounded-full bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500">思考中...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          
          {/* Action Panel - Always visible */}
          <div className="mb-2">
            <ActionPanel 
              activeCategory={activeTask?.category as CategoryType}
              activeAction={activeTask?.action}
              onSelectAction={handleSelectAction}
              onClose={() => onTaskChange(null)}
            />
          </div>

          {/* Input Container */}
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
            
            {/* Active Task Form (Inside Input Box) */}
            <AnimatePresence mode="wait">
              {activeTask ? (
                <motion.div
                  key="task-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-slate-100"
                >
                  {activeTask.action === 'main_image_planning' ? (
                    <MainImagePlanningInput 
                      onSubmit={handleTaskSubmit}
                      onCancel={() => onTaskChange(null)}
                    />
                  ) : activeTask.category === 'visual_design' ? (
                    <VisualDesignInput
                      action={activeTask.action}
                      onSubmit={handleTaskSubmit}
                      onCancel={() => onTaskChange(null)}
                      selectedImages={selectedImages}
                      onSelectionChange={onSelectionChange}
                    />
                  ) : (
                    <TaskForm 
                      category={activeTask.category}
                      action={activeTask.action}
                      onSubmit={handleTaskSubmit}
                      onCancel={() => onTaskChange(null)}
                    />
                  )}
                </motion.div>
              ) : (
                /* Text Input (Visible when no task is active) */
                <motion.div 
                  key="text-input"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-2 p-2"
                >
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder="输入消息..."
                    className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400"
                    rows={1}
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm mb-1"
                  >
                    <Send size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
