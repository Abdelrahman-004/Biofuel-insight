import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VoltOmanInput, 
  VoltOmanResult, 
  VoltOmanChargingStop 
} from './types';
import { calculateVoltOmanEngine } from './server/omanEvEngine';
import { analyzeVoltOmanRoute } from './geminiService';
import { CustomMarkdown } from './CustomMarkdown';
import { GisMap } from './GisMap';
import { 
  EV_CHARGING_STATIONS, 
  EvChargingStation, 
  ENERGY_ZONES_DATABASE, 
  EnergyZoneLink, 
  EV_STATION_OPERATORS 
} from './evStationsData';

interface VoltOmanEngineProps {
  language: 'English' | 'Arabic';
  onAnalysisRequest?: (fn: () => Promise<void>) => void;
  userPlan?: string;
  onUpgrade?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

// Preset real-world vehicle profiles with certified manufacturer specs
const EV_VEHICLE_DATABASE = [
  {
    id: 'tesla_model_y_lr',
    name: 'Tesla Model Y Long Range AWD',
    batteryKwh: 75,
    ratingKwhPerKm: 0.170,
    massKg: 1980,
    maxDcKw: 250,
  },
  {
    id: 'porsche_taycan_4s',
    name: 'Porsche Taycan 4S (Performance Plus)',
    batteryKwh: 93.4,
    ratingKwhPerKm: 0.205,
    massKg: 2220,
    maxDcKw: 270,
  },
  {
    id: 'byd_seal_awd',
    name: 'BYD Seal Excellence AWD',
    batteryKwh: 82.5,
    ratingKwhPerKm: 0.165,
    massKg: 2150,
    maxDcKw: 150,
  },
  {
    id: 'hyundai_ioniq_5',
    name: 'Hyundai Ioniq 5 Long Range AWD',
    batteryKwh: 77.4,
    ratingKwhPerKm: 0.180,
    massKg: 2020,
    maxDcKw: 235,
  },
  {
    id: 'lucid_air_gt',
    name: 'Lucid Air Grand Touring',
    batteryKwh: 112,
    ratingKwhPerKm: 0.155,
    massKg: 2360,
    maxDcKw: 300,
  },
  {
    id: 'audi_q8_etron',
    name: 'Audi Q8 e-tron 55 quattro',
    batteryKwh: 106,
    ratingKwhPerKm: 0.235,
    massKg: 2565,
    maxDcKw: 170,
  },
  {
    id: 'custom_ev',
    name: 'Custom EV Parameters (Manual Input)',
    batteryKwh: 75,
    ratingKwhPerKm: 0.180,
    massKg: 2100,
    maxDcKw: 150,
  }
];

// Preset Oman Highway Corridors
const PRESET_ROUTES: Array<{
  id: string;
  nameEn: string;
  nameAr: string;
  corridor: 'Adam-Thumrait-Salalah' | 'Batinah' | 'Nizwa Road' | 'Sharqiyah' | 'Duqm SEZ';
  distanceKm: number;
  uphillMeters: number;
  downhillMeters: number;
  ambientTempC: number;
  timeOfDayHour: number;
  descEn: string;
  descAr: string;
}> = [
  {
    id: 'muscat_salalah_desert',
    nameEn: 'Muscat ➔ Salalah Desert Highway (Adam-Thumrait)',
    nameAr: 'مسار مسقط ➔ صلالة عبر طريق أدم-ثمريت الصحراوي',
    corridor: 'Adam-Thumrait-Salalah',
    distanceKm: 1020,
    uphillMeters: 450,
    downhillMeters: 450,
    ambientTempC: 45,
    timeOfDayHour: 13,
    descEn: 'The legendary 1,020 km desert crossing. Severe ambient heat (45°C), active midday charger thermal derating, and 4 high-power charging waypoints.',
    descAr: 'الرحلة الصحراوية الشهيرة بطول 1,020 كم. حرارة شديدة (45° م)، وتفعيل تقييد سرعة الشواحن وقت الظهيرة، مع 4 محطات شحن استراتيجية.'
  },
  {
    id: 'muscat_jabal_akhdar',
    nameEn: 'Muscat ➔ Jabal Akhdar Mountain Climb',
    nameAr: 'مسار مسقط ➔ الجبل الأخضر (صعود وهبوط حاد)',
    corridor: 'Nizwa Road',
    distanceKm: 165,
    uphillMeters: 2010,
    downhillMeters: 0,
    ambientTempC: 38,
    timeOfDayHour: 10,
    descEn: 'Extreme vertical ascent (+2,010m climb) from coastal sea level to the Saiq Plateau summit, testing gravitational elevation penalty (+2.5 kWh/1,000m).',
    descAr: 'صعود جبلي شاهق (+2,010 م) من مستوى سطح البحر إلى قمة هضبة سيق، لاختبار معادلة جزاء الصعود الجبلي (+2.5 ك.و.س لكل 1,000م).'
  },
  {
    id: 'jabal_akhdar_descent',
    nameEn: 'Jabal Akhdar Summit ➔ Birkat Al Mouz (Regen Test)',
    nameAr: 'هبوط قمة الجبل الأخضر ➔ بركة الموز (اختبار المكابح التجديدية)',
    corridor: 'Nizwa Road',
    distanceKm: 35,
    uphillMeters: 0,
    downhillMeters: 1430,
    ambientTempC: 32,
    timeOfDayHour: 16,
    descEn: 'Pure steep mountain descent (-1,430m drop) recovering 60% potential kinetic energy through regenerative braking formula E_regen = m*g*h*0.60.',
    descAr: 'هبوط جبلي حاد (-1,430 م) يختبر استرداد 60% من طاقة الوضع بالفرامل التجديدية: E_regen = m*g*h*0.60.'
  },
  {
    id: 'muscat_sohar_batinah',
    nameEn: 'Muscat ➔ Sohar Mega Freezone (Al Batinah Expressway)',
    nameAr: 'مسار مسقط ➔ المنطقة الحرة بصحار (طريق الباطنة السريع)',
    corridor: 'Batinah',
    distanceKm: 220,
    uphillMeters: 50,
    downhillMeters: 50,
    ambientTempC: 41,
    timeOfDayHour: 14,
    descEn: 'High-speed 120 km/h coastal expressway transit connecting capital logistics to Sohar Industrial Port, testing high ambient temp factor F_temp.',
    descAr: 'طريق الباطنة السريع بسرعة 120 كم/س يربط العاصمة بميناء صحار الصناعي مع فحص تأثير الحرارة المحيطة العالية.'
  },
  {
    id: 'muscat_sur_sharqiyah',
    nameEn: 'Muscat ➔ Sur Coastal Port (Sharqiyah Expressway)',
    nameAr: 'مسار مسقط ➔ مدينة صور البحرية (طريق الشرقية السريع)',
    corridor: 'Sharqiyah',
    distanceKm: 215,
    uphillMeters: 380,
    downhillMeters: 380,
    ambientTempC: 37,
    timeOfDayHour: 9,
    descEn: 'Transit through Wadi Al Aqq viaducts and Eastern Hajar passes with moderate morning temperatures and coastal finish.',
    descAr: 'عبور جسور وادي العق ومنحنيات جبال الحجر الشرقي مع درجات حرارة صباحية معتدلة ووصول ساحلي.'
  }
];

export const VoltOmanEngine: React.FC<VoltOmanEngineProps> = ({
  language,
  onAnalysisRequest,
  userPlan,
  onUpgrade,
  onNavigateToTab,
}) => {
  const isArabic = language === 'Arabic';

  // Active Preset & Route State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('muscat_salalah_desert');
  const [routeNameEn, setRouteNameEn] = useState('Muscat ➔ Salalah Desert Highway (Adam-Thumrait)');
  const [routeNameAr, setRouteNameAr] = useState('مسار مسقط ➔ صلالة عبر طريق أدم-ثمريت الصحراوي');
  const [highwayCorridor, setHighwayCorridor] = useState<'Adam-Thumrait-Salalah' | 'Batinah' | 'Nizwa Road' | 'Sharqiyah' | 'Duqm SEZ' | 'Custom'>('Adam-Thumrait-Salalah');
  const [distanceKm, setDistanceKm] = useState<number>(1020);
  const [uphillGainMeters, setUphillGainMeters] = useState<number>(450);
  const [downhillLossMeters, setDownhillLossMeters] = useState<number>(450);
  const [ambientTempC, setAmbientTempC] = useState<number>(45);
  const [timeOfDayHour, setTimeOfDayHour] = useState<number>(13);

  // Vehicle Parameters State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('tesla_model_y_lr');
  const [vehicleModelName, setVehicleModelName] = useState('Tesla Model Y Long Range AWD');
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState<number>(75);
  const [manufacturerRatingKwhPerKm, setManufacturerRatingKwhPerKm] = useState<number>(0.170);
  const [vehicleMassKg, setVehicleMassKg] = useState<number>(1980);
  const [maxDcChargingSpeedKw, setMaxDcChargingSpeedKw] = useState<number>(250);
  const [initialSocPct, setInitialSocPct] = useState<number>(90);
  const [minArrivalSocBufferPct, setMinArrivalSocBufferPct] = useState<number>(15);

  // View Mode & Result State (Included GIS EV Map Layer)
  const [activeViewTab, setActiveViewTab] = useState<'COCKPIT' | 'ITINERARY' | 'GIS_MAP'>('COCKPIT');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VoltOmanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [routeAppliedMessage, setRouteAppliedMessage] = useState<string | null>(null);

  // EV Stations & Energy Zones State (Interconnected Layer)
  const [stationsList, setStationsList] = useState<EvChargingStation[]>(EV_CHARGING_STATIONS);
  const [isSyncingTelemetry, setIsSyncingTelemetry] = useState<boolean>(false);
  const [lastTelemetrySyncTime, setLastTelemetrySyncTime] = useState<string>('Live (100% Online)');
  const [directorySearchQuery, setDirectorySearchQuery] = useState<string>('');
  const [directoryZoneFilter, setDirectoryZoneFilter] = useState<string>('ALL');
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState<'ALL' | 'OPERATIONAL' | 'CONSTRUCTION_2025_2026' | 'PIPELINE_2027' | 'FREE_ZONES_ONLY'>('ALL');
  const [directoryOperatorFilter, setDirectoryOperatorFilter] = useState<string>('ALL');
  const [selectedZoneForDossier, setSelectedZoneForDossier] = useState<EnergyZoneLink | null>(null);
  const [selectedStationForModal, setSelectedStationForModal] = useState<EvChargingStation | null>(null);

  const handleRefreshLiveTelemetry = () => {
    setIsSyncingTelemetry(true);
    setTimeout(() => {
      setStationsList(prev => prev.map(st => {
        if (st.status === 'OPERATIONAL') {
          const randomFree = Math.floor(Math.random() * (st.portsCount + 1));
          const occPct = Math.round(((st.portsCount - randomFree) / st.portsCount) * 100);
          return {
            ...st,
            availablePortsNow: randomFree,
            realtimeOccupancyPct: occPct
          };
        }
        return st;
      }));
      setIsSyncingTelemetry(false);
      const now = new Date();
      setLastTelemetrySyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} (Nama CPO Grid API)`);
    }, 600);
  };

  const handleInspectZoneFromStation = (station: EvChargingStation) => {
    const zoneData = station.energyZoneLink || ENERGY_ZONES_DATABASE[station.zoneId] || null;
    setSelectedStationForModal(station);
    setSelectedZoneForDossier(zoneData);
  };

  const handleInspectZoneById = (zoneId: string) => {
    const zoneData = ENERGY_ZONES_DATABASE[zoneId] || null;
    setSelectedStationForModal(null);
    setSelectedZoneForDossier(zoneData);
  };

  // Run calculation immediately on load with default scenario
  useEffect(() => {
    executeVoltOmanAnalysis();
  }, []);

  const handleSelectPreset = (preset: typeof PRESET_ROUTES[0]) => {
    setSelectedPresetId(preset.id);
    setRouteNameEn(preset.nameEn);
    setRouteNameAr(preset.nameAr);
    setHighwayCorridor(preset.corridor);
    setDistanceKm(preset.distanceKm);
    setUphillGainMeters(preset.uphillMeters);
    setDownhillLossMeters(preset.downhillMeters);
    setAmbientTempC(preset.ambientTempC);
    setTimeOfDayHour(preset.timeOfDayHour);

    const input: VoltOmanInput = {
      routeNameEn: preset.nameEn,
      routeNameAr: preset.nameAr,
      highwayCorridor: preset.corridor,
      distanceKm: preset.distanceKm,
      manufacturerRatingKwhPerKm,
      batteryCapacityKwh,
      initialSocPct,
      minArrivalSocBufferPct,
      ambientTempC: preset.ambientTempC,
      timeOfDayHour: preset.timeOfDayHour,
      uphillGainMeters: preset.uphillMeters,
      downhillLossMeters: preset.downhillMeters,
      vehicleMassKg,
      vehicleModelName,
      maxDcChargingSpeedKw,
      language
    };

    const immediateRes = calculateVoltOmanEngine(input);
    setResult(immediateRes);
  };

  const handleSelectVehicle = (vehicle: typeof EV_VEHICLE_DATABASE[0]) => {
    setSelectedVehicleId(vehicle.id);
    setVehicleModelName(vehicle.name);
    setBatteryCapacityKwh(vehicle.batteryKwh);
    setManufacturerRatingKwhPerKm(vehicle.ratingKwhPerKm);
    setVehicleMassKg(vehicle.massKg);
    setMaxDcChargingSpeedKw(vehicle.maxDcKw);

    const input: VoltOmanInput = {
      routeNameEn,
      routeNameAr,
      highwayCorridor,
      distanceKm,
      manufacturerRatingKwhPerKm: vehicle.ratingKwhPerKm,
      batteryCapacityKwh: vehicle.batteryKwh,
      initialSocPct,
      minArrivalSocBufferPct,
      ambientTempC,
      timeOfDayHour,
      uphillGainMeters,
      downhillLossMeters,
      vehicleMassKg: vehicle.massKg,
      vehicleModelName: vehicle.name,
      maxDcChargingSpeedKw: vehicle.maxDcKw,
      language
    };
    const immediateRes = calculateVoltOmanEngine(input);
    setResult(immediateRes);
  };

  const executeVoltOmanAnalysis = async () => {
    setErrorMsg(null);
    setLoading(true);

    const inputData: VoltOmanInput = {
      routeNameEn,
      routeNameAr,
      highwayCorridor,
      distanceKm: Number(distanceKm),
      manufacturerRatingKwhPerKm: Number(manufacturerRatingKwhPerKm),
      batteryCapacityKwh: Number(batteryCapacityKwh),
      initialSocPct: Number(initialSocPct),
      minArrivalSocBufferPct: Number(minArrivalSocBufferPct),
      ambientTempC: Number(ambientTempC),
      timeOfDayHour: Number(timeOfDayHour),
      uphillGainMeters: Number(uphillGainMeters),
      downhillLossMeters: Number(downhillLossMeters),
      vehicleMassKg: Number(vehicleMassKg),
      vehicleModelName,
      maxDcChargingSpeedKw: Number(maxDcChargingSpeedKw),
      language
    };

    const localResult = calculateVoltOmanEngine(inputData);
    setResult(localResult);

    const runCall = async () => {
      try {
        const aiResult = await analyzeVoltOmanRoute(inputData);
        if (aiResult) {
          setResult(aiResult);
        }
      } catch (err: any) {
        console.warn('VoltOman AI route analysis defaulted to deterministic precision engine:', err);
      } finally {
        setLoading(false);
      }
    };

    if (onAnalysisRequest) {
      onAnalysisRequest(runCall);
    } else {
      await runCall();
    }
  };

  // Helper to apply station as corridor
  const handleApplyStationAsRoute = (station: EvChargingStation) => {
    let corridor: any = 'Adam-Thumrait-Salalah';
    let dist = 550;
    let elevUp = 300;
    let elevDown = 200;
    let temp = 43;

    if (station.zoneId === 'sohar') {
      corridor = 'Batinah';
      dist = 220;
      elevUp = 80;
      elevDown = 70;
      temp = 41;
    } else if (station.zoneId === 'nizwa') {
      corridor = 'Nizwa Road';
      dist = 165;
      elevUp = 650;
      elevDown = 120;
      temp = 39;
    } else if (station.zoneId === 'sur') {
      corridor = 'Sharqiyah';
      dist = 215;
      elevUp = 380;
      elevDown = 380;
      temp = 37;
    } else if (station.zoneId === 'salalah') {
      corridor = 'Adam-Thumrait-Salalah';
      dist = 1020;
      elevUp = 450;
      elevDown = 450;
      temp = 45;
    } else if (station.zoneId === 'duqm') {
      corridor = 'Duqm SEZ';
      dist = 485;
      elevUp = 250;
      elevDown = 250;
      temp = 44;
    } else if (station.zoneId === 'khazaen') {
      corridor = 'Batinah';
      dist = 70;
      elevUp = 60;
      elevDown = 60;
      temp = 40;
    } else if (station.zoneId === 'rusayl') {
      corridor = 'Custom';
      dist = 35;
      elevUp = 120;
      elevDown = 120;
      temp = 38;
    } else if (station.zoneId === 'mazunah') {
      corridor = 'Adam-Thumrait-Salalah';
      dist = 1280;
      elevUp = 800;
      elevDown = 600;
      temp = 42;
    }

    setHighwayCorridor(corridor);
    setDistanceKm(dist);
    setUphillGainMeters(elevUp);
    setDownhillLossMeters(elevDown);
    setAmbientTempC(temp);
    setRouteNameEn(`Muscat ➔ ${station.nameEn}`);
    setRouteNameAr(`مسقط ➔ ${station.nameAr}`);
    setActiveViewTab('COCKPIT');
    setRouteAppliedMessage(isArabic ? `تم تطبيق مسار محطة: ${station.nameAr}` : `Loaded route corridor for: ${station.nameEn}`);

    const input: VoltOmanInput = {
      routeNameEn: `Muscat ➔ ${station.nameEn}`,
      routeNameAr: `مسقط ➔ ${station.nameAr}`,
      highwayCorridor: corridor,
      distanceKm: dist,
      ambientTempC: temp,
      timeOfDayHour,
      initialSocPct,
      minArrivalSocBufferPct,
      vehicleModelName,
      batteryCapacityKwh,
      manufacturerRatingKwhPerKm,
      vehicleMassKg,
      maxDcChargingSpeedKw,
      uphillGainMeters: elevUp,
      downhillLossMeters: elevDown
    };
    const freshRes = calculateVoltOmanEngine(input);
    setResult(freshRes);

    setTimeout(() => setRouteAppliedMessage(null), 3500);
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fullMarkdownReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2200);
  };

  const isMiddayWindow = timeOfDayHour >= 11 && timeOfDayHour <= 16;
  const isThermalDeratingActive = ambientTempC > 42 && isMiddayWindow;

  let tempFactorText = 'F_temp = 1.00 (Nominal baseline)';
  if (ambientTempC > 30 && ambientTempC <= 40) {
    tempFactorText = 'F_temp = 1.10 (+10% A/C load)';
  } else if (ambientTempC > 40) {
    const factor = (1.18 + (ambientTempC - 40) * 0.01).toFixed(3);
    tempFactorText = `F_temp = 1.18 + ((${ambientTempC} - 40) × 0.01) = ${factor}`;
  }

  return (
    <div className={`space-y-8 font-sans ${isArabic ? 'rtl' : 'ltr'}`}>
      
      {/* ---------------------------------------------------- */}
      {/* 1. HERO COCKPIT HEADER                               */}
      {/* ---------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt-lightning text-amber-400" />
                VoltOman Engine v2.5
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Sultanate of Oman EV Mobility & GIS Co-Pilot
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{isArabic ? 'محرك VoltOman للمركبات الكهربائية' : 'VoltOman Engine'}</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 font-normal">
                {isArabic ? 'تحليل استهلاك الطاقة & شبكة محطات الشحن' : 'Route, Battery & GIS Stations Network'}
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {isArabic 
                ? 'نظام ذكاء اصطناعي وحسابي دقيق مصمم خصيصاً لجغرافيا سلطنة عُمان وطقسها الصحراوي القاسي. يدمج خريطة نظم المعلومات الجغرافية (GIS) لكافة محطات الشحن بالمناطق الحرة حتى عام 2027 مع قاعدة بيانات الطاقة ورؤية 2040.'
                : 'Enterprise-grade AI co-pilot calculating precise EV battery consumption, elevation physics, midday thermal derating, and real-time GIS locations of all EV charging stations across Oman’s Free Zones through 2027.'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isArabic ? 'طبقة GIS: 21 محطة حتى 2027' : 'GIS Layer: 21 Stations Thru 2027'}</span>
            </div>

            <button
              onClick={executeVoltOmanAnalysis}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-play'}`} />
              <span>{loading ? (isArabic ? 'جاري التحليل...' : 'Computing Telemetry...') : (isArabic ? 'إعادة حساب المسار' : 'Compute Telemetry')}</span>
            </button>
          </div>
        </div>

        {routeAppliedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono"
          >
            <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
            <span>{routeAppliedMessage}</span>
          </motion.div>
        )}

        {/* Real-time Highway Corridor Preset Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-map-location-dot text-emerald-400" />
            <span>{isArabic ? 'مسارات سلطنة عُمان النموذجية الجاهزة:' : 'Oman Key Highway Route Presets:'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
            {PRESET_ROUTES.map((route) => {
              const isSelected = selectedPresetId === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => handleSelectPreset(route)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">
                    {isArabic ? route.nameAr : route.nameEn}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400">{route.distanceKm} km</span>
                    <span className="text-amber-400">{route.ambientTempC}°C</span>
                    <span>{route.timeOfDayHour}:00</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. PARAMETERS & COCKPIT CONTROLS                     */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VEHICLE & ROUTE PARAMETERS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* VEHICLE SELECTOR CARD */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-car text-cyan-400" />
                {isArabic ? 'مواصفات المركبة الكهربائية' : 'EV Vehicle Specifications'}
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                {batteryCapacityKwh} kWh / {maxDcChargingSpeedKw} kW DC
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                {isArabic ? 'اختر الطراز أو التخصيص:' : 'Select Vehicle Model or Preset:'}
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => {
                  const match = EV_VEHICLE_DATABASE.find(v => v.id === e.target.value);
                  if (match) handleSelectVehicle(match);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
              >
                {EV_VEHICLE_DATABASE.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.batteryKwh} kWh, {v.ratingKwhPerKm} kWh/km)
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle spec sliders */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isArabic ? 'سعة البطارية' : 'Pack Capacity'}</span>
                  <span className="font-mono text-cyan-400 font-bold">{batteryCapacityKwh} kWh</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="130"
                  step="1"
                  value={batteryCapacityKwh}
                  onChange={(e) => setBatteryCapacityKwh(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isArabic ? 'الاستهلاك القياسي' : 'Rating (kWh/km)'}</span>
                  <span className="font-mono text-emerald-400 font-bold">{manufacturerRatingKwhPerKm}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.30"
                  step="0.005"
                  value={manufacturerRatingKwhPerKm}
                  onChange={(e) => setManufacturerRatingKwhPerKm(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isArabic ? 'شحنة البداية' : 'Initial SOC'}</span>
                  <span className="font-mono text-amber-400 font-bold">{initialSocPct}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={initialSocPct}
                  onChange={(e) => setInitialSocPct(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isArabic ? 'كتلة المركبة' : 'Vehicle Mass'}</span>
                  <span className="font-mono text-slate-200 font-bold">{vehicleMassKg} kg</span>
                </div>
                <input
                  type="range"
                  min="1400"
                  max="3000"
                  step="50"
                  value={vehicleMassKg}
                  onChange={(e) => setVehicleMassKg(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* ROUTE & ENVIRONMENTAL CLIMATE CARD */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-route text-emerald-400" />
                {isArabic ? 'معايير المسار وبيئة عُمان' : 'Route & Desert Climate Parameters'}
              </h2>
              <span className="text-[11px] font-mono text-emerald-400">
                {highwayCorridor}
              </span>
            </div>

            {/* Distance slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  {isArabic ? 'مسافة المسار الكلية:' : 'Total Route Distance:'}
                </span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="1200"
                step="5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Ambient Temperature slider & Rule 2 Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <i className="fa-solid fa-temperature-arrow-up text-rose-400" />
                  {isArabic ? 'درجة الحرارة المحيطة الصحراوية:' : 'Desert Ambient Temperature:'}
                </span>
                <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                  ambientTempC > 42 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  ambientTempC > 30 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {ambientTempC}°C
                </span>
              </div>
              
              <input
                type="range"
                min="20"
                max="52"
                step="1"
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />

              <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold">Rule 2 (F_temp): </span>
                {tempFactorText}
              </div>
            </div>

            {/* Time of Day Slider & Rule 4 Midday Derating preview */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <i className="fa-solid fa-clock text-amber-400" />
                  {isArabic ? 'توقيت الرحلة (ساعة اليوم):' : 'Time of Day (24h Clock):'}
                </span>
                <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                  {timeOfDayHour.toString().padStart(2, '0')}:00 {isMiddayWindow ? '(Midday Peak)' : ''}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="23"
                step="1"
                value={timeOfDayHour}
                onChange={(e) => setTimeOfDayHour(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />

              {/* Rule 4 Badge */}
              <div className={`p-2 rounded-lg border text-xs font-sans leading-tight ${
                isThermalDeratingActive
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <div className="font-bold font-mono flex items-center gap-1.5">
                  <i className={`fa-solid ${isThermalDeratingActive ? 'fa-triangle-exclamation text-rose-400' : 'fa-check text-emerald-400'}`} />
                  {isArabic ? 'معيار تقييد شواحن الظهيرة (قاعدة 4):' : 'Midday Fast Charger Derating (Rule 4):'}
                </div>
                <div className="mt-1 text-[11px]">
                  {isThermalDeratingActive 
                    ? (isArabic ? '⚠️ مفعل: الحرارة > 42° م في ذروة الظهيرة (11:00-16:00). أقصى سرعة شحن مقيدة بـ 65% لحماية الشواحن.' : '⚠️ ACTIVE: Temp > 42°C during midday (11:00-16:00). Fast chargers capped at 65% max rated capacity.')
                    : (isArabic ? '✅ غير مقيد: إما أن الحرارة ≤ 42° م أو أن التوقيت خارج فترة الظهيرة.' : '✅ NOMINAL: Either temp ≤ 42°C or travel is outside midday peak.')
                  }
                </div>
              </div>
            </div>

            {/* Topography: Uphill & Downhill Sliders (Rule 3) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isArabic ? 'صعود جبلي (+)' : 'Uphill Gain (+)'}</span>
                  <span className="font-mono text-rose-400 font-bold">+{uphillGainMeters}m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={uphillGainMeters}
                  onChange={(e) => setUphillGainMeters(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  +2.5 kWh / 1,000m
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{isArabic ? 'انحدار تجديدي (-)' : 'Downhill Loss (-)'}</span>
                  <span className="font-mono text-teal-400 font-bold">-{downhillLossMeters}m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={downhillLossMeters}
                  onChange={(e) => setDownhillLossMeters(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  60% regen (m*g*h)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME VERDICT & TABBED PANELS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB BAR (WITH GIS EV MAP TAB) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveViewTab('COCKPIT')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeViewTab === 'COCKPIT'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <i className="fa-solid fa-gauge-high" />
              <span>{isArabic ? 'لوحة القيادة والجدوى' : 'Verdict & Cockpit'}</span>
            </button>

            <button
              onClick={() => setActiveViewTab('ITINERARY')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeViewTab === 'ITINERARY'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <i className="fa-solid fa-charging-station" />
              <span>{isArabic ? 'محطات الرحلة (OOMCO EV)' : 'Trip Itinerary (OOMCO)'}</span>
              {result && result.chargingItinerary.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeViewTab === 'ITINERARY' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {result.chargingItinerary.length}
                </span>
              )}
            </button>

            {/* GIS REAL-TIME EV LAYER TAB (OOMCO STATIONS ACROSS OMAN) */}
            <button
              onClick={() => setActiveViewTab('GIS_MAP')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeViewTab === 'GIS_MAP'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <i className="fa-solid fa-map-location-dot" />
              <span>{isArabic ? 'خريطة محطات شحن نفط عُمان (GIS)' : 'OOMCO GIS EV Map'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeViewTab === 'GIS_MAP' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {stationsList.length}
              </span>
            </button>
          </div>

          {result && (
            <div className="space-y-6">

              {/* -------------------------------------------------- */}
              {/* TAB 1: COCKPIT & FEASIBILITY VERDICT               */}
              {/* -------------------------------------------------- */}
              {activeViewTab === 'COCKPIT' && (
                <div className="space-y-6">
                  
                  {/* HERO VERDICT BADGE */}
                  <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
                    result.feasibilityVerdict === 'DIRECT_REACHABLE'
                      ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/40 text-emerald-200'
                      : result.feasibilityVerdict === 'FEASIBLE_WITH_CHARGES'
                      ? 'bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border-cyan-500/40 text-cyan-200'
                      : 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono tracking-widest uppercase opacity-75">
                          {isArabic ? 'قرار جدوى المسار — محرك VoltOman' : 'Route Feasibility Verdict'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                          <i className={`fa-solid ${
                            result.feasibilityVerdict === 'DIRECT_REACHABLE' ? 'fa-circle-check text-emerald-400' :
                            result.feasibilityVerdict === 'FEASIBLE_WITH_CHARGES' ? 'fa-charging-station text-cyan-400' :
                            'fa-triangle-exclamation text-rose-400'
                          }`} />
                          {isArabic ? result.verdictTitleAr : result.verdictTitleEn}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-400 block">
                          ENGINE:
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {result.executionEngine}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-200 leading-relaxed font-sans">
                      {isArabic ? result.verdictSummaryAr : result.verdictSummaryEn}
                    </p>

                    {/* TOP STAT SUMMARY TILES */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10">
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {isArabic ? 'صافي الطاقة المستهلكة' : 'Net Energy Consumed'}
                        </span>
                        <span className="text-lg font-mono font-bold text-white mt-0.5 block">
                          {result.telemetry.totalNetEnergyKwh} <span className="text-xs text-slate-400">kWh</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {isArabic ? 'كفاءة المسار الفعلية' : 'Effective Efficiency'}
                        </span>
                        <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">
                          {result.telemetry.effectiveEfficiencyKwhPerKm} <span className="text-xs text-slate-400">kWh/km</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {isArabic ? 'إجمالي زمن الرحلة' : 'Total Trip Duration'}
                        </span>
                        <span className="text-lg font-mono font-bold text-amber-400 mt-0.5 block">
                          {Math.floor(result.totalTripTimeMins / 60)}h {result.totalTripTimeMins % 60}m
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {isArabic ? 'تكلفة الشحن التقديرية' : 'Total Charging Cost'}
                        </span>
                        <span className="text-lg font-mono font-bold text-cyan-400 mt-0.5 block">
                          {result.totalTripCostOmr.toFixed(3)} <span className="text-xs text-slate-400">OMR</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BATTERY HEALTH & THERMAL MITIGATION ADVICE */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <i className="fa-solid fa-shield-heart" />
                      {isArabic ? 'إرشادات سلامة البطارية والتبريد الصحراوي (Thermal Mitigation Advice)' : 'Battery Health & Thermal Mitigation Advice'}
                    </h4>

                    <div className="space-y-2.5">
                      {(isArabic ? result.batteryThermalMitigationAdviceAr : result.batteryThermalMitigationAdviceEn).map((advice, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-200 leading-relaxed font-sans">
                          <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{advice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}



              {/* -------------------------------------------------- */}
              {/* TAB 3: STEP-BY-STEP CHARGING ITINERARY             */}
              {/* -------------------------------------------------- */}
              {activeViewTab === 'ITINERARY' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <i className="fa-solid fa-map-pin text-cyan-400" />
                        {isArabic ? 'خطة محطات الشحن عبر مسارات سلطنة عُمان' : 'Highway Charging Itinerary & Dwell Times'}
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {result.chargingItinerary.length} STOPS PLANNED
                      </span>
                    </div>

                    {result.chargingItinerary.length === 0 ? (
                      <div className="p-6 rounded-xl bg-slate-950 border border-emerald-500/20 text-center space-y-2">
                        <i className="fa-solid fa-circle-check text-3xl text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">
                          {isArabic ? 'المسار متاح بالكامل دون الحاجة لأي توقف شحن' : 'Direct Non-Stop Route Reachable'}
                        </h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          {isArabic 
                            ? `تصل إلى وجهتك باحتياطي بطارية يبلغ ${result.telemetry.arrivalSocPctWithoutCharging}% متجاوزاً حد الأمان الأدنى.`
                            : `Estimated arrival SOC is ${result.telemetry.arrivalSocPctWithoutCharging}%, comfortably exceeding your minimum ${minArrivalSocBufferPct}% safety buffer.`
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 font-sans">
                        {result.chargingItinerary.map((stop: VoltOmanChargingStop) => (
                          <div 
                            key={stop.stopIndex}
                            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="h-7 w-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                  #{stop.stopIndex}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-xs font-bold text-white">
                                      {isArabic ? stop.stationNameAr : stop.stationNameEn}
                                    </h4>
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                                      OOMCO EV
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    Km {stop.distanceFromStartKm} from origin ({stop.segmentDistanceKm} km leg) · {stop.highwayCorridor}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                                  stop.isMiddayDerated
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}>
                                  {stop.effectiveChargingPowerKw} kW {stop.isMiddayDerated ? '(65% capped)' : ''}
                                </span>
                                <span className="text-[11px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                  ~{stop.chargingTimeMins} mins
                                </span>
                                <button
                                  onClick={() => setActiveViewTab('GIS_MAP')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold cursor-pointer transition-colors flex items-center gap-1"
                                  title={isArabic ? 'تحديد المحطة على خريطة GIS' : 'Locate stop on GIS Map'}
                                >
                                  <i className="fa-solid fa-map-location-dot text-amber-400" />
                                  <span>{isArabic ? 'تحديد بالخريطة' : 'Locate on Map'}</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-850 text-xs font-mono">
                              <div className="p-2 rounded-lg bg-slate-900">
                                <span className="text-[10px] text-slate-400 block">{isArabic ? 'شحنة الوصول' : 'Arrival SOC'}</span>
                                <span className="text-rose-400 font-bold">{stop.arrivalSocPct}%</span>
                              </div>

                              <div className="p-2 rounded-lg bg-slate-900">
                                <span className="text-[10px] text-slate-400 block">{isArabic ? 'المغادرة بعد الشحن' : 'Depart SOC'}</span>
                                <span className="text-emerald-400 font-bold">{stop.targetDepartureSocPct}%</span>
                              </div>

                              <div className="p-2 rounded-lg bg-slate-900">
                                <span className="text-[10px] text-slate-400 block">{isArabic ? 'الطاقة المضافة' : 'Energy Added'}</span>
                                <span className="text-cyan-400 font-bold">{stop.energyAddedKwh} kWh</span>
                              </div>

                              <div className="p-2 rounded-lg bg-slate-900">
                                <span className="text-[10px] text-slate-400 block">{isArabic ? 'التكلفة التقديرية' : 'Estimated Cost'}</span>
                                <span className="text-white font-bold">{stop.estimatedCostOmr.toFixed(3)} OMR</span>
                              </div>
                            </div>

                            {stop.coolingAdvice && (
                              <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-850 flex items-start gap-1.5 font-sans">
                                <i className="fa-solid fa-fan text-cyan-400 mt-0.5 shrink-0" />
                                <span>{stop.coolingAdvice}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 4: GIS REAL-TIME EV MAP & FREE ZONES LAYER     */}
              {/* -------------------------------------------------- */}
              {activeViewTab === 'GIS_MAP' && (
                <div className="space-y-6">
                  
                  {/* Real-time Grid & GIS Telemetry Header Card */}
                  <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span>{isArabic ? 'طبقة البث الحي لمحطات الشحن بالمناطق الحرة (حتى 2027)' : 'Live EV Charging Network Layer across Free Zones (Until 2027)'}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                            {stationsList.length} {isArabic ? 'محطة معتمدة' : 'Verified Hubs'}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-extrabold text-white mt-1">
                          {isArabic ? 'خريطة نظم المعلومات الجغرافية الحية وقاعدة بيانات مناطق الطاقة' : 'Real-Time GIS EV Charging Layer & Energy Zones DB Linkage'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Live Telemetry Refresh Button */}
                        <button
                          onClick={handleRefreshLiveTelemetry}
                          disabled={isSyncingTelemetry}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                          title={isArabic ? 'تحديث بيانات المنافذ والأحمال الحية' : 'Refresh Live Station Telemetry'}
                        >
                          <i className={`fa-solid fa-arrows-rotate text-emerald-400 ${isSyncingTelemetry ? 'animate-spin' : ''}`} />
                          <span>{isSyncingTelemetry ? (isArabic ? 'جارِ التحديث...' : 'Syncing...') : (isArabic ? 'تحديث البث الحي' : 'Sync Live Telemetry')}</span>
                        </button>

                        {onNavigateToTab && (
                          <button
                            onClick={() => onNavigateToTab('ZONES')}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-building-columns" />
                            <span>{isArabic ? 'انتقل لقاعدة بيانات الطاقة' : 'View in Energy Zones DB'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2 pt-1 border-t border-slate-800">
                      <p className="leading-relaxed">
                        {isArabic
                          ? 'طبقة نظم معلومات جغرافية (GIS) تفاعلية تعرض حصرياً محطات شحن شركة النفط العمانية (OOMCO EV) العاملة وقيد التجهيز وخطط الميجاواط 2027 بكافة محافظات سلطنة عُمان، والمربوطة مباشرة بحسابات مسار VoltOman وقاعدة بيانات الطاقة.'
                          : 'Interactive GIS layer mapping exclusively Oman Oil Company (OOMCO EV) chargers (Operational, 2025-2026 Construction, and 2027 Megawatt Pipeline) across all Oman, linked to VoltOman trip calculation results and Energy Zones DB.'
                        }
                      </p>
                      <span className="shrink-0 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {lastTelemetrySyncTime}
                      </span>
                    </div>

                    {/* Regional & Governorates Interactive Filter Chips */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <i className="fa-solid fa-filter text-emerald-400"></i>
                        <span>{isArabic ? 'تصفية سريعة حسب محافظات ومحاور سلطنة عُمان:' : 'Filter Oman Oil Stations by Governorate:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'ALL', labelEn: `All Oman (${stationsList.length})`, labelAr: `كافة محافظات عُمان (${stationsList.length})`, color: 'slate' },
                          { id: 'rusayl', labelEn: 'Muscat (8)', labelAr: 'محافظة مسقط (8)', color: 'purple' },
                          { id: 'sohar', labelEn: 'Al Batinah & Sohar (7)', labelAr: 'الباطنة وحرة صحار (7)', color: 'emerald' },
                          { id: 'nizwa', labelEn: 'Al Dakhiliyah & Nizwa (5)', labelAr: 'الداخلية ونزوى (5)', color: 'indigo' },
                          { id: 'highway', labelEn: 'Salalah Highway & Wusta (7)', labelAr: 'طريق صلالة والوسطى (7)', color: 'blue' },
                          { id: 'salalah', labelEn: 'Dhofar & Salalah (7)', labelAr: 'ظفار وصلالة (7)', color: 'rose' },
                          { id: 'duqm', labelEn: 'Duqm SEZ (4)', labelAr: 'الدقم الاقتصادية (4)', color: 'cyan' },
                          { id: 'sur', labelEn: 'Al Sharqiyah & Sur (3)', labelAr: 'الشرقية وصور (3)', color: 'teal' },
                          { id: 'khazaen', labelEn: 'Khazaen City (3)', labelAr: 'مدينة خزائن (3)', color: 'amber' },
                          { id: 'mazunah', labelEn: 'Frontier & Musandam (2)', labelAr: 'المزيونة ومسندم (2)', color: 'orange' },
                        ].map(chip => (
                          <button
                            key={chip.id}
                            onClick={() => {
                              setDirectoryZoneFilter(chip.id);
                              if (chip.id !== 'ALL') {
                                handleInspectZoneById(chip.id);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                              directoryZoneFilter === chip.id
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            <span>{isArabic ? chip.labelAr : chip.labelEn}</span>
                            {chip.id !== 'ALL' && (
                              <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-70"></i>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Render the Embedded GIS Map with EV layer & Action Callbacks */}
                  <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                    <GisMap 
                      language={language} 
                      onNavigateToTab={onNavigateToTab}
                      defaultEvStationsLayer={true}
                      stationsData={stationsList}
                      voltOmanResult={result}
                      activeVoltOmanRoute={result ? {
                        routeNameEn,
                        routeNameAr,
                        highwayCorridor,
                        distanceKm,
                        vehicleModelName,
                        batteryCapacityKwh,
                        ambientTempC,
                        initialSocPct,
                      } : undefined}
                      onSelectStationForEnergyZone={handleInspectZoneFromStation}
                      onSelectStationForRoute={handleApplyStationAsRoute}
                    />
                  </div>

                  {/* Oman Oil Company (OOMCO EV) Station Directory Table with VoltOman Results Link */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <i className="fa-solid fa-gas-pump text-emerald-400" />
                          <span>{isArabic ? 'دليل محطات شركة النفط العمانية (OOMCO EV) في كافة أنحاء سلطنة عُمان حتى 2027:' : 'Oman Oil Company (OOMCO EV) Stations Directory across Oman through 2027:'}</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isArabic 
                            ? 'شبكة محطات شحن شركة النفط العمانية (OOMCO) الحصرية والمربوطة بنتائج محاكي مسار VoltOman وقاعدة بيانات مناطق الطاقة.'
                            : 'Exclusive Oman Oil Company (OOMCO) EV network across all governorates, directly integrated with VoltOman calculation results and Energy Zones DB.'}
                        </p>
                      </div>

                      <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-slate-950 border border-slate-800 self-start sm:self-center">
                        {stationsList.filter(st => {
                          if (directorySearchQuery.trim()) {
                            const q = directorySearchQuery.toLowerCase();
                            const matchName = st.nameEn.toLowerCase().includes(q) || st.nameAr.includes(q);
                            const matchGov = st.governorateEn.toLowerCase().includes(q) || st.governorateAr.includes(q);
                            const matchZone = st.zoneNameEn.toLowerCase().includes(q) || st.zoneNameAr.includes(q);
                            if (!matchName && !matchGov && !matchZone) return false;
                          }
                          if (directoryZoneFilter !== 'ALL' && st.zoneId !== directoryZoneFilter) return false;
                          if (directoryStatusFilter === 'OPERATIONAL' && st.status !== 'OPERATIONAL') return false;
                          if (directoryStatusFilter === 'CONSTRUCTION_2025_2026' && st.status !== 'UNDER_CONSTRUCTION_2025_2026') return false;
                          if (directoryStatusFilter === 'PIPELINE_2027' && st.status !== 'PLANNED_2027_PIPELINE') return false;
                          if (directoryStatusFilter === 'FREE_ZONES_ONLY' && !st.isFreeZoneHub) return false;
                          return true;
                        }).length} / {stationsList.length} {isArabic ? 'محطة نفط عُمان' : 'OOMCO Stations'}
                      </span>
                    </div>

                    {/* Filter Controls Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-sans">
                      {/* Search Input */}
                      <div className="relative">
                        <i className="fa-solid fa-search absolute left-3 top-2.5 text-slate-500 text-xs"></i>
                        <input
                          type="text"
                          value={directorySearchQuery}
                          onChange={(e) => setDirectorySearchQuery(e.target.value)}
                          placeholder={isArabic ? 'ابحث باسم المحطة أو الولاية أو المحافظة...' : 'Search station or governorate...'}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Region / Zone Selector */}
                      <div>
                        <select
                          value={directoryZoneFilter}
                          onChange={(e) => setDirectoryZoneFilter(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none cursor-pointer focus:border-emerald-500"
                        >
                          <option value="ALL">{isArabic ? 'جميع محافظات سلطنة عُمان (كافة المحطات)' : 'All Oman Governorates (All Stations)'}</option>
                          <option value="rusayl">{isArabic ? 'محافظة مسقط والعاصمة' : 'Muscat Governorate & Capital'}</option>
                          <option value="sohar">{isArabic ? 'شمال وجنوب الباطنة وحرة صحار' : 'Al Batinah & Sohar Freezone'}</option>
                          <option value="nizwa">{isArabic ? 'محافظة الداخلية ونزوى' : 'Al Dakhiliyah & Nizwa'}</option>
                          <option value="highway">{isArabic ? 'محور طريق صلالة الصحراوي والوسطى' : 'Salalah Desert Highway & Al Wusta'}</option>
                          <option value="salalah">{isArabic ? 'محافظة ظفار وحرة صلالة' : 'Dhofar Governorate & Salalah'}</option>
                          <option value="duqm">{isArabic ? 'المنطقة الاقتصادية بالدقم (SEZAD)' : 'SEZAD Duqm Port'}</option>
                          <option value="sur">{isArabic ? 'محافظة الشرقية وصور' : 'Al Sharqiyah & Sur City'}</option>
                          <option value="khazaen">{isArabic ? 'مدينة خزائن اللوجستية' : 'Khazaen Logistics Hub'}</option>
                          <option value="mazunah">{isArabic ? 'حرة المزيونة الحدودية ومسندم' : 'Al Mazunah Frontier & Musandam'}</option>
                        </select>
                      </div>

                      {/* Status / Timeline Selector */}
                      <div>
                        <select
                          value={directoryStatusFilter}
                          onChange={(e) => setDirectoryStatusFilter(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs outline-none cursor-pointer focus:border-emerald-500"
                        >
                          <option value="ALL">{isArabic ? 'كافة محطات نفط عُمان حتى 2027' : 'All OOMCO Stations to 2027'}</option>
                          <option value="OPERATIONAL">{isArabic ? '🟢 عاملة وقائمة حالياً (2024)' : '🟢 Operational Existing (2024)'}</option>
                          <option value="CONSTRUCTION_2025_2026">{isArabic ? '🟡 قيد التجهيز (2025-2026)' : '🟡 Under Construction (2025-26)'}</option>
                          <option value="PIPELINE_2027">{isArabic ? '🔵 خطة الميجاواط (2027 MCS)' : '🔵 2027 Megawatt Pipeline'}</option>
                          <option value="FREE_ZONES_ONLY">{isArabic ? '🏢 محطات المناطق الحرة فقط' : '🏢 Free Zone Hubs Only'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Stations List Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
                      {stationsList.filter(st => {
                        if (directorySearchQuery.trim()) {
                          const q = directorySearchQuery.toLowerCase();
                          const matchName = st.nameEn.toLowerCase().includes(q) || st.nameAr.includes(q);
                          const matchZone = st.zoneNameEn.toLowerCase().includes(q) || st.zoneNameAr.includes(q);
                          if (!matchName && !matchZone) return false;
                        }
                        if (directoryZoneFilter !== 'ALL' && st.zoneId !== directoryZoneFilter) return false;
                        if (directoryStatusFilter === 'OPERATIONAL' && st.status !== 'OPERATIONAL') return false;
                        if (directoryStatusFilter === 'CONSTRUCTION_2025_2026' && st.status !== 'UNDER_CONSTRUCTION_2025_2026') return false;
                        if (directoryStatusFilter === 'PIPELINE_2027' && st.status !== 'PLANNED_2027_PIPELINE') return false;
                        if (directoryStatusFilter === 'FREE_ZONES_ONLY' && !st.isFreeZoneHub) return false;
                        if (directoryOperatorFilter !== 'ALL' && st.operatorId !== directoryOperatorFilter) return false;
                        return true;
                      }).map((st) => {
                        const matchedItineraryStop = result?.chargingItinerary?.find(stop => {
                          const matchName = stop.stationNameEn && (
                            st.nameEn.toLowerCase().includes(stop.stationNameEn.toLowerCase()) ||
                            stop.stationNameEn.toLowerCase().includes(st.nameEn.toLowerCase()) ||
                            (stop.stationNameAr && st.nameAr.includes(stop.stationNameAr)) ||
                            (stop.stationNameAr && stop.stationNameAr.includes(st.nameAr))
                          );
                          const matchCorridor = stop.highwayCorridor && st.corridorTag && (
                            stop.highwayCorridor.toLowerCase() === st.corridorTag.toLowerCase()
                          );
                          return Boolean(matchName || (matchCorridor && Math.abs((st.waypointKm || 0) - stop.distanceFromStartKm) < 30));
                        });

                        return (
                        <div 
                          key={st.id} 
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 shadow-md ${
                            matchedItineraryStop
                              ? 'bg-slate-950 border-amber-500/60 shadow-amber-500/10 shadow-lg ring-1 ring-amber-500/30'
                              : 'border-slate-800 bg-slate-950 hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-900 border border-slate-750 text-slate-300">
                                {isArabic ? (st.governorateAr || st.zoneNameAr) : (st.governorateEn || st.zoneNameEn)}
                              </span>
                              
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                st.status === 'OPERATIONAL' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                  : st.status === 'UNDER_CONSTRUCTION_2025_2026' 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                              }`}>
                                {st.status === 'OPERATIONAL' ? `${st.yearCommissioned} Operational` :
                                 st.status === 'UNDER_CONSTRUCTION_2025_2026' ? `${st.yearCommissioned} Construction` :
                                 `${st.yearCommissioned} 350-700kW MCS`}
                              </span>
                            </div>

                            <h5 className="text-sm font-bold text-white leading-snug">
                              {isArabic ? st.nameAr : st.nameEn}
                            </h5>

                            <div className="text-xs text-slate-400 flex items-center justify-between">
                              <span className="text-emerald-400 font-bold">{st.operatorNameEn}</span>
                              <span className="font-mono text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {st.powerKw} kW
                              </span>
                            </div>

                            {/* VoltOman Result Itinerary Stop Callout */}
                            {matchedItineraryStop && (
                              <div className="p-2 rounded-lg bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 text-[10px] space-y-1">
                                <div className="flex items-center justify-between text-amber-400 font-bold">
                                  <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-bolt-lightning text-amber-300 animate-pulse"></i>
                                    <span>{isArabic ? `محطة توقف VoltOman (#${matchedItineraryStop.stopIndex})` : `VoltOman Route Stop #${matchedItineraryStop.stopIndex}`}</span>
                                  </span>
                                  <span className="font-mono bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300">
                                    +{matchedItineraryStop.energyAddedKwh.toFixed(1)} kWh
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300 font-mono text-[9px]">
                                  <span>{isArabic ? `مدة الشحن: ${matchedItineraryStop.chargingTimeMins} دقيقة` : `Dwell: ~${matchedItineraryStop.chargingTimeMins} mins`}</span>
                                  <span>{isArabic ? `التكلفة: ${matchedItineraryStop.estimatedCostOmr.toFixed(3)} ر.ع` : `Cost: ${matchedItineraryStop.estimatedCostOmr.toFixed(3)} OMR`}</span>
                                </div>
                              </div>
                            )}

                            {/* Live Telemetry Occupancy Bar */}
                            <div className="pt-1">
                              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                                <span className="text-slate-400">
                                  {isArabic ? 'المنافذ المتاحة حالياً:' : 'Live Port Availability:'}
                                </span>
                                <span className={st.availablePortsNow > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                  {st.availablePortsNow} / {st.portsCount} {isArabic ? 'متاح' : 'Free'} ({st.realtimeOccupancyPct}% load)
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    st.realtimeOccupancyPct > 80 ? 'bg-rose-500' :
                                    st.realtimeOccupancyPct > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`} 
                                  style={{ width: `${st.realtimeOccupancyPct}%` }}
                                />
                              </div>
                            </div>

                            {/* Clean Energy & Synergy Tag */}
                            {st.energyZoneLink && (
                              <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-850 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-amber-300 font-mono">
                                  <i className="fa-solid fa-solar-panel text-amber-400" />
                                  <span>{st.energyZoneLink.totalCleanPowerMw} MW Clean Grid</span>
                                </span>
                                <span className="text-slate-400 font-mono">
                                  {st.tariffOmrPerKwh.toFixed(3)} OMR/kWh
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-xs">
                            <button
                              onClick={() => handleApplyStationAsRoute(st)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 text-center"
                              title={isArabic ? 'حساب المسار وتطبيق المحطة في المحرك' : 'Set as route in VoltOman Engine'}
                            >
                              <i className="fa-solid fa-bolt-lightning text-amber-400" />
                              <span>{isArabic ? 'حساب المسار' : 'Set as Route'}</span>
                            </button>

                            <button
                              onClick={() => handleInspectZoneFromStation(st)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 text-center"
                              title={isArabic ? 'استعراض بيانات وحوافز منطقة الطاقة' : 'Inspect Energy Zone profile and incentives'}
                            >
                              <i className="fa-solid fa-building-columns text-cyan-400" />
                              <span>{isArabic ? 'ملف منطقة الطاقة' : 'Inspect Zone DB'}</span>
                            </button>
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* MODAL: ENERGY ZONES DB DOSSIER & EV SYNERGY SHEET  */}
                  {/* -------------------------------------------------- */}
                  <AnimatePresence>
                    {selectedZoneForDossier && (
                      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto relative"
                          dir={isArabic ? 'rtl' : 'ltr'}
                        >
                          {/* Close button */}
                          <button
                            onClick={() => {
                              setSelectedZoneForDossier(null);
                              setSelectedStationForModal(null);
                            }}
                            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 border border-slate-700 cursor-pointer"
                          >
                            <i className="fa-solid fa-xmark text-sm" />
                          </button>

                          {/* Zone Header */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {isArabic ? 'قاعدة بيانات مناطق الطاقة العمانية' : 'Oman Energy Zones DB Dossier'}
                              </span>
                              <span className="text-xs font-mono text-cyan-400 font-bold">
                                {selectedZoneForDossier.totalCleanPowerMw} MW Clean Power
                              </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-white">
                              {isArabic ? selectedZoneForDossier.zoneTitleAr : selectedZoneForDossier.zoneTitleEn}
                            </h3>
                            <p className="text-xs font-mono text-slate-400 mt-0.5">
                              {isArabic ? selectedZoneForDossier.zoneTypeAr : selectedZoneForDossier.zoneTypeEn}
                            </p>
                          </div>

                          {/* Specific Station Badge if invoked from station */}
                          {selectedStationForModal && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 block">{isArabic ? 'المحطة المختارة:' : 'Selected Station:'}</span>
                                <strong className="text-emerald-400">{isArabic ? selectedStationForModal.nameAr : selectedStationForModal.nameEn}</strong>
                              </div>
                              <span className="font-mono text-amber-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-750">
                                {selectedStationForModal.powerKw} kW ({selectedStationForModal.yearCommissioned})
                              </span>
                            </div>
                          )}

                          {/* Clean Energy & Power Grid Profile */}
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                              <i className="fa-solid fa-solar-panel" />
                              <span>{isArabic ? 'مصادر توليد الطاقة النظيفة والشبكة الصناعية:' : 'Clean Energy Generation & Industrial Grid:'}</span>
                            </h4>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">
                              {isArabic ? selectedZoneForDossier.cleanEnergySourceAr : selectedZoneForDossier.cleanEnergySourceEn}
                            </p>
                          </div>

                          {/* Linked EV OEMs & Clean Tech Companies */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                              <i className="fa-solid fa-industry" />
                              <span>{isArabic ? 'الشركات ومصنعي المركبات الكهربائية المرتبطة بالمنطقة:' : 'Resident EV OEMs & Renewable Companies:'}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedZoneForDossier.linkedCompanies.map((comp, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-3 py-1 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 text-xs font-bold flex items-center gap-1.5"
                                >
                                  <i className="fa-solid fa-building text-emerald-400 text-[10px]" />
                                  <span>{comp}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Key Free Zone Incentives for EV Fleets */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                              <i className="fa-solid fa-shield-halved" />
                              <span>{isArabic ? 'حوافز المنطقة لمشغلي أساطيل المركبات ومحطات الشحن:' : 'Free Zone Incentives for EV Fleets & CPOs:'}</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {(isArabic ? selectedZoneForDossier.keyIncentivesAr : selectedZoneForDossier.keyIncentivesEn).map((inc, i) => (
                                <div key={i} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2">
                                  <i className="fa-solid fa-check text-emerald-400 mt-0.5 shrink-0" />
                                  <span className="text-slate-300 leading-snug">{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* EV Fleet & Charging Synergy */}
                          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs leading-relaxed text-emerald-200">
                            <strong className="block text-emerald-300 font-bold mb-1">
                              {isArabic ? 'رؤية تكامل النقل الأخضر (Vision 2040):' : 'Green Mobility Strategic Synergy:'}
                            </strong>
                            {isArabic ? selectedZoneForDossier.evFleetSynergyAr : selectedZoneForDossier.evFleetSynergyEn}
                          </div>

                          {/* Modal Actions */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                            {selectedStationForModal ? (
                              <button
                                onClick={() => {
                                  handleApplyStationAsRoute(selectedStationForModal);
                                  setSelectedZoneForDossier(null);
                                  setSelectedStationForModal(null);
                                }}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                              >
                                <i className="fa-solid fa-bolt-lightning text-slate-950" />
                                <span>{isArabic ? 'حساب المسار لهذه المحطة' : 'Simulate Route to this Station'}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  // Find first station in this zone to simulate
                                  const firstSt = stationsList.find(s => s.zoneId === selectedZoneForDossier.zoneId);
                                  if (firstSt) {
                                    handleApplyStationAsRoute(firstSt);
                                  }
                                  setSelectedZoneForDossier(null);
                                }}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                              >
                                <i className="fa-solid fa-bolt-lightning text-slate-950" />
                                <span>{isArabic ? 'حساب مسار لهذه المنطقة' : 'Simulate Route to this Zone'}</span>
                              </button>
                            )}

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {onNavigateToTab && (
                                <button
                                  onClick={() => {
                                    setSelectedZoneForDossier(null);
                                    setSelectedStationForModal(null);
                                    onNavigateToTab('ZONES');
                                  }}
                                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <i className="fa-solid fa-building-columns" />
                                  <span>{isArabic ? 'فتح في صفحة مناطق الطاقة' : 'Open in Energy Zones DB'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setSelectedZoneForDossier(null);
                                  setSelectedStationForModal(null);
                                }}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                              >
                                {isArabic ? 'إغلاق' : 'Close'}
                              </button>
                            </div>
                          </div>

                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                </div>
              )}



            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default VoltOmanEngine;
