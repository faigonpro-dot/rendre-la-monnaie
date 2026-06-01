import React, { useState } from "react";
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
  TrendingUp
} from "lucide-react";

// Types definition
interface MoneyItem {
  id: string;
  type: 'coin' | 'bill';
  value: number;
  label: string;
  icon?: string;
}

// Predefined available cash items
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

// --- BANQUE DE DONNÉES POUR LA GÉNÉRATION ALÉATOIRE ---
const CUSTOMERS = [
  { name: "Léa, la fleuriste", avatar: "👩‍🌾", greeting: "Bonjour ! Vos produits ont l'air délicieux. Voici mon règlement." },
  { name: "Lucas, l'étudiant gourmand", avatar: "👨‍🎓", greeting: "Salut ! C'est parfait pour ma pause de midi. Je vous donne ça." },
  { name: "Monsieur Robert, le doyen du quartier", avatar: "👴", greeting: "Bonjour mon jeune ami ! Quel beau temps aujourd'hui. Voici pour vous." },
  { name: "Sonia, la maman organisée", avatar: "👩‍👦", greeting: "Bonsoir ! Courte journée... Je vais régler avec ceci." },
  { name: "Thomas, le sportif", avatar: "🏃‍♂️", greeting: "Bonjour ! Juste de quoi me redonner de l'énergie après ma séance." },
  { name: "Inès, l'architecte", avatar: "👩‍🎨", greeting: "Bonjour ! J'adore votre boutique de centre-ville. Voici mon billet." },
  { name: "Chloé, la community manager", avatar: "👩‍💻", greeting: "Hello ! Hop, un petit panier avant de retourner bosser. Merci !" },
  { name: "Marc, le chef cuistot", avatar: "👨‍🍳", greeting: "Bonjour ! Il me manquait quelques ingrédients de toute urgence. Tenez." }
];

const MARKET_ITEMS = [
  { name: "Formule Midi Express", easyPrice: 8.00, complexPrice: 8.45 },
  { name: "Éclair au chocolat", easyPrice: 2.00, complexPrice: 2.15 },
  { name: "Journal quotidien", easyPrice: 2.00, complexPrice: 1.80 },
  { name: "Miel de lavande local", easyPrice: 6.00, complexPrice: 6.75 },
  { name: "Boîte de tisane bio", easyPrice: 4.00, complexPrice: 4.10 },
  { name: "Bouquet de tulipes", easyPrice: 12.00, complexPrice: 12.50 },
  { name: "Poterie artisanale", easyPrice: 15.00, complexPrice: 15.85 },
  { name: "Boisson isotonique", easyPrice: 3.00, complexPrice: 2.55 },
  { name: "Barre de céréales", easyPrice: 1.00, complexPrice: 1.25 },
  { name: "Café pur arabica", easyPrice: 5.00, complexPrice: 4.99 },
  { name: "Jus de pommes local", easyPrice: 3.00, complexPrice: 3.35 }
];

function getNextLogicalBill(total: number): number {
  if (total <= 5) return 5;
  if (total <= 10) return 10;
  if (total <= 20) return 20;
  return 50;
}

function generateRandomScenario(level: 'easy' | 'medium' | 'hard', index: number): MockInvoice {
  const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
  const shuffledItems = [...MARKET_ITEMS].sort(() => 0.5 - Math.random());
  const itemCount = Math.random() > 0.5 ? 2 : 1;
  const chosenItems = shuffledItems.slice(0, itemCount);

  let totalCents = 0;
  const invoiceItems = chosenItems.map(item => {
    const qty = Math.floor(Math.random() * 2) + 1;
    let rawPrice = level === 'easy' ? item.easyPrice : item.complexPrice;
    
    if (level === 'medium') {
      rawPrice = Math.floor(rawPrice) + (Math.random() > 0.5 ? 0.50 : 0.00);
    }

    const priceCents = Math.round(rawPrice * 100);
    totalCents += priceCents * qty;

    return {
      name: item.name,
      qty: qty,
      price: priceCents / 100
    };
  });

  const total = totalCents / 100;
  const given = getNextLogicalBill(total);
  const toReturn = Math.round((given - total) * 100) / 100;

  return {
    id: `${level}-${index}-${Math.random().toString(36).substr(2, 4)}`,
    customerName: customer.name,
    customerAvatar: customer.avatar,
    items: invoiceItems,
    total: total,
    given: given,
    toReturn: toReturn,
    greetingMessage: customer.greeting
  };
}

