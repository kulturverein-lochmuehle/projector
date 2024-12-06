import '../handle/handle.component.js';

import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, eventOptions, property } from 'lit/decorators.js';

import { addEditModeListener } from '../../utils/edit-mode.utils.js';
import { reset } from '../../utils/storage.utils.js';
import styles from './reset.component.css?inline';

@customElement('kvlm-reset')
export class Reset extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true, attribute: 'editing' })
  // @ts-expect-error: unused property used for reflection
  private isEditing = false;

  #removeEditModeListener = addEditModeListener(isEditing => {
    this.isEditing = isEditing;
  });

  @eventOptions({ passive: true })
  handleClick() {
    reset();
    window.dispatchEvent(new CustomEvent('kvlm-reset'));
  }

  override disconnectedCallback() {
    this.#removeEditModeListener();
    super.disconnectedCallback();
  }

  protected override render() {
    return html`<kvlm-handle @click="${this.handleClick}">Reset</kvlm-handle>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-reset': Reset;
  }
}
