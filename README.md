# Consenso - Applicazione di Registrazione del Consenso

> [!IMPORTANT]
> **Disclaimer**: Questa applicazione è una **provocazione tecnologica** e uno strumento dimostrativo sviluppato in risposta al dibattito legislativo sul consenso sessuale. **Non ha valore legale certificato** e non sostituisce la comunicazione verbale e il buon senso.

## Contesto Legislativo
Questo progetto nasce in risposta alle recenti evoluzioni normative in Italia (novembre 2025) riguardanti la modifica dell'**articolo 609-bis del Codice Penale**. La Camera dei Deputati ha approvato l'introduzione del concetto di **"consenso libero e attuale"**, allineandosi alla Convenzione di Istanbul.

La nuova normativa stabilisce che:
- Il consenso deve essere **esplicito** e **libero**.
- Il consenso deve essere **attuale** (valido nel momento dell'atto).
- Non può essere presunto.

In uno scenario dove l'onere della prova diventa cruciale e il confine tra "sì" e "ni" viene codificato rigidamente, **Consenso** offre una soluzione paradossale ma efficace: la burocratizzazione digitale dell'intimità per garantire la massima tutela delle parti.

## Funzionalità dell'App

L'applicazione è progettata per essere usata "sul momento", garantendo velocità e sicurezza:

### 1. 📸 Prova Fotografica (Selfie)
Per evitare contestazioni sulla presenza o sull'identità, l'app richiede un **selfie contestuale** di entrambi i partner al momento della firma.

### 2. 👆 Firma Biometrica Simulata
Poiché i browser non permettono l'accesso diretto al sensore di impronte (per privacy), abbiamo implementato un sistema di **"Pressione Consapevole"**. L'utente deve tenere premuto lo scanner per 2 secondi, un'azione che richiede intenzionalità, simulando la solennità di una firma biometrica.

### 3. ⏳ Consenso "Attuale" (Timer 15 Minuti)
Per rispettare il requisito di "attualità" della legge, il consenso **scade dopo 15 minuti**.
- Se l'atto prosegue oltre, è necessario **rinnovare il consenso** con una nuova scansione.
- Questo previene l'uso di un consenso dato ore prima per atti successivi non concordati.

### 4. 🔒 Firma Digitale Immutabile (Hash)
Ogni certificato genera un **Hash SHA-256** univoco basato su:
- Nomi dei partner
- Timestamp esatto (al millisecondo)
- Dati dell'immagine
Questo rende il certificato matematicamente unico e teoricamente inalterabile.

## Installazione (PWA)
Questa è una **Progressive Web App (PWA)**. Non serve passare dagli store:
1. Apri il sito/file sul browser del telefono (Chrome/Safari).
2. Premi "Condividi" o il menu opzioni.
3. Seleziona **"Aggiungi alla schermata Home"**.
4. L'app funzionerà come un'applicazione nativa, anche offline.

---

## Suggerimenti per Sviluppi Futuri
Per rendere l'applicazione ancora più aderente ai requisiti di legge e sicurezza, ecco alcuni suggerimenti tecnici:

1.  **Integrazione SPID/CIE**: Per garantire l'identità certa dei partecipanti, si potrebbe integrare il login con l'Identità Digitale Italiana.
2.  **Blockchain Notarization**: Registrare l'hash del consenso su una blockchain pubblica (es. Polygon o Ethereum) per renderlo una prova opponibile a terzi con data certa (marcatura temporale).
3.  **Crittografia End-to-End**: Se si decidesse di salvare i dati in cloud, sarebbe necessario cifrare tutto lato client in modo che nemmeno il server possa vedere le foto o i nomi.
4.  **Revoca Vocale (Safe Word)**: Implementare un riconoscimento vocale sempre attivo che, alla pronuncia di una parola chiave ("STOP"), revoca immediatamente il certificato e blocca il timer.
