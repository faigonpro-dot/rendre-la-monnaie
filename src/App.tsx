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

// Mock tickets for the classroom preview
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

const CUSTOMERS = [
  { name: "Léa, la fleuriste", avatar: "👩‍🌾", greeting: "Bonjour ! Vos produits ont l'air délicieux. Voici mon règlement." },
  { name: "Lucas, l'étudiant gourmand", avatar: "👨‍🎓", greeting: "Salut ! C'est parfait pour ma pause de midi. Je vous donne ça." },
  { name: "Monsieur Robert, le doyen du quartier", avatar: "👴", greeting: "Bonjour mon jeune ami ! Quel beau temps aujourd'hui. Voici pour vous." },
  { name: "Sonia, la maman organisée", avatar: "👩‍👦", greeting: "Bonsoir ! Courte journée... Je vais régler avec ceci." },
  { name: "Thomas, le sportif", avatar: "🏃‍♂️", greeting: "Bonjour ! Juste de quoi me redonner de l'énergie après ma séance." },
  { name: "Inès, l'architecte", avatar: "👩‍🎨", greeting: "Bonjour ! J'adore votre boutique de centre-ville. Voici mon billet." },
  { name: "Chloé, la community manager", avatar: "👩‍💻", greeting: "Hello ! Hop, un petit panier avant de retourner bosser. Merci !" },
  { name: "Marc, le chef cuistot", avatar: "👨‍🍳", greeting: "Bonjour ! Il me manquait quelques ingrédients de toute urgence. Tenez." },
  { name: "Amandine, l'adepte du bio", avatar: "👩‍🌾", greeting: "Bonjour, j'ai trouvé tout ce qu'il me fallait. Voici ma monnaie." },
  { name: "Julien, l'informaticien", avatar: "👨‍💻", greeting: "Hello, je prends ça rapidement entre deux réunions. Tenez !" },
  { name: "Camille, la navetteuse TGV", avatar: "👩‍💼", greeting: "Bonjour ! Vite, mon train part bientôt. Je règle avec ce billet." },
  { name: "Maxime, l'artisan maçon", avatar: "👨‍🔧", greeting: "Salut ! Petite pause sur le chantier. Voici pour les achats." },
  { name: "Mme Sophie, l'institutrice", avatar: "👩‍🏫", greeting: "Bonjour, les enfants adorent ces petits biscuits. Voici pour vous." },
  { name: "Antoine, le jeune papa", avatar: "👨‍🍼", greeting: "Bonjour, fin de course pour la maison ! Je vous laisse faire l'appoint avec ça." },
  { name: "Sarah, la coiffeuse", avatar: "✂️", greeting: "Coucou ! Un petit creux entre deux clients. Tenez, voilà." },
  { name: "Mme Louise, la grand-mère", avatar: "👵", greeting: "Bonjour ma petite dame. C'est pour le goûter de mes petits-enfants. Tenez." },
  { name: "Nicolas, le lycéen", avatar: "🎒", greeting: "Bonjour monsieur, ça sera tout pour aujourd'hui. Voilà." },
  { name: "Élodie, l'infirmière libérale", avatar: "👩‍⚕️", greeting: "Bonjour, entre deux tournées de patients, je prends ça. Merci !" },
  { name: "Arthur, le musicien", avatar: "🎸", greeting: "Salut l'ami, super boutique ! J'ai ça pour payer mon panier." },
  { name: "Julie, la graphiste", avatar: "🎨", greeting: "Hello ! Le packaging de ce produit est superbe. Voici mon paiement." },
  { name: "Pierre, le chauffeur de bus", avatar: "🚌", greeting: "Bonjour ! Juste le temps d'un café et d'un biscuit. Tenez." },
  { name: "Mme Alice, la couturière", avatar: "🧵", greeting: "Bonjour, vous avez toujours un accueil si charmant. Voici pour vous." },
  { name: "Paul, le jardinier", avatar: "🪵", greeting: "Salut ! Une bonne bouteille de jus après le travail. Tenez." },
  { name: "Manon, l'étudiante en droit", avatar: "⚖️", greeting: "Bonjour, parfait pour réviser mes examens ce soir. Voici mon billet." },
  { name: "Guillaume, le comptable", avatar: "📊", greeting: "Bonjour, l'addition est exacte, parfait ! Je vous donne ceci." },
  { name: "Clara, la secrétaire médicale", avatar: "⌨️", greeting: "Bonjour ! Ma collegue m'a conseillé votre épicerie. Voilà pour moi." },
  { name: "M. Henri, l'ancien boulanger", avatar: "🥖", greeting: "Bonjour ! On reconnaît les bons produits ici. Tenez, jeune homme." },
  { name: "Laura, la prof de yoga", avatar: "🧘‍♀️", greeting: "Bonjour, des produits parfaits pour rester en forme. Voici ma monnaie." },
  { name: "David, l'agent immobilier", avatar: "💼", greeting: "Hello ! Une signature de bail réussie, ça se fête. Je règle ça." },
  { name: "Emma, la photographe", avatar: "📷", greeting: "Bonjour, le visuel de votre étalage donne envie ! Voici mon règlement." },
  { name: "M. André, le pêcheur", avatar: "🎣", greeting: "Bonjour ! Une bonne journée de pêche s'annonce avec ça. Tenez." },
  { name: "Mathilde, la vendeuse", avatar: "🛍️", greeting: "Coucou ! Rapide emplette avant l'ouverture du magasin. Voilà." },
  { name: "Simon, le charpentier", avatar: "🪚", greeting: "Bonjour, de quoi tenir jusqu'au dîner. Voici pour le compte." },
  { name: "Lucie, l'opticienne", avatar: "👓", greeting: "Bonjour ! J'ai une cliente dans cinq minutes, je fais vite. Tenez !" },
  { name: "Mme Renée, la retraitée active", avatar: "🧺", greeting: "Bonjour, je prépare une bonne soupe pour ce soir. Voici mon billet." },
  { name: "Hugo, le barman", avatar: "🍹", greeting: "Salut ! Réveil difficile, il me fallait absolument ce café. Tiens." },
  { name: "Marine, la journaliste", avatar: "📰", greeting: "Bonjour ! Un petit en-cas avant de partir en reportage. Tenez." },
  { name: "Benoît, le livreur à vélo", avatar: "🚴‍♂️", greeting: "Hello ! Grosse journée de livraisons, j'ai faim. Voilà pour le paiement." },
  { name: "Chantal, la secrétaire", avatar: "🏛️", greeting: "Bonjour, la pause café administrative ! Je vous donne ceci." },
  { name: "M. Jean, le chef de travaux", avatar: "🏗️", greeting: "Bonjour, une petite faim sur la route. Voici pour le total." }
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
  { name: "Jus de pommes local", easyPrice: 3.00, complexPrice: 3.35 },
  { name: "Baguette de tradition", easyPrice: 1.00, complexPrice: 1.30 },
  { name: "Croissant au beurre", easyPrice: 1.00, complexPrice: 1.25 },
  { name: "Pain au chocolat", easyPrice: 1.00, complexPrice: 1.35 },
  { name: "Sandwich Triangle Poulet", easyPrice: 4.00, complexPrice: 3.85 },
  { name: "Salade César Fraîche", easyPrice: 6.00, complexPrice: 6.49 },
  { name: "Quiche Lorraine", easyPrice: 4.00, complexPrice: 4.25 },
  { name: "Panini Tomate Mozzarella", easyPrice: 5.00, complexPrice: 5.15 },
  { name: "Cookie aux trois chocolats", easyPrice: 2.00, complexPrice: 2.45 },
  { name: "Muffin à la myrtille", easyPrice: 3.00, complexPrice: 2.80 },
  { name: "Wrap Saumon Avocat", easyPrice: 5.00, complexPrice: 5.60 },
  { name: "Barrette de fraises", easyPrice: 4.00, complexPrice: 4.19 },
  { name: "Sac de pommes d'Alsace", easyPrice: 3.00, complexPrice: 3.45 },
  { name: "Bananes bio", easyPrice: 2.00, complexPrice: 2.10 },
  { name: "Ananas entier", easyPrice: 3.00, complexPrice: 2.99 },
  { name: "Tomates cerises", easyPrice: 2.00, complexPrice: 1.89 },
  { name: "Avocats", easyPrice: 3.00, complexPrice: 3.25 },
  { name: "Melon charentais", easyPrice: 3.00, complexPrice: 2.85 },
  { name: "Sachet de salade lavée", easyPrice: 2.00, complexPrice: 1.65 },
  { name: "Concombre bio", easyPrice: 1.00, complexPrice: 1.15 },
  { name: "Sachet de noix", easyPrice: 4.00, complexPrice: 4.35 },
  { name: "Brique de lait demi-écrémé", easyPrice: 1.00, complexPrice: 1.12 },
  { name: "Beurre doux", easyPrice: 3.00, complexPrice: 2.89 },
  { name: "Pack de yaourts nature bio", easyPrice: 2.00, complexPrice: 2.35 },
  { name: "Crème fraîche épaisse", easyPrice: 2.00, complexPrice: 1.95 },
  { name: "Fromage Blanc", easyPrice: 3.00, complexPrice: 3.10 },
  { name: "Œufs de plein air", easyPrice: 2.00, complexPrice: 2.45 },
  { name: "Comté AOP affiné", easyPrice: 6.00, complexPrice: 6.85 },
  { name: "Camembert de Normandie", easyPrice: 3.00, complexPrice: 2.75 },
  { name: "Mozzarella di Bufala", easyPrice: 2.00, complexPrice: 2.29 },
  { name: "Râpé spécial pizza", easyPrice: 2.00, complexPrice: 2.15 },
  { name: "Paquet de coquillettes", easyPrice: 1.00, complexPrice: 0.95 },
  { name: "Riz basmati parfumé", easyPrice: 2.00, complexPrice: 2.40 },
  { name: "Sauce tomate basilic", easyPrice: 2.00, complexPrice: 1.75 },
  { name: "Chips de sarrasin", easyPrice: 2.00, complexPrice: 2.30 },
  { name: "Huile d'olive vierge extra", easyPrice: 8.00, complexPrice: 8.95 },
  { name: "Moutarde de Dijon", easyPrice: 2.00, complexPrice: 1.69 },
  { name: "Boîte de thon au naturel", easyPrice: 2.00, complexPrice: 2.15 },
  { name: "Soupe de légumes", easyPrice: 3.00, complexPrice: 3.40 },
  { name: "Cornichons extra-fins", easyPrice: 2.00, complexPrice: 2.25 },
  { name: "Sel fin de Guérande", easyPrice: 1.00, complexPrice: 1.45 },
  { name: "Tablette de chocolat noir", easyPrice: 2.00, complexPrice: 2.35 },
  { name: "Pot de pâte à tartiner", easyPrice: 4.00, complexPrice: 4.65 },
  { name: "Confiture de fraises", easyPrice: 4.00, complexPrice: 3.90 },
  { name: "Biscuits sablés pur beurre", easyPrice: 2.00, complexPrice: 1.85 },
  { name: "Paquet de bonbons fruités", easyPrice: 2.00, complexPrice: 2.10 },
  { name: "Compotes de pommes", easyPrice: 2.00, complexPrice: 2.25 },
  { name: "Céréales complètes", easyPrice: 4.00, complexPrice: 3.75 },
  { name: "Galettes de riz soufflé", easyPrice: 1.00, complexPrice: 1.40 },
  { name: "Sucre roux de canne", easyPrice: 2.00, complexPrice: 1.99 },
  { name: "Gaufres au sucre", easyPrice: 3.00, complexPrice: 2.70 },
  { name: "Bouteille d'eau minérale", easyPrice: 1.00, complexPrice: 0.85 },
  { name: "Limonade artisanale", easyPrice: 3.00, complexPrice: 2.90 },
  { name: "Soda rafraîchissant", easyPrice: 1.00, complexPrice: 1.20 },
  { name: "Thé glacé à la pêche", easyPrice: 2.00, complexPrice: 1.75 },
  { name: "Jus d'orange", easyPrice: 3.00, complexPrice: 2.65 },
  { name: "Nectar de mangue", easyPrice: 3.00, complexPrice: 3.49 },
  { name: "Café en grains", easyPrice: 6.00, complexPrice: 5.99 },
  { name: "Infusion verveine-menthe", easyPrice: 3.00, complexPrice: 3.15 },
  { name: "Boisson végétale amande", easyPrice: 2.00, complexPrice: 2.45 },
  { name: "Bière sans alcool", easyPrice: 2.00, complexPrice: 2.10 }
];

