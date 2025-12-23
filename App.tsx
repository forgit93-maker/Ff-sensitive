import React, { useState, useEffect } from 'react';
import { Settings, Zap, Moon, Sun, Globe, History, Trash2, Smartphone, Cpu, Activity, Gamepad2, Layers, RotateCw, X, ChevronRight, Copy, Check } from 'lucide-react';
import { calculateOptimizedSensitivity } from './services/sensitivityService';
import { SensitivitySettings, PlayingStyle, TouchMethod, RefreshRate, HistoryItem } from './types';
import { SensitivityDisplay } from './components/SensitivityDisplay';

const App: React.FC = () => {
  // --- STATE ---
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [lang, setLang] = useState<'en' | 'si'>('en');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Inputs
  const [device, setDevice] = useState('');
  const [ram, setRam] = useState(6);
  const [storage, setStorage] = useState(128);
  const [ramUsage, setRamUsage] = useState(60);
  const [availStorage, setAvailStorage] = useState(15);
  const [playStyle, setPlayStyle] = useState<PlayingStyle>('Balanced');
  const [refreshRate, setRefreshRate] = useState<RefreshRate>(60);
  const [touchMethod, setTouchMethod] = useState<TouchMethod>('Raw Finger');

  // Results
  const [result, setResult] = useState<{ settings: SensitivitySettings, tips: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load local storage
    const savedHistory = localStorage.getItem('ff_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('ff_theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('ff_theme', newMode ? 'dark' : 'light');
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setResult(null);

    // Simulate AI delay
    setTimeout(() => {
      const res = calculateOptimizedSensitivity(
        device, ram, ramUsage, availStorage, playStyle, touchMethod, refreshRate
      );
      
      setResult(res);
      setIsCalculating(false);

      // Add to History
      const newItem: HistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        device: device || 'Unknown Device',
        settings: res.settings
      };
      const newHistory = [newItem, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('ff_history', JSON.stringify(newHistory));
    }, 2000);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setDevice(item.device);
    setResult({ settings: item.settings, tips: "Loaded from history" });
    setShowSidebar(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ff_history');
  };

  const copyResults = () => {
    if (!result) return;
    const s = result.settings;
    const text = `FF ULTRA PRO\nGen:${s.general} RD:${s.redDot} 2x:${s.scope2x} 4x:${s.scope4x} Sn:${s.sniper} FL:${s.freeLook} DPI:${s.dpi} Fire:${s.fireButtonSize}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setResult(null);
    setDevice('');
  };

  // --- TEXT CONSTANTS ---
  const t = {
    en: {
      title: "AI SENSITIVITY PRO",
      sub: "ULTIMATE FRICTION ENGINE",
      dev: "Device Name",
      ram: "Total RAM",
      st: "Total Storage",
      usg: "RAM Usage %",
      free: "Free Storage (GB)",
      sty: "Play Style",
      ref: "Refresh Rate",
      tch: "Touch Method",
      gen: "GENERATE SETTINGS",
      tip: "Pro Tip",
      res: "Optimization Results",
      his: "History",
      clr: "Clear",
      noH: "No Data",
      sett: "Settings",
      lan: "Language"
    },
    si: {
      title: "AI SENSITIVITY PRO",
      sub: "සුපිරි සංවේදීතා එන්ජිම",
      dev: "දුරකථන මාදිලිය",
      ram: "මුළු RAM",
      st: "මුළු Storage",
      usg: "RAM භාවිතය %",
      free: "ඉතිරි Storage (GB)",
      sty: "ක්‍රීඩා විලාසය",
      ref: "Refresh Rate",
      tch: "ස්පර්ශ ක්‍රමය",
      gen: "AI Sensitivity සාදන්න",
      tip: "වැදගත්",
      res: "ප්‍රතිඵල",
      his: "ඉතිහාසය",
      clr: "මකන්න",
      noH: "දත්ත නැත",
      sett: "සකසීම්",
      lan: "භාෂාව"
    }
  }[lang];

  // Theme Classes
  const bg = darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900';
  const card = darkMode ? 'bg-[#0a0a0a] border-neon-pink/30 shadow-[0_0_20px_rgba(255,0,127,0.15)]' : 'bg-white border-gray-300 shadow-xl';
  const input = darkMode ? 'bg-[#151515] border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-black';

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans pb-20 ${bg}`}>
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="text-neon-pink fill-current" size={24} />
          <div>
            <h1 className="font-black text-lg leading-none tracking-wider">ULTRA PRO</h1>
            <p className="text-[10px] opacity-60 tracking-widest">V9.0 ENGINE</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setShowSidebar(true)} className="p-2 rounded-full bg-neon-pink text-white shadow-[0_0_10px_#ff007f] hover:scale-105 transition-transform">
            <Settings size={20} className="animate-spin-slow" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 mt-4">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter mb-1">
            <span className="text-neon-pink drop-shadow-[0_0_10px_#ff007f]">AI</span> SENSITIVITY
          </h2>
          <p className="text-xs font-bold tracking-[0.3em] opacity-50">{t.sub}</p>
        </div>

        {/* Form Card */}
        <div className={`rounded-3xl p-6 border transition-all ${card}`}>
          {!result && !isCalculating ? (
            <form onSubmit={handleCalculate} className="space-y-5 animate-slide-up">
              
              {/* Device Input */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-neon-pink uppercase mb-2">
                  <Smartphone size={14} /> {t.dev}
                </label>
                <input 
                  required
                  value={device}
                  onChange={e => setDevice(e.target.value)}
                  placeholder="e.g. iPhone 11"
                  className={`w-full p-3 rounded-xl border outline-none text-sm font-bold tracking-wide ${input} focus:border-neon-pink transition-colors`}
                />
              </div>

              {/* Hardware Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase mb-2">
                    <Cpu size={12} /> {t.ram} (GB)
                  </label>
                  <select value={ram} onChange={e => setRam(Number(e.target.value))} className={`w-full p-3 rounded-xl border outline-none text-sm ${input}`}>
                    {[2,3,4,6,8,12,16].map(n => <option key={n} value={n}>{n} GB</option>)}
                  </select>
                </div>
                <div>
                   <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase mb-2">
                    <Layers size={12} /> {t.st} (GB)
                  </label>
                  <select value={storage} onChange={e => setStorage(Number(e.target.value))} className={`w-full p-3 rounded-xl border outline-none text-sm ${input}`}>
                    {[32,64,128,256,512].map(n => <option key={n} value={n}>{n} GB</option>)}
                  </select>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase">
                      <Activity size={12} /> {t.usg}
                    </label>
                    <span className="text-neon-pink font-bold text-xs">{ramUsage}%</span>
                  </div>
                  <input type="range" value={ramUsage} onChange={e => setRamUsage(Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-pink" />
                </div>
                <div>
                   <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase mb-2">
                    {t.free}
                  </label>
                  <input type="number" value={availStorage} onChange={e => setAvailStorage(Number(e.target.value))} className={`w-full p-3 rounded-xl border outline-none text-sm font-bold ${input}`} />
                </div>
              </div>

              {/* Factors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                   <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase mb-2"><Gamepad2 size={12}/> {t.sty}</label>
                   <select value={playStyle} onChange={e => setPlayStyle(e.target.value as PlayingStyle)} className={`w-full p-2 rounded-lg border outline-none text-xs ${input}`}>
                     <option>Balanced</option><option>Rush</option><option>One Tap</option><option>Sniper</option>
                   </select>
                </div>
                <div>
                   <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase mb-2"><RotateCw size={12}/> {t.ref}</label>
                   <select value={refreshRate} onChange={e => setRefreshRate(Number(e.target.value) as RefreshRate)} className={`w-full p-2 rounded-lg border outline-none text-xs ${input}`}>
                     <option value={60}>60 Hz</option><option value={90}>90 Hz</option><option value={120}>120 Hz</option><option value={144}>144 Hz</option>
                   </select>
                </div>
                <div>
                   <label className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase mb-2"><Smartphone size={12}/> {t.tch}</label>
                   <select value={touchMethod} onChange={e => setTouchMethod(e.target.value as TouchMethod)} className={`w-full p-2 rounded-lg border outline-none text-xs ${input}`}>
                     <option>Raw Finger</option><option>Finger Sleeve</option><option>Powder</option>
                   </select>
                </div>
              </div>

              {/* Button */}
              <button type="submit" className="w-full py-4 bg-neon-pink text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center gap-2">
                <Zap size={20} fill="currentColor" /> {t.gen}
              </button>

            </form>
          ) : isCalculating ? (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
               <Zap size={48} className="text-neon-pink animate-bounce mb-4" fill="currentColor" />
               <h3 className="text-xl font-black uppercase tracking-widest mb-2">Analyzing...</h3>
               <p className="text-xs opacity-50 font-mono">OPTIMIZING FOR {touchMethod.toUpperCase()}</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                 <h3 className="font-bold text-lg flex items-center gap-2"><Check className="text-green-500" /> {t.res}</h3>
                 <button onClick={copyResults} className="text-xs bg-neon-pink/10 text-neon-pink px-3 py-1 rounded border border-neon-pink/20 font-bold flex items-center gap-1 active:scale-95 transition-transform">
                   {copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? 'COPIED' : 'COPY'}
                 </button>
              </div>

              {result && <SensitivityDisplay settings={result.settings} />}

              <div className="mt-6 p-4 rounded-xl bg-neon-pink/5 border border-neon-pink/20">
                 <h4 className="text-xs font-bold text-neon-pink uppercase mb-1 flex items-center gap-2">
                   <Zap size={12} fill="currentColor"/> {t.tip}
                 </h4>
                 <p className="text-xs opacity-80 leading-relaxed">{result?.tips}</p>
              </div>

              <button onClick={resetForm} className={`w-full mt-6 py-3 border rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-125 transition-all ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-300 bg-gray-100'}`}>
                Calculate Again
              </button>
            </div>
          )}
        </div>

      </main>

      {/* --- SIDEBAR --- */}
      <div className={`fixed inset-y-0 right-0 w-72 z-50 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0 shadow-[-20px_0_50px_rgba(0,0,0,0.7)]' : 'translate-x-full'} ${darkMode ? 'bg-[#0a0a0a] border-l border-white/10' : 'bg-white border-l border-gray-200'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-8">
             <h2 className="font-bold text-lg flex items-center gap-2"><Settings size={18} className="text-neon-pink"/> {t.sett}</h2>
             <button onClick={() => setShowSidebar(false)}><X size={20} className="opacity-50 hover:opacity-100" /></button>
          </div>

          <div className="mb-6">
             <label className="text-xs font-bold opacity-50 uppercase mb-3 block"><Globe size={12} className="inline mr-1"/> {t.lan}</label>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setLang('en')} className={`py-2 text-xs font-bold rounded border ${lang === 'en' ? 'bg-neon-pink text-white border-neon-pink' : 'border-gray-600 opacity-50'}`}>English</button>
                <button onClick={() => setLang('si')} className={`py-2 text-xs font-bold rounded border ${lang === 'si' ? 'bg-neon-pink text-white border-neon-pink' : 'border-gray-600 opacity-50'}`}>සිංහල</button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
             <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold opacity-50 uppercase"><History size={12} className="inline mr-1"/> {t.his}</label>
                {history.length > 0 && <button onClick={clearHistory} className="text-[10px] text-red-500 font-bold flex items-center gap-1"><Trash2 size={10}/> {t.clr}</button>}
             </div>
             <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-8 opacity-20 border border-dashed rounded-lg"><p className="text-xs">{t.noH}</p></div>
                ) : history.map(item => (
                   <div key={item.id} onClick={() => loadHistoryItem(item)} className={`p-3 rounded-lg border cursor-pointer hover:border-neon-pink transition-colors ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-xs truncate max-w-[120px]">{item.device}</span>
                         <ChevronRight size={14} className="opacity-30"/>
                      </div>
                      <div className="text-[10px] opacity-40 mt-1">{item.date}</div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      {showSidebar && <div onClick={() => setShowSidebar(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"></div>}

    </div>
  );
};

export default App;