# IVAlytics 🧮

Una webapp moderna per il calcolo semplificato di imposte e contributi, progettata con un'ottima UX/UI per guidare l'utente in ogni fase del processo.

## 🚀 Caratteristiche Principali

- **Calcolo Intelligente**: Engine completo per imposte e contributi
- **Guida ATECO**: Sistema intelligente per suggerimento codici ATECO
- **UX Ottimizzata**: Interfaccia moderna e intuitiva
- **Wizard Guidato**: Processo step-by-step per ogni calcolo
- **Design Responsive**: Perfetto su desktop e mobile

## 🛠 Tecnologie Utilizzate

- **Next.js 14** con App Router
- **TypeScript** per type safety
- **MongoDB** con Mongoose
- **Tailwind CSS** per styling
- **Framer Motion** per animazioni
- **React Hook Form** + Zod per validazione
- **Chart.js** per visualizzazioni

## 📦 Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Copia il file di configurazione:
   ```bash
   cp .env.example .env.local
   ```

4. Configura le variabili d'ambiente in `.env.local`

5. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

6. Apri [http://localhost:3000](http://localhost:3000) nel browser

## 🚀 Deployment su Vercel

Il progetto è configurato per il deployment automatico su Vercel:

1. Connetti il repository a Vercel
2. Configura le variabili d'ambiente nel dashboard Vercel
3. Il deployment avverrà automaticamente ad ogni push

## 📋 Script Disponibili

- `npm run dev` - Server di sviluppo
- `npm run build` - Build di produzione
- `npm run start` - Server di produzione
- `npm run lint` - Controllo linting
- `npm run type-check` - Controllo TypeScript

## 🤝 Contributi

I contributi sono benvenuti! Apri una issue o una pull request per miglioramenti.

## 📄 Licenza

MIT License 