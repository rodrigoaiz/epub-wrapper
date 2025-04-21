export interface MenuItem {
  title: string;
  href: string;
  children?: MenuItem[];
}

export interface NavigationData {
  title: string;
  items: MenuItem[];
}
