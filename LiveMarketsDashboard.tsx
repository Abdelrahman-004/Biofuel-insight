import * as React from 'react';
import { motion } from 'framer-motion';
import { fetchLiveNews } from './geminiService';

interface Props {
  language: 'English' | 'Arabic';
}

interface Commodity {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'flat';
  category: 'Fossil' | 'Renewable' | 'Carbon' | 'Bio';
}

interface NewsItem {
  en: string;
  ar: string;
  time: string;
  source?: string;
}

const INITIAL_COMMODITIES: Commodity[] = [
  { id: 'brent', nameEn: 'Crude Oil (Brent)', nameAr: 'النفط الخام (برنت)', price: 94.70, unit: 'USD/bbl', change: 1.25, trend: 'up', category: 'Fossil' },
  { id: 'eua', nameEn: 'EU Carbon Permits (EUA)', nameAr: 'تراخيص الكربون الأوروبية', price: 75.00, unit: 'EUR/ton', change: -0.50, trend: 'down', category: 'Carbon' },
  { id: 'h2', nameEn: 'Green Hydrogen (Oman Index)', nameAr: 'الهيدروجين الأخضر (مؤشر عُمان)', price: 4.10, unit: 'USD/kg', change: -0.15, trend: 'down', category: 'Renewable' },
  { id: 'biodiesel', nameEn: 'Biodiesel (FAME 0)', nameAr: 'الديزل الحيوي (FAME 0)', price: 1350.00, unit: 'USD/MT', change: 18.20, trend: 'up', category: 'Bio' },
  { id: 'saf', nameEn: 'Sustainable Aviation Fuel', nameAr: 'وقود الطيران المستدام (SAF)', price: 1950.00, unit: 'USD/MT', change: 25.50, trend: 'up', category: 'Bio' },
  { id: 'solar', nameEn: 'Solar PV LCOE (MENA)', nameAr: 'الطاقة الشمسية (LCOE)', price: 0.018, unit: 'USD/kWh', change: 0.0, trend: 'flat', category: 'Renewable' },
];

const FALLBACK_NEWS: NewsItem[] = [
  { en: "Oman targets 20% renewable energy by 2030, reinforcing 2026 sustainability goals.", ar: "عُمان تستهدف 20% من الطاقة المتجددة بحلول 2030، لتعزيز أهداف الاستدامة لعام 2026.", time: "Today" },
  { en: "New Green Hydrogen plant approved in SEZAD Duqm to accelerate decarbonization.", ar: "الموافقة على محطة جديدة للهيدروجين الأخضر بالدقم لتسريع إزالة الكربون.", time: "Today" },
  { en: "Oman Biofuels Initiative: Local production marks milestone in circular economy.", ar: "مبادرة الوقود الحيوي في عمان: الإنتاج المحلي يمثل علامة فارقة في الاقتصاد الدائري.", time: "Today" }
];

