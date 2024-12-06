import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

import { addEditModeListener } from '../../utils/edit-mode.utils.js';

import testCard from '../../assets/FuBK_testcard_vectorized.svg?url';
import styles from './player.component.css?inline';

type PlayerFile = {
  type: string;
  name: string;
  url: string;
};

@customElement('kvlm-player')
export class Player extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  @state()
  private file: PlayerFile = { type: 'image/svg+xml', name: 'Test Card', url: testCard };

  @property({ type: Boolean, reflect: true })
  // @ts-expect-error: unused property used for reflection
  private interactive = false;

  @property({ type: Boolean, reflect: true, attribute: 'editing' })
  private isEditing = false;

  #removeEditModeListener = addEditModeListener(isEditing => {
    this.isEditing = isEditing;
  });

  #handleDragEnter = ((event: DragEvent) => {
    if (!event.dataTransfer?.items.length) return;

    event.stopPropagation();
    event.preventDefault();

    this.interactive = true;
  }).bind(this);

  #handleDragOver = ((event: DragEvent) => {
    if (!event.dataTransfer?.items.length) return;

    event.stopPropagation();
    event.preventDefault();

    this.interactive = true;
  }).bind(this);

  #handleDragLeave = ((event: DragEvent) => {
    if (!event.dataTransfer?.items.length) return;

    event.stopPropagation();
    event.preventDefault();

    this.interactive = false;
  }).bind(this);

  #handleDrop = ((event: DragEvent) => {
    if (!event.dataTransfer?.items.length) return;

    event.stopPropagation();
    event.preventDefault();

    const isOutside = !event.composedPath().includes(this);
    this.interactive = !isOutside;
    if (isOutside) return;

    const { files } = event.dataTransfer;
    const [file] = files;
    const reader = new FileReader();
    reader.onload = () => {
      const { type, name } = file;
      const url = reader.result as string;
      this.file = { type, name, url };
      this.interactive = false;
    };
    reader.readAsDataURL(file);
  }).bind(this);

  constructor() {
    super();
    this.addEventListener('dragenter', this.#handleDragEnter, { capture: true });
    this.addEventListener('dragover', this.#handleDragOver, { capture: true });
    this.addEventListener('dragleave', this.#handleDragLeave, { capture: true });
    window.addEventListener('drop', this.#handleDrop, { capture: true });
  }

  override disconnectedCallback() {
    this.#removeEditModeListener();
    this.removeEventListener('dragenter', this.#handleDragEnter, { capture: true });
    this.removeEventListener('dragover', this.#handleDragOver, { capture: true });
    this.removeEventListener('dragleave', this.#handleDragLeave, { capture: true });
    window.removeEventListener('drop', this.#handleDrop, { capture: true });
    super.disconnectedCallback();
  }

  #renderImage() {
    return html`<img id="media" src=${this.file.url} alt="${this.file?.name}" />`;
  }

  protected override render() {
    return html`
      ${when(
        this.isEditing,
        () => html`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="0" y="0" width="100" height="100" />
          </svg>
        `,
      )}
      ${choose(this.file?.type, [
        ['image/jpg', () => this.#renderImage()],
        ['image/jpeg', () => this.#renderImage()],
        ['image/png', () => this.#renderImage()],
        ['image/svg+xml', () => this.#renderImage()],
        ['video/mp4', () => html`<video id="media" src=${this.file.url} autoplay></video>`],
      ])}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-player': Player;
  }
}
