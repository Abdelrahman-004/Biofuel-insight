import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestProject } from './geminiService';
import { SuggestedProject } from './types';

interface OmanFreeZonesProps {
  language?: 'English' | 'Arabic';
}

export const OmanFreeZones: React.FC<OmanFreeZonesProps> = ({ language = 'English' }) => {
  const [localLanguage, setLocalLanguage] = React.useState(language || 'Arabic');

  React.useEffect(() => {
    setLocalLanguage(language || 'Arabic');
  }, [language]);

  const isArabic = localLanguage === 'Arabic';
  const [suggestion, setSuggestion] = React.useState<SuggestedProject | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<'ALL' | 'EV_MOBILITY' | 'RENEWABLES_HYDROGEN' | 'GRID_UTILITIES'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSuggest = async (zone: string) => {
    setLoading(zone);
    try {
      const proj = await suggestProject(`${zone} in Oman`, localLanguage);
      setSuggestion(proj);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const zones = [
    {
      name: isArabic ? 'المنطقة الاقتصادية الخاصة بالدقم (SEZAD)' : 'Duqm Special Economic Zone (SEZAD)',
      desc: isArabic 
        ? 'أكبر منطقة اقتصادية وصناعية في الشرق الأوسط، مركز وطني لتصنيع وتجميع الحافلات والسيارات الكهربائية (كروة وميسان)، وعاصمة الهيدروجين الأخضر وسلاسل التصدير العالمية.' 
        : 'The largest economic & industrial zone in the Middle East, designated national hub for EV vehicle manufacturing (Maysan & Karwa), green hydrogen mega-scale production, and maritime export.',
      advantages: isArabic 
        ? ['مصانع تجميع وتصنيع المركبات الكهربائية', 'مساحات أراضي شاسعة للمشاريع الكبرى', 'رصيف نفطي وبتروكيماويات بمياه عميقة', 'إعفاء ضريبي 0% لمدة 30 عاماً'] 
        : ['EV Vehicle Assembly & Manufacturing Plants', 'Mega-Scale Industrial Land Blocks', 'Deep-Sea Liquid & Container Jetty', '30-Year 0% Corporate Tax Exemption'],
      bestSuited: isArabic 
        ? ['تصنيع الحافلات والمركبات الكهربائية', 'إنتاج وتصدير الهيدروجين والأمونيا الخضراء', 'الوقود الاصطناعي (E-Fuels)', 'مصانع تدوير بطاريات الليثيوم'] 
        : ['Electric Bus & Vehicle Assembly', 'Green Hydrogen & Green Ammonia Mega-Plants', 'Synthetic E-Fuels & SAF', 'Lithium Battery Recycling & Storage Systems'],
      evRelevance: isArabic 
        ? 'تضم مصنع "كروة موتورز" لإنتاج الحافلات الكهربائية ومقر مصنع "ميسان موتورز" للسيارات الكهربائية.' 
        : 'Home to Karwa Motors electric bus manufacturing plant and Maysan Motors domestic EV assembly facility.',
      note: isArabic ? 'الموقع الاستراتيجي الأفضل لمشاريع تصنيع المركبات الكهربائية والمشاريع التصديرية الكبرى.' : 'Strategic flagship location for EV manufacturing, battery systems, and renewable export mega-projects.'
    },
    {
      name: isArabic ? 'منطقة صحار الحرة والميناء الصناعي' : 'Sohar Free Zone & Industrial Port',
      desc: isArabic 
        ? 'بوابة صناعية ولوجستية عالمية ترتبط بطريق الباطنة السريع، تحتضن صناعات تحويلية ثقيلة وتكامل إلكتروني مع شبكات الشحن السريع للمركبات والشاحنات.' 
        : 'A premier industrial & logistics gateway directly on the Al Batinah Expressway, uniquely positioned for heavy manufacturing, clean metal supply, and commercial fleet EV charging.',
      advantages: isArabic 
        ? ['اتصال مباشر بطريق الباطنة السريع والشاحنات', 'وصول بحري عميق للتجارة مع الخليج والعالم', 'قرب من مجمعات تصنيع المحولات الكهربائية', 'وفرة المواد الخام للألواح والسبائك الخفيفة'] 
        : ['Direct Link to Al Batinah Fast Highway Arteries', 'Deep-Sea Port Trade Access to GCC & Global Markets', 'Proximity to Voltamp Transformer Manufacturing', 'Lightweight Aluminum & Composite Metal Feedstock'],
      bestSuited: isArabic 
        ? ['محطات شحن الشاحنات الكهربائية فائقة السرعة (MCS)', 'تحويل النفايات إلى وقود حيوي بحري', 'تصنيع مكونات الشواحن والمحولات', 'تكامل احتجاز الكربون مع الصناعات الثقيلة'] 
        : ['Megawatt Charging Systems (MCS) for EV Heavy Fleets', 'Waste-to-Biofuel for Marine Bunkering', 'EV Charger Substation & Transformer Assembly', 'Industrial CCUS & Green Steel'],
      evRelevance: isArabic 
        ? 'نقطة انطلاق رئيسية لأساطيل الشاحنات الكهربائية الثقيلة بين مسقط وميناء صحار وبوابات الإمارات.' 
        : 'Primary logistical corridor for electrified freight logistics connecting Muscat, Sohar Port, and GCC borders.',
      note: isArabic ? 'مثالي للبنية التحتية لشحن الشاحنات ومشاريع تحول الطاقة اللوجستية.' : 'Ideal for heavy transport electrification infrastructure and maritime clean fuels.'
    },
    {
      name: isArabic ? 'منطقة صلالة الحرة ومحافظة ظفار' : 'Salalah Free Zone & Dhofar Corridor',
      desc: isArabic 
        ? 'المحطة الختامية لطريق أدم-ثمريت-صلالة الصحراوي السريع (1,020 كم)، وموقع استراتيجي على خطوط الملاحة البحرية بين الشرق والغرب، مع طاقة رياح استثنائية.' 
        : 'The southern terminus of the vital Adam-Thumrait-Salalah desert highway (1,020 km), situated along major global shipping lanes with exceptional hybrid wind and solar resources.',
      advantages: isArabic 
        ? ['المحطة الجنوبية لمحور الشحن الوطني السريع', 'أسرع ممر بحري للمحيط الهندي وإفريقيا', 'إمكانات طاقة رياح موسمية عالية الكفاءة', 'بيئة سياحية تدعم التنقل الأخضر المستدام'] 
        : ['Southern Terminus for Oman National EV Fast Corridor', 'Fastest Sea Route to Indian Ocean & Africa', 'High-Yield Seasonal Wind Energy Resources', 'Pristine Eco-Tourism Corridor Supporting Green Fleets'],
      bestSuited: isArabic 
        ? ['محطات الشحن السريع للمركبات السياحية والأساطيل', 'إنتاج وتخزين الطاقة المتجددة (الرياح والشمس)', 'وقود الديزل الحيوي من الزيوت المستعملة', 'سلاسل التبريد واللوجستيات الخضراء'] 
        : ['Tourism & Commercial EV Fast Charging Hubs', 'Hybrid Wind-Solar Generation & Energy Storage', 'Used Cooking Oil Biodiesel Refining', 'Green Cold-Chain Logistics Hubs'],
      evRelevance: isArabic 
        ? 'المحور الرئيسي لشواحن السيارات الكهربائية القادمة عبر طريق ثمريت، ونقطة جذب لأسطول النقل الصديق للبيئة خلال موسم الخريف.' 
        : 'Key charging terminus for long-haul desert travelers arriving via Thumrait, with peak eco-tourism demand during Khareef.',
      note: isArabic ? 'الموقع الأمثل لربط شبكات الشحن السياحي والحلول المستدامة للطاقة.' : 'Ideal for eco-tourism fleet charging networks and renewable circular economy operations.'
    }
  ];

  // Comprehensive Ecosystem Companies (EV Mobility & Energy)
  const allCompanies = [
    // --- EV & CLEAN MOBILITY COMPANIES ---
    {
      id: 'maysan',
      name: isArabic ? 'ميسان موتورز (Maysan Motors)' : 'Maysan Motors',
      category: 'EV_MOBILITY' as const,
      categoryLabel: isArabic ? 'تصنيع وتطوير المركبات الكهربائية' : 'EV Manufacturing & OEM',
      type: isArabic ? 'قطاع خاص محلي (أول صانع سيارات كهربائية في عُمان)' : 'Omani EV Startup & Manufacturer',
      location: isArabic ? 'المنطقة الاقتصادية الخاصة بالدقم (SEZAD)' : 'Duqm SEZAD Industrial Complex',
      icon: 'fa-car-side',
      color: 'emerald',
      goals: isArabic 
        ? 'تصميم وتصنيع سيارات كهربائية عمانية الصنع بنسبة 100% (طرازات مثل ميسان ألايف وبرق)، وتوطين سلاسل إمداد البطاريات وتصدير المركبات لأسواق الشرق الأوسط وشمال إفريقيا.' 
        : 'Designing and manufacturing 100% Omani electric vehicles (models like Maysan Alive & Barq), localizing composite bodywork, and exporting across the GCC and MENA.',
      investorBenefit: isArabic 
        ? 'فرص استثمار في خطوط الإنتاج بالدقم، وتطوير برمجيات إدارة الطاقة والبطاريات، والاستفادة من الحوافز الضريبية والجمركية بنسبة 0%.' 
        : 'Equity investment in EV assembly lines, domestic battery pack manufacturing, and high-margin GCC export distribution with 0% tax advantages.',
      tags: isArabic ? ['تصنيع محلي', 'سيارات كهربائية', 'مدينة الدقم', 'رؤية 2040'] : ['Domestic EV OEM', 'Duqm Plant', 'Lithium Powertrain', 'GCC Export']
    },
    {
      id: 'shell_recharge',
      name: isArabic ? 'شل عُمان للتسويق (Shell Recharge)' : 'Shell Oman Marketing (Shell Recharge)',
      category: 'EV_MOBILITY' as const,
      categoryLabel: isArabic ? 'مشغل محطات الشحن السريع للمركبات' : 'Charge Point Operator (CPO) & Mobility',
      type: isArabic ? 'شركة مساهمة عامة / شراكة طاقة عالمية' : 'Public Joint Stock / Global Energy Network',
      location: isArabic ? 'شبكة وطنية (طريق الباطنة السريع، مسقط، وأدم)' : 'National Corridors (Batinah, Muscat, Adam-Thumrait)',
      icon: 'fa-charging-station',
      color: 'amber',
      goals: isArabic 
        ? 'نشر شواحن التيار المستمر السريعة (120 - 180 كيلوواط) على طول الطرق السريعة بالتعاون مع وزارة النقل والاتصالات وتقنية المعلومات، ودمج الطاقة الشمسية في محطات الخدمة.' 
        : 'Aggressive rollout of DC fast-chargers (120-180 kW) across intercity expressways in coordination with MTCIT, transitioning service stations into multi-energy hubs with solar canopies.',
      investorBenefit: isArabic 
        ? 'شراكات تشغيل الشواحن (CPO)، وتوفير خدمات القيمة المضافة لمرتادي محطات الشحن السريع، وتطوير حلول إدارة الحمل الذكي.' 
        : 'Co-location partnerships, retail hub electrification, smart load balancing services, and fleet corporate charging accounts.',
      tags: isArabic ? ['شحن فائق السرعة', 'طرق سريعة', 'مظلات شمسية', '180 kW DC'] : ['Shell Recharge', '180 kW DC Fast', 'Expressway Hubs', 'MTCIT Partner']
    },
    {
      id: 'oomco_ev',
      name: isArabic ? 'شركة النفط العمانية للتسويق (OOMCO EV)' : 'Oman Oil Marketing Company (OOMCO EV)',
      category: 'EV_MOBILITY' as const,
      categoryLabel: isArabic ? 'محطات الطاقة الخضراء وشحن المركبات' : 'Green Mobility Hubs & CPO Network',
      type: isArabic ? 'شركة مساهمة عامة رائدة في التوزيع' : 'Leading Public Energy & Retail Distributor',
      location: isArabic ? 'جميع محافظات سلطنة عُمان' : 'Nationwide Coverage Across All Governorates',
      icon: 'fa-bolt-lightning',
      color: 'emerald',
      goals: isArabic 
        ? 'تحويل محطات التجزئة إلى "مراكز تنقل خضراء" متكاملة تضم شواحن سيارات كهربائية بقدرات تصل إلى 150 كيلوواط، وأنظمة تخزين طاقة البطاريات (BESS).' 
        : 'Transforming legacy fueling stations into integrated Green Mobility Hubs with ultra-fast 150 kW DC charging, rooftop solar arrays, and Battery Energy Storage Systems (BESS).',
      investorBenefit: isArabic 
        ? 'التعاقد مع أساطيل النقل والشركات اللوجستية للتحول الكهربائي، ومشاريع كفاءة الطاقة وتخزين البطاريات بالمحطات.' 
        : 'Commercial fleet electrification contracts, fast charging infrastructure scaling, and station-level BESS integration.',
      tags: isArabic ? ['شواحن سريعة', 'تخزين بطاريات', 'مراكز خضراء', 'أساطيل تجارية'] : ['150 kW DC', 'BESS Storage', 'Green Mobility Hubs', 'Fleet Charging']
    },
    {
      id: 'karwa_motors',
      name: isArabic ? 'كروة موتورز (Karwa Motors)' : 'Karwa Motors',
      category: 'EV_MOBILITY' as const,
      categoryLabel: isArabic ? 'تصنيع الحافلات والمركبات الكهربائية' : 'Electric Commercial Vehicles & Buses',
      type: isArabic ? 'مشروع مشترك (جهاز الاستثمار العماني ومواصلات قطر)' : 'OIA & Mowasalat Qatar Joint Venture',
      location: isArabic ? 'المنطقة الاقتصادية الخاصة بالدقم' : 'Special Economic Zone at Duqm (SEZAD)',
      icon: 'fa-bus',
      color: 'cyan',
      goals: isArabic 
        ? 'تصنيع وتجميع الحافلات المدرسية والبلدية مع التوسع في إنتاج الحافلات الكهربائية بالكامل لتلبية الطلب المحلي والإقليمي في الخليج العربي.' 
        : 'Manufacturing city and intercity transit buses with dedicated transition toward 100% zero-emission battery electric buses for Oman and GCC public transit.',
      investorBenefit: isArabic 
        ? 'توريد أنظمة الدفع الكهربائية، حزم بطاريات الحافلات، عقود النقل العام والخدمات اللوجستية الكبرى.' 
        : 'Supply contracts for heavy-duty electric powertrains, battery thermal management systems, and public transit fleet conversions.',
      tags: isArabic ? ['حافلات كهربائية', 'مصنع الدقم', 'جهاز الاستثمار', 'نقل عام'] : ['Electric Buses', 'Duqm Mega Plant', 'OIA Portfolio', 'Public Transit']
    },
    {
      id: 'ev_plus',
      name: isArabic ? 'إي في بلس عُمان (EV Plus Oman)' : 'EV Plus Oman',
      category: 'EV_MOBILITY' as const,
      categoryLabel: isArabic ? 'شبكة الشحن الذكية والبرمجيات' : 'Smart EV Charging & Software Operator',
      type: isArabic ? 'شركة عمانية متخصصة في بنية الشحن' : 'Specialized Omani EV Charging Network',
      location: isArabic ? 'مسقط، صحار، صلالة (المجمعات والفنادق)' : 'Muscat, Sohar, Salalah (Commercial & Malls)',
      icon: 'fa-plug-circle-bolt',
      color: 'emerald',
      goals: isArabic 
        ? 'نشر شواحن AC و DC في الوجهات التجارية ومراكز التسوق والفنادق، وتقديم منصة برمجية ذكية للمستخدمين مع إدارة الدفع والتجوال التلقائي.' 
        : 'Deploying high-reliability destination and fast chargers across shopping destinations, luxury hotels, and corporate complexes with unified billing software.',
      investorBenefit: isArabic 
        ? 'حقوق توزيع وتثبيت محطات الشحن المعتمدة، شراكات إدارة الشحن للشركات، وبرمجيات إدارة الأساطيل السحابية.' 
        : 'Charger hardware distribution concessions, turnkey workplace charging contracts, and white-label fleet management software.',
      tags: isArabic ? ['شحن الوجهات', 'تطبيق ذكي', 'مجمعات تجارية', 'شحن AC/DC'] : ['Destination Charging', 'Smart App', 'Hotel & Mall Hubs', 'SaaS Roaming']
    },
    {
      id: 'voltamp',
      name: isArabic ? 'فولتامب للطاقة (Voltamp Energy)' : 'Voltamp Energy',
      category: 'GRID_UTILITIES' as const,
      categoryLabel: isArabic ? 'محولات ومعدات محطات الشحن الكهربائي' : 'EV Power Transformers & Substations',
      type: isArabic ? 'شركة صناعية عمانية مساهمة عامة' : 'Omani Industrial Power Engineering Leader',
      location: isArabic ? 'مدينة الرسيل الصناعية وصحار' : 'Rusayl & Sohar Industrial Cities',
      icon: 'fa-microchip',
      color: 'cyan',
      goals: isArabic 
        ? 'تصنيع المحولات الكهربائية فائقة الجودة ومحطات التوزيع المدمجة القادرة على استيعاب الأحمال اللحظية العالية لشواحن المركبات السريعة (350+ kW) دون فصل الشبكة.' 
        : 'Engineering robust distribution transformers, package substations, and power conditioning units built to withstand sudden high-draw spikes from ultra-fast EV chargers.',
      investorBenefit: isArabic 
        ? 'شراكات توريد معدات المحطات لمشغلي الشحن (CPOs) وشركات الكهرباء، مع قيمة محلية مضافة عالية (ICV).' 
        : 'Direct hardware procurement for utility-scale CPO installations, specialized engineering contracts, and strong In-Country Value (ICV) points.',
      tags: isArabic ? ['تصنيع محلي', 'محولات كهربائية', 'حماية الشبكة', 'مدينة الرسيل'] : ['Omani Manufacturer', 'EV Substations', 'Grid Protection', 'High ICV']
    },
    {
      id: 'al_maha_ev',
      name: isArabic ? 'شركة المها لتسويق النفط (Al Maha EV)' : 'Al Maha Petroleum Products (Al Maha EV)',
      category: 'EV_MOBILITY' as const,
      categoryLabel: isArabic ? 'محطات الوقود وخدمات الشحن السريع' : 'Retail Expressway Fast Charging',
      type: isArabic ? 'شركة توزيع وطنية مساهمة' : 'National Fuel & Convenience Network',
      location: isArabic ? 'المسارات الداخلية، الشرقية، وطريق صلالة' : 'Interior Routes, Sharqiyah, and Salalah Corridor',
      icon: 'fa-road',
      color: 'amber',
      goals: isArabic 
        ? 'تزويد محطات الخدمة النائية والواقعة على الطرق السريعة بشواحن سريعة لربط المحافظات الداخلية ومسار أدم-ثمريت-صلالة الحيوي.' 
        : 'Equipping strategic highway stations with high-speed DC chargers, specifically ensuring non-stop coverage on deep interior and desert routes connecting North to South.',
      investorBenefit: isArabic 
        ? 'فرص استثمار في نقاط الشحن بالمناطق الداخلية، وتوفير خدمات استراحة المسافرين واللوجستيات المصاحبة.' 
        : 'Remote charging station infrastructure contracts, roadside microgrid integration, and convenience retail co-investments.',
      tags: isArabic ? ['طريق صلالة', 'شواحن سريعة', 'محطات نائية', 'ربط المحافظات'] : ['Desert Highway', 'Salalah Corridor', 'Fast DC Chargers', 'Intercity Coverage']
    },

    // --- RENEWABLES & HYDROGEN PLAYERS ---
    {
      id: 'oq',
      name: isArabic ? 'أوكيو (OQ Alternative Energy)' : 'OQ Alternative Energy (OQAE)',
      category: 'RENEWABLES_HYDROGEN' as const,
      categoryLabel: isArabic ? 'قطاع حكومي (مجموعة طاقة متكاملة)' : 'Integrated Energy & Renewables Group',
      type: isArabic ? 'شركة طاقة وطنية متكاملة' : 'Global Integrated Energy Group',
      location: isArabic ? 'مسقط، الدقم، صحار، وصلالة' : 'Muscat, Duqm, Sohar, Salalah',
      icon: 'fa-leaf',
      color: 'emerald',
      goals: isArabic 
        ? 'قيادة تحول الطاقة عبر مشاريع الهيدروجين الأخضر الكبرى، ومزارع الطاقة الشمسية والرياح المغذية للصناعات الكبرى ومجمعات تكرير الدقم.' 
        : 'Spearheading Oman’s energy transition through multi-gigawatt green hydrogen projects, utility solar/wind farms, and low-carbon industrial feedstock.',
      investorBenefit: isArabic 
        ? 'شراكات استثمارية عالمية في مشاريع الهيدروجين، وتوفير المواد الأولية للمصافي الحيوية، وتطوير حلول الطاقة المتجددة الصناعية.' 
        : 'Co-investment in multi-billion dollar green ammonia/hydrogen ventures, clean fuel supply agreements, and technology partnerships.',
      tags: isArabic ? ['هيدروجين أخضر', 'طاقة متجددة', 'أمونيا خضراء', 'استثمارات كبرى'] : ['Green Hydrogen', 'Renewable Mega-Projects', 'Green Ammonia', 'Global JV']
    },
    {
      id: 'hydrom',
      name: isArabic ? 'هيدروم (Hydrom)' : 'Hydrom (Oman Hydrogen Orchestrator)',
      category: 'RENEWABLES_HYDROGEN' as const,
      categoryLabel: isArabic ? 'المظلة الوطنية لقطاع الهيدروجين' : 'National Green Hydrogen Orchestrator',
      type: isArabic ? 'شركة حكومية تابعة لـ (EDO)' : 'Wholly Owned Government Entity (EDO)',
      location: isArabic ? 'أراضي الامتياز في الدقم ومحافظة ظفار' : 'Concession Blocks in Duqm & Dhofar',
      icon: 'fa-water',
      color: 'cyan',
      goals: isArabic 
        ? 'تخطيط وطرح أراضي الهيدروجين الأخضر الشاسعة للمطورين الدوليين، وتطوير البنية المشتركة لخطوط الأنابيب والموانئ للوصول لإنتاج مليون طن بحلول 2030.' 
        : 'Master-planning and auctioning Oman’s prime wind/solar land blocks, orchestrating shared pipeline and export infrastructure to achieve 1M tons of green H2 by 2030.',
      investorBenefit: isArabic 
        ? 'الفوز بجولات المزايدة العالمية للحصول على امتيازات أراضي الهيدروجين، والمشاركة في تطوير خطوط الأنابيب والموانئ الموحدة.' 
        : 'Securing 47-year land concession rights, participating in shared pipeline infrastructure funds, and long-term European/Asian export offtakes.',
      tags: isArabic ? ['مزادات الأراضي', 'بنية تحتية موحدة', 'تصدير عالمي', 'مليون طن 2030'] : ['Concession Auctions', 'Shared Infrastructure', 'Export Pipelines', 'Vision 2040']
    },
    {
      id: 'pdo',
      name: isArabic ? 'تنمية نفط عُمان (PDO)' : 'Petroleum Development Oman (PDO)',
      category: 'RENEWABLES_HYDROGEN' as const,
      categoryLabel: isArabic ? 'شراكة طاقة شاملة وتحول كربوني' : 'Comprehensive Energy & Net-Zero Transition',
      type: isArabic ? 'شراكة حكومية وخاصة (حكومة عُمان وشل وتوتال)' : 'Government (60%) & International Partners',
      location: isArabic ? 'مناطق الامتياز بالصحراء العمانية ومسقط' : 'Interior Concessions & Mina Al Fahal',
      icon: 'fa-oil-well',
      color: 'emerald',
      goals: isArabic 
        ? 'تحقيق الحياد الكربوني بحلول 2050، والريادة العالمية في احتجاز وتخزين الكربون (CCUS)، وتوليد البخار بالطاقة الشمسية (مشروع مرآة)، وتوسيع مزارع الطاقة المتجددة.' 
        : 'Achieving Net Zero by 2050, operating world-scale solar EOR (Miraah), deploying commercial CCUS, and expanding renewable solar power for desert extraction facilities.',
      investorBenefit: isArabic 
        ? 'عقود تزويد التكنولوجيا النظيفة، ومشاريع تدوير النفايات العضوية، ومشاريع استبدال الديزل بأنظمة الطاقة المتجددة الهجينة.' 
        : 'Clean tech procurement contracts, oilfield solar microgrids, organic waste-to-energy projects, and carbon sequestration pilot funding.',
      tags: isArabic ? ['حياد كربوني 2050', 'طاقة شمسية صحراوية', 'احتجاز الكربون', 'قيمة محلية مضافة'] : ['Net Zero 2050', 'Solar EOR', 'CCUS Pioneer', 'Massive In-Country Value']
    },
    {
      id: 'oman_lng',
      name: isArabic ? 'الشركة العمانية للغاز الطبيعي المسال (Oman LNG)' : 'Oman LNG',
      category: 'RENEWABLES_HYDROGEN' as const,
      categoryLabel: isArabic ? 'تصدير الغاز المسال وإزالة الكربون' : 'LNG Export & Industrial Decarbonization',
      type: isArabic ? 'شراكة حكومية / دولية في قلهات صور' : 'Public-Private Export Leader (Qalhat, Sur)',
      location: isArabic ? 'قلهات - ولاية صور' : 'Qalhat Industrial Plant, Sur',
      icon: 'fa-fire-flame-simple',
      color: 'amber',
      goals: isArabic 
        ? 'تصنيع وتصدير الغاز المسال بأعلى معايير الكفاءة البيئية، وخفض كثافة الانبعاثات الكربونية، وتطوير مشاريع إنتاج الميثان الصناعي والوقود المستدام.' 
        : 'Operating state-of-the-art liquefaction trains in Sur, lowering carbon intensity through electrification, and piloting synthetic methane and clean hydrogen blending.',
      investorBenefit: isArabic 
        ? 'التعاون في مشاريع إزالة الكربون الصناعي، وسلاسل الإمداد للغاز منخفض الكربون، ومشاريع المسؤولية المجتمعية والابتكار البيئي.' 
        : 'Industrial energy efficiency partnerships, synthetic fuel blending tech, and strategic clean transition co-investments.',
      tags: isArabic ? ['قلهات صور', 'خفض الانبعاثات', 'تصدير الغاز', 'وقود نظيف'] : ['Sur Terminal', 'Low-Carbon LNG', 'Synthetic Methane', 'Global Markets']
    },
    {
      id: 'nama_group',
      name: isArabic ? 'مجموعة نماء (Nama Group)' : 'Nama Group (Electricity & Water)',
      category: 'GRID_UTILITIES' as const,
      categoryLabel: isArabic ? 'الشبكة الوطنية لخدمات الكهرباء والمياه' : 'National Electricity & Utility Grid',
      type: isArabic ? 'شركة حكومية قابضة تحت جهاز الاستثمار' : 'State-Owned Utility Holding (OIA)',
      location: isArabic ? 'الشبكة الكهربائية الموحدة لسلطنة عُمان' : 'Main Interconnected Transmission Grid',
      icon: 'fa-bolt',
      color: 'cyan',
      goals: isArabic 
        ? 'إدارة شبكة النقل والتوزيع الوطنية، وزيادة حصة الطاقة المتجددة لتصل إلى 30% بحلول 2030، وتنظيم تعرفة شحن المركبات الكهربائية وتسهيل ربط محطات الشحن السريع بالشبكة.' 
        : 'Operating transmission/distribution grids, integrating 30% renewables by 2030, regulating EV charging tariffs (50 Baisas/kWh tier rules), and expediting CPO transformer connections.',
      investorBenefit: isArabic 
        ? 'توقيع اتفاقيات شراء الطاقة المتجددة (PPAs)، وتنفيذ مشاريع العدادات الذكية وشبكات الشحن العام بالتنسيق مع هيئة تنظيم الخدمات العامة (APSR).' 
        : 'Utility solar/wind PPAs, grid-scale battery storage contracts, smart metering infrastructure, and EV tariff regulatory alignment.',
      tags: isArabic ? ['تعرفة شحن EV', 'الشبكة الوطنية', '30% طاقة متجددة', 'هيئة تنظيم الخدمات'] : ['EV Tariff Regulation', '30% Renewables 2030', 'National Transmission', 'APSR Rules']
    }
  ];

  // Filtering Logic
  const filteredCompanies = allCompanies.filter((company) => {
    const matchesCategory = activeCategory === 'ALL' || company.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery = 
      company.name.toLowerCase().includes(query) ||
      company.categoryLabel.toLowerCase().includes(query) ||
      company.location.toLowerCase().includes(query) ||
      company.goals.toLowerCase().includes(query) ||
      company.investorBenefit.toLowerCase().includes(query) ||
      company.tags.some(tag => tag.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const evCompaniesCount = allCompanies.filter(c => c.category === 'EV_MOBILITY').length;
  const renewablesCount = allCompanies.filter(c => c.category === 'RENEWABLES_HYDROGEN').length;
  const utilitiesCount = allCompanies.filter(c => c.category === 'GRID_UTILITIES').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-10 pb-20 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      {/* ---------------------------------------------------- */}
      {/* HEADER SECTION                                       */}
      {/* ---------------------------------------------------- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--card-bg)] rounded-3xl shadow-card border border-[var(--border-glow)] p-6 md:p-8 transition-all"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isArabic ? 'رؤية عُمان 2040 والاستثمار الأخضر' : 'Oman Vision 2040 Green Ecosystem'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#D97706] drop-shadow-md">
              {isArabic ? 'قاعدة بيانات المناطق الاستراتيجية ومنظومة الطاقة والمركبات الكهربائية' : 'Strategic Zones & EV Energy Ecosystem Database'}
            </h2>
          </div>

          <select 
            value={localLanguage}
            onChange={(e) => setLocalLanguage(e.target.value as 'English' | 'Arabic')}
            className="bg-[var(--card-bg)] text-xs border border-[var(--border-glow)] rounded-xl px-3 py-2 text-[#D97706] outline-none font-bold shadow-sm cursor-pointer"
          >
            <option value="Arabic" className="bg-[var(--card-bg)] text-[var(--text-primary)]">العربية (Arabic)</option>
            <option value="English" className="bg-[var(--card-bg)] text-[var(--text-primary)]">English</option>
          </select>
        </div>

        <p className="text-[var(--text-secondary)] text-sm max-w-3xl leading-relaxed">
          {isArabic 
            ? 'دليل استراتيجي شامل للمستثمرين والباحثين يستعرض أبرز المناطق الحرة والصناعية، إلى جانب الشركات الوطنية الرائدة في قطاع الطاقة المتجددة، مصانع السيارات الكهربائية (EV)، وشبكات محطات الشحن السريع في سلطنة عُمان.' 
            : 'Comprehensive strategic directory detailing Oman’s prime special economic zones, leading renewable energy developers, emerging EV automotive manufacturers (Maysan & Karwa), and nationwide EV fast-charging network operators (CPOs).'}
        </p>
      </motion.div>

      {/* ---------------------------------------------------- */}
      {/* COMPANIES SECTION WITH EV INTEGRATION & FILTERS       */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
              <i className="fas fa-charging-station text-emerald-500"></i>
              <span>{isArabic ? 'أبرز شركات قطاع الطاقة والمركبات الكهربائية (EV)' : 'Leading Energy & EV Mobility Companies'}</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {isArabic 
                ? 'استعرض تفاصيل المصنعين، مشغلي الشحن (CPOs)، ومطوري الهيدروجين والشبكة الكهربائية.'
                : 'Explore OEM vehicle manufacturers, charge point operators (CPOs), green hydrogen developers, and grid equipment leaders.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <i className="fas fa-search absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder={isArabic ? 'ابحث عن شركة، تقنية، موقع...' : 'Search company, EV, zone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-glow)] text-xs text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-sans shadow-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-glow)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-layer-group"></i>
            <span>{isArabic ? 'جميع الشركات' : 'All Companies'} ({allCompanies.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('EV_MOBILITY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'EV_MOBILITY'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-glow)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-bolt-lightning text-amber-400"></i>
            <span>{isArabic ? 'المركبات الكهربائية وشبكات الشحن (EV)' : 'EV Cars & Charging Networks'} ({evCompaniesCount})</span>
          </button>

          <button
            onClick={() => setActiveCategory('RENEWABLES_HYDROGEN')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'RENEWABLES_HYDROGEN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-glow)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-leaf text-teal-400"></i>
            <span>{isArabic ? 'الطاقة المتجددة والهيدروجين' : 'Renewables & Green Hydrogen'} ({renewablesCount})</span>
          </button>

          <button
            onClick={() => setActiveCategory('GRID_UTILITIES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'GRID_UTILITIES'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-glow)] hover:text-[var(--text-primary)]'
            }`}
          >
            <i className="fas fa-microchip text-cyan-400"></i>
            <span>{isArabic ? 'الشبكة الوطنية والمحولات' : 'Grid Utilities & Transformers'} ({utilitiesCount})</span>
          </button>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.4) }}
              className={`bg-[var(--card-bg)] shadow-card p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                company.category === 'EV_MOBILITY'
                  ? 'border-emerald-500/40 hover:border-emerald-500'
                  : 'border-[var(--border-glow)] hover:border-[var(--accent-emerald)]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      company.category === 'EV_MOBILITY'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                    }`}>
                      <i className={`fas ${company.icon} text-lg`}></i>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-[var(--text-primary)] leading-snug">
                        {company.name}
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        {company.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Type & Location */}
                <div className="text-[11px] font-mono text-[var(--text-secondary)] space-y-0.5 mb-3 pb-2 border-b border-[var(--border-glow)]">
                  <div className="flex items-center gap-1.5">
                    <i className="fas fa-building text-slate-400 text-[10px]"></i>
                    <span className="truncate">{company.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <i className="fas fa-map-pin text-[10px]"></i>
                    <span className="truncate">{company.location}</span>
                  </div>
                </div>

                {/* Goals & Investor Benefit */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block mb-1">
                      {isArabic ? 'الأهداف والأنشطة:' : 'Key Operations & Strategy:'}
                    </span>
                    <p className="text-[var(--text-secondary)]">
                      {company.goals}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                      {isArabic ? 'فرص المستثمرين والباحثين:' : 'Investor & Research Synergies:'}
                    </span>
                    <p className="text-[var(--text-secondary)]">
                      {company.investorBenefit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--border-glow)] flex flex-wrap gap-1.5">
                {company.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-[var(--border-glow)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="p-8 text-center bg-[var(--card-bg)] rounded-2xl border border-[var(--border-glow)] text-[var(--text-secondary)] text-xs">
            <i className="fas fa-search text-2xl mb-2 text-slate-400"></i>
            <p>{isArabic ? 'لا توجد شركات مطابقة لمعايير البحث الحالية.' : 'No companies matched your current search criteria.'}</p>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* AI PROJECT SUGGESTION MODAL                          */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--card-bg)] text-[var(--text-primary)] rounded-3xl shadow-card border border-[#D97706] p-6 md:p-8 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold flex items-center text-[var(--text-primary)]">
                <i className="fas fa-location-arrow text-[#D97706] mx-3 drop-shadow-md"></i> 
                {isArabic ? 'تصور المشروع المقترح بالمنطقة' : 'Zone-Specific Concept'}
              </h3>
              <button onClick={() => setSuggestion(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--text-primary)]">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{isArabic ? 'هوية المشروع' : 'Project Identity'}</p>
                  <p className="text-lg font-bold">{suggestion.ProjectName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--accent-emerald)] dark:text-emerald-400 uppercase tracking-widest">{isArabic ? 'المبرر الاستراتيجي' : 'Strategic Justification'}</p>
                  <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">{suggestion.StrategicJustification}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'المادة الخام / المنظومة' : 'Feedstock / Input'}</p>
                  <p className="text-xs font-medium">{suggestion.Feedstock}</p>
                </div>
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'التقنية المطبقة' : 'Technology'}</p>
                  <p className="text-xs font-medium">{suggestion.Technology}</p>
                </div>
                <div className="col-span-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{isArabic ? 'تقدير الحجم والقدرة' : 'Scale Estimate'}</p>
                  <p className="text-xs font-medium">{suggestion.EstimatedScale}</p>
                </div>
              </div>
            </div>

            {/* Incentives */}
            <div className="mt-8 pt-8 border-t border-[var(--border-glow)]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-black text-[var(--accent-emerald)] dark:text-emerald-400 flex items-center uppercase tracking-widest">
                  <i className="fas fa-gift mx-2"></i> {isArabic ? 'محفزات رؤية عمان 2040' : 'Oman Vision 2040 Incentive Matcher'}
                </h4>
                <span className="text-xs font-bold text-[var(--text-secondary)] italic">{isArabic ? 'مطابقة مبنية على ملف المشروع' : 'Matched by Project Profile'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(suggestion.Incentives || []).map((inc, idx) => (
                  <div 
                    key={idx}
                    className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-glow)]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-xs font-black text-[var(--text-primary)]">{inc.title}</h5>
                      <i className="fas fa-award text-emerald-400 text-xs"></i>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">{inc.description}</p>
                    <div className="flex items-center text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">
                      <i className="fas fa-building-columns mx-1.5"></i>
                      {inc.authority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* STRATEGIC FREE ZONES WITH EV RELEVANCE               */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
            <i className="fas fa-map-location-dot text-[#D97706]"></i>
            <span>{isArabic ? 'المناطق الحرة والاقتصادية الكبرى في سلطنة عُمان' : 'Strategic Free Zones & EV Manufacturing Hubs'}</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isArabic 
              ? 'تكامل البنية التحتية اللوجستية للموانئ ومصانع المركبات الكهربائية وشبكات الطاقة.'
              : 'Logistics, port advantages, EV assembly sites, and clean energy transition synergies.'}
          </p>
        </div>

        <div className="space-y-6">
          {zones.map((z, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border-glow)] overflow-hidden shadow-card hover:border-[#D97706] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row text-[var(--text-primary)]">
                <div className="p-6 md:p-8 md:w-2/3 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)]">{z.name}</h3>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggest(z.name)}
                      disabled={!!loading}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold uppercase rounded-xl transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      {loading === z.name ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                      <span>{isArabic ? 'اقتراح مشروع ذكي بالمنطقة' : 'Suggest AI Project'}</span>
                    </motion.button>
                  </div>

                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{z.desc}</p>

                  {/* EV Highlight Callout */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                    <i className="fas fa-car-side mt-0.5 text-emerald-500 text-sm shrink-0"></i>
                    <div>
                      <span className="font-bold block mb-0.5">{isArabic ? 'صلة المنطقة بقطاع السيارات والشحن الكهربائي (EV):' : 'EV & Electric Mobility Ecosystem Synergy:'}</span>
                      <span>{z.evRelevance}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2.5">{isArabic ? 'مزايا المنطقة' : 'Zone Advantages'}</h4>
                      <ul className="space-y-1.5">
                        {z.advantages.map((adv, idx) => (
                          <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-center">
                            <i className="fas fa-check text-emerald-500 mx-2 text-xs shrink-0"></i> {adv}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2.5">{isArabic ? 'المشاريع الأنسب' : 'Best-Suited Projects'}</h4>
                      <ul className="space-y-1.5">
                        {z.bestSuited.map((proj, idx) => (
                          <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-center">
                            <i className="fas fa-star text-amber-500 mx-2 text-xs shrink-0"></i> {proj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] p-6 md:p-8 md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[var(--border-glow)] rtl:border-l-0 rtl:border-r">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{isArabic ? 'رؤية استراتيجية' : 'Strategic Insight'}</h4>
                  <p className="text-sm text-[var(--text-secondary)] italic font-medium leading-relaxed">"{z.note}"</p>
                  <div className="mt-6 flex items-center gap-2 text-[#D97706] font-bold text-xs drop-shadow-md">
                    <i className={`fas fa-arrow-${isArabic ? 'left' : 'right'}-long`}></i>
                    <span>{isArabic ? 'متوافق مع مستهدفات رؤية عمان 2040' : 'Aligned with Vision 2040'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OmanFreeZones;
