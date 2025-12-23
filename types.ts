export interface SensitivitySettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  freeLook: number;
  dpi: number;
  fireButtonSize: number;
}

export interface DeviceProfile {
  brand: string;
  model: string;
  settings: SensitivitySettings;
  tags?: string[]; // e.g., 'flagship', 'gaming', 'entry-level'
}

export type PlayingStyle = 'One Tap' | 'Rush' | 'Sniper' | 'Balanced';
export type TouchMethod = 'Raw Finger' | 'Finger Sleeve' | 'Powder';
export type RefreshRate = 60 | 90 | 120 | 144;

export interface HistoryItem {
  id: number;
  date: string;
  device: string;
  settings: SensitivitySettings;
}

export type Language = 'en' | 'si';