export const LiveMarketsDashboard: React.FC<Props> = ({ language }) => {
  const isArabic = language === 'Arabic';
  const [commodities, setCommodities] = React.useState<Commodity[]>(INITIAL_COMMODITIES);
  const [news, setNews] = React.useState<NewsItem[]>(FALLBACK_NEWS);
  const [loadingNews, setLoadingNews] = React.useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());
  const cachedNewsRef = React.useRef<NewsItem[]>([]);

  React.useEffect(() => {
    // Fetch live news using public RSS to JSON API focusing on high-reliability financial/energy sources
    const loadRealNews = async () => {
      setLoadingNews(true);
      try {
        // Query targets Bloomberg, Reuters, Financial Times, WSJ or specific high-tier sources for Oman Energy
        const query = encodeURIComponent(`"Oman" ("Energy" OR "Hydrogen" OR "Oil" OR "Green") source:reuters OR source:bloomberg OR source:"financial times"`);
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API fetch failed');
        
        const data = await response.json();
        if (data.status === 'ok' && data.items?.length > 0) {
          const liveNews = data.items.slice(0, 8).map((item: any) => {
            const pubDate = new Date(item.pubDate);
            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
            const minutesDifference = Math.round((pubDate.getTime() - new Date().getTime()) / (1000 * 60));
            const hoursDifference = Math.round(minutesDifference / 60);
            const daysDifference = Math.round(hoursDifference / 24);
            
            let timeStr = 'Just now';
            if (minutesDifference < 0 && minutesDifference > -60) timeStr = rtf.format(minutesDifference, 'minute');
            else if (hoursDifference <= 0 && hoursDifference > -24) timeStr = rtf.format(hoursDifference, 'hour');
            else if (daysDifference <= 0) timeStr = rtf.format(daysDifference, 'day');
            
            // Try to extract source from title (e.g. "Title - Reuters")
            let title = item.title;
            let source = 'Reliable Source';
            if (title.lastIndexOf(' - ') > 0) {
                source = title.substring(title.lastIndexOf(' - ') + 3);
                title = title.substring(0, title.lastIndexOf(' - '));
            }

            return {
              en: title,
              ar: title,
              time: timeStr,
              source: source
            };
          });
          setNews(liveNews.slice(0, 5));
          // Store all fetched news to cycle them for a "live" feel
          cachedNewsRef.current = liveNews;
        } else {
           setNews(FALLBACK_NEWS);
        }
      } catch (e) {
        console.error("Failed to fetch live real news from API, using fallback:", e);
        setNews(FALLBACK_NEWS);
      } finally {
        setLoadingNews(false);
      }
    };
    
    // Initial Load
    loadRealNews();
    
    // Auto-refresh data every 5 minutes from API (don't hit rate limits)
    const dataInterval = setInterval(loadRealNews, 5 * 60 * 1000);
    
    // Visual "Live" ticker simulation - cycles through top news rapidly to look alive
    const visualInterval = setInterval(() => {
        if (cachedNewsRef.current && cachedNewsRef.current.length > 5) {
            setNews(prev => {
                const cached = cachedNewsRef.current;
                const currentFirst = prev[0];
                const currentIndex = cached.findIndex(n => n.en === currentFirst?.en);
                const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % (cached.length - 4) : 0;
                return cached.slice(nextIndex, nextIndex + 5);
            });
        }
    }, 15000); // Shift news every 15 seconds for a dynamic terminal feel
    
    return () => {
        clearInterval(dataInterval);
        clearInterval(visualInterval);
    };
  }, []);

  // Simulate live market ticks
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => {
        if (c.id === 'solar') return c; // LCOE doesn't change by the second
        const volatility = c.price * 0.0005; // 0.05% fluctuation
        const changeAmt = (Math.random() * volatility) - (volatility / 2);
        const newPrice = c.price + changeAmt;
        const newTotalChange = c.change + changeAmt;
        return {
          ...c,
          price: Number(newPrice.toFixed(3)),
          change: Number(newTotalChange.toFixed(3)),
          trend: changeAmt > 0 ? 'up' : 'down'
        };
      }));
      setLastUpdated(new Date());
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-slate-200 font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center">
            <i className="fas fa-satellite-dish text-blue-500 mx-3 animate-pulse"></i>
            {isArabic ? 'مؤشرات الأسواق الحية' : 'Live Energy Markets'}
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium px-3">
            {isArabic ? 'بيانات السوق المرجعية المستندة للمؤشرات العالمية والتسعير الإقليمي.' : 'Benchmark market data aggregated from global indices and regional pricing.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center px-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{isArabic ? 'متصل وحي' : 'LIVE SYSTEM'}</span>
          </div>
        </div>
      </div>

      {/* Ticker Tape */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-8 overflow-hidden flex items-center relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent z-10 hidden md:block"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent z-10 hidden md:block"></div>
        <div className="flex space-x-8 animate-[ticker_30s_linear_infinite] whitespace-nowrap rtl:space-x-reverse">
          {commodities.map((c, i) => (
            <div key={`${c.id}-${i}`} className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-xs font-bold text-slate-300">{isArabic ? c.nameAr : c.nameEn}</span>
              <span className="text-xs font-black text-white px-2">{c.price.toFixed(c.price < 1 ? 3 : 2)}</span>
              <span className={`text-[10px] font-bold flex items-center ${c.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <i className={`fas fa-caret-${c.change >= 0 ? 'up' : 'down'} mx-1`}></i>
                {Math.abs(c.change).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left/Main Column: Big Metrics */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {commodities.map(c => (
            <motion.div 
              key={c.id}
              layout
              className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors relative overflow-hidden group flex flex-col items-center justify-center text-center"
            >
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none`}>
                <i className={`fas fa-${c.category === 'Carbon' ? 'leaf text-green-500' : c.category === 'Renewable' ? 'solar-panel text-amber-500' : c.category === 'Bio' ? 'flask text-blue-500' : 'oil-can text-red-500'} text-7xl`}></i>
              </div>
              <div className="z-10 w-full mb-4">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">{c.category}</div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-300 break-words line-clamp-2 min-h-[2.5rem] flex items-center justify-center" title={isArabic ? c.nameAr : c.nameEn}>
                  {isArabic ? c.nameAr : c.nameEn}
                </h3>
              </div>
              
              <div className="z-10 w-full flex flex-col items-center justify-center mt-auto">
                <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 rtl:space-x-reverse mb-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight break-all">
                    {c.price < 1 ? c.price.toFixed(3) : c.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold mt-1 sm:mt-0">{c.unit}</span>
                </div>
                
                <div className="flex items-center justify-center w-full border-t border-slate-800/50 pt-3">
                  <div className={`flex items-center space-x-1 rtl:space-x-reverse ${c.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className="text-[10px] sm:text-xs font-black flex items-center whitespace-nowrap">
                      <i className={`fas fa-arrow-${c.change >= 0 ? 'up' : 'down'} mx-1 text-[8px]`}></i>
                      {Math.abs(c.change).toFixed(2)}
                    </span>
                    <span className="text-[9px] font-bold opacity-80 whitespace-nowrap">
                      ({((Math.abs(c.change) / c.price) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Terminal News */}
        <div className="col-span-1 bg-black/40 border border-slate-800 rounded-2xl p-5 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
            <span>
              <i className="far fa-newspaper text-slate-400 mx-2"></i> {isArabic ? 'أخبار القطاع (عاجل وموثوق)' : 'Live Sector Headlines'}
            </span>
            {loadingNews && <i className="fas fa-spinner fa-spin text-blue-500"></i>}
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {!loadingNews && news.map((item: any, i: number) => (
              <div key={i} className="border-l-2 border-emerald-500 pl-3 rtl:border-l-0 rtl:border-r-2 rtl:pr-3 rtl:pl-0 py-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-1 opacity-80">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 rtl:ml-1.5 animate-pulse"></div>
                    {item.time}
                  </span>
                  {item.source && <span className="text-[9px] text-slate-500 font-black tracking-wider uppercase bg-slate-800 px-1.5 py-0.5 rounded">{item.source}</span>}
                </div>
                <p className="text-xs font-semibold text-slate-200 leading-snug group-hover:text-white transition-colors line-clamp-3">
                  {isArabic ? item.ar : item.en}
                </p>
              </div>
            ))}
            {loadingNews && (
              <div className="flex flex-col space-y-4 h-full pt-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex flex-col space-y-2">
                    <div className="h-2 bg-slate-800 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-center">
         <p className="text-[10px] text-slate-500 font-medium">
           {isArabic ? `آخر تحديث لبيانات السوق: ${lastUpdated.toLocaleTimeString()}` : `Last market sync: ${lastUpdated.toLocaleTimeString()}`}
           <br/>
           {isArabic ? '* الأرقام للنمذجة والعرض فقط. قد تختلف عن العقود الحقيقية الفورية.' : '* Figures are for modeling and demonstration only. Actual spot contracts may vary.'}
         </p>
      </div>
    </div>
  );
};
