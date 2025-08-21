import '../handle/handle.component.js';

import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { removeGhosting } from '../../utils/dragging.utils.js';
import { addEditModeListener } from '../../utils/edit-mode.utils.js';
import type { Square } from './mask.utils.js';
import {
  defaultPosition,
  readPosition,
  storePosition,
  updatePositionFromEvent,
} from './mask.utils.js';

import styles from './mask.component.css?inline';

@customElement('kvlm-mask')
export class Mask extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  @state()
  private position: Square = readPosition() ?? defaultPosition();

  @property({ type: Boolean, reflect: true, attribute: 'editing' })
  private isEditing = false;

  #removeEditModeListener = addEditModeListener(isEditing => {
    this.isEditing = isEditing;
    if (!this.isEditing) storePosition(this.position);
  });

  #handleReset = (() => {
    this.position = readPosition() ?? defaultPosition();
    this.requestUpdate();
  }).bind(this);

  constructor() {
    super();
    window.addEventListener('kvlm-reset', this.#handleReset, { passive: true });
    this.addEventListener('dragover', this.handleDragOver, { capture: true });
  }

  override disconnectedCallback() {
    this.#removeEditModeListener();
    window.removeEventListener('kvlm-reset', this.#handleReset);
    this.removeEventListener('dragover', this.handleDragOver, { capture: true });
    super.disconnectedCallback();
  }

  @eventOptions({ passive: true })
  private handleDragStart(event: DragEvent) {
    if (!event.dataTransfer) return;
    removeGhosting(event);

    const handle = event.target as HTMLElement;
    handle.dataset.dragging = '';

    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
  }

  @eventOptions({ capture: true })
  private handleDragMove(event: DragEvent) {
    event.preventDefault();
    removeGhosting(event);

    const handle = event.target as HTMLElement;
    const point = handle.dataset.maskPoint as keyof Square;
    const value = updatePositionFromEvent(event, point);
    this.position = { ...this.position, [point]: value };
  }

  @eventOptions({ capture: true })
  private handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @eventOptions({ capture: true })
  private handleDragEnd(event: DragEvent) {
    event.preventDefault();

    const handle = event.target as HTMLElement;
    const point = handle.dataset.maskPoint as keyof Square;
    const value = updatePositionFromEvent(event, point);
    this.position = { ...this.position, [point]: value };

    delete handle.dataset.dragging;
  }

  @eventOptions({ passive: true })
  private handleMouseEnter(event: MouseEvent) {
    removeGhosting(event as DragEvent);
  }

  #getPolygonPoints(): string {
    return Object.values(this.position)
      .flatMap(({ x, y }) => [x, y])
      .flat()
      .join(' ');
  }

  protected override render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <mask id="mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <polygon points="${this.#getPolygonPoints()}" fill="black" />
        </mask>
        <rect x="0" y="0" width="100" height="100" mask="url(#mask)" />
        <polygon points="${this.#getPolygonPoints()}" />
      </svg>

      ${map(
        Object.entries(this.position),
        ([key, { x, y }]) => html`
          <kvlm-handle
            draggable="${this.isEditing.toString() as 'true' | 'false'}"
            style="${styleMap({ left: `${x}%`, top: `${y}%` })}"
            data-mask-point="${key}"
            @mouseenter="${this.handleMouseEnter}"
            @dragstart="${this.handleDragStart}"
            @drag="${this.handleDragMove}"
            @dragover="${this.handleDragOver}"
            @dragend="${this.handleDragEnd}"
          >
            ${key}
          </kvlm-handle>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-mask': Mask;
  }
}
