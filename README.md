# @kvlm/projector

> a browser-based masking tool for projections that lets you display video content in custom-shaped areas. Perfect for building projections with precise content boundaries.

![Screenshot](https://kulturverein-lochmuehle.github.io/projector/screenshot.png)

## Purpose

projector was created to help display video content on irregular surfaces or specific areas of a projection. It allows you to mask out portions of the viewport, leaving only your desired projection area visible - ideal for architectural projections, art installations, or event displays.

## Features

- Mask out any area of the viewport, with the remaining visible part showing an HTML5 video player
- Edit mode (toggle with ALT key) with draggable handles to precisely adjust the mask
- Works with any video content, perfect for looped videos, just drag the video file on the preview
- Designed for fullscreen use on projection systems
- Simple, lightweight interface that stays out of your way

## Development Setup

### Prerequisites

- Modern web browser
- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kulturverein-lochmuehle/projector.git
cd projector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Launch the application in your browser
2. Make the browser fullscreen (typically F11 or Fn+F11)
3. Press ALT to enter edit mode
4. Drag the handles to adjust the visible area
5. Drag a video file on the preview image to start looped playback
6. Press ALT again to exit edit mode and hide the handles

## Building for Production

```bash
npm run build
```

The built files can be deployed to any static web server.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Lit](https://lit.dev/) - Lightweight web components
- [Vite](https://vitejs.dev/) - Fast build tool and dev server

## Author

David Enke - [david@kvlm.de](mailto:david@kvlm.de)

## License

[MIT License](LICENSE)
