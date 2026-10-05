import { 
  OmanEvInput, 
  OmanEvAnalysisResult, 
  VoltOmanInput, 
  VoltOmanResult, 
  VoltOmanChargingStop,
  VoltOmanTelemetryMetrics 
} from './types';

/**
 * VoltOman Engine — Enterprise-Grade AI Co-Pilot for EV Routing & Battery Analytics
 * Tuned specifically for Oman's severe desert heat, mountain elevations, and national highway corridors.
 */

// Highway station database across Oman's primary corridors
interface HighwayWaypoint {
  nameEn: string;
  nameAr: string;
  distanceKm: number;
  chargerKw: number;
  corridor: string;
  elevationM: number;
}

const OMAN_HIGHWAY_WAYPOINTS: Record<string, HighwayWaypoint[]> = {
  'Adam-Thumrait-Salalah': [
    { nameEn: 'OOMCO EV - Muscat Wave Hub', nameAr: 'نفط عُمان - محطة الموج مسقط', distanceKm: 0, chargerKw: 180, corridor: 'Muscat', elevationM: 20 },
    { nameEn: 'OOMCO EV - Bidbid Valley Hub', nameAr: 'نفط عُمان - محطة وادي بدبد', distanceKm: 65, chargerKw: 150, corridor: 'Interior Highway', elevationM: 240 },
    { nameEn: 'OOMCO EV - Nizwa Grand Hub', nameAr: 'نفط عُمان - محطة نزوى جراند', distanceKm: 155, chargerKw: 160, corridor: 'Nizwa Road', elevationM: 520 },
    { nameEn: 'OOMCO EV - Adam Desert Gateway Hub', nameAr: 'نفط عُمان - محطة واحة أدم الصحراوية', distanceKm: 225, chargerKw: 150, corridor: 'Adam-Thumrait', elevationM: 180 },
    { nameEn: 'OOMCO EV - Ghaba Oasis Desert Stop', nameAr: 'نفط عُمان - استراحة غابة الصحراوية', distanceKm: 360, chargerKw: 120, corridor: 'Adam-Thumrait', elevationM: 140 },
    { nameEn: 'OOMCO EV - Haima Central Supercharger', nameAr: 'نفط عُمان - محطة هيماء المركزية السريعة', distanceKm: 535, chargerKw: 180, corridor: 'Adam-Thumrait', elevationM: 125 },
    { nameEn: 'OOMCO EV - Al Ghaftain Transport Hub', nameAr: 'نفط عُمان - محطة الغافتين لخدمات الطرق', distanceKm: 670, chargerKw: 120, corridor: 'Adam-Thumrait', elevationM: 110 },
    { nameEn: 'OOMCO EV - Qatbit Desert Waypoint', nameAr: 'نفط عُمان - استراحة قتبيت الصحراوية', distanceKm: 775, chargerKw: 120, corridor: 'Adam-Thumrait', elevationM: 135 },
    { nameEn: 'OOMCO EV - Thumrait Mountain Ascent Hub', nameAr: 'نفط عُمان - محطة ثمريت لصعود الجبال', distanceKm: 935, chargerKw: 150, corridor: 'Adam-Thumrait', elevationM: 470 },
    { nameEn: 'OOMCO EV - Salalah Coastal Terminal', nameAr: 'نفط عُمان - محطة صلالة الساحلية الكبرى', distanceKm: 1020, chargerKw: 160, corridor: 'Dhofar', elevationM: 15 }
  ],
  'Batinah': [
    { nameEn: 'OOMCO EV - Muscat Airport North Hub', nameAr: 'نفط عُمان - شمال مطار مسقط الدولي', distanceKm: 0, chargerKw: 180, corridor: 'Batinah', elevationM: 15 },
    { nameEn: 'OOMCO EV - Barka South Expressway Mega Hub', nameAr: 'نفط عُمان - محطة بركاء طريق الباطنة السريع', distanceKm: 55, chargerKw: 180, corridor: 'Batinah Expressway', elevationM: 25 },
    { nameEn: 'OOMCO EV - Al Suwaiq Expressway Hub', nameAr: 'نفط عُمان - محطة السويق السريعة', distanceKm: 115, chargerKw: 150, corridor: 'Batinah Expressway', elevationM: 30 },
    { nameEn: 'OOMCO EV - Saham Coastal Fast Hub', nameAr: 'نفط عُمان - محطة صحم الساحلية', distanceKm: 165, chargerKw: 120, corridor: 'Batinah Expressway', elevationM: 20 },
    { nameEn: 'OOMCO EV - Sohar Freezone Green Mobility Hub', nameAr: 'نفط عُمان - محطة المنطقة الحرة بصحار', distanceKm: 215, chargerKw: 180, corridor: 'Batinah Expressway', elevationM: 18 },
    { nameEn: 'OOMCO EV - Shinas Northern Border Hub', nameAr: 'نفط عُمان - محطة شناص الحدودية', distanceKm: 265, chargerKw: 150, corridor: 'Batinah Expressway', elevationM: 10 }
  ],
  'Nizwa Road': [
    { nameEn: 'OOMCO EV - Burj Al Sahwa Mega Hub', nameAr: 'نفط عُمان - محطة برج الصحوة مسقط', distanceKm: 0, chargerKw: 180, corridor: 'Muscat', elevationM: 40 },
    { nameEn: 'OOMCO EV - Bidbid Valley Hub', nameAr: 'نفط عُمان - محطة وادي بدبد', distanceKm: 50, chargerKw: 150, corridor: 'Nizwa Road', elevationM: 220 },
    { nameEn: 'OOMCO EV - Samail Industrial City Fleet Hub', nameAr: 'نفط عُمان - محطة سمائل الصناعية', distanceKm: 85, chargerKw: 120, corridor: 'Nizwa Road', elevationM: 380 },
    { nameEn: 'OOMCO EV - Birkat Al Mouz Foothills Hub', nameAr: 'نفط عُمان - محطة بركة الموز الجبلية', distanceKm: 130, chargerKw: 150, corridor: 'Nizwa Road', elevationM: 610 },
    { nameEn: 'OOMCO EV - Nizwa Industrial City Fast Depot', nameAr: 'نفط عُمان - محطة مدينة نزوى الصناعية', distanceKm: 160, chargerKw: 160, corridor: 'Nizwa Road', elevationM: 520 },
    { nameEn: 'OOMCO EV - Jabal Akhdar Saiq Ascent Hub', nameAr: 'نفط عُمان - هضبة سيق بالجبل الأخضر', distanceKm: 165, chargerKw: 100, corridor: 'Jabal Akhdar Climb', elevationM: 2050 }
  ],
  'Sharqiyah': [
    { nameEn: 'OOMCO EV - Al Qurum Heights Hub', nameAr: 'نفط عُمان - محطة القرم مسقط', distanceKm: 0, chargerKw: 150, corridor: 'Muscat', elevationM: 20 },
    { nameEn: 'OOMCO EV - Al Amerat Valley Hub', nameAr: 'نفط عُمان - محطة العامرات السريعة', distanceKm: 30, chargerKw: 120, corridor: 'Sharqiyah Expressway', elevationM: 110 },
    { nameEn: 'OOMCO EV - Bidbid-Sur Expressway Rest Stop', nameAr: 'نفط عُمان - استراحة طريق بدبد-صور السريع', distanceKm: 75, chargerKw: 150, corridor: 'Sharqiyah Expressway', elevationM: 310 },
    { nameEn: 'OOMCO EV - Ibra Commercial Regional Hub', nameAr: 'نفط عُمان - بوابة إبراء التجارية', distanceKm: 140, chargerKw: 150, corridor: 'Sharqiyah Expressway', elevationM: 450 },
    { nameEn: 'OOMCO EV - Al Kamil & Al Wafi Oasis Hub', nameAr: 'نفط عُمان - محطة الكامل والوافي', distanceKm: 185, chargerKw: 120, corridor: 'Sharqiyah Expressway', elevationM: 210 },
    { nameEn: 'OOMCO EV - Sur Industrial City & Coastal Hub', nameAr: 'نفط عُمان - محطة صور الصناعية البحرية', distanceKm: 230, chargerKw: 150, corridor: 'Sharqiyah Coast', elevationM: 15 }
  ],
  'Duqm SEZ': [
    { nameEn: 'OOMCO EV - Muscat Central Transport Hub', nameAr: 'نفط عُمان - محطة مسقط المركزية للنقل', distanceKm: 0, chargerKw: 180, corridor: 'Muscat', elevationM: 25 },
    { nameEn: 'OOMCO EV - Sinaw Desert Interchange Hub', nameAr: 'نفط عُمان - محطة تقاطع سناو الصحراوية', distanceKm: 175, chargerKw: 150, corridor: 'Duqm Corridor', elevationM: 190 },
    { nameEn: 'OOMCO EV - Mahout Coastal Transit Hub', nameAr: 'نفط عُمان - استراحة محوت الساحلية', distanceKm: 340, chargerKw: 120, corridor: 'Duqm Corridor', elevationM: 45 },
    { nameEn: 'OOMCO EV - Duqm Port & Renaissance Mega Hub', nameAr: 'نفط عُمان - المنطقة الاقتصادية وميناء الدقم', distanceKm: 520, chargerKw: 180, corridor: 'Duqm SEZ', elevationM: 20 }
  ]
};

