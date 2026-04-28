export const LOCATIONS = [
  "Muscat - Rusayl Industrial Estate",
  "Sohar - Freezone",
  "Salalah - Freezone",
  "Duqm - Special Economic Zone",
  "Sur - Industrial City",
  "Nizwa - Industrial Estate",
  "Buraimi - Industrial Estate"
];

export const TECHNOLOGY_CATEGORIES = [
  "Biofuel",
  "Renewable Energy",
  "Green Hydrogen"
];

export const BIOFUEL_FEEDSTOCKS = [
  "Algae",
  "Date Seeds",
  "Waste Cooking Oil",
  "Animal Fat",
  "Agricultural Residue",
  "Biogas",
  "Bioethanol",
  "Jatropha Seeds",
  "Municipal Solid Waste",
  "Sewage Sludge",
  "Fish Oil"
];

export const RENEWABLE_ENERGY_TYPES = [
  "Solar PV",
  "Wind",
  "Waste-to-Energy",
  "Green Hydrogen Electrolysis",
  "Carbon Capture (Direct Air Capture)"
];

export const translateTerm = (term: string): string => {
  const dictionary: Record<string, string> = {
    "Muscat - Rusayl Industrial Estate": "مسقط - مدينة الرسيل الصناعية",
    "Sohar - Freezone": "صحار - المنطقة الحرة",
    "Salalah - Freezone": "صلالة - المنطقة الحرة",
    "Duqm - Special Economic Zone": "الدقم - المنطقة الاقتصادية الخاصة",
    "Sur - Industrial City": "صور - المدينة الصناعية",
    "Nizwa - Industrial Estate": "نزوى - مدينة نزوى الصناعية",
    "Buraimi - Industrial Estate": "البريمي - المدينة الصناعية",
    "Biofuel": "الوقود الحيوي",
    "Renewable Energy": "الطاقة المتجددة والخضراء",
    "Green Hydrogen": "الهيدروجين الأخضر",
    "Algae": "الطحالب الدقيقة",
    "Date Seeds": "نوى التمر",
    "Waste Cooking Oil": "زيوت الطبخ المستعملة",
    "Animal Fat": "الدهون الحيوانية",
    "Agricultural Residue": "المخلفات الزراعية",
    "Biogas": "الغاز الحيوي",
    "Bioethanol": "الإيثانول الحيوي",
    "Jatropha Seeds": "بذور الجاتروفا",
    "Municipal Solid Waste": "النفايات البلدية الصلبة",
    "Sewage Sludge": "حمأة الصرف الصحي",
    "Fish Oil": "زيت السمك",
    "Solar PV": "الطاقة الشمسية (PV)",
    "Wind": "طاقة الرياح",
    "Waste-to-Energy": "تحويل النفايات إلى طاقة",
    "Green Hydrogen Electrolysis": "التحليل الكهربائي (الهيدروجين الأخضر)",
    "Carbon Capture (Direct Air Capture)": "التقاط المباشر للكربون (DAC)"
  };
  return dictionary[term] || term;
};
