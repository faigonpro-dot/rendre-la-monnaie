import React, { useState } from "react";
import { 
  Store, 
  Coins, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  Settings,
  X,
  Plus,
  MessageCircle,
  RefreshCw,
  HelpCircle,
  BookOpen,
  TrendingUp,
  Award
} from "lucide-react";

// Types definition for our interactive mockup
interface MoneyItem {
  id: string;
  type: 'coin' | 'bill';
  value: number; // in Euros
  label: string;
}

// Predefined available cash items in our cash register
const BILLS: MoneyItem[] = [
  { id: "b50", type: "bill", value: 50.0, label: "50 €" },
  { id: "b20", type: "bill", value: 20.0, label: "20 €" },
  { id: "b10", type: "bill", value: 10.0, label: "10 €" },
  { id: "b5", type: "bill", value: 5.0, label: "5 €" },
];

const COINS: MoneyItem[] = [
  { id: "c2", type: "coin", value: 2.0, label: "2 €" },
  { id: "c1", type: "coin", value: 1.0, label: "1 €" },
  { id: "c50", type: "coin", value: 0.5, label: "50 c" },
  { id: "c20", type: "coin", value: 0.2, label: "20 c" },
  { id: "c10", type: "coin", value: 0.1, label: "10 c" },
  { id: "c5", type: "coin", value: 0.05, label: "5 c" },
  { id: "c2", type: "coin", value: 0.02, label: "2 c" },
  { id: "c1", type: "coin", value: 0.01, label: "1 c" },
];

interface MockInvoice {
  id: string;
  customerName: string;
  customerAvatar: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  given: number;
  givenLabel: string;
  toReturn: number;
  greetingMessage: string;
}

// --- GÉNÉRATEUR ALÉATOIRE D'EXERCICES COMPATIBLE BANQUE DE DONNÉES ---
const CLIENTS_POOL = [
  { name: "LÉA, LA FLEURISTE", avatar: "👩‍🌾", hello: "Bonjour ! Vos tulipes sont magnifiques. Voici mon règlement." },
  { name: "LUCAS, L'ÉTUDIANT", avatar: "👨‍🎓", hello: "Salut ! Je prends juste de quoi grignoter pour midi, s'il vous plaît." },
  { name: "M. ROBERT, LE VOISIN", avatar: "👴", hello: "Bonjour mon enfant. Je viens chercher mes commissions habituelles." },
  { name: "THOMAS, LE SPORTIF", avatar: "🏃‍♂️", hello: "Hello ! Une grosse journée d'entraînement m'attend, voici pour les barres." },
  { name: "INÈS, L'ARCHITECTE", avatar: "👩‍🎨", hello: "Bonjour ! Je passe rapidement entre deux réunions de chantier." },
  { name: "SONIA, LA MAMAN", avatar: "👩‍👦", hello: "Bonjour, les enfants ont choisi quelques douceurs. Voici mon billet." }
];

const ARTICLES_POOL = [
  { name: "Bouquet de tulipes", price: 6.00 },
  { name: "Poterie artisanale", price: 15.00 },
  { name: "Formule Midi Sandwich", price: 8.50 },
  { name: "Éclair au chocolat", price: 2.00 },
  { name: "Journal quotidien", price: 1.80 },
  { name: "Miel de lavande", price: 6.70 },
  { name: "Boîte de tisane bio", price: 4.10 },
  { name: "Barres de céréales", price: 1.50 },
  { name: "Boisson énergisante", price: 2.50 }
];

