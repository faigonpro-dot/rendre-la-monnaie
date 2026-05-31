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
const PRENOMS = ["Léa, la fleuriste", "Lucas, l'étudiant gourmand", "Monsieur Robert, le doyen du quartier", "Thomas, le sportif", "Inès, l'architecte", "Sonia, la maman organisée", "Julie, l'étudiante", "Sophie, la voisine"];
const AVATARS = ["👩‍🌾", "👨‍🎓", "👴", "🏃‍♂️", "👩‍🎨", "👩‍👦", "👩‍🎓", "👩‍⚕️"];
const ARTICLES_BANQUE = [
  { name: "Bouquet de tulipes", price: 6.00 },
  { name: "Poterie artisanale", price: 15.00 },
  { name: "Formule Midi (Sandwich + Boisson)", price: 8.50 },
  { name: "Éclair au chocolat", price: 2.00 },
  { name: "Journal quotidien", price: 1.80 },
  { name: "Miel de lavande", price: 6.75 },
  { name: "Boîte de tisane bio", price: 4.10 },
  { name: "Barres de céréales", price: 1.50 },
  { name: "Boisson isotonique", price: 2.50 },
  { name: "Grand carnet de croquis", price: 13.20 },
  { name: "Gomme mie de pain", price: 1.80 },
  { name: "Paquet de couches bio", price: 16.49 },
  { name: "Lingettes écologiques", price: 2.10 }
];

function genererExerciceAleatoire(niveau: 'easy' | 'medium' | 'hard'): MockInvoice {
  const indexClient = Math.floor(Math.random() * PRENOMS.length);
  const customerName = PRENOMS[indexClient];
  const customerAvatar = AVATARS[indexClient];
  
  const nbArticles = Math.floor(Math.random() * 2) + 1; // 1 ou 2 articles distincts
  const items: { name: string; qty: number; price: number }[] = [];
  let total = 0;

  for (let i = 0; i < nbArticles; i++) {
    const articleTemplate = ARTICLES_BANQUE[Math.floor(Math.random() * ARTICLES_BANQUE.length)];
    const qty = Math.floor(Math.random() * 2) + 1; // Quantité de 1 à 2
    
    let price = articleTemplate.price;
    if (niveau === 'easy') {
      price = Math.floor(price) || 2.00; // Uniquement des prix ronds
    } else if (niveau === 'medium') {
      price = Math.floor(price) + (Math.random() > 0.5 ? 0.50 : 0.00); // Se termine par ,00 ou ,50
    }
    
    items.push({ name: articleTemplate.name, qty, price });
    total += price * qty;
  }

  total = Number(total.toFixed(2));

  // Choix cohérent du montant donné par le client
  let given = 10;
  if (total >= 50) given = 100;
  else if (total >= 30) given = 50;
  else if (total >= 20) given = 30; // ex: 20€ + 10€
  else if (total >= 15) given = 20;
  else if (total >= 10) given = 15; // ex: 10€ + 5€
  else given = 10;

  // Optionnel sur le niveau difficile : rajouter des centimes complexes donnés pour faciliter le rendu
  if (niveau === 'hard' && Math.random() > 0.6) {
    const centimes = Number((total % 1).toFixed(2));
    if (centimes > 0 && given + centimes <= 100) {
      given = Number((given + centimes).toFixed(2));
    }
  }

  const toReturn = Number((given - total).toFixed(2));

  return {
    id: Math.random().toString(),
    customerName,
    customerAvatar,
    items,
    total,
    given,
    toReturn,
    greetingMessage: `Bonjour ! J'ai choisi ces quelques articles. Voici mon règlement.`
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
    const expected = activeScenario.toReturn;
    const diff = Math.abs(currentTotalRendered - expected);
    
    if (diff < errorMargin) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }
    setShowValidationPopup(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-200">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-2">
                Rendre la Monnaie <span className="bg-indigo-100 text-indigo-700 font-sans text-xs px-2.5 py-1 rounded-full font-bold">Générateur Infini</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Point de vente virtuel & simulateur de caisse pour vos élèves</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200 mr-2">
              🏆 Servis : {score}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Prof :
            </span>
            <button 
              onClick={() => handleSetLevel('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === 'easy' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🟢 Facile (Sans Centimes)
            </button>
            <button 
              onClick={() => handleSetLevel('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === 'medium' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🟡 Moyen (Centimes simples)
            </button>
            <button 
              onClick={() => handleSetLevel('hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === 'hard' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🔴 Difficile (Tous cas)
            </button>
          </div>

        </div>
      </header>

      {/* Main
