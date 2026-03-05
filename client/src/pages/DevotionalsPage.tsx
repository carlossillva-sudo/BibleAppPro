import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  X,
  BookOpen,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

interface DevotionalEntry {
  day: number;
  title: string;
  theme: string;
  verse: string;
  reference: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  content: string;
  reflection: string;
  prayer: string;
}

const DEVOTIONAL_DATA: DevotionalEntry[] = [
  {
    day: 1,
    title: 'O Primeiro Passo',
    theme: 'Fé',
    verse:
      'O SENHOR é o meu pastor; de nada terei falta. Ele me faz repousar em pastos verdejantes. Leva-me a águas tranqüilas. Restura a minha alma. Guia-me pelas sendas da justiça por amor do seu nome.',
    reference: 'Salmos 23:1-3',
    book: 'Salmos',
    chapter: 23,
    verseStart: 1,
    verseEnd: 3,
    content:
      'Cada grande jornada começa com um único passo de fé. Não importa quão pequeno pareça o início - o que importa é dar o primeiro passo confiando que Deus guie os próximos. A fé não é a ausência de dúvidas, mas a decisão de seguir mesmo quando não temos todas as respostas. Como um pastor que conduz suas ovelhas, Deus nos guia por caminhos que nem sempre entendemos, mas que nos levam a lugares de paz e restauração.',
    reflection:
      'Qual é o primeiro passo de fé que você precisa dar hoje? O que tem adiando por falta de certeza?',
    prayer:
      'Senhor, dai-me coragem para dar o primeiro passo mesmo sem ver todo o caminho. Que minha fé cresça a cada dia, não pela ausência de dúvidas, mas pela decisão de seguir-Te independentemente das circunstâncias. Guia-me, ó Pastor, pelos caminhos que me levem à Tua presença. Amém.',
  },
  {
    day: 2,
    title: 'Amor Incondicional',
    theme: 'Amor',
    verse:
      'Nisto conhecemos o amor: que ele deu a sua vida por nós, e nós devemos dar a vida pelos irmãos.',
    reference: '1 João 3:16',
    book: '1 João',
    chapter: 3,
    verseStart: 16,
    verseEnd: 16,
    content:
      'O amor de Deus não tem condições. Ele não nos ama porque somos bons, merecedores ou capazes de retribuir. Ele nos ama porque assim é a Sua natureza - o amor dEle é santo, perfeito e eterno. Este amor transforma completamente nossa forma de amar os outros. Quando entendemos a profundidade do sacrifício de Jesus na cruz, amar ao próximo deixa de ser um peso e passa a ser uma resposta natural à graça que nos alcançou.',
    reflection:
      'Como a consciência do amor de Deus por você muda a forma como você trata quem te magoou?',
    prayer:
      'Pai Celestial, mergulha-me profundamente no Teu amor inabalável. Que eu não tente amar por esforço próprio, mas que o Teu amor transborde naturalmente de meu coração para os outros. Ensina-me a amar como Cristo amou - sacrificialmente, sem condições e sem esperar nada em troca. Perdoa-me pelos momentos em que guardei mágoas. Amém.',
  },
  {
    day: 3,
    title: 'Luz no Caminho',
    theme: 'Sabedoria',
    verse:
      'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho. Jurei e me propus a cumprir os teus preceitos justos.',
    reference: 'Salmos 119:105-106',
    book: 'Salmos',
    chapter: 119,
    verseStart: 105,
    verseEnd: 106,
    content:
      'A Palavra de Deus é nossa luz nas situações escuras. Não é apenas um livro de regras ou conselhos úteis - é uma luz sobrenatural que ilumina cada step do nosso camino. Quando não sabemos que decisão tomar, quando o futuro parece incerto, podemos confiar que Sua palavra nos guia. Não precisamos ver todo o caminho - só precisamos ver o próximo passo e confiar que Ele iluminará o restante.',
    reflection:
      'Que decisão você precisa tomar hoje? Você tem buscado orientação na Palavra de Deus?',
    prayer:
      'Senhor, Tu és minha lâmpada e luz. Ilumina cada passo do meu caminho hoje. Não me deixes tropeçar nas trevas da incerteza. Que Tua palavra seja a bússola que orienta minhas decisões. Dai-me sabedoria para discernir Tua vontade em cada situação. Que eu não walks na minha própria compreensão, mas em todos os meus caminhos eu Te reconheça. Amém.',
  },
  {
    day: 4,
    title: 'Força na Fraqueza',
    theme: 'Força',
    verse:
      'O SENHOR é a minha força e o meu escudo; nelecreio o meu coração; fui socorrido, pelo que o meu coração exulta, e com o meu canto o louvarei.',
    reference: 'Salmos 28:7-8',
    book: 'Salmos',
    chapter: 28,
    verseStart: 7,
    verseEnd: 8,
    content:
      'Deus usa nossas fragilidades para mostrar Sua força. Quando nos achamos fracos demais, sem recursos, sem possibilidades, é exatamente aí que Sua graça é mais manifesta. A Palavra de Deus nos garante que Sua força se aperfeiçoa na nossa fraqueza. Não precisamos ser fortes por nós mesmos - precisamos apenas nosrender à força divina que nos sustenta e nos capacita além das nossas limitações humanas.',
    reflection:
      'Em que área da sua vida você se sente mais fraco? Você temallow Deus actuar através dessa fragilidade?',
    prayer:
      'Pai, reconheço minha fraqueza e limitação. Não busco minha própria força, mas anseio que Tua força se perfeicione em mim. Usa minhas fragilidades como oportunidades para Tua glória brilhar. Quando me sentir fraco, que eu lembre que em Ti tenho força abundante. Fortalece-me, ó Deus, para que eu possa servir e Te glorificar. Amém.',
  },
  {
    day: 5,
    title: 'Paz Interior',
    theme: 'Paz',
    verse:
      'Não se turbe o vosso coração; crede em Deus, crede também em mim. Na casa de meu Pai há muitas moradas; se assim não fosse, eu vo-lo teria dito; vou preparar-vos lugar.',
    reference: 'João 14:1-3',
    book: 'João',
    chapter: 14,
    verseStart: 1,
    verseEnd: 3,
    content:
      'A paz de Deus não depende das circunstâncias externas. Mesmo no meio das tempestades da vida, podemos ter uma paz profunda que vem do conhecimento de que Deus está no controle e que Ele prepara um lugar para nós. Esta paz é um presente que recebemos quando entregamos nossas ansiedades a Ele. Não é a ausência de problemas, mas a presença de Deus no meio deles.',
    reflection:
      'O que está roubando sua paz hoje? Você está carregando preocupações que deveria entregar a Deus?',
    prayer:
      'Senhor, minha paz não pode depender das circunstâncias. Turba-me o coração quando me preocupo com o futuro. Ensina-me a entregar-Te cada preocupação, sabendo que Tu és soberano sobre todas as coisas. Que a Tua paz, que excede todo entendimento, guarde meu coração e minha mente. Obrigado por me preparar um lugar na eternidade. Amém.',
  },
  {
    day: 6,
    title: 'Novo Amanhecer',
    theme: 'Renovação',
    verse:
      'As misericórdias do SENHOR são novas todas as manhãs; grande é a tua fidelidade. A minha parte é o SENHOR, diz a minha alma; por isso esperarei nele.',
    reference: 'Lamentações 3:23-26',
    book: 'Lamentações',
    chapter: 3,
    verseStart: 23,
    verseEnd: 26,
    content:
      'Cada dia é uma nova chance de recomeçar. Deus não guarda nossos erros do passado - Ele nos oferece misericórdia nova a cada manhã. Não importa o que aconteceu ontem, hoye é uma oportunidade de caminhar em novidade de vida. Esta é a natureza do Deus fiel: Suas misericórdias nunca acabam, são renovadas a cada amanhecer. Como filhos da luz, devemos viver cada dia como um presente divino.',
    reflection: 'O que você precisa deixar no ontem para começar hoye com o coração renado?',
    prayer:
      'Obrigado, Pai, por novas manhãs cheias de Tua misericórdia. Perdoa-me pelos erros de ontem e dai-me força para começar de novo hoje. Que eu não carregue o peso do passado, mas que viva cada dia como Tu me concederes. Ajuda-me a esperar em Ti, pois Tu és a minha porção. Que meu coração se regozije em Tua fidelidade eterna. Amém.',
  },
  {
    day: 7,
    title: 'Confiança Plena',
    theme: 'Confiança',
    verse:
      'Lança sobre o SENHOR o teu cuidado, e ele te susterá; nunca permitirá que o justo seja abalado.',
    reference: 'Salmos 55:22-23',
    book: 'Salmos',
    chapter: 55,
    verseStart: 22,
    verseEnd: 23,
    content:
      'Deus nos convida a lançar sobre Ele todas as nossas preocupações e cuidados. Não porque Ele precise saber de todos os detalhes, mas porque Ele quer nos libertar do peso da ansiedade. Não quer que carreguemos nossos fardos sozinhos. Quando depositamos nossa confiança nEle, descobrimos que Ele é fiel para nos sustentar em todas as circunstâncias. A confiança em Deus não é passividade - é entrega ativa que reconhece Sua soberania.',
    reflection: 'O que você está tentando carregar sozinho quando deveria lançar sobre Deus?',
    prayer:
      'Senhor, aprende a lançar sobre Ti todos os meus cuidados e preocupações. Não quero carregar fardos que Tu queres carregar por mim. Confio em Ti e sei que nunca permitirás que seja abalado. Sustenta-me em cada circunstância. Que minha confiança esteja sempre firmada em Ti, ó Deus fiel. Amém.',
  },
  {
    day: 8,
    title: 'Unidade na Diversidade',
    theme: 'Unidade',
    verse:
      'Eis quão bom e quão agradável é que os irmãos vivam em união. É como o óleo sagrado sobre a barba de Arão, que desce até à orla das suas vestes.',
    reference: 'Salmos 133:1-3',
    book: 'Salmos',
    chapter: 133,
    verseStart: 1,
    verseEnd: 3,
    content:
      'A unidade entre os crentes é uma testemunha poderosa para o mundo. Quando pessoas diferentes - com diferentes backgrounds, personalidadese dons - se reunem em amor, demonstramos ao mundo a natureza de Deus. A unidade não significa uniformidade ou concordância em tudo - significa amor apesar das diferenças, busca comum pela verdade, e disposição para carregar as cargas uns dos outros.',
    reflection:
      'Como você pode promover unidade no lugar onde você está? Há alguém de quem você se afastou?',
    prayer:
      'Pai, une os Teus filhos em amor e propósito. Que haja unidade no corpo de Cristo, não apenas tolerância, mas verdadeira comunhão. Guarda-me de division e bitterness. Ensina-me a carregar os fardos dos outros e a buscar a paz com todos os irmão. Que sejamos um testemunho para o mundo. Amém.',
  },
  {
    day: 9,
    title: 'Perseverança na Fé',
    theme: 'Perseverança',
    verse:
      'Sê forte, e não desanime o teu coração, tu e todo o povo que está contigo; porque melhor é fighting do que pecar; e antes coragem do que ter a vida em desprezo.',
    reference: '1 Crônicas 28:20-21',
    book: '1 Crônicas',
    chapter: 28,
    verseStart: 20,
    verseEnd: 21,
    content:
      'A jornada cristã não é uma corrida rápida, mas uma maratona. Haverá momentos de dificuldade, de desânimo e de prova. Mas Deus nos chama a perseverar até o fim. Cada desafio que enfrentamos nos fortalece e nos aproxima dEle. A perseverança não é TEimosia - é fidelidade. Não é força humana - é dependência divina. O premio não está no inicio, mas na linha de chegada.',
    reflection: 'O que te faz querer desistir? O que você precisa perseverar?',
    prayer:
      'Senhor, fortalece meu coração para que eu não desanime. Dai-me coragem para continuar mesmo quando o caminho fica difícil. Que eu lembre que a batalha é do SENHOR e que a vitória já está garantida em Cristo. Sustenta-me nas horas de prova e não me deixes waver. Que eu persevere até o fim. Amém.',
  },
  {
    day: 10,
    title: 'Gratidão Diária',
    theme: 'Gratidão',
    verse:
      'Em tudo, dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco. O Espírito de Deus e da glória desca sobre vós e vos cubra.',
    reference: '1 Tessalonicenses 5:18-19',
    book: '1 Tessalonicenses',
    chapter: 5,
    verseStart: 18,
    verseEnd: 19,
    content:
      'A gratidão transforma nossa perspectiva completamente. Quando escolhemos agradecer em todas as circunstâncias - não apenas nas boas, mas especialmente nas difíceis - descobrimos que temos muito mais pelo que louvar do que imaginamos. A gratidão é uma escolha, não uma emoção. É uma decisão de reconhecer a mão de Deus em cada situação. O apóstolo nos ordena a dar graças em tudo porque isso é a vontade de Deus para nós.',
    reflection:
      'Por que você é grato hoje? O que você pode agradecer mesmo nas circunstâncias difíceis?',
    prayer:
      'Senhor, ensina-me a agradecer em todas as circunstâncias, não apenas nas que considero boas. Transforma minha perspectiva para reconhecer Tuas bênçãos em cada situação. Dai-me um coração grato que Te louve em meio às provas. Que a gratidão seja o constante do meu coração. Obrigado por tudo, SENHOR. Amém.',
  },
  {
    day: 11,
    title: 'Humildade Cristã',
    theme: 'Humildade',
    verse:
      'Humilhai-vos, portanto, sob a poderosa mão de Deus, para que ele vos exalte no tempo devido, Derramando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
    reference: '1 Pedro 5:6-7',
    book: '1 Pedro',
    chapter: 5,
    verseStart: 6,
    verseEnd: 7,
    content:
      'A humildade não é se sentir menos ou inferior - é reconhecer que tudo o que temos, somos e temos vem de Deus. É entender que somos creados por Ele e dependentes dEle em cada momento. O caminho de Deus é sempre de descida antes da subida - Ele exalta os que se humilham. A humildade nos abre para receber a graça divina e nos protege do orgulho que separa de Deus.',
    reflection: 'Onde você precisa ser humilhado? Que área da sua vida precisa de mais humildade?',
    prayer:
      'Pai, ensina-me a verdadeira humildade. Não é sentir-me menos, mas reconhecer que tudo vem de Ti. Humilha meu coração para que possas exaltá-me no tempo devido. Tira de mim todo orgulho e presunção. Que eu me humilhe sob a Tua poderosa mão e receba a Tua graça. Ensina-me a servir com humildade. Amém.',
  },
  {
    day: 12,
    title: 'Esperança Eterna',
    theme: 'Esperança',
    verse:
      'Agora, pois, permanecem a fé, a esperança e o amor,这三个; porém a maior destas é o amor.',
    reference: '1 Coríntios 13:13',
    book: '1 Coríntios',
    chapter: 13,
    verseStart: 13,
    verseEnd: 13,
    content:
      'A esperança cristã não é wishful thinking ou otimismo humano - é uma certeza baseada nas promessas infalíveis de Deus. Sabemos que o futuro está nas mãos dEle e que todas as coisas cooperam para o bem daqueles que O amam. Esta esperança nos sustenta nos momentos mais difíceis, porque não é uma esperança vazia, mas uma certeza da vida eterna em Cristo. A esperança não desarma porque está fundada na Rocha que é Cristo.',
    reflection:
      'No que você tem esperança? Essa esperança está fundada em Deus ou nas circunstâncias?',
    prayer:
      'Senhor, aumenta minha esperança em Ti. Que ela não seja frágil como a esperança humana, mas firme e segura como a Tua promessa. Quando as circunstâncias pareçam sombrias, lembra-me que Tu és a minha esperança eterna. Obrigado pela certeza do céu e pela presença do Espírito agora. Minha esperança está em Ti. Amém.',
  },
  {
    day: 13,
    title: 'O Poder da Oração',
    theme: 'Oração',
    verse:
      'Orai sem cessar. Em tudo, pela oração e súplica, com ações de graças, sejam apresentadas a Deus as vossas petições.',
    reference: '1 Tessalonicenses 5:17-18',
    book: '1 Tessalonicenses',
    chapter: 5,
    verseStart: 17,
    verseEnd: 18,
    content:
      'A oração é nossa comunicação direta e constante com Deus. Não precisa de palavras elaboradas, liturgicales ou perfeitos - precisa de sinceridade. Deus ouve cada oração e responde de acordo com Sua vontade e sabedoria perfeita. Orav sem cessar significa manter uma postura de dependência contínua de Deus, lifting nossos corações a Ele em todo tempo e em toda situação. A oração é o respiro da alma cristã.',
    reflection: 'Você tem dedicado tempo consistente à oração? O que tem orado ultimamente?',
    prayer:
      'Senhor, ensina-me a orar sem cessar. Que minha vida seja uma oração contínua, um constante levantar meu coração a Ti. Dai-me sabedoria para orar conforme a Tua vontade. Não permita que eu negligencie a comunicação contigo. Que a oração seja o fundamento do meu dia. Ouvi minha oração, ó Deus. Amém.',
  },
  {
    day: 14,
    title: 'Liberdade em Cristo',
    theme: 'Liberdade',
    verse:
      'Conhecereis a verdade, e a verdade vos libertará. Respondeu-lhe Jesus: Em verdade, em verdade vos digo que todo aquele que comete pecado é escravo do pecado.',
    reference: 'João 8:32-34',
    book: 'João',
    chapter: 8,
    verseStart: 32,
    verseEnd: 34,
    content:
      'A liberdade que Cristo oferece é completa e eterna. Não é apenas liberdade de certos hábitos ou vícios - é liberdade da escravidão do pecado em todas as suas formas. Não é apenas liberdade para fazer o que queremos - é liberdade para fazer o que devemos. Esta liberdade nos liberta para servir, amar e abençoar os outros. A verdadeira liberdade não está na ausência de regras, mas na presença de Cristo.',
    reflection: 'Do que você precisa ser libertado? Há algum domínio em que você ainda é escravo?',
    prayer:
      'Senhor, Tua verdade me libertou e continua me libertando. Obrigado pela liberdade que tenho em Ti. Que eu não use essa liberdade como pretexto para a carne, mas como oportunidade para Te servir. Liberta-me de todo pecado que me prende. Ensina-me a viver na liberdade dos filhos de Deus. Amém.',
  },
  {
    day: 15,
    title: 'Bondade Radical',
    theme: 'Bondade',
    verse:
      'Sede bondosos uns para com os outros, com ternura, perdoando-vos reciprocamente, assim como Deus, em Cristo, vos perdoou.',
    reference: 'Efésios 4:32',
    book: 'Efésios',
    chapter: 4,
    verseStart: 32,
    verseEnd: 32,
    content:
      'A bondade cristã vai muito além da cordialidade superficial ou educação. Somos chamados a ser bondosos radicalmente - mesmo quando não merecemos, mesmo quando others nos tratam mal, mesmo quando a bondade nos custar algo. O modelo é Deus mesmo: Ele nos amou quando éramos inimigos, nos perdoou quando não merecíamos, e estendeu Sua bondade imerecida. A bondade transforma relacionamentos, comunidades e o mundo ao nosso redor.',
    reflection: 'Quem precisa da sua bondade hoje? Há alguém que você tem tratado com frieza?',
    prayer:
      'Pai, ensina-me a ser bondoso como Tu és bondoso. Perdoa-me os momentos em que fui duro, indiferente ou maldoso. Dai-me um coração que transborde bondade, mesmo quando não é merecido. Que minha bondade seja um reflexo do Teu amor. Usame para abençoar aqueles que encontro. Amém.',
  },
  {
    day: 16,
    title: 'Fé que Move Montanhas',
    theme: 'Fé',
    verse:
      'E, respondendo, disse-lhes: Se tiverdes fé como um grão de mostarda, direis a esta montanha: Transmuta-te daqui para lá, e ela se transmudará; e nada vos será impossível.',
    reference: 'Mateus 17:20-21',
    book: 'Mateus',
    chapter: 17,
    verseStart: 20,
    verseEnd: 21,
    content:
      'A fé verdadeira, mesmo que pequena como um grão de mostarda, tem poder transformador sobrenatural. Não é a quantidade de fé que importa, mas o objeto no qual ela está direcionada. Fé em Deus move o impossível. Fé não é otimismo ou pensamento positivo - é confiança absoluta na pessoa e nas promessas de Deus. Quando cremos de verdade, as montanhas se movem, os milagres acontecem, o impossível se torna possível.',
    reflection:
      'Em que área da sua vida você precisa exercitar mais fé? Há alguma montanha que precisa ser movida?',
    prayer:
      'Senhor, aumenta minha fé em Ti. Que ela não seja morta ou inoperante, mas viva e ativa. Dai-me fé que move montanhas. Não permita que a incredulidade me paralise. Creo que Tu podes fazer o impossível. Transforma minhas montanhas em planícies. Amém.',
  },
  {
    day: 17,
    title: 'Alegria do Senhor',
    theme: 'Alegria',
    verse:
      'A alegria do SENHOR é a vossa força; e a vossa exultação será no SENHOR. Mas vós vos alegrareis no SENHOR; os mansos terão abundantemente.',
    reference: 'Neemias 8:10-11',
    book: 'Neemias',
    chapter: 8,
    verseStart: 10,
    verseEnd: 11,
    content:
      'A alegria cristã não depende das circunstâncias externas. Ela vem do Espírito Santo que habita em nós. Esta alegria é uma força supernatural que nos sustenta nos momentos difíceis e nos capacita a servir com entusiasmo. Não é felicidade - que vem e vai - mas alegria profunda que permanece. É a certeza do amor de Deus, da salvação eterna e da presença constante do Espírito. A alegria do SENHOR é nossa força.',
    reflection:
      'O que está roubando sua alegria? Você está permitindo que circunstâncias determine seu estado de espírito?',
    prayer:
      'Senhor, Tua alegria é minha força. Não permitas que as circunstâncias me roubem a alegria que vem de Ti. Que eu me regozije no SENHOR em todas as circunstâncias. Sustenta-me nos momentos difíceis. Que minha alegria seja uma testemunha para outros. Obrigado pela Tua alegria que nunca falha. Amém.',
  },
  {
    day: 18,
    title: 'Sabedoria Divina',
    theme: 'Sabedoria',
    verse:
      'Se algum de vós falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, sem censuras, e ser-lhe-á dada.',
    reference: 'Tiago 1:5-8',
    book: 'Tiago',
    chapter: 1,
    verseStart: 5,
    verseEnd: 8,
    content:
      'Deus oferece sabedoria abundantemente para todos os que pedem. Não precisamos depender da nossa própria sabedoria limitada, falha e finita. Podemos acessar a sabedoria divina que nos guia corretamente em todas as decisões. A sabedoria de Deus é prática, aplicável e eterna. Ela nos ajuda a distinguir entre o que parece bom e o que realmente é bom. A sabedoria começa com o temor do SENHOR.',
    reflection:
      'Que decisão você precisa de sabedoria? Você tem buscado a sabedoria de Deus ou a sua própria?',
    prayer:
      'Pai, dai-me sabedoria para tomar decisões. Não confio na minha própria compreensão. Que Tua sabedoria me guie em cada caminho. Ensina-me a buscar-Te em tudo. Dai-me discernimento para distinguir o que é melhor. Que Tua sabedoria governe minha vida. Amém.',
  },
  {
    day: 19,
    title: 'Justiça e Misericórdia',
    theme: 'Justiça',
    verse:
      'Ele te anunciou, ó homem, o que é bom e que o SENHOR exige de ti: que faças justice, e ames a misericórdia, e andes humildemente com o teu Deus.',
    reference: 'Miquéias 6:8',
    book: 'Miquéias',
    chapter: 6,
    verseStart: 8,
    verseEnd: 8,
    content:
      'Deus nos pede que façamos justiça, amemos a misericórdia e andemos humildemente com nosso Deus. Estes três princípios andam juntos - não podemos ter um sem os outros. A justiça sem misericórdia é dura; a misericórdia sem justiça é permissiva. Busquemos viver nesta integração - sendo justos em nossas ações, misericordiosos em nossos relacionamentos e humildes em nossa postura diante de Deus e dos outros.',
    reflection: 'Como você pode praticar justiça e misericórdia ao mesmo tempo na sua vida?',
    prayer:
      'Senhor, ensina-me a fazer justiça, amar a misericórdia e andar em humildade. Não seja injusto por falta de coragem, nem permisso por falta de compaixão. Dai-me o equilíbrio que só Tu podes dar. Que eu ande em todos os Teus caminhos. Amém.',
  },
  {
    day: 20,
    title: 'Guardando o Coração',
    theme: 'Proteção',
    verse:
      'Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.',
    reference: 'Provérbios 4:23',
    book: 'Provérbios',
    chapter: 4,
    verseStart: 23,
    verseEnd: 23,
    content:
      'O coração é o centro do nosso ser - emocional, espiritual e voluntário. O que permitimos entrar em nosso coração determina a direção da nossa vida. Precisamos ser vigilantes sobre o que vemos, ouvimos, lemos e deixamos nos influenciar. Um coração guardado é um coração que medita nas coisas de Deus, que reflete sobre Sua palavra e que está firmado nEle. O coração não guardado é vulnerável aos ataques do inimigo.',
    reflection:
      'O que está entrando no seu coração ultimamente? Que influências estão moldando seus pensamentos?',
    prayer:
      'Pai, guarda meu coração de tudo que é maligno. Filtra tudo o que entra em minha mente e coração. Que eu medite nas Tuas coisas, não nas coisas do mundo. Cria em mim um coração puro, ó Deus. Sustenta o meu coração para que eu não me desvie. Amém.',
  },
  {
    day: 21,
    title: 'Servo de Todos',
    theme: 'Serviço',
    verse:
      'O maior entre vós seja como o menor, e quem governa como o que serve. Pois, qual é o maior: o que está à mesa, ou o que serve? Porventura, não é o que está à mesa? Eu, porém, estou entre vós como o que serve.',
    reference: 'Lucas 22:26-27',
    book: 'Lucas',
    chapter: 22,
    verseStart: 26,
    verseEnd: 27,
    content:
      'A grandeza no Reino de Deus é completamente invertida em relação ao mundo. Aqueles que servem são considerados os maiores. O serviço não nos diminui - nos eleva. Servir aos outros é servir a Cristo. O próprio Jesus nos deu o exemplo - Ele, que é o Rei dos reis, veio não para ser servido, mas para servir e dar Sua vida em resgate por muitos. O serviço cristão é um privilégio, não um fardo.',
    reflection: 'Como você pode servir hoje? Há alguém ao seu redor que precisa de ajuda?',
    prayer:
      'Senhor, ensina-me a servir com humildade. Não busco ser servido, mas servir. Dai-me oportunidades para abençoar os outros. Remove de mim todo espírito de superioridade. Que eu seja útil ao próximo como Tu fostes útil a mim. Usame para servir, não para ser servido. Amém.',
  },
  {
    day: 22,
    title: 'Palavra Viva',
    theme: 'Palavra',
    verse:
      'As minhas palavras são espírito e são vida. E a carne não aproveita nada; as palavras que eu vos digo são espírito e são vida.',
    reference: 'João 6:63-64',
    book: 'João',
    chapter: 6,
    verseStart: 63,
    verseEnd: 64,
    content:
      'A Palavra de Deus não é apenas tinta em papel ou caracteres em uma tela - é espírito e vida. Ela tem poder para transformar, restaurar e renovar. Quando nos alimentamos dela, recebemos vida sobrenatural. A Palavra de Deus é viva, ativa e mais afiada que qualquer espada de dois gumes. Ela penetra até o íntimo do coração e revela pensamentos e intenções. Não é uma palavra morta - é vida em ação.',
    reflection:
      'Você tem leído a Palavra diariamente? Como você está se alimentando da Palavra de Deus?',
    prayer:
      'Senhor, que Tua palavra seja espírito e vida em mim. Não quero apenas ler Tua palavra - quero vivê-la. Transforma-me por ela. Que ela seja minha guia diária. Dai-me fome pela Tua palavra. Que eu coma e digira as Escrituras. Amém.',
  },
  {
    day: 23,
    title: 'Vitória na Luta',
    theme: 'Vitória',
    verse:
      'Em todas estas coisas somos mais que vencedores, por aquele que nos amou. Porque eu estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir, nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que é em Cristo Jesus, nosso Senhor.',
    reference: 'Romanos 8:37-39',
    book: 'Romanos',
    chapter: 8,
    verseStart: 37,
    verseEnd: 39,
    content:
      'Em Cristo, já somos vencedores. As lutas que enfrentamos não são para determinar nosso destino - são para revelar e aumentar nossa vitória em Cristo. Não enfrentamos a vida em nossa própria força, mas na dEle. A vitória já está garantida! Nada pode nos separar do amor de Deus. Nem a morte, nem a vida, nem quaisquer circunstâncias. Somos mais que vencedores porque Aquele que nos amou já venceu a maior batalha por nós.',
    reflection:
      'Qual luta você enfrenta hoje? Você está fightando em sua própria força ou na de Cristo?',
    prayer:
      'Senhor, sei que em Ti sou mais que vencedor. Não permitirei que as lutas me definam. Tu já venceste a batalha por mim. Obrigado pelo amor que nada pode separar. Que eu viva na vitória que já é minha em Cristo. Sustenta-me nas lutas. Amém.',
  },
  {
    day: 24,
    title: 'Compaixão Genuína',
    theme: 'Compaixão',
    verse:
      'Regozijai-vos com os que se regozijam; chorai com os que choram. Sede uns para com os outros de igual sentimento.',
    reference: 'Romanos 12:15-16',
    book: 'Romanos',
    chapter: 12,
    verseStart: 15,
    verseEnd: 16,
    content:
      'A compaixão cristã nos conecta genuinamente com o sofrimento dos outros. Não é apenas sentir pena à distância - é sentir com, participar da dor, caminhar ao lado. Esta empatia nos capacita a ser presença de Deus na dor alheia. A compaixão autêntica nos move à ação - não ficamos indiferentes ao sofrimento, mas buscamos Ways de confortar e ajudar. Ser compassivo é ser instrumento do amor de Deus no mundo.',
    reflection: 'Quem está sofrendo ao seu redor? Você tem demonstrado compaixão genuína?',
    prayer:
      'Pai, dai-me compaixão para chorar com os que choram. Não me dejes ser indiferente ao sofrimento dos outros. Ensina-me a sentir com, não apenas sentir pena. Usa-me como instrumento de consolação. Que meu coração se mova comTu compaixão. Amém.',
  },
  {
    day: 25,
    title: 'Crescimento Espiritual',
    theme: 'Crescimento',
    verse:
      'Crescereis na graça e no conhecimento de nosso Senhor e Salvador Jesus Cristo. A ele seja dada glória, assim agora como no dia da eternidade.',
    reference: '2 Pedro 3:18',
    book: '2 Pedro',
    chapter: 3,
    verseStart: 18,
    verseEnd: 18,
    content:
      'O cristão não deve permanecer sempre no mesmo lugar espiritual. Somos chamados a crescer continuamente na graça e no conhecimento de Cristo. O crescimento espiritual é um processo diário - não acontece de uma vez, mas gradualmente, através de prática persistente da fé. Cada dia devemos nos tornar mais semelhantes a Cristo, mais cheios de Sua graça, mais profundos em Seu conhecimento. O crescimento é证据 de vida espiritual saudável.',
    reflection:
      'Em que área você precisa crescer espiritualmente? O que você tem feito para crescer?',
    prayer:
      'Senhor, quero crescer na graça e no conhecimento. Não quero permanecer infantil na fé. Molda-me cada dia mais a Tua imagem. Dai-me sede de crescimento. Usa as circunstâncias da vida para me madurar. Que eu cresça continuamente. Amém.',
  },
  {
    day: 26,
    title: 'Fé Viva',
    theme: 'Fé',
    verse:
      'A fé é o firme fundamento das coisas que se esperam e a prova das que se não veem. Porque os antigos obtiveram bom testemunho pela fé.',
    reference: 'Hebreus 11:1-3',
    book: 'Hebreus',
    chapter: 11,
    verseStart: 1,
    verseEnd: 3,
    content:
      'A fé é confiança total em Deus, mesmo quando não vemos ou não entendemos. Ela nos conecta com o invisível e nos dá certeza do que ainda não chegou. Fé ativa é fé que produz resultados - obras, mudanças, persistência. A fé não é irracional - é a forma mais elevada de conhecimento, porque se baseia na personagem de Deus e em Suas promessas infalíveis. Os heróis da fé do AT obtiveram bom testemunho porque creram.',
    reflection:
      'Em que área da sua vida você precisa exercitar a fé? Você está crendo ou duvidando?',
    prayer:
      'Senhor, aumenta minha fé. Que ela seja viva e operativa, não morta e inoperante. Dai-me fé que produz resultados. Que eu creia mesmo quando não vejo. Sustenta minha fé nas dúvidas. Que minha fé seja firm foundation. Amém.',
  },
  {
    day: 27,
    title: 'Amor que Perdoa',
    theme: 'Perdão',
    verse:
      'Antes, sede uns para com os outros benignos, compassivos, perdoando-vos reciprocamente, assim como Deus, em Cristo, vos perdoou.',
    reference: 'Efésios 4:32',
    book: 'Efésios',
    chapter: 4,
    verseStart: 32,
    verseEnd: 32,
    content:
      'O perdão é uma das marcas mais distintas do cristão. Não guardamos mágoas, ressentimentos ou amarguras porque fomos perdoados imensamente por Deus. O perdão não significa aprovação do mal - significa liberação do direito de retaliación. O perdão liberta tanto quem perdoa quanto quem é perdoado. Escolher perdoar é escolher a liberdade, não a escravidão do ressentimento. Como Deus nos perdoou em Cristo, devemos perdoar os outros.',
    reflection: 'Quem você precisa perdoar? O que você está guardando em seu coração?',
    prayer:
      'Pai, ensina-me a perdoar como Tu me perdoaste. Não quero carregar mágoas que me pesam. Liberta-me do ressentimento. Que eu perdoe como Tu perdoas - completamente e sem reservas. Não permitas que o amargura crie raízes. Perdoo como quer ser perdoado. Amém.',
  },
  {
    day: 28,
    title: 'Princípios do Reino',
    theme: 'Reino',
    verse:
      'Buscai, primeiro, o reino de Deus e a sua justiça, e todas as coisas vos serão adicionadas. Não vos preocupeis, dizendo: Que comeremos? Que beberemos? Ou: Com que nos vestiremos?',
    reference: 'Mateus 6:33-34',
    book: 'Mateus',
    chapter: 6,
    verseStart: 33,
    verseEnd: 34,
    content:
      'Quando colocamos o Reino de Deus em primeiro lugar em nossa vida, tudo o mais se organiza naturalmente. Não precisamos nos preocuparpela nossa vida - Deus prove o que precisamos. Buscar primeiro o reino significa priorizar a vontade de Deus em todas as decisões, buscar Sua justiça em nosso comportamento, e viver para Seu propósito. Quando Deus é primeiro, as necessidades materiais são supridas por Ele.',
    reflection:
      'O que você tem buscado em primeiro lugar? Suas preocupações estão revelando suas prioridades?',
    prayer:
      'Senhor, ajuda-me a buscar Teu reino acima de tudo. Que Tua vontade seja minha prioridade. Não me deixes buscar primeiras as coisas do mundo. Confio em Tua provisão. Quando buscar Ti, tudo o mais virá. Ensina-me a buscar primeiro. Amém.',
  },
  {
    day: 29,
    title: 'Discernimento Espiritual',
    theme: 'Discernimento',
    verse:
      'Esforçai-vos por entrar por uma porta estreita, porque muitos, vosso digo, procurarão entrar e não poderão. Depois que o dono da casa se levantar e fechar a porta, vós, do lado de fora, batereis, dizendo: Senhor, abre-nos; e ele responderá: Não sei donde vós pertenceis.',
    reference: 'Lucas 13:24-28',
    book: 'Lucas',
    chapter: 13,
    verseStart: 24,
    verseEnd: 28,
    content:
      'Nem toda porta aberta é de Deus. Precisamos de discernimento espiritual para distinguir a voz de Deus das outras vozes, o caminho de Deus dos caminhos do mundo. O discernimento é uma dádiva do Espírito que nos ajuda a entender a vontade de Deus em situações específicas. Sem discernimento, podemos ser facilmente enganados. Ore por sabedoria para tomar decisões corretas e para não ser enganado.',
    reflection: 'Que decisões você precisa discernir? Você está orando por discernimento?',
    prayer:
      'Senhor, dai-me discernimento para distinguir Tua voz. Não me deixes ser enganado. Guia-me pelo caminho correto. Ensina-me a discernir a vontade de Deus. Que o Espírito me guie em toda a verdade. Proteja-me dos enganos. Amém.',
  },
  {
    day: 30,
    title: 'Paciência Produz Firmeza',
    theme: 'Paciência',
    verse:
      'A firme esperança produz a paciência. Creio que vos aproveita o padecimento presente, para que a vossa fé, sujeita a prova, seja mais valiosa do que o ouro que perece, embora provado pelo fogo, seja achada em louvor, honra e glória, na revelação de Jesus Cristo.',
    reference: 'Romanos 12:12',
    book: 'Romanos',
    chapter: 12,
    verseStart: 12,
    verseEnd: 12,
    content:
      'A paciência é uma fruta do Espírito Santo. Ela não é passividade ou indiferença - é confiança ativa e persistente de que Deus está operando mesmo quando não vemos resultados. Quando esperamos no SENHOR, somos fortalecidos. A paciência é desenvolvida através das provações - elas nos moldam e nos fortalecem. A esperança firme nos capacita a perseverar. Não é questão de esperar passivamente, mas de confiar ativamente.',
    reflection:
      'O que você está esperando Deus fazer? Você está esperando com esperança ou com impaciência?',
    prayer:
      'Senhor, ensina-me a ter paciência enquanto espero em Ti. Não me deixe waver. Fortalece minha esperança. Que eu espere com confiança, não com ansiedade. Usa as wait para me madurar. A paciência produz firmez. Amém.',
  },
  {
    day: 31,
    title: 'Diligência no Serviço',
    theme: 'Diligência',
    verse:
      'Não seja preguiçoso no que diz respeito ao que você tem a fazer; pelo contrário, seja fervoroso no espírito, servindo ao SENHOR. alegrai-vos na esperança, sede pacientes na tribulação, persistentes na oração.',
    reference: 'Romanos 12:11-13',
    book: 'Romanos',
    chapter: 12,
    verseStart: 11,
    verseEnd: 13,
    content:
      'Somos chamados à diligência no serviço ao SENHOR. Não há espaço para a preguiça espiritual quando entendemos o privilégio de servir. Ser fervoroso no espírito significa estar animado, dedicado e zeloso nas coisas de Deus. O serviço cristão não é obrigação - é privilégio. Não é fardo - é alegria. A diligência traz recompensa; a preguiça traz ruína. Devemos servir com todo o nosso ser.',
    reflection:
      'Onde você tem sido preguiçoso? O que você tem negligenciado em seu serviço a Deus?',
    prayer:
      'Pai, dai-me zelo para Te servir com diligência. Não sejais preguiçoso nas coisas que devo fazer. Que eu seja fervoroso no espírito. Animame para servir-Te com alegria. Que meu serviço seja oferta de amor. Usa-me abundantemente. Amém.',
  },
];

