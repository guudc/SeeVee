import { CVData, SavedCV } from '../types';

const STORAGE_KEY = 'seevee_saved_cvs';
const CURRENT_WORK_KEY = 'seevee_current_work';

export const storage = {
  getSavedCVs: (): SavedCV[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCV: (cv: SavedCV) => {
    const saved = storage.getSavedCVs();
    const index = saved.findIndex(s => s.id === cv.id);
    if (index > -1) {
      saved[index] = cv;
    } else {
      saved.push(cv);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  },

  deleteCV: (id: string) => {
    const saved = storage.getSavedCVs().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  },

  saveCurrentWork: (data: CVData) => {
    localStorage.setItem(CURRENT_WORK_KEY, JSON.stringify(data));
  },

  getCurrentWork: (): CVData | null => {
    const data = localStorage.getItem(CURRENT_WORK_KEY);
    return data ? JSON.parse(data) : null;
  }
};
