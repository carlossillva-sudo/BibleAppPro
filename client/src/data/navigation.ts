export interface NavigationItem {
  name: string;
  path: string;
}

export const navigation: NavigationItem[] = [
  { name: 'Início', path: '/' },
  { name: 'BibleAppPro', path: '/dashboard' },
  { name: 'Leitor', path: '/reader' },
  { name: 'Biblioteca', path: '/library' },
  { name: 'Buscar', path: '/search' },
  { name: 'Favoritos', path: '/favorites' },
  { name: 'Planos', path: '/plans' },
  { name: 'Orações', path: '/prayers' },
  { name: 'Estatísticas', path: '/stats' },
  { name: 'Configurações', path: '/settings' },
];
