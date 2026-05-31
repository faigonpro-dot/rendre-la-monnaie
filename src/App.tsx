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



const LEVEL_INVOICES: Record<'easy' | 'medium' | 'hard', MockInvoice[]> = {

  easy: [

    {

      id: "e1",

      customerName: "Léa, la fleuriste",

      customerAvatar: "👩‍🌾",

      items: [

        { name: "Bouquet de tulipes", qty: 2, price: 6.00 },

        { name: "Poterie artisanale", qty: 1, price: 15.00 }

      ],

      total: 27.00,

      given: 50.00,

      toReturn: 23.00,

      greetingMessage: "Bonjour ! Vos tulipes sont magnifiques. Voici un billet de 50 € !"

    },

    {

      id: "e2",

      customerName: "Lucas, l'étudiant gourmand",

      customerAvatar: "👨‍🎓",

      items: [

        { name: "Formule Midi (Sandwich + Boisson)", qty: 1, price: 8.00 },

        { name: "Éclair au chocolat", qty: 1, price: 2.00 }

      ],

      total: 10.00,

      given: 20.00,

      toReturn: 10.00,

      greetingMessage: "Salut ! C'était parfait pour ma pause de midi. Voici 20 €."

    },

    {

      id: "e3",

      customerName: "Monsieur Robert, le doyen du quartier",

      customerAvatar: "👴",

      items: [

        { name: "Journal quotidien", qty: 1, price: 2.00 },

        { name: "Miel de lavande", qty: 1, price: 6.00 },

        { name: "Boîte de tisane bio", qty: 1, price: 4.00 }

      ],

      total: 12.00,

      given: 15.00,

      toReturn: 3.00,

      greetingMessage: "Bonjour mon jeune ami ! Quel beau temps aujourd'hui. Je vous donne un billet de 10 € et un de 5 €."

    }

  ],

  medium: [

    {

      id: "m1",

      customerName: "Julie, l'étudiante",

      customerAvatar: "👩‍🎓",

      items: [

        { name: "Formule Midi (Sandwich + Boisson)", qty: 1, price: 8.50 },

        { name: "Cookie pépites de chocolat", qty: 1, price: 2.00 }

      ],

      total: 10.50,

      given: 20.00,

      toReturn: 9.50,

      greetingMessage: "Salut ! C'est parfait pour ma pause de midi. Voici 20 €."

    },

    {

      id: "m2",

      customerName: "Thomas, le sportif",

      customerAvatar: "🏃‍♂️",

      items: [

        { name: "Barres de céréales", qty: 2, price: 1.50 },

        { name: "Boisson isotonique", qty: 1, price: 2.50 }

      ],

      total: 5.50,

      given: 10.00,

      toReturn: 4.50,

      greetingMessage: "Bonjour ! Juste de quoi me redonner de l'énergie après ma séance. Voici 10 €."

    },

    {

      id: "m3",

      customerName: "Inès, l'architecte",

      customerAvatar: "👩‍🎨",

      items: [

        { name: "Grand carnet de croquis", qty: 1, price: 13.20 },

        { name: "Gomme mie de pain", qty: 1, price: 1.80 }

      ],

      total: 15.00,

      given: 20.00,

      toReturn: 5.00,

      greetingMessage: "Bonjour ! J'adore votre rayon papeterie. Je vous donne un billet de 20 €."

    }

  ],

  hard: [

    {

      id: "h1",

      customerName: "Léa, la fleuriste",

      customerAvatar: "👩‍🌾",

      items: [

        { name: "Bouquet de tulipes", qty: 1, price: 12.50 },

        { name: "Poterie artisanale", qty: 1, price: 15.85 }

      ],

      total: 28.35,

      given: 50.00,

      toReturn: 21.65,

      greetingMessage: "Bonjour ! Vos tulipes sont magnifiques. Voici un billet de 50 € !"

    },

    {

      id: "h2",

      customerName: "Monsieur Robert, le doyen du quartier",

      customerAvatar: "👴",

      items: [

        { name: "Journal quotidien", qty: 1, price: 1.80 },

        { name: "Miel de lavande", qty: 1, price: 6.75 },

        { name: "Boîte de tisane bio", qty: 1, price: 4.10 }

      ],

      total: 12.65,

      given: 15.00,

      toReturn: 2.35,

      greetingMessage: "Bonjour mon jeune ami ! Quel beau temps aujourd'hui. Je vous donne un billet de 10 € et un de 5 €."

    },

    {

      id: "h3",

      customerName: "Sonia, la maman organisée",

      customerAvatar: "👩‍👦",

      items: [

        { name: "Paquet de couches bio", qty: 1, price: 16.49 },

        { name: "Lingettes écologiques", qty: 2, price: 2.10 }

      ],

      total: 20.69,

      given: 30.00,

      toReturn: 9.31,

      greetingMessage: "Bonsoir ! Courte journée... Je vais régler avec ces billets de 20 € et 10 €."

    }

  ]

};



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

  const [showValidationPopup, setShowValidationPopup] = useState<boolean>(false);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);



  const activeScenarios = LEVEL_INVOICES[level];

  const activeScenario = activeScenarios[currentScenarioIndex];



  const handleSetLevel = (newLevel: 'easy' | 'medium' | 'hard') => {

    setLevel(newLevel);

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

                Rendre la Monnaie <span className="bg-indigo-100 text-indigo-700 font-sans text-xs px-2.5 py-1 rounded-full font-bold">Maquette Pédagogique UX</span>

              </h1>

              <p className="text-xs text-slate-500 font-medium">Point de vente virtuel & simulateur de caisse pour vos élèves</p>

            </div>

          </div>



          {/* Quick Level Selector and Helpers for teacher evaluation */}

          <div className="flex items-center gap-2 flex-wrap justify-center">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">

              <Settings className="w-3.5 h-3.5" /> Prof :

            </span>

            <button 

              onClick={() => handleSetLevel('easy')}

              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${

                level === 'easy' 

                  ? 'bg-emerald-500 text-white shadow-sm' 

                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

              }`}

            >

              🟢 Facile (Sans Centimes)

            </button>

            <button 

              onClick={() => handleSetLevel('medium')}

              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${

                level === 'medium' 

                  ? 'bg-amber-500 text-white shadow-sm' 

                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

              }`}

            >

              🟡 Moyen (Centimes simples)

            </button>

            <button 

              onClick={() => handleSetLevel('hard')}

              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${

                level === 'hard' 

                  ? 'bg-red-500 text-white shadow-sm' 

                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

              }`}

            >

              🔴 Difficile (Tous cas)

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

                <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-fit">

                  <span className="text-xs font-bold text-slate-300">Donné par le client :</span>

                  <div className="flex gap-1.5">

                    {activeScenario.given === 50 ? (

                      <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-md font-extrabold border-l-4 border-amber-500 shadow-sm animate-pulse-slow">

                        Billet de 50 € 💵

                      </span>

                    ) : activeScenario.given === 20 ? (

                      <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-1 rounded-md font-extrabold border-l-4 border-sky-500 shadow-sm animate-pulse-slow">

                        Billet de 20 € 💵

                      </span>

                    ) : (

                      <div className="flex gap-1">

                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-md font-extrabold border-l-4 border-red-500 shadow-sm">

                          Billet de 10 € 💵

                        </span>

                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-md font-extrabold border-l-4 border-emerald-500 shadow-sm">

                          Billet de 5 € 💵

                        </span>

                      </div>

                    )}

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

                  Plateau de Monnaie à Rendre

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

                📂 Le Tiroir-Caisse Virtuel

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
