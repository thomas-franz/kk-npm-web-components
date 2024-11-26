import UiIcon from "./ui-icon.js";

export { UiIcon };

export function registerComponents() {
  customElements.define("ui-icon", UiIcon);
  customElements.define("other-component");
}