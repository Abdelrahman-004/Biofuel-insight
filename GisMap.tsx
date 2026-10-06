import * as React from 'react';
import { motion } from 'framer-motion';
import { LOCATIONS, TECHNOLOGY_CATEGORIES, BIOFUEL_FEEDSTOCKS, translateTerm } from './constants';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { EV_CHARGING_STATIONS, EvChargingStation, EV_STATION_OPERATORS } from './evStationsData';
import { VoltOmanResult, VoltOmanChargingStop } from './types';

interface Props {
  language: 'English' | 'Arabic';
  theme?: 'dark' | 'light';
  onNavigateToTab?: (tab: string) => void;
  defaultEvStationsLayer?: boolean;
  onSelectStationForEnergyZone?: (station: EvChargingStation) => void;
  onSelectStationForRoute?: (station: EvChargingStation) => void;
  stationsData?: EvChargingStation[];
  voltOmanResult?: VoltOmanResult | null;
  activeVoltOmanRoute?: {
    routeNameEn: string;
    routeNameAr: string;
    highwayCorridor: string;
    distanceKm: number;
    vehicleModelName: string;
    batteryCapacityKwh: number;
    ambientTempC: number;
    initialSocPct: number;
  };
}

const ZONES = [
  { id: 'sohar', nameEn: 'Sohar Freezone', nameAr: 'ميناء وصحار الحرة', lat: 24.4601, lng: 56.6111, color: '#10b981', descEn: 'Industrial Synergy & Export', descAr: 'مركز الصناعات الثقيلة والتصدير', isPort: true },
  { id: 'muscat', nameEn: 'Mina Al Sultan Qaboos', nameAr: 'مسقط (ميناء السلطان قابوس)', lat: 23.6262, lng: 58.5645, color: '#3b82f6', descEn: 'Capital Logistical Hub', descAr: 'العاصمة والمركز اللوجستي', isPort: true },
  { id: 'duqm', nameEn: 'SEZAD Duqm', nameAr: 'المنطقة الاقتصادية بالدقم', lat: 19.6437, lng: 57.7027, color: '#f59e0b', descEn: 'Green Hydrogen Capital & EV OEM', descAr: 'عاصمة الهيدروجين وتصنيع المركبات', isPort: true },
  { id: 'salalah', nameEn: 'Salalah Freezone', nameAr: 'صلالة الحرة', lat: 16.9470, lng: 53.9780, color: '#f43f5e', descEn: 'Global Shipping Lane & EV Terminus', descAr: 'بوابة خطوط الشحن ومحطة المسار الجنوبي', isPort: true },
  { id: 'nizwa', nameEn: 'Nizwa Industrial City', nameAr: 'مدينة نزوى الصناعية', lat: 22.9333, lng: 57.5333, color: '#8b5cf6', descEn: 'Internal Trade Hub & Mountain Gateway', descAr: 'مركز التجارة الداخلية وبوابة الجبل', isPort: false },
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

// Helper to match an Oman Oil EV station with a VoltOman calculated itinerary stop
const matchStationWithItinerary = (station: EvChargingStation, itinerary?: VoltOmanChargingStop[]): VoltOmanChargingStop | null => {
  if (!itinerary || itinerary.length === 0) return null;
  const sNameEn = station.nameEn.toLowerCase();
  const sNameAr = station.nameAr;

  for (const stop of itinerary) {
    const stopEn = stop.stationNameEn.toLowerCase();
    if (sNameEn.includes(stopEn) || stopEn.includes(sNameEn)) return stop;
    if (sNameAr.includes(stop.stationNameAr) || stop.stationNameAr.includes(sNameAr)) return stop;

    // Match by key landmark name
    const keywords = ['haima', 'ghaba', 'adam', 'thumrait', 'sohar', 'barka', 'suwaiq', 'saham', 'ghaftain', 'qatbit', 'salalah', 'duqm', 'nizwa', 'samail', 'bidbid', 'sur', 'ibra', 'mouj', 'wave', 'airport', 'rusayl', 'amerat', 'shinas'];
    for (const kw of keywords) {
      if (sNameEn.includes(kw) && stopEn.includes(kw)) {
        return stop;
      }
    }
  }
  return null;
};

// Modern EV Charging Station Pin with OOMCO branding and active VoltOman itinerary highlight
const createEvStationIcon = (
  status: EvChargingStation['status'], 
  powerKw: number, 
  isVoltOmanStop = false,
  stopNumber?: number
) => {
  if (isVoltOmanStop) {
    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `<div style="position:relative; text-align:center; color:#f59e0b; font-size:44px; text-shadow: 0 0 14px rgba(245,158,11,0.95); line-height:44px; height: 44px; margin-top: -16px;">
          <div style="position:absolute; top:-3px; left:50%; transform:translateX(-50%); width:46px; height:46px; border-radius:50%; border:2px dashed #f59e0b; animation:spin 4s linear infinite; pointer-events:none;"></div>
          <i class="fas fa-location-dot"></i>
          <span style="position:absolute; top:7px; left:50%; transform:translateX(-50%); font-size:11px; font-weight:900; color:#0f172a; background:#fbbf24; border-radius:50%; width:19px; height:19px; line-height:19px; display:inline-block; box-shadow:0 0 8px #fbbf24;">#${stopNumber || 1}</span>
          <span style="position:absolute; bottom:-14px; left:50%; transform:translateX(-50%); background:#020617; color:#fbbf24; font-size:9px; font-weight:900; font-family:monospace; padding:1px 5px; border-radius:4px; border:1px solid #f59e0b; white-space:nowrap; box-shadow:0 2px 10px rgba(0,0,0,0.8);">⚡ VoltOman #${stopNumber}</span>
        </div>`,
      iconSize: [46, 60],
      iconAnchor: [23, 44],
      popupAnchor: [0, -44]
    });
  }

  let color = '#10b981'; // Emerald for operational OOMCO
  if (status === 'UNDER_CONSTRUCTION_2025_2026') {
    color = '#f59e0b'; // Amber
  } else if (status === 'PLANNED_2027_PIPELINE') {
    color = '#06b6d4'; // Cyan
  }

  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `<div style="position:relative; text-align:center; color:${color}; font-size:38px; text-shadow: 0 3px 8px rgba(0,0,0,0.8); line-height:38px; height: 38px; margin-top: -12px;">
        <i class="fas fa-location-dot"></i>
        <i class="fas fa-bolt" style="position:absolute; top:7px; left:50%; transform:translateX(-50%); font-size:13px; color:#fff;"></i>
        <span style="position:absolute; bottom:-12px; left:50%; transform:translateX(-50%); background:#020617; color:${color}; font-size:9px; font-weight:800; font-family:monospace; padding:1px 4px; border-radius:4px; border:1px solid ${color}; white-space:nowrap;">OOMCO ${powerKw}kW</span>
      </div>`,
    iconSize: [38, 52],
    iconAnchor: [19, 40],
    popupAnchor: [0, -40]
  });
};

