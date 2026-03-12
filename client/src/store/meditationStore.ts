import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Meditation {
  id: string;
  title: string;
  content: string;
  verseRef: string;
  verseText: string;
  category: 'fé' | 'esperança' | 'amor' | 'sabedoria' | 'força' | 'paz' | 'gratidão' | 'sabedoria';
  date: string;
  read: boolean;
  favorited: boolean;
}

const DAILY_MEDITATIONS: Omit<Meditation, 'id' | 'read' | 'favorited'>[] = [
  {
    title: 'A Paz que Supera',
    content:
      'Não se preocupe com nada, mas em todas as orações apresente seus pedidos a Deus. E a paz de Deus, que excede todo entendimento, guardará seus corações e suas mentes em Cristo Jesus.\n\nEste versículo nos lembra que a preocupação é contraproducente. Quando entregamos nossas preocupações a Deus, Ele nos dá uma paz que vai além do que podemos entender. É uma paz que não depende das circunstâncias, mas da nossa confiança Nele.\n\nPense: O que está te preocupando hoje? Que tal entregar isso a Deus?',
    verseRef: 'Filipenses 4:6-7',
    verseText:
      'Não se preocupe com nada, mas em todas as orações apresente seus pedidos a Deus. E a paz de Deus, que excede todo entendimento, guardará seus corações e suas mentes em Cristo Jesus.',
    category: 'paz',
    date: '',
  },
  {
    title: 'Amor Incondicional',
    content:
      'Deus amou tanto o mundo que deu Seu único Filho para que todos os que crerem não pereçam, mas tenham vida eterna.\n\nEste é o versículo mais conhecido da Bíblia, e por uma boa razão. Ele resume todo o evangelho: o amor de Deus é tão grande que Ele deu tudo por nós. Não existe amor maior do que este.\n\nQue resposta você dá a este amor?',
    verseRef: 'João 3:16',
    verseText:
      'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.',
    category: 'amor',
    date: '',
  },
  {
    title: 'Força na Fraqueza',
    content:
      'Mas ele me disse: Minha graça é suficiente para você, pois minha força se manifesta na fraqueza.\n\nPaulo aprendeu que não precisa ser forte por conta própria. Na verdade, é quando somos fracos que a força de Cristo se manifesta em nós. Não tema suas limitações - elas são oportunidades para a graça de Deus brilhar.\n\nQual fraqueza você está enfrentando hoje? Entregue-a a Deus.',
    verseRef: '2 Coríntios 12:9',
    verseText: 'Minha graça é suficiente para você, pois minha força se manifesta na fraqueza.',
    category: 'força',
    date: '',
  },
  {
    title: 'Esperança Viva',
    content:
      'Louvado seja o Deus e Pai de nosso Senhor Jesus Cristo! Segundo sua grande misericórdia, ele nos gerou de novo para uma esperança viva, pela ressurreição de Jesus Cristo dos mortos.\n\nAtravés de Jesus, temos uma esperança viva - não uma esperança vazia, mas uma certeza absoluta de vida eterna. Esta esperança nos sustenta em meio às dificuldades.\n\nDe que você precisa ter esperança hoje?',
    verseRef: '1 Pedro 1:3',
    verseText: 'Ele nos gerou de novo para uma esperança viva, pela ressurreição de Jesus Cristo.',
    category: 'esperança',
    date: '',
  },
  {
    title: 'Sabedoria Divina',
    content:
      'Se algum de vocês tem falta de sabedoria, peça a Deus, que a todos dá liberalmente, e não lançamento em conta, e lhe será dada.\n\nDeus não apenas permite que peçamos sabedoria - Ele quer nos dar! E não吝啬, pois nos dá generosamente. Quando facing decisões difíceis, lembre-se: Deus quer智慧te dar sabedoria.\n\nQue decisão você precisa de sabedoria para tomar?',
    verseRef: 'Tiago 1:5',
    verseText: 'Se algum de vocês tem falta de sabedoria, peça a Deus.',
    category: 'sabedoria',
    date: '',
  },
  {
    title: 'Fé Vencedora',
    content:
      'Agora a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que não se veem.\n\nA fé é a certeza das coisas que ainda não vemos. É o que nos conecta com as promessas de Deus. Sem fé, é impossível agradar a Deus.\n\nEm que você precisa exercer sua fé hoje?',
    verseRef: 'Hebreus 11:1',
    verseText: 'A fé é o firme fundamento das coisas que se esperam.',
    category: 'fé',
    date: '',
  },
  {
    title: 'Gratidão Eterna',
    content:
      'Dê gracias em todas as circunstâncias, pois esta é a vontade de Deus em Cristo Jesus para vocês.\n\nAgratidão não é apenas politeza - é a vontade de Deus para nós. Mesmo em meio às dificuldades, temos razões para agradecer. A gratidão muda nossa perspectiva.\n\nPor que você pode agradecer hoje, mesmo nas dificuldades?',
    verseRef: '1 Tessalonicenses 5:18',
    verseText: 'Dê graças em todas as circunstâncias, pois esta é a vontade de Deus.',
    category: 'gratidão',
    date: '',
  },
  {
    title: 'Luz para o Caminho',
    content:
      'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.\n\nA Palavra de Deus nos guia em cada decisão. Ela ilumina nosso caminho e nos mostra a vontade de Deus. Sem ela, andamos às cegas.\n\nVocê está buscando a orientação da Palavra de Deus em sua vida?',
    verseRef: 'Salmo 119:105',
    verseText: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.',
    category: 'sabedoria',
    date: '',
  },
  {
    title: 'Planos de Prosperidade',
    content:
      'Porque eu sei os planos que tenho para vocês, diz o SENHOR, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.\n\nDeus tem planos bons para você - não de dano, mas de esperança e futuro. Mesmo quando as coisas parecem escuras, Deus está trabalhando para o seu bem.\n\nVocê confia nos planos de Deus para sua vida?',
    verseRef: 'Jeremias 29:11',
    verseText: 'Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar.',
    category: 'esperança',
    date: '',
  },
  {
    title: 'Tudo é Possível',
    content:
      'Tudo posso naquele que me fortalece.\n\nPaulo escreveu isto de dentro de uma prisão! Ele sabia que, independentemente das circunstâncias, podia fazer tudo através de Cristo que o fortalecia. Esta é a nossa promessa também.\n\nO que parece impossível para você hoje? Lembre-se: você pode todas as coisas naquele que te fortalece.',
    verseRef: 'Filipenses 4:13',
    verseText: 'Tudo posso naquele que me fortalece.',
    category: 'força',
    date: '',
  },
  {
    title: 'Confiança Plena',
    content:
      'Confia no SENHOR de todo o teu coração, e não te apoiês no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.\n\nConfiar em Deus completamente não é fácil, mas é o caminho certo. Quando reconhecemos Deus em todos os nossos caminhos, Ele orienta nossos passos.\n\nEm que área você está tentando resolver sozinho, sem confiar em Deus?',
    verseRef: 'Provérbios 3:5-6',
    verseText:
      'Confia no SENHOR de todo o teu coração, e não te apoiês no teu próprio entendimento.',
    category: 'fé',
    date: '',
  },
  {
    title: 'Renovar as Forças',
    content:
      'Os que esperam no SENHOR renovarão as suas forças; subirão com asas como águias; correrão, e não se cansarão; e andarão, e não se fatigarão.\n\nQuando estamos exaustos, Deus quer nos renovar. Não é uma força temporária, mas uma renovação profunda que nos permite voar como águias.\n\nEm que área da sua vida você precisa de renovação?',
    verseRef: 'Isaías 40:31',
    verseText: 'Os que esperam no SENHOR renew as suas forças.',
    category: 'força',
    date: '',
  },
];

