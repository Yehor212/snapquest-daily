// Утилиты для локального хранения данных
// Использует localStorage для простых данных и IndexedDB для фото

const STORAGE_KEYS = {
  USER: 'snapquest_user',
  EVENTS: 'snapquest_events',
  HUNT_PROGRESS: 'snapquest_hunt_progress',
  SAVED_CHALLENGES: 'snapquest_saved_challenges',
  USER_IDEAS: 'snapquest_user_ideas',
  SETTINGS: 'snapquest_settings',
} as const;

// ============ localStorage утилиты ============

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// ============ User Storage ============

import type { User, PrivateEvent, HuntProgress, GeneratedChallenge, UserChallengeIdea } from '@/types';

export function getUser(): User | null {
  return getStorageItem<User | null>(STORAGE_KEYS.USER, null);
}

export function saveUser(user: User): void {
  setStorageItem(STORAGE_KEYS.USER, user);
}

export function updateUserXp(xpToAdd: number): User | null {
  const user = getUser();
  if (user) {
    user.xp += xpToAdd;
    // Level up every 500 XP
    user.level = Math.floor(user.xp / 500) + 1;
    saveUser(user);
  }
  return user;
}

export function updateUserStreak(): User | null {
  const user = getUser();
  if (user) {
    user.streak += 1;
    saveUser(user);
  }
  return user;
}

// ============ Events Storage ============

export function getEvents(): PrivateEvent[] {
  return getStorageItem<PrivateEvent[]>(STORAGE_KEYS.EVENTS, []);
}

export function saveEvent(event: PrivateEvent): void {
  const events = getEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  setStorageItem(STORAGE_KEYS.EVENTS, events);
}

export function getEventByCode(code: string): PrivateEvent | undefined {
  const events = getEvents();
  return events.find(e => e.accessCode.toUpperCase() === code.toUpperCase());
}

export function deleteEvent(eventId: string): void {
  const events = getEvents().filter(e => e.id !== eventId);
  setStorageItem(STORAGE_KEYS.EVENTS, events);
}

// ============ Hunt Progress Storage ============

export function getHuntProgress(): Record<string, HuntProgress> {
  return getStorageItem<Record<string, HuntProgress>>(STORAGE_KEYS.HUNT_PROGRESS, {});
}

export function saveHuntProgress(huntId: string, progress: HuntProgress): void {
  const allProgress = getHuntProgress();
  allProgress[huntId] = progress;
  setStorageItem(STORAGE_KEYS.HUNT_PROGRESS, allProgress);
}

export function getHuntProgressById(huntId: string): HuntProgress | undefined {
  return getHuntProgress()[huntId];
}

// ============ Saved Challenges Storage ============

export function getSavedChallenges(): GeneratedChallenge[] {
  return getStorageItem<GeneratedChallenge[]>(STORAGE_KEYS.SAVED_CHALLENGES, []);
}

export function saveChallenge(challenge: GeneratedChallenge): void {
  const challenges = getSavedChallenges();
  challenges.unshift({ ...challenge, isSaved: true });
  setStorageItem(STORAGE_KEYS.SAVED_CHALLENGES, challenges);
}

export function removeSavedChallenge(challengeId: string): void {
  const challenges = getSavedChallenges().filter(c => c.id !== challengeId);
  setStorageItem(STORAGE_KEYS.SAVED_CHALLENGES, challenges);
}

// ============ User Ideas Storage ============

export function getUserIdeas(): UserChallengeIdea[] {
  return getStorageItem<UserChallengeIdea[]>(STORAGE_KEYS.USER_IDEAS, []);
}

export function saveUserIdea(idea: UserChallengeIdea): void {
  const ideas = getUserIdeas();
  ideas.unshift(idea);
  setStorageItem(STORAGE_KEYS.USER_IDEAS, ideas);
}

export function voteForIdea(ideaId: string): void {
  const ideas = getUserIdeas();
  const idea = ideas.find(i => i.id === ideaId);
  if (idea) {
    idea.votes += 1;
    setStorageItem(STORAGE_KEYS.USER_IDEAS, ideas);
  }
}

// ============ IndexedDB для фото (idb-keyval pattern) ============

const DB_NAME = 'snapquest_photos';
const STORE_NAME = 'photos';
let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbPromise;
}

import type { Photo } from '@/types';

export async function savePhoto(photo: Photo): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(photo);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPhoto(id: string): Promise<Photo | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getAllPhotos(): Promise<Photo[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPhotosByFilter(filter: {
  challengeId?: string;
  eventId?: string;
  huntTaskId?: string;
}): Promise<Photo[]> {
  const photos = await getAllPhotos();
  return photos.filter(photo => {
    if (filter.challengeId && photo.challengeId !== filter.challengeId) return false;
    if (filter.eventId && photo.eventId !== filter.eventId) return false;
    if (filter.huntTaskId && photo.huntTaskId !== filter.huntTaskId) return false;
    return true;
  });
}

// ============ ID генерация ============

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============ Access Code генерация ============

export function generateAccessCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}