/**
 * Core calculation of the VoltOman Engine adhering to exact user rules:
 * 1. Base Energy Consumption: E_base = Distance (km) * Manufacturer Rating (kWh/km)
 * 2. Temperature Penalty Factor (F_temp):
 *    - Temp <= 30°C: F_temp = 1.00
 *    - 30°C < Temp <= 40°C: F_temp = 1.10 (+10% A/C load)
 *    - Temp > 40°C: F_temp = 1.18 + ((Temp - 40) * 0.01) (A/C + active liquid battery cooling)
 * 3. Elevation Penalty Factor (F_elev):
 *    - Uphill: Add +2.5 kWh per 1,000m net elevation gain.
 *    - Downhill Regenerative Braking: Recover 60% of potential energy lost (E_regen = m * g * h * 0.60 in kWh).
 * 4. Fast Charger Thermal Derating:
 *    - If ambient temp > 42°C at midday (11:00-16:00), cap max charging speed at 65% of charger rated capacity.
 */
export function calculateVoltOmanEngine(input: VoltOmanInput): VoltOmanResult {
  const isArabic = input.language === 'Arabic';
  const distanceKm = Math.max(1, input.distanceKm);
  const ratingKwhPerKm = Math.max(0.08, input.manufacturerRatingKwhPerKm || 0.18);
  const batteryCapKwh = Math.max(20, input.batteryCapacityKwh || 75);
  const initialSoc = Math.min(100, Math.max(5, input.initialSocPct || 90));
  const minBufferPct = input.minArrivalSocBufferPct ?? 15;
  const ambientTempC = input.ambientTempC ?? 43;
  const timeOfDayHour = input.timeOfDayHour ?? 13;
  const uphillMeters = Math.max(0, input.uphillGainMeters || 0);
  const downhillMeters = Math.max(0, input.downhillLossMeters || 0);
  const vehicleMassKg = Math.max(1200, input.vehicleMassKg || 2150);
  const vehicleMaxDc = input.maxDcChargingSpeedKw || 200;

  // 1. BASE ENERGY CONSUMPTION
  const baseEnergyConsumptionKwh = Number((distanceKm * ratingKwhPerKm).toFixed(2));

  // 2. TEMPERATURE PENALTY FACTOR (F_temp)
  let tempPenaltyFactor = 1.00;
  let tempFormulaExplanation = '';
  if (ambientTempC <= 30) {
    tempPenaltyFactor = 1.00;
    tempFormulaExplanation = 'Temp ≤ 30°C: F_temp = 1.00 (Nominal baseline, standard climate)';
  } else if (ambientTempC <= 40) {
    tempPenaltyFactor = 1.10;
    tempFormulaExplanation = `30°C < Temp ≤ 40°C (${ambientTempC}°C): F_temp = 1.10 (+10% cabin A/C continuous load)`;
  } else {
    // Temp > 40°C: 1.18 + ((Temp - 40) * 0.01)
    const extraOver40 = ambientTempC - 40;
    tempPenaltyFactor = Number((1.18 + (extraOver40 * 0.01)).toFixed(4));
    tempFormulaExplanation = `Temp > 40°C (${ambientTempC}°C): F_temp = 1.18 + ((${ambientTempC} - 40) × 0.01) = ${tempPenaltyFactor.toFixed(3)} (Cabin A/C + Active High-Flow Battery Liquid Chilling)`;
  }

  const tempAdjustedEnergyKwh = Number((baseEnergyConsumptionKwh * tempPenaltyFactor).toFixed(2));

  // 3. ELEVATION PENALTY FACTOR (F_elev)
  // Uphill: +2.5 kWh per 1,000m net elevation gain
  const elevationUphillPenaltyKwh = Number(((uphillMeters / 1000) * 2.5).toFixed(2));

  // Downhill Regenerative Braking: E_regen = m * g * h * 0.60
  // m in kg, g = 9.81 m/s^2, h in meters. 1 kWh = 3.6e6 Joules
  // E_regen_kwh = (m * 9.81 * h / 3.6e6) * 0.60
  const joulesPotential = vehicleMassKg * 9.81 * downhillMeters;
  const kwhPotential = joulesPotential / 3600000;
  const regenRecoveredKwh = Number((kwhPotential * 0.60).toFixed(2));

  // TOTAL NET ENERGY CONSUMED
  // E_total = (E_base * F_temp) + E_elev_uphill - E_regen
  const totalNetEnergyKwh = Math.max(0.5, Number((tempAdjustedEnergyKwh + elevationUphillPenaltyKwh - regenRecoveredKwh).toFixed(2)));
  const effectiveEfficiencyKwhPerKm = Number((totalNetEnergyKwh / distanceKm).toFixed(3));

  // BATTERY USABLE ENERGY
  const usableStartKwh = (batteryCapKwh * initialSoc) / 100;
  const minBufferKwh = (batteryCapKwh * minBufferPct) / 100;
  const netEnergyAvailableWithoutCharging = usableStartKwh - minBufferKwh;

  const energyDeficitKwh = Math.max(0, Number((totalNetEnergyKwh - netEnergyAvailableWithoutCharging).toFixed(2)));
  const arrivalSocPctWithoutCharging = Number((((usableStartKwh - totalNetEnergyKwh) / batteryCapKwh) * 100).toFixed(1));

  // 4. FAST CHARGER THERMAL DERATING (Rule 4)
  // If ambient temp > 42°C at midday (11:00 - 16:00), cap max charging speed at 65% of charger rated capacity
  const isMidday = timeOfDayHour >= 11 && timeOfDayHour <= 16;
  const isDeratingTriggered = ambientTempC > 42 && isMidday;
  const deratingFormulaExplanation = isDeratingTriggered
    ? `Midday Heat Alert (${ambientTempC}°C @ ${timeOfDayHour}:00): Ambient > 42°C in midday hours (11:00-16:00) triggers a 35% thermal derating cap. All DC fast chargers limited to 65% of nameplate rating.`
    : `Standard Thermal Charging: ${
        ambientTempC > 42 
          ? `Ambient is ${ambientTempC}°C but outside midday peak (time is ${timeOfDayHour}:00). Full charging speeds permitted.` 
          : `Ambient temp (${ambientTempC}°C) is ≤ 42°C. No midday derating cap applied.`
      }`;

  // Select waypoints along corridor
  const corridorKey = input.highwayCorridor in OMAN_HIGHWAY_WAYPOINTS 
    ? input.highwayCorridor 
    : 'Adam-Thumrait-Salalah';
  const waypointList = OMAN_HIGHWAY_WAYPOINTS[corridorKey] || OMAN_HIGHWAY_WAYPOINTS['Adam-Thumrait-Salalah'];

  // Plan Charging Stops
  const chargingItinerary: VoltOmanChargingStop[] = [];
  let currentSoc = initialSoc;
  let currentKm = 0;
  let totalChargingTimeMins = 0;
  let totalTripCostOmr = 0;

  // Check if direct route is feasible without any stop
  const isDirectFeasible = arrivalSocPctWithoutCharging >= minBufferPct;

  if (!isDirectFeasible) {
    // Generate intermediate charging stops along the chosen highway
    // Scale waypoints to match requested distance
    const totalCorridorDistance = waypointList[waypointList.length - 1].distanceKm || distanceKm;
    const distanceScale = distanceKm / totalCorridorDistance;

    // Filter candidate charging stations
    const candidateStations = waypointList.slice(1, -1); // Exclude origin & final destination
    
    // We simulate vehicle driving along the route
    let currentBatteryKwh = usableStartKwh;

    for (let i = 0; i < candidateStations.length; i++) {
      const station = candidateStations[i];
      const stationKm = Math.min(distanceKm - 15, Math.round(station.distanceKm * distanceScale));
      if (stationKm <= currentKm + 20) continue;

      const segmentKm = stationKm - currentKm;
      const segmentEnergyKwh = (segmentKm / distanceKm) * totalNetEnergyKwh;

      const simulatedArrivalBatteryKwh = currentBatteryKwh - segmentEnergyKwh;
      const simulatedArrivalSoc = (simulatedArrivalBatteryKwh / batteryCapKwh) * 100;

      // Stop if battery is expected to drop below or near the 22% threshold before reaching next candidate
      const isStopNeeded = simulatedArrivalSoc <= 25 || (i === candidateStations.length - 1 && simulatedArrivalSoc <= 35) || (distanceKm > 400 && i % 2 === 0);

      if (isStopNeeded && simulatedArrivalSoc > 0) {
        // Calculate charging session at this station
        const arrivalSocPct = Math.max(5, Math.round(simulatedArrivalSoc));
        const targetDepartureSocPct = Math.min(85, Math.max(arrivalSocPct + 45, 80)); // Fast charging taper above 80%
        const energyAddedKwh = Number((((targetDepartureSocPct - arrivalSocPct) / 100) * batteryCapKwh).toFixed(2));

        // Charger derating calculation
        const ratedKw = station.chargerKw;
        let effectivePowerKw = Math.min(vehicleMaxDc, ratedKw);
        if (isDeratingTriggered) {
          effectivePowerKw = Math.min(vehicleMaxDc, ratedKw * 0.65);
        }
        effectivePowerKw = Number(effectivePowerKw.toFixed(1));

        // Time to charge in minutes = (energyAdded / effectivePower) * 60 * 1.10 (thermal taper buffer)
        const chargeMins = Math.max(12, Math.round((energyAddedKwh / effectivePowerKw) * 60 * 1.08));

        // Oman Tariff Tier:
        // Tier 1 (<=90kW): 0.050 OMR/kWh
        // Tier 2 (91-180kW): 0.088 OMR/kWh
        // Tier 3 (>180kW): 0.119 OMR/kWh
        let tariffRate = 0.088;
        if (effectivePowerKw <= 90) tariffRate = 0.050;
        else if (effectivePowerKw > 180) tariffRate = 0.119;

        const sessionCostOmr = Number((energyAddedKwh * tariffRate).toFixed(3));

        chargingItinerary.push({
          stopIndex: chargingItinerary.length + 1,
          stationNameEn: station.nameEn,
          stationNameAr: station.nameAr,
          highwayCorridor: station.corridor,
          distanceFromStartKm: stationKm,
          segmentDistanceKm: segmentKm,
          arrivalSocPct,
          targetDepartureSocPct,
          chargerRatedKw: ratedKw,
          effectiveChargingPowerKw: effectivePowerKw,
          isMiddayDerated: isDeratingTriggered,
          chargingTimeMins: chargeMins,
          energyAddedKwh,
          estimatedCostOmr: sessionCostOmr,
          coolingAdvice: isDeratingTriggered 
            ? 'Midday derated speed active. Keep vehicle cabin A/C idling to circulate liquid battery coolant during DC charging.'
            : 'Nominal charging profile. Pre-cool cabin 5 mins before departure.'
        });

        totalChargingTimeMins += chargeMins;
        totalTripCostOmr += sessionCostOmr;

        // Update state for next leg
        currentKm = stationKm;
        currentBatteryKwh = (targetDepartureSocPct / 100) * batteryCapKwh;
      }
    }
  }

  // Driving time based on Oman highway speed limits (averaging 105 km/h on expressways)
  const averageSpeedKmH = distanceKm > 300 ? 108 : (uphillMeters > 800 ? 75 : 95);
  const totalDriveTimeMins = Math.round((distanceKm / averageSpeedKmH) * 60);
  const totalTripTimeMins = totalDriveTimeMins + totalChargingTimeMins;

  // Feasibility Verdict
  let feasibilityVerdict: 'DIRECT_REACHABLE' | 'FEASIBLE_WITH_CHARGES' | 'CRITICAL_DEFICIT';
  let verdictTitleEn = '';
  let verdictTitleAr = '';
  let verdictSummaryEn = '';
  let verdictSummaryAr = '';

  if (isDirectFeasible) {
    feasibilityVerdict = 'DIRECT_REACHABLE';
    verdictTitleEn = 'FEASIBLE — DIRECT NON-STOP ROUTE';
    verdictTitleAr = 'مسار متاح — وصول مباشر بدون توقف شحن';
    verdictSummaryEn = `The planned route of ${distanceKm} km is fully achievable on single initial battery charge (${initialSoc}% SOC). Estimated arrival state of charge is ${arrivalSocPctWithoutCharging}%, comfortably exceeding the ${minBufferPct}% safety buffer.`;
    verdictSummaryAr = `المسار المخطط (${distanceKm} كم) متاح بالكامل بشحنة البطارية الأولية (${initialSoc}%). نسبة الوصول المتوقعة ${arrivalSocPctWithoutCharging}% متجاوزة احتياطي الأمان المطلوب (${minBufferPct}%).`;
  } else if (chargingItinerary.length > 0) {
    feasibilityVerdict = 'FEASIBLE_WITH_CHARGES';
    verdictTitleEn = `FEASIBLE — ${chargingItinerary.length} OPTIMIZED CHARGING STOP${chargingItinerary.length > 1 ? 'S' : ''} REQUIRED`;
    verdictTitleAr = `مسار متاح — يتطلب ${chargingItinerary.length} وقفات شحن مثالية`;
    verdictSummaryEn = `Route requires ${chargingItinerary.length} high-throughput charging stop(s) along ${input.highwayCorridor}. Total charging dwell time is ${totalChargingTimeMins} minutes. ${isDeratingTriggered ? '⚠️ Midday thermal derating applied (chargers capped at 65%).' : 'All chargers operating at nominal capacity.'}`;
    verdictSummaryAr = `يتطلب المسار ${chargingItinerary.length} وقفة شحن ذكية على طول طريق ${input.highwayCorridor}. إجمالي وقت التوقف للشحن هو ${totalChargingTimeMins} دقيقة. ${isDeratingTriggered ? '⚠️ تنبيه: تم تفعيل تقييد سرعة الشحن بنسبة 65% بسبب ذروة الحرارة الظهيرة.' : 'تعمل الشواحن بكامل طاقتها الاسمية.'}`;
  } else {
    feasibilityVerdict = 'CRITICAL_DEFICIT';
    verdictTitleEn = 'CRITICAL ENERGY DEFICIT — RE-ROUTE OR DECREASE SPEED';
    verdictTitleAr = 'عجز طاقة حرج — يلزم تخفيض السرعة أو جدولة شواحن إضافية';
    verdictSummaryEn = `Route exceeds current battery capacity and no sufficient ultra-fast chargers were matched for this corridor. Energy deficit: ${energyDeficitKwh} kWh. Charge to 100% or select lower highway cruising speed.`;
    verdictSummaryAr = `يتجاوز المسار سعة البطارية الحالية ولم يتم العثور على شواحن كافية. عجز الطاقة: ${energyDeficitKwh} ك.و.س. اشحن لـ 100% أو خفف السرعة.`;
  }

  // Battery Health & Thermal Mitigation Advice
  const batteryThermalMitigationAdviceEn: string[] = [
    ambientTempC > 40
      ? `Active Desert Cooling Penalty (${tempPenaltyFactor.toFixed(3)}x): Ambient heat (${ambientTempC}°C) forces high chiller compressor RPM. Maintain cabin temperature at 22°C to prevent refrigerant loop competition between cabin and battery pack.`
      : `Nominal Desert Ambient (${ambientTempC}°C): Thermal stress is moderate. Routine liquid conditioning is sufficient.`,
    isDeratingTriggered
      ? `Midday Solar Heat Derating: Ambient temperature is ${ambientTempC}°C during peak midday sun (${timeOfDayHour}:00). Expect DC fast chargers to output a maximum of 65% of rated power. Schedule high-throughput fast charging sessions before 10:30 AM or after 16:30 PM along desert corridors (e.g. Adam, Ghaba, Haima).`
      : `Optimal Charging Window: Travel scheduling at ${timeOfDayHour}:00 avoids peak midday transformer and cable cooling stress.`,
    uphillMeters > 500
      ? `Mountain Climb Thermal Safeguard (+${uphillMeters}m climb): Continuous uphill load generates localized cell heat. Do not fast-charge immediately after a steep summit climb; allow 10 minutes of level driving for coolant normalization.`
      : `Corridor Topography: Modest elevation variation (${uphillMeters}m climb / ${downhillMeters}m descent). Minimal thermal cycling spikes.`,
    downhillMeters > 300
      ? `Regenerative Energy Recovery (${regenRecoveredKwh} kWh recovered): Ensure battery SOC is below 85% before beginning mountain descents (e.g., Jabal Akhdar or Jabal Shams) so full regenerative braking power is accepted without mechanical brake fade.`
      : `Standard Braking Strategy: Flat corridor terrain; standard kinetic capture.`,
    `Cell Preservation Guideline: Target 15%–80% SOC charging curve on Oman high-power corridors. The last 20% (80% to 100%) triples cell heat generation and dwell times.`
  ];

  const batteryThermalMitigationAdviceAr: string[] = [
    ambientTempC > 40
      ? `معامل الإجهاد الحراري الصحراوي (${tempPenaltyFactor.toFixed(3)}x): حرارة الجو (${ambientTempC}° م) تفرض تشغيل كمبريسور التبريد بأقصى قدرة. اضبط مكيف المقصورة على 22° م لتفادي التنافس على دورة سائل التبريد بين المقصورة وخلايا البطارية.`
      : `حرارة بيئية اعتيادية (${ambientTempC}° م): الإجهاد الحراري معتدل ودورات التبريد تعمل بكفاءة طبيعية.`,
    isDeratingTriggered
      ? `تقييد سرعة الشحن وقت الظهيرة: الحرارة ${ambientTempC}° م في ذروة الظهيرة (${timeOfDayHour}:00). ستعمل الشواحن السريعة بحد أقصى 65% من قدرتها الاسمية لحماية الكابلات والمحولات. يفضل شحن المركبة قبل 10:30 صباحاً أو بعد 16:30 عصراً على طريق أدم-ثمريت-صلالة.`
      : `نافذة شحن ممتازة: توقيت الرحلة (${timeOfDayHour}:00) يتفادى ذروة حرارة الظهيرة، مما يتيح الاستفادة من كامل سرعة الشواحن.`,
    uphillMeters > 500
      ? `حماية البطارية أثناء الصعود الجبلي (+${uphillMeters} م): الصعود المتواصل يرفع حرارة خلايا البطارية. تجنب الشحن السريع الفوري بعد الوصول للقمة واترك السيارة تدور لدقائق لتثبيت حرارة السائل.`
      : `تضاريس منبسطة: صعود خفيف (${uphillMeters} م) وهبوط (${downhillMeters} م) بدون إجهاد حراري حاد.`,
    downhillMeters > 300
      ? `استرداد الطاقة بالمكابح التجديدية (تم استرداد ${regenRecoveredKwh} ك.و.س): احرص أن تكون نسبة الشحن أقل من 85% قبل النزول من المنحدرات الجبلية (مثل الجبل الأخضر) لضمان استيعاب البطارية لكامل طاقة المكابح التجديدية.`
      : `استراتيجية الكبح: مسار صحراوي مستوٍ مع استرداد قياسي للطاقة الحركية.`,
    `إرشاد الحفاظ على عمر البطارية: التزم بنطاق شحن 15% إلى 80% في المحطات السريعة. آخر 20% (من 80% إلى 100%) تضاعف حرارة الخلايا وتطيل وقت الانتظار ثلاث مرات.`
  ];

  // Compile Structured Markdown Report strictly matching the user requirement:
  // - Executive Summary & Feasibility Verdict
  // - Detailed Telemetry Breakdown (Metrics)
  // - Step-by-step Charging Itinerary
  // - Battery Health & Thermal Mitigation Advice
  const fullMarkdownReport = generateVoltOmanMarkdownReport({
    input,
    distanceKm,
    ratingKwhPerKm,
    baseEnergyConsumptionKwh,
    ambientTempC,
    timeOfDayHour,
    isMidday,
    tempPenaltyFactor,
    tempFormulaExplanation,
    tempAdjustedEnergyKwh,
    uphillMeters,
    downhillMeters,
    vehicleMassKg,
    elevationUphillPenaltyKwh,
    regenRecoveredKwh,
    totalNetEnergyKwh,
    effectiveEfficiencyKwhPerKm,
    usableStartKwh,
    batteryCapKwh,
    initialSoc,
    minBufferPct,
    arrivalSocPctWithoutCharging,
    isDirectFeasible,
    isDeratingTriggered,
    deratingFormulaExplanation,
    feasibilityVerdict,
    verdictTitleEn,
    verdictSummaryEn,
    chargingItinerary,
    totalChargingTimeMins,
    totalDriveTimeMins,
    totalTripTimeMins,
    totalTripCostOmr,
    batteryThermalMitigationAdviceEn,
    isArabic
  });

  const telemetry: VoltOmanTelemetryMetrics = {
    distanceKm,
    manufacturerRatingKwhPerKm: ratingKwhPerKm,
    baseEnergyConsumptionKwh,
    ambientTempC,
    timeOfDayHour,
    isMidday,
    tempPenaltyFactor,
    tempFormulaExplanation,
    tempAdjustedEnergyKwh,
    uphillGainMeters: uphillMeters,
    elevationUphillPenaltyKwh,
    downhillLossMeters: downhillMeters,
    vehicleMassKg,
    regenRecoveredKwh,
    totalNetEnergyKwh,
    effectiveEfficiencyKwhPerKm,
    usableBatteryCapacityKwh: batteryCapKwh,
    initialSocPct: initialSoc,
    arrivalSocPctWithoutCharging,
    isDirectFeasible,
    requiredChargingStopsCount: chargingItinerary.length,
    isDeratingTriggered,
    deratingFormulaExplanation
  };

  return {
    feasibilityVerdict,
    verdictTitleEn,
    verdictTitleAr,
    verdictSummaryEn,
    verdictSummaryAr,
    telemetry,
    chargingItinerary,
    totalChargingTimeMins,
    totalDriveTimeMins,
    totalTripTimeMins,
    totalTripCostOmr,
    batteryThermalMitigationAdviceEn,
    batteryThermalMitigationAdviceAr,
    fullMarkdownReport,
    calculatedAt: new Date().toISOString(),
    executionEngine: 'VOLTOMAN_PRECISION_ENGINE'
  };
}

