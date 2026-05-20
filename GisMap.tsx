import * as React from 'react';
import { motion } from 'framer-motion';
import { LOCATIONS, TECHNOLOGY_CATEGORIES, BIOFUEL_FEEDSTOCKS, translateTerm } from './constants';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap, ZoomControl } from 'react-leaflet';
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

const RAW_MATERIALS = [
  // Algae
  { id: 'alg_sur', nameEn: 'Sur Coastal Algae', nameAr: 'طحالب صور الساحلية', lat: 22.56, lng: 59.52, type: 'algae', typeEn: 'Algae', typeAr: 'طحالب دقيقة', color: '#10b981', icon: 'fa-seedling' },
  { id: 'alg_duqm', nameEn: 'Duqm Algae Farms', nameAr: 'مزارع الطحالب بالدقم', lat: 19.65, lng: 57.70, type: 'algae', typeEn: 'Algae', typeAr: 'طحالب دقيقة', color: '#10b981', icon: 'fa-seedling' },
  { id: 'alg_shuwai', nameEn: 'Shuwaymiyah Algae', nameAr: 'طحالب الشويمية', lat: 17.89, lng: 55.53, type: 'algae', typeEn: 'Algae', typeAr: 'طحالب دقيقة', color: '#10b981', icon: 'fa-seedling' },
  
  // Waste Cooking Oil (WCO)
  { id: 'wco_muscat', nameEn: 'Muscat WCO Collection', nameAr: 'تجميع الزيوت - مسقط', lat: 23.58, lng: 58.40, type: 'wco', typeEn: 'Waste Cooking Oil', typeAr: 'زيوت طبخ مستعملة', color: '#f59e0b', icon: 'fa-tint' },
  { id: 'wco_sohar', nameEn: 'Sohar WCO Hub', nameAr: 'مركز الزيوت - صحار', lat: 24.34, lng: 56.73, type: 'wco', typeEn: 'Waste Cooking Oil', typeAr: 'زيوت طبخ مستعملة', color: '#f59e0b', icon: 'fa-tint' },
  { id: 'wco_salalah', nameEn: 'Salalah WCO Hub', nameAr: 'مركز الزيوت - صلالة', lat: 17.01, lng: 54.09, type: 'wco', typeEn: 'Waste Cooking Oil', typeAr: 'زيوت طبخ مستعملة', color: '#f59e0b', icon: 'fa-tint' },
  { id: 'wco_nizwa', nameEn: 'Nizwa Commercial WCO', nameAr: 'تجميع الزيوت - نزوى', lat: 22.93, lng: 57.53, type: 'wco', typeEn: 'Waste Cooking Oil', typeAr: 'زيوت طبخ مستعملة', color: '#f59e0b', icon: 'fa-tint' },

  // MSW & Agriculture
  { id: 'msw_barka', nameEn: 'Barka Engineered Landfill', nameAr: 'مردم بركاء الهندسي (Be\'ah)', lat: 23.68, lng: 57.88, type: 'msw_agri', typeEn: 'MSW & Agriculture', typeAr: 'نفايات وزراعة', color: '#8b5cf6', icon: 'fa-trash' },
  { id: 'msw_tahwa', nameEn: 'Tahwa Landfill', nameAr: 'مردم طهوة', lat: 22.25, lng: 59.20, type: 'msw_agri', typeEn: 'MSW & Agriculture', typeAr: 'نفايات وزراعة', color: '#8b5cf6', icon: 'fa-trash' },
  { id: 'msw_raysut', nameEn: 'Raysut Landfill', nameAr: 'مردم ريسوت (Be\'ah)', lat: 16.95, lng: 53.98, type: 'msw_agri', typeEn: 'MSW & Agriculture', typeAr: 'نفايات وزراعة', color: '#8b5cf6', icon: 'fa-trash' },
  { id: 'agri_batinah', nameEn: 'Batinah Date Palm Waste', nameAr: 'مخلفات النخيل بالباطنة', lat: 23.85, lng: 57.30, type: 'msw_agri', typeEn: 'MSW & Agriculture', typeAr: 'نفايات وزراعة', color: '#d97706', icon: 'fa-leaf' },
  
  // Solar
  { id: 'sol_ibri', nameEn: 'Ibri II Solar PV', nameAr: 'عبري ٢ للطاقة الشمسية', lat: 23.22, lng: 56.51, type: 'solar', typeEn: 'Solar Energy', typeAr: 'طاقة شمسية', color: '#eab308', icon: 'fa-solar-panel' },
  { id: 'sol_manah', nameEn: 'Manah Solar', nameAr: 'ألواح منح للطاقة الشمسية', lat: 22.75, lng: 57.55, type: 'solar', typeEn: 'Solar Energy', typeAr: 'طاقة شمسية', color: '#eab308', icon: 'fa-solar-panel' },
  { id: 'sol_amin', nameEn: 'Amin Solar Farm (PDO)', nameAr: 'محطة أمين (تنمية نفط عمان)', lat: 21.05, lng: 56.28, type: 'solar', typeEn: 'Solar Energy', typeAr: 'طاقة شمسية', color: '#eab308', icon: 'fa-solar-panel' },
  { id: 'sol_khazaen', nameEn: 'Khazaen Solar', nameAr: 'خزائن للطاقة الشمسية', lat: 23.63, lng: 57.85, type: 'solar', typeEn: 'Solar Energy', typeAr: 'طاقة شمسية', color: '#eab308', icon: 'fa-solar-panel' },

  // Wind
  { id: 'win_dhofar', nameEn: 'Dhofar Wind Farm', nameAr: 'محطة رياح ظفار (فتخيت)', lat: 17.50, lng: 54.00, type: 'wind', typeEn: 'Wind Energy', typeAr: 'طاقة الرياح', color: '#0ea5e9', icon: 'fa-wind' },
  { id: 'win_nimr', nameEn: 'Nimr Wind Project', nameAr: 'مشروع نمر للرياح', lat: 18.60, lng: 55.40, type: 'wind', typeEn: 'Wind Energy', typeAr: 'طاقة الرياح', color: '#0ea5e9', icon: 'fa-wind' },
  { id: 'win_sadah', nameEn: 'Sadah Wind Potential', nameAr: 'رياح سدح', lat: 17.05, lng: 55.05, type: 'wind', typeEn: 'Wind Energy', typeAr: 'طاقة الرياح', color: '#0ea5e9', icon: 'fa-wind' },
  { id: 'win_duqm', nameEn: 'Duqm Wind Sites', nameAr: 'مواقع رياح الدقم', lat: 19.80, lng: 57.60, type: 'wind', typeEn: 'Wind Energy', typeAr: 'طاقة الرياح', color: '#0ea5e9', icon: 'fa-wind' },
  { id: 'win_masirah', nameEn: 'Masirah Island Wind', nameAr: 'رياح جزيرة مصيرة', lat: 20.45, lng: 58.80, type: 'wind', typeEn: 'Wind Energy', typeAr: 'طاقة الرياح', color: '#0ea5e9', icon: 'fa-wind' },

  // Hydrogen
  { id: 'h2_duqm', nameEn: 'Hyport Duqm Hub', nameAr: 'مجمع هاي بورت الدقم', lat: 19.75, lng: 57.70, type: 'hydrogen', typeEn: 'Green Hydrogen', typeAr: 'هيدروجين أخضر', color: '#06b6d4', icon: 'fa-atom' },
  { id: 'h2_salalah', nameEn: 'Salalah H2 Hub (OQ)', nameAr: 'مجمع صلالة للهيدروجين', lat: 17.03, lng: 54.03, type: 'hydrogen', typeEn: 'Green Hydrogen', typeAr: 'هيدروجين أخضر', color: '#06b6d4', icon: 'fa-atom' },
  { id: 'h2_sohar', nameEn: 'Sohar Green H2', nameAr: 'مجمع صحار للهيدروجين', lat: 24.30, lng: 56.68, type: 'hydrogen', typeEn: 'Green Hydrogen', typeAr: 'هيدروجين أخضر', color: '#06b6d4', icon: 'fa-atom' },
];

