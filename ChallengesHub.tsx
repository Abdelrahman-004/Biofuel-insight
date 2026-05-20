import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  language: 'English' | 'Arabic';
  theme?: 'dark' | 'light';
}

type ChallengeSeverity = 'Critical' | 'High' | 'Medium';

interface Solution {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

interface Challenge {
  id: string;
  category: string;
  icon: string;
  titleEn: string;
  titleAr: string;
  severity: ChallengeSeverity;
  
  // 1. Problem Diagnosis
  diagnosisEn: string;
  diagnosisAr: string;
  impactEn: string;
  impactAr: string;
  
  // 2. Real-World Benchmark Data
  benchmarkEn: string[];
  benchmarkAr: string[];
  
  // 3. Technical Solutions (Ranked)
  solutions: Solution[];
  
  // 4. AI Optimization Layer
  aiTechEn: string[];
  aiTechAr: string[];
  
  // 5. Economic Analysis
  capexEn: string; capexAr: string;
  opexEn: string; opexAr: string;
  paybackEn: string; paybackAr: string;
  lcoeEn: string; lcoeAr: string;
  
  // 6. Oman-Specific Deployment Strategy
  deploymentEn: string[];
  deploymentAr: string[];
  
  // 7. Final Output Format
  priorityEn: string[];
  priorityAr: string[];
  riskLevelEn: string;
  riskLevelAr: string;
  gridImprovementEn: string;
  gridImprovementAr: string;
  investEn: string;
  investAr: string;
  
