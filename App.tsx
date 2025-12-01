
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PulseCard } from './components/PulseCard';
import { generateLibraryFeed } from './services/geminiService';
import { PulseItem } from './types';
import { RefreshCw, AlertCircle, Bookmark } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'foryou' | 'bookmarks'>('foryou');
  
  // Initialize saved items from localStorage
  const [savedItems, setSavedItems] = useState<PulseItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai-workflow-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const getSearchRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30); // 30 Day Range
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return {
      start: start.toLocaleDateString('en-US', options),
      end: end.toLocaleDateString('en-US', options)
    };
  };

  const [range, setRange] = useState(getSearchRange());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRange(getSearchRange());
    
    // Only clear items if we are actually refetching logic for 'foryou'
    // but here strictly fetching fresh content
    try {
      const feed = await generateLibraryFeed();
      if (feed.length === 0) {
        throw new Error("No data returned from AI service.");
      }
      setItems(feed);
    } catch (err) {
      setError("Failed to generate library feed. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Persist bookmarks whenever they change
  useEffect(() => {
    localStorage.setItem('ai-workflow-bookmarks', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleToggleSave = (item: PulseItem) => {
    setSavedItems(prev => {
      const isAlreadySaved = prev.some(saved => saved.id === item.id);
      if (isAlreadySaved) {
        return prev.filter(saved => saved.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const isItemSaved = (id: string) => savedItems.some(item => item.id === id);

  // Filter logic based on tab
  const displayedItems = activeTab === 'foryou' ? items : savedItems;

  return (
    <div className="min-h-screen bg-white text-[#0f1419] font-sans">
      <Header />
      
      <main className="flex justify-center">
        {/* Main Feed Column */}
        <div className="w-full max-w-[600px] border-x border-[#eff3f4] min-h-screen flex flex-col">
          
          {/* Tab Bar (Sticky) */}
          <div className="sticky top-14 z-40 bg-white/85 backdrop-blur-md border-b border-[#eff3f4]">
            <div className="flex w-full">
              <button 
                onClick={() => setActiveTab('foryou')}
                className="flex-1 hover:bg-[#eff3f4] transition-colors relative py-4"
              >
                <div className="flex flex-col items-center">
                   <span className={`font-bold text-[15px] ${activeTab === 'foryou' ? 'text-[#0f1419]' : 'text-[#536471]'}`}>
                     For You
                   </span>
                   {activeTab === 'foryou' && (
                     <div className="absolute bottom-0 h-1 w-14 bg-[#1d9bf0] rounded-full"></div>
                   )}
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('bookmarks')}
                className="flex-1 hover:bg-[#eff3f4] transition-colors relative py-4"
              >
                <div className="flex flex-col items-center">
                   <span className={`font-bold text-[15px] ${activeTab === 'bookmarks' ? 'text-[#0f1419]' : 'text-[#536471]'}`}>
                     Bookmarks
                   </span>
                   {activeTab === 'bookmarks' && (
                     <div className="absolute bottom-0 h-20 w-20 bg-[#1d9bf0] rounded-full opacity-0"></div> 
                   )}
                   {activeTab === 'bookmarks' && (
                     <div className="absolute bottom-0 h-1 w-20 bg-[#1d9bf0] rounded-full"></div>
                   )}
                </div>
              </button>
            </div>
            
            {/* Info Subheader */}
            {activeTab === 'foryou' && (
              <div className="px-4 py-3 border-b border-[#eff3f4] flex justify-between items-center bg-white">
                <p className="text-[13px] text-[#536471]">
                   Scanning {range.start} - {range.end} on X, Reddit, YouTube
                </p>
                <button 
                  onClick={() => fetchData()}
                  disabled={loading} 
                  className="p-2 rounded-full hover:bg-[#1d9bf0]/10 transition-colors disabled:opacity-50 group"
                  title="Refresh Feed"
                >
                  <RefreshCw className={`w-4 h-4 text-[#1d9bf0] ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && activeTab === 'foryou' && (
            <div className="p-4 m-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && activeTab === 'foryou' && (
            <div className="divide-y divide-[#eff3f4]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex gap-3 animate-pulse">
                   <div className="w-10 h-10 rounded-full bg-gray-100" />
                   <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/3 bg-gray-100 rounded" />
                      <div className="h-4 w-full bg-gray-100 rounded" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded" />
                      <div className="h-48 w-full bg-gray-100 rounded-2xl mt-2" />
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty States */}
          {!loading && activeTab === 'foryou' && displayedItems.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-[#536471]">No workflows found right now.</p>
              <button onClick={() => fetchData()} className="mt-2 text-[#1d9bf0] font-bold hover:underline">
                Retry
              </button>
            </div>
          )}

          {activeTab === 'bookmarks' && displayedItems.length === 0 && (
            <div className="text-center py-20 px-10">
              <div className="mx-auto w-12 h-12 mb-4 text-[#536471]">
                 <Bookmark className="w-full h-full" />
              </div>
              <h2 className="text-xl font-bold mb-2">Save workflows for later</h2>
              <p className="text-[#536471]">
                Don’t let the good ones fly away! Bookmark workflows to easily find them again in the future.
              </p>
            </div>
          )}

          {/* Feed Items */}
          {displayedItems.length > 0 && (
            <div>
              {displayedItems.map((item) => (
                <PulseCard 
                  key={item.id} 
                  item={item} 
                  isSaved={isItemSaved(item.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
              
              <div className="p-8 text-center text-[#536471] text-sm">
                {activeTab === 'foryou' ? 'End of feed' : 'End of bookmarks'}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