const INITIAL_POOL: Record<'easy' | 'medium' | 'hard', MockInvoice[]> = {
  easy: Array.from({ length: 3 }, (_, i) => generateRandomScenario('easy', i)),
  medium: Array.from({ length: 3 }, (_, i) => generateRandomScenario('medium', i)),
  hard: Array.from({ length: 3 }, (_, i) => generateRandomScenario('hard', i))
};

export default function App() {
  const [scenariosPool, setScenariosPool] = useState<Record<'easy' | 'medium' | 'hard', MockInvoice[]>>(INITIAL_POOL);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [maxSolvedScenarioIndex, setMaxSolvedScenarioIndex] = useState<number>(0);
  const [renderedMoney, setRenderedMoney] = useState<{ item: MoneyItem; count: number }[]>([]);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showValidationPopup, setShowValidationPopup] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const activeScenarios = scenariosPool[level];
  const activeScenario = activeScenarios[currentScenarioIndex];

  const handleSetLevel = (newLevel: 'easy' | 'medium' | 'hard') => {
    const freshInvoices = {
      easy: Array.from({ length: 3 }, (_, i) => generateRandomScenario('easy', i)),
      medium: Array.from({ length: 3 }, (_, i) => generateRandomScenario('medium', i)),
      hard: Array.from({ length: 3 }, (_, i) => generateRandomScenario('hard', i))
    };
    setScenariosPool(freshInvoices);
    setLevel(newLevel);
    setCurrentScenarioIndex(0);
    setMaxSolvedScenarioIndex(0);
    handleClearTray();
  };

  const handleSelectScenarioTab = (idx: number) => {
    setScenariosPool(prev => {
      const updated = { ...prev };
      updated[level][idx] = generateRandomScenario(level, idx);
      return updated;
    });
    setCurrentScenarioIndex(idx);
    handleClearTray();
  };

  const currentTotalRendered = renderedMoney.reduce((acc, current) => acc + (current.item.value * current.count), 0);

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
    const expected = activeScenario.toReturn;
    const diff = Math.abs(currentTotalRendered - expected);
    
    if (diff < errorMargin) {
      setIsCorrect(true);
      if (currentScenarioIndex === maxSolvedScenarioIndex) {
        setMaxSolvedScenarioIndex(prev => prev + 1);
      }
    } else {
      setIsCorrect(false);
    }
    setShowValidationPopup(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-2">
                Rendre la Monnaie <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">Maquette Pédagogique UX</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Point de vente virtuel & simulateur de caisse pour vos élèves</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Niveau :
            </span>
            <button 
              onClick={() => handleSetLevel('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === 'easy' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Extraits (Sans Centimes)
            </button>
            <button 
              onClick={() => handleSetLevel('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Moyen (Centimes simples)
            </button>
            <button 
              onClick={() => handleSetLevel('hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === 'hard' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Difficile (Tous cas)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Space: Store View & Tray */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Client & Invoice Panel */}
          <section className="bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4 z-10">
              <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Profils de Clients Disponibles :
              </span>
              <div className="flex gap-2">
                {activeScenarios.map((inv, idx) => (
                  <button 
                    key={inv.id}
                    disabled={idx > maxSolvedScenarioIndex}
                    onClick={() => handleSelectScenarioTab(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentScenarioIndex === idx 
                        ? 'bg-indigo-600 text-white border border-indigo-400' 
                        : idx > maxSolvedScenarioIndex
                        ? 'bg-white/5 text-indigo-200/30 cursor-not-allowed'
                        : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                    }`}
                  >
                    <span>Client {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch z-10 flex-1">
              <div className="md:col-span-7 flex flex-col justify-center relative">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <span className="text-5xl md:text-6xl select-none block">
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
                  <div className="flex gap-1.5">
                    <span className="bg-indigo-600 text-white text-xs px-2.5 py-1 rounded-md font-extrabold shadow-sm">
                      Billet de {activeScenario.given} € 💵
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="bg-white text-slate-900 border border-slate-200 px-5 pt-5 pb-8 shadow-xl max-w-[240px] w-full min-h-[260px] relative jagged-edge flex flex-col justify-between">
                  <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                    <p className="font-heading font-extrabold tracking-tight text-sm uppercase text-slate-800">Épicerie du Centre</p>
                  </div>

                  <div className="space-y-1.5 flex-1">
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
                    <div className="flex justify-between text-xs text-slate-500 pb-1">
                      <span>Montant Donné</span>
                      <span className="font-mono">{activeScenario.given.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cash Register Display */}
          <section className="bg-slate-800 rounded-3xl p-5 border-t-8 border-indigo-600 border-x-2 border-b-2 border-slate-900 shadow-xl">
            <div className="bg-slate-950 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-700 font-mono">
              <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Achat</span>
                <span className="text-2xl font-black text-indigo-300 mt-1 block">{activeScenario.total.toFixed(2)} €</span>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Montant Reçu</span>
                <span className="text-2xl font-black text-amber-300 mt-1 block">{activeScenario.given.toFixed(2)} €</span>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sur le plateau</span>
                <span className="text-2xl font-black text-indigo-200 mt-1 block">{currentTotalRendered.toFixed(2)} €</span>
              </div>
            </div>
          </section>

          {/* The Tray (Plateau de rendu) */}
          <section className="bg-slate-200/80 rounded-3xl p-5 border-2 border-dashed border-slate-300 flex flex-col gap-3 min-h-[160px]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-slate-800">Plateau de Monnaie à Rendre</h3>
              <div className="flex gap-2">
                <button onClick={handleClearTray} disabled={renderedMoney.length === 0} className="px-3 py-1 bg-white text-slate-600 disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-200">
                  <RotateCcw className="w-3.5 h-3.5" /> Vider
                </button>
                <button onClick={handleVerify} disabled={renderedMoney.length === 0} className="px-4 py-1 bg-indigo-600 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Vérifier !
                </button>
              </div>
            </div>

            {renderedMoney.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-400 text-center bg-white/40 rounded-2xl">
                <p className="text-xs font-bold">Le plateau est vide.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center min-h-[90px]">
                {renderedMoney.map(({ item, count }) => (
                  <div key={item.id} onClick={() => handleRemoveMoney(item.id)} className="relative cursor-pointer select-none">
                    {count > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white min-w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow z-10">
                        x{count}
                      </span>
                    )}
                    {item.type === 'bill' ? (
                      <div className="w-20 h-10 rounded-md bg-emerald-100 border border-emerald-400 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center">
                        {item.label}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-400 text-amber-800 font-mono text-xs font-bold flex items-center justify-center">
                        {item.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Space: THE CASH DRAWER (Tiroir-Caisse) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                📂 Tiroir-Caisse
              </h3>
            </div>

            {/* Bills Section */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase mb-3">Billets</h4>
              <div className="grid grid-cols-2 gap-3">
                {BILLS.map(bill => (
                  <button
                    key={bill.id}
                    onClick={() => handleAddMoney(bill)}
                    className="h-12 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-emerald-800 font-mono text-sm font-bold flex items-center justify-center transition-all active:scale-95"
                  >
                    {bill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coins Section - RETAINED ORIGINAL STRICT ROUND FORMAT */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase mb-3">Pièces</h4>
              <div className="grid grid-cols-4 gap-3">
                {COINS.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => handleAddMoney(coin)}
                    className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 hover:border-amber-400 text-amber-800 font-mono text-xs font-bold flex flex-col items-center justify-center transition-all active:scale-95"
                  >
                    <span className="leading-none">{coin.label.split(' ')[0]}</span>
                    <span className="text-[9px] opacity-70">{coin.label.split(' ')[1] || '€'}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Validation Modals */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-3xl p-6 shadow-2xl bg-white border-2 ${isCorrect ? 'border-emerald-500' : 'border-rose-500'}`}>
            <div className="flex flex-col items-center text-center">
              {isCorrect ? (
                <>
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 text-xl">🎉</div>
                  <h3 className="font-heading font-black text-xl text-slate-900">Rendu Parfait !</h3>
                  <p className="text-xs text-slate-600 mt-2">
                    Vous avez rendu exactement la bonne monnaie (<span className="font-bold">{activeScenario.toReturn.toFixed(2)} €</span>).
                  </p>
                  <button
                    onClick={() => {
                      setShowValidationPopup(false);
                      if (currentScenarioIndex < activeScenarios.length - 1) {
                        handleSelectScenarioTab(currentScenarioIndex + 1);
                      } else {
                        handleClearTray();
                      }
                    }}
                    className="w-full mt-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    Client Suivant <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4 text-xl">❌</div>
                  <h3 className="font-heading font-black text-xl text-slate-900">Erreur de Caisse !</h3>
                  <p className="text-xs text-slate-600 mt-2">
                    Vous avez rendu <span className="font-bold">{currentTotalRendered.toFixed(2)} €</span> au lieu de <span className="font-bold">{activeScenario.toReturn.toFixed(2)} €</span>.
                  </p>
                  <div className="flex gap-3 w-full mt-4">
                    <button onClick={() => setShowValidationPopup(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Corriger</button>
                    <button onClick={() => { setShowValidationPopup(false); handleClearTray(); }} className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl">Recommencer</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
