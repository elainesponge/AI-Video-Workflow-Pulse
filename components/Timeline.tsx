
import React from 'react';
import { Calendar } from 'lucide-react';

interface TimelineProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ selectedDate, onSelectDate }) => {
  // Generate last 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });

  return (
    <div className="w-full border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-2 text-slate-500 pr-4 border-r border-slate-800 shrink-0">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline</span>
            </div>
            {dates.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
                <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center px-4 py-1.5 rounded-lg transition-all min-w-[80px] border ${
                    isSelected 
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900'
                }`}
                >
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                    {isToday ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : ''}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                </button>
            );
            })}
        </div>
      </div>
    </div>
  );
};
