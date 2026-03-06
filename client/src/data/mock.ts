export interface HomeData {
  greeting: string;
  dailyVerse: {
    reference: string;
    text: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
}

export interface StudioData {
  title: string;
  features: {
    title: string;
    description: string;
  }[];
}

export interface BibleReadingData {
  books: {
    id: string;
    name: string;
  }[];
  chapters: number[];
  verses: {
    number: string;
    text: string;
  }[];
}

export const HOME_MOCK: HomeData = {
  greeting: 'Bem-vindo',
  dailyVerse: {
    reference: 'João 3:16',
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito',
  },
  stats: [
    { label: 'Livros Lidos', value: '0' },
    { label: 'Capítulos', value: '0' },
    { label: 'Versículos', value: '0' },
  ],
};

export const STUDIO_MOCK: StudioData = {
  title: 'Estúdio',
  features: [
    { title: 'Criação', description: 'Crie conteúdo bíblico' },
    { title: 'Edição', description: 'Edite seus textos' },
  ],
};

export const BIBLE_READING_MOCK: BibleReadingData = {
  books: [],
  chapters: [],
  verses: [],
};