function getGivenNotesAndCoins(amount: number) {
  const denominations = [
    { value: 100, label: "Billet 100 €" },
    { value: 50, label: "Billet 50 €" },
    { value: 20, label: "Billet 20 €" },
    { value: 10, label: "Billet 10 €" },
    { value: 5, label: "Billet 5 €" },
    { value: 2, label: "Pièce 2 €" },
    { value: 1, label: "Pièce 1 €" },
  ];
  const results = [];
  let remaining = Math.round(amount * 100);
  for (const denom of denominations) {
    const valueCents = denom.value * 100;
    while (remaining >= valueCents) {
      results.push(denom);
      remaining -= valueCents;
    }
  }
  return results;
}

function generateLevelScenarios(level: 'easy' | 'medium' | 'hard', count: number = 5): MockInvoice[] {
  const list: MockInvoice[] = [];
  // To avoid duplicate customers within the same active list
  const availableCustomerIndexes = Array.from({ length: CUSTOMERS.length }, (_, i) => i);
  
  for (let s = 0; s < count; s++) {
    if (availableCustomerIndexes.length === 0) {
      for (let i = 0; i < CUSTOMERS.length; i++) {
        availableCustomerIndexes.push(i);
      }
    }
    const randIndex = Math.floor(Math.random() * availableCustomerIndexes.length);
    const customerIndex = availableCustomerIndexes.splice(randIndex, 1)[0];
    const customer = CUSTOMERS[customerIndex];
    
    // Pick dynamic items based on level
    const itemCount = level === 'easy' 
      ? Math.floor(Math.random() * 2) + 1 
      : level === 'medium'
      ? Math.floor(Math.random() * 2) + 2
      : Math.floor(Math.random() * 2) + 3;

    const selectedItems: { name: string; qty: number; price: number }[] = [];
    const itemPool = [...MARKET_ITEMS];
    
    for (let i = 0; i < itemCount; i++) {
      if (itemPool.length === 0) break;
      const index = Math.floor(Math.random() * itemPool.length);
      const item = itemPool.splice(index, 1)[0];
      
      const qty = Math.random() > 0.75 
        ? (level === 'easy' ? 2 : Math.floor(Math.random() * 2) + 2) 
        : 1;
      
      let price = 0;
      if (level === 'easy') {
        price = item.easyPrice;
      } else if (level === 'medium') {
        // Round to nearest 10 cents for "centimes simples"
        price = Math.round(item.complexPrice * 10) / 10;
      } else {
        price = item.complexPrice;
      }
      
      selectedItems.push({ name: item.name, qty, price });
    }
    
    const total = selectedItems.reduce((acc, current) => acc + (current.price * current.qty), 0);
    const roundedTotal = Math.round(total * 100) / 100;
    
    let given = 0;
    if (roundedTotal < 5) {
      given = Math.random() > 0.5 ? 5 : 10;
    } else if (roundedTotal < 10) {
      given = Math.random() > 0.4 ? 10 : 20;
    } else if (roundedTotal < 20) {
      given = Math.random() > 0.3 ? 20 : 50;
    } else if (roundedTotal < 50) {
      given = 50;
    } else if (roundedTotal < 100) {
      given = 100;
    } else {
      given = Math.ceil(roundedTotal / 50) * 50;
    }
    
    const toReturn = Math.round((given - roundedTotal) * 100) / 100;
    
    let givenText = `${given} €`;
    if (given === 15) givenText = "un billet de 10 € et un de 5 €";
    else if (given === 30) givenText = "un billet de 20 € et un de 10 €";
    else if (given === 60) givenText = "un billet de 50 € et un de 10 €";
    else if (given === 70) givenText = "un billet de 50 € et un de 20 €";
    else if (given === 100) givenText = "un billet de 100 €";
    else if (given === 50) givenText = "un billet de 50 €";
    else if (given === 20) givenText = "un billet de 20 €";
    else if (given === 10) givenText = "un billet de 10 €";
    else if (given === 5) givenText = "un billet de 5 €";
    
    const greetingMessage = `${customer.greeting} Voici ${givenText}.`;
    
    list.push({
      id: `${level}_${s}_${Date.now()}`,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      items: selectedItems,
      total: roundedTotal,
      given,
      toReturn,
      greetingMessage
    });
  }
  
  return list;
}

