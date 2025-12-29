import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetalSession } from '../types/session';

const STORAGE_KEY = 'FETAL_SESSIONS';

export const getSessions = async (): Promise<FetalSession[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveSession = async (session: FetalSession) => {
  const existing = await getSessions();
  const updated = [session, ...existing];

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};