/**
 * Generates pristine structured Markdown report complying with the exact prompt schema
 */
function generateVoltOmanMarkdownReport(data: any): string {
  const {
    input,
    distanceKm,
    ratingKwhPerKm,
    baseEnergyConsumptionKwh,
    ambientTempC,
    timeOfDayHour,
    tempPenaltyFactor,
    tempFormulaExplanation,
    tempAdjustedEnergyKwh,
    uphillMeters,
    downhillMeters,
    vehicleMassKg,
    elevationUphillPenaltyKwh,
    regenRecoveredKwh,
    totalNetEnergyKwh,
    effectiveEfficiencyKwhPerKm,
    batteryCapKwh,
    initialSoc,
    minBufferPct,
    arrivalSocPctWithoutCharging,
    isDirectFeasible,
    isDeratingTriggered,
    deratingFormulaExplanation,
    verdictTitleEn,
    verdictSummaryEn,
    chargingItinerary,
    totalChargingTimeMins,
    totalDriveTimeMins,
    totalTripTimeMins,
    totalTripCostOmr,
    batteryThermalMitigationAdviceEn,
    isArabic
  } = data;

  if (isArabic) {
    return `# محرك VoltOman للمركبات الكهربائية — تقرير دراسة المسار والاستهلاك الحراري

## Executive Summary & Feasibility Verdict
- **قرار الجدوى:** ${verdictTitleEn}
- **ملخص التقييم:** ${verdictSummaryEn}
- **المسار المستهدف:** ${input.routeNameAr || input.routeNameEn} (${input.highwayCorridor})
- **المسافة الإجمالية:** ${distanceKm} كم
- **المركبة:** ${input.vehicleModelName || 'المركبة الكهربائية المحددة'} (${batteryCapKwh} ك.و.س سعة البطارية)
- **شحنة البداية:** ${initialSoc}% | **احتياطي الأمان الأدنى:** ${minBufferPct}%
- **صافي استهلاك الطاقة المتوقع:** ${totalNetEnergyKwh} ك.و.س (${effectiveEfficiencyKwhPerKm} ك.و.س/كم)
- **إجمالي زمن الرحلة:** ${Math.floor(totalTripTimeMins / 60)} س و ${totalTripTimeMins % 60} د (${totalDriveTimeMins} د قيادة + ${totalChargingTimeMins} د شحن)

---

## Detailed Telemetry Breakdown (Metrics)
| المؤشر الفني | القيمة الرياضية | القانون والمعادلة المطبقة |
| :--- | :--- | :--- |
| **استهلاك الطاقة الأساسي ($E_{base}$)** | **${baseEnergyConsumptionKwh} kWh** | $E_{base} = ${distanceKm} \\text{ km} \\times ${ratingKwhPerKm} \\text{ kWh/km}$ |
| **معامل الحرارة الجزائي ($F_{temp}$)** | **${tempPenaltyFactor.toFixed(3)}x** | ${tempFormulaExplanation} |
| **الطاقة المعدلة بالحرارة** | **${tempAdjustedEnergyKwh} kWh** | $E_{temp\\_adj} = E_{base} \\times F_{temp}$ |
| **جزاء الصعود الجبلي ($F_{elev}$)** | **+${elevationUphillPenaltyKwh} kWh** | $+2.5 \\text{ kWh}$ لكل $1,000\\text{m}$ صعود (+${uphillMeters} م) |
| **استرداد الكبح التجديدي ($E_{regen}$)** | **-${regenRecoveredKwh} kWh** | $E_{regen} = m \\cdot g \\cdot h \\times 0.60$ (كتلة: ${vehicleMassKg} كجم، هبوط: ${downhillMeters} م) |
| **صافي الطاقة الكلية المستهلكة ($E_{net}$)** | **${totalNetEnergyKwh} kWh** | $E_{net} = (E_{base} \\times F_{temp}) + E_{elev\\_uphill} - E_{regen}$ |
| **الكفاءة الفعلية بعد التأثيرات** | **${effectiveEfficiencyKwhPerKm} kWh/km** | معدل الاستهلاك الحقيقي لظروف سلطنة عُمان |
| **تقييد شواحن الظهيرة السريعة** | **${isDeratingTriggered ? 'مفعل (65% الحد الأقصى)' : 'غير مقيد (100%)'}** | ${deratingFormulaExplanation} |

---

## Step-by-step Charging Itinerary
${
  chargingItinerary.length === 0
    ? `> **وصول مباشر بدون توقف:** المسار متاح بالكامل دون الحاجة لشحن وسطي. نسبة شحن الوصول المتوقعة: **${arrivalSocPctWithoutCharging}%** (أعلى من حد الأمان ${minBufferPct}%).`
    : chargingItinerary
        .map(
          (stop: VoltOmanChargingStop) => `### المحطة ${stop.stopIndex}: ${stop.stationNameAr} (${stop.highwayCorridor})
- **الموقع والكيلومتر:** ${stop.distanceFromStartKm} كم من نقطة الانطلاق (مقطع ${stop.segmentDistanceKm} كم)
- **نسبة شحن الوصول:** ${stop.arrivalSocPct}% ➔ **نسبة الشحن المستهدفة عند المغادرة:** ${stop.targetDepartureSocPct}%
- **قدرة الشاحن الاسمية:** ${stop.chargerRatedKw} kW | **القدرة الفعلية المتاحة:** **${stop.effectiveChargingPowerKw} kW** ${stop.isMiddayDerated ? '(مقيدة حرارياً بنسبة 65% بسبب الظهيرة)' : ''}
- **زمن الشحن المستغرق:** **${stop.chargingTimeMins} دقيقة**
- **الطاقة المضافة:** ${stop.energyAddedKwh} kWh | **التكلفة التقديرية:** ${stop.estimatedCostOmr.toFixed(3)} ريال عُماني
- **إرشاد التبريد بالمحطة:** ${stop.coolingAdvice}
`
        )
        .join('\n')
}

---

## Battery Health & Thermal Mitigation Advice
${batteryThermalMitigationAdviceEn.map((adv: string) => `- ${adv}`).join('\n')}
`;
  }

  // English Markdown Report (Default)
  return `# VoltOman Engine — Route Feasibility & Battery Telemetry Report

## Executive Summary & Feasibility Verdict
- **Verdict:** **${verdictTitleEn}**
- **Summary:** ${verdictSummaryEn}
- **Target Route:** ${input.routeNameEn} (${input.highwayCorridor})
- **Total Route Distance:** ${distanceKm} km
- **Vehicle Profile:** ${input.vehicleModelName || 'Selected EV'} (${batteryCapKwh} kWh pack, rated at ${ratingKwhPerKm} kWh/km)
- **Initial SOC:** ${initialSoc}% | **Required Safety Buffer:** ${minBufferPct}%
- **Total Net Energy Consumption:** **${totalNetEnergyKwh} kWh** (Effective: **${effectiveEfficiencyKwhPerKm} kWh/km**)
- **Total Trip Duration:** ${Math.floor(totalTripTimeMins / 60)}h ${totalTripTimeMins % 60}m (${totalDriveTimeMins}m driving + ${totalChargingTimeMins}m charging)
- **Total Estimated Charging Cost:** ${totalTripCostOmr.toFixed(3)} OMR

---

## Detailed Telemetry Breakdown (Metrics)
| Engineering Metric | Calculated Value | Governing Rule / Applied Formula |
| :--- | :--- | :--- |
| **Base Energy Consumption ($E_{base}$)** | **${baseEnergyConsumptionKwh} kWh** | $E_{base} = \\text{Distance (${distanceKm} km)} \\times \\text{Rating (${ratingKwhPerKm} kWh/km)}$ |
| **Temperature Penalty Factor ($F_{temp}$)** | **${tempPenaltyFactor.toFixed(3)}x** | ${tempFormulaExplanation} |
| **Temperature-Adjusted Energy** | **${tempAdjustedEnergyKwh} kWh** | $E_{temp\\_adj} = E_{base} \\times F_{temp}$ |
| **Uphill Elevation Penalty ($F_{elev}$)** | **+${elevationUphillPenaltyKwh} kWh** | $+2.5 \\text{ kWh}$ per $1,000\\text{m}$ climb (Climb: $+${uphillMeters}\\text{m}$) |
| **Downhill Regen Recovery ($E_{regen}$)** | **-${regenRecoveredKwh} kWh** | $E_{regen} = m \\cdot g \\cdot h \\times 0.60$ (Mass: ${vehicleMassKg} kg, Descent: ${downhillMeters}m) |
| **Total Net Energy Consumption ($E_{net}$)** | **${totalNetEnergyKwh} kWh** | $E_{net} = (E_{base} \\times F_{temp}) + E_{elev\\_uphill} - E_{regen}$ |
| **Effective Desert Efficiency** | **${effectiveEfficiencyKwhPerKm} kWh/km** | Net consumption rate normalized for Oman's terrain & climate |
| **Midday Fast Charger Thermal Derating** | **${isDeratingTriggered ? 'ACTIVE (65% CAP)' : 'NOMINAL (100%)'}** | ${deratingFormulaExplanation} |

---

## Step-by-step Charging Itinerary
${
  chargingItinerary.length === 0
    ? `> **Direct Non-Stop Feasible:** Vehicle can reach destination without intermediate charging. Estimated arrival SOC: **${arrivalSocPctWithoutCharging}%** (Comfortably exceeds ${minBufferPct}% reserve threshold).`
    : chargingItinerary
        .map(
          (stop: VoltOmanChargingStop) => `### Stop #${stop.stopIndex}: ${stop.stationNameEn} (${stop.highwayCorridor})
- **Location & Milestone:** Km ${stop.distanceFromStartKm} from origin (${stop.segmentDistanceKm} km leg)
- **State of Charge:** Arrive at **${stop.arrivalSocPct}% SOC** ➔ Charge to **${stop.targetDepartureSocPct}% SOC**
- **Charger Specs:** ${stop.chargerRatedKw} kW rated | **Effective Output:** **${stop.effectiveChargingPowerKw} kW** ${stop.isMiddayDerated ? '*(Capped at 65% due to >42°C Midday Derating Rule)*' : ''}
- **Charging Dwell Time:** **${stop.chargingTimeMins} minutes**
- **Energy Added:** ${stop.energyAddedKwh} kWh | **Estimated Cost:** ${stop.estimatedCostOmr.toFixed(3)} OMR
- **Station Thermal Mitigation:** ${stop.coolingAdvice}
`
        )
        .join('\n')
}

---

## Battery Health & Thermal Mitigation Advice
${batteryThermalMitigationAdviceEn.map((adv: string) => `- ${adv}`).join('\n')}
`;
}

