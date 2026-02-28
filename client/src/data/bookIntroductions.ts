export interface BookIntroduction {
    bookId: string;
    title: string;
    author: string;
    context: string;
    theme: string;
    keyVerses: string[];
}

export const bookIntroductions: Record<string, BookIntroduction> = {
    '1': {
        bookId: '1',
        title: 'Gênesis',
        author: 'Moisés',
        context: 'Escrito durante o Êxodo para ensinar a Israel sobre suas origens e o Deus da Aliança.',
        theme: 'Inícios: a criação, a queda e a promessa de redenção através de uma família.',
        keyVerses: ['1:1', '3:15', '12:1-3']
    },
    '19': {
        bookId: '19',
        title: 'Salmos',
        author: 'Davi, Asafe, os filhos de Corá, Salomão, Moisés e outros.',
        context: 'Uma coleção de poemas e cânticos usados na adoração de Israel ao longo de séculos.',
        theme: 'Oração e Louvor: a resposta do coração humano às ações de Deus.',
        keyVerses: ['23:1', '51:10', '119:105']
    },
    '40': {
        bookId: '40',
        title: 'Mateus',
        author: 'Mateus (Levi)',
        context: 'Escrito principalmente para um público judeu para provar que Jesus é o Messias.',
        theme: 'O Rei e Seu Reino: Jesus como o cumprimento das profecias messiânicas.',
        keyVerses: ['5:3-12', '16:16', '28:18-20']
    },
    '43': {
        bookId: '43',
        title: 'João',
        author: 'João, o discípulo amado',
        context: 'Escrito para que os leitores creiam que Jesus é o Filho de Deus e tenham vida.',
        theme: 'A Divindade de Cristo: Jesus como o Verbo encarnado e a Luz do mundo.',
        keyVerses: ['1:1', '3:16', '14:6', '20:31']
    }
};
