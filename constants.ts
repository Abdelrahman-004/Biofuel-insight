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
  "Renewable Energy"
];

export const BIOFUEL_FEEDSTOCKS = [
  "Algae",
  "Date Seeds",
  "Waste Cooking Oil",
  "Animal Fat",
  "Agricultural Residue",
  "Biogas",
  "Bioethanol"
];

export const RENEWABLE_ENERGY_TYPES = [
  "Solar PV",
  "Wind",
  "Waste-to-Energy"
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
    "Renewable Energy": "الطاقة المتجددة",
    "Algae": "الطحالب الدقيقة",
    "Date Seeds": "نوى التمر",
    "Waste Cooking Oil": "زيوت الطبخ المستعملة",
    "Animal Fat": "الدهون الحيوانية",
    "Agricultural Residue": "المخلفات الزراعية",
    "Biogas": "الغاز الحيوي",
    "Bioethanol": "الإيثانول الحيوي",
    "Solar PV": "الطاقة الشمسية الكهروضوئية",
    "Wind": "طاقة الرياح",
    "Waste-to-Energy": "تحويل النفايات إلى طاقة"
  };
  return dictionary[term] || term;
};
