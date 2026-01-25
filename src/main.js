import './style.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cogProtocol, setColorFunction, locationValues } from '@geomatico/maplibre-cog-protocol';
import { LayerControl } from 'maplibre-gl-layer-control';
import 'maplibre-gl-layer-control/style.css';

// Register the COG protocol
maplibregl.addProtocol('cog', cogProtocol);

// LCZ color map (standard colors from LCZ Generator)
const LCZ_COLORS = {
  1: [165, 0, 38],      // Compact high-rise
  2: [215, 48, 39],     // Compact midrise
  3: [244, 109, 67],    // Compact low-rise
  4: [254, 224, 139],   // Open high-rise
  5: [254, 254, 190],   // Open midrise (slightly different from D)
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
  16: [253, 246, 179],  // Bare soil or sand (F)
  17: [69, 117, 180]    // Water (G)
};

// LCZ classification names
const LCZ_NAMES = {
  1: 'Compact high-rise',
  2: 'Compact midrise',
  3: 'Compact low-rise',
  4: 'Open high-rise',
  5: 'Open midrise',
  6: 'Open low-rise',
  7: 'Lightweight low-rise',
  8: 'Large low-rise',
  9: 'Sparsely built',
  10: 'Heavy industry',
  11: 'Dense trees',
  12: 'Scattered trees',
  13: 'Bush, scrub',
  14: 'Low plants',
  15: 'Bare rock or paved',
  16: 'Bare soil or sand',
  17: 'Water'
};

// Terrain configuration constants
const TERRAIN_EXAGGERATION = 1.0;
const HILLSHADE_EXAGGERATION = 0.3;

// COG URL
const cogUrl = 'https://tunnel.optgeo.org/lcz_filter_v3_cog_3857.tif';

// Set custom color function for LCZ categorical data
setColorFunction(cogUrl, (pixel, color, metadata) => {
  const value = pixel[0];
  
  // Check if it's noData
  if (value === metadata.noData || value === 0) {
    color.set([0, 0, 0, 0]); // Transparent
    return;
  }
  
  // Apply LCZ color scheme
  const lczColor = LCZ_COLORS[value];
  if (lczColor) {
    color.set([lczColor[0], lczColor[1], lczColor[2], 255]);
  } else {
    color.set([0, 0, 0, 0]); // Transparent for unknown values
  }
});

// Initialize map
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#f0f0f0'
        }
      }
    ]
  },
  center: [7.5, 51.0], // Default center: Central Europe (Germany/Netherlands border region)
  zoom: 6,
  pitch: 60, // Add pitch for 3D view
  hash: 'map',
  maxZoom: 18,
  minZoom: 0,
  maxPitch: 85
});

// Lightweight loading overlay until LCZ tiles are available
const loadingOverlay = document.createElement('div');
loadingOverlay.style.cssText = `
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  font-family: sans-serif;
  font-size: 18px;
  z-index: 2000;
`;
loadingOverlay.textContent = 'Loading LCZ…';
document.body.appendChild(loadingOverlay);

const hideLoading = () => {
  if (loadingOverlay.style.display !== 'none') {
    loadingOverlay.style.display = 'none';
    map.off('sourcedata', onSourceData);
  }
};

const onSourceData = (e) => {
  if (e.sourceId === 'lcz' && e.isSourceLoaded) {
    hideLoading();
  }
};

map.on('sourcedata', onSourceData);
map.once('idle', hideLoading);
setTimeout(hideLoading, 15000); // failsafe

// Add navigation controls
map.addControl(new maplibregl.NavigationControl());

// Add error handler for map loading failures
map.on('error', (e) => {
  // Ignore known globe projection fog error (fog is not used in this app)
  if (e.error && e.error.message && e.error.message.includes('calculateFogMatrix')) {
    return;
  }
  console.error('Map error:', e.error);
});

// Add sources and layers when map loads
map.on('load', () => {
  // Add Mapterhorn terrain source using the TileJSON endpoint
  // This provides 512x512 WebP Terrarium-encoded terrain tiles
  map.addSource('mapterhorn-terrain', {
    type: 'raster-dem',
    url: 'https://tiles.mapterhorn.com/tilejson.json',
    tileSize: 512,
    encoding: 'terrarium'
  });

  // Add LCZ COG using the cog:// protocol with custom color function
  map.addSource('lcz', {
    type: 'raster',
    url: `cog://${cogUrl}`,
    tileSize: 256,
    attribution: '<a href="https://lcz-generator.rub.de/global-lcz-map">The global LCZ Map v3</a>'
  });

  // Add LCZ raster layer
  map.addLayer({
    id: 'lcz-layer',
    type: 'raster',
    source: 'lcz',
    paint: {
      'raster-opacity': 0.7
    }
  });

  // Set 3D terrain using Mapterhorn
  map.setTerrain({
    source: 'mapterhorn-terrain',
    exaggeration: TERRAIN_EXAGGERATION
  });
  
  // Add hillshade layer for better terrain visualization
  // Add after LCZ layer to avoid obscuring the COG data
  map.addLayer({
    id: 'hillshade',
    type: 'hillshade',
    source: 'mapterhorn-terrain',
    paint: {
      'hillshade-exaggeration': HILLSHADE_EXAGGERATION
    }
  });

  // Set globe projection at the appropriate time
  map.setProjection({
    type: 'globe'
  });

  // Add layer control for LCZ and hillshade layers
  const layerControl = new LayerControl({
    collapsed: true,
    layers: ['lcz-layer', 'hillshade'],
    panelWidth: 300,
    panelMinWidth: 240,
    panelMaxWidth: 400
  });

  map.addControl(layerControl, 'top-right');

  // Add hover tooltip for LCZ classification
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute;
    display: none;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: sans-serif;
    font-size: 14px;
    pointer-events: none;
    z-index: 1000;
  `;
  document.body.appendChild(tooltip);

  map.on('mousemove', (e) => {
    const { lngLat: { lat: latitude, lng: longitude }, point: { x, y } } = e;
    const zoom = map.getZoom();

    locationValues(cogUrl, { latitude, longitude }, zoom)
      .then(values => {
        const lczValue = Math.round(values[0]);
        
        if (isNaN(lczValue) || lczValue === 0 || !LCZ_NAMES[lczValue]) {
          tooltip.style.display = 'none';
          map.getCanvas().style.cursor = '';
        } else {
          tooltip.style.display = 'block';
          tooltip.style.left = (x + 15) + 'px';
          tooltip.style.top = (y + 15) + 'px';
          tooltip.innerHTML = `<strong>LCZ ${lczValue}</strong><br/>${LCZ_NAMES[lczValue]}`;
          map.getCanvas().style.cursor = 'pointer';
        }
      })
      .catch(() => {
        tooltip.style.display = 'none';
        map.getCanvas().style.cursor = '';
      });
  });

  map.on('mouseout', () => {
    tooltip.style.display = 'none';
    map.getCanvas().style.cursor = '';
  });
});