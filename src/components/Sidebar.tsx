import { MessageSquare, Plus, Search, Settings } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const history = [
    { id: 1, title: "夏季连衣裙营销活动", date: "今天" },
    { id: 2, title: "Q3 新品发布会", date: "昨天" },
    { id: 3, title: "竞品分析：耐克", date: "上周" },
    { id: 4, title: "节日季视觉设计", date: "上周" },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-slate-50 border-r border-slate-200 w-64 flex-shrink-0", className)}>
      <div className="p-4 border-b border-slate-200">
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          新建对话
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="搜索历史..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">最近</h3>
          <div className="space-y-1">
            {history.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-white hover:shadow-sm rounded-lg transition-all group"
              >
                <MessageSquare size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="truncate flex-1">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">张三</p>
            <p className="text-xs text-slate-500 truncate">产品经理</p>
          </div>
        </div>
        <button className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors w-full px-2 py-2 rounded-lg hover:bg-slate-100">
          <Settings size={18} />
          <span>设置</span>
        </button>
      </div>
    </div>
  );
}