const MATERIAL_CATEGORIES = [
  { id: 'algae', labelEn: 'Algae', labelAr: 'الطحالب', icon: 'fa-seedling' },
  { id: 'wco', labelEn: 'Waste Cooking Oil', labelAr: 'زيوت الطبخ', icon: 'fa-tint' },
  { id: 'msw_agri', labelEn: 'MSW & Agriculture', labelAr: 'نفايات وزراعة', icon: 'fa-trash' },
  { id: 'solar', labelEn: 'Solar Energy', labelAr: 'طاقة شمسية', icon: 'fa-solar-panel' },
  { id: 'wind', labelEn: 'Wind Energy', labelAr: 'طاقة الرياح', icon: 'fa-wind' },
  { id: 'hydrogen', labelEn: 'Green Hydrogen', labelAr: 'هيدروجين', icon: 'fa-atom' },
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

const createCustomIcon = (color: string, iconClass: string) => {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div style="position:relative; text-align:center; color:${color}; font-size:42px; text-shadow: 0 4px 6px rgba(0,0,0,0.4); line-height:42px; height: 42px; margin-top: -12px;">
        <i class="fas fa-location-dot"></i>
        <i class="fas ${iconClass}" style="position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:16px; color:#fff;"></i>
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42]
  });
};

const createRawMaterialIcon = (color: string, iconClass: string) => {
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div style="position:relative; text-align:center; color:${color}; font-size:36px; text-shadow: 0 4px 6px rgba(0,0,0,0.4); line-height:36px; height: 36px; margin-top: -10px;">
        <i class="fas fa-location-dot"></i>
        <i class="fas ${iconClass}" style="position:absolute; top:8px; left:50%; transform:translateX(-50%); font-size:14px; color:#fff;"></i>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const MapResizer = ({ isFullScreen }: { isFullScreen: boolean }) => {
  const map = useMap();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 100); // small delay to allow CSS transitions to apply
    return () => clearTimeout(timeout);
  }, [isFullScreen, map]);
  return null;
};