const getTodayMeditation = (): Meditation => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const meditation = DAILY_MEDITATIONS[dayOfYear % DAILY_MEDITATIONS.length];

  return {
    ...meditation,
    id: `meditation-${today.toISOString().split('T')[0]}`,
    date: today.toISOString().split('T')[0],
    read: false,
    favorited: false,
  };
};

interface MeditationState {
  meditations: Meditation[];
  todayMeditation: Meditation | null;
  favoriteMeditations: Meditation[];

  initializeTodayMeditation: () => void;
  markAsRead: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addReflection: (reflection: Omit<Meditation, 'id' | 'read' | 'favorited'>) => void;
  deleteReflection: (id: string) => void;
  updateReflection: (id: string, updates: Partial<Meditation>) => void;
}

export const useMeditationStore = create<MeditationState>()(
  persist(
    (set, get) => ({
      meditations: [],
      todayMeditation: null,
      favoriteMeditations: [],

      initializeTodayMeditation: () => {
        const today = getTodayMeditation();
        const state = get();

        const existingToday = state.meditations.find((m) => m.id === today.id);

        if (existingToday) {
          set({ todayMeditation: existingToday });
        } else {
          set((state) => ({
            meditations: [...state.meditations, today],
            todayMeditation: today,
          }));
        }
      },

      markAsRead: (id: string) => {
        set((state) => ({
          meditations: state.meditations.map((m) => (m.id === id ? { ...m, read: true } : m)),
          todayMeditation:
            state.todayMeditation?.id === id
              ? { ...state.todayMeditation, read: true }
              : state.todayMeditation,
        }));
      },

      toggleFavorite: (id: string) => {
        set((state) => {
          const meditation = state.meditations.find((m) => m.id === id);
          if (!meditation) return state;

          const updatedMeditation = { ...meditation, favorited: !meditation.favorited };
          const favorites = updatedMeditation.favorited
            ? [...state.favoriteMeditations, updatedMeditation]
            : state.favoriteMeditations.filter((m) => m.id !== id);

          return {
            meditations: state.meditations.map((m) => (m.id === id ? updatedMeditation : m)),
            todayMeditation:
              state.todayMeditation?.id === id ? updatedMeditation : state.todayMeditation,
            favoriteMeditations: favorites,
          };
        });
      },

      addReflection: (reflection: Omit<Meditation, 'id' | 'read' | 'favorited'>) => {
        const newReflection: Meditation = {
          ...reflection,
          id: `reflection-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          favorited: false,
        };

        set((state) => ({
          meditations: [newReflection, ...state.meditations],
        }));
      },

      deleteReflection: (id: string) => {
        set((state) => ({
          meditations: state.meditations.filter((m) => m.id !== id),
          favoriteMeditations: state.favoriteMeditations.filter((m) => m.id !== id),
        }));
      },

      updateReflection: (id: string, updates: Partial<Meditation>) => {
        set((state) => ({
          meditations: state.meditations.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },
    }),
    {
      name: 'bibleapp-meditations',
    }
  )
);
