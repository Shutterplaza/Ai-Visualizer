# Shutter Plaza AI Visualizer — backend/API versie

Deze export bevat een werkende front-end én een backend endpoint dat een raamfoto naar de OpenAI API stuurt en een AI shutter-preview teruggeeft.

## Wat werkt

- Foto uploaden of maken met telefoon
- Materiaal kiezen: houten shutters of PVC shutters
- Kleur kiezen: wit, taupe, donkerbruin of zwart
- Lamelbreedte kiezen
- Montage kiezen
- AI preview genereren via `/api/visualize`
- WhatsApp/offerte CTA

## Lokaal testen

1. Installeer Node.js 18 of hoger.
2. Open deze map in Terminal.
3. Installeer dependencies:

```bash
npm install
```

4. Maak een `.env` bestand op basis van `.env.example`:

```bash
cp .env.example .env
```

5. Vul je OpenAI API key in:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.5
```

6. Start de app:

```bash
npm run dev
```

7. Open in je browser:

```text
http://localhost:3000
```

## Deploy naar Vercel

1. Upload deze map naar GitHub.
2. Maak een nieuw Vercel project.
3. Voeg environment variables toe:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` met waarde `gpt-5.5` of een model waartoe je account toegang heeft.
4. Deploy.

## Belangrijk voor Shopify

Plaats nooit je OpenAI API key direct in Shopify Liquid of front-end JavaScript. De API-key hoort alleen in een backend/serverless endpoint zoals `/api/visualize`.

Voor Shopify gebruiken we deze flow:

```text
Shopify visualizer sectie → POST naar externe backend /api/visualize → AI image terug → preview tonen → offerte/WhatsApp
```

## Privacy

Deze demo slaat klantfoto’s niet op. In productie moet je duidelijk vermelden dat de foto tijdelijk wordt gebruikt om een AI-preview te maken. Voor offerteaanvragen kun je later expliciet toestemming vragen om de foto mee te sturen naar Shutter Plaza.

## Prompt aanpassen

De prompt staat in `api/visualize.js` in de functie `buildPrompt()`.