const MapResizer = ({ isFullScreen }: { isFullScreen: boolean }) => {
  const map = useMap();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isFullScreen, map]);
  return null;
};

export const GisMap: React.FC<Props> = ({ 
  language, 
  theme = "dark", 
  onNavigateToTab,
  defaultEvStationsLayer = true,
  onSelectStationForEnergyZone,
  onSelectStationForRoute,
  stationsData,
  voltOmanResult,
  activeVoltOmanRoute
}) => {
  const isArabic = language === 'Arabic';
  const baseStations = stationsData || EV_CHARGING_STATIONS;
  const [source, setSource] = React.useState<string>('sohar');
  const [destination, setDestination] = React.useState<string>('duqm');
  const [feedstock, setFeedstock] = React.useState<string>(BIOFUEL_FEEDSTOCKS[0]);
  const [weight, setWeight] = React.useState<number>(100);
  const [dieselPrice, setDieselPrice] = React.useState<number>(0.250);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [selectedMaterialType, setSelectedMaterialType] = React.useState<string | null>(null);
  const [showOnlyVoltOmanStops, setShowOnlyVoltOmanStops] = React.useState<boolean>(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = React.useState<string>('ALL');
  const [routeGeometry, setRouteGeometry] = React.useState<[number, number][] | null>(null);

  // EV Charging Layer State (All stations through 2027)
  const [showEvStations, setShowEvStations] = React.useState<boolean>(defaultEvStationsLayer);
  const [showStrategicZones, setShowStrategicZones] = React.useState<boolean>(false); // Off by default: show only car stations with electrical charge
  const [evStatusFilter, setEvStatusFilter] = React.useState<'ALL' | 'OPERATIONAL' | 'CONSTRUCTION_2025_2026' | 'PIPELINE_2027' | 'FREE_ZONES_ONLY'>('ALL');
  const [selectedEvOperator, setSelectedEvOperator] = React.useState<string>('ALL');

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

  // Filtered EV Charging Stations (Exclusively Car Service Stations with Electrical Charge across Oman)
  const filteredEvStations = React.useMemo(() => {
    if (!showEvStations) return [];
    return baseStations.filter(st => {
      // STRICT FILTER: Only show car stations that have electrical charge
      if (st.hasElectricalCharge === false || !st.powerKw || st.powerKw <= 0) return false;

      // If user toggled to show only stops on the active VoltOman itinerary
      if (showOnlyVoltOmanStops) {
        const isMatched = matchStationWithItinerary(st, voltOmanResult?.chargingItinerary);
        if (!isMatched) return false;
      }

      // Status filter
      if (evStatusFilter === 'OPERATIONAL' && st.status !== 'OPERATIONAL') return false;
      if (evStatusFilter === 'CONSTRUCTION_2025_2026' && st.status !== 'UNDER_CONSTRUCTION_2025_2026') return false;
      if (evStatusFilter === 'PIPELINE_2027' && st.status !== 'PLANNED_2027_PIPELINE') return false;
      if (evStatusFilter === 'FREE_ZONES_ONLY' && !st.isFreeZoneHub) return false;

      // Region / Governorate filter
      if (selectedRegionFilter !== 'ALL') {
        const gov = st.governorateEn.toLowerCase();
        if (selectedRegionFilter === 'muscat' && !gov.includes('muscat')) return false;
        if (selectedRegionFilter === 'batinah' && !gov.includes('batinah')) return false;
        if (selectedRegionFilter === 'dakhiliyah' && !gov.includes('dakhiliyah')) return false;
        if (selectedRegionFilter === 'wusta' && !gov.includes('wusta')) return false;
        if (selectedRegionFilter === 'dhofar' && !gov.includes('dhofar')) return false;
        if (selectedRegionFilter === 'sharqiyah' && !gov.includes('sharqiyah')) return false;
        if (selectedRegionFilter === 'dhahirah_buraimi' && !gov.includes('dhahirah') && !gov.includes('buraimi')) return false;
        if (selectedRegionFilter === 'musandam_mazunah' && !gov.includes('musandam') && !gov.includes('mazunah')) return false;
      }

      return true;
    });
  }, [showEvStations, evStatusFilter, selectedRegionFilter, showOnlyVoltOmanStops, voltOmanResult, baseStations]);

  const centerOfOman: [number, number] = [21.00, 57.00];

  const omanBounds = L.latLngBounds(
    L.latLng(16.50, 52.00),
    L.latLng(26.50, 59.90)
  );

  return (
    <div className="w-full max-w-7xl mx-auto text-[var(--text-secondary)] font-sans relative z-0 pb-32" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Title & Real-time Layer Banner (Exclusively Oman Oil Company Network) */}
      <div className="mb-6 border-b border-[var(--border-glow)] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isArabic ? '⚡ محطات خدمة السيارات المزودة بنقاط شحن كهربائي حصراً (OOMCO EV)' : '⚡ Car Service Stations with Electrical Charge Only (OOMCO EV)'}
            </span>
            <span className="text-xs font-mono text-emerald-400/90 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
              {filteredEvStations.length} {isArabic ? 'محطة خدمة سيارات مزودة بشحن كهربائي حقيقي' : 'Verified EV Charging Car Stations'}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
            <i className="fas fa-charging-station text-emerald-500"></i>
            <span>
              {isArabic 
                ? 'خريطة GIS لمحطات خدمة سيارات نفط عُمان (OOMCO) المزودة بشواحن كهربائية' 
                : 'OOMCO Car Service Stations with EV Charging Points — GIS Reality Map'}
            </span>
          </h2>

          <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
            {isArabic 
              ? 'تغطية جغرافية حصرية ودقيقة لمحطات خدمة السيارات التابعة لشركة النفط العمانية للتسويق (نفط عُمان / OOMCO) والمجهزة فعلياً بنقاط شحن كهربائي فائق السرعة، مع مواقع وإحداثيات مطابقة للواقع الميداني في كافة محافظات السلطنة.' 
              : 'Dedicated ground-truth GIS mapping exclusively displaying Oman Oil Marketing Company (OOMCO) car service stations equipped with electric vehicle (EV) charging infrastructure across the Sultanate of Oman.'}
          </p>
        </div>

        {/* Quick Navigate Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onNavigateToTab && (
            <>
              <button
                onClick={() => onNavigateToTab('PROPOSAL')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-slate-800 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-lg"
              >
                <i className="fas fa-bolt-lightning text-amber-400"></i>
                <span>{isArabic ? 'محرك VoltOman' : 'VoltOman Engine'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('ZONES')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-400 hover:bg-slate-800 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-lg"
              >
                <i className="fas fa-city text-cyan-400"></i>
                <span>{isArabic ? 'قاعدة بيانات الطاقة' : 'Energy Zones DB'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Active VoltOman Engine Results Integration Bar */}
      {voltOmanResult && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
              <i className="fa-solid fa-bolt-lightning text-amber-400 animate-pulse"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                  {isArabic ? 'رابط نتائج برنامج VoltOman نشط' : 'VoltOman Results Linked'}
                </span>
                <span className="text-xs font-bold text-white">
                  {activeVoltOmanRoute?.vehicleModelName || 'EV'} • {isArabic ? activeVoltOmanRoute?.routeNameAr : activeVoltOmanRoute?.routeNameEn}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {activeVoltOmanRoute?.distanceKm || voltOmanResult.telemetry.distanceKm} km
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <span className="text-amber-400 font-bold">{isArabic ? voltOmanResult.verdictTitleAr : voltOmanResult.verdictTitleEn}</span>
                {' · '}
                <span className="font-mono text-slate-400">
                  {isArabic 
                    ? `صافي الاستهلاك: ${voltOmanResult.telemetry.totalNetEnergyKwh.toFixed(1)} ك.و.س (${voltOmanResult.telemetry.effectiveEfficiencyKwhPerKm.toFixed(3)} ك.و.س/كم)` 
                    : `Net Energy: ${voltOmanResult.telemetry.totalNetEnergyKwh.toFixed(1)} kWh (${voltOmanResult.telemetry.effectiveEfficiencyKwhPerKm.toFixed(3)} kWh/km)`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setShowOnlyVoltOmanStops(!showOnlyVoltOmanStops)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 border ${
                showOnlyVoltOmanStops 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20' 
                  : 'bg-slate-900 text-amber-400 border-amber-500/40 hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-filter"></i>
              <span>
                {isArabic 
                  ? `عرض محطات مسار VoltOman فقط (${voltOmanResult.chargingItinerary.length})` 
                  : `VoltOman Route Stops Only (${voltOmanResult.chargingItinerary.length})`}
              </span>
            </button>

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('PROPOSAL')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-gauge-high text-emerald-400"></i>
                <span>{isArabic ? 'لوحة القيادة' : 'Cockpit'}</span>
              </button>
            )}
          </div>
        </div>
      )}



      <div className="flex flex-col gap-8 relative z-0">
        
        {/* Real Geographic Map UI */}
        <div className={
           isFullScreen 
            ? "fixed inset-0 z-[9000] bg-[var(--bg-main)] p-2 md:p-6 flex flex-col" 
            : "w-full rounded-[2rem] border border-[var(--border-glow)] relative h-[520px] md:h-[720px] shadow-2xl overflow-hidden z-10"
        }>
          
          {/* Top Right Controls (Fullscreen & Quick Layer Info) */}
          <div className={`absolute z-[9999] flex flex-row items-center gap-2 pointer-events-auto ${isFullScreen ? 'top-6 right-6 md:top-10 md:right-10' : 'top-4 right-4'}`}>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-200 shadow-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{filteredEvStations.length} {isArabic ? 'محطة ظاهرة' : 'Stations Active'}</span>
            </div>

            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="bg-white text-gray-800 shadow-xl p-3 md:p-3.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors pointer-events-auto flex items-center justify-center font-bold text-xs cursor-pointer"
              title={isArabic ? 'تكبير/تصغير الخريطة' : 'Toggle Full Screen'}
            >
              <i className={isFullScreen ? 'fas fa-compress text-base' : 'fas fa-expand text-base'}></i>
            </button>
          </div>

          {/* Floating Map Filter Panel */}
          <div className={`absolute z-[9999] pointer-events-auto ${isFullScreen ? 'top-6 left-6 md:top-10 md:left-10' : 'top-4 left-4'} max-w-[310px] w-full`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="bg-slate-950/95 backdrop-blur-md shadow-2xl border border-slate-800 p-4 rounded-2xl flex flex-col gap-3 text-slate-200">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-layer-group text-emerald-400"></i>
                  {isArabic ? 'طبقات خريطة عُمان الذكية' : 'GIS Map Layers & Filters'}
                </h3>
              </div>

              {/* EV CHARGING STATIONS TOGGLE & FILTER */}
              <div className="space-y-2 p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-300">
                    <input
                      type="checkbox"
                      checked={showEvStations}
                      onChange={(e) => setShowEvStations(e.target.checked)}
                      className="accent-emerald-500 rounded cursor-pointer h-4 w-4"
                    />
                    <span>{isArabic ? 'محطات شحن المركبات (EV)' : 'EV Charging Stations'}</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                    2024–2027
                  </span>
                </div>

                {showEvStations && (
                  <div className="space-y-2 pt-1 border-t border-slate-800 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                        {isArabic ? 'حالة المحطات والجدول الزمني:' : 'Station Status & Timeline:'}
                      </label>
                      <select
                        value={evStatusFilter}
                        onChange={(e) => setEvStatusFilter(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-sans outline-none cursor-pointer focus:border-emerald-500"
                      >
                        <option value="ALL">{isArabic ? `جميع المحطات حتى 2027 (${baseStations.length})` : `All Stations until 2027 (${baseStations.length})`}</option>
                        <option value="OPERATIONAL">{isArabic ? `🟢 قائمة وعاملة حالياً (${baseStations.filter(s => s.status === 'OPERATIONAL').length})` : `🟢 Operational Existing (${baseStations.filter(s => s.status === 'OPERATIONAL').length})`}</option>
                        <option value="CONSTRUCTION_2025_2026">{isArabic ? `🟡 قيد التجهيز 2025-2026 (${baseStations.filter(s => s.status === 'UNDER_CONSTRUCTION_2025_2026').length})` : `🟡 Under Construction 2025-26 (${baseStations.filter(s => s.status === 'UNDER_CONSTRUCTION_2025_2026').length})`}</option>
                        <option value="PIPELINE_2027">{isArabic ? `🔵 خطة 2027 الميجاواط (${baseStations.filter(s => s.status === 'PLANNED_2027_PIPELINE').length})` : `🔵 2027 Megawatt Pipeline (${baseStations.filter(s => s.status === 'PLANNED_2027_PIPELINE').length})`}</option>
                        <option value="FREE_ZONES_ONLY">{isArabic ? `🏢 محطات المناطق الحرة فقط (${baseStations.filter(s => s.isFreeZoneHub).length})` : `🏢 Free Zone Hubs Only (${baseStations.filter(s => s.isFreeZoneHub).length})`}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                        {isArabic ? 'المحافظة والمنطقة في سلطنة عُمان:' : 'Governorate / Region across Oman:'}
                      </label>
                      <select
                        value={selectedRegionFilter}
                        onChange={(e) => setSelectedRegionFilter(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-sans outline-none cursor-pointer focus:border-emerald-500"
                      >
                        <option value="ALL">{isArabic ? `جميع أنحاء سلطنة عُمان (${baseStations.length})` : `All Regions of Oman (${baseStations.length})`}</option>
                        <option value="muscat">{isArabic ? `محافظة مسقط (${baseStations.filter(s => s.governorateEn.includes('Muscat')).length})` : `Muscat Governorate (${baseStations.filter(s => s.governorateEn.includes('Muscat')).length})`}</option>
                        <option value="batinah">{isArabic ? `شمال وجنوب الباطنة (${baseStations.filter(s => s.governorateEn.includes('Batinah')).length})` : `Al Batinah North & South (${baseStations.filter(s => s.governorateEn.includes('Batinah')).length})`}</option>
                        <option value="dakhiliyah">{isArabic ? `محافظة الداخلية (${baseStations.filter(s => s.governorateEn.includes('Dakhiliyah')).length})` : `Al Dakhiliyah (${baseStations.filter(s => s.governorateEn.includes('Dakhiliyah')).length})`}</option>
                        <option value="wusta">{isArabic ? `الوسطى وطريق صلالة (${baseStations.filter(s => s.governorateEn.includes('Wusta') || s.governorateEn.includes('Adam')).length})` : `Al Wusta & Highway (${baseStations.filter(s => s.governorateEn.includes('Wusta') || s.governorateEn.includes('Adam')).length})`}</option>
                        <option value="dhofar">{isArabic ? `محافظة ظفار (${baseStations.filter(s => s.governorateEn.includes('Dhofar')).length})` : `Dhofar Governorate (${baseStations.filter(s => s.governorateEn.includes('Dhofar')).length})`}</option>
                        <option value="sharqiyah">{isArabic ? `محافظة الشرقية (${baseStations.filter(s => s.governorateEn.includes('Sharqiyah')).length})` : `Al Sharqiyah (${baseStations.filter(s => s.governorateEn.includes('Sharqiyah')).length})`}</option>
                        <option value="dhahirah_buraimi">{isArabic ? `الظاهرة والبريمي (${baseStations.filter(s => s.governorateEn.includes('Dhahirah') || s.governorateEn.includes('Buraimi')).length})` : `Al Dhahirah & Buraimi (${baseStations.filter(s => s.governorateEn.includes('Dhahirah') || s.governorateEn.includes('Buraimi')).length})`}</option>
                        <option value="musandam_mazunah">{isArabic ? `مسندم والمزيونة (${baseStations.filter(s => s.governorateEn.includes('Musandam') || s.governorateEn.includes('Mazunah')).length})` : `Musandam & Al Mazunah (${baseStations.filter(s => s.governorateEn.includes('Musandam') || s.governorateEn.includes('Mazunah')).length})`}</option>
                      </select>
                    </div>

                    {/* Legend */}
                    <div className="pt-2 border-t border-slate-800 text-[10px] font-mono grid grid-cols-3 gap-1">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span>{isArabic ? 'عاملة' : 'Active'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                        <span>2025-26</span>
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400">
                        <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        <span>2027 MCS</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Ports & Free Zones Layer (Disabled by default to keep focus strictly on car stations with EV charge) */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showStrategicZones}
                    onChange={(e) => setShowStrategicZones(e.target.checked)}
                    className="accent-amber-500 rounded cursor-pointer h-4 w-4"
                  />
                  <span>{isArabic ? 'إظهار الموانئ والمناطق الحرة (طبقة اختيارية)' : 'Show Ports & Free Zones (Optional Layer)'}</span>
                </label>
              </div>

              {/* Feedstocks / Materials Layer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  {isArabic ? 'مصادر الطاقة والمواد الخام:' : 'Feedstocks & Renewable Sites:'}
                </label>
                <select 
                  value={selectedMaterialType || ''} 
                  onChange={(e) => setSelectedMaterialType(e.target.value === '' ? null : e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                >
                  <option value="">{isArabic ? 'إخفاء المواد الخام' : 'Hide Feedstocks'}</option>
                  <option value="all">{isArabic ? 'إظهار جميع المصادر' : 'Show All Feedstocks'}</option>
                  {MATERIAL_CATEGORIES.map(cat => (
                    <option key={`map-cat-${cat.id}`} value={cat.id}>{isArabic ? cat.labelAr : cat.labelEn}</option>
                  ))}
                </select>
              </div>

              {isFullScreen && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">{isArabic ? 'نقطة الانطلاق' : 'Origin'}</label>
                    <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs cursor-pointer">
                      {ZONES.map(z => <option key={`f-src-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase">{isArabic ? 'نقطة الوصول' : 'Destination'}</label>
                    <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs cursor-pointer">
                      {ZONES.map(z => <option key={`f-dst-${z.id}`} value={z.id}>{isArabic ? z.nameAr : z.nameEn}</option>)}
                    </select>
                  </div>
                </div>
              )}

            </div>
          </div>

          <MapContainer 
            center={centerOfOman} 
            zoom={6} 
            minZoom={5}
            maxBounds={omanBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%', background: '#090d16', borderRadius: isFullScreen ? '1rem' : '0' }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <MapResizer isFullScreen={isFullScreen} />
            
            {/* High-contrast Esri Dark Gray / World Street Map */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />

            {/* Strategic Free Zones and Logistics Cities (Disabled by default: only car stations with electrical charge shown) */}
            {showStrategicZones && ZONES.map(z => (
              <Marker key={z.id} position={[z.lat, z.lng]} icon={createCustomIcon(z.color, z.isPort ? 'fa-anchor' : 'fa-industry')}>
                <Popup className="custom-popup">
                  <div className="bg-slate-950 text-slate-100 p-3.5 rounded-xl border border-slate-800 shadow-2xl min-w-[220px]" dir={isArabic ? 'rtl' : 'ltr'}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: z.color }}></span>
                      <p className="text-sm font-black text-white m-0">{isArabic ? z.nameAr : z.nameEn}</p>
                    </div>
                    <p className="text-xs text-slate-400 m-0 mt-1 uppercase tracking-wider">{isArabic ? z.descAr : z.descEn}</p>
                    
                    {onNavigateToTab && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800">
                        <button
                          onClick={() => onNavigateToTab('ZONES')}
                          className="w-full text-center px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-amber-400 border border-amber-500/30 cursor-pointer transition-colors"
                        >
                          <i className="fas fa-arrow-up-right-from-square mr-1"></i>
                          {isArabic ? 'استكشف في قاعدة بيانات الطاقة' : 'View in Energy Zones DB'}
                        </button>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* EV Charging Stations Layer (Exclusively Oman Oil Company Network across Oman) */}
            {showEvStations && filteredEvStations.map(station => {
              const matchedStop = matchStationWithItinerary(station, voltOmanResult?.chargingItinerary);
              const isVoltStop = Boolean(matchedStop);

              return (
                <Marker
                  key={station.id}
                  position={[station.lat, station.lng]}
                  icon={createEvStationIcon(station.status, station.powerKw, isVoltStop, matchedStop?.stopIndex)}
                >
                  <Popup className="custom-popup">
                    <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl border border-slate-800 shadow-2xl min-w-[280px] max-w-[340px] font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
                      
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-900 border border-slate-700 text-slate-300">
                          {isArabic ? (station.governorateAr || station.zoneNameAr) : (station.governorateEn || station.zoneNameEn)}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          station.status === 'OPERATIONAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                          station.status === 'UNDER_CONSTRUCTION_2025_2026' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                        }`}>
                          {station.status === 'OPERATIONAL' ? (isArabic ? '🟢 عاملة 2024' : '🟢 Active 2024') :
                           station.status === 'UNDER_CONSTRUCTION_2025_2026' ? (isArabic ? '🟡 تجهيز 2025-26' : '🟡 Const. 2025-26') :
                           (isArabic ? '🔵 خطة 2027' : '🔵 Pipeline 2027')}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white leading-tight mb-1">
                        {isArabic ? station.nameAr : station.nameEn}
                      </h4>

                      <div className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-bolt-lightning text-amber-400 text-xs"></i>
                        <span>{isArabic ? station.operatorNameAr : station.operatorNameEn}</span>
                      </div>

                      {/* Verified Reality Address & Location */}
                      <div className="text-[11px] text-slate-300 mb-2.5 flex items-start gap-1.5 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <i className="fas fa-location-dot text-rose-400 mt-0.5 shrink-0 text-xs"></i>
                        <span className="leading-snug">
                          {isArabic 
                            ? ((station as any).realAddressAr || station.nameAr) 
                            : ((station as any).realAddressEn || station.nameEn)}
                        </span>
                      </div>

                      {/* Verified Electrical Charge Indicator */}
                      <div className="flex items-center justify-between gap-1 mb-2.5 text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-charging-station text-emerald-400"></i>
                          <span>{isArabic ? 'محطة سيارات مزودة بشحن كهربائي' : 'Car Station with EV Charging'}</span>
                        </span>
                        <span className="text-white font-bold">{station.powerKw} kW DC</span>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-2 gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono mb-2.5">
                        <div>
                          <span className="text-[9px] text-slate-400 block">{isArabic ? 'القدرة القصوى' : 'Max Power'}</span>
                          <span className="text-white font-bold text-xs">{station.powerKw} kW DC</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">{isArabic ? 'المنافذ المتاحة' : 'Live Availability'}</span>
                          <span className="text-emerald-400 font-bold">{station.availablePortsNow} / {station.portsCount} {isArabic ? 'متاح' : 'Ports'}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-800">
                          <span className="text-[9px] text-slate-400 block">{isArabic ? 'المقابس والتعرفة' : 'Connectors & Tariff'}</span>
                          <span className="text-slate-200">
                            {station.connectorTypes.join(' · ')} | <strong className="text-amber-400">{station.tariffOmrPerKwh.toFixed(3)} OMR/kWh</strong>
                          </span>
                        </div>
                      </div>

                      {/* VOLTOMAN PROGRAM DIRECT RESULTS LINKAGE */}
                      {isVoltStop && matchedStop ? (
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-emerald-950/60 border border-amber-500/50 text-[10px] space-y-1.5 mb-2.5 shadow-lg">
                          <div className="flex items-center justify-between text-amber-400 font-bold">
                            <span className="flex items-center gap-1.5">
                              <i className="fa-solid fa-bolt-lightning animate-pulse text-amber-300"></i>
                              <span>{isArabic ? `محطة شحن معتمدة بمسار VoltOman (#${matchedStop.stopIndex})` : `VoltOman Route Charging Stop #${matchedStop.stopIndex}`}</span>
                            </span>
                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                              +{matchedStop.energyAddedKwh.toFixed(1)} kWh
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] pt-1 border-t border-amber-500/20">
                            <div>
                              <span className="text-slate-400 block">{isArabic ? 'نسبة الوصول المتوقعة:' : 'Est. Arrival SOC:'}</span>
                              <strong className="text-emerald-400 text-xs">~{matchedStop.arrivalSocPct}%</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">{isArabic ? 'نسبة المغادرة المستهدفة:' : 'Target SOC:'}</span>
                              <strong className="text-cyan-400 text-xs">~{matchedStop.targetDepartureSocPct}%</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">{isArabic ? 'مدة الشحن المطلوبة:' : 'Dwell Time:'}</span>
                              <strong className="text-white text-xs">{matchedStop.chargingTimeMins} {isArabic ? 'دقيقة' : 'mins'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">{isArabic ? 'التكلفة التقديرية:' : 'Session Cost:'}</span>
                              <strong className="text-amber-300 text-xs">{matchedStop.estimatedCostOmr.toFixed(3)} OMR</strong>
                            </div>
                          </div>

                          <div className="text-[9px] text-slate-300 pt-1 border-t border-amber-500/20 flex items-center justify-between">
                            <span>{isArabic ? 'الحالة الحرارية:' : 'Thermal State:'}</span>
                            <span className={matchedStop.isMiddayDerated ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                              {matchedStop.isMiddayDerated 
                                ? (isArabic ? '⚠️ تقييد ذروة الحرارة (65%)' : '⚠️ Peak Derated (65%)') 
                                : (isArabic ? '✅ قدرة كاملة 100%' : '✅ 100% Full Speed')}
                            </span>
                          </div>
                        </div>
                      ) : activeVoltOmanRoute && (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono space-y-1 mb-2.5">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">{isArabic ? 'توافق مركبة VoltOman:' : 'VoltOman Vehicle:'}</span>
                            <span className="text-emerald-400 font-bold">{activeVoltOmanRoute.vehicleModelName?.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">{isArabic ? 'شحن تقديري (20%-80%):' : 'Est. Charge (20-80%):'}</span>
                            <span className="text-white font-bold">
                              ~{Math.round((activeVoltOmanRoute.batteryCapacityKwh * 0.60) / Math.min(station.powerKw, 250) * 60)} {isArabic ? 'دقيقة' : 'mins'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Energy Zones DB Linkage & Clean Energy Profile */}
                      {station.energyZoneLink && (
                        <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/25 text-[10px] space-y-1 mb-2.5">
                          <div className="flex items-center justify-between font-bold text-emerald-400">
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-solar-panel text-amber-400"></i>
                              <span>{station.energyZoneLink.totalCleanPowerMw} MW {isArabic ? 'طاقة نظيفة' : 'Clean Grid'}</span>
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {isArabic ? station.energyZoneLink.zoneTypeAr : station.energyZoneLink.zoneTypeEn}
                            </span>
                          </div>
                          <div className="text-slate-300 text-[9px] line-clamp-1">
                            <strong className="text-white">{isArabic ? 'شركات مرتبطة:' : 'Key Partner:'}</strong> {station.energyZoneLink.linkedCompanies.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Free Zone Synergy Note */}
                      <p className="text-[10px] text-slate-300 leading-relaxed italic bg-slate-900/60 p-2 rounded-lg border border-slate-800 mb-2.5">
                        "{isArabic ? station.freeZoneSynergyAr : station.freeZoneSynergyEn}"
                      </p>

                      {/* Direct Links to Energy Zones DB & VoltOman */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            if (onSelectStationForEnergyZone) {
                              onSelectStationForEnergyZone(station);
                            } else if (onNavigateToTab) {
                              onNavigateToTab('ZONES');
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold cursor-pointer transition-colors text-center flex items-center justify-center gap-1"
                          title={isArabic ? 'عرض ملف منطقة الطاقة' : 'Inspect Energy Zone in DB'}
                        >
                          <i className="fas fa-building-columns"></i>
                          <span>{isArabic ? 'ملف منطقة الطاقة' : 'Energy Zone DB'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (onSelectStationForRoute) {
                              onSelectStationForRoute(station);
                            } else if (onNavigateToTab) {
                              onNavigateToTab('PROPOSAL');
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold cursor-pointer transition-colors text-center flex items-center justify-center gap-1"
                          title={isArabic ? 'حساب الاستهلاك للمحطة في VoltOman' : 'Simulate Route in VoltOman'}
                        >
                          <i className="fas fa-bolt-lightning"></i>
                          <span>{isArabic ? 'حساب المسار (Volt)' : 'Route in VoltOman'}</span>
                        </button>
                      </div>

                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Raw materials markers if enabled */}
            {selectedMaterialType && RAW_MATERIALS.filter(r => selectedMaterialType === 'all' || r.type === selectedMaterialType).map(r => (
              <Marker key={r.id} position={[r.lat, r.lng]} icon={createRawMaterialIcon(r.color, r.icon)}>
                <Popup className="custom-popup">
                  <div className="bg-white shadow-xl border border-gray-100 px-4 py-3 rounded-xl text-center" dir={isArabic ? 'rtl' : 'ltr'}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <i className={`fas ${r.icon} text-xs`} style={{ color: r.color }}></i>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest m-0">{isArabic ? r.typeAr : r.typeEn}</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 m-0 leading-tight">{isArabic ? r.nameAr : r.nameEn}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Route geometry line */}
            {routeGeometry && routeGeometry.length > 0 && (
              <Polyline 
                positions={routeGeometry} 
                pathOptions={{ 
                  color: '#ffffff', 
                  weight: 10, 
                  opacity: 0.9,
                  lineJoin: 'round'
                }} 
              />
            )}
            {routeGeometry && routeGeometry.length > 0 && (
              <Polyline 
                positions={routeGeometry} 
                pathOptions={{ 
                  color: '#10b981', 
                  weight: 5, 
                  opacity: 1,
                  lineJoin: 'round',
                  dashArray: '8, 12',
                }} 
              />
            )}
          </MapContainer>
        </div>

        {/* LOGISTICS CALCULATOR & FREIGHT SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-glow)] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isArabic ? 'نقطة الانطلاق (المصدر)' : 'Origin Logistics Node'}
            </h4>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-3 py-2 text-xs font-bold"
            >
              {ZONES.map(z => (
                <option key={`src-${z.id}`} value={z.id}>
                  {isArabic ? z.nameAr : z.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-glow)] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isArabic ? 'نقطة الوصول (الوجهة)' : 'Destination Terminal'}
            </h4>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[var(--text-primary)] rounded-xl px-3 py-2 text-xs font-bold"
            >
              {ZONES.map(z => (
                <option key={`dest-${z.id}`} value={z.id}>
                  {isArabic ? z.nameAr : z.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-glow)] flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isArabic ? 'مسافة المسار اللوجستي' : 'Route Distance'}
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {results?.distance || 0} <span className="text-xs text-slate-400">km</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              ~{results?.travelTime || 0} {isArabic ? 'ساعات قيادة' : 'driving hours'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GisMap;
