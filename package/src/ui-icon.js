const defaultConfig = {
  version: Date.now(),
  filePath: '/assets/iconset.svg',
  defaultSize: 24,
};

class UiIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    if (this.shadowRoot.adoptedStyleSheets) {
      this.shadowRoot.adoptedStyleSheets = [sharedStyles];
    } else {
      const style = document.createElement('style');
      style.textContent = sharedStylesText;
      this.shadowRoot.appendChild(style);
    }
  }

  connectedCallback() {
    setTimeout(() => {
      this.render();
    }, 20);
  }

  render() {
    const config = {
      ...defaultConfig,
      ...(window.UiIcon || {}),
    };

    const options = this.getOptions({
      name: null,
      icon: null,
      size: config.defaultSize,
      rotation: 0,
      viewbox: null,
    });

    const iconName = options.icon || options.name;

    if (options.name && !options.icon && !window.UiIconDeprecationWarningAttrNameSent) {
      console.warn(`[ui-icon] Attribute "name" is deprecated. Use "icon" instead.`);
      window.UiIconDeprecationWarningAttrNameSent = true;
    }

    const { size, rotation, viewbox } = options;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('part', 'icon');

    const isValidSize = Number.isFinite(size) && size > 0;
    const isValidViewbox = viewbox && /^(\d+(\.\d+)?\s){3}\d+(\.\d+)?$/.test(viewbox);
    const isValidRotation = !isNaN(parseFloat(rotation));

    if (isValidViewbox) {
      svg.setAttribute('viewBox', viewbox);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
    } else if (isValidSize) {
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
    }

    if (isValidRotation) {
      svg.style.transform = `rotate(${rotation}deg)`;
    }

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    const encodedIconName = encodeURIComponent(iconName || '');
    const version = encodeURIComponent(config.version);
    const urlParams = `?v=${version}`;

    use.setAttribute('href', `${config.filePath}${urlParams}#${encodedIconName}`);
    svg.appendChild(use);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(svg);
  }

  getOptions(defaults) {
    return Object.keys(defaults).reduce((acc, key) => {
      const value = this.getAttribute(key);
      acc[key] =
        value !== null
          ? typeof defaults[key] === 'number'
            ? parseFloat(value)
            : value
          : defaults[key];
      return acc;
    }, {});
  }

  static get observedAttributes() {
    return ['name', 'icon', 'size', 'rotation', 'viewbox'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
}

const sharedStylesText = `
  :host {
    flex-shrink: 0;
    display: block;
  }
  svg {
    display: block;
    pointer-events: none;
  }
`;

const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(sharedStylesText);

if (!customElements.get('ui-icon')) {
  customElements.define('ui-icon', UiIcon);
}
