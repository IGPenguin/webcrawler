# Font Mapping in Stay Dead

| File | Purpose | Key Symbols/Selectors |
| :--- | :--- | :--- |
| `_includes/head-custom.html` | Google Fonts import | `<link href="...family=...">` |
| `_sass/jekyll-theme-minimal.scss` | Font styling & classes | `.gelasio-font`, `.pixel-font` |
| `js/constants.js` | Persistence & Logic | `fontPreference`, `applyFontPreference()` |
| `js/menu.js` | Settings UI | `['Gelasio', 'Pixel', 'Native']` array |

## Style Override Pattern

When defining a new font class in SASS, follow this pattern to ensure all UI elements (including overlays and buttons) are updated:

```scss
.new-font {
  &, button, select, input, h1, h2, h3, h4, h5, h6, div, span, p:not(.ui-symbol) {
    font-family: 'New Font Name', serif !important;
  }

  // Large overlays often need specific font-family and letter-spacing
  .enemyOverlay, .playerOverlay {
    font-family: 'New Font Name', serif !important;
  }
}
```
