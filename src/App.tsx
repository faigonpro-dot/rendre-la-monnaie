import React, { useState, useEffect } from "react";
import { 
  Store, 
  Coins, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  ShoppingBag, 
  ChevronRight, 
  Info,
  Sparkles,
  Users,
  Settings,
  X,
  Plus,
  Play,
  Heart,
  MessageCircle,
  TrendingUp,
  RefreshCw
} from "lucide-react";

// Types definition for our interactive mockup
interface MoneyItem {
  id: string;
  type: 'coin' | 'bill';
  value: number; // in Euros
  label: string;
  icon?: string;
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
  toReturn: number;
  greetingMessage: string;
}

// --- GÉNÉRATEUR ALÉATOIRE PÉDAGOGIQUE ---
const PRENOMS = ["Thomas", "Sophie", "Lucas", "Chloé", "Chantal", "Maxime", "Emma", "Antoine", "Inès", "M. Robert", "Sonia", "Julie"];
const AVATARS = ["👨‍💼", "👩‍⚕️", "👨‍🎓", "👩‍🎨", "👵", "👨‍💻", "👩‍🌾", "👴", "👩‍👦", "🏃‍♂️"];
const COMMERCES = [
  { magasin: "Épicerie du Centre", items: [{ name: "Panier de fruits bio", price: 4.50 }, { name: "Bouteille de jus", price: 2.10 }, { name: "Paquet de gâteaux", price: 3.20 }] },
  { magasin: "Boulangerie Saveurs", items: [{ name: "Baguette de tradition", price: 1.20 }, { name: "Formule Sandwich", price: 7.50 }, { name: "Éclair au chocolat", price: 2.30 }] },
  { magasin: "Papeterie du Lycée", items: [{ name: "Grand carnet de notes", price: 5.40 }, { name: "Trousse scolaire", price: 6.10 }, { name: "Stylo plume plume", price: 3.80 }] }
];

function genererExerciceAleatoire(niveau: 'easy' | 'medium' | 'hard'): MockInvoice {
  const prenom = PRENOMS[Math.floor(Math.random() * PRENOMS.length)];
  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const commerce = COMMERCES[Math.floor(Math.random() * COMMERCES.length)];
  
  // Choisir 1 à 2 articles au hasard
  const nbArticles = Math.floor(Math.random() * 2) + 1;
  const itemsSelectionnes: { name: string; qty: number; price: number }[] = [];
  let total = 0;

  for (let i = 0; i < nbArticles; i++) {
    const itemTemplate = commerce.items[Math.floor(Math.random() * commerce.items.length)];
    const qty = Math.floor(Math.random() * 2) + 1;
    
    let price = itemTemplate.price;
    if (niveau === 'easy') price = Math.floor(price); // Prix ronds
    if (niveau === 'medium') price = Math.floor(price) + (Math.random() > 0.5 ? 0.50 : 0); // ,50 ou ,00
    
    itemsSelectionnes.push({ name: itemTemplate.name, qty, price });
    total += price * qty;
  }

  total = Number(total.toFixed(2));

  // Déterminer l'argent donné par le client
  let given = 50;
  const optionsBillets = [5, 10, 20, 50, 100];
  given = optionsBillets.find(b => b > total) || 50;

  // Niveau difficile : parfois le client donne des centimes pour faciliter le rendu
  if (niveau === 'hard' && Math.random() > 0.6) {
    const centimes = Number((total % 1).toFixed(2));
    if (centimes > 0) {
      given = given + centimes;
    }
  }

  given = Number(given.toFixed(2));
  const toReturn = Number((given - total).toFixed(2));

  return {
    id: Math.random().toString(),
    customerName: prenom,
    customerAvatar: avatar,
    items: itemsSelectionnes,
    total: total,
    given: given,
    toReturn: toReturn,
    greetingMessage: `Bonjour ! Je viens faire quelques achats. Voici un montant de ${given} €.`
  };
}

