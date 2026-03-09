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

## Why Kitchen Heritage?

Unlike expensive recipe book platforms ($30-100+), Kitchen Heritage is:
- ✅ Free forever
- ✅ Open source
- ✅ Privacy-focused (all data stays on your device)
- ✅ Works offline
- ✅ Voice-first design for busy cooks

## Getting Started

### Use Online

Visit [your-deployment-url] to start adding recipes immediately.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/kitchen-heritage.git
cd kitchen-heritage

# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8000
# or just open index.html in your browser
```

### Deploy Your Own

Deploy for free to:
- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Connect your repo, deploy with one click
- **Vercel**: `npx vercel`

No build step required - just static files!

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
   - Say "next ingredient" or "new ingredient" to separate items
   - Say "next step" to move to the next instruction
5. Or manually type ingredients and instructions (one per line)
6. Add family story/notes (optional)
7. Add tags for organization (optional)
8. Click **"Save Recipe"**

### Sharing a Recipe

1. Open a recipe
2. Click the **🔗 Share** button
3. Share link copied to clipboard!
4. Recipients can view and save the recipe

### Exporting

- **📄 Export**: Opens print dialog for PDF saving or printing
- Creates a beautiful, formatted recipe card

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Storage**: IndexedDB (browser-native database)
- **Voice**: Web Speech API (browser-native speech recognition)
- **PWA**: Service Worker + Web App Manifest
- **Zero build step** - No npm install, no bundlers, no config

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
