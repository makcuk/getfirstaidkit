import React, { useState, useMemo } from 'react';
import { MEDICAL_ITEMS } from './data/items';
import { 
  Shield, 
  Users, 
  Calendar, 
  Baby, 
  Stethoscope, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingCart, 
  Copy,
  Plus,
  Minus,
  AlertTriangle
} from 'lucide-react';

const SCENARIOS = [
  { id: 'ifak', name: 'IFAK (Tactical)', icon: '⚡', description: 'Life-saving trauma gear for immediate self-aid or buddy-aid.' },
  { id: 'hike', name: 'Hiking / Backpacking', icon: '🏔️', description: 'Lightweight, essential wound care and trauma.' },
  { id: 'offroad', name: 'Off-Road / Overlanding', icon: '🚜', description: 'Heavy trauma, vehicle-specific tools, and long-term meds.' },
  { id: 'edc', name: 'Everyday Carry (EDC)', icon: '🎒', description: 'Pocketable or bag-friendly essentials for daily life.' },
  { id: 'car', name: 'Vehicle / Commuter', icon: '🚗', description: 'Roadside accidents, minor injuries, and weather prep.' },
  { id: 'home', name: 'Home / Family', icon: '🏠', description: 'Comprehensive kit for kids, illness, and common household injuries.' },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    scenario: '',
    duration: 1,
    groupSize: 1,
    hasKids: false,
    skillLevel: 'basic', // 'basic' or 'advanced'
  });

  const [copySuccess, setCopySuccess] = useState(false);

  const handleScenarioSelect = (id) => {
    setConfig({ ...config, scenario: id });
    setStep(2);
  };

  const filteredItems = useMemo(() => {
    if (!config.scenario) return [];

    return MEDICAL_ITEMS.filter(item => {
      // 1. Scenario Match
      const scenarioMatch = item.scenarios.includes(config.scenario) || item.tags.includes('all');
      
      // 2. Skill Level Check
      const skillMatch = config.skillLevel === 'advanced' || item.minSkill === 'basic';
      
      // 3. Kids Check (Include kids-specific items only if kids are present, or if they are general items)
      const kidsMatch = !item.tags.includes('kids') || config.hasKids;

      return scenarioMatch && skillMatch && kidsMatch;
    });
  }, [config]);

  const calculateQty = (item) => {
    const base = item.baseQty;
    const additional = item.perPerson ? Math.max(0, config.groupSize - 1) : 0;
    // Simple scaling for duration - every 3 days add another base qty if it's consumable
    const durationMultiplier = item.category === 'Meds' || item.category === 'Wound Care' 
      ? Math.ceil(config.duration / 3) 
      : 1;
    
    return (base + additional) * durationMultiplier;
  };

  const copyToClipboard = () => {
    const text = filteredItems.map(item => {
      const qty = calculateQty(item);
      return `${qty}x ${item.name} (${item.category})`;
    }).join('\n');
    
    navigator.clipboard.writeText(`First Aid Kit Manifest - ${SCENARIOS.find(s => s.id === config.scenario)?.name}\n\n${text}`)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-medical-red fill-medical-red/20" />
            First Aid Kit <span className="text-medical-red">Configurator</span>
          </h1>
          <p className="text-slate-400 font-medium">Tactical Gear Manifest Generator v1.0</p>
        </header>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2">
            {['Context', 'Logistics', 'Manifest'].map((label, i) => (
              <span key={label} className={`text-xs font-bold uppercase tracking-widest ${step >= i + 1 ? 'text-medical-orange' : 'text-slate-600'}`}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-medical-orange transition-all duration-500 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Panel 1: Context */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleScenarioSelect(s.id)}
                className={`tactical-card p-6 text-left transition-all hover:border-medical-orange group ${config.scenario === s.id ? 'border-medical-orange bg-slate-800/50' : ''}`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                  <h3 className="text-xl font-bold text-white uppercase italic">{s.name}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Panel 2: Logistics */}
        {step === 2 && (
          <div className="tactical-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Group Size */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                  <Users className="w-4 h-4 text-medical-orange" /> Group Size
                </label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setConfig({...config, groupSize: Math.max(1, config.groupSize - 1)})}
                    className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-black text-white w-8 text-center">{config.groupSize}</span>
                  <button 
                    onClick={() => setConfig({...config, groupSize: config.groupSize + 1})}
                    className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Duration - Only for Hiking and Off-Road */}
              {['hike', 'offroad'].includes(config.scenario) && (
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                    <Calendar className="w-4 h-4 text-medical-orange" /> Duration (Days)
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="14" 
                    value={config.duration} 
                    onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-medical-orange"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>1 DAY</span>
                    <span className="text-medical-orange">{config.duration} DAYS</span>
                    <span>14 DAYS</span>
                  </div>
                </div>
              )}

              {/* Kids Toggle */}
              <button 
                onClick={() => setConfig({...config, hasKids: !config.hasKids})}
                className={`p-4 rounded border flex items-center justify-between transition-all ${config.hasKids ? 'bg-medical-orange/10 border-medical-orange text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <div className="flex items-center gap-3">
                  <Baby className={`w-6 h-6 ${config.hasKids ? 'text-medical-orange' : ''}`} />
                  <span className="font-bold uppercase tracking-tight">Including Kids?</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.hasKids ? 'border-medical-orange bg-medical-orange' : 'border-slate-700'}`}>
                  {config.hasKids && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>

              {/* Skill Level Toggle */}
              <button 
                onClick={() => setConfig({...config, skillLevel: config.skillLevel === 'basic' ? 'advanced' : 'basic'})}
                className={`p-4 rounded border flex items-center justify-between transition-all ${config.skillLevel === 'advanced' ? 'bg-medical-red/10 border-medical-red text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className={`w-6 h-6 ${config.skillLevel === 'advanced' ? 'text-medical-red' : ''}`} />
                  <div className="text-left">
                    <span className="block font-bold uppercase tracking-tight">Skill Level</span>
                    <span className="text-[10px] uppercase opacity-60 font-black">{config.skillLevel === 'advanced' ? 'Trained / Medical' : 'Layperson / Basic'}</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.skillLevel === 'advanced' ? 'border-medical-red bg-medical-red' : 'border-slate-700'}`}>
                  {config.skillLevel === 'advanced' && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>
            </div>

            <div className="flex justify-between gap-4">
              <button onClick={prevStep} className="btn-secondary flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Generate Manifest <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Panel 3: Results */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white uppercase italic">Final Manifest</h2>
                <p className="text-xs text-slate-400 uppercase tracking-tighter">
                  {config.groupSize} People • {config.duration} Days • {SCENARIOS.find(s => s.id === config.scenario)?.name}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copySuccess ? 'Copied!' : 'Copy Manifest'}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex-1 md:flex-none px-4 py-2 bg-medical-orange hover:bg-orange-600 text-white rounded font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Print PDF
                </button>
              </div>
            </div>

            {/* Warning for Advanced Gear */}
            {config.skillLevel === 'advanced' && (
              <div className="bg-medical-red/10 border border-medical-red/30 p-4 rounded flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-medical-red shrink-0 mt-0.5" />
                <p className="text-xs text-red-200/80 leading-relaxed uppercase font-bold tracking-tight">
                  WARNING: This manifest includes advanced medical interventions (e.g., Chest Seals, Tourniquets). 
                  Do not attempt to use these items without formal tactical medicine training.
                </p>
              </div>
            )}

            {/* Categorized List */}
            {['Trauma', 'Meds', 'Wound Care', 'Tools'].map(category => {
              const categoryItems = filteredItems.filter(i => i.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] px-2">{category}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryItems.map(item => (
                      <div key={item.id} className="tactical-card flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 transition-colors border-l-4 border-l-slate-800 group hover:border-l-medical-orange">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-950 rounded flex items-center justify-center font-black text-medical-orange border border-slate-800">
                            {calculateQty(item)}x
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-tight">{item.name}</h4>
                            <div className="flex gap-2 mt-1">
                              {item.isEssential && (
                                <span className="text-[8px] bg-medical-red/20 text-medical-red px-1.5 py-0.5 rounded font-black uppercase">Essential</span>
                              )}
                              {item.minSkill === 'advanced' && (
                                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">Advanced</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <a 
                          href={item.amazonLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-slate-500 hover:text-medical-orange transition-colors"
                          title="View on Amazon"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <button 
              onClick={() => setStep(1)} 
              className="w-full py-4 text-slate-500 hover:text-slate-300 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              ← Restart Configurator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
