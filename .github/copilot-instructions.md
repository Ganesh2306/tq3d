# Q3D Lite Copilot Instructions

## Project Overview

Q3D Lite is a 3D fabric visualization and try-on web application built with **Vite + ES6 modules**. It enables users to virtually drape fabrics on 3D garment models, scan designs via QR/barcodes, and download rendered results. The app supports multi-supplier design libraries, role-based access, credit-based features, and mobile/tablet experiences including dedicated Getzner collection features.

## Architecture & Data Flow

### Core Application Structure

```
src/
├── js/
│   ├── q3dFunction.js       # Main 3D manipulation functions (4383 lines) - MOST CRITICAL
│   ├── q3d.js              # App initialization, QR scanning setup, supplier handling (1334 lines)
│   ├── Q3dlite.js           # Lite mode entry point - simplified fabric/model interface
│   ├── login.js             # Authentication, domain routing, credit/session management (1081 lines)
│   ├── loginPage.js         # UI template generation for login/home screens
│   ├── controller.js        # API data fetching and caching (fabrics by supplier)
│   ├── config.js            # Service URLs, supplier configs (dynamic via window.serviceUrl)
│   ├── ajaxCall.js          # Low-level AJAX/jQuery HTTP wrapper
│   ├── Q3d_ui.js            # Responsive UI state management (height, portrait mode)
│   ├── Tdsunmini.js         # 3D Engine (60K+ lines, minified WebGL/Three.js-like)
│   ├── TdsFabric.min.js     # Fabric.js library for canvas manipulations
│   └── configuration.js     # Role-based feature flags and UI toggles
└── css/                     # Style sheets (no SCSS compilation needed)
```

### Key Data Flow Patterns

1. **Initialization Chain** (`login.js` → `q3d.js` → `q3dFunction.js`):
   - `login.js`: Checks domain (getzner/textronic/etc), sets up session/credits
   - `q3d.js`: Loads 3D plugin, handles QR params (`?k=supplierId&t=designNames`)
   - `q3dFunction.js`: Binds UI events, manages fabric/style draping state

2. **Service Integration**:
   - `window.serviceUrl` set in `index.html` (e.g., `https://tpv.dam3d.in`)
   - All API calls via `ajaxCall.js` (jQuery AJAX wrapper)
   - Design data: `/api/Configuration/GetdrapingImages` (supplier/design lookup)
   - QR scans: `/api/Configuration/QRScan_Q3D` (device login tracking)
   - Render uploads: `rediretTryonToQ3dDrapeFabric()` for post-drape actions

3. **State Management** (Session Storage):
   - `sessionStorage.userLog`: Authentication state
   - `sessionStorage.jsonString`: Serialized config (double-nested JSON!)
   - `sessionStorage.supplierName`: Active collection (used for Getzner season labels)
   - `sessionStorage.FirstTimefabricCall`: Drape-first-load flag

### Plugin Architecture

The app loads a proprietary **3D rendering plugin** (`TdsFabric.min.js` + `Tdsunmini.js`):
- Global `q3d_PluginObj` manages 3D model rendering
- Methods: `loadThreeDImage()`, `applyFabric()`, `loadProductTypeGroup()`
- 3D data: GLTF models + fabric drape simulation stored on CDN paths
- Path pattern: `{cachepath}/{supplierId}/{designName}/{productName}/{styleName}/`

## Development Workflow

### Build & Run
```powershell
npm install          # Install deps (Vite, jQuery, barcode libs, etc.)
npm run dev         # Start Vite dev server (--host for network access)
npm run build       # Production build to dist/
npm run preview     # Preview production build
```

**No TypeScript compilation needed** - all ES6 modules are transpiled by Vite during dev/build.

### Critical Service URL Configuration
Edit `index.html` line 12 to change backend:
```html
<script>
  window.serviceUrl = "https://tpv.dam3d.in";  // Change manually for different environments
</script>
```

## Project Patterns & Conventions

### Module System
- **ES6 imports/exports only** - no CommonJS
- Example: `import { q3d_appendFabric, changeStyleModel } from './q3dFunction.js'`
- jQuery available globally via `import $ from 'jquery'`
- External libs loaded as npm modules: `qr-scanner`, `quagga`, `crypto-js`, `file-saver`, etc.

### Session/State Patterns
- **No Redux/Vuex** - plain sessionStorage for user state
- Decode double-nested JSON carefully: `JSON.parse(JSON.parse(sessionStorage.jsonString).jsonString)`
- Check domain conditionally: `checkClientDomain() === 'getznertech'` vs others
- Device fingerprinting via `canvasFingerPrint.js` for device tracking

### UI Generation
- `loginPage()` and `Homepage()` return HTML strings, injected into `#root`
- jQuery event binding for model/fabric clicks: `#appendFabricList li`, `.style_thumb li`
- Device detection: `ismobile()`, `isIpad()`, `isTotem()`, `isIpadLandscape()` - use to gate UI
- Portrait mode: `h_portrait` class toggles layouts on 0°/90° rotation

### Error Handling
- Custom SweetAlert2 wrappers: `sweetalert_error()`, `sweetalert_success()`, `sweetalert_warning()`
- Direct `alert()` calls in `ajaxCall.js` for generic HTTP errors - consider improving
- **Missing try/catch blocks in async flows** - add when extending API calls