export const GisMap: React.FC<Props> = ({ language, theme = "dark" }) => {
  const isArabic = language === 'Arabic';
  const [source, setSource] = React.useState<string>('sohar');
  const [destination, setDestination] = React.useState<string>('duqm');
  const [feedstock, setFeedstock] = React.useState<string>(BIOFUEL_FEEDSTOCKS[0]);
  const [weight, setWeight] = React.useState<number>(100);
  const [dieselPrice, setDieselPrice] = React.useState<number>(0.250);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [selectedMaterialType, setSelectedMaterialType] = React.useState<string | null>(null);
  const [routeGeometry, setRouteGeometry] = React.useState<[number, number][] | null>(null);

  React.useEffect(() => {
    const sourceZone = ZONES.find(z => z.id === source);
    const destZone = ZONES.find(z => z.id === destination);
    
    if (sourceZone && destZone && source !== destination) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${sourceZone.lng},${sourceZone.lat};${destZone.lng},${destZone.lat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
             const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
             setRouteGeometry(coords);
          } else {
             setRouteGeometry([[sourceZone.lat, sourceZone.lng], [destZone.lat, destZone.lng]]);
          }
        } catch (e) {
          console.error("OSRM Route fetching error:", e);
          setRouteGeometry([[sourceZone.lat, sourceZone.lng], [destZone.lat, destZone.lng]]);
        }
      };
      
      const timeout = setTimeout(() => {
        fetchRoute();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setRouteGeometry(null);
    }
  }, [source, destination]);

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
  
  // Set the map center specifically around the center of Oman
  const centerOfOman: [number, number] = [21.00, 57.00];

  // Restrict map tightly to Oman bounds
  const omanBounds = L.latLngBounds(
    L.latLng(16.50, 52.00), // SouthWest bound
    L.latLng(26.50, 59.90)  // NorthEast bound
  );

  return (
    <div className="w-full max-w-7xl mx-auto text-[var(--text-secondary)] font-sans relative z-0 pb-32" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-8 border-b border-[var(--border-glow)] pb-6 text-center md:text-start">
        <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] flex justify-center md:justify-start items-center">
          <i className="fas fa-map-marked-alt text-[var(--accent-emerald)] dark:text-emerald-400 mx-3"></i>
          {isArabic ? 'خريطة عُمان الاستراتيجية اللوجستية' : 'Oman Strategic Logistics Map'}
        </h2>
        <p className="text-[var(--text-secondary)] text-sm md:text-base mt-3 max-w-3xl font-medium leading-relaxed">
          {isArabic 
            ? 'تخطيط المسارات اللوجستية على شبكة الطرق الفعلية، حساب تكاليف النقل لقطاع الطاقة، وتقدير الانبعاثات بين المناطق الصناعية والحرة في السلطنة لاستثمارات مجدية.' 
            : 'Plan logical routes on the actual road network, compute energy transport costs, and estimate logistics operations between Oman’s free zones.'}
        </p>
      </div>

      <div className="flex flex-col gap-8 relative z-0">
        {/* Real Geographic Map UI */}
        <div className={
           isFullScreen 
            ? "fixed inset-0 z-[9000] bg-[var(--bg-main)] p-2 md:p-6 flex flex-col" 
            : "w-full rounded-[2rem] border border-[var(--border-glow)] relative h-[500px] md:h-[700px] shadow-2xl overflow-hidden z-10"
        }>
          <div className={`absolute z-[9999] flex flex-row gap-2 pointer-events-auto ${isFullScreen ? 'top-6 right-6 md:top-10 md:right-10' : 'top-4 right-4'}`}>
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="bg-white text-gray-800 shadow-xl p-3 md:p-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors pointer-events-auto flex flex-col items-center justify-center min-w-[50px] min-h-[50px] font-bold text-[10px]"
              title={isArabic ? 'تكبير/تصغير الخريطة' : 'Toggle Full Screen'}
            >
              <i className={isFullScreen ? 'fas fa-compress text-xl mb-1' : 'fas fa-expand text-xl mb-1'}></i>
              {isFullScreen && <span>{isArabic ? 'تصغير' : 'Close'}</span>}
            </button>
          </div>

          {/* Floating Map Filter Panel (Visible in both modes) */}
          <div className={`absolute z-[9999] pointer-events-auto ${isFullScreen ? 'top-6 left-6 md:top-10 md:left-10' : 'bottom-6 left-6'} max-w-[280px] w-full`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200 p-4 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-1">
                <i className="fas fa-filter text-[var(--accent-emerald)]"></i>
                {isArabic ? 'تصفية الخريطة' : 'Map Filters'}
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">{isArabic ? 'المواد الخام' : 'Raw Materials'}</label>
                <select value={selectedMaterialType || ''} onChange={(e) => setSelectedMaterialType(e.target.value === '' ? null : e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#8b5cf6] outline-none cursor-pointer">
                  <option value="">{isArabic ? 'إخفاء الكل' : 'Hide All'}</option>
                  <option value="all">{isArabic ? 'إظهار الكل' : 'Show All'}</option>
                  {MATERIAL_CATEGORIES.map(cat => (
                    <option key={`map-cat-${cat.id}`} value={cat.id}>{isArabic ? cat.labelAr : cat.labelEn}</option>
                  ))}
                </select>
              </div>
              
              {!isFullScreen && (
                <p className="text-[9px] text-[var(--text-muted)] mt-1 leading-tight">
                  <i className="fas fa-info-circle mr-1"></i>
                  {isArabic ? 'اختر موقع المصدر والوجهة من القائمة بالأسفل لحساب المسار.' : 'Select origin and destination from the panel below to calculate routes.'}
                </p>
              )}

              {isFullScreen && (
                <>
                  <div className="mt-1">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">{isArabic ? 'نقطة الانطلاق' : 'Origin'}</label>
                    <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#3b82f6] outline-none cursor-pointer">
                      {ZONES.map(z => <option key={`f-src-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                    </select>
                  </div>
                  <div className="mt-1">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">{isArabic ? 'نقطة الوصول' : 'Destination'}</label>
                    <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#f59e0b] outline-none cursor-pointer">
                      {ZONES.map(z => <option key={`f-dst-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <MapContainer 
            center={centerOfOman} 
            zoom={6} 
            minZoom={5}
            maxBounds={omanBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%', background: '#f8fafc', borderRadius: isFullScreen ? '1rem' : '0' }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <MapResizer isFullScreen={isFullScreen} />
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
            {ZONES.filter(z => z.id === source || z.id === destination).map(z => (
              <Marker key={z.id} position={[z.lat, z.lng]} icon={createCustomIcon(z.color, z.isPort ? 'fa-anchor' : 'fa-building')}>
                <Popup className="custom-popup">
                  <div className="bg-white shadow-xl border border-gray-100 px-4 py-3 rounded-xl text-center" dir={isArabic ? 'rtl' : 'ltr'}>
                    <p className="text-sm font-black text-slate-800 m-0">{isArabic ? z.nameAr : z.nameEn}</p>
                    <p className="text-[10px] text-slate-500 m-0 mt-1 uppercase tracking-widest">{isArabic ? z.descAr : z.descEn}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {selectedMaterialType && RAW_MATERIALS.filter(r => selectedMaterialType === 'all' || r.type === selectedMaterialType).map(r => (
              <Marker key={r.id} position={[r.lat, r.lng]} icon={createRawMaterialIcon(r.color, r.icon)}>
                <Popup className="custom-popup">
                  <div className="bg-white shadow-xl border border-gray-100 px-4 py-3 rounded-xl text-center" dir={isArabic ? 'rtl' : 'ltr'}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <i className={`fas ${r.icon} text-xs`} style={{ color: r.color }}></i>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest m-0">{isArabic ? r.typeAr : r.typeEn}</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 m-0 leading-tight">{isArabic ? r.nameAr : r.nameEn}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* White background glow for the line to make it visible on all backgrounds */}
            {routeGeometry && routeGeometry.length > 0 && (
              <Polyline 
                positions={routeGeometry} 
                pathOptions={{ 
                  color: '#ffffff', 
                  weight: 12, 
                  opacity: 0.9,
                  lineJoin: 'round'
                }} 
              />
            )}

            {/* Dark background border for contrast */}
            {routeGeometry && routeGeometry.length > 0 && (
              <Polyline 
                positions={routeGeometry} 
                pathOptions={{ 
                  color: '#1e293b', 
                  weight: 8, 
                  opacity: 0.9,
                  lineJoin: 'round'
                }} 
              />
            )}

            {/* Main brightly colored line */}
            {routeGeometry && routeGeometry.length > 0 && (
              <Polyline 
                positions={routeGeometry} 
                pathOptions={{ 
                  color: '#8B5CF6', /* Vivid Violet to stand out from green roads/lands */
                  weight: 5, 
                  opacity: 1,
                  lineJoin: 'round',
                  dashArray: '10, 15',
                }} 
              />
            )}
          </MapContainer>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative z-10 w-full">
          <div className="w-full lg:w-1/2 bg-[var(--card-bg)] shadow-card border border-[var(--border-glow)] p-6 md:p-8 rounded-3xl">
            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-glow)] pb-4 flex items-center gap-3">
              <i className="fas fa-sliders-h text-[var(--accent-emerald)]"></i>
              {isArabic ? 'إدخال بيانات الشحنة والموقع' : 'LOGISTIC PARAMETERS'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">{isArabic ? 'المادة الخام المستهدفة' : 'FEEDSTOCK MATERIAL'}</label>
                  <select 
                    value={feedstock} 
                    onChange={(e) => setFeedstock(e.target.value)} 
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-xs md:text-sm font-medium focus:ring-2 focus:ring-[var(--accent-emerald)] outline-none transition-all"
                  >
                    {BIOFUEL_FEEDSTOCKS.map(f => <option key={f} value={f}>{isArabic ? translateTerm(f) : f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">{isArabic ? 'الوزن (طن متري)' : 'WEIGHT (METRIC TONS)'}</label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))} 
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-xs md:text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent-emerald)] transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">{isArabic ? 'نقطة الانطلاق (المصدر)' : 'LOGISTIC ORIGIN'}</label>
                  <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-xs md:text-sm font-medium focus:ring-2 focus:ring-[#3b82f6] outline-none transition-all">
                    {ZONES.map(z => <option key={`src-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">{isArabic ? 'نقطة الوصول (المصنع/الميناء)' : 'DESTINATION'}</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-4 py-3 text-xs md:text-sm font-medium focus:ring-2 focus:ring-[#f59e0b] outline-none transition-all">
                    {ZONES.map(z => <option key={`dst-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-main)]/50 p-5 rounded-2xl border border-[var(--border-glow)]">
               <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-3 tracking-widest">
                 {isArabic ? 'مؤشر سعر الديزل لتسعير النقل (ر.ع/لتر)' : 'DIESEL PRICE INDEX (OMR/L)'}
               </label>
               <input 
                 type="range" 
                 min="0.200" 
                 max="0.400" 
                 step="0.005"
                 value={dieselPrice} 
                 onChange={(e) => setDieselPrice(Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
               />
               <div className="flex justify-between mt-3 text-[11px] font-black text-[var(--text-secondary)]">
                 <span>{language === "Arabic" ? "0.200 ر.ع." : "0.200 OMR"}</span>
                 <span className="bg-[var(--accent-emerald)] text-white dark:text-emerald-950 px-3 py-1 rounded-md shadow-md">{dieselPrice.toFixed(3)} OMR</span>
                 <span>{language === "Arabic" ? "0.400 ر.ع." : "0.400 OMR"}</span>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-[var(--card-bg)] shadow-card border border-[var(--border-glow)] p-6 md:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 border-b border-[var(--border-glow)] pb-4 flex items-center gap-3">
                <i className="fas fa-file-invoice-dollar text-[#3b82f6]"></i>
                {isArabic ? 'التقديرات اللوجستية المفصلة' : 'Detailed Logistics Output'}
              </h3>
              
              {results ? (
                <div className="space-y-4">
                  <div className="p-5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-glow)]">
                    <h4 className="text-sm font-black text-[var(--text-primary)] mb-3">
                       {isArabic 
                         ? `مسار التحليل: من ${sourceZone?.nameAr} إلى ${destZone?.nameAr}`
                         : `Route Analysis: ${sourceZone?.nameEn} to ${destZone?.nameEn}`}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      <div className="flex items-center gap-2 text-[var(--text-primary)] bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border-glow)]">
                        <i className="fas fa-route text-[var(--text-secondary)]"></i>
                        <span className="text-[var(--text-secondary)] flex-1">{isArabic ? 'المسافة:' : 'Distance:'}</span>
                        <span>{results.distance} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-primary)] bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border-glow)]">
                        <i className="fas fa-clock text-[var(--text-secondary)]"></i>
                        <span className="text-[var(--text-secondary)] flex-1">{isArabic ? 'وقت السفر:' : 'Travel Time:'}</span>
                        <span>{results.travelTime} hrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 px-1">
                     <div className="flex justify-between py-2 border-b border-[var(--border-glow)] border-dashed">
                        <span className="text-xs text-[var(--text-secondary)] font-medium"><i className="fas fa-truck text-[var(--text-muted)] w-5"></i> {isArabic ? 'تكلفة الشحن الأساسية:' : 'Base Freight:'}</span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">{results.baseFreight.toFixed(2)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                     </div>
                     <div className="flex justify-between py-2 border-b border-[var(--border-glow)] border-dashed">
                        <span className="text-xs text-[var(--text-secondary)] font-medium"><i className="fas fa-gas-pump text-rose-600 dark:text-rose-400 w-5"></i> {isArabic ? 'رسوم الوقود (مؤشر متغير):' : 'Fuel Surcharge:'}</span>
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{results.fuelSurcharge.toFixed(2)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                     </div>
                     <div className="flex justify-between py-2 border-b border-[var(--border-glow)] border-dashed">
                        <span className="text-xs text-[var(--text-secondary)] font-medium"><i className="fas fa-shield-alt text-[#3b82f6] w-5"></i> {isArabic ? `مناولة خاصة (${results.category.typeAr}):` : `Special Handling (${results.category.typeEn}):`}</span>
                        <span className="text-xs font-bold text-[#3b82f6]">{results.specialHandling.toFixed(2)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                     </div>
                     {results.portFees > 0 && (
                       <div className="flex justify-between py-2 border-b border-[var(--border-glow)] border-dashed">
                          <span className="text-xs text-[var(--text-secondary)] font-medium"><i className="fas fa-anchor text-[#8b5cf6] w-5"></i> {isArabic ? 'رسوم الموانئ العمانية:' : 'Oman Port Fees:'}</span>
                          <span className="text-xs font-bold text-[#8b5cf6]">{results.portFees.toFixed(2)} {language === "Arabic" ? "ر.ع." : "OMR"}</span>
                       </div>
                     )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-secondary)] text-sm py-12 flex-1">
                  <i className="fas fa-map-signs text-4xl mb-4 opacity-50"></i>
                  {isArabic ? 'يرجى اختيار مسار لحساب التكاليف' : 'Please select a valid route to calculate costs'}
                </div>
              )}
            </div>
            
            {results && (
              <div className="mt-8 space-y-4">
                <div className="p-5 bg-gradient-to-r from-[var(--accent-emerald)] to-emerald-600 rounded-2xl flex justify-between items-center text-white shadow-lg overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[20px] -mr-16 -mt-16 pointer-events-none"></div>
                   <span className="text-xs md:text-sm font-black uppercase tracking-wider relative z-10">{isArabic ? 'إجمالي الميزانية اللوجستية' : 'Total Logistic Budget'}</span>
                   <span className="text-3xl font-black relative z-10 drop-shadow-md">{results.total.toFixed(2)} <span className="text-lg opacity-80 font-bold">{language === "Arabic" ? "ر.ع." : "OMR"}</span></span>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-[#3b82f6]/10 rounded-2xl border border-blue-200 dark:border-blue-500/20">
                   <p className="text-[11px] font-black text-[#3b82f6] uppercase mb-2 flex items-center gap-2"><i className="fas fa-lightbulb"></i> {isArabic ? 'توصية استراتيجية:' : 'STRATEGIC ADVICE:'}</p>
                   <p className="text-xs text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                     {results.discountEligible 
                        ? isArabic 
                           ? `لتوفير حوالي 15%، فكر في زيادة الكمية لأكثر من 500 طن للحصول على خصم الشحنات الضخمة وتقليل تكلفة العودة الفارغة للناقلات.`
                           : `To save up to 15%, consider increasing volume to >500 tons to qualify for bulk discount and eliminate backhaul penalties.`
                        : isArabic
                           ? `المنافسة اللوجستية قوية الآن. لتقليل التكاليف الإضافية بنسبة 10%، يفضل تقريب منشأة الإنتاج من موقع التجميع في ${sourceZone?.nameAr}.`
                           : `Logistics operations look optimized. To save an additional 10%, consider consolidating shipments near ${sourceZone?.nameEn}.`
                     }
                   </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

