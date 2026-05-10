const fs = require('fs');
let content = fs.readFileSync('InputForm.tsx', 'utf8');

// Add advancedParams state
content = content.replace(
  `const [co2Source, setCo2Source] = React.useState(CO2_SOURCES[0]);`,
  `const [co2Source, setCo2Source] = React.useState(CO2_SOURCES[0]);
  const [advancedParams, setAdvancedParams] = React.useState<Record<string, string | number>>({});`
);

// Update localStorage
content = content.replace(
  `co2Source: draft.co2Source`,
  `co2Source: draft.co2Source
        if (draft.advancedParams) setAdvancedParams(draft.advancedParams);`
);

content = content.replace(
  `production, budget, sellingPrice, electricityCost, laborCost, co2Source`,
  `production, budget, sellingPrice, electricityCost, laborCost, co2Source, advancedParams`
);

content = content.replace(
  `production, budget, sellingPrice, electricityCost, laborCost, co2Source`,
  `production, budget, sellingPrice, electricityCost, laborCost, co2Source, advancedParams`
);

// Update handleSubmit
content = content.replace(
  `co2Source: category === 'Biofuel' ? co2Source : undefined,`,
  `co2Source: category === 'Biofuel' ? co2Source : undefined,
      advancedParams,`
);

// Add the AdvancedParams component inside the form
const advancedUI = `
        {/* Advanced Parameters */}
        <motion.div className="bg-[#10B981]/5 border border-[var(--border-glow)] rounded-xl p-6">
          <h3 className="text-[#10B981] font-bold text-sm mb-4 flex items-center">
            <i className="fas fa-microchip mr-2"></i>
            {isArabic ? 'معايير فنية متقدمة للتحقق الدقيق (اختياري)' : 'Advanced Techno-Economic Parameters (Optional)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(feedstock.includes('Solar') || feedstock.includes('شمسية')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'كفاءة الألواح (%)' : 'Panel Efficiency (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="21" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Panel Efficiency (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'معدل التدهور السنوي (%)' : 'Degradation Rate (%/yr)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="0.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Degradation Rate (%/yr)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة الصيانة (دولار/سنة)' : 'O&M Cost (USD/yr)'}</label>
                  <input type="number" className={inputClasses} placeholder="Estimated automatically" 
                    onChange={e => setAdvancedParams({...advancedParams, 'O&M Cost (USD/yr)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'الإشعاع الشمسي (kWh/m2/day)' : 'Irradiance (kWh/m2/day)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="5.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Irradiance (kWh/m2/day)': e.target.value})} />
                </div>
              </>
            )}
            {(feedstock.includes('Wind') || feedstock.includes('رياح')) && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'متوسط سرعة الرياح (m/s)' : 'Average Wind Speed (m/s)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="6.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Average Wind Speed (m/s)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'سعة التوربين (MW)' : 'Turbine Capacity (MW)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="3" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Turbine Capacity (MW)': e.target.value})} />
                </div>
              </>
            )}
            {category === 'Biofuel' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة المادة الخام (دولار/طن)' : 'Feedstock Cost (USD/ton)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="Estimated" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Feedstock Cost (USD/ton)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'كفاءة الاستخراج (%)' : 'Extraction Efficiency (%)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="20" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Extraction Efficiency (%)': e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1 tracking-widest">{isArabic ? 'تكلفة استهلاك المياه (دولار/m3)' : 'Water Cost (USD/m3)'}</label>
                  <input type="number" step="0.1" className={inputClasses} placeholder="0.5" 
                    onChange={e => setAdvancedParams({...advancedParams, 'Water Cost (USD/m3)': e.target.value})} />
                </div>
              </>
            )}
          </div>
        </motion.div>
`;

content = content.replace(
  `        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">`,
  advancedUI + `\n        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">`
);

fs.writeFileSync('InputForm.tsx', content);
console.log('updated');
