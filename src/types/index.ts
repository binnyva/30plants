export interface PlantItem {
  id: string;
  name: string;
  createdAt: string;
}

export interface PlantList {
  id: string;
  title: string;
  items: PlantItem[];
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  items: PlantItem[];
  createdAt: string;
}

export interface AppData {
  lists: PlantList[];
  collections: Collection[];
}

export interface Settings {
  theme: 'light' | 'dark';
} 