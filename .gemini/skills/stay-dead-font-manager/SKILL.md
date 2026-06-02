---
name: stay-dead-font-manager
description: Manage and experiment with fonts in the Stay Dead project. Use when the user wants to swap the pixel font, add new font options to settings, or adjust typography styling across Jekyll and JavaScript.
---

# Stay Dead Font Manager

Guide for swapping or adding fonts in the Stay Dead text RPG.

## Font Swap Workflow

To replace an existing font (e.g., swapping the "Pixel" font for a new blackletter font):

1.  **Google Fonts Import**: Update the `<link>` tag in `_includes/head-custom.html`. Ensure it includes the new font family.
2.  **CSS Class Update**: In `_sass/jekyll-theme-minimal.scss`, find the relevant font class (e.g., `.pixel-font`) and update `font-family` to the new name.
3.  **Adjust Fallbacks**: Update the fallback font (e.g., `serif` for blackletter, `sans-serif` for clean pixel fonts).
4.  **Surgical Style Tweaks**: If the new font is too small or thin, adjust `letter-spacing` or `font-weight` within the CSS class block.

## Adding a New Font Option

To add a completely new font choice to the Settings menu:

1.  **Constants**: In `js/constants.js`, add the new font name to the `applyFontPreference()` logic and ensure it handles a new class (e.g., `custom-font`).
2.  **CSS**: Define the new class (e.g., `.custom-font`) in `_sass/jekyll-theme-minimal.scss` with its `font-family` and specific styling overrides.
3.  **Menu UI**: In `js/menu.js`, add the new font name to the array in the `Font Type` section of the settings renderer.

## Implementation Details

See [font-mapping.md](references/font-mapping.md) for a list of all files and symbols that need to be updated when modifying fonts.
