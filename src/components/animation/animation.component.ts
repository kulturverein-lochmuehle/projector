import '../handle/handle.component.js';

import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './animation.component.css?inline';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';

const stars = import.meta.glob(['../../assets/stars/*.svg'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

@customElement('kvlm-animation')
export class Animation extends LitElement {
  static override readonly styles = unsafeCSS(styles);

  #randomize(star: unknown): string {
    // the smaller, the farer away, the slower
    const scale = randomInt(0.25, 5);
    const duration = 30 - scale * 4;
    const props = {
      left: `${randomInt(0, 100)}vw`,
      width: `${scale}vh`,
      transform: `rotate(${randomInt(0, 360)}deg) translate(-50%, -50%)`,
      'animation-delay': `-${randomInt(0.1, duration)}s`,
      'animation-duration': `${duration}s`,
    };
    const style = Object.entries(props)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
    return (star as string).replace('<svg', `<svg style="${style}"`);
  }

  protected override render() {
    const sky = Object.values(stars);
    return map(range(50), i => html`${unsafeHTML(this.#randomize(sky[i % sky.length]))}`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kvlm-animation': Animation;
  }
}
