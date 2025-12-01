
import React, { useState } from 'react';
import { PulseItem } from '../types';
import { 
  BadgeCheck, 
  MoreHorizontal, 
  MessageCircle, 
  Repeat, 
  Heart, 
  BarChart2, 
  Bookmark, 
  Share,
  ArrowRight,
  Search,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PulseCardProps {
  item: PulseItem;
  isSaved?: boolean;
  onToggleSave?: (item: PulseItem) => void;
}

export const PulseCard: React.FC<PulseCardProps> = ({ item, isSaved = false, onToggleSave }) => {
  const [liked, setLiked] = useState(false);

  // Normalize source link
  let targetUrl = item.sourceUrl || '';
  if (targetUrl && !targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
  }
  
  const isFallback = !targetUrl;

  // Smart Fallback
  if (isFallback) {
    targetUrl = `https://www.google.com/search?q=${encodeURIComponent(item.source + " " + item.title + " AI video workflow")}`;
  }

  const domain = isFallback ? 'Google Search' : new URL(targetUrl).hostname;

  // Helper to extract handle/domain logic
  const getSourceDetails = () => {
    const s = item.source?.toLowerCase() || "";
    if (s.includes('youtube')) return { name: 'YouTube Creators', handle: '@ytcreators', initial: 'Y', color: 'bg-red-500' };
    if (s.includes('x') || s.includes('twitter')) return { name: 'X Updates', handle: '@x_daily', initial: 'X', color: 'bg-black' };
    if (s.includes('reddit')) return { name: 'Reddit AI', handle: '@reddit_ai', initial: 'R', color: 'bg-orange-500' };
    
    // Default dynamic
    const name = item.source ? item.source.split('-')[0].trim() : 'Source';
    const handle = `@${name.replace(/\s/g, '').toLowerCase()}`;
    return { name, handle, initial: name[0], color: 'bg-blue-400' };
  };
  
  const sourceInfo = getSourceDetails();
  
  // Random stats simulation for "authentic" feel
  const replyCount = React.useMemo(() => Math.floor(Math.random() * 50) + 2, []);
  const repostCount = React.useMemo(() => Math.floor(Math.random() * 20) + 1, []);
  const likeCount = React.useMemo(() => Math.floor(Math.random() * 500) + 50, []);
  const viewCount = React.useMemo(() => (Math.random() * 10 + 1).toFixed(1) + 'K', []);

  // Relative time simulation (based on date)
  const getTimeString = () => {
    const d = new Date(item.date);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - d.getTime()) / 36e5;
    if (diffHours < 24) return `${Math.floor(diffHours)}h`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Helper: Get YouTube Thumbnail if valid ID exists
  const getYouTubeThumbnail = (url: string) => {
    if (!url || url.includes('google.com/search')) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` : null;
  };

  const displayImage = item.imageUrl || getYouTubeThumbnail(targetUrl);

  // Workflow Visualization Logic
  const renderInfographicContent = () => {
    const text = item.actionable || item.title;
    // Split by arrows ->, =>, >, or "->"
    const arrowRegex = /\s*(?:->|=>|→|>)\s*/;
    
    // Check if it looks like a workflow (at least 2 steps)
    const isWorkflow = arrowRegex.test(text) && text.split(arrowRegex).length >= 2;

    if (isWorkflow) {
      const steps = text.split(arrowRegex).filter(s => s.trim().length > 0);
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 w-full px-4">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white border border-blue-200 shadow-sm text-[#0f1419] font-bold px-3 py-2 rounded-lg text-sm md:text-base text-center transform transition-transform hover:scale-105">
                {step.trim()}
              </div>
              {idx < steps.length - 1 && (
                 <ArrowRight className="w-5 h-5 text-blue-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
          <div className="w-full text-center mt-3">
            <span className="inline-block px-3 py-1 bg-blue-100/50 rounded-full border border-blue-200 text-[11px] font-bold text-blue-600 uppercase tracking-wide">
              Pipeline
            </span>
          </div>
        </div>
      );
    }

    // Default "Headline" style for non-workflows
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
         <div className="bg-white/40 backdrop-blur-sm border border-white/60 p-6 rounded-2xl shadow-sm">
            <p className="text-xl md:text-2xl font-black text-[#0f1419] leading-tight drop-shadow-sm">
              {text}
            </p>
         </div>
         <div className="mt-4 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full border border-white/50 text-xs font-semibold text-[#536471] shadow-sm">
            Key Insight
         </div>
      </div>
    );
  };

  return (
    <article className="border-b border-[#eff3f4] hover:bg-gray-50/50 transition-colors cursor-pointer px-4 py-3">
      <div className="flex gap-3">
        {/* Left: Avatar */}
        <div className="shrink-0">
          <div className={`w-10 h-10 rounded-full ${sourceInfo.color} flex items-center justify-center text-white font-bold text-lg select-none`}>
            {sourceInfo.initial}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1 overflow-hidden text-[15px]">
              <span className="font-bold text-[#0f1419] truncate leading-5 hover:underline decoration-1">
                {sourceInfo.name}
              </span>
              <BadgeCheck className="w-[18px] h-[18px] text-[#1d9bf0] fill-current" />
              <span className="text-[#536471] truncate ml-0.5">
                {sourceInfo.handle}
              </span>
              <span className="text-[#536471] px-1">·</span>
              <span className="text-[#536471] hover:underline decoration-1">
                {getTimeString()}
              </span>
            </div>
            <button className="text-[#536471] hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 -mr-2 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Body Text */}
          <div className="text-[#0f1419] text-[15px] leading-6 whitespace-pre-wrap mb-3">
             <span className="font-medium block mb-1">{item.title}</span>
            <ReactMarkdown 
              components={{
                a: ({node, ...props}) => <span className="text-[#1d9bf0] hover:underline cursor-pointer" {...props} />,
                p: ({node, ...props}) => <p className="" {...props} />
              }}
            >
              {item.content}
            </ReactMarkdown>
          </div>

          {/* Large Media/Link Card */}
          <a 
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 mb-1 rounded-2xl border border-[#cfd9de] overflow-hidden hover:opacity-95 transition-opacity group/card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Preview Area */}
            {displayImage ? (
               <div className="aspect-[1.91/1] w-full bg-slate-100 relative">
                  <img 
                    src={displayImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 -z-10 opacity-5 bg-[radial-gradient(#1d9bf0_1px,transparent_1px)] [background-size:16px_16px]"></div>
               </div>
            ) : (
               // Infographic Fallback
               <div className="aspect-[1.91/1] w-full relative flex flex-col items-center justify-center border-b border-[#cfd9de] bg-gradient-to-br from-sky-50 to-blue-50">
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#1d9bf0_2px,transparent_2px)] [background-size:20px_20px]"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    {renderInfographicContent()}
                  </div>
               </div>
            )}

            {/* Link Metadata Strip */}
            <div className="p-3 bg-white border-t border-[#cfd9de]">
               <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[#536471] text-[15px] truncate flex-1">{domain}</span>
                  {isFallback ? (
                    <Search className="w-4 h-4 text-[#536471]" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-[#536471]" />
                  )}
               </div>
               <div className="text-[#0f1419] text-[15px] truncate leading-5">
                  {item.title}
               </div>
            </div>
          </a>

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-3 max-w-[425px]">
            {/* Reply */}
            <button className="flex items-center group -ml-2">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 text-[#536471] group-hover:text-[#1d9bf0] transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs text-[#536471] group-hover:text-[#1d9bf0] transition-colors">
                {replyCount}
              </span>
            </button>

            {/* Repost */}
            <button className="flex items-center group">
              <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 text-[#536471] group-hover:text-[#00ba7c] transition-colors">
                <Repeat className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs text-[#536471] group-hover:text-[#00ba7c] transition-colors">
                {repostCount}
              </span>
            </button>

            {/* Like */}
            <button 
              className="flex items-center group"
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
            >
              <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 text-[#536471] group-hover:text-[#f91880] transition-colors">
                <Heart className={`w-[18px] h-[18px] ${liked ? 'fill-[#f91880] text-[#f91880]' : ''}`} />
              </div>
              <span className={`text-xs transition-colors ${liked ? 'text-[#f91880]' : 'text-[#536471] group-hover:text-[#f91880]'}`}>
                {liked ? likeCount + 1 : likeCount}
              </span>
            </button>

            {/* Views */}
            <button className="flex items-center group">
              <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 text-[#536471] group-hover:text-[#1d9bf0] transition-colors">
                <BarChart2 className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs text-[#536471] group-hover:text-[#1d9bf0] transition-colors">
                {viewCount}
              </span>
            </button>

            {/* Bookmark & Share Group */}
            <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(onToggleSave) onToggleSave(item);
                  }}
                  className="group"
                >
                  <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 text-[#536471] group-hover:text-[#1d9bf0] transition-colors">
                    <Bookmark className={`w-[18px] h-[18px] ${isSaved ? 'fill-[#1d9bf0] text-[#1d9bf0]' : ''}`} />
                  </div>
                </button>
                <button className="group">
                  <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 text-[#536471] group-hover:text-[#1d9bf0] transition-colors">
                    <Share className="w-[18px] h-[18px]" />
                  </div>
                </button>
            </div>

          </div>
        </div>
      </div>
    </article>
  );
};
