import * as React from 'react';
import { motion } from 'framer-motion';
import { LOCATIONS, TECHNOLOGY_CATEGORIES, BIOFUEL_FEEDSTOCKS, translateTerm } from './constants';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
  language: 'English' | 'Arabic';
  theme?: 'dark' | 'light';
}

const ZONES = [
  { id: 'sohar', nameEn: 'Sohar Freezone', nameAr: 'ميناء وصحار الحرة', lat: 24.4601, lng: 56.6111, color: '#10b981', descEn: 'Industrial Synergy & Export', descAr: 'مركز الصناعات الثقيلة والتصدير', isPort: true },
  { id: 'muscat', nameEn: 'Mina Al Sultan Qaboos', nameAr: 'مسقط (ميناء السلطان قابوس)', lat: 23.6262, lng: 58.5645, color: '#3b82f6', descEn: 'Capital Logistical Hub', descAr: 'العاصمة والمركز اللوجستي', isPort: true },
  { id: 'duqm', nameEn: 'SEZAD Duqm', nameAr: 'المنطقة الاقتصادية بالدقم', lat: 19.6437, lng: 57.7027, color: '#f59e0b', descEn: 'Green Hydrogen Capital', descAr: 'عاصمة الهيدروجين الأخضر', isPort: true },
  { id: 'salalah', nameEn: 'Salalah Freezone', nameAr: 'صلالة الحرة', lat: 16.9470, lng: 53.9780, color: '#f43f5e', descEn: 'Global Shipping Lane', descAr: 'بوابة خطوط الشحن العالمية', isPort: true },
  { id: 'nizwa', nameEn: 'Nizwa Industrial City', nameAr: 'مدينة نزوى الصناعية', lat: 22.9333, lng: 57.5333, color: '#8b5cf6', descEn: 'Internal Trade Hub', descAr: 'مركز التجارة الداخلية', isPort: false },
  { id: 'sur', nameEn: 'Sur Industrial City', nameAr: 'مدينة صور الصناعية', lat: 22.5667, lng: 59.5289, color: '#06b6d4', descEn: 'LNG & Fertilizer Export', descAr: 'تصدير الغاز الطبيعي المسال', isPort: true },
  { id: 'buraimi', nameEn: 'Al Buraimi Industrial City', nameAr: 'مدينة البريمي الصناعية', lat: 24.2500, lng: 55.7500, color: '#ec4899', descEn: 'Border Logistical Gateway', descAr: 'بوابة لوجستية حدودية', isPort: false }
];

