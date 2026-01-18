# 📄 Super PDF Editor V7.0

> Professional PDF editing tool with Thai language support, signature drawing, and document sharing.

![Version](https://img.shields.io/badge/version-7.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Text Editing** | Add/edit text with Thai font support |
| ✍️ **Digital Signature** | Draw and embed signatures |
| 🖼️ **Image Insertion** | Add images to PDF pages |
| 📅 **Auto Date** | Insert current date in Thai format |
| ✅ **Checkmarks** | Add checkmark symbols |
| 🔢 **Auto Numbering** | Sequential numbering across files |
| ⚪ **Whiteout** | Cover existing content |
| 🔍 **Text Scanner** | Extract text from PDF regions |
| 💾 **Project Save/Load** | Save work and continue later |
| 🔗 **Share Link** | Generate shareable download links |
| ↩️ **Undo/Redo** | Full history support (50 steps) |

## 🚀 Quick Start

### Option 1: Open directly
```
Double-click index.html to open in browser
```

### Option 2: Local server
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .
```

Then open `http://localhost:8080`

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save project |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + D` | Duplicate box |
| `Ctrl + C/V` | Copy/Paste |
| `Delete` | Remove selected |
| `Arrow keys` | Move (1px) |
| `Shift + Arrow` | Move (10px) |
| `+` / `-` | Zoom in/out |
| `1-8` | Quick tool select |
| `Escape` | Deselect |

## 📁 Project Structure

```
super-pdf-editor/
├── index.html          # Main entry point
├── super-pdf-combined.html  # Single-file version
├── css/
│   └── styles.css      # Stylesheets
├── js/
│   ├── app.js          # Main application
│   ├── components/     # React components
│   │   ├── EditBox.js
│   │   ├── Sidebar.js
│   │   ├── Toolbar.js
│   │   ├── Workspace.js
│   │   ├── SignaturePad.js
│   │   └── Modals.js
│   ├── hooks/          # Custom hooks
│   │   ├── useHistory.js
│   │   ├── usePdfLoader.js
│   │   └── useKeyboardShortcuts.js
│   └── utils/          # Utilities
│       ├── icons.js
│       └── pdfExport.js
├── tests/
│   └── manual-test-cases.md
├── README.md
└── LICENSE
```

## 🔗 Document Sharing

After editing, you can share your document:

1. Click **"Share"** button in toolbar
2. Choose sharing method:
   - **Download Link** - Generate temporary download URL
   - **Copy as Base64** - Copy encoded PDF to clipboard
   - **Email** - Open email client with attachment

## 🛠️ Technologies

- **React 18** - UI framework
- **PDF.js** - PDF rendering
- **pdf-lib** - PDF manipulation
- **JSZip** - Project packaging
- **FileSaver.js** - File downloads

## 📸 Screenshots

### Main Interface
- Modern dark theme with gradient accents
- Intuitive drag-and-drop workflow
- Real-time preview mode

### Edit Tools
- Smart toolbars appear on selection
- Drag handles for precise positioning
- Style controls for text formatting

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Contact

Created with ❤️ for the Thai community

---

**Made in Thailand 🇹🇭**