function getOptimalChange(amount: number): string[] {
  const values = [
    { value: 50.0, label: "Billet 50 €" },
    { value: 20.0, label: "Billet 20 €" },
    { value: 10.0, label: "Billet 10 €" },
    { value: 5.0, label: "Billet 5 €" },
    { value: 2.0, label: "Pièce 2 €" },
    { value: 1.0, label: "Pièce 1 €" },
    { value: 0.5, label: "Pièce 50 c" },
    { value: 0.2, label: "Pièce 20 c" },
    { value: 0.1, label: "Pièce 10 c" },
    { value: 0.05, label: "Pièce 5 c" },
    { value: 0.02, label: "Pièce 2 c" },
    { value: 0.01, label: "Pièce 1 c" },
  ];
  
  let remaining = Math.round(amount * 100);
  const result: string[] = [];
  
  for (const item of values) {
    const itemValueCents = Math.round(item.value * 100);
    while (remaining >= itemValueCents) {
      result.push(item.label);
      remaining -= itemValueCents;
    }
  }
  return result;
}

export default function App() {
  // Game states for our high-fidelity layout prototype
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [maxSolvedScenarioIndex, setMaxSolvedScenarioIndex] = useState<number>(0);
  const [renderedMoney, setRenderedMoney] = useState<{ item: MoneyItem; count: number }[]>([]);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [activeScenarios, setActiveScenarios] = useState<MockInvoice[]>(() => generateLevelScenarios('easy', 5));
  const [showValidationPopup, setShowValidationPopup] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const activeScenario = activeScenarios[currentScenarioIndex] || {
    id: "none",
    customerName: "",
    customerAvatar: "🤷",
    items: [],
    total: 0,
    given: 0,
    toReturn: 0,
    greetingMessage: ""
  };

  const handleSetLevel = (newLevel: 'easy' | 'medium' | 'hard') => {
    setLevel(newLevel);
    setActiveScenarios(generateLevelScenarios(newLevel, 5));
    setCurrentScenarioIndex(0);
    setMaxSolvedScenarioIndex(0);
    handleClearTray();
  };

  const handleRegenerateScenarios = () => {
    setActiveScenarios(generateLevelScenarios(level, 5));
    setCurrentScenarioIndex(0);
    setMaxSolvedScenarioIndex(0);
    handleClearTray();
  };

  // Calculate sum currently rendered on the electronic tray
  const currentTotalRendered = renderedMoney.reduce((acc, current) => {
    return acc + (current.item.value * current.count);
  }, 0);

  // Interaction: Add cash item to tray
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

  // Interaction: Remove or decrease cash item from tray
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

  // Clear client tray
  const handleClearTray = () => {
    setRenderedMoney([]);
    setIsCorrect(null);
  };

  // Simulated Verification Trigger (showing pedagogue feedback loop)
  const handleVerify = () => {
    const errorMargin = 0.001; // Avoid floating point inaccuracies
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
      
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Title and Slogan */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-200">
              <Store className="w-6 h-6 animate-bounce-subtle" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 flex items-center gap-2">
                Rendre la Monnaie
              </h1>
              <p className="text-xs text-slate-500 font-medium">Point de vente virtuel & simulateur de caisse</p>
            </div>
          </div>

          {/* Quick Level Selector and Helpers for teacher evaluation */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Prof :
            </span>
            <button 
              onClick={() => handleSetLevel('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                level === 'easy' 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🟢 Facile (Sans Centimes)
            </button>
            <button 
              onClick={() => handleSetLevel('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                level === 'medium' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🟡 Moyen (Centimes simples)
            </button>
            <button 
              onClick={() => handleSetLevel('hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                level === 'hard' 
                  ? 'bg-red-500 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🔴 Difficile (Tous cas)
            </button>
            <button 
              onClick={handleRegenerateScenarios}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all flex items-center gap-1 border border-indigo-200 cursor-pointer"
              title="Générer un tout nouveau groupe d'exercices aléatoires pour ce niveau"
            >
              🔄 Mélanger / Nouveaux Exercices
            </button>
          </div>

        </div>
      </header>

      {/* Main interactive area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols on large screens): The Immersive Store View & The Register Screen */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: The Immersive Shop Environment (Client & Receipt Panel) */}
          <section className="bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            
            {/* Background absolute decor lines */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Quick Scenario selector tab */}
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4 z-10">
              <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Profils de Clients Disponibles :
              </span>
              <div className="flex gap-2">
                {activeScenarios.map((inv, idx) => (
                  <button 
                    key={inv.id}
                    disabled={idx > maxSolvedScenarioIndex}
                    onClick={() => {
                      setCurrentScenarioIndex(idx);
                      handleClearTray();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      currentScenarioIndex === idx 
                        ? 'bg-indigo-600 text-white border border-indigo-400' 
                        : idx > maxSolvedScenarioIndex
                        ? 'bg-white/5 text-indigo-200/30 cursor-not-allowed'
                        : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                    }`}
                  >
                    <span>Client {idx + 1}</span>
                    {idx > maxSolvedScenarioIndex ? <span className="opacity-60 text-[10px]">🔒</span> : idx < maxSolvedScenarioIndex ? <span className="text-[10px] text-emerald-400">✔️</span> : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Immersive scene body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch z-10 flex-1">
              
              {/* Customer Column */}
              <div className="md:col-span-7 flex flex-col justify-center relative">
                <div className="flex items-start gap-4">
                  {/* Decorative Profile Avatar with Cartoon bubble */}
                  <div className="relative flex-shrink-0">
                    <span className="text-5xl md:text-6xl select-none block filter drop-shadow">
                      {activeScenario.customerAvatar}
                    </span>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full text-white shadow border border-indigo-900">
                      Client
                    </div>
                  </div>

                  {/* Playful dialogue bubble */}
                  <div className="flex-1 bg-white text-slate-800 rounded-2xl p-4 shadow-lg border-2 border-indigo-100 relative max-w-[340px]">
                    <div className="absolute top-4 -left-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-white border-b-[8px] border-b-transparent"></div>
                    <div className="absolute top-4 -left-3.5 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-indigo-100/30 border-b-[8px] border-b-transparent pointer-events-none"></div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {activeScenario.customerName}
                    </p>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed italic text-slate-700">
                      "{activeScenario.greetingMessage}"
                    </p>
                  </div>
                </div>

                {/* Hand of customer showing holding visual cash given */}
                <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center gap-3 w-fit z-10 relative">
                  <span className="text-xs font-bold text-slate-300">Donné par le client :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {getGivenNotesAndCoins(activeScenario.given).map((item, idx) => (
                      <span 
                        key={idx} 
                        className={`text-xs px-2.5 py-1 rounded-md font-extrabold border-l-4 shadow-sm flex items-center gap-1 ${
                          item.value === 100 ? 'bg-purple-100 text-purple-800 border-purple-500' :
                          item.value === 50 ? 'bg-amber-100 text-amber-800 border-amber-500 animate-pulse-slow' :
                          item.value === 20 ? 'bg-sky-100 text-sky-800 border-sky-500 animate-pulse-slow' :
                          item.value === 10 ? 'bg-rose-100 text-rose-800 border-rose-500' :
                          item.value === 5 ? 'bg-emerald-100 text-emerald-800 border-emerald-500' :
                          'bg-slate-200 text-slate-800 border-slate-400'
                        }`}
                      >
                        {item.label} {item.value >= 5 ? "💵" : "🪙"}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Receipt Column (Le Ticket de Caisse Pédagogique) */}
              <div className="md:col-span-5 flex justify-center items-center">
                <div className="bg-white text-slate-900 border border-slate-200 px-5 pt-5 pb-8 shadow-xl max-w-[240px] w-full min-h-[260px] relative jagged-edge flex flex-col justify-between transform rotate-1 hover:rotate-0 transition-transform">
                  
                  {/* Store Name Details */}
                  <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                    <p className="font-heading font-extrabold tracking-tight text-sm uppercase text-slate-800">Épicerie du Centre</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Tél: 05 55 12 34 56</p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 flex-1 select-none">
                    {activeScenario.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>{it.qty}x {it.name}</span>
                        <span className="font-mono">{(it.price * it.qty).toFixed(2)} €</span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-slate-200 my-2 pt-2"></div>
                  </div>

                  {/* Calculations and sums */}
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

          {/* Section 2: Electronics Cash Register Display */}
          <section className="bg-slate-800 rounded-3xl p-5 border-t-8 border-indigo-600 border-x-2 border-b-2 border-slate-900 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span> Écran de Caisse Enregistreuse
            </h3>
            
            {/* Display grid */}
            <div className="bg-slate-950 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-700 font-mono">
              
              {/* Box 1: Total Achat */}
              <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Achat</span>
                <span className="text-2xl font-black text-indigo-300 mt-1 select-all">
                  {activeScenario.total.toFixed(2)} <span className="text-sm font-sans">€</span>
                </span>
              </div>

              {/* Box 2: Montant Reçu */}
              <div className="bg-indigo-950/40 border border-indigo-500/10 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant Reçu</span>
                <span className="text-2xl font-black text-amber-300 mt-1 select-all">
                  {activeScenario.given.toFixed(2)} <span className="text-sm font-sans">€</span>
                </span>
              </div>

              {/* Box 3: Total Rendered so far (Somme Déposée) */}
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Somme Déposée (Plateau)</span>
                <span className="text-2xl font-black text-indigo-200 mt-1">
                  {currentTotalRendered.toFixed(2)} <span className="text-sm font-sans">€</span>
                </span>
              </div>

            </div>
          </section>

          {/* Section 3: Client counter / Cashier platform tray (Le plateau rouge) */}
          <section className="bg-slate-200/80 rounded-3xl p-5 border-2 border-dashed border-slate-300 flex flex-col gap-3 min-h-[160px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-red-500 text-white p-1.5 rounded-lg text-xs font-bold">Plateau</div>
                <h3 className="font-heading font-extrabold text-sm text-slate-800">
                  Plateau de monnaie à rendre
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearTray}
                  disabled={renderedMoney.length === 0}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Vider le plateau
                </button>
                <button
                  onClick={handleVerify}
                  disabled={renderedMoney.length === 0}
                  className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-200 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Vérifier le rendu !
                </button>
              </div>
            </div>

            {/* Render items currently dropped here by clicking them in the drawer */}
            {renderedMoney.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400 border-2 border-dashed border-slate-300/60 rounded-2xl bg-white/40">
                <Coins className="w-10 h-10 stroke-1 text-slate-400 mb-2" />
                <p className="text-xs font-bold">Le plateau est vide.</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[340px]">Cliquez sur les pièces et billets du tiroir-caisse ci-dessous pour composer la monnaie à rendre au client.</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-start min-h-[90px]">
                {renderedMoney.map(({ item, count }) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleRemoveMoney(item.id)}
                    className="group relative cursor-pointer select-none"
                    title="Cliquez pour retirer du plateau"
                  >
                    {/* Badge showing duplicate count */}
                    {count > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white min-w-6 h-6 px-1.5 text-xs font-black rounded-full flex items-center justify-center border-2 border-white shadow z-10 animate-bounce-subtle">
                        x{count}
                      </span>
                    )}

                    {/* Rendering the appropriate coin or bill visually */}
                    {item.type === 'bill' ? (
                      <div className={`
                        w-24 h-12 rounded-lg border-2 relative overflow-hidden shadow-md flex flex-col justify-between p-1.5 font-mono text-xs font-black select-none transition-transform hover:-translate-y-1 active:scale-95
                        ${item.value === 50 ? 'bg-orange-100 hover:bg-orange-50 border-orange-400 text-orange-950' : ''}
                        ${item.value === 20 ? 'bg-sky-100 hover:bg-sky-50 border-sky-400 text-sky-950' : ''}
                        ${item.value === 10 ? 'bg-rose-100 hover:bg-rose-50 border-rose-400 text-rose-950' : ''}
                        ${item.value === 5 ? 'bg-emerald-100 hover:bg-emerald-50 border-emerald-400 text-emerald-950' : ''}
                      `}>
                        {/* Decorative background stripes for cartoon feel */}
                        <div className="absolute inset-y-0 left-4 w-4 bg-white/20"></div>
                        <div className="absolute inset-y-0 right-3 w-1 bg-white/30"></div>
                        <span className="text-[10px] block font-heading font-extrabold">{item.label}</span>
                        <span className="self-end text-lg mt-auto leading-none select-none">💵</span>
                        <div className="absolute bottom-1 left-1 bg-slate-900/10 rounded px-1 text-[8px] font-sans font-medium text-slate-600 group-hover:bg-slate-900/5 transition-colors">Retirer</div>
                      </div>
                    ) : (
                      <div className={`
                        w-12 h-12 rounded-full border-2 shadow-md flex items-center justify-center font-heading font-extrabold text-xs select-none relative transition-transform hover:-translate-y-1 active:scale-95
                        ${item.value === 2 ? 'bg-amber-100 border-slate-300 ring-2 ring-amber-400 ring-inset text-slate-800' : ''}
                        ${item.value === 1 ? 'bg-slate-200 border-amber-400 ring-2 ring-slate-400 ring-inset text-slate-800' : ''}
                        ${item.value === 0.5 || item.value === 0.2 || item.value === 0.1 ? 'bg-yellow-100 border-yellow-500 text-yellow-950' : ''}
                        ${item.value <= 0.05 ? 'bg-orange-100 border-amber-700 text-amber-950' : ''}
                      `}>
                        {/* Coin Inner Ridge */}
                        <div className="absolute inset-1 rounded-full border border-dashed border-black/10"></div>
                        <span className="z-10">{item.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column (4 cols on large screens): The Interactive Cash Register Drawer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Section 4: The Cash Drawer (Tiroir Caisse) */}
          <section className="bg-slate-800 rounded-3xl p-5 border-4 border-slate-900 shadow-xl text-white flex flex-col gap-5">
            <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                📂 Le tiroir-caisse virtuel
              </h3>
              <span className="bg-slate-700 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">EUR (€)</span>
            </div>

            {/* Part A: Billets list (BILLS) */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <span className="block w-2.5 h-1.5 bg-orange-400 rounded"></span> Billets de Caisse
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {BILLS.map(bill => (
                  <button
                    key={bill.id}
                    onClick={() => handleAddMoney(bill)}
                    className={`
                      relative group h-16 rounded-xl border-2 overflow-hidden shadow-lg flex flex-col justify-between p-2 font-mono text-left select-none transition-all active:scale-95 hover:shadow-xl hover:border-white/40 cursor-pointer
                      ${bill.value === 50 ? 'bg-orange-600 border-orange-400 text-orange-50 hover:bg-orange-500' : ''}
                      ${bill.value === 20 ? 'bg-sky-600 border-sky-400 text-sky-50 hover:bg-sky-500' : ''}
                      ${bill.value === 10 ? 'bg-rose-600 border-rose-400 text-rose-50 hover:bg-rose-500' : ''}
                      ${bill.value === 5 ? 'bg-emerald-600 border-emerald-400 text-emerald-50 hover:bg-emerald-500' : ''}
                    `}
                  >
                    {/* Watermark circle */}
                    <div className="absolute top-1 right-2 w-7 h-7 bg-white/10 rounded-full border border-white/5 flex items-center justify-center">
                      <span className="text-[8px] text-white/50">★</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight leading-none">{bill.label}</span>
                      <span className="text-[8px] font-sans font-bold text-white/60 tracking-widest mt-0.5 uppercase">Billet</span>
                    </div>

                    <div className="flex items-center justify-between w-full mt-auto">
                      <span className="text-xl">💵</span>
                      <span className="bg-white/10 text-white rounded-full p-0.5 group-hover:bg-white/20 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Left aesthetic bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Part B: Pieces list (COINS) */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <span className="block w-2.5 h-2.5 bg-yellow-400 rounded-full"></span> Pièces de Monnaie
              </h4>
              
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                {COINS.map(coin => {
                  // Determine unique visual colors and sizes for realistic coin styles
                  let coinColorClass = "";
                  let coinSizeClass = "";

                  if (coin.value === 2) {
                    // Euro 2: Silver center, Golden ring
                    coinColorClass = "bg-slate-300 border-amber-500 text-slate-900 border-w-2 hover:bg-slate-200";
                    coinSizeClass = "w-12 h-12 text-xs font-black";
                  } else if (coin.value === 1) {
                    // Euro 1: Golden center, Silver ring
                    coinColorClass = "bg-amber-100 border-slate-400 text-slate-900 border-w-2 hover:bg-amber-50";
                    coinSizeClass = "w-11 h-11 text-xs font-black";
                  } else if (coin.value === 0.5) {
                    coinColorClass = "bg-yellow-500 border-yellow-300 text-yellow-950 hover:bg-yellow-400 font-bold";
                    coinSizeClass = "w-11 h-11 text-xs";
                  } else if (coin.value === 0.2) {
                    coinColorClass = "bg-yellow-500 border-yellow-300 text-yellow-950 hover:bg-yellow-400 font-bold";
                    coinSizeClass = "w-10 h-10 text-xs";
                  } else if (coin.value === 0.1) {
                    coinColorClass = "bg-yellow-500 border-yellow-300 text-yellow-950 hover:bg-yellow-400 font-bold";
                    coinSizeClass = "w-9 h-9 text-xs";
                  } else {
                    // Copper cents: 5c, 2c, 1c
                    coinColorClass = "bg-orange-700 border-amber-800 text-orange-100 hover:bg-orange-600";
                    coinSizeClass = coin.value === 0.05 ? "w-9 h-9 text-[10px]" : coin.value === 0.02 ? "w-8.5 h-8.5 text-[10px]" : "w-8 h-8 text-[9px]";
                  }

                  return (
                    <button
                      key={coin.id}
                      onClick={() => handleAddMoney(coin)}
                      className={`
                        ${coinColorClass} ${coinSizeClass}
                        rounded-full border shadow-md flex flex-col items-center justify-center relative font-heading mx-auto select-none transition-all active:scale-90 hover:scale-105 hover:shadow-lg cursor-pointer
                      `}
                    >
                      {/* Dotted border loop Inside the coin */}
                      <div className="absolute inset-0.5 rounded-full border border-dashed border-black/10 pointer-events-none"></div>
                      
                      <span className="leading-none text-center block font-extrabold">{coin.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Didactic Tip */}
            <div className="mt-2 bg-slate-700/60 border border-slate-700 rounded-2xl p-4 text-xs font-medium text-slate-300">
              <span className="font-bold text-amber-400 uppercase tracking-widest text-[10px] block mb-1">💡 Comment ça marche ?</span>
              <p className="leading-normal">
                Cliquez sur n'importe quel billet ou pièce ci-dessus pour le transférer sur le plateau de monnaie. Cliquez sur les éléments du plateau pour les retirer un par un.
              </p>
            </div>

          </section>

          {/* Section 5: Diagnostic / Pedagogical Level Info Panel */}
          <section className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mb-2.5">
              <Info className="w-4 h-4 text-indigo-500" /> Objectifs d'apprentissage
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Ce module aide les élèves à automatiser le calcul mental en situation professionnelle. Ils doivent estimer et minimiser le nombre de pièces à rendre.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex bg-slate-50 p-2.5 rounded-xl border border-slate-100 items-start gap-2">
                <span className="text-base select-none">🧮</span>
                <div>
                  <h4 className="font-bold text-slate-800">Calcul d'écart</h4>
                  <p className="text-slate-500 text-[11px]">Savoir soustraire le total de l'achat de la somme donnée par le client.</p>
                </div>
              </div>
              <div className="flex bg-slate-50 p-2.5 rounded-xl border border-slate-100 items-start gap-2">
                <span className="text-base select-none">🎯</span>
                <div>
                  <h4 className="font-bold text-slate-800">Rendu optimal</h4>
                  <p className="text-slate-500 text-[11px]">Favoriser les pièces de grande valeur pour rendre le moins d'objets possible.</p>
                </div>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Validation modal showing pedagogical corrective loop */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative transform scale-100 transition-transform">
            
            <button 
              onClick={() => setShowValidationPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon status */}
            <div className="flex justify-center mb-4">
              {isCorrect ? (
                <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full border-4 border-emerald-50">
                  <span className="text-4xl text-center block select-none">🎉</span>
                </div>
              ) : (
                <div className="bg-rose-100 text-rose-600 p-4 rounded-full border-4 border-rose-50">
                  <span className="text-4xl text-center block select-none">❌</span>
                </div>
              )}
            </div>

            {/* Core Message */}
            <h3 className="font-heading font-extrabold text-xl text-center text-slate-900 mb-2">
              {isCorrect ? "Félicitations ! Rendu Parfait" : "Oups ! Rendu Incorrect"}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 text-center mb-6 leading-relaxed">
              {isCorrect 
                ? "Excellent travail ! Vous avez rendu exactement le compte attendu. Les pièces et billets sont parfaitement calculés."
                : "La somme déposée sur le plateau ne correspond pas à la monnaie attendue. À vous de recalculer l'écart par vous-même !"
              }
            </p>

            {/* Correction details loop - ONLY visible on success */}
            {isCorrect ? (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Correction didactique :
                </h4>
                
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Montant de l'achat :</span>
                    <span className="font-mono font-bold text-slate-800">{activeScenario.total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payé par le client :</span>
                    <span className="font-mono font-bold text-slate-800">{activeScenario.given.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 font-extrabold bg-indigo-50/50 p-1.5 rounded">
                    <span>Monnaie à rendre :</span>
                    <span className="font-mono">{activeScenario.toReturn.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Dynamic suggestion panel for visual optimum rendering */}
                <div className="border-t border-slate-200 pt-3 mt-1.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Combinaison Optimale Conseillée :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {getOptimalChange(activeScenario.toReturn).map((label, idx) => (
                      <span key={idx} className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded font-extrabold border border-slate-300">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 mb-6 flex items-start gap-3">
                <span className="text-2xl select-none">🧐</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">La monnaie n'est pas exacte !</h4>
                  <p className="text-xs text-amber-900/80 leading-relaxed mt-1">
                    Pour progresser, examinez à nouveau le total des achats et le montant reçu par le client, calculez mentalement ce que vous lui devez, puis modifiez vos pièces et billets.
                  </p>
                </div>
              </div>
            )}

            {/* Action control */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowValidationPopup(false);
                }}
                className={`py-3 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer text-center ${
                  isCorrect ? "flex-1" : "w-full"
                }`}
              >
                {isCorrect ? "Réessayer l'exercice" : "Modifier mon rendu & recompter"}
              </button>
              
              {isCorrect && (
                <button
                  onClick={() => {
                    // Switch to next invoice scenario
                    const nextIdx = (currentScenarioIndex + 1) % activeScenarios.length;
                    setCurrentScenarioIndex(nextIdx);
                    handleClearTray();
                    setShowValidationPopup(false);
                  }}
                  className="flex-1 py-3 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Client Suivant <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Playful footer indicating interactive status */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="flex items-center justify-center gap-1 font-bold text-slate-500">
            Réalisé par F. AIGON - Enseignant Éco-Gestion pour les sections de Commerce & de Vente en formation professionnelle
          </p>
          <p className="text-[11px] text-slate-400">
            Cette permet aux élèves de s'entraîner à rendre la monnaie avec retour interactif.
          </p>
        </div>
      </footer>

    </div>
  );
}