export const DevotionalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  });
  const [readDays, setReadDays] = useState<Set<number>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('read-devotionals') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVerseModal, setShowVerseModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('read-devotionals', JSON.stringify([...readDays]));
  }, [readDays]);

  const getDevotionalForDay = (day: number): DevotionalEntry => {
    const index = (day - 1) % DEVOTIONAL_DATA.length;
    return DEVOTIONAL_DATA[index];
  };

  const currentDevotional = useMemo(() => getDevotionalForDay(selectedDay), [selectedDay]);
  const isRead = readDays.has(selectedDay);

  const toggleRead = () => {
    setReadDays((prev) => {
      const next = new Set(prev);
      next.has(selectedDay) ? next.delete(selectedDay) : next.add(selectedDay);
      return next;
    });
  };

  const copyVerse = () => {
    navigator.clipboard.writeText(`"${currentDevotional.verse}" - ${currentDevotional.reference}`);
  };

  const goToBible = () => {
    navigate(
      `/leitor?livro=${currentDevotional.book}&capitulo=${currentDevotional.chapter}&versiculo=${currentDevotional.verseStart}`
    );
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDayClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const start = new Date(currentYear, 0, 0);
    setSelectedDay(Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const goToPrevDay = () => setSelectedDay((d) => (d > 1 ? d - 1 : 365));
  const goToNextDay = () => setSelectedDay((d) => (d < 365 ? d + 1 : 1));

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
      <div className="p-2 border-b bg-card/20 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          <Button variant="ghost" size="sm" onClick={goToPrevDay} className="shrink-0 h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const date = new Date(currentYear, currentMonth, day);
            const start = new Date(currentYear, 0, 0);
            const dayOfYear = Math.floor(
              (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );
            const active = selectedDay === dayOfYear;
            const read = readDays.has(dayOfYear);
            const isToday = day === today.getDate();
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'shrink-0 h-8 min-w-8 px-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5',
                  active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted bg-muted/30',
                  isToday && !active && 'border border-primary'
                )}
              >
                <span>{day}</span>
                {read && !active && <span className="w-1 h-1 bg-emerald-500 rounded-full" />}
              </button>
            );
          })}

          <Button variant="ghost" size="sm" onClick={goToNextDay} className="shrink-0 h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div className="text-center">
          <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold">
            {currentDevotional.theme}
          </span>
          <h2 className="text-lg font-black mt-1">{currentDevotional.title}</h2>
        </div>

        <button
          onClick={() => setShowVerseModal(true)}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white p-3 rounded-xl text-center cursor-pointer"
        >
          <p className="text-sm font-serif italic">"{currentDevotional.verse}"</p>
          <div className="flex items-center justify-center gap-1 text-blue-200 text-xs font-bold mt-1">
            <Bookmark className="h-3 w-3" />
            <span>{currentDevotional.reference}</span>
          </div>
        </button>

        <p className="text-sm text-muted-foreground leading-relaxed">{currentDevotional.content}</p>

        <div className="grid grid-cols-1 gap-2">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
            <h4 className="text-xs font-bold text-orange-600 uppercase mb-1">Reflexão</h4>
            <p className="text-sm italic text-muted-foreground">{currentDevotional.reflection}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <h4 className="text-xs font-bold text-blue-600 uppercase mb-1">Oração</h4>
            <p className="text-sm text-muted-foreground">{currentDevotional.prayer}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleRead}
            className={cn(
              'flex-1 h-9 rounded-lg font-bold text-xs',
              isRead ? 'bg-emerald-500' : ''
            )}
          >
            {isRead ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" /> Lido
              </>
            ) : (
              'Marcar lido'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFavorite(!isFavorite)}
            className="h-9 px-2 rounded-lg"
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
          </Button>
          <Button variant="outline" onClick={copyVerse} className="h-9 px-2 rounded-lg">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToBible} className="h-9 px-2 rounded-lg">
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showVerseModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVerseModal(false)}
        >
          <div
            className="bg-background rounded-xl p-4 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm">Versículo</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowVerseModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-base font-serif italic text-center mb-2">
              "{currentDevotional.verse}"
            </p>
            <p className="text-center font-bold text-xs text-primary mb-3">
              {currentDevotional.reference}
            </p>
            <div className="flex gap-2">
              <Button onClick={copyVerse} className="flex-1" variant="outline" size="sm">
                <Copy className="h-3 w-3 mr-1" /> Copiar
              </Button>
              <Button onClick={goToBible} className="flex-1" size="sm">
                <BookOpen className="h-3 w-3 mr-1" /> Ler na Biblia
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevotionalsPage;
