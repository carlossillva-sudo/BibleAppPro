export interface DictionaryEntry {
    word: string;
    definition: string;
    category?: string;
}

export const dictionaryData: DictionaryEntry[] = [
    { word: 'Graça', definition: 'Favor imerecido de Deus para com o homem.', category: 'Teologia' },
    { word: 'Fé', definition: 'A certeza daquilo que se espera e a prova das coisas que não se vêem.', category: 'Teologia' },
    { word: 'Justificação', definition: 'Ato judicial de Deus pelo qual Ele declara justo o pecador que crê em Cristo.', category: 'Doutrina' },
    { word: 'Santificação', definition: 'Processo de purificação e separação para o serviço de Deus.', category: 'Doutrina' },
    { word: 'Messias', definition: 'O Ungido; o Salvador prometido nas Escrituras.', category: 'Cristologia' },
    { word: 'Ágape', definition: 'Amor incondicional e sacrificial de Deus.', category: 'Termologia' },
    { word: 'Logos', definition: 'A Palavra; termo usado para descrever a natureza divina de Cristo.', category: 'Teologia' },
    { word: 'Aliança', definition: 'Acordo ou pacto solene entre Deus e o Seu povo.', category: 'Bíblico' },
    { word: 'Pecado', definition: 'Errar o alvo; transgressão da lei de Deus.', category: 'Doutrina' },
    { word: 'Redenção', definition: 'O ato de comprar de volta ou libertar mediante o pagamento de um resgate.', category: 'Salvação' }
];
