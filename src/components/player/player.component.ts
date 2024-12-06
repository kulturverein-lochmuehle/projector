import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './player.component.css?inline';

@customElement('kvlm-player')
export class Player extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  protected override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-player': Player;
  }
}