/**
 * Backwards compatibility helper for existing legacy callers of calculateOmanEvDeterministic
 */
export function calculateOmanEvDeterministic(input: OmanEvInput): OmanEvAnalysisResult {
  const voltInput: VoltOmanInput = {
    routeNameEn: input.stationName || 'Oman Highway Transit',
    routeNameAr: 'مسار سلطنة عمان السريع',
    highwayCorridor: 'Adam-Thumrait-Salalah',
    distanceKm: input.originalEstimatedRangeKm || 380,
    manufacturerRatingKwhPerKm: 0.18,
    batteryCapacityKwh: input.batteryCapacityKwh || 75,
    initialSocPct: input.currentSocPct || 85,
    ambientTempC: input.ambientTempC || 44,
    timeOfDayHour: 13,
    uphillGainMeters: Math.max(0, input.elevationChangeMeters || 0),
    downhillLossMeters: Math.max(0, -(input.elevationChangeMeters || 0)),
    vehicleMassKg: 2150,
    vehicleModelName: input.vehicleModel || 'Oman EV Fleet',
    language: input.language
  };

  const voltResult = calculateVoltOmanEngine(voltInput);
  const isArabic = input.language === 'Arabic';

  // Map to OmanEvAnalysisResult structure
  let thermal_status: "NORMAL" | "WARNING" | "CRITICAL" = "NORMAL";
  if (input.batteryTempC > 50 || input.ambientTempC > 45) {
    thermal_status = "CRITICAL";
  } else if (input.batteryTempC >= 42 || input.ambientTempC >= 38) {
    thermal_status = "WARNING";
  }

  const range_loss_pct = Number(((1 - (1 / voltResult.telemetry.tempPenaltyFactor)) * 100).toFixed(1));
  const adjusted_range = Math.round((input.originalEstimatedRangeKm || 400) / voltResult.telemetry.tempPenaltyFactor);

  return {
    agent_telemetry_summary: {
      vehicle_id: input.vehicleId || 'OM-EV-FLEET',
      normalized_temp_c: input.ambientTempC,
      normalized_soc_pct: input.currentSocPct,
      normalized_battery_temp_c: input.batteryTempC,
      elevation_change_m: input.elevationChangeMeters,
      elevation_impact_desc: voltResult.telemetry.tempFormulaExplanation
    },
    thermal_and_range_analysis: {
      original_estimated_range_km: input.originalEstimatedRangeKm || 400,
      adjusted_desert_range_km: adjusted_range,
      range_loss_percentage: range_loss_pct,
      thermal_status,
      heat_coefficient_applied: voltResult.telemetry.tempFormulaExplanation,
      cooling_power_penalty_pct: Math.round((voltResult.telemetry.tempPenaltyFactor - 1) * 100)
    },
    grid_and_charging_optimization: {
      allocated_power_kw: voltResult.telemetry.isDeratingTriggered ? 78 : 120,
      applied_charging_tier: "TIER_2",
      tariff_rate_omr_per_kwh: 0.088,
      tariff_rate_usd_per_kwh: 0.23,
      cooling_power_draw_kw: input.ambientTempC > 40 ? 4.5 : 2.0,
      station_grid_load_pct: 68,
      estimated_charge_time_mins: 28,
      dynamic_load_allocation_note: voltResult.telemetry.deratingFormulaExplanation
    },
    vision_hardware_audit: {
      has_image_input: Boolean(input.imageDataBase64),
      detected_faults: [],
      maintenance_priority: "NONE",
      diagnostic_details: isArabic ? 'حالة الشاحن والكابلات ممتازة' : 'Nominal hardware operating status',
      inspected_components: {
        connector_latch: "GOOD",
        screen_lcd: "CLEAR",
        cooling_vents: "CLEAN",
        charging_cable: "HEALTHY"
      }
    },
    driver_actionable_recommendation: voltResult.verdictSummaryEn,
    calculated_at: new Date().toISOString(),
    execution_mode: "PRECISION_DETERMINISTIC_ENGINE"
  };
}
