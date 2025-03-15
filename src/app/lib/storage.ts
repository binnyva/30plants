import { v4 as uuidv4 } from 'uuid';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export interface ListItem {
  id: string;
  content: string;
  position: number;
  completed: boolean;
}

export interface List {
  id: string;
  title: string;
  items: ListItem[];
  createdAt: string;
}

export interface Collection {
  id: string;
  title: string;
  items: CollectionItem[];
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  content: string;
  position: number;
}

class StorageService {
  private readonly LISTS_KEY = 'plant_lists';
  private readonly COLLECTIONS_KEY = 'plant_collections';

  private get storage() {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  }

  constructor() {
    // Skip initialization if running on server
    if (!this.storage) return;

    // Initialize storage if empty
    if (!this.storage.getItem(this.LISTS_KEY)) {
      this.storage.setItem(this.LISTS_KEY, JSON.stringify([]));
    }
    if (!this.storage.getItem(this.COLLECTIONS_KEY)) {
      this.storage.setItem(this.COLLECTIONS_KEY, JSON.stringify([]));
    }
  }

  private generateDefaultTitle(date: Date = new Date()): string {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    
    return `${format(date, 'yyyy')} W${format(date, 'ww')} ${format(weekStart, 'MMMM d')}-${format(weekEnd, 'd')}`;
  }

  // List operations
  getLists(): List[] {
    if (!this.storage) return [];
    const lists = this.storage.getItem(this.LISTS_KEY);
    return lists ? JSON.parse(lists) : [];
  }

  getList(id: string): List | null {
    if (!this.storage) return null;
    const lists = this.getLists();
    return lists.find(list => list.id === id) || null;
  }

  createList(title?: string): List {
    const lists = this.getLists();
    const newList: List = {
      id: uuidv4(),
      title: title || this.generateDefaultTitle(),
      items: [],
      createdAt: new Date().toISOString()
    };
    lists.push(newList);
    this.storage?.setItem(this.LISTS_KEY, JSON.stringify(lists));
    return newList;
  }

  updateList(id: string, updates: Partial<List>): List {
    const lists = this.getLists();
    const index = lists.findIndex(list => list.id === id);
    if (index === -1) throw new Error('List not found');

    const updatedList = { ...lists[index], ...updates };
    lists[index] = updatedList;
    this.storage?.setItem(this.LISTS_KEY, JSON.stringify(lists));
    return updatedList;
  }

  deleteList(id: string): void {
    const lists = this.getLists();
    const filteredLists = lists.filter(list => list.id !== id);
    this.storage?.setItem(this.LISTS_KEY, JSON.stringify(filteredLists));
  }

  // List item operations
  addListItem(listId: string, content: string): ListItem {
    const lists = this.getLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) throw new Error('List not found');

    const newItem: ListItem = {
      id: uuidv4(),
      content,
      position: lists[listIndex].items.length,
      completed: false
    };

    lists[listIndex].items.push(newItem);
    this.storage?.setItem(this.LISTS_KEY, JSON.stringify(lists));
    return newItem;
  }

  // Collection operations
  getCollections(): Collection[] {
    if (!this.storage) return [];
    const collections = this.storage.getItem(this.COLLECTIONS_KEY);
    return collections ? JSON.parse(collections) : [];
  }

  createCollection(title: string): Collection {
    const collections = this.getCollections();
    const newCollection: Collection = {
      id: uuidv4(),
      title,
      items: [],
      createdAt: new Date().toISOString()
    };
    collections.push(newCollection);
    this.storage?.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    return newCollection;
  }

  addCollectionItem(collectionId: string, content: string): CollectionItem {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    if (collectionIndex === -1) throw new Error('Collection not found');

    const newItem: CollectionItem = {
      id: uuidv4(),
      content,
      position: collections[collectionIndex].items.length
    };

    collections[collectionIndex].items.push(newItem);
    this.storage?.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    return newItem;
  }
}

export const storage = new StorageService(); 