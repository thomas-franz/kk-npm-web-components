# KK Web Components

A collection of reusable web components.

## Installation

```bash
npm install kk-web-components
```

## Usage

### Importing the Components

```javascript
import "kk-web-components";

// Optionally configure UiIcon globally
window.UiIcon = {
  version: "1.0",
  filePath: "/icons/iconset.svg",
  defaultSize: 24,
};
```

### Components

#### `<ui-icon>`

- **Attributes**:
  - `name`: The name of the icon in the sprite sheet.
  - `size`: The size of the icon (default: `24`).
  - `rotation`: Rotate the icon in degrees (default: `0`).
  - `viewbox`: Optional custom `viewBox` for the SVG.

Example:

```html
<ui-icon name="home" size="32" rotation="45"></ui-icon>
<ui-icon name="settings"></ui-icon>
```