export default function App() {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  // On gère maintenant un exercice unique généré à la volée
  const [activeScenario, setActiveScenario] = useState<MockInvoice>(() => genererExerciceAleatoire('easy'));
  const [renderedMoney, setRenderedMoney] = useState<{ item: MoneyItem; count: number }[]>([]);
  const [score, setScore] = useState<number>(0); // Compteur de réussite pour motiver les élèves

  // Générer un nouvel exercice au changement de niveau
  const handleSetLevel = (newLevel: 'easy' | 'medium' | 'hard') => {
    setLevel(newLevel);
    setActiveScenario(genererExerciceAleatoire(newLevel));
    handleClearTray();
  };

  // Bouton exercice suivant
  const handleNextExercise = () => {
    setActiveScenario(genererExerciceAleatoire(level));
    handleClearTray();
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
  };

  const handleVerify = () => {
    const errorMargin = 0.001;
    const expected = activeScenario.toReturn;
    const diff = Math.abs(currentTotalRendered - expected);
    
    if (diff < errorMargin) {
      alert(`🎉 Bravo ! Le rendu de monnaie est parfait (${expected.toFixed(2)} €).`);
      setScore(prev => prev + 1);
      handleNextExercise(); // Passe automatiquement au client suivant
    } else {
      alert(`❌ Erreur. Tu as rendu ${currentTotalRendered.toFixed(2)} € au lieu de ${expected.toFixed(2)} €. Essaie encore !`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased">
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-200">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-2">
                Rendre la Monnaie <span className="bg-indigo-100 text-indigo-700 font-sans text-xs px-2.5 py-1 rounded-full font-bold">Mode Infini Actif</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Exercices aléatoires pour vos classes de CAP et Bac Pro</p>
            </div>
          </div>

          {/* Niveau + Affichage du Score */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200">
              🏆 Clients servis : {score}
            </div>
            <button 
              onClick={() => handleSetLevel('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${level === 'easy' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🟢 Facile
            </button>
            <button 
              onClick={() => handleSetLevel('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${level === 'medium' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🟡 Moyen
            </button>
            <button 
              onClick={() => handleSetLevel('hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${level === 'hard' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🔴 Difficile
            </button>
          </div>

        </div>
      </header>

      {/* Main interactive area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Immersive Shop */}
          <section className="bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4 z-10">
              <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Exercice d'entraînement commercial :
              </span>
              <button 
                onClick={handleNextExercise}
                className="bg-white/10 text-white hover:bg-white/20 px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" /> Changer de client
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch z-10 flex-1">
              
              {/* Customer Column */}
              <div className="md:col-span-7 flex flex-col justify-center relative">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <span className="text-5xl md:text-6xl select-none block filter drop-shadow">
                      {activeScenario.customerAvatar}
                    </span>
                  </div>

                  <div className="flex-1 bg-white text-slate-800 rounded-2xl p-4 shadow-lg border-2 border-indigo-100 relative max-w-[340px]">
                    <div className="absolute top-4 -left-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-white border-b-[8px] border-b-transparent"></div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {activeScenario.customerName}
                    </p>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed italic text-slate-700">
                      "{activeScenario.greetingMessage}"
                    </p>
                  </div>
                </div>

                <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-fit">
                  <span className="text-xs font-bold text-slate-300">Donné par le client :</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-md font-extrabold border-l-4 border-amber-500 shadow-sm">
                    {activeScenario.given.toFixed(2)} € 💵
                  </span>
                </div>
              </div>

              {/* Receipt Column */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="bg-white text-slate-900 border border-slate-200 px-5 pt-5 pb-8 shadow-xl max-w-[240px] w-full min-h-[260px] relative flex flex-col justify-between transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                    <p className="font-heading font-extrabold tracking-tight text-sm uppercase text-slate-800">Caisse Enregistreuse</p>
                  </div>

                  <div className="space-y-1.5 flex-1 select-none">
                    {activeScenario.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>{it.qty}x {it.name}</span>
                        <span className="font-mono">{(it.price * it.qty).toFixed(2)} €</span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-slate-200 my-2 pt-2"></div>
                  </div>

                  <div className="space-y-1 mt-auto">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>Total des achats</span>
                      <span className="font-mono text-sm bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-700">
                        {activeScenario.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Electronics Cash Register Display */}
          <section className="bg-slate-800 rounded-3xl p-5 border-t-8 border-indigo-600 border-x-2 border-b-2 border-slate-900 shadow-xl">
            <div className="bg-slate-950 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-700 font-mono">
              <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Achat</span>
                <span className="text-2xl font-black text-indigo-300 mt-1">{activeScenario.total.toFixed(2)} €</span>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant Reçu</span>
                <span className="text-2xl font-black text-amber-300 mt-1">{activeScenario.given.toFixed(2)} €</span>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sur le Plateau</span>
                <span className="text-2xl font-black text-indigo-200 mt-1">{currentTotalRendered.toFixed(2)} €</span>
              </div>
            </div>
          </section>

          {/* Section 3: Platform Tray */}
          <section className="bg-slate-200/80 rounded-3xl p-5 border-2 border-dashed border-slate-300 flex flex-col gap-3 min-h-[160px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-red-500 text-white p-1.5 rounded-lg text-xs font-bold">Plateau</div>
                <h3 className="font-heading font-extrabold text-sm text-slate-800">Monnaie à rendre</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearTray}
                  disabled={renderedMoney.length === 0}
                  className="px-3 py-1 bg-white text-slate-600 disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  Vider
                </button>
                <button
                  onClick={handleVerify}
                  disabled={renderedMoney.length === 0}
                  className="px-4 py-1 bg-indigo-600 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Vérifier !
                </button>
              </div>
            </div>

            {renderedMoney.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-400 border-2 border-dashed border-slate-300/60 rounded-2xl bg-white/40">
                <p className="text-xs font-bold">Le plateau est vide.</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-start min-h-[90px]">
                {renderedMoney.map(({ item, count }) => (
                  <div key={item.id} onClick={() => handleRemoveMoney(item.id)} className="relative cursor-pointer select-none">
                    {count > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white min-w-6 h-6 text-xs font-black rounded-full flex items-center justify-center border-2 border-white shadow z-10">
                        x{count}
                      </span>
                    )}
                    {item.type === 'bill' ? (
                      <div className={`w-24 h-12 rounded-lg border-2 p-1.5 font-mono text-xs font-black shadow-md flex flex-col justify-between ${item.value === 50 ? 'bg-orange-100 border-orange-400' : item.value === 20 ? 'bg-sky-100 border-sky-400' : item.value === 10 ? 'bg-rose-100 border-rose-400' : 'bg-emerald-100 border-emerald-400'}`}>
                        <span>{item.label}</span>
                        <span className="self-end text-lg leading-none">💵</span>
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-full border-2 shadow-md flex items-center justify-center font-heading font-extrabold text-xs ${item.value === 2 ? 'bg-amber-100 border-slate-300' : item.value === 1 ? 'bg-slate-200 border-amber-400' : item.value >= 0.1 ? 'bg-yellow-100 border-yellow-500' : 'bg-orange-100 border-amber-700'}`}>
                        <span>{item.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: The Interactive Cash Register Drawer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-slate-800 rounded-3xl p-5 border-4 border-slate-900 shadow-xl text-white flex flex-col gap-5">
            <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                📂 Le Tiroir-Caisse Virtuel
              </h3>
            </div>

            {/* Billets list */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3">Billets</h4>
              <div className="grid grid-cols-2 gap-3">
                {BILLS.map(bill => (
                  <button
                    key={bill.id}
                    onClick={() => handleAddMoney(bill)}
                    className={`relative h-16 rounded-xl border-2 p-2 font-mono text-left transition-all active:scale-95 text-white cursor-pointer ${bill.value === 50 ? 'bg-orange-600 border-orange-400' : bill.value === 20 ? 'bg-sky-600 border-sky-400' : bill.value === 10 ? 'bg-rose-600 border-rose-400' : 'bg-emerald-600 border-emerald-400'}`}
                  >
                    <span className="text-sm font-black">{bill.label}</span>
                    <div className="flex justify-between items-center w-full mt-2">
                      <span>💵</span>
                      <span className="bg-white/20 rounded-full p-0.5"><Plus className="w-3.5 h-3.5" /></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pièces list */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3">Pièces</h4>
              <div className="grid grid-cols-3 gap-2">
                {COINS.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => handleAddMoney(coin)}
                    className={`h-12 rounded-xl border p-1 text-center font-mono text-xs font-bold transition-all active:scale-95 text-slate-900 cursor-pointer ${coin.value === 2 ? 'bg-amber-100 border-amber-400' : coin.value === 1 ? 'bg-slate-200 border-slate-400' : coin.value >= 0.1 ? 'bg-yellow-100 border-yellow-400' : 'bg-orange-100 border-orange-400'}`}
                  >
                    {coin.label}
                  </button>
                ))}
              </div>
            </div>

          </section>
        </div>

      </main>
    </div>
  );
}
