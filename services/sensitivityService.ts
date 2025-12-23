import { SensitivitySettings, DeviceProfile, PlayingStyle, TouchMethod, RefreshRate } from '../types';

export const calculateOptimizedSensitivity = (
  modelName: string,
  totalRam: number,
  ramUsagePercent: number,
  availableStorageGb: number,
  playingStyle: PlayingStyle,
  touchMethod: TouchMethod,
  refreshRate: RefreshRate
): { profile: string, settings: SensitivitySettings, tips: string } => {
  
  // Base Sensitivity
  let baseSens = 100;

  // 1. Hardware RAM Logic (Scale 0-200)
  // Lower RAM devices need higher sensitivity to compensate for touch latency
  if (totalRam <= 3) baseSens = 140;
  else if (totalRam <= 4) baseSens = 130;
  else if (totalRam <= 6) baseSens = 110;
  else baseSens = 95; // High end devices are smooth, need control

  // 2. Friction/Touch Logic
  let frictionMod = 0;
  if (touchMethod === 'Raw Finger') {
    frictionMod = 15; // High friction -> Boost sens
  } else if (touchMethod === 'Powder') {
    frictionMod = -5; // Low friction -> Lower sens for stability
  } else if (touchMethod === 'Finger Sleeve') {
    frictionMod = 0; // Balanced
  }

  // 3. System Lag Logic (RAM Usage or Storage)
  const isLagging = ramUsagePercent > 85 || availableStorageGb < 5;
  const lagBoost = isLagging ? 20 : 0; // Boost sens if device is struggling

  // 4. Playstyle Logic
  let styleMod = 0;
  let sniperMod = 0;
  if (playingStyle === 'Rush') styleMod = 10;
  if (playingStyle === 'One Tap') styleMod = 5;
  if (playingStyle === 'Sniper') sniperMod = -30; // Significantly lower sniper sens

  // 5. Refresh Rate Logic
  // 60Hz screens have higher input delay -> Boost sens
  const refreshMod = refreshRate === 60 ? 10 : 0;

  // Calculate Final Values
  const calc = (base: number) => {
    let val = base + frictionMod + lagBoost + styleMod + refreshMod;
    // Specific adjustments per scope type relative to General
    return Math.min(200, Math.max(10, Math.round(val)));
  };

  const general = calc(baseSens);
  
  const settings: SensitivitySettings = {
    general: general,
    redDot: calc(baseSens - 5),
    scope2x: calc(baseSens - 10),
    scope4x: calc(baseSens - 5),
    sniper: Math.min(200, Math.max(10, Math.round((baseSens * 0.6) + sniperMod + lagBoost))),
    freeLook: calc(baseSens + 10),
    dpi: totalRam > 4 ? 480 : 360,
    fireButtonSize: isLagging ? 60 : 45 // Larger button for laggy devices
  };

  // Generate Tip
  let tips = "Settings optimized for balanced performance.";
  if (isLagging) tips = "⚠️ High System Stress Detected! Sensitivity boosted (+20) to compensate for potential frame drops.";
  else if (touchMethod === 'Raw Finger') tips = "👆 'Raw Finger' mode active: Sensitivity increased to overcome skin friction.";
  else if (touchMethod === 'Powder') tips = "✨ 'Powder' mode active: Sensitivity stabilized for smooth surface control.";

  return {
    profile: modelName || "Custom Device",
    settings,
    tips
  };
};