
import React from 'react';
import { Category } from '../types';
import { CATEGORY_CONFIG, CATEGORY_ORDER } from '../constants';

interface FilterBarProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ selectedCategory, onSelectCategory }) => {
  
  return (
    <div className="w-full overflow-x-auto hide-scrollbar border-b border-slate-800 bg-slate-950/50 backdrop-blur-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex gap-2 min-w-max">
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm border ${
            selectedCategory === 'All'
              ? 'bg-slate-100 text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          All Updates
        </button>
        
        {CATEGORY_ORDER.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isSelected = selectedCategory === cat;
          const Icon = config.icon;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm border ${
                isSelected
                  ? `${config.bgColor} ${config.color} ${config.borderColor} shadow-[0_0_10px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10`
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-current' : 'text-slate-500'}`} />
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
