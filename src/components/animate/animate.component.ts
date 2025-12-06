import '../handle/handle.component.js';

import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, eventOptions, property } from 'lit/decorators.js';

import { addEditModeListener } from '../../utils/edit-mode.utils.js';

import styles from './animate.component.css?inline';

@customElement('kvlm-animate')
export class Animate extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true, attribute: 'animating' })
  private isAnimating = false;

  @property({ type: Boolean, reflect: true, attribute: 'editing' })
  // @ts-expect-error: unused property used for reflection
  private isEditing = false;

  #removeEditModeListener = addEditModeListener(isEditing => {
    this.isEditing = isEditing;
  });

  @eventOptions({ passive: true })
  handleClick() {
    this.isAnimating = !this.isAnimating;
    window.dispatchEvent(new CustomEvent('kvlm-animate', { detail: this.isAnimating }));
  }

  override disconnectedCallback() {
    this.#removeEditModeListener();
    super.disconnectedCallback();
  }

  protected override render() {
    return html`
      <kvlm-handle ?inverted=${this.isAnimating} @click="${this.handleClick}">Animate</kvlm-handle>
    `;
  }
}

declare global {
  interface WindowEventMap {
    'kvlm-animate': CustomEvent<boolean>;
  }

  interface HTMLElementTagNameMap {
    'kvlm-animate': Animate;
  }
}
