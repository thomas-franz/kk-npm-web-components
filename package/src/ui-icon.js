// Define shared styles as a string
const sharedStylesText = `
  :host {
    flex-shrink: 0;
    display: block;
  }
  svg {
    display: block;
  }
`;

// Create a constructable stylesheet if supported
const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(sharedStylesText);

class UiIcon extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Apply styles
    if (shadow.adoptedStyleSheets) {
      shadow.adoptedStyleSheets = [sharedStyles];
    } else {
      // Fallback for browsers without adoptedStyleSheets (e.g., Safari)
      const style = document.createElement('style');
      style.textContent = sharedStylesText; // Use the same shared styles text
      shadow.appendChild(style);
    }
  }

  connectedCallback() {
    const config = window.UiIcon;
    const urlParametersObj = {};
    let filepath = "/assets/iconset.svg";
    let defaultSize = 24;

    if (config) {
      if (config.version) {
        urlParametersObj["v"] = config.version;
      }
      if (config.filePath) {
        filepath = config.filePath;
      }
      if (config.defaultSize) {
        defaultSize = config.defaultSize;
      }
    }

    // Get all attributes with defaults
    const options = this.getOptions({
      name: null,
      size: defaultSize,
      rotation: 0,
      viewbox: null,
    });

    const { name, size, rotation, viewbox } = options;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // Hide from screen readers
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("part", "icon"); // Expose svg for styling

    // Validate values
    const isValidSize = Number.isInteger(size) && size > 0;
    const isValidViewbox = viewbox && /^(\d+(\.\d+)?\s){3}\d+(\.\d+)?$/.test(viewbox);
    const isValidRotation = !isNaN(parseFloat(rotation));
  
    if (isValidViewbox) {
      svg.setAttribute("viewBox", viewbox);
    } else if (isValidSize) {
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
    }
    if (isValidRotation) {
      svg.style.transform = `rotate(${rotation}deg)`;
    }

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    if (Object.keys(urlParametersObj).length > 0) {
      const urlParameters = `?${Object.entries(urlParametersObj)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}`;
      use.setAttribute("href", `${filepath}${urlParameters}#${name}`);
    } else {
      use.setAttribute("href", `${filepath}#${name}`);
    }

    svg.appendChild(use);

    this.shadowRoot.innerHTML = ""; // Clear old content
    this.shadowRoot.appendChild(svg);
  }

  // Utility to get attributes with defaults, supporting icon as alias for name
  getOptions(defaults) {
    return Object.keys(defaults).reduce((acc, key) => {
      let value = this.getAttribute(key);

      // Backwards compatibility: treat "icon" as alias for "name"
      if (key === "name") {
        value = this.getAttribute("icon") ?? this.getAttribute("name");
      }

      acc[key] =
        value !== null
          ? typeof defaults[key] === "number"
            ? parseFloat(value)
            : value
          : defaults[key];
      return acc;
    }, {});
  }

  // Observe relevant attributes
  static get observedAttributes() {
    return ["name", "icon", "size", "rotation", "viewbox"];
  }

  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.connectedCallback();
    }
  }
}

// Register the custom element
customElements.define("ui-icon", UiIcon);

export default UiIcon;
