const fs = require('fs');

let content = fs.readFileSync('ProposalGenerator.tsx', 'utf8');

const regex = /<div id="proposal-report" className="bg-\[var\(--card-bg\)\].*?<\/div>(\s*<\/motion\.div>\s*)}/s;

const newSections = `
              <div id="proposal-report" className="bg-[var(--card-bg)] shadow-card p-10 rounded-3xl border border-[var(--border-glow)] prose prose-invert max-w-none relative">
                {/* PDF BRANDING HEADER */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-30 select-none pointer-events-none">
                  <div className="flex items-center space-x-2 grayscale">
                    <i className="fas fa-leaf text-2xl"></i>
                    <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">
                      {language === 'Arabic' ? <>عُمَان <span className="text-[#8B5CF6]">إيكوسينك</span></> : <>OMAN <span className="text-[#8B5CF6]">ECOSYNC</span></>}
                    </span>
                  </div>
                  <div className="text-[8px] font-black tracking-[0.2em] uppercase text-right text-[var(--text-secondary)]">
                    {language === 'Arabic' ? 'نموذج مقترح معتمد آلياً' : 'Automated Certified Proposal'} <br/>
                    {result.timestamp}
                  </div>
                </div>

                <div className="text-center mb-10 border-b border-[var(--border-glow)] pb-8 mt-12">
                  <h1 className="text-3xl font-black text-[var(--text-primary)] mb-4">{result.title}</h1>
                  <p className="text-sm font-bold text-[#8B5CF6] uppercase tracking-widest">
                    {language === 'Arabic' ? 'أُعد خصيصاً لـ: ' : 'Prepared for: '} <span className="text-[var(--text-secondary)]">{inputs.targetAudience}</span>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">{language === 'Arabic' ? 'تاريخ الإصدار: ' : 'Generated on '}{result.timestamp}</p>
                </div>

                <div className="space-y-8">
                  {/* 1. Executive Summary */}
                  <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                      1. {language === 'Arabic' ? 'الملخص التنفيذي' : 'Executive Summary'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.executiveSummary?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* 2. Problem Statement */}
                  <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       2. {language === 'Arabic' ? 'بيان المشكلة المقترحة' : 'Problem Statement'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.problemStatement?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* 3. Market Opportunity */}
                  <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       3. {language === 'Arabic' ? 'الفرصة السوقية' : 'Market Opportunity'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.marketOpportunity?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* 4. Competitive Advantage */}
                  <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       4. {language === 'Arabic' ? 'الميزة التنافسية' : 'Competitive Advantage'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.competitiveAdvantage?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                   {/* 5. Business Model */}
                   <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       5. {language === 'Arabic' ? 'نموذج العمل' : 'Business Model'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.businessModel?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                   {/* 6. Revenue Streams */}
                   <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       6. {language === 'Arabic' ? 'مصادر الإيرادات' : 'Revenue Streams'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.revenueStreams?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                   {/* 7. Technical Overview */}
                   <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       7. {language === 'Arabic' ? 'نظرة عامة تقنية وتشغيلية' : 'Technical & Operational Overview'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.technicalOverview?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* 8. Raw Material / Feedstock Strategy */}
                  <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       8. {language === 'Arabic' ? 'استراتيجية المواد الخام' : 'Raw Material / Feedstock Strategy'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.feedstockStrategy?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* 9. Financial Model */}
                  <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">
                      9. {language === 'Arabic' ? 'النموذج المالي ومقترح التمويل' : 'Financial Model & Funding Proposal'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'رأس المال المطلوب' : 'CAPEX'}</div>
                        <div className="text-lg font-black text-emerald-500">{result.financialModel?.totalCapex}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'التشغيل السنوي' : 'OPEX'}</div>
                        <div className="text-lg font-black text-[var(--text-primary)]">{result.financialModel?.annualOpex}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'معدل العائد' : 'ROI'}</div>
                        <div className="text-lg font-black text-emerald-500">{result.financialModel?.roiPercentage}</div>
                      </div>
                      <div className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                        <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'فترة الاسترداد' : 'Payback'}</div>
                        <div className="text-lg font-black text-[#8B5CF6]">{result.financialModel?.paybackPeriod}</div>
                      </div>
                    </div>

                    <h3 className="font-bold text-[var(--text-primary)] mb-2 mt-4">{language === 'Arabic' ? 'جدول العوائد للاستثمار' : 'Installment & Return Schedule'}</h3>
                    <div className="overflow-x-auto text-[10px] sm:text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--border-glow)] text-[var(--text-secondary)] uppercase tracking-wider">
                            <th className={\`py-2 px-3 \${language === 'Arabic' ? 'text-right' : 'text-left'}\`}>{language === 'Arabic' ? 'السنة' : 'Year'}</th>
                            <th className={\`py-2 px-3 \${language === 'Arabic' ? 'text-right' : 'text-left'}\`}>{language === 'Arabic' ? 'المبلغ' : 'Amount'}</th>
                            <th className={\`py-2 px-3 \${language === 'Arabic' ? 'text-right' : 'text-left'}\`}>{language === 'Arabic' ? 'الوصف' : 'Description'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-glow)] text-[var(--text-primary)]">
                          {result.financialModel?.installmentSchedule?.map((inst, i) => (
                            <tr key={i} className="hover:bg-[#10B981]/5">
                              <td className="py-2 px-3 font-medium whitespace-nowrap">{inst.year}</td>
                              <td className="py-2 px-3 font-mono text-[#10B981] whitespace-nowrap">{inst.amount}</td>
                              <td className="py-2 px-3 text-[var(--text-secondary)] min-w-[150px]">{inst.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                   {/* 10. Risk Analysis & Mitigation */}
                   <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       10. {language === 'Arabic' ? 'تحليل المخاطر والتخفيف' : 'Risk Analysis & Mitigation'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.riskAnalysis?.map((item, idx) => (
                         <div key={idx} className="bg-[var(--card-bg)] shrink shadow-card p-4 rounded-xl border border-[var(--border-glow)]">
                             <div className="font-bold text-red-400 mb-2">{item.risk}</div>
                             <div className="text-sm text-[var(--text-secondary)]">{item.mitigation}</div>
                         </div>
                      ))}
                    </div>
                  </section>

                  {/* 11. ESG & Sustainability Impact (with Oman Vision 2040 included) */}
                  <section className="bg-[#8B5CF6]/10 p-6 rounded-2xl border border-#8B5CF6">
                    <h2 className="text-lg font-black text-[#8B5CF6] mb-3 flex items-center">
                      <i className="fas fa-bullseye mx-2"></i> 11. {language === 'Arabic' ? 'الأثر البيئي والاجتماعي ورؤية 2040' : 'ESG, Sustainability & Vision 2040'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                       {result.esgImpact?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* 12. Carbon Credit Potential */}
                  <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                      12. {language === 'Arabic' ? 'قيمة شهادات الكربون المتوقعة' : 'Carbon Credit Potential'}
                    </h2>
                    <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'أطنان CO2 المستثناة' : 'Tons Saved'}</div>
                          <div className="text-xl font-black text-emerald-400">{result.carbonCreditPotential?.estimatedTonsSaved}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{language === 'Arabic' ? 'القيمة النقدية التقديرية' : 'Est. Monetary Value Range'}</div>
                          <div className="text-xl font-black text-[#8B5CF6]">{result.carbonCreditPotential?.monetaryValueRange}</div>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{result.carbonCreditPotential?.explanation}</p>
                    </div>
                  </section>

                   {/* 13. Investment Proposal */}
                   <section className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl">
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] mb-4\`}>
                       13. {language === 'Arabic' ? 'صيغة الاستثمار المعروضة' : 'Investment Proposal Offer'}
                    </h2>
                    <div className="space-y-4">
                      <div><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'المبلغ المطلوب:' : 'Requested Amount:'}</span> <span className="font-black text-amber-500">{result.investmentProposal?.requestedAmount}</span></div>
                      <div><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'طريقة السداد:' : 'Repayment Strategy:'}</span> <span className="text-[var(--text-primary)]">{result.investmentProposal?.repaymentStrategy}</span></div>
                      <div><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'الهيكل وحقوق الملكية:' : 'Equity Structure:'}</span> <span className="text-[var(--text-primary)]">{result.investmentProposal?.equityStructure}</span></div>
                      <div><span className="font-bold text-[var(--text-secondary)]">{language === 'Arabic' ? 'العوائد للمستثمر:' : 'Investor Returns:'}</span> <span className="text-[#10B981]">{result.investmentProposal?.investorReturns}</span></div>
                      <div className="pt-2 border-t border-[var(--border-glow)] mt-2">
                        <span className="font-bold text-[var(--text-secondary)] text-sm">{language === 'Arabic' ? 'استخدام التمويل:' : 'Funding Utilization Details:'}</span>
                        <ul className="list-disc list-inside mt-2 text-sm text-[var(--text-secondary)]">
                          {result.investmentProposal?.fundingUtilization?.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                   </section>

                   {/* 14. Why Investors Should Fund */}
                   <section>
                    <h2 className={\`text-xl font-black text-[var(--text-primary)] border-[#8B5CF6] mb-4 \${language === 'Arabic' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}\`}>
                       14. {language === 'Arabic' ? 'لماذا يشكل هذا المشروع استثماراً ممتازاً؟' : 'Why Investors Should Fund This Project'}
                    </h2>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-2">
                      {result.whyInvestorsShouldFund?.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </section>

                  {/* Additional Deliverables Separator */}
                  <div className="my-10 border-t-2 border-dashed border-[var(--border-glow)]"></div>

                  <h1 className="text-2xl font-black text-center text-[#8B5CF6] tracking-widest">{language === 'Arabic' ? 'الملحقات والإضافات' : 'ADDITIONAL DELIVERABLES'}</h1>

                  {/* Pitch Deck Outline */}
                  <section>
                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'مخطط العرض التقديمي (10 شرائح)' : '10-Slide Pitch Deck Outline'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.pitchDeckOutline?.map((slide) => (
                        <div key={slide.slideNumber} className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-glow)]">
                            <h4 className="text-sm font-bold text-[#8B5CF6] mb-1">Slide {slide.slideNumber}: {slide.title}</h4>
                            <p className="text-xs text-[var(--text-secondary)]">{slide.content}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Investor Email & Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                      <h2 className="text-sm font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'قالب بريد المستثمر' : 'Investor Email Template'}</h2>
                      <div className="whitespace-pre-wrap text-xs text-[var(--text-secondary)] font-mono bg-[var(--card-bg)] shadow-card p-4 rounded-xl">{result.investorEmailTemplate}</div>
                    </section>

                    <section className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-glow)]">
                       <h2 className="text-sm font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'ملخص تنفيذي لصفحة واحدة' : 'One-Page Executive Summary'}</h2>
                       <div className="whitespace-pre-wrap text-xs text-[var(--text-secondary)]">{result.onePageSummary}</div>
                    </section>
                  </div>

                  {/* Recommendations & Partners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section>
                      <h2 className="text-sm font-black text-amber-500 mb-4 flex items-center"><i className="fas fa-lightbulb mr-2"></i>{language === 'Arabic' ? 'توصيات لزيادة فرصة القبول' : 'Recommendations for Approval'}</h2>
                      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
                        {result.fundingRecommendations?.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </section>
                    <section>
                      <h2 className="text-sm font-black text-emerald-500 mb-4 flex items-center"><i className="fas fa-handshake mr-2"></i>{language === 'Arabic' ? 'الشركاء والجهات المقترحة' : 'Suggested Partners in Oman/GCC'}</h2>
                      <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
                        {result.strategicPartners?.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </section>
                  </div>

                  {/* Phased Scaling */}
                  <section>
                     <h2 className="text-xl font-black text-[var(--text-primary)] mb-4">{language === 'Arabic' ? 'خطة التوسع التدريجي' : 'Phased Scaling Strategy'}</h2>
                     <div className="flex flex-col space-y-4">
                       {result.phasedScalingStrategy?.map((phase, idx) => (
                          <div key={idx} className="bg-[var(--card-bg)] shadow-card p-4 rounded-xl border border-[var(--border-glow)] flex flex-col md:flex-row md:items-center">
                            <div className="flex-shrink-0 mr-4 mb-2 md:mb-0 w-32 border-r border-[var(--border-glow)]">
                               <div className="font-black text-[#8B5CF6]">{phase.phase}</div>
                               <div className="text-xs text-[var(--text-secondary)]">{phase.duration}</div>
                            </div>
                            <div className="flex-1 pl-0 md:pl-4">
                                <ul className="list-disc list-inside text-xs text-[var(--text-secondary)]">
                                  {phase.milestones?.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            </div>
                          </div>
                       ))}
                     </div>
                  </section>


                </div>
              </div>
            </motion.div>
          )}
`;

content = content.replace(regex, newSections);
fs.writeFileSync('ProposalGenerator.tsx', content);
console.log('updated');
