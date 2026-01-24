# libre-lcz

**LCZ × COG × MapLibre × Mapterhorn × GitHub Pages**

A clean, single-file web map application visualizing Local Climate Zones (LCZ) data from Cloud Optimized GeoTIFFs (COG) with 3D terrain provided by Mapterhorn, built with MapLibre GL JS, Vite, and deployed on GitHub Pages.

**LCZ × COG × MapLibre × Mapterhorn × GitHub Pages**

Cloud Optimized GeoTIFF（COG）形式のLocal Climate Zones（LCZ）データを、Mapterhornによる3D地形と組み合わせて可視化する、クリーンで単一ファイルのWebマップアプリケーションです。MapLibre GL JSとViteで構築し、GitHub Pagesにデプロイします。

## Concept / コンセプト

### What is this? / これは何ですか？

This project demonstrates a modern, minimal approach to web cartography by combining:

このプロジェクトは、以下を組み合わせた、モダンでミニマルなWebカートグラフィーのアプローチを示します：

1. **Local Climate Zones (LCZ)** - Urban climate classification system with 17 categories (10 built types + 7 natural land cover types)
   
   **Local Climate Zones（LCZ）** - 17カテゴリ（建物タイプ10種類 + 自然土地被覆タイプ7種類）を持つ都市気候分類システム

2. **Cloud Optimized GeoTIFFs (COG)** - Efficient raster data format for web streaming
   
   **Cloud Optimized GeoTIFF（COG）** - Webストリーミングに最適化された効率的なラスターデータ形式

3. **MapLibre GL JS** - Open-source mapping library for interactive maps
   
   **MapLibre GL JS** - インタラクティブマップ用のオープンソースマッピングライブラリ

4. **Mapterhorn Terrain** - High-quality global terrain tiles for 3D visualization
   
   **Mapterhorn Terrain** - 3D可視化のための高品質なグローバル地形タイル

5. **Single-File Distribution** - Everything inlined into one `index.html` for maximum portability
   
   **単一ファイル配信** - 最大限のポータビリティのため、すべてを1つの`index.html`にインライン化

### Why Single-File? / なぜ単一ファイル？

The entire application is bundled into a single `index.html` file (~1.4MB) with all JavaScript and CSS inlined. This approach:

アプリケーション全体が、すべてのJavaScriptとCSSをインライン化した単一の`index.html`ファイル（約1.4MB）にバンドルされています。このアプローチには以下の利点があります：

- **Eliminates path issues** on GitHub Pages (no `/assets` or `./assets` references)
  
  **パスの問題を解消** - GitHub Pagesでのパス問題がありません（`/assets`や`./assets`参照なし）

- **Simplifies deployment** - just one file to serve
  
  **デプロイの簡素化** - 配信するのは1つのファイルだけ

- **Improves portability** - works anywhere, even locally without a server
  
  **ポータビリティの向上** - サーバーなしでローカルでも、どこでも動作

- **Reduces HTTP requests** - everything loads in one go
  
  **HTTPリクエストの削減** - すべてが一度にロード

### Architecture / アーキテクチャ

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

## Features / 機能

### LCZ Visualization / LCZ可視化