### Credit System Pattern
```javascript
// Check before feature usage
if (!hasCredits('download')) { sweetalert_error('Insufficient credits'); return; }
deduct_credits('download');  // After successful action
```
Activities: `'download'`, `'tryon'`, `'share'` - defined in `login.js` line ~620

### Fabric Drape Workflow
1. User clicks fabric in `#appendFabricList`
2. `q3d_appendFabric(fabricData)` → reads `data-src`, `designSize`, design code
3. `q3d_PluginObj.loadThreeDImage(modelId, fabricUrl, width, height, groupName, callback)`
4. `saveFabricDrapeCount()` logs render to backend (analytics)
5. Optional: `rediretTryonToQ3dDrapeFabric()` for AR try-on

## Integration Points & External Dependencies

### Backend APIs
- **Service URL** (configurable): `/api/Configuration/GetdrapingImages`, `/api/Configuration/QRScan_Q3D`
- **Auth**: Domain-based (no explicit login tokens in code - handled server-side)
- **QR Data**: Expects `?k=supplierId&t=designNames` URL params (hex-encoded supplier ID)

### Barcode/QR Scanning
- **Multiple libraries** coexist (not ideal):
  - `qr-scanner`: Primary (imported in `q3dFunction.js`)
  - `quagga`: Barcode scanning fallback
  - `html5-qrcode`: Imported but usage unclear
  - `@zxing/library`: Imports exist but commented out
- **Pattern**: Check `isScannerRunning` flag before starting cameras to prevent duplicates

### Device-Specific Behaviors
- **Getzner collections** (`getznertech` domain): Show season labels, technical sheets, PDF downloads
- **Q3D Lite mode**: Simplified UI (fewer controls), triggered by `?k` param or config flag `q3d_is_q3d_lite`
- **Totem mode**: Large touch screens - special event handling
- **iPad Landscape**: Special layout for landscape orientation

### Browser APIs
- **Canvas Fingerprinting** (`canvasFingerPrint.js`): Device identification
- **File Download**: `file-saver` for model exports
- **Crypto**: `crypto-js` for password encryption (weak - consider upgrade)

## File Organization Notes

### Working vs. Production Files
- **`q3dFunction_working.js`**: Backup/experimental version - ignore
- **`Tdsunmini_*.js`** (various): Multiple versions - use `Tdsunmini.js` (latest imported in login.js)
- **`login.js` vs `login1.js`**: Both exist - `login.js` is primary (line imports check `./login`)

### CSS Architecture
- **No SCSS preprocessing** - plain CSS with `@import` chains
- Load order in `login.js`: `common.css` → `style.css` → `jquery-ui.css` → others
- Bootstrap 5 via npm (responsive utilities): `container-fluid`, `d-none`, `d-lg-block`
- jQuery UI for date pickers and dialogs

## Common Development Tasks

### Adding a New Feature
1. Create handler function in `q3dFunction.js` (export with `q3d_` prefix convention)
2. Import in `q3d.js` and bind to UI element: `document.getElementById('btn').addEventListener('click', handler)`
3. Check credits if monetized: `if (!hasCredits('feature')) return;` then `deduct_credits('feature')`
4. Use `sweetalert_*` for user feedback
5. Test on multiple devices: mobile `ismobile()`, iPad `isIpad()`, Totem `isTotem()`

### Debugging Drape Issues
- Check fabric path resolution: `q3dDrapingFile(fabricImageUrl)` (defined in `q3dFunction.js`)
- Verify 3D model GLTF exists: `{catchepath}/{supplierId}/{designName}/{productName}/{styleName}.glb`
- Inspect plugin state: `console.log(q3d_PluginObj)` (global, initialized in `q3d.js`)
- Check `ModelwiseDrapeCount` object (tracks renders per style for analytics)

### Adding an API Call
1. Define URL in `config.js` or use dynamic `serviceUrl`
2. Use `getData(url)` or `PostData(url, data, async)` from `ajaxCall.js`
3. Handle async: both return Promises (despite `PostData` not awaiting in current code)
4. Add error feedback: `catch(err) => sweetalert_error(err.message)`

## Known Technical Debt
- **Crypto-JS for passwords**: Weak, should migrate to bcrypt/PBKDF2
- **Multiple QR/barcode libraries**: Consolidate to single library
- **Global variables in module scope**: `q3d_PluginObj`, `fabricPluginObj`, `configuration`, etc. - consider module class
- **sessionStorage double-nested JSON**: Legacy - migration path unclear
- **ajaxCall.js errors**: Generic `alert()` instead of proper error events
- **4K+ line files**: `q3dFunction.js` needs refactoring into domain modules
- **No unit tests**: All QA manual
- **Vite config missing**: Using defaults (may need custom GLTF loader setup)

## Documentation & References
- **Service URL**: Must be set in `index.html` before page load - no runtime override
- **Device Modes**: Check `ismobile()` output in console to verify detection
- **Config Flags**: See `configuration.js` for feature toggles (`q3d_display_groups`, `q3d_drape_first_fabric`, etc.)
- **QR Param Format**: `supplierId` in hex, `designNames` comma-separated, URL-encoded