  sources: string[];
}

const CHALLENGES: Challenge[] = [
  // --- 1. RENEWABLE: INTERMITTENCY & GRID ---
  {
    id: 'ren-grid-storage',
    category: 'Renewable',
    icon: 'fa-network-wired',
    titleEn: 'Grid Stability & Long-Duration Energy Storage',
    titleAr: 'استقرار الشبكة وتخزين الطاقة طويل الأمد',
    severity: 'Critical',
    
    // 1. Diagnosis
    diagnosisEn: 'As Oman scales renewables towards the 30% target by 2030, the grid faces severe "duck curve" volatility. Gas remains the primary balancer. Without massive Long-Duration Energy Storage (LDES), excess midday solar generation faces extreme curtailment risks and grid frequency drops.',
    diagnosisAr: 'مع تصاعد الطموح لـ 30٪ كطاقة متجددة بـ 2030، تواجه شبكة عمان خطر تذبذب "منحنى البطة". الغاز هو الموازن الوحيد. بدون تخزين ضخم وطويل الأمد سيتم هدر الطاقة الشمسية المفرطة في الظهيرة، مع هبوط حاد في تردد الشبكة.',
    impactEn: 'High risk of 15% - 25% peak curtailment for mega PV plants; MW-scale frequency drops.',
    impactAr: 'خطر هدر 15%-25% من طاقة المحطات الشمسية الكبرى وقت الظهيرة؛ انخفاضات میجاواتية لتردد الشبكة.',
    
    // 2. Benchmark
    benchmarkEn: [
      'Solar capacity factors in Oman: ~22-26%',
      'Wind potential: High in Dhofar (Thumrait) & coastal regions',
      'Li-ion constraints: 120-200 USD/kWh (uneconomical > 4 hrs)',
      'Oman Vision 2040 Target: 30% Renewable by 2030'
    ],
    benchmarkAr: [
      'معامل كفاءة الطاقة الشمسية في عمان: ~22-26%',
      'قدرات رياح هائلة في ظفار (ثمريت) والمناطق الساحلية',
      'تكلفة الليثيوم للشبكات: 120-200 دولار/كيلوواط (غير مجدية لأكثر من 4 ساعات)',
      'رؤية 2040: 30% طاقة متجددة بحلول 2030'
    ],
    
    // 3. Solutions
    solutions: [
      {
        titleEn: '1. Pumped Hydro Storage (PHS)',
        titleAr: '1. التخزين المائي بالضخ (PHS)',
        descEn: 'Utilize mountainous terrain (Wadi Dayqah / Jabal Akhdar) for ultra-cheap, massive 12h+ bulk energy shifting.',
        descAr: 'استغلال المناطق الجبلية (وادي ضيقة / الجبل الأخضر) لتخزين كميات مهولة بأسعار رخيصة لـ 12+ ساعة كبطارية جاذبية.'
      },
      {
        titleEn: '2. Vanadium Redox Flow Batteries (VRFB)',
        titleAr: '2. بطاريات تدفق الفاناديوم (VRFB)',
        descEn: 'Scale 8-12 hour shifting for isolated grids. Zero degradation over 20+ years, highly resilient in 45°C ambient heat.',
        descAr: 'توفر تخزين 8-12 ساعة للشبكات المعزولة. عمرها 20+ سنة بدون تدهور، وتتحمل حرارة عمان القاسية (45°C) دون احتراق.'
      },
      {
        titleEn: '3. Synchronous Condensers & FACTS',
        titleAr: '3. المكثفات المتزامنة وأنظمة FACTS',
        descEn: 'Provide dynamic grid inertia and voltage support (STATCOM/SVC) completely displacing gas turbines as spinning reserves.',
        descAr: 'توفير استقرار لحظي وقصور ذاتي للشبكة لتعويض التوربينات الغازية بالكامل وحماية محطات 400kV.'
      }
    ],

    // 4. AI Layer
    aiTechEn: ['24h/Weekly Deep Learning Load Forecasting', 'Real-time Curtailment Prediction', 'Dynamic Grid Frequency What-If Simulators'],
    aiTechAr: ['التنبؤ العميق بالأحمال (24 ساعة/أسبوع)', 'خوارزميات التوقع اللحظي لهدر الطاقة (Curtailment)', 'محاكيات السيناريوهات (What-If) لتردد الشبكة'],
    
    // 5. Economics
    capexEn: '$200M - $500M (Utility Scale PHS/VRFB)', capexAr: '200M - 500M دولار (للمشاريع الكبرى)',
    opexEn: 'Low (VRFB/PHS) vs High (Gas OCGT)', opexAr: 'منخفض جداً (VRFB/PHS) مقارنة بالغاز',
    paybackEn: '8 - 14 Years', paybackAr: '8 - 14 سنة',
    lcoeEn: '$0.04 - $0.06 / kWh (Blended)', lcoeAr: '0.04 - 0.06 دولار للكيلوواط (تسعيرة مدمجة)',
    
    // 6. Deployment
    deploymentEn: ['Mountain Regions: Jabal Akhdar / Wadi Dayqah PHS', 'Dhofar Grid: VRFB to harmonize high wind yield', 'Main Interconnected System (MIS): Synchronous Condensers'],
    deploymentAr: ['المناطق الجبلية: سدود ضخ مائي (وادي ضيقة والجبل الأخضر)', 'شبكة ظفار: تقنيات VRFB لاستيعاب تقلب الرياح العنيف', 'الشبكة الرئيسية (MIS): مكثفات متزامنة للدعم اللحظي'],
    
    // 7. Output
    priorityEn: ['Mandate >4h storage quotas for all PV projects >100MW.', 'Initiate national PHS feasibility study.'],
    priorityAr: ['إلزامية توفير تخزين >4 ساعات لأي مشروع شمسي يتخطى 100MW', 'إطلاق دراسة جدوى وطنية للتخزين المائي الجبلي'],
    riskLevelEn: 'Low (Proven technologies)', riskLevelAr: 'منخفض (تقنيات مثبتة وموثوقة)',
    gridImprovementEn: '~40% frequency stability increase; Curtailment eliminated.', gridImprovementAr: 'مكاسب ~40% في مرونة التردد؛ القضاء على الهدر المفرط.',
    investEn: 'Local VRFB Electrolyte & Battery Assembly Plant in Sohar ($60M)', investAr: 'مصنع محلي لبطاريات وسوائل VRFB في صحار (60 مليون دولار)',
    sources: ['IEEE Grid Stability', 'IRENA Costs', 'OETC 400kV Masterplan']
  },

  // --- 2. RENEWABLE: DUST & HEAT ---
  {
    id: 'ren-dust-heat',
    category: 'Renewable',
    icon: 'fa-temperature-sun',
    titleEn: 'Extreme Summer Piques & Soiling Losses',
    titleAr: 'ذروة الحرارة العنيفة وخسائر الغبار الكوارتزي',
    severity: 'High',
    
    diagnosisEn: 'Ambient peaks of 45-50°C aggressively plummet PV cell thermal efficiency. Silica dust storms in the interior regions (where huge PV farms are located) cause massive soiling losses, while wet-cleaning severely taxes limited freshwater supplies.',
    diagnosisAr: 'الحرارة المحيطة (45-50°C) تسقط كفاءة ألواح PV بشكل كارثي. ذرات الغبار الكوارتزي في مناطق الداخلية العمانية (حيث المزارع الشمية) تسبب خسائر تراكمية وتآكل. التنظيف المائي يستنزف العصب المائي المحدود بشدة.',
    impactEn: 'Thermal efficiency drops 0.4% per 1°C >25°C. Uncleaned panels lose 15-30% generation yield.',
    impactAr: 'خسارة 0.4% من الكفاءة لكل درجة فوق 25 مئوية. الألواح غير المنظفة تفقد 15-30% من الإنتاج شهرياً.',
    
    benchmarkEn: [
      'Ambient summer temps consistently >45°C (Panel surface >65°C)',
      'High coastal humidity (Sur/Muscat) hardens dust into crusts',
      'Standard wet cleaning consumes 1.5L/m² of desalinated water'
    ],
    benchmarkAr: [
      'حرارة الصيف المحيطة تتجاوز 45 مئوية (سطح اللوح أكثر من 65°C)',
      'الرطوبة الساحلية (صُور/مسقط) تحول الغبار إلى عجينة صلبة لاصقة',
      'التنظيف المائي يستهلك 1.5 لتر/م² من المياه المحلاة المكلفة'
    ],
    
    solutions: [
      {
        titleEn: '1. Autonomous Dry-Cleaning Robotics',
        titleAr: '1. الروبوتات الذاتية للتنظيف الجاف',
        descEn: 'Deploy microfiber-based track robots operating natively without water, scheduled nightly to defeat dew-driven crusting.',
        descAr: 'استخدام روبوتات ذاتية بفرش المايكروفايبر بدون قطرة ماء واحدة، تعمل ليلاً قبل تكون ندى الفجر الذي يثبت الغبار.'
      },
      {
        titleEn: '2. High-Albedo Bifacial Panels + HJT / Perovskites',
        titleAr: '2. الألواح ثنائية الوجه (Bifacial) وحلول HJT',
        descEn: 'Capitalize on Omani desert sand albedo. Heterojunction (HJT) tech holds far superior thermal degradation coefficients in 50°C heats.',
        descAr: 'استغلال انعكاس الرمل العماني الفاتح بالألواح الثنائية. استخدام تقنيات HJT التي تقاوم الانهيار الحراري في بيئة 50 مئوية بامتياز.'
      },
      {
        titleEn: '3. Electrodynamic Dust Shields (EDS)',
        titleAr: '3. الدروع الكهروديناميكية (EDS)',
        descEn: 'Pulsing invisible surface electrodes to actively repel descending sand—a waterless micro-energy solution.',
        descAr: 'نبضات تيار خفية على سطح اللوح لتنافر ذرات الغبار فورياً، حل معدوم المياه قليل الطاقة.'
      }
    ],

    aiTechEn: ['Real-time Soiling Deposition Prediction Models', 'Machine Vision Micro-crack & Hotspot Detection'],
    aiTechAr: ['نماذج تنبؤية لمعدل ترسب الغبار بناءً على الطقس', 'الرؤية الآسعة للتعرف على الخدوش المجهرية (Hotspots) الطائرة بالدرون'],
    
    capexEn: '~$10-15M for utility-scale robot fleets', capexAr: '10-15 مليون دولار لأساطيل الروبوتات بالمحطات الكبرى',
    opexEn: 'Drastically reduced (no water desalinaton bills)', opexAr: 'منخفض جداً (التخلص من فواتير التحلية ونقل المياه)',
    paybackEn: '2 - 4 Years', paybackAr: '2 - 4 سنوات',
    lcoeEn: 'Saves ~$0.01/kWh by unlocking lost yield', lcoeAr: 'يستعيد حوالي 0.01 دولار لكل كيلوواط من الخسائر',
    
    deploymentEn: ['Interior Regions (Adam, Manah, Ibri): Mandatory Dry Robotics', 'Coastal Regions: Anti-soiling hydrophobic nanocoatings to prevent humidity sludge'],
    deploymentAr: ['الداخلية (أدم، منح، عبري): إلزامية التنظيف الجاف', 'السواحل: طلاء نانوي ذكي طارد للمياه يمنع تكلس الغبار مع رطوبة البحر'],
    
    priorityEn: ['Draft legislation banning fresh/desalinated water for mega-utility solar cleaning.', 'Subsidize R&D for local robotic OEM setups.'],
    priorityAr: ['استصدار تشريع يمنع استخدام المياه المحلاة لتنظيف المحطات الكبرى بقطعية.', 'تمويل الشركات المحلية لتصنيع روبوتات متكيفة محلياً.'],
    riskLevelEn: 'Low (Immediate gains)', riskLevelAr: 'منخفض (عوائد فورية شبه مضمونة)',
    gridImprovementEn: 'Restores stable ~20% generational yield capacity loss.', gridImprovementAr: 'استعادة ما يقارب 20% من قدرات التوليد المفقودة يومياً.',
    investEn: 'Manufacturing Hub for Omani-specialized dry-cleaning robots ($15M)', investAr: 'مدينة تصنيع روبوتات صحراوية (15 مليون دولار)',
    sources: ['NREL Desert Studies', 'Water Use in Solar (IEA)', 'SQU Energy Center']
  },

  // --- 3. HYDROGEN: WATER & DESAL ---
  {
    id: 'gh2-water-impact',
    category: 'Hydrogen',
    icon: 'fa-droplet-slash',
    titleEn: 'Green H2: Desalination Strain & Extreme Cooling Loops',
    titleAr: 'مأزق الهيدروجين الأخضر: استنزاف المياه والتبريد المعقد',
    severity: 'Critical',
    
    diagnosisEn: 'Electrolyzing Oman’s 1M-ton hydrogen target by 2030 requires treating tens of millions of tons of seawater. Not only does this drain mass auxiliary power, but dumping hypersonic high-salinity brine destroys marine coasts. Furthermore, PEM electrolyzers run at ~80°C and cooling them in 45°C ambient summers is enormously inefficient.',
    diagnosisAr: 'هيدروجين عمان بحلول 2030 (مليون طن) يستهلك عشرات الملايين من الأطنان المائية. هذا يدمر البيئة البحرية بالمحلول الملحي ويستغرق كهرباء مرعبة. محللات PEM تعمل بحرارة 80°C، وتبريدها في جو صيفي يغلي عند 45°C يقضي هندسياً على كفاءتها.',
    impactEn: 'Brine dumping zones turn coastal waters dead; cooling loops waste up to 15% of total input power.',
    impactAr: 'مناطق إلقاء البراين (الملح المكثف) تميت السواحل؛ أنظمة التبريد تبتلع 15% من كهرباء المحطة الشمسية أدراج الرياح.',
    
    benchmarkEn: [
      'PEM/Alkaline H2 requires ~9 Liters of ultra-pure water/kg',
      'Cooling demands nearly ~20L/kg additional raw water limits',
      'Oman Coastal Humidity: Reduces evaporative cooling tower efficiency'
    ],
    benchmarkAr: [
      'صناعة كجم هيدروجين تحتاج 9 لتر مياه شديدة النقاء (أغلى من العذبة)',
      'عمليات تبريد أجهزة التحليل تحتاج 20 لترا إضافيا',
      'رطوبة السواحل العمانية تضعف كفاءة التبريد بالتبخير بشدة'
    ],
    
    solutions: [
      {
        titleEn: '1. Zero Liquid Discharge (ZLD) Desalination',
        titleAr: '1. التحلية منعدمة التصريف (ZLD)',
        descEn: 'Prevent ocean dumping completely. Crystallize brine into solid industrial salts & rare-earth metals for commercial export.',
        descAr: 'منع رمي السموم البحرية. بلورة وتجفيف الماء المالح بالكامل لمواد صلبة وأملاح نادرة قابلة للبيع (المغنيسيوم / الليثيوم).'
      },
      {
        titleEn: '2. Deep Sea Water Cooling (DSWC)',
        titleAr: '2. تبريد أعماق المحيط (DSWC)',
        descEn: 'Pipeline deep cold ocean water (4°C) from the Arabian Sea directly up into Duqm electrolyzer chillers, bypassing 45°C ambient air completely.',
        descAr: 'ضخ المياه من أعماق بحر العرب (4°C) مباشرة لخوادم الدقم لتبريد المحلات، متجاهلين حرارة الجو الخارجية تماماً.'
      },
      {
        titleEn: '3. Direct Seawater Electrolysis R&D',
        titleAr: '3. التحليل المباشر لماء البحر',
        descEn: 'Invest into next-gen membranes that bypass the RO (Reverse Osmosis) desalination step entirely. (Emerging Tech)',
        descAr: 'الاستثمار في جيل جديد من الأغشية القادرة على تحليل مياه البحر بدون محطة تنقية قبلية (تحت البحث).'
      }
    ],

    aiTechEn: ['AI-Optimized Reverse Osmosis Flux Pressures', 'Digital Twins for Thermal Electrolyzer Management'],
    aiTechAr: ['تحسين ضغط التناضح العكسي (RO) لحظياً عبر الذكاء لتقليل هدر الكهرباء', 'منظومة تفكير حراري رقمية لمنع ارتفاع حرارة المحلل أو إيقافه'],
    
    capexEn: '+20% CAPEX penalty for ZLD hardware ($200M)', capexAr: 'شراء تقنيات ZLD يضيف 20% لتكلفة المشروع (+200M دولار)',
    opexEn: 'Offset dramatically by mineral/salt sales', opexAr: 'يتم تعويضه بمبيعات الأملاح والمعادن النادرة',
    paybackEn: '6 - 9 Years (w/ Commercial Salt Sales)', paybackAr: '6 - 9 سنوات (بافتراض بيع الأملاح للمصانع)',
    lcoeEn: 'Minimal impact if mineral offsets used (-$0.2/kg H2)', lcoeAr: 'تأثير طفيف على السعر بل قد يدعمه ببيع المعادن (-0.2$/كجم)',
    
    deploymentEn: ['Duqm Industrial Zone: Giant ZLD interconnected hubs', 'Sur/Arabian Sea Coast: Deep Ocean Cooling intakes'],
    deploymentAr: ['الدقم أو الجازر: مجمعات ZLD عملاقة مترابطة', 'الساحل الجنوبي وبحر العرب: استخدام برودة المحيطات العميقة للشفط الحراري'],
    
    priorityEn: ['Mandate ZLD for all Hydrom megaprojects.', 'Fund Deep Sea Cooling feasibility studies off Sur coast.'],
    priorityAr: ['إنزال بند قانوني ملزم بـ ZLD لجميع مشاريع شركة Hydrom.', 'تمويل دراسة جدوى فورية لشفط مياه التبريد العميقة.'],
    riskLevelEn: 'Medium (High initial capital)', riskLevelAr: 'متوسط (نظراً لكثافة رأس المال الأولي)',
    gridImprovementEn: 'Recovers up to 10-15% of OPEX power previously wasted on AC cooling.', gridImprovementAr: 'توفير استهلاك هائل للكهرباء (10-15%) كانت تحرق في مبردات المصنع.',
    investEn: 'Brine Mining & Metal Extraction Facility in Duqm ($100M)', investAr: 'مصنع تعدين واستخلاص من تفل المياه المالحة في الدقم (100 مليون دولار)',
    sources: ['Water Research Journal', 'Oman Environment Authority', 'Hydrom']
  },

  // --- 4. HYDROGEN: CAPEX & LOGISTICS ---
  {
    id: 'gh2-capex-export',
    category: 'Hydrogen',
    icon: 'fa-globe-americas',
    titleEn: 'Export Viability, Transport & Economics',
    titleAr: 'تحديات التصدير، النقل الاقتصادي ومخاطر الاستثمار',
    severity: 'Medium',
    
    diagnosisEn: 'Green H2 has terrifying capital expenditure. Electrolyzers mandate continuous 4,000+ hour runtimes to be viable. Exporting H2 demands liquefaction at -253°C or costly ammonia conversion. Traditional natural gas pipelines undergo "Embrittlement" (cracking) when carrying pure H2. Current prices >$4/kg cannot compete with natural gas.',
    diagnosisAr: 'رأس مال مهول. لتسديده يجب تشغيل المحللات لـ 4000+ ساعة سنوياً دون توقف شمس ورياح. نقل الهيدروجين يتطلب تبريده حتى (-253°C) أو تحويله لأمونيا مكلفة. ضخه في أنابيب الغاز الطبيعي يمزقها بفعل التقصف (Embrittlement). بسعره الحالي (+4$/كجم) هو خارج المنافسة.',
    impactEn: 'If LCOH is not halved by 2030, Omani mega-projects face massive bankability constraints.',
    impactAr: 'إذا لم ينزل سعر الهيدروجين للنصف (LCOH)، المشاريع الاستراتيجية العمانية ستعاني في جذب المستثمرين الدوليين.',
    
    benchmarkEn: [
      'Green LCOH: ~$4-5/kg | Grey H2: ~$1.5-2/kg',
      'Converting H2 -> Ammonia costs ~15-20% of energy payload',
      'Wind Corridors (Masirah/Dhofar) can boost capacity factor to ~45%+'
    ],
    benchmarkAr: [
      'سعر الهيدروجين الأخضر: ~4-5$/كجم مقابل الغاز الطبيعي ~1.5$/كجم',
      'عملية تحويل H2 لأمونيا (للشحن) تضيع 20% من إجمالي الطاقة العائدة',
      'حزام الرياح (مصيرة/ظفار) يرفع استمرارية المحطات الجبارة لـ 45%+'
    ],
    
    solutions: [
      {
        titleEn: '1. Co-locate SOEC with Steel/Aluminium',
        titleAr: '1. دمج SOEC مع مصانع الصلب (صحار)',
        descEn: 'Place Solid Oxide Electrolyzers (SOEC) next to Sohar industrial heat. Using 800°C waste-heat reduces electricity demand for H2 by roughly 30%!',
        descAr: 'استخدام محللات الأكسيد الصلب (SOEC) للعمل على حرارة مصانع صحار المهدرة (800°C)، هكذا نوفر 30% من كهرباء المحللات.'
      },
      {
        titleEn: '2. Liquid Organic Hydrogen Carriers (LOHC)',
        titleAr: '2. حوامل LOHC السائلة الآمنة',
        descEn: 'Chemically bind H2 to chemicals (like Toluene) causing it to stay liquid at room temperature for shipping, bypassing -253°C cryogenic nightmares.',
        descAr: 'تثبيت الغاز بصيغة كيميائية سائلة (تولوين مثلاً) وشحنة في ناقلات نفط عمانية عادية بدرجة حرارة الغرفة بأمان تام.'
      },
      {
        titleEn: '3. Dedicated H2 Polymer Pipelines',
        titleAr: '3. أنابيب مخصصة أو مبطنة',
        descEn: 'Retrofit standard OQ gas pipelines with polymer/composite sleeving to safely transport H2 to port without embrittlement fracturing.',
        descAr: 'استخدام طبقات بوليمرية لتبطين أنابيب OQ للغاز، لحمايتها من التشقق الهيدروجيني بدلاً من حفر خطوط جديدة باهظة.'
      }
    ],

    aiTechEn: ['Energy Arbitrage Market Bidding AI', 'Pipeline Acoustic Leak Detection ML'],
    aiTechAr: ['طرح أوامر شراء/بيع الطاقة اللحظي بخوارزميات الأسعار (Arbitrage)', 'تحليل الموجات الصوتية لاكتشاف التسرب المجهري في الأنابيب (ML)'],
    
    capexEn: '$50M - $150M for LOHC or SOEC retrofits', capexAr: '50-150 مليون دولار لتأهيل التقنيات المتقدمة',
    opexEn: 'Cuts transport & electricity opex by ~25%', opexAr: 'يقلص مصاريف الشحن والتبريد الباهظة ربع القيمة',
    paybackEn: '8 - 12 Years', paybackAr: '8 - 12 سنة',
    lcoeEn: 'Target LCOH: <$2.5 by 2030', lcoeAr: 'الهدف: وصول تسعيرة الانتاج لأقل من 2.5 دولار/كجم',
    
    deploymentEn: ['Sohar Port: Waste-heat SOEC clusters', 'Duqm Port: LOHC chemical binding export hubs'],
    deploymentAr: ['ميناء صحار: استغلال حرارة مصانع المعادن الثقيلة', 'ميناء الدقم: محطات خلط وتثبيت LOHC السائلة للتصدير الأوروبي/الآسيوي'],
    
    priorityEn: ['Pivot from 100% Ammonia strategy to localized LOHC exploration.', 'Mandate 100% green H2 for Sohar heavy industries locally first before export.'],
    priorityAr: ['تقليص الاعتماد الحصري على تصدير الأمونيا المشتتة للطاقة وتفعيل LOHC.', 'فرض استخدام الهيدروجين محلياً لمصانع الصلب أولاً لخفض البصمة الكربونية (Scope 3).'],
    riskLevelEn: 'High (Market fluctuation risks)', riskLevelAr: 'عالي (لاضطرابات طلب السوق الأوروبي والآسيوي)',
    gridImprovementEn: 'Reduces the massive offshore wind over-sizing needed for export security.', gridImprovementAr: 'يقلل الحمل والشراء המفرط للطاقة لضمان ربحية المصنع المفتقر للكفاءة.',
    investEn: 'Oman-built LOHC Polymer Pipeline Extrusion Plant ($80M)', investAr: 'مصنع عماني لأنابيب البوليمر المعزولة بالدقم (80 مليون دولار)',
    sources: ['Fraunhofer Institute', 'OQ / Hydrom Statements', 'Hydrogen Council']
  },

  // --- 5. BIOFUEL: FEEDSTOCK & AGRICULTURE ---
  {
    id: 'bio-feedstock-agrc',
    category: 'Biofuel',
    icon: 'fa-seedling',
    titleEn: 'Agricultural Limits, Lack of Feedstock & Water Constraints',
    titleAr: 'عجز الزراعة، شح المواد الخام وندرة المياه',
    severity: 'High',
    
    diagnosisEn: 'Unlike Brazil or the US, Oman cannot grow commercial soy, corn, or rapeseed for 1st-generation biofuels due to strict fresh-water scarcity and arid land limits. Waste-Cooking Oil (WCO) from restaurants is incredibly fragmented and logistics-heavy. Importing feedstock destroys the CO2-saving logic of biofuel entirely due to transport emissions.',
    diagnosisAr: 'عكس الغرب، لا تمتلك عمان أراض ومياه لزراعة فول الصويا والذرة للوقود. زيوت الطبخ المستعملة متفرقة عشوائياً وتجميعها من المطاعم منهك لوجستياً. أما استيراد المواد الخام من الخارج فيقتل الميزة البيئية للمشروع (بسبب انبعاثات سفن الشحن).',
    impactEn: 'Local biofuel refineries idle at <40% capacity due to lacking raw input materials.',
    impactAr: 'المصانع الحيوية المحلية تعمل بقدرات شبه معطلة لغياب المواد الخام المستدامة.',
    
    benchmarkEn: [
      'Very limited fresh water quotas for agriculture',
      'WCO yields only thousands of tons natively, not millions',
      'Aviation and heavy trucks desperately need local SAF (Sustainable Aviation Fuel)'
    ],
    benchmarkAr: [
      'حصص صارمة للمياه العذبة للآبار الزراعية لا يجب المساس بها',
      'تجميع زيوت الطبخ محلياً ينتج آلاف الأطنان وليس ملايين للوصول ללجدوى',
      'طيران العمانية والشاحنات الثقيلة بحاجة ماسة لوقود طيران مستدام محلي (SAF)'
    ],
    
    solutions: [
      {
        titleEn: '1. Seawater Microalgae Photobioreactors',
        titleAr: '1. مزارع الطحالب الدقيقة القائمة على مياه البحر',
        descEn: 'Grow specific algae strains in coastal tubes (non-arable land) utilizing zero fresh water, absorbing industrial CO2 emissions as fertilizer.',
        descAr: 'زراعة سلالات طحالب في أنابيب زجاجية على السواحل غير الصالحة للزراعة، لا تسحب ماء عذب، ותستهلك الـ CO2 من المصانع كسماد ربحي.'
      },
      {
        titleEn: '2. Hydrothermal Liquefaction (HTL) for Sludge',
        titleAr: '2. التسييل الحراري المائي (HTL) للنفايات الصلبة',
        descEn: 'Bypass drying completely—take wet municipal solid waste and Nama/Haya sewage sludge directly under extreme heat/pressure to form crude bio-oil.',
        descAr: 'أخذ نفايات عُمان الرطبة (حمأة حيا) بماءها، وطبخها تحت ضغط عالي جداً لتحويلها مباشرة إلى نفط حيوي خام، يعالج أزمة المرادم والوقود معاً.'
      },
      {
        titleEn: '3. National WCO Blockchain Tracking',
        titleAr: '3. التتبع اللوجستي المالي لزيوت الطبخ',
        descEn: 'Digitize WCO logistics. Provide monetary smart-contract incentives for remote restaurants to actively deposit cooking oils.',
        descAr: 'رقمنة سلاسل التجميع بمنصة ذكية. منح المطاعم والقرى مبالغ مالية أوتوماتيكية عبر المنصة مقابل التزامهم بإلقاء نفايات زيوتهم.'
      }
    ],

    aiTechEn: ['AI Algae Yield Predicting Models', 'Routing Logic Optimization for WCO Trucks'],
    aiTechAr: ['نماذج تنبؤية لنمو الطحالب وتسريع الحصاد', 'توجيهات طرق ذكية لشاحنات تجميع الخردة الزيتية لخفض تكلفة النقل'],
    
    capexEn: '$30M-$60M (Algae Tubes & HTL Facilities)', capexAr: '30-60 مليون دولار (لتقنيات الطحالب والتسييل HTL)',
    opexEn: 'Moderate (Algae continuous harvesting)', opexAr: 'متوسط (نظراً للحصاد الآلي والحرارة الجوية المساهمة)',
    paybackEn: '5 - 7 Years', paybackAr: '5 - 7 سنوات',
    lcoeEn: 'Produces Bio-Crude at ~$50-70 / Barrel Eq.', lcoeAr: 'ينتج برميل خام حيوي بتكلفة تعادل 50-70 دولار أمريكي',
    
    deploymentEn: ['Al Wusta Coast: Deep seawater-fed algae farms', 'Muscat / Be’ah hubs: Embedded HTL processing units in landfills'],
    deploymentAr: ['ساحل الوسطى: مزارع أنابيب الطحالب المعزولة', 'مسقط ومراكز Be\'ah: تفعيل وحدات معالجة HTL داخل مرادم البلدية العادية'],
    
    priorityEn: ['Ban WCO export off Omani shores; mandate local processing.', 'Initiate pilot HTL plant with Oman Environmental Authority.'],
    priorityAr: ['منع تصدير زيوت الطبخ المستعملة من السلطنة نهائياً وفرض معالجتها داخلياً.', 'تدشين مصنع تجريبي (HTL) بالتعاون مع Be\'ah ونماء للمياه.'],
    riskLevelEn: 'Medium (Biomass supply shocks)', riskLevelAr: 'متوسط (لمخاطر تعطل توريد المخلفات المستمر)',
    gridImprovementEn: 'Provides non-intermittent, dispatchable green base-load bio-electricity.', gridImprovementAr: 'يوفر طاقة حمل أساسية خضراء وغير متقطعة عكس الشمس والرياح.',
    investEn: 'Coastal Microalgae Biorefinery at Sur ($40M)', investAr: 'مصنع طحالب مِكرَوِيّة وحيوي في ساحل صُور (40 مليون دولار)',
    sources: ['SQU Marine Science', 'Oman Be’ah Strategy', 'MDPI Bioenergy']
  },

  // --- 6. BIOFUEL: PRODUCTION EROEI ---
  {
    id: 'bio-eroei-cost',
    category: 'Biofuel',
    icon: 'fa-industry',
    titleEn: 'Production Costs, EROEI Trap & Specialized Refineries',
    titleAr: 'تكاليف الإنتاج، مصيدة الكفاءة (EROEI)، وغياب المصافي',
    severity: 'Medium',
    
    diagnosisEn: 'Energy Return on Energy Invested (EROEI) is a massive threat: If a biofuel plant consumers massive grid electricity/heat to refine oils, the net green energy gained is negligible. Furthermore, small local processors lack the economy of scale, facing high imports for enzymes and methanol catalysts used in processing.',
    diagnosisAr: 'العائد الطاقي (EROEI) هو الفخ الأكبر: إذا استخدمنا كهرباء وحرارة ضخمة لمعالجة الزيوت الحيوية، فالمحصلة الصافية شبه معدومة بيئياً. المصانع المحلية الصغيرة تفتقر لاقتصاديات الحجم وتعاني من شراء الإنزيمات والميثانول بأسعار باهظة من الخارج.',
    impactEn: 'Negative carbon-returns if production relies on gas-heavy grid power. High Catalyst costs crush margins.',
    impactAr: 'عائد كربوني سلبي تماماً إذا أخذنا كهربائنا من محطات غازية متخلفة. الانزيمات تأكل كل الجدوى الاقتصادية الربحية.',
    
    benchmarkEn: [
      'Processing efficiency drop without local catalytic agents',
      'Conventional transesterification demands massive heat/electricity',
      'Oman lacks dedicated giant Biorefineries (unlike Europe)'
    ],
    benchmarkAr: [
      'هبوط الكفاءة لعدم وجود مركبات محفزة كيميائية مصنوعة محلياً',
      'الأسترة الكيميائية التقليدية المتعارف عليها غبية وتتطلب حرارة وضغط مهول',
      'السلطنة تفتقر لمصافي حيوية (Biorefineries) جبارة عكس أوروبا'
    ],
    
    solutions: [
      {
        titleEn: '1. Enzymatic Transesterification',
        titleAr: '1. الأسترة الإنزيمية البكتيرية',
        descEn: 'Replace brute-force chemical heat with specialized enzyme bacterias (lipases) that successfully refine biofuels at normal Omani room temperatures, drastically crashing OPEX/Power bills.',
        descAr: 'استبدال الحرارة بالقوة الغاشمة باستخدام إنزيمات بكتيرية تقوم بمعالجة الزيت بحرارة الغرفة العادية في عمان! هذا يطيح بفواتير الكهرباء.'
      },
      {
        titleEn: '2. Petroleum Co-Processing (Drop-in Fuels)',
        titleAr: '2. المعالجة المشتركة في مصافي النفط الحالية',
        descEn: 'Instead of building expensive standalone biorefineries, directly inject 10% bio-crude feeds into the existing gigantic OQ OQ8 pipelines in Duqm/Sohar for co-processing.',
        descAr: 'بدل بناء مصافي حيوية بمليارات، ضخ الزيت الخام الحيوي (10%) مباشرة مع النفط الخام في مطابخ مصفاة الدقم OQ8 ودمجها بيئياً.'
      },
      {
        titleEn: '3. Local Methanol & Bio-Catalyst Production',
        titleAr: '3. توطين الميثانول والمحفزات',
        descEn: 'Leverage Oman’s massive methanol industry (Salalah Methanol Company) to locally subsidize bio-catalysts, fortifying the supply-chain independence.',
        descAr: 'استغلال تصدير عمان الهائل للميثانول (صلالة) عبر توجيه نسبة مدعومة منه لصناعة الوقود الحيوي والمحفزات محلياً.'
      }
    ],

    aiTechEn: ['AI-Driven Chemical Catalyst Discovery', 'Process Digital Twins for Biorefinery Control'],
    aiTechAr: ['تسخير الذكاء الاصطناعي لاكتشاف توليفات إنزيمية جديدة لمواد عمان', 'التوأم الرقمي للتحكم بجودة المصنع الكيميائية اللحظية (Digital Twin)'],
    
    capexEn: '$5M-$10M (Retrofits and Enzymes)', capexAr: '5 إلى 10 ملايين دولار (ميزانية تأهيل مصافي النفط للدمج)',
    opexEn: 'Greatly reduced (zero-heat processing)', opexAr: 'انخفاض عالي (عمليات المعالجة بكتيرية بدرجة حرارة الغرفة العادية)',
    paybackEn: '3 - 5 Years (Fast ROI if Co-processed)', paybackAr: '3 - 5 سنوات فقط (إذا تم المعالجة المشتركة مع OQ)',
    lcoeEn: 'SAF/Bio-Diesel Premium shrinks down 40%', lcoeAr: 'الفارق السعري عن الديزل العادي سيتقلص بـ 40%',
    
    deploymentEn: ['Sohar & Duqm Ports: Bio-Crude Co-processing in OQ Pipelines', 'Salalah: Specialized local enzyme laboratories'],
    deploymentAr: ['موانئ الدقم وصحار: معالجة الزيوت مباشرة قبل تصدير النفط كوقود مخلوط سليم بيئياً.', 'صلالة: مختبرات إنزيمية لصناعة المحفزات المجهرية.'],
    
    priorityEn: ['Form a joint-venture with OQ to allow 5% bio-oil co-processing mandates.', 'Fund SQU R&D exclusively for high-heat tolerant Bio-lipases.'],
    priorityAr: ['توحيد الجهود مع OQ لفرض خلط 5% من إنتاج مصافيها بخام حيوي عماني.', 'تمويل جامعة السلطان قابوس لاستخلاص إنزيمات محلية لا تموت في طقس عمان.'],
    riskLevelEn: 'Low (Uses existing infrastructure completely)', riskLevelAr: 'منخفض جداً (لأنه يستنفع من البنية التحتية الجاهزة)',
    gridImprovementEn: 'Guarantees the EROEI remains highly positive over the lifecycle.', gridImprovementAr: 'يضمن ربحية العائد الطاقي وعدم حرق للكهرباء.',
    investEn: 'Biofuel Catalyst Local Synthesis Factory near SMC ($25M)', investAr: 'مصنع استخلاص وتصنيع المحفزات الكيميائية بجوار SQU/OQ (25 مليون دولار)',
    sources: ['OQ8 Duqm Refinery', 'ScienceDirect Chemical Engineering', 'Oman Vision 2040']
  }
];

export const ChallengesHub: React.FC<Props> = ({ language, theme }) => {
  const isArabic = language === 'Arabic';
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const [selectedChallenge, setSelectedChallenge] = React.useState<Challenge | null>(null);

  const categories = [
    { id: 'All', icon: 'fa-globe', labelEn: 'All Challenges', labelAr: 'جميع التحديات' },
    { id: 'Renewable', icon: 'fa-solar-panel', labelEn: 'Renewables', labelAr: 'الطاقة المتجددة' },
    { id: 'Hydrogen', icon: 'fa-atom', labelEn: 'Green Hydrogen', labelAr: 'الهيدروجين الأخضر' },
    { id: 'Biofuel', icon: 'fa-leaf', labelEn: 'Biofuels', labelAr: 'الوقود الحيوي' }
  ];

  const filteredChallenges = activeCategory === 'All' 
    ? CHALLENGES 
    : CHALLENGES.filter(c => c.category === activeCategory);

  const analysisRef = React.useRef<HTMLDivElement>(null);
  const listTopRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (selectedChallenge && analysisRef.current) {
        setTimeout(() => {
          analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [selectedChallenge]);

  return (
    <div className="w-full text-[var(--text-secondary)] font-sans relative pb-20 overflow-x-hidden min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Dynamic Background */}
      <div className="absolute inset-x-0 top-0 h-[800px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent-emerald)]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 relative z-10" ref={listTopRef}>
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-5 py-2 rounded-full bg-[var(--bg-main)] border border-[var(--border-glow)] text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-[var(--accent-emerald)] mb-6 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
              {isArabic ? 'التحليل الاستراتيجي لمنظومة الطاقة' : 'STRATEGIC ENERGY SYSTEM ANALYSIS'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight leading-tight">
              {isArabic ? 'عُمان نحو منظومة الطاقة' : 'OMAN GRID TRANSITION &'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-emerald)] to-blue-500">{isArabic ? 'الذكية' : 'AI OPTIMIZATION'}</span>
            </h1>
            <p className="max-w-4xl mx-auto text-sm md:text-base leading-relaxed text-[var(--text-secondary)] px-4 font-medium">
              {isArabic 
                ? 'تحليل استراتيجي عميق مبني على بيانات حقيقية لعُمان ورؤية 2040. يشمل تشخيص مشاكل الشبكة، الجدوى الاقتصادية، الحلول التقنية المصنفة، وطبقة التحسين المعتمدة على الذكاء الاصطناعي.' 
                : 'Deep strategic analysis based on real-world Omani data and Vision 2040. Covering grid constraints, economic viability, ranked technical solutions, and actionable AI layers.'}
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedChallenge(null);
              }}
              className={`px-4 md:px-5 py-2.5 md:py-3 rounded-2xl text-[10px] md:text-xs font-bold transition-all duration-300 border flex items-center justify-center gap-2 md:gap-3 tracking-widest uppercase ${
                activeCategory === cat.id 
                  ? 'bg-[var(--card-bg)] border-[var(--accent-emerald)] text-[var(--accent-emerald)] shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]' 
                  : 'bg-[var(--bg-main)] border-[var(--border-glow)] text-[var(--text-secondary)] hover:border-gray-400 hover:text-[var(--text-primary)]'
              }`}
            >
              <i className={`fas ${cat.icon}`}></i>
              {isArabic ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start relative transition-all duration-500">
          
          {/* Challenges List (Sticky on desktop, stacks on mobile) */}
          <div className={`${selectedChallenge ? 'w-full xl:w-[450px] flex-shrink-0 xl:sticky xl:top-24 max-h-none xl:max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-8' : 'w-full'} transition-all duration-500`}>
            <div className={`grid gap-5 ${selectedChallenge ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              <AnimatePresence mode="popLayout">
                {filteredChallenges.map(challenge => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedChallenge(challenge)}
                    className={`cursor-pointer rounded-[2rem] p-6 lg:p-8 border transition-all duration-300 relative overflow-hidden group flex flex-col ${
                      selectedChallenge?.id === challenge.id 
                        ? 'bg-[var(--card-bg)] border-[var(--accent-emerald)] shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] ring-1 ring-[var(--accent-emerald)]'
                        : 'bg-[var(--bg-main)]/50 border-[var(--border-glow)] hover:bg-[var(--card-bg)] hover:-translate-y-1 hover:border-gray-500 hover:shadow-xl'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full pointer-events-none opacity-20 transition-opacity duration-300 group-hover:opacity-40 ${
                      challenge.severity === 'Critical' ? 'bg-rose-500' : challenge.severity === 'High' ? 'bg-amber-600' : 'bg-emerald-500'
                    }`}></div>
                    
                    <div className="flex items-start justify-between mb-5 relative z-10 w-full">
                      <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-2xl bg-[var(--bg-main)] border border-[var(--border-glow)] shadow-inner text-[var(--accent-emerald)] group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                         <i className={`fas ${challenge.icon}`}></i>
                      </div>
                      <span className={`text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border whitespace-nowrap shadow-sm backdrop-blur-md ${
                        challenge.severity === 'Critical' ? 'border-rose-500/40 text-rose-500 bg-rose-500/10' : 
                        challenge.severity === 'High' ? 'border-amber-500/40 text-amber-500 bg-amber-600/10' : 
                        'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                      }`}>
                        <i className={`fas ${challenge.severity === 'Critical' ? 'fa-triangle-exclamation' : 'fa-bolt'} mr-1.5`}></i>
                        {challenge.severity}
                      </span>
                    </div>

                    <h3 className={`font-black text-[var(--text-primary)] mb-3 relative z-10 leading-snug ${selectedChallenge ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
                      {isArabic ? challenge.titleAr : challenge.titleEn}
                    </h3>
                    
                     <p className={`text-xs md:text-sm text-[var(--text-secondary)] line-clamp-3 relative z-10 leading-relaxed mb-6 flex-grow ${selectedChallenge && selectedChallenge.id !== challenge.id ? 'hidden sm:block xl:hidden' : 'block'}`}>
                      {isArabic ? challenge.diagnosisAr : challenge.diagnosisEn}
                    </p>

                    <div className="mt-auto pt-5 border-t border-[var(--border-glow)] flex justify-between items-center relative z-10 w-full">
                       <span className={`text-[9px] md:text-[10px] font-bold text-[var(--accent-emerald)]/80 flex items-center gap-2 uppercase tracking-widest ${selectedChallenge && selectedChallenge.id !== challenge.id ? 'hidden xl:flex' : 'flex'}`}>
                         <i className="fas fa-fingerprint"></i> {isArabic ? 'فتح التحليل المفصل' : 'Open Detailed Analysis'}
                       </span>
                       <div className={`w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border-glow)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--accent-emerald)] group-hover:text-[var(--bg-main)] group-hover:border-[var(--accent-emerald)] transition-all ${selectedChallenge && selectedChallenge.id !== challenge.id ? 'ml-auto' : ''}`}>
                         <i className={`fas ${isArabic ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`}></i>
                       </div>
                    </div>
                  </motion.div>
                ))}
               </AnimatePresence>
            </div>
          </div>

          {/* AI Analysis Detailed Panel */}
          {selectedChallenge && (
            <motion.div 
              ref={analysisRef}
              initial={{ opacity: 0, scale: 0.98, x: isArabic ? -20 : 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full xl:flex-grow min-w-0"
            >
              <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-glow)] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative">
                 {/* Top Thick Glow Bar */}
                 <div className="h-2 w-full bg-gradient-to-r from-[var(--accent-emerald)] via-[#3b82f6] to-[#8B5CF6]"></div>
                 
                 <div className="p-6 sm:p-8 lg:p-12">
                    <button 
                      onClick={() => {
                          setSelectedChallenge(null);
                          listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="xl:hidden mb-10 text-xs font-bold w-full bg-[var(--bg-main)] border border-[var(--border-glow)] py-4 rounded-2xl flex items-center justify-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-emerald)] transition-all"
                    >
                      <i className={`fas ${isArabic ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
                      {isArabic ? 'العودة للخلف وإغلاق التقرير' : 'Close Details & Go Back'}
                    </button>

                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row items-start justify-between flex-wrap gap-8 mb-12">
                       <div className="w-full xl:flex-1 xl:pr-6">
                         <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#8B5CF6] mb-4 flex items-center gap-2">
                           <i className="fas fa-radar animate-pulse text-[#8B5CF6] mr-2"></i> {isArabic ? 'تحليل وطني استراتيجي' : 'National Strategic Analysis'}
                         </div>
                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] leading-tight tracking-tight">
                           {isArabic ? selectedChallenge.titleAr : selectedChallenge.titleEn}
                         </h2>
                       </div>
                    </div>

                    <div className="space-y-12">
                      
                      {/* Section 1: Problem Diagnosis */}
                      <div className="bg-rose-500/5 border border-rose-500/20 p-6 lg:p-8 rounded-[2rem] relative overflow-hidden">
                        <i className="fas fa-biohazard absolute -right-4 top-10 text-[100px] lg:text-[150px] text-rose-500/5 pointer-events-none"></i>
                        <h4 className="text-[11px] lg:text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                          1 // {isArabic ? 'تشخيص المشكلة وتأثيرها' : 'Problem Diagnosis & Impact'}
                        </h4>
                        <p className="text-sm lg:text-base text-[var(--text-primary)] leading-loose font-medium mb-6 relative z-10 break-words">
                          {isArabic ? selectedChallenge.diagnosisAr : selectedChallenge.diagnosisEn}
                        </p>
                        <div className="flex items-start gap-4 bg-rose-500/10 backdrop-blur-md p-5 rounded-2xl border border-rose-500/30 relative z-10 w-full shadow-inner">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-500/20 text-rose-500 flex-shrink-0 animate-pulse">
                             <i className="fas fa-exclamation-triangle"></i>
                          </div>
                          <div>
                             <div className="text-[10px] uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold mb-1">{isArabic ? 'الأثر الكمي' : 'Quantified Impact'}</div>
                             <span className="text-xs lg:text-sm text-rose-200 font-bold leading-relaxed">
                               {isArabic ? selectedChallenge.impactAr : selectedChallenge.impactEn}
                             </span>
                          </div>
                        </div>
                      </div>

                      {/* Split Grid for 2 & 4 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                        {/* Section 2: Real-World Benchmark */}
                        <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] p-6 lg:p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                          <h4 className="text-[11px] lg:text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            2 // {isArabic ? 'معايير الواقع العماني' : 'Real-World Oman Benchmarks'} <i className="fas fa-chart-bar ml-auto opacity-50"></i>
                          </h4>
                          <ul className="space-y-4">
                            {(isArabic ? selectedChallenge.benchmarkAr : selectedChallenge.benchmarkEn).map((bm, i) => (
                              <li key={i} className="flex items-start gap-4 text-xs lg:text-sm font-medium text-[var(--text-secondary)]">
                                <i className="fas fa-circle-dot mt-1 text-[8px] text-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.6)] rounded-full"></i>
                                <span className="leading-relaxed">{bm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Section 4: AI Optimization */}
                        <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/30 p-6 lg:p-8 rounded-[2rem] shadow-[inset_0_0_30px_rgba(139,92,246,0.03)] relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-[#8B5CF6]/10 blur-[40px] rounded-full pointer-events-none"></div>
                           <h4 className="text-[11px] lg:text-xs font-black text-[#8B5CF6] uppercase tracking-[0.2em] mb-6 flex items-center gap-3 relative z-10">
                            4 // {isArabic ? 'طبقة التحسين الذكية (AI)' : 'AI Optimization Layer'} <i className="fas fa-microchip ml-auto opacity-50"></i>
                          </h4>
                          <div className="flex flex-col gap-3 relative z-10">
                            {(isArabic ? selectedChallenge.aiTechAr : selectedChallenge.aiTechEn).map((tech, i) => (
                              <div key={i} className="px-4 py-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#eaddff] text-xs lg:text-sm font-bold tracking-wide shadow-sm flex items-center gap-3">
                                <i className="fas fa-code-branch text-[#8B5CF6] text-opacity-70"></i> {tech}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Technical Solutions Ranked */}
                      <div className="bg-[var(--accent-emerald)]/5 border border-[var(--accent-emerald)]/30 p-6 lg:p-10 rounded-[2rem] relative overflow-hidden shadow-[inset_0_0_50px_rgba(16,185,129,0.02)]">
                         <i className="fas fa-shield-check absolute -left-10 bottom-0 text-[180px] text-[var(--accent-emerald)]/5 pointer-events-none"></i>
                         <h4 className="text-[11px] lg:text-xs font-black text-[var(--accent-emerald)] uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10">
                            3 // {isArabic ? 'الحلول الهندسية الموصى بها (مرتبة)' : 'Ranked Technical Solutions'} <i className="fas fa-layer-group ml-auto opacity-50"></i>
                         </h4>
                         <div className="space-y-4 relative z-10">
                           {selectedChallenge.solutions.map((sol, i) => (
                             <div key={i} className="flex flex-col md:flex-row items-start gap-4 md:gap-6 bg-[var(--bg-main)]/90 backdrop-blur-xl p-5 lg:p-6 rounded-2xl border border-[var(--accent-emerald)]/20 shadow-md transition-transform hover:-translate-y-1">
                               <div className="w-12 h-12 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center font-black text-xl flex-shrink-0 border border-[var(--accent-emerald)]/30">
                                 #{i+1}
                               </div>
                               <div>
                                 <h5 className="text-sm lg:text-base font-black text-[var(--text-primary)] mb-2">
                                   {isArabic ? sol.titleAr : sol.titleEn}
                                 </h5>
                                 <p className="text-xs lg:text-sm text-[var(--text-secondary)] leading-loose">
                                   {isArabic ? sol.descAr : sol.descEn}
                                 </p>
                               </div>
                             </div>
                           ))}
                         </div>
                      </div>

                      {/* Extra Info Grid: Economics & Deployment */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                         {/* Section 5: Economics */}
                         <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-[2rem] p-6 lg:p-8 flex flex-col">
                            <h4 className="text-[11px] lg:text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                              5 // {isArabic ? 'التحليل الاقتصادي' : 'Economic Analysis'} <i className="fas fa-coins ml-auto opacity-50"></i>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 flex-grow">
                               <div className="p-4 rounded-xl bg-amber-600/5 border border-amber-500/10">
                                 <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-bold">CAPEX</div>
                                 <div className="text-xs lg:text-sm font-black text-amber-700 dark:text-amber-400">{isArabic ? selectedChallenge.capexAr : selectedChallenge.capexEn}</div>
                               </div>
                               <div className="p-4 rounded-xl bg-amber-600/5 border border-amber-500/10">
                                 <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-bold">OPEX</div>
                                 <div className="text-xs lg:text-sm font-black text-amber-700 dark:text-amber-400">{isArabic ? selectedChallenge.opexAr : selectedChallenge.opexEn}</div>
                               </div>
                               <div className="p-4 rounded-xl bg-amber-600/5 border border-amber-500/10">
                                 <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-bold">PAYBACK</div>
                                 <div className="text-xs lg:text-sm font-black text-[var(--text-primary)]">{isArabic ? selectedChallenge.paybackAr : selectedChallenge.paybackEn}</div>
                               </div>
                               <div className="p-4 rounded-xl bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/20 shadow-inner">
                                 <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-bold">LCOE / Target</div>
                                 <div className="text-xs lg:text-sm font-black text-[var(--accent-emerald)]">{isArabic ? selectedChallenge.lcoeAr : selectedChallenge.lcoeEn}</div>
                               </div>
                            </div>
                         </div>

                         {/* Section 6: Deployment */}
                         <div className="bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-[2rem] p-6 lg:p-8 flex flex-col">
                            <h4 className="text-[11px] lg:text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.2em] mb-8 flex items-center gap-3 opacity-90">
                              6 // {isArabic ? 'استراتيجية النشر' : 'Deployment Strategy'} <i className="fas fa-map ml-auto opacity-50"></i>
                            </h4>
                            <div className="space-y-4 flex-grow flex flex-col justify-center">
                              {(isArabic ? selectedChallenge.deploymentAr : selectedChallenge.deploymentEn).map((dep, i) => (
                                <div key={i} className="flex items-center gap-4 text-xs lg:text-sm font-bold text-[var(--text-primary)] p-3 lg:p-4 bg-[var(--card-bg)] border border-[var(--border-glow)] rounded-xl relative overflow-hidden group">
                                  <div className="w-1 h-full bg-[var(--text-primary)] absolute left-0 top-0 opacity-20"></div>
                                  <i className="fas fa-location-crosshairs text-[var(--text-secondary)] group-hover:text-[var(--accent-emerald)] transition-colors"></i>
                                  <span className="leading-tight">{dep}</span>
                                </div>
                              ))}
                            </div>
                         </div>
                      </div>

                      {/* Section 7: Final Output Format */}
                      <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-[#8B5CF6]/30 via-[var(--accent-emerald)]/30 to-blue-500/30">
                        <div className="bg-[var(--card-bg)] p-6 lg:p-10 rounded-[2.4rem] h-full">
                           <h4 className="text-[11px] lg:text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                             7 // {isArabic ? 'الاستنتاج التنفيذي والفرص' : 'Executive Output & Opportunities'}
                           </h4>
                           
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                             <div className="bg-[var(--bg-main)] p-5 rounded-2xl border border-[var(--border-glow)] text-center">
                               <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-3 font-bold">{isArabic ? 'مستوى المخاطرة' : 'Risk Level'}</div>
                               <div className={`text-base lg:text-lg font-black uppercase tracking-widest border-b-2 pb-2 inline-block ${
                                  selectedChallenge.riskLevelEn.includes('Low') ? 'text-[var(--accent-emerald)] dark:text-emerald-400 border-emerald-400/50' : 
                                  selectedChallenge.riskLevelEn.includes('High') || selectedChallenge.riskLevelEn.includes('Critical') ? 'text-rose-600 dark:text-rose-400 border-rose-400/50' : 'text-amber-700 dark:text-amber-400 border-amber-400/50'
                               }`}>{isArabic ? selectedChallenge.riskLevelAr : selectedChallenge.riskLevelEn}</div>
                             </div>
                             
                             <div className="bg-[var(--bg-main)] p-5 rounded-2xl border border-[var(--border-glow)] text-center md:col-span-2 flex flex-col justify-center items-center">
                               <div className="text-[10px] text-[var(--accent-emerald)] uppercase tracking-widest mb-3 font-bold"><i className="fas fa-arrow-trend-up mr-2"></i> {isArabic ? 'التأثير الكلي للشبكة' : 'Net Grid Improvement'}</div>
                               <div className="text-sm lg:text-base font-black text-[var(--text-primary)] leading-relaxed max-w-md">{isArabic ? selectedChallenge.gridImprovementAr : selectedChallenge.gridImprovementEn}</div>
                             </div>
                           </div>

                           <div className="flex flex-col gap-5">
                              <div className="flex flex-col lg:flex-row gap-5">
                                <div className="flex-1 bg-amber-600/5 border border-amber-500/20 p-5 rounded-2xl">
                                  <div className="text-[10px] text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-4 font-black"><i className="fas fa-crown mr-2"></i>{isArabic ? 'التوصيات الحتمية' : 'Priority Actions'}</div>
                                  <ul className="space-y-3">
                                    {(isArabic ? selectedChallenge.priorityAr : selectedChallenge.priorityEn).map((pri, i) => (
                                      <li key={i} className="text-xs lg:text-sm text-[var(--text-primary)] dark:text-amber-100 font-medium flex items-start gap-3"><i className="fas fa-arrow-right text-amber-700/50 dark:text-amber-500/50 mt-1 text-[10px]"></i>{pri}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="flex-1 bg-blue-600/5 border border-blue-500/20 p-5 rounded-2xl flex flex-col justify-center items-center text-center">
                                  <div className="text-[10px] text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-4 font-black">{isArabic ? 'فرصة الاستثمار الكبرى' : 'Mega Investment Op'}</div>
                                  <div className="text-sm lg:text-lg text-[var(--text-primary)] font-black leading-snug">{isArabic ? selectedChallenge.investAr : selectedChallenge.investEn}</div>
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>

                      {/* Footer sources */}
                      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[11px] text-[var(--text-secondary)] font-mono border-t border-[var(--border-glow)] pt-8 opacity-70">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest w-full justify-center xl:w-auto xl:justify-start mb-2 xl:mb-0">
                          <i className="fas fa-link"></i> {isArabic ? 'مصادر التحليل:' : 'Analysis Sources:'} 
                        </span>
                        {selectedChallenge.sources.map((s, i) => (
                          <span key={i} className="bg-[var(--bg-main)] px-3 py-1.5 rounded-lg border border-[var(--border-glow)] shadow-sm font-medium whitespace-nowrap">{s}</span>
                        ))}
                      </div>

                    </div>
                 </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
