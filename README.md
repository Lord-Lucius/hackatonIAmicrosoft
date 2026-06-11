# CV Analyzer — Agent IA

Agent IA qui analyse un CV et calcule son adéquation avec une offre d'emploi.

À partir d'un CV au format PDF, l'agent produit :
- un résumé professionnel et un niveau estimé (junior / intermédiaire / senior) avec justification ;
- les compétences techniques détectées ;
- les points forts et les axes d'amélioration ;
- des métiers recommandés.

Il permet ensuite de coller une offre d'emploi pour obtenir un **score d'adéquation**, la liste des compétences présentes et manquantes, et une recommandation.

## Stack

- **Next.js 15** (App Router) — front et back dans un seul projet
- **GitHub Models** (`gpt-4o-mini`) — LLM gratuit, écosystème Microsoft
- **pdf-parse** — extraction du texte des PDF
- **Tailwind CSS** — interface

## Architecture

```
PDF → extraction du texte (pdf-parse) → analyse (LLM) → JSON structuré → dashboard
                                       → matching CV ↔ offre (LLM) → score + écarts
```

Le pipeline est **stateless** : le CV n'est jamais stocké, il transite uniquement en mémoire le temps de la requête.

## Lancer en local

```bash
npm install
```

Créer un fichier `.env.local` à la racine avec un token GitHub disposant de la permission **Models** :

```
GITHUB_TOKEN=github_pat_votre_token
```

Puis :

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000

## Build de production

```bash
npm run build
npm run start
```
