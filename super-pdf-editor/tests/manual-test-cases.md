# Super PDF Editor V7.0 - Test Cases

## Manual Test Checklist

### 1. Basic File Operations

| Test | Steps | Expected Result |
|------|-------|-----------------|
| ✅ Add single PDF | Click "Add PDF" → Select file | File appears in sidebar |
| ✅ Add multiple PDFs | Drag & drop multiple files | All files appear in list |
| ✅ Navigate pages | Use page navigation buttons | Page changes correctly |
| ✅ Switch files | Click file in sidebar | PDF and edits change |
| ✅ Zoom in/out | Use +/- buttons or keys | PDF scales properly |

---

### 2. Edit Tools

| Tool | Test Steps | Expected Behavior |
|------|------------|-------------------|
| **Text** | Click on PDF canvas | Creates text box with "ข้อความ" |
| **Whiteout** | Click on PDF | Creates white rectangle |
| **Date** | Click on PDF | Creates text with current Thai date |
| **Checkmark** | Click on PDF | Creates "✓" text box |
| **Image** | Click on PDF → Upload image | Image appears at click position |
| **Signature** | Click tool → Draw → Save | Signature added as image |
| **Number** | Click on PDF | Creates "{NO}" placeholder |
| **Scanner** | Draw selection box on text | Extracts and shows text modal |

---

### 3. Edit Box Interactions

| Action | Steps | Expected Result |
|--------|-------|-----------------|
| Select box | Click on edit box | Box shows toolbar and handles |
| Move box | Drag the blue header or use arrows | Box moves smoothly |
| Resize box | Drag corner handle | Box resizes |
| Delete box | Click trash icon or press Delete | Box removed |
| Duplicate | Click layers icon or Ctrl+D | Creates copy offset by 15px |
| Copy text | Click copy icon in toolbar | Text copied to clipboard |
| Edit text | Click inside text area | Can type new text |

---

### 4. Style Controls

| Style | Test | Expected |
|-------|------|----------|
| Font family | Change dropdown | Text font changes |
| Color | Use color picker | Text color changes |
| Size | Use +/- buttons | Font size adjusts |
| Bold | Click B button | Text becomes bold |

---

### 5. History (Undo/Redo)

| Action | Expected |
|--------|----------|
| Make change → Ctrl+Z | Change reverted |
| Undo → Ctrl+Y | Change restored |
| Multiple undos | Each step reverts properly |
| Drag operation | Only final position in history |

---

### 6. Project Save/Load

| Test | Steps | Expected |
|------|-------|----------|
| Save project | Click "Save" in sidebar | Downloads .superpdf file |
| Load project | Click "Load" → Select file | Restores files and edits |
| Version check | Load old project | Works with backwards compatibility |

---

### 7. Export

| Test | Expected |
|------|----------|
| Single export | Downloads ZIP with edited PDFs |
| Multi-save | Creates PDFs with custom names |
| Sync all files | Copies edits to all files on same page |

---

### 8. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save project |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+D | Duplicate |
| Ctrl+C/V | Copy/Paste |
| Delete | Remove selected |
| Arrow keys | Move selected (1px) |
| Shift+Arrow | Move selected (10px) |
| +/- | Zoom |
| Escape | Deselect/Reset tool |
| 1-8 | Quick tool select |
| Ctrl+P | Toggle preview |

---

### 9. Preview Mode

| Test | Expected |
|------|----------|
| Toggle preview | All edit controls hidden |
| View edits | Edits visible but not selectable |
| Export in preview | Same output as edit mode |

---

### 10. Responsive/Mobile

| Screen Size | Expected |
|-------------|----------|
| Desktop (>1024px) | Full layout |
| Tablet (768-1024px) | Condensed toolbar |
| Mobile (<768px) | Hidden sidebar, menu toggle |

---

### 11. Edge Cases

| Case | Expected |
|------|----------|
| Empty project export | Shows "No files" toast |
| Invalid file type | Skipped with warning |
| Large PDF (100+ pages) | Loads without timeout |
| Many edit boxes (50+) | No performance lag |
| Thai text rendering | Displays correctly in export |

---

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Supported |
| Firefox 90+ | ✅ Supported |
| Safari 14+ | ✅ Supported |
| Edge 90+ | ✅ Supported |

---

## Known Limitations

1. PDF files must be non-password-protected
2. Text extraction works only on searchable PDFs (not scanned images)
3. Custom fonts may not render in exported PDF (Thai fonts use canvas rendering)
