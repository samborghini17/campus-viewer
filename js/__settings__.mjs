import { script } from './playcanvas-stable.min.mjs';

const ASSET_PREFIX = "";
const SCRIPT_PREFIX = "";
const SCENE_PATH = "2417720.json";
const CONTEXT_OPTIONS = {
    'antialias': false,
    'alpha': false,
    'preserveDrawingBuffer': false,
    'deviceTypes': [
        `webgl2`,
        `webgl1`
    ],
    'powerPreference': "high-performance"
};
const SCRIPTS = [
    274249939,
    274249936,
    274249952,
    274249962,
    274249948,
    274249971,
    274249945,
    274249937,
    274249956,
    274249949,
    274249943,
    274249944,
    274550589,
    274563330,
    274563528,
    274996928,
    275343124,
    275960569,
    276359275,
    279285840
];
const CONFIG_FILENAME = "config.json";
const INPUT_SETTINGS = {
    useKeyboard: true,
    useMouse: true,
    useGamepads: false,
    useTouch: true
};
const PRELOAD_MODULES = [
    {
        'moduleName': 'Ammo',
        'glueUrl': 'files/assets/274249955/1/ammo.wasm.js',
        'wasmUrl': 'files/assets/274249942/1/ammo.wasm.wasm',
        'fallbackUrl': 'files/assets/274249963/1/ammo.js',
        'preload': true
    }
];
script.legacy = false;

export { ASSET_PREFIX, CONFIG_FILENAME, CONTEXT_OPTIONS, INPUT_SETTINGS, PRELOAD_MODULES, SCENE_PATH, SCRIPTS, SCRIPT_PREFIX };