function genererExerciceAleatoire(niveau: 'easy' | 'medium' | 'hard'): MockInvoice {
  const client = CLIENTS_POOL[Math.floor(Math.random() * CLIENTS_POOL.length)];
  const nbArticles = Math.floor(Math.random() * 2) + 1; // 1 à 2 articles distincts
  const items: { name: string; qty: number; price: number }[] = [];
  let total = 0;

  for (let i = 0; i < nbArticles; i++) {
    const art = ARTICLES_POOL[Math.floor(Math.random() * ARTICLES_POOL.length)];
    const qty = Math.floor(Math.random() * 2) + 1;
    
    let price = art.price;
    if (niveau === 'easy') {
      price = Math.floor(price) || 2.00; // Uniquement des prix ronds
    } else if (niveau === 'medium') {
      price = Math.floor(price) + (Math.random() > 0.5 ? 0.50 : 0.00); // Terminaisons en ,00 ou ,50
    }
    
    // Éviter les doublons de noms d'articles dans le même ticket
    if (!items.find(x => x.name === art.name)) {
      items.push({ name: art.name, qty, price });
      total += price * qty;
    }
  }

  // Sécurité si aucun article ajouté par hasard de doublon complet
  if (items.length === 0) {
    items.push({ name: "Articles Épicerie", qty: 1, price: 10.00 });
    total = 10.00;
  }

  total = Number(total.toFixed(2));

  // Choix du moyen de paiement logique en fonction du total
  let given = 50;
  let givenLabel = "Billet de 50 €";

  if (total >= 50) {
    given = 100;
    givenLabel = "2 Billets de 50 €";
  } else if (total >= 20) {
    given = 50;
    givenLabel = "Billet de 50 €";
  } else if (total >= 10) {
    const r = Math.random();
    if (r < 0.5) {
      given = 20;
      givenLabel = "Billet de 20 €";
    } else {
      given = 50;
      givenLabel = "Billet de 50 €";
    }
  } else {
    const r = Math.random();
    if (r < 0.4) {
      given = 10;
      givenLabel = "Billet de 10 €";
    } else if (r < 0.7) {
      given = 20;
      givenLabel = "Billet de 20 €";
    } else {
      given = 50;
      givenLabel = "Billet de 50 €";
    }
  }

  // Niveau difficile : Ajout de pièces ou centimes par le client pour aider au rendu
  if (niveau === 'hard' && total % 1 !== 0) {
    const centimes = Number((total % 1).toFixed(2));
    if (Math.random() > 0.5) {
      given = Number((given + centimes).toFixed(2));
      givenLabel = `${givenLabel} + ${centimes * 100}c`;
    }
  }

  const toReturn = Number((given - total).toFixed(2));

  return {
    id: Math.random().toString(),
    customerName: client.name,
    customerAvatar: client.avatar,
    items,
    total,
    given,
    givenLabel,
    toReturn,
    greetingMessage: client.hello
  };
}

