import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility per combinare classi Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formattazione valuta italiana
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Formattazione percentuale
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Formattazione data italiana
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Formattazione data estesa
export function formatDateLong(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Validazione codice fiscale italiano
export function isValidCodiceFiscale(cf: string): boolean {
  if (!cf || cf.length !== 16) return false;
  
  const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
  if (!regex.test(cf.toUpperCase())) return false;
  
  // Controllo carattere di controllo
  const codiceNumerico = cf.substring(0, 15).toUpperCase();
  const carattereControllo = cf.charAt(15).toUpperCase();
  
  const caratteriDispari = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const caratteriPari = 'BAKPLCQDREVOSFTGUHMINJWZYX';
  const valoriDispari = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];
  const valoriPari = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  
  let somma = 0;
  
  for (let i = 0; i < 15; i++) {
    const char = codiceNumerico.charAt(i);
    const isNumeric = /[0-9]/.test(char);
    
    if (i % 2 === 0) { // Posizione dispari (1, 3, 5, ...)
      if (isNumeric) {
        somma += valoriDispari[parseInt(char)];
      } else {
        somma += valoriDispari[caratteriDispari.indexOf(char)];
      }
    } else { // Posizione pari (2, 4, 6, ...)
      if (isNumeric) {
        somma += valoriPari[parseInt(char)];
      } else {
        somma += valoriPari[caratteriDispari.indexOf(char)];
      }
    }
  }
  
  const resto = somma % 26;
  const carattereCalcolato = caratteriDispari.charAt(resto);
  
  return carattereCalcolato === carattereControllo;
}

// Validazione partita IVA italiana
export function isValidPartitaIva(piva: string): boolean {
  if (!piva || piva.length !== 11) return false;
  if (!/^[0-9]+$/.test(piva)) return false;
  
  // Algoritmo di controllo
  let somma = 0;
  for (let i = 0; i < 10; i++) {
    let cifra = parseInt(piva.charAt(i));
    if (i % 2 === 1) {
      cifra *= 2;
      if (cifra > 9) cifra = cifra - 9;
    }
    somma += cifra;
  }
  
  const checkDigit = (10 - (somma % 10)) % 10;
  return checkDigit === parseInt(piva.charAt(10));
}

// Calcolo giorni tra due date
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Conversione stringa in slug URL-friendly
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Generazione ID univoco
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Capitalizzazione prima lettera
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Calcolo percentuale di due numeri
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

// Arrotondamento a cifre decimali specifiche
export function roundTo(num: number, decimals: number): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Controllo se è mobile device
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// Copia testo negli appunti
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Errore copia negli appunti:', error);
    return false;
  }
} 

// === UTILITY PER PERSISTENZA DATI WIZARD ===

const WIZARD_STORAGE_KEY = 'ivalytics_wizard_data';
const WIZARD_STEP_KEY = 'ivalytics_wizard_step';

// Tipi per i dati del wizard
export interface WizardData {
  datiPersonali: Record<string, any>;
  codiceATECO: Record<string, any>;
  datiEconomici: Record<string, any>;
  lastStep: number;
  lastUpdate: string;
}

// Salva i dati del wizard nel localStorage
export function saveWizardData(data: Partial<WizardData>): void {
  try {
    if (typeof window === 'undefined') return;
    
    const existingData = loadWizardData();
    const updatedData: WizardData = {
      ...existingData,
      ...data,
      lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Errore salvataggio dati wizard:', error);
  }
}

// Carica i dati del wizard dal localStorage
export function loadWizardData(): WizardData {
  try {
    if (typeof window === 'undefined') {
      return getDefaultWizardData();
    }
    
    const savedData = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!savedData) {
      return getDefaultWizardData();
    }
    
    const parsedData = JSON.parse(savedData);
    
    // Verifica che i dati non siano troppo vecchi (7 giorni)
    const lastUpdate = new Date(parsedData.lastUpdate || 0);
    const now = new Date();
    const daysDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      clearWizardData();
      return getDefaultWizardData();
    }
    
    return {
      ...getDefaultWizardData(),
      ...parsedData
    };
  } catch (error) {
    console.error('Errore caricamento dati wizard:', error);
    return getDefaultWizardData();
  }
}

// Salva lo step corrente
export function saveWizardStep(step: number): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WIZARD_STEP_KEY, step.toString());
  } catch (error) {
    console.error('Errore salvataggio step wizard:', error);
  }
}

// Carica lo step corrente
export function loadWizardStep(): number {
  try {
    if (typeof window === 'undefined') return 0;
    const savedStep = localStorage.getItem(WIZARD_STEP_KEY);
    return savedStep ? parseInt(savedStep, 10) : 0;
  } catch (error) {
    console.error('Errore caricamento step wizard:', error);
    return 0;
  }
}

// Cancella i dati del wizard
export function clearWizardData(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    localStorage.removeItem(WIZARD_STEP_KEY);
  } catch (error) {
    console.error('Errore cancellazione dati wizard:', error);
  }
}

// Dati di default del wizard
function getDefaultWizardData(): WizardData {
  return {
    datiPersonali: {},
    codiceATECO: {},
    datiEconomici: {},
    lastStep: 0,
    lastUpdate: new Date().toISOString()
  };
}

// Auto-save con debounce per evitare troppe scritture
export const autoSaveWizardData = debounce((data: Partial<WizardData>) => {
  saveWizardData(data);
}, 1000);

// Verifica se ci sono dati salvati
export function hasWizardData(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const data = loadWizardData();
    return Object.keys(data.datiPersonali).length > 0 || 
           Object.keys(data.codiceATECO).length > 0 || 
           Object.keys(data.datiEconomici).length > 0;
  } catch (error) {
    return false;
  }
} 