
import React from 'react';
import { ScanSearch } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#eff3f4]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
             {/* X uses rounded logos usually, keeping icon abstract */}
            <ScanSearch className="w-6 h-6 text-[#0f1419]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0f1419] leading-tight">
              AI Workflow Scout
            </h1>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="px-3 py-1 rounded-full bg-transparent text-xs text-[#536471] border border-[#eff3f4] font-medium">
             Gemini 3 Pro
          </span>
        </div>
      </div>
    </header>
  );
};