- **Data Source**: [The global LCZ Map v3](https://lcz-generator.rub.de/global-lcz-map)
  
  **データソース**: [The global LCZ Map v3](https://lcz-generator.rub.de/global-lcz-map)

- **Format**: Single-band categorical Cloud Optimized GeoTIFF (EPSG:3857 Web Mercator projection)
  
  **形式**: シングルバンドカテゴリカルCloud Optimized GeoTIFF（EPSG:3857 Web Mercator投影）

- **Color Scheme**: Standard LCZ colors as defined by the LCZ Generator
  
  **配色スキーム**: LCZ Generatorで定義された標準LCZ色

- **Categories**: 17 classes mapping urban morphology and land cover types
  
  **カテゴリ**: 都市形態と土地被覆タイプを示す17クラス

### 3D Terrain / 3D地形

- **Provider**: Mapterhorn
  
  **プロバイダー**: Mapterhorn

- **Format**: 512×512 WebP tiles, Terrarium encoding
  
  **形式**: 512×512 WebPタイル、Terrariumエンコーディング

- **Source**: Global DEM data (ESA Copernicus GLO-30)
  
  **ソース**: グローバルDEMデータ（ESA Copernicus GLO-30）

- **Implementation**: Raster-DEM source with hillshade layer and terrain exaggeration (1.0× vertical scale)
  
  **実装**: 陰影起伏図レイヤーと地形誇張を伴うRaster-DEMソース（垂直スケール 1.0×）

### Map Controls / マップコントロール

- **Navigation**: Zoom in/out, pitch/rotation controls
  
  **ナビゲーション**: ズームイン/アウト、ピッチ/回転コントロール

- **3D View**: 60° pitch with adjustable bearing, globe projection support
  
  **3Dビュー**: 調整可能な方位角を持つ60°ピッチ、地球儀投影対応

- **Layer Control**: Toggle LCZ and hillshade layer visibility, adjust opacity
  
  **レイヤーコントロール**: LCZレイヤーと陰影起伏図レイヤーの表示/非表示切り替えと透明度調整

- **Interactive Hover**: Display LCZ classification name and value on hover over data
  
  **インタラクティブホバー**: データの上にマウスホバーしたときLCZ分類名と値を表示

## Implementation Details / 実装の詳細

### Technology Stack / 技術スタック

- **MapLibre GL JS**: Open-source map rendering engine
  
  **MapLibre GL JS**: オープンソースマップレンダリングエンジン

- **@geomatico/maplibre-cog-protocol**: COG protocol handler for MapLibre with locationValues for interactive queries
  
  **@geomatico/maplibre-cog-protocol**: MapLibreのCOGプロトコルハンドラー、locationValuesによるインタラクティブクエリ機能付き

- **maplibre-gl-layer-control**: Layer visibility and opacity control panel
  
  **maplibre-gl-layer-control**: レイヤーの表示/非表示と透明度を制御するコントロールパネル

- **Vite**: Modern build tool for bundling
  
  **Vite**: バンドリングのためのモダンビルドツール

- **Custom Vite Plugin**: Inlines all assets into single HTML file
  
  **カスタムViteプラグイン**: すべてのアセットを単一HTMLファイルにインライン化

### Build Process / ビルドプロセス

1. **Development**: Source files in `src/` directory
   
   **開発**: `src/`ディレクトリのソースファイル
   - `index.html` - HTML template / HTMLテンプレート
   - `main.js` - Application logic / アプリケーションロジック
   - `style.css` - Custom styles / カスタムスタイル

2. **Build**: Vite processes and bundles
   
   **ビルド**: Viteが処理とバンドルを実行
   - Compiles ES modules / ESモジュールをコンパイル
   - Bundles MapLibre and dependencies / MapLibreと依存関係をバンドル
   - Inlines all CSS (including MapLibre's CSS) / すべてのCSSをインライン化（MapLibreのCSSを含む）
   - Custom plugin inlines all JavaScript / カスタムプラグインがすべてのJavaScriptをインライン化

3. **Output**: Single `docs/index.html` file
   
   **出力**: 単一の`docs/index.html`ファイル
   - All external references removed / すべての外部参照を削除
   - Ready for GitHub Pages deployment / GitHub Pagesデプロイ準備完了

### LCZ Color Mapping / LCZ色マッピング

The application uses a custom color function to map categorical LCZ values to their standard colors:

アプリケーションは、カテゴリカルLCZ値を標準色にマッピングするカスタム色関数を使用します：

```javascript
const LCZ_COLORS = {
  1: [165, 0, 38],      // Compact high-rise / 高密度高層
  2: [215, 48, 39],     // Compact midrise / 高密度中層
  3: [244, 109, 67],    // Compact low-rise / 高密度低層
  4: [254, 224, 139],   // Open high-rise / 疎開高層
  5: [254, 254, 190],   // Open midrise / 疎開中層
  6: [217, 239, 139],   // Open low-rise / 疎開低層
  7: [102, 189, 99],    // Lightweight low-rise / 軽量低層
  8: [26, 152, 80],     // Large low-rise / 大規模低層
  9: [166, 217, 106],   // Sparsely built / まばらな建物
  10: [110, 1, 107],    // Heavy industry / 重工業
  11: [0, 104, 55],     // Dense trees (A) / 密な樹木
  12: [49, 163, 84],    // Scattered trees (B) / 散在樹木
  13: [184, 225, 134],  // Bush, scrub (C) / 低木・灌木
  14: [255, 255, 191],  // Low plants (D) / 低植生
  15: [253, 174, 97],   // Bare rock or paved (E) / 裸岩または舗装
  16: [244, 109, 67],   // Bare soil or sand (F) / 裸地または砂地
  17: [69, 117, 180]    // Water (G) / 水域
};
```

### COG Preparation (EPSG:3857) / COG前処理

COG は Web Mercator (EPSG:3857) である必要があるため、元データ (EPSG:4326) を次のコマンドで再投影・再パッケージしました：

```bash
gdalwarp -t_srs EPSG:3857 -of COG -co COMPRESS=LZW -co BIGTIFF=YES lcz_filter_v3_cog.tif lcz_filter_v3_cog_3857.tif
```

これにより、@geomatico/maplibre-cog-protocol が要求する EPSG:3857 投影の COG を生成しています。ファイルサイズが大きいため、`BIGTIFF=YES` オプションが必要です。

### Mapterhorn Terrain Integration / Mapterhorn地形統合

The terrain is loaded via MapLibre's `raster-dem` source type using the TileJSON endpoint:

地形は、TileJSONエンドポイントを使用してMapLibreの`raster-dem`ソースタイプでロードされます：

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

陰影起伏図レイヤーが地形の可視化を強化します：

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

## Installation & Development / インストールと開発

### Prerequisites / 前提条件

- Node.js 16+ and npm / Node.js 16+ と npm
- (Optional) [just](https://github.com/casey/just) command runner / （オプション）[just](https://github.com/casey/just)コマンドランナー

### Quick Start / クイックスタート

```bash
# Install dependencies / 依存関係をインストール
npm install

# Development server / 開発サーバー
npm run dev

# Build for production / 本番用ビルド
npm run build

# Preview production build / 本番ビルドのプレビュー
npm run preview
```

### Using Justfile / Justfileの使用

```bash
# Install dependencies / 依存関係をインストール
just install

# Development server / 開発サーバー
just dev

# Build / ビルド
just build

# Preview / プレビュー
just preview
```

## Project Structure / プロジェクト構造

```
libre-lcz/
├── src/                    # Source files / ソースファイル
│   ├── index.html         # HTML template / HTMLテンプレート
│   ├── main.js            # Application entry point / アプリケーションエントリーポイント
│   └── style.css          # Custom styles / カスタムスタイル
├── docs/                   # Build output (GitHub Pages) / ビルド出力（GitHub Pages）
│   └── index.html         # Single-file output (~1.4MB) / 単一ファイル出力（約1.4MB）
├── inline-plugin.js       # Custom Vite plugin for inlining / インライン化用カスタムViteプラグイン
├── vite.config.js         # Vite configuration / Vite設定
├── package.json           # Dependencies / 依存関係
├── Justfile               # Build automation / ビルド自動化
├── README.md              # This file / このファイル
└── LICENSE                # CC0 1.0 Universal
```

## Deployment / デプロイ

### GitHub Pages

1. Build the project: `npm run build` or `just build`
   
   プロジェクトをビルド：`npm run build` または `just build`

2. The output in `docs/index.html` is ready for GitHub Pages
   
   `docs/index.html`の出力がGitHub Pages用に準備完了

3. Configure repository settings:
   
   リポジトリ設定を構成：
   - Go to Settings → Pages / 設定 → Pagesへ移動
   - Source: Deploy from a branch / ソース：ブランチからデプロイ
   - Branch: `main` (or your default branch) / ブランチ：`main`（またはデフォルトブランチ）
   - Folder: `/docs` / フォルダー：`/docs`

### Alternative Deployment / 代替デプロイ

Since the output is a single HTML file, you can:

出力は単一のHTMLファイルなので、以下が可能です：

- Serve it with any static web server / 任意の静的Webサーバーで配信
- Open it directly in a browser (with limitations on external data loading due to CORS) / ブラウザで直接開く（CORSにより外部データ読み込みに制限あり）
- Upload to any static hosting service / 任意の静的ホスティングサービスにアップロード
- Embed in other applications / 他のアプリケーションに埋め込み

## Data Sources & Credits / データソースとクレジット

- **LCZ Data / LCZデータ**: [LCZ Generator, Ruhr-University Bochum](https://lcz-generator.rub.de/)
  - Based on Demuzere et al. (2021) Global LCZ map
  - Demuzere et al. (2021) Global LCZ mapに基づく
  
- **Terrain Data / 地形データ**: [Mapterhorn](https://mapterhorn.com/)
  - Source: ESA Copernicus GLO-30 DEM
  - Served via: tunnel.optgeo.org/martin
  - ソース：ESA Copernicus GLO-30 DEM
  - 提供：tunnel.optgeo.org/martin

- **Mapping Library / マッピングライブラリ**: [MapLibre GL JS](https://maplibre.org/)

- **COG Protocol / COGプロトコル**: [@geomatico/maplibre-cog-protocol](https://github.com/geomatico/maplibre-cog-protocol)

## License / ライセンス

This project is released under CC0 1.0 Universal (Public Domain). See [LICENSE](LICENSE) for details.

このプロジェクトはCC0 1.0 Universal（パブリックドメイン）の下でリリースされています。詳細は[LICENSE](LICENSE)を参照してください。

## References / 参考文献

- Stewart, I. D., & Oke, T. R. (2012). Local climate zones for urban temperature studies. *Bulletin of the American Meteorological Society*, 93(12), 1879-1900.
- Demuzere, M., et al. (2021). A global map of local climate zones to support earth system modelling and urban-scale environmental science. *Earth System Science Data*.
- [LCZ Generator Documentation](https://lcz-generator.rub.de/)
- [Mapterhorn Terrain Tiles](https://protomaps.com/blog/mapterhorn-terrain/)
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/)
