# libre-lcz

**LCZ × COG × MapLibre × Mapterhorn × GitHub Pages**

A clean, single-file web map application visualizing Local Climate Zones (LCZ) data from Cloud Optimized GeoTIFFs (COG) with 3D terrain provided by Mapterhorn, built with MapLibre GL JS, Vite, and deployed on GitHub Pages.

![Map Screenshot](https://github.com/user-attachments/assets/3d7cead8-54d3-4a91-b7b8-b5054cd2f206)

## Concept

### What is this?

This project demonstrates a modern, minimal approach to web cartography by combining:

1. **Local Climate Zones (LCZ)** - Urban climate classification system with 17 categories (10 built types + 7 natural land cover types)
2. **Cloud Optimized GeoTIFFs (COG)** - Efficient raster data format for web streaming
3. **MapLibre GL JS** - Open-source mapping library for interactive maps
4. **Mapterhorn Terrain** - High-quality global terrain tiles for 3D visualization
5. **Single-File Distribution** - Everything inlined into one `index.html` for maximum portability

### Why Single-File?

The entire application is bundled into a single `index.html` file (~1.4MB) with all JavaScript and CSS inlined. This approach:

- **Eliminates path issues** on GitHub Pages (no `/assets` or `./assets` references)
- **Simplifies deployment** - just one file to serve
- **Improves portability** - works anywhere, even locally without a server
- **Reduces HTTP requests** - everything loads in one go

### Architecture

```
┌─────────────────────────────────────────┐
│         Single index.html               │
│  ┌───────────────────────────────────┐  │
│  │  Inline CSS (MapLibre + Custom)   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Inline JavaScript Module         │  │
│  │  ├─ MapLibre GL JS               │  │
│  │  ├─ @geomatico/maplibre-cog-     │  │
│  │  │  protocol                      │  │
│  │  └─ Application code              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↓              ↓
    ┌──────────┐   ┌─────────────┐
    │ LCZ COG  │   │  Mapterhorn │
    │  Data    │   │   Terrain   │
    └──────────┘   └─────────────┘
```

## Features

### LCZ Visualization

- **Data Source**: https://lcz-generator.rub.de/cogs/lcz_filter_v3_cog.tif
- **Format**: Single-band categorical Cloud Optimized GeoTIFF
- **Color Scheme**: Standard LCZ colors as defined by the LCZ Generator
- **Categories**: 17 classes mapping urban morphology and land cover types

### 3D Terrain

- **Provider**: Mapterhorn via tunnel.optgeo.org/martin
- **Format**: 512×512 WebP tiles, Terrarium encoding
- **Source**: Global DEM data (ESA Copernicus GLO-30)
- **Implementation**: Raster-DEM source with hillshade layer and terrain exaggeration

### Map Controls

- **Navigation**: Zoom in/out, pitch/rotation controls
- **3D View**: 60° pitch with adjustable bearing
- **Terrain exaggeration**: 1.5× vertical scale for better visibility

## Implementation Details

### Technology Stack

- **MapLibre GL JS**: Open-source map rendering engine
- **@geomatico/maplibre-cog-protocol**: COG protocol handler for MapLibre
- **Vite**: Modern build tool for bundling
- **Custom Vite Plugin**: Inlines all assets into single HTML file

### Build Process

1. **Development**: Source files in `src/` directory
   - `index.html` - HTML template
   - `main.js` - Application logic
   - `style.css` - Custom styles

2. **Build**: Vite processes and bundles
   - Compiles ES modules
   - Bundles MapLibre and dependencies
   - Inlines all CSS (including MapLibre's CSS)
   - Custom plugin inlines all JavaScript

3. **Output**: Single `docs/index.html` file
   - All external references removed
   - Ready for GitHub Pages deployment

### LCZ Color Mapping

The application uses a custom color function to map categorical LCZ values to their standard colors:

```javascript
const LCZ_COLORS = {
  1: [165, 0, 38],      // Compact high-rise
  2: [215, 48, 39],     // Compact midrise
  3: [244, 109, 67],    // Compact low-rise
  4: [254, 224, 139],   // Open high-rise
  5: [255, 255, 191],   // Open midrise
  6: [217, 239, 139],   // Open low-rise
  7: [102, 189, 99],    // Lightweight low-rise
  8: [26, 152, 80],     // Large low-rise
  9: [166, 217, 106],   // Sparsely built
  10: [110, 1, 107],    // Heavy industry
  11: [0, 104, 55],     // Dense trees (A)
  12: [49, 163, 84],    // Scattered trees (B)
  13: [184, 225, 134],  // Bush, scrub (C)
  14: [255, 255, 191],  // Low plants (D)
  15: [253, 174, 97],   // Bare rock or paved (E)
  16: [244, 109, 67],   // Bare soil or sand (F)
  17: [69, 117, 180]    // Water (G)
};
```

### Mapterhorn Terrain Integration

The terrain is loaded via MapLibre's `raster-dem` source type using the TileJSON endpoint:

```javascript
map.addSource('mapterhorn-terrain', {
  type: 'raster-dem',
  url: 'https://tunnel.optgeo.org/martin/mapterhorn',
  tileSize: 512
});

map.setTerrain({
  source: 'mapterhorn-terrain',
  exaggeration: 1.5
});
```

Hillshade layer enhances terrain visualization:

```javascript
map.addLayer({
  id: 'hillshade',
  type: 'hillshade',
  source: 'mapterhorn-terrain',
  paint: {
    'hillshade-exaggeration': 0.3
  }
});
```

## Installation & Development

### Prerequisites

- Node.js 16+ and npm
- (Optional) [just](https://github.com/casey/just) command runner

### Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using Justfile

```bash
# Install dependencies
just install

# Development server
just dev

# Build
just build

# Preview
just preview
```

## Project Structure

```
libre-lcz/
├── src/                    # Source files
│   ├── index.html         # HTML template
│   ├── main.js            # Application entry point
│   └── style.css          # Custom styles
├── docs/                   # Build output (GitHub Pages)
│   └── index.html         # Single-file output (~1.4MB)
├── inline-plugin.js       # Custom Vite plugin for inlining
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
├── Justfile               # Build automation
├── README.md              # This file
└── LICENSE                # CC0 1.0 Universal

```

## Deployment

### GitHub Pages

1. Build the project: `npm run build` or `just build`
2. The output in `docs/index.html` is ready for GitHub Pages
3. Configure repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or your default branch)
   - Folder: `/docs`

### Alternative Deployment

Since the output is a single HTML file, you can:
- Serve it with any static web server
- Open it directly in a browser (with limitations on external data loading due to CORS)
- Upload to any static hosting service
- Embed in other applications

## Data Sources & Credits

- **LCZ Data**: [LCZ Generator, Ruhr-University Bochum](https://lcz-generator.rub.de/)
  - Based on Demuzere et al. (2021) Global LCZ map
  
- **Terrain Data**: [Mapterhorn](https://mapterhorn.com/)
  - Source: ESA Copernicus GLO-30 DEM
  - Served via: tunnel.optgeo.org/martin

- **Mapping Library**: [MapLibre GL JS](https://maplibre.org/)

- **COG Protocol**: [@geomatico/maplibre-cog-protocol](https://github.com/geomatico/maplibre-cog-protocol)

## License

This project is released under CC0 1.0 Universal (Public Domain). See [LICENSE](LICENSE) for details.

## References

- Stewart, I. D., & Oke, T. R. (2012). Local climate zones for urban temperature studies. *Bulletin of the American Meteorological Society*, 93(12), 1879-1900.
- Demuzere, M., et al. (2021). A global map of local climate zones to support earth system modelling and urban-scale environmental science. *Earth System Science Data*.
- [LCZ Generator Documentation](https://lcz-generator.rub.de/)
- [Mapterhorn Terrain Tiles](https://protomaps.com/blog/mapterhorn-terrain/)
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/)
