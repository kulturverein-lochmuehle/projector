import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './handle.component.css?inline';

@customElement('kvlm-handle')
export class Handle extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  protected override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-handle': Handle;
  }
}
