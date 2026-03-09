# Kitchen Heritage 🍳

**Preserve your family's flavors, one recipe at a time.**

A free, open-source, voice-powered recipe recording app for preserving family culinary traditions. Record recipes hands-free while cooking, auto-transcribe your instructions, and create beautiful recipe cards to share.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## Features

- 🎤 **Voice Recording** - Record ingredients and instructions hands-free using speech recognition
- 📝 **Auto-Transcription** - Real-time speech-to-text conversion
- 📷 **Photo Upload** - Add photos of your dishes
- 💾 **Offline Storage** - All recipes stored locally in your browser (IndexedDB)
- 📄 **Print/PDF Export** - Generate beautiful recipe cards for printing
- 🔗 **Share Links** - Share recipes with family via URL
- 📱 **PWA** - Install on your phone for quick access
- 🏷️ **Tags & Organization** - Categorize recipes for easy finding

## Live Demo

Visit: **https://chartmann1590.github.io/kitchen-heritage/**

## Why Kitchen Heritage?

Unlike expensive recipe book platforms ($30-100+), Kitchen Heritage is:
- ✅ Free forever
- ✅ Open source
- ✅ Privacy-focused (all data stays on your device)
- ✅ Works offline
- ✅ Voice-first design for busy cooks

## Getting Started

### Use Online

Visit **https://chartmann1590.github.io/kitchen-heritage/** to start adding recipes immediately.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/chartmann1590/kitchen-heritage.git
cd kitchen-heritage

# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8000
```

> **Note:** Service workers and the PWA install prompt only work over `http://` or `https://` (not `file://`).

### Deploy Your Own

Deploy for free to:
- **GitHub Pages**: Repo Settings → Pages → Deploy from branch (main / root)
- **Netlify**: Connect your repo, deploy with one click
- **Vercel**: `npx vercel`

No build step required — just static files!

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full (Voice + all features) |
| Safari (iOS 14.3+) | ✅ Full (Voice + all features) |
| Firefox | ⚠️ Partial (No voice recording) |
| Mobile Chrome | ✅ Full |

## Usage

### Adding a Recipe

1. Click **"New Recipe"**
2. Fill in title, prep time, servings, and author
3. Add a photo (optional)
4. **Voice Mode**: Click "Start Recording" and speak naturally
   - Click the **ingredients** or **instructions** field before dictating
   - Say "next ingredient" or "next step" to separate items
5. Or manually type ingredients and instructions (one per line)
6. Add family story/notes (optional)
7. Add tags for organization (optional)
8. Click **"Save Recipe"**

### Sharing a Recipe

1. Open a recipe
2. Click the **🔗 Share** button
3. Share link copied to clipboard!
4. Recipients can view and save the recipe

> Share links store recipe text in the URL (photos are not included).

### Exporting

- **📄 Export**: Opens print dialog for PDF saving or printing
- Creates a beautiful, formatted recipe card

## Data & Privacy

- All recipes are stored **locally** in your browser (IndexedDB)
- No accounts, no trackers, no cloud sync
- To reset, clear this site's storage in your browser settings
- **Speech recognition** uses your browser's Web Speech API. Some browsers may process audio via a vendor service; review your browser's privacy policy if this matters.
- **Share links** embed recipe text in the URL. Treat shared URLs as public and avoid sensitive data.

## Security Notes (Self-Hosting)

This is a static, client-only app with no backend. If you deploy it yourself, serve it over HTTPS and consider standard static-site security headers such as:

- `Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or `frame-ancestors 'none'`)
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: microphone=(self)`

## PWA / Offline Support

- Works offline once loaded
- Install prompt appears on supported browsers
- Add to Home Screen on iOS via Share → Add to Home Screen

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Storage**: IndexedDB (browser-native database)
- **Voice**: Web Speech API (browser-native speech recognition)
- **PWA**: Service Worker + Web App Manifest
- **Zero build step** — No npm install, no bundlers, no config

## Project Structure

```
kitchen-heritage/
├── index.html          # Main app shell
├── css/
│   └── styles.css      # All styles (mobile-first)
├── js/
│   ├── app.js          # Main app logic & event handlers
│   ├── storage.js      # IndexedDB wrapper
│   ├── speech.js       # Web Speech API integration
│   ├── ui.js           # DOM manipulation & rendering
│   └── export.js       # PDF/image generation
├── assets/
│   └── icons/          # PWA icons
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── README.md
```

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- [ ] Recipe scaling calculator
- [ ] Import from popular recipe sites
- [ ] Dark mode toggle
- [ ] Recipe collections/cookbooks
- [ ] Cloud sync (optional, opt-in)
- [ ] Nutrition estimation
- [ ] Cooking timer
- [ ] Meal planning features

## License

MIT License - feel free to use, modify, and distribute freely.

## Acknowledgments

Built with love for preserving family culinary heritage. Inspired by the desire to keep grandma's recipes alive for future generations.

---

**Made with ❤️ for families everywhere**

Star ⭐ this repo if you find it useful!