export default function App() {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [activeScenario, setActiveScenario] = useState<MockInvoice>(() => genererExerciceAleatoire('easy'));
  const [renderedMoney, setRenderedMoney] = useState<{ item: MoneyItem; count: number }[]>([]);
  const [showValidationPopup, setShowValidationPopup] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleSetLevel = (newLevel: 'easy' | 'medium' | 'hard') => {
    setLevel(newLevel);
    setActiveScenario(genererExerciceAleatoire(newLevel));
    handleClearTray();
  };

  const handleNextExercise = () => {
    setActiveScenario(genererExerciceAleatoire(level));
    handleClearTray();
    setShowValidationPopup(false);
  };

  const currentTotalRendered = renderedMoney.reduce((acc, current) => {
    return acc + (current.item.value * current.count);
  }, 0);

  const handleAddMoney = (item: MoneyItem) => {
    setRenderedMoney(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, count: p.count + 1 } : p);
      } else {
        return [...prev, { item, count: 1 }];
      }
    });
  };

  const handleRemoveMoney = (itemId: string) => {
    setRenderedMoney(prev => {
      const existing = prev.find(p => p.item.id === itemId);
      if (!existing) return prev;
      if (existing.count <= 1) {
        return prev.filter(p => p.item.id !== itemId);
      } else {
        return prev.map(p => p.item.id === itemId ? { ...p, count: p.count - 1 } : p);
      }
    });
  };

  const handleClearTray = () => {
    setRenderedMoney([]);
    setIsCorrect(null);
  };

  const handleVerify = () => {
    const errorMargin = 0.001;
    const diff = Math.abs(currentTotalRendered - activeScenario.toReturn);
    
    if (diff < errorMargin) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }
    setShowValidationPopup(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-800 flex flex-col antialiased pb-12">
      
      {/* HEADER EXACT */}
      <header className="bg-white max-w-[1400px] w-full mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4f46e5] rounded-xl text-white shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
              Rendre la Monnaie <span className="bg-[#eef2ff] text-[#4f46e5] text-xs px-2.5 py-1 rounded-md font-bold">Maquette Pédagogique UX</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">Point de vente virtuel & simulateur de caisse pour vos élèves</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" /> Prof :
          </span>
          <button 
            onClick={() => handleSetLevel('easy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              level === 'easy' ? 'bg-[#10b981] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🟢 Facile (Sans Centimes)
          </button>
          <button 
            onClick={() => handleSetLevel('medium')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              level === 'medium' ? 'bg-[#f59e0b] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🟡 Moyen (Centimes simples)
          </button>
          <button 
            onClick={() => handleSetLevel('hard')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              level === 'hard' ? 'bg-[#ef4444] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔴 Difficile (Tous cas)
          </button>
        </div>
      </header>

      {/* DISPOSITION INTERFACE IDENTIQUE */}
      <main className="max-w-[1400px] w-full mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLONNE GAUCHE (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* BLOC 1 : PROFILS DE CLIENTS DISPONIBLES */}
          <section className="bg-[#1e1b4b] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col min-h-[320px]">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                👥 Profils de clients disponibles :
              </span>
              <div className="flex gap-1">
                <span className="px-3 py-1 bg-[#4f46e5] text-white text-xs font-bold rounded-lg shadow-sm">Client 1</span>
                <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded-lg opacity-40">Client 2 🔒</span>
                <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded-lg opacity-40">Client 3 🔒</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
              
              {/* Bulle de dialogue et avatar */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-5xl select-none filter drop-shadow">{activeScenario.customerAvatar}</span>
                    <span className="bg-[#10b981] text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md text-white mt-1">
                      Client
                    </span>
                  </div>

                  <div className="flex-1 bg-white text-slate-800 rounded-2xl p-4 shadow-lg relative">
                    <div className="absolute top-5 -left-2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[10px] border-r-white border-b-[6px] border-b-transparent"></div>
                    <p className="text-xs font-bold text-[#4f46e5] uppercase tracking-wide mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {activeScenario.customerName}
                    </p>
                    <p className="text-sm font-medium leading-relaxed italic text-gray-700">
                      "{activeScenario.greetingMessage}"
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Donné par le client :</span>
                  <span className="bg-[#fef3c7] text-[#92400e] text-xs px-3 py-1.5 rounded-lg font-extrabold border border-[#f59e0b] shadow-sm">
                    {activeScenario.givenLabel} 💵
                  </span>
                </div>
              </div>

              {/* Ticket de caisse physique d'origine */}
              <div className="md:col-span-5 flex justify-center">
                <div className="bg-white text-slate-900 border border-gray-200 p-5 shadow-xl w-[220px] relative rounded-sm font-mono text-xs">
                  <div className="text-center border-b border-dashed border-gray-300 pb-2 mb-3">
                    <p className="font-bold uppercase text-xs tracking-tight">Épicerie du Centre</p>
                    <p className="text-[9px] text-gray-400">TÉL: 05 55 12 34 56</p>
                  </div>

                  <div className="space-y-1 min-h-[80px]">
                    {activeScenario.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-[11px] text-gray-600">
                        <span>{it.qty}x {it.name}</span>
                        <span>{(it.price * it.qty).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-gray-300 my-2 pt-2 space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>Total des achats</span>
                      <span className="bg-[#eef2ff] px-1.5 py-0.5 rounded text-[#4f46e5] text-xs">
                        {activeScenario.total.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Montant Donné</span>
                      <span>{activeScenario.given.toFixed(2)} €</span>
                    </div>
                  </div>
                  
                  {/* Effet dentelé bas du ticket d'origine */}
                  <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-gradient-to-t from-transparent to-white bg-[length:6px_6px] repeat-x" style={{ backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #f3f4f6 33.333%, #f3f4f6 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #f3f4f6 33.333%, #f3f4f6 66.667%, transparent 66.667%)' }}></div>
                </div>
              </div>

            </div>
          </section>

          {/* BLOC 2 : ÉCRAN DE CAISSE ENREGISTREUSE */}
          <section className="bg-[#1e293b] rounded-3xl p-5 border-b-4 border-slate-950 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4f46e5]"></span> Écran de Caisse Enregistreuse
            </h3>
            <div className="bg-[#0f172a] rounded-xl p-4 grid grid-cols-3 gap-4 border border-slate-800 font-mono text-center">
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40">
                <span className="text-[10px] text-gray-500 uppercase font-sans font-bold block">Total Achat</span>
                <span className="text-xl font-bold text-[#818cf8] mt-0.5 block">{activeScenario.total.toFixed(2)} €</span>
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40">
                <span className="text-[10px] text-gray-500 uppercase font-sans font-bold block">Montant Reçu</span>
                <span className="text-xl font-bold text-[#f59e0b] mt-0.5 block">{activeScenario.given.toFixed(2)} €</span>
              </div>
              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40">
                <span className="text-[10px] text-gray-500 uppercase font-sans font-bold block">Somme Déposée (Plateau)</span>
                <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{currentTotalRendered.toFixed(2)} €</span>
              </div>
            </div>
          </section>

          {/* BLOC 3 : PLATEAU DE MONNAIE À RENDRE */}
          <section className="bg-[#e5e7eb]/60 rounded-3xl p-5 border-2 border-dashed border-gray-300 flex flex-col gap-4 min-h-[180px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#ef4444] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">Plateau</span>
                <h3 className="font-bold text-sm text-slate-800">Plateau de Monnaie à Rendre</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearTray}
                  disabled={renderedMoney.length === 0}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Vider le plateau
                </button>
                <button
                  onClick={handleVerify}
                  disabled={renderedMoney.length === 0}
                  className="px-4 py-1.5 bg-[#4f46e5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-md shadow-indigo-100"
                >
                  <Check className="w-3.5 h-3.5" /> Vérifier le rendu !
                </button>
              </div>
            </div>

            {renderedMoney.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-gray-400 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                <Coins className="w-8 h-8 text-gray-300 mb-1" />
                <p className="text-xs font-bold text-gray-500">Le plateau est vide.</p>
                <p className="text-[11px] text-gray-400 max-w-[400px] mt-0.5">Cliquez sur les pièces et billets du tiroir-caisse ci-contre pour composer la monnaie à rendre.</p>
              </div>
            ) : (
              <div className="bg-white/80 border border-gray-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center min-h-[90px]">
                {renderedMoney.map(({ item, count }) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleRemoveMoney(item.id)}
                    className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    title="Cliquez pour retirer"
                  >
                    {count > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#4f46e5] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                        {count}
                      </span>
                    )}

                    {item.type === 'bill' ? (
                      <div className={`w-20 h-10 rounded-lg border relative flex flex-col justify-between p-1.5 font-mono text-[10px] font-bold
                        ${item.value === 50 ? 'bg-[#ffedd5] border-[#f97316] text-[#7c2d12]' : ''}
                        ${item.value === 20 ? 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0c4a6e]' : ''}
                        ${item.value === 10 ? 'bg-[#ffe4e6] border-[#f43f5e] text-[#4c0519]' : ''}
                        ${item.value === 5 ? 'bg-[#dcfce7] border-[#22c55e] text-[#052e16]' : ''}
                      `}>
                        <span>{item.label}</span>
                        <span className="self-end text-sm">💵</span>
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center text-[10px] font-bold relative
                        ${item.value === 2 ? 'bg-[#fef3c7] border-gray-300 ring-2 ring-[#f59e0b] ring-inset text-slate-800' : ''}
                        ${item.value === 1 ? 'bg-gray-100 border-[#f59e0b] ring-2 ring-gray-300 ring-inset text-slate-800' : ''}
                        ${item.value === 0.5 || item.value === 0.2 || item.value === 0.1 ? 'bg-[#fef9c3] border-[#eab308] text-yellow-900' : ''}
                        ${item.value <= 0.05 ? 'bg-[#ffedd5] border-[#c2410c] text-orange-900' : ''}
                      `}>
                        <div className="absolute inset-0.5 rounded-full border border-dashed border-black/5"></div>
                        <span>{item.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* COLONNE DROITE (4/12) : TIROIR CAISSE + OBJECTIFS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* SECTION : LE TIROIR-CAISSE VIRTUEL */}
          <section className="bg-[#1e293b] rounded-3xl p-5 shadow-xl text-white flex flex-col gap-5">
            <div className="border-b border-slate-700 pb-2.5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                📂 Le Tiroir-Caisse Virtuel
              </h3>
              <span className="bg-slate-800 text-[#f59e0b] font-mono text-[9px] font-bold px