const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  muscat: { muscat: 0, sohar: 210, nizwa: 160, duqm: 550, salalah: 1000, sur: 200, buraimi: 330 },
  sohar: { muscat: 210, sohar: 0, nizwa: 370, duqm: 740, salalah: 1210, sur: 410, buraimi: 120 },
  nizwa: { muscat: 160, sohar: 370, nizwa: 0, duqm: 390, salalah: 840, sur: 360, buraimi: 490 },
  duqm: { muscat: 550, sohar: 740, nizwa: 390, duqm: 0, salalah: 600, sur: 450, buraimi: 860 },
  salalah: { muscat: 1000, sohar: 1210, nizwa: 840, duqm: 600, salalah: 0, sur: 900, buraimi: 1330 },
  sur: { muscat: 200, sohar: 410, nizwa: 360, duqm: 450, salalah: 900, sur: 0, buraimi: 530 },
  buraimi: { muscat: 330, sohar: 120, nizwa: 490, duqm: 860, salalah: 1330, sur: 530, buraimi: 0 }
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px ${color};
      display: flex;
      justify-content: center;
      align-items: center;
    "><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const GisMap: React.FC<Props> = ({ language, theme = "dark" }) => {
  const isArabic = language === 'Arabic';
  const [source, setSource] = React.useState<string>('sohar');
  const [destination, setDestination] = React.useState<string>('duqm');
  const [feedstock, setFeedstock] = React.useState<string>(BIOFUEL_FEEDSTOCKS[0]);
  const [weight, setWeight] = React.useState<number>(100);
  const [dieselPrice, setDieselPrice] = React.useState<number>(0.250);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  const getDistance = () => DISTANCE_MATRIX[source]?.[destination] || 0;
  
  const getCategory = (name: string) => {
    const categories: Record<string, { id: string, typeEn: string, typeAr: string, rate: number }> = {
      "Algae": { id: 'A', typeEn: 'Tanker', typeAr: 'ناقلة سوائل', rate: 0.045 },
      "Date Seeds": { id: 'B', typeEn: 'Flatbed', typeAr: 'شاحنة مسطحة', rate: 0.040 },
      "Waste Cooking Oil": { id: 'A', typeEn: 'Tanker', typeAr: 'ناقلة سوائل', rate: 0.045 },
      "Animal Fat": { id: 'A', typeEn: 'Tanker', typeAr: 'ناقلة سوائل', rate: 0.045 },
      "Agricultural Residue": { id: 'B', typeEn: 'Flatbed', typeAr: 'شاحنة مسطحة', rate: 0.040 },
      "Biogas": { id: 'C', typeEn: 'Insulated Tanker', typeAr: 'ناقلة معزولة/حرارية', rate: 0.055 },
      "Bioethanol": { id: 'A', typeEn: 'Tanker', typeAr: 'ناقلة سوائل', rate: 0.045 },
      "Jatropha Seeds": { id: 'B', typeEn: 'Flatbed', typeAr: 'شاحنة مسطحة', rate: 0.040 },
      "Municipal Solid Waste": { id: 'B', typeEn: 'Flatbed', typeAr: 'شاحنة مسطحة', rate: 0.042 },
      "Sewage Sludge": { id: 'A', typeEn: 'Tanker', typeAr: 'ناقلة سوائل', rate: 0.048 },
      "Fish Oil": { id: 'A', typeEn: 'Tanker', typeAr: 'ناقلة سوائل', rate: 0.046 }
    };
    return categories[name] || { id: 'B', typeEn: 'Flatbed', typeAr: 'شاحنة مسطحة', rate: 0.040 };
  };

  const results = React.useMemo(() => {
    const dist = getDistance();
    if (dist === 0) return null;
    
    const cat = getCategory(feedstock);
    const baseFreight = dist * weight * cat.rate;
    const fuelFactor = dieselPrice / 0.250;
    const fuelSurcharge = baseFreight * (fuelFactor - 1); 
    
    const backhaulFactor = weight <= 500 ? 1.15 : 1.0;
    const totalBeforeFees = (baseFreight + Math.max(0, fuelSurcharge)) * backhaulFactor;
    
    let portFees = 0;
    const destZone = ZONES.find(z => z.id === destination);
    if (destZone?.isPort) {
      const containerEquiv = Math.ceil(weight / 20);
      portFees = containerEquiv * 50;
    }
    
    const total = totalBeforeFees + portFees;
    
    return {
      distance: dist,
      travelTime: (dist / 80).toFixed(1),
      baseFreight,
      fuelSurcharge: Math.max(0, fuelSurcharge),
      specialHandling: totalBeforeFees - baseFreight - Math.max(0, fuelSurcharge),
      portFees,
      total,
      category: cat,
      discountEligible: weight <= 500
    };
  }, [feedstock, weight, destination, source, dieselPrice]);

  const sourceZone = ZONES.find(z => z.id === source);
  const destZone = ZONES.find(z => z.id === destination);
  
  const routePositions: [number, number][] = [];
  if (sourceZone && destZone && source !== destination) {
    routePositions.push([sourceZone.lat, sourceZone.lng]);
    routePositions.push([destZone.lat, destZone.lng]);
  }

  // Set the map center specifically around the center of Oman
  const centerOfOman: [number, number] = [21.00, 57.00];

  // Restrict map tightly to Oman bounds
  const omanBounds = L.latLngBounds(
    L.latLng(16.50, 52.00), // SouthWest bound
    L.latLng(26.50, 59.90)  // NorthEast bound
  );

  return (
    <div className="w-full text-[var(--text-secondary)]  font-sans relative z-0" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-8 border-b border-[var(--border-glow)] pb-6 text-center md:text-start">
        <h2 className="text-3xl font-black text-[var(--text-primary)] flex justify-center md:justify-start items-center">
          <i className="fas fa-map-marked-alt text-[var(--accent-emerald)] dark:text-emerald-400 mx-3"></i>
          {isArabic ? 'خريطة عُمان الاستراتيجية (GIS)' : 'Oman Strategic GIS Map'}
        </h2>
        <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">
          {isArabic 
            ? 'تخطيط المسارات اللوجستية، حساب تكاليف النقل لقطاع الطاقة، وتقدير الانبعاثات بين المناطق الحرة في السلطنة.' 
            : 'Plan logical routes between Oman’s free zones, compute energy transport costs, and estimate Scope 3 logistics emissions.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-0">
        {/* Real Geographic Map UI */}
        <div className={
           isFullScreen 
            ? "fixed inset-0 z-50 bg-[var(--sidebar-bg)]" 
            : "w-full lg:w-1/2 rounded-2xl border border-[var(--border-glow)] relative h-[600px] overflow-hidden z-0"
        }>
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute top-4 right-4 z-[400] bg-[var(--card-bg)] shadow-card p-3 rounded-lg border border-[var(--border-glow)] text-[var(--text-primary)] hover:bg-[var(--accent-emerald)]/20 transition-colors shadow-card"
            title={isArabic ? 'تكبير الخريطة' : 'Toggle Full Screen'}
          >
            <i className={isFullScreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
          </button>
          <MapContainer 
            key={isFullScreen ? `fullscreen-${theme}` : `normal-${theme}`}
            center={centerOfOman} 
            zoom={6} 
            minZoom={5}
            maxBounds={omanBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%', background: '#0f172a' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url={theme === "dark" 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              }
            />
            {ZONES.map(z => (
              <Marker key={z.id} position={[z.lat, z.lng]} icon={createCustomIcon(z.color)}>
                <Popup className="custom-popup">
                  <div className="bg-[var(--card-bg)] shadow-card  shadow-card border border-[var(--border-glow)] p-3 rounded-lg text-center" dir={isArabic ? 'rtl' : 'ltr'}>
                    <p className="text-sm font-black text-[var(--text-primary)] m-0">{isArabic ? z.nameAr : z.nameEn}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] m-0 mt-1 uppercase tracking-widest">{isArabic ? z.descAr : z.descEn}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {routePositions.length === 2 && (
              <Polyline 
                positions={routePositions} 
                pathOptions={{ color: '#3b82f6', weight: 3, dashArray: '10, 10' }} 
              />
            )}
          </MapContainer>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col space-y-6 relative z-10">
          <div className="bg-[var(--card-bg)] shadow-card  shadow-card border border-[var(--border-glow)] p-6 rounded-2xl shadow-card">
            <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-glow)] pb-2">
              {isArabic ? 'إدخال بيانات الشحنة' : 'LOGISTIC PARAMETERS'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1">{isArabic ? 'المادة الخام' : 'FEEDSTOCK MATERIAL'}</label>
                  <select 
                    value={feedstock} 
                    onChange={(e) => setFeedstock(e.target.value)} 
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-lg p-2 text-xs focus:border-[var(--accent-emerald)] outline-none"
                  >
                    {BIOFUEL_FEEDSTOCKS.map(f => <option key={f} value={f}>{isArabic ? translateTerm(f) : f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1">{isArabic ? 'الوزن (طن متري)' : 'WEIGHT (METRIC TONS)'}</label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))} 
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-lg p-2 text-xs outline-none focus:border-[var(--accent-emerald)] transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1">{isArabic ? 'نقطة الانطلاق' : 'LOGISTIC ORIGIN'}</label>
                  <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-lg p-2 text-xs">
                    {ZONES.map(z => <option key={`src-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] mb-1">{isArabic ? 'نقطة الوصول' : 'DESTINATION'}</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-lg p-2 text-xs">
                    {ZONES.map(z => <option key={`dst-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-glow)]">
               <label className="block text-[9px] font-bold text-[var(--text-secondary)] uppercase mb-1 tracking-widest">
                 {isArabic ? 'مؤشر سعر الديزل (ر.ع/لتر)' : 'DIESEL PRICE INDEX (OMR/L)'}
               </label>
               <input 
                 type="range" 
                 min="0.200" 
                 max="0.400" 
                 step="0.005"
                 value={dieselPrice} 
                 onChange={(e) => setDieselPrice(Number(e.target.value))}
                 className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
               <div className="flex justify-between mt-1 text-[9px] font-black text-[var(--accent-emerald)] dark:text-emerald-400">
                 <span>{language === "Arabic" ? "0.200 ر.ع." : "0.200 OMR"}</span>
                 <span className="bg-[var(--accent-emerald)]/10 px-1 rounded border border-var(--accent-emerald)">{dieselPrice.toFixed(3)} OMR</span>
                 <span>{language === "Arabic" ? "0.400 ر.ع." : "0.400 OMR"}</span>
               </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] shadow-card  shadow-card border border-[var(--border-glow)] p-6 rounded-2xl flex-1 overflow-hidden">
            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-glow)] pb-2">
              {isArabic ? 'التقديرات اللوجستية المفصلة' : 'Detailed Logistics Output'}
            </h3>
            
            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-glow)]">
                  <h4 className="text-sm font-black text-[var(--text-primary)] mb-2 underline decoration-emerald-500/50 underline-offset-4">
                     {isArabic 
                       ? `مسار لوجستي لـ [${translateTerm(feedstock)}]: من ${sourceZone?.nameAr} إلى ${destZone?.nameAr}`
                       : `[${feedstock}] Logistic Route: ${sourceZone?.nameEn} to ${destZone?.nameEn}`}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-bold">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>{isArabic ? 'المسافة الإجمالية:' : 'Total Distance:'}</span>
                      <span className="text-[var(--text-primary)]">{results.distance} km</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>{isArabic ? 'وقت السفر المتوقع:' : 'Estimated Travel Time:'}</span>
                      <span className="text-[var(--text-primary)]">{results.travelTime} hours</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-[11px]">
                   <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-main)]/40 border border-var(--border-glow)">
                      <span className="text-[var(--text-secondary)]">* {isArabic ? 'تكلفة الشحن الأساسية:' : 'Base Freight:'}</span>
                      <span className="font-bold text-[var(--text-secondary)]">{results.baseFreight.toFixed(3)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                   </div>
                   <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-main)]/40 border border-var(--border-glow)">
                      <span className="text-[var(--text-secondary)]">* {isArabic ? 'رسوم الوقود (مؤشر 2026):' : 'Fuel Surcharge (2026 Index):'}</span>
                      <span className="font-bold text-rose-400">{results.fuelSurcharge.toFixed(3)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                   </div>
                   <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-main)]/40 border border-var(--border-glow)">
                      <span className="text-[var(--text-secondary)]">* {isArabic ? `مناولة خاصة (${results.category.typeAr}):` : `Special Handling (${results.category.typeEn}):`}</span>
                      <span className="font-bold text-[var(--accent-emerald)] dark:text-emerald-400">{results.specialHandling.toFixed(3)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                   </div>
                   {results.portFees > 0 && (
                     <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-main)]/40 border border-var(--border-glow)">
                        <span className="text-[var(--text-secondary)]">* {isArabic ? 'رسوم الموانئ العمانية:' : 'Oman Port Fees:'}</span>
                        <span className="font-bold text-blue-400">{results.portFees.toFixed(3)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                     </div>
                   )}
                </div>

                <div className="p-4 bg-[var(--accent-emerald)]/5 rounded-xl border border-var(--accent-emerald) flex justify-between items-center">
                   <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider">{isArabic ? 'إجمالي الميزانية اللوجستية:' : 'Total Logistic Budget:'}</span>
                   <span className="text-2xl font-black text-[var(--accent-emerald)] dark:text-emerald-400">{results.total.toFixed(3)} <span className="text-[10px]">{language === "Arabic" ? "ر.ع." : "OMR"}</span></span>
                </div>

                <div className="p-3 bg-blue-500 dark:bg-blue-600/5 rounded-xl border border-blue-500 dark:border-blue-400/10">
                   <p className="text-[10px] font-black text-blue-400 uppercase mb-1">{isArabic ? 'نصيحة استراتيجية:' : 'STRATEGIC ADVICE:'}</p>
                   <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic">
                     {results.discountEligible 
                        ? isArabic 
                           ? `لتوفير حوالي 15%، فكر في زيادة الكمية لأكثر من 500 طن للحصول على خصم الشحنات الضخمة وتقليل تكلفة العودة الفارغة.`
                           : `To save up to 15%, consider increasing volume to >500 tons to qualify for bulk discount and eliminate backhaul factors.`
                        : isArabic
                           ? `المنافسة اللوجستية قوية. لتقليل التكاليف الإضافية بنسبة 10%، يفضل تقريب منشأة الإنتاج من ${sourceZone?.nameAr}.`
                           : `To save 10%, consider moving the plant closer to ${sourceZone?.nameEn} or consolidating shipments to reduce mileage.`
                     }
                   </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-xs italic">
                {isArabic ? 'يرجى اختيار مسار لحساب التكاليف' : 'Please select a route to calculate costs'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
