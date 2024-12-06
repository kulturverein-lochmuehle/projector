import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import testCard from '../../assets/FuBK_testcard_vectorized.svg?raw';
import { removeGhosting } from '../../utils/dragging.utils.js';
import { addEditModeListener } from '../../utils/edit-mode.utils.js';
import styles from './canvas.component.css?inline';
import {
  calculateCenter,
  type Center,
  diffCenter,
  readCenter,
  storeCenter,
} from './canvas.utils.js';

@customElement('kvlm-canvas')
export class Canvas extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  #centerDiff?: Omit<Center, 'size'>;

  @state()
  private center: Center = readCenter() ?? { x: 50, y: 50, size: 100 };

  @property({ type: Boolean, reflect: true, attribute: 'editing' })
  isEditing = false;

  #removeEditModeListener = addEditModeListener(down => {
    if (!down) return;
    this.isEditing = !this.isEditing;
  });

  constructor() {
    super();
    this.addEventListener('dragover', this.handleDragOver, { capture: true });
  }

  override disconnectedCallback() {
    this.#removeEditModeListener();
    this.removeEventListener('dragover', this.handleDragOver, { capture: true });
    super.disconnectedCallback();
  }

  @eventOptions({ passive: true })
  private handleDragStart(event: DragEvent) {
    if (!event.dataTransfer) return;
    removeGhosting(event);

    this.#centerDiff = diffCenter(event);

    const handle = event.target as HTMLElement;
    handle.dataset.dragging = '';

    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
  }

  @eventOptions({ capture: true })
  private handleDragMove(event: DragEvent) {
    event.preventDefault();
    removeGhosting(event);

    const center = calculateCenter(event, this.#centerDiff!);
    this.center = { ...this.center, ...center };
  }

  @eventOptions({ capture: true })
  private handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @eventOptions({ capture: true })
  private handleDragEnd(event: DragEvent) {
    event.preventDefault();

    const center = calculateCenter(event, this.#centerDiff!);
    this.center = { ...this.center, ...center };
    storeCenter(this.center);

    const handle = event.target as HTMLElement;
    delete handle.dataset.dragging;
  }

  @eventOptions({ passive: true })
  private handleMouseEnter(event: MouseEvent) {
    removeGhosting(event as DragEvent);
  }

  @eventOptions({ capture: true })
  private handleWheel(event: WheelEvent) {
    if (!this.isEditing) return;

    event.preventDefault();
    const delta = event.deltaY / 10;
    const size = Math.min(Math.max(this.center.size + delta, 10), 150);
    this.center = { ...this.center, size };
    storeCenter(this.center);
  }

  protected override render() {
    return html`
      <figure
        draggable="${this.isEditing.toString() as 'true' | 'false'}"
        style="${styleMap({
          top: `${this.center.y}%`,
          left: `${this.center.x}%`,
          height: `${this.center.size}%`,
        })}"
        @mouseenter="${this.handleMouseEnter}"
        @dragstart="${this.handleDragStart}"
        @drag="${this.handleDragMove}"
        @dragover="${this.handleDragOver}"
        @dragend="${this.handleDragEnd}"
        @wheel="${this.handleWheel}"
      >
        ${unsafeHTML(testCard)}
      </figure>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-canvas': Canvas;
  }
}
