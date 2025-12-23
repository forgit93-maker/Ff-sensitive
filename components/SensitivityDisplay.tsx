import React from 'react';
import { SensitivitySettings } from '../types';
import { Crosshair, Eye, Target, Smartphone, CircleDashed } from 'lucide-react';

interface Props {
  settings: SensitivitySettings;
}

const SensitivityRow = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="mb-4 group">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2 text-white/90 font-medium">
        {icon}
        <span className="text-sm tracking-wide">{label}</span>
      </div>
      <span className="text-neon-pink font-bold text-lg drop-shadow-[0_0_5px_rgba(255,0,127,0.8)]">
        {value}
      </span>
    </div>
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
      {/* Width calculated based on max 200 */}
      <div 
        className="h-full bg-gradient-to-r from-neon-pink to-neon-magenta shadow-[0_0_15px_#ff007f] transition-all duration-1000 ease-out rounded-full"
        style={{ width: `${(value / 200) * 100}%` }}
      />
    </div>
  </div>
);

export const SensitivityDisplay: React.FC<Props> = ({ settings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      <SensitivityRow 
        label="General" 
        value={settings.general} 
        icon={<Smartphone size={16} className="text-neon-pink" />} 
      />
      <SensitivityRow 
        label="Red Dot" 
        value={settings.redDot} 
        icon={<Target size={16} className="text-neon-pink" />} 
      />
      <SensitivityRow 
        label="2x Scope" 
        value={settings.scope2x} 
        icon={<Crosshair size={16} className="text-neon-pink" />} 
      />
      <SensitivityRow 
        label="4x Scope" 
        value={settings.scope4x} 
        icon={<Crosshair size={16} className="text-neon-pink" />} 
      />
      <SensitivityRow 
        label="Sniper Scope" 
        value={settings.sniper} 
        icon={<Target size={16} className="text-neon-pink" />} 
      />
      <SensitivityRow 
        label="Free Look" 
        value={settings.freeLook} 
        icon={<Eye size={16} className="text-neon-pink" />} 
      />
      
      {/* Specs Grid */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mt-4">
        {/* DPI Card */}
        <div className="p-4 rounded-xl border border-neon-pink/30 bg-neon-pink/5 relative overflow-hidden flex flex-col justify-center items-center animate-pulse-slow">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
           <h3 className="text-neon-pink font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Recommended DPI</h3>
           <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_10px_#ff007f]">
              {settings.dpi === 0 ? "Default" : settings.dpi}
           </div>
        </div>

        {/* Fire Button Size Card */}
        <div className="p-4 rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 relative overflow-hidden flex flex-col justify-center items-center">
           <h3 className="text-neon-magenta font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Fire Button Size</h3>
           <div className="flex items-center gap-2">
             <CircleDashed className="text-neon-magenta animate-spin-slow" size={20} />
             <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_10px_#e100ff]">
                {settings.fireButtonSize}%
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};