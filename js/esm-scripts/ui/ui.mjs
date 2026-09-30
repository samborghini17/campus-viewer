import { createScript, platform, Vec2, Vec3 } from '../../playcanvas-stable.min.mjs';

var UI = createScript('ui');
UI.attributes.add('cssAsset', {
    type: 'asset',
    assetType: 'css',
    title: 'CSS Asset'
});
UI.attributes.add('htmlAsset', {
    type: 'asset',
    assetType: 'html',
    title: 'HTML Asset'
});
UI.attributes.add('totalSplats', {
    type: 'number',
    default: 34904729,
    title: 'Total Splats'
});
UI.prototype.initialize = function () {
    this._buttons = new Map();
    this._isMobileUi = platform.mobile || window.innerWidth <= 600;
    this._currentPreset = this._isMobileUi ? 'mob-ultra' : 'ultra';
    this.uiContainer = document.createElement('div');
    this._currentLevelId = 'lemgo';
    this._uiVisible = true;
    this._tourVisible = false;
    this._lastSwitchTime = 0;
    this.history = [];
    this.isJumpingBack = false;
    this.currentLang = 'de';
    this._levelData = {
        'lemgo': {
            prefix_de: 'auf dem',
            name_de: 'Innovation Campus Lemgo',
            prefix_en: 'at',
            name_en: 'Innovation Campus Lemgo',
            link: 'https://www.icl-owl.de/',
            mode: 'orbit'
        },
        'detmold': {
            logoUrl: './kcd.png',
            titleDe: 'Kreativ Campus Detmold',
            titleEn: 'Creative Campus Detmold',
            prefix_de: 'auf dem',
            name_de: 'Kreativ Campus Detmold',
            prefix_en: 'at',
            name_en: 'Kreativ Campus Detmold',
            link: 'https://www.th-owl.de/g/service/kreativ-campus-detmold/',
            mode: 'orbit'
        },
        'innospin': {
            prefix_de: 'im',
            name_de: 'InnovationSPIN',
            prefix_en: 'in the',
            name_en: 'InnovationSPIN',
            link: 'https://innovationspin.de/',
            mode: 'fly'
        },
        'kio-innen-map-fusion': {
            prefix_de: 'im',
            name_de: 'KreativInstitut.OWL (KIO)',
            prefix_en: 'in the',
            name_en: 'KreativInstitut.OWL (KIO)',
            link: 'https://kreativ.institute/de',
            mode: 'fly'
        },
        'mensa': {
            prefix_de: 'in der',
            name_de: 'Mensa',
            prefix_en: 'in the',
            name_en: 'Canteen',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        },
        'audimax': {
            prefix_de: 'im',
            name_de: 'Audimax',
            prefix_en: 'in the',
            name_en: 'Auditorium',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        },
        'gebauede1': {
            prefix_de: 'im',
            name_de: 'Gebäude 1',
            prefix_en: 'in',
            name_en: 'Building 1',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'berufsfoerderzentrum': {
            prefix_de: 'im',
            name_de: 'Berufsförderzentrum',
            prefix_en: 'in the',
            name_en: 'Vocational Training Center',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        },
        'pca': {
            prefix_de: 'in der',
            name_de: 'Phoenix Contact Arena',
            prefix_en: 'in the',
            name_en: 'Phoenix Contact Arena',
            link: 'https://www.phoenix-contact-arena.de/',
            mode: 'fly'
        },
        'smartfactory-innen': {
            prefix_de: 'in der',
            name_de: 'SmartFactoryOWL',
            prefix_en: 'in the',
            name_en: 'SmartFactoryOWL',
            link: 'https://www.smartfactory-owl.de/',
            mode: 'fly'
        },
        'smartfactory-innen-mit-licht': {
            prefix_de: 'in der',
            name_de: 'SmartFactoryOWL',
            prefix_en: 'in the',
            name_en: 'SmartFactoryOWL',
            link: 'https://www.smartfactory-owl.de/',
            mode: 'fly'
        },
        'fff-innen': {
            prefix_de: 'in der',
            name_de: 'Future Food Factory',
            prefix_en: 'in the',
            name_en: 'Future Food Factory',
            link: 'https://www.th-owl.de/fff/',
            mode: 'fly'
        },
        'fff-labor-neu': {
            prefix_de: 'in der',
            name_de: 'Future Food Factory (Labor)',
            prefix_en: 'in the',
            name_en: 'Future Food Factory (Lab)',
            link: 'https://www.th-owl.de/fff/',
            mode: 'fly'
        },
        'ciit': {
            prefix_de: 'im',
            name_de: 'CENTRUM INDUSTRIAL IT (CIIT)',
            prefix_en: 'in the',
            name_en: 'CENTRUM INDUSTRIAL IT (CIIT)',
            link: 'https://www.ciit-owl.de/',
            mode: 'fly'
        },
        'ciit-citrus': {
            prefix_de: 'im',
            name_de: 'CIIT (Citrus)',
            prefix_en: 'in the',
            name_en: 'CIIT (Citrus)',
            link: 'https://www.ciit-owl.de/',
            mode: 'fly'
        },
        'innospin-medienzentrum': {
            prefix_de: 'im',
            name_de: 'InnovationSPIN Medienzentrum',
            prefix_en: 'in the',
            name_en: 'InnovationSPIN Media Center',
            link: 'https://innovationspin.de/',
            mode: 'fly'
        },
        'fotostudio': {
            prefix_de: 'im',
            name_de: 'Fotostudio',
            prefix_en: 'in the',
            name_en: 'Photo Studio',
            link: 'https://www.th-owl.de/mk/',
            mode: 'fly'
        },
        'stereo-studio': {
            prefix_de: 'im',
            name_de: 'Stereo Studio',
            prefix_en: 'in the',
            name_en: 'Stereo Studio',
            link: 'https://www.th-owl.de/mk/',
            mode: 'fly'
        },
        'splat-studio-klein': {
            prefix_de: 'im',
            name_de: 'Kleines Studio',
            prefix_en: 'in the',
            name_en: 'Small Studio',
            link: 'https://www.th-owl.de/mk/',
            mode: 'fly'
        },
        'hoerraum': {
            prefix_de: 'im',
            name_de: 'Hörraum',
            prefix_en: 'in the',
            name_en: 'Listening Room',
            link: 'https://www.th-owl.de/mk/',
            mode: 'fly'
        },
        'surround-studio': {
            prefix_de: 'im',
            name_de: 'Surround Studio',
            prefix_en: 'in the',
            name_en: 'Surround Studio',
            link: 'https://www.th-owl.de/mk/',
            mode: 'fly'
        },
        'icl-bistro': {
            prefix_de: 'im',
            name_de: 'Bistro',
            prefix_en: 'in the',
            name_en: 'Bistro',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-ewerkstatt': {
            prefix_de: 'in der',
            name_de: 'LBK E-Werkstatt',
            prefix_en: 'in the',
            name_en: 'LBK E-Workshop',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-fotostudio': {
            prefix_de: 'im',
            name_de: 'Fotostudio',
            prefix_en: 'in the',
            name_en: 'Photo Studio',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-sternwarte': {
            prefix_de: 'in der',
            name_de: 'Sternwarte',
            prefix_en: 'in the',
            name_en: 'Astro-Observatory',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-sternwarte-rot': {
            prefix_de: 'in der',
            name_de: 'ICL Sternwarte (Rotlicht)',
            prefix_en: 'in the',
            name_en: 'ICL Observatory (Red light)',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'et-3et': {
            prefix_de: 'im',
            name_de: 'Elektrotechnik Labor (Ebene 3)',
            prefix_en: 'in the',
            name_en: 'Electrical Engineering Lab (Level 3)',
            link: 'https://www.th-owl.de/elektrotechnik/',
            mode: 'fly'
        },
        'et-4et': {
            prefix_de: 'im',
            name_de: 'Elektrotechnik Labor (Ebene 4)',
            prefix_en: 'in the',
            name_en: 'Electrical Engineering Lab (Level 4)',
            link: 'https://www.th-owl.de/elektrotechnik/',
            mode: 'fly'
        },
        'laufwege-map-fusion': {
            prefix_de: 'auf den',
            name_de: 'Laufwegen',
            prefix_en: 'on the',
            name_en: 'Walkways',
            link: '',
            mode: 'fly'
        },
        'laufwege-map-fusion-max-quality': {
            prefix_de: 'auf den',
            name_de: 'Laufwegen',
            prefix_en: 'on the',
            name_en: 'Walkways',
            link: '',
            mode: 'fly'
        },
        'icl-grosskueche-mensa': {
            prefix_de: 'in der',
            name_de: 'Großküche Mensa',
            prefix_en: 'in the',
            name_en: 'Canteen Kitchen',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-holz-hauswirtschaft': {
            prefix_de: 'in der',
            name_de: 'Holz- & Hauswirtschaft',
            prefix_en: 'in the',
            name_en: 'Wood & Home Economics',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-mac-raum': {
            prefix_de: 'im',
            name_de: 'LBK Mac-Raum',
            prefix_en: 'in the',
            name_en: 'LBK Mac Room',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'icl-metallwerkstatt': {
            prefix_de: 'in der',
            name_de: 'Metallwerkstatt',
            prefix_en: 'in the',
            name_en: 'Metal Workshop',
            link: 'https://www.icl-owl.de/',
            mode: 'fly'
        },
        'iku-owl-innen': {
            prefix_de: 'im',
            name_de: 'IKU.OWL',
            prefix_en: 'in the',
            name_en: 'IKU.OWL',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        },
        'lemgo-max': {
            prefix_de: 'auf dem',
            name_de: 'Lemgo Campus (Max Detail)',
            prefix_en: 'at',
            name_en: 'Lemgo Campus (Max Detail)',
            link: 'https://www.th-owl.de/',
            mode: 'orbit'
        },
        'lernfabrik-innen': {
            prefix_de: 'in der',
            name_de: 'Lernfabrik',
            prefix_en: 'in the',
            name_en: 'Learning Factory',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        },
        'lt-2et': {
            prefix_de: 'in der',
            name_de: 'LT 2. Etage',
            prefix_en: 'on the',
            name_en: 'LT 2nd Floor',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        },
        'lt-eg': {
            prefix_de: 'im',
            name_de: 'LT Erdgeschoss',
            prefix_en: 'on the',
            name_en: 'LT Ground Floor',
            link: 'https://www.th-owl.de/',
            mode: 'fly'
        }
    };
    this.app.levelData = this._levelData;
    this.dict = {
        de: {
            menuBtn: 'Menü',
            menuHome: 'Zum Start (Lemgo)',
            menuHelpOn: 'Steuerung einblenden',
            menuHelpOff: 'Steuerung ausblenden',
            menuUiOn: 'UI einblenden',
            menuUiOff: 'UI ausblenden',
            menuReset: 'Kamera Reset',
            menuImprint: 'Impressum',
            menuBack: 'Zurück springen',
            menuToggleControl: 'Steuerung: Drag/Orbit',
            welcome: 'Willkommen zum interaktiven Campus',
            locationIntro: 'Du befindest dich derzeit',
            switchDetmold: 'Zum Campus Detmold',
            switchLemgo: 'Zum Campus Lemgo',
            controls: 'Steuerung',
            desktop: 'Desktop (Maus & Tastatur)',
            touch: 'Touch Geräte',
            ttLow: 'Schnell (Geringe Qualität)',
            ttMed: 'Ausgewogen (Standard)',
            ttHigh: 'Hohe Details',
            ttUltra: 'Maximale Details',
            flyDesktop: '<li><b>WASD / Pfeile</b>: Laufen / Fliegen</li><li><b>Q / E</b>: Runter / Hoch</li><li><b>Shift</b>: Schneller</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);"><span style="color:var(--col-cyan);font-weight:bold;">[ESC]</span>: UI klicken / Menü öffnen</li><li><b>Rechte Maustaste + Ziehen</b>: Umsehen</li>',
            flyTouch: '<li><b>Joystick</b>: Bewegen</li><li><b>1 Finger (Bildschirm)</b>: Umsehen</li>',
            orbitDesktop: '<li><b>Linke Taste</b>: Drehen (Orbit)</li><li><b>Mausrad</b>: Zoomen</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);"><b>WASD</b>: Frei bewegen (Pan)</li><li><b>Q/E</b>: Runter/Hoch · <b>Shift</b>: Schneller</li>',
            orbitTouch: '<li><b>1 Finger</b>: Drehen</li><li><b>2 Finger</b>: Zoom/Pan</li>',
            ctrlFps: 'Shooter-Steuerung',
            ctrlDrag: 'Orbit-Steuerung',
            toolsHeader: 'Werkzeuge',
            cullingOn: 'Culling: AN',
            cullingOff: 'Culling: AUS',
            cullDist: 'Culling-Distanz',
            debugMode: 'Debug Modus',
            screenshot: 'Screenshot (F2)',
            adaptiveOn: 'Auto-Qualität: AN',
            adaptiveOff: 'Auto-Qualität: AUS',
            navMobileMap: 'Karte / Orte',
            navTitle: 'Navigation',
            navCampus: 'Campus Auswahl',
            navSpawnpoints: 'Orte im Raum'
        },
        en: {
            menuBtn: 'Menu',
            menuHome: 'To Start (Lemgo)',
            menuHelpOn: 'Show Controls',
            menuHelpOff: 'Hide Controls',
            menuUiOn: 'Show UI',
            menuUiOff: 'Hide UI',
            menuReset: 'Camera Reset',
            menuImprint: 'Imprint',
            menuBack: 'Jump Back',
            menuToggleControl: 'Controls: Drag/Orbit',
            welcome: 'Welcome to the interactive campus',
            locationIntro: 'You are currently',
            switchDetmold: 'To Detmold Campus',
            switchLemgo: 'To Lemgo Campus',
            controls: 'Controls',
            desktop: 'Desktop (Mouse & Keyboard)',
            touch: 'Touch Devices',
            ttLow: 'Fast (Low Quality)',
            ttMed: 'Balanced (Default)',
            ttHigh: 'High Details',
            ttUltra: 'Maximum Details',
            flyDesktop: '<li><b>WASD / Arrows</b>: Walk / Fly</li><li><b>Q / E</b>: Down / Up</li><li><b>Shift</b>: Faster</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);"><span style="color:var(--col-cyan);font-weight:bold;">[ESC]</span>: Click UI / Open Menu</li><li><b>Right-Click + Drag</b>: Look around</li>',
            flyTouch: '<li><b>Joystick</b>: Move</li><li><b>1 Finger (Screen)</b>: Look around</li>',
            orbitDesktop: '<li><b>Left Click</b>: Rotate (Orbit)</li><li><b>Mouse Wheel</b>: Zoom</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);"><b>WASD</b>: Move freely (Pan)</li><li><b>Q/E</b>: Down/Up · <b>Shift</b>: Faster</li>',
            orbitTouch: '<li><b>1 Finger</b>: Rotate</li><li><b>2 Finger</b>: Zoom/Pan</li>',
            ctrlFps: 'Shooter Controls',
            ctrlDrag: 'Orbit Controls',
            toolsHeader: 'Tools',
            cullingOn: 'Culling: ON',
            cullingOff: 'Culling: OFF',
            cullDist: 'Culling Distance',
            debugMode: 'Debug Mode',
            screenshot: 'Screenshot (F2)',
            adaptiveOn: 'Auto Quality: ON',
            adaptiveOff: 'Auto Quality: OFF',
            navMobileMap: 'Map / Places',
            navTitle: 'Navigation',
            navCampus: 'Select Campus',
            navSpawnpoints: 'Places'
        }
    };
    this._loadTranslations = function (lang, callback) {
        var self = this;
        fetch('/translations/' + lang + '.json')
            .then(res => res.json())
            .then(data => {
                self.dict[lang] = Object.assign({}, self.dict[lang] || {}, data);
                if (self.currentLang === lang) {
                    self._applyTranslations();
                    self._applyRTL();
                }
                if (callback) callback();
            })
            .catch(err => {
                console.error("Failed to load translation for " + lang, err);
                if (callback) callback();
            });
    };

    this._applyRTL = function () {
        var isRTL = (this.currentLang === 'ar');
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        if (isRTL) {
            document.body.classList.add('rtl-mode');
        } else {
            document.body.classList.remove('rtl-mode');
        }
    };
    if (this.cssAsset) {
        if (typeof this.cssAsset.resource === 'string') {
            if (this.cssAsset.resource.trim().startsWith('import ') || this.cssAsset.resource.includes('__vite__createHotContext')) {
                console.log('UI: CSS resource is a Vite JS wrapper. Appending link element instead.');
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = this.cssAsset.getFileUrl();
                document.head.appendChild(link);
            } else {
                console.log('UI: CSS resource is string. Adding style tag.');
                var style = document.createElement('style');
                style.textContent = this.cssAsset.resource;
                document.head.appendChild(style);
            }
        } else if (this.cssAsset.resource instanceof HTMLElement) {
            console.log('UI: CSS resource is HTMLElement. Appending directly.');
            document.head.appendChild(this.cssAsset.resource);
        } else if (this.cssAsset.getFileUrl) {
            var url = this.cssAsset.getFileUrl();
            console.log('UI: CSS resource not found, appending link for URL:', url);
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            document.head.appendChild(link);
        } else {
            console.log('UI: CSS asset missing resource and getFileUrl:', this.cssAsset);
        }
    } else {
        console.log('UI: No cssAsset provided!');
    }
    if (this.htmlAsset) {
        this.uiContainer.innerHTML = this.htmlAsset.resource;
        document.body.appendChild(this.uiContainer);
        this._initElements();
        this._initBurgerMenu();
        this._initJoystick();
        this._initSearch();
        this._initRealtimeEditor();
        this._updateButtonStates();
        this._loadTranslations(this.currentLang);
    }
    setInterval(() => {
        var vrBtn = document.querySelector('.webxr-button, .pc-webxr-button, #webxr-button, button[title*="VR"]');
        if (vrBtn) vrBtn.innerText = this.currentLang === 'de' ? 'VR STARTEN' : 'ENTER VR';
    }, 1000);
    this.app.on('ui:setPreset', this._onPresetChanged, this);
    this.app.on('ui:updateStats', this._onUpdateStats, this);
    this.app.on('level:switch', this._onLevelSwitchEvent, this);
    this.on('destroy', this.onDestroy, this);
    this._updateContent('lemgo');
    setTimeout(() => this._applyDefaultPresetForLevel('lemgo'), 0);
};
UI.prototype._initElements = function () {
    var self = this;
    [
        'ultra',
        'high',
        'medium',
        'low',
        'mob-med',
        'mob-ultra'
    ].forEach(function (quality) {
        var btn = document.getElementById('btn-' + quality);
        if (btn) {
            self._buttons.set(quality, btn);
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            self._buttons.set(quality, newBtn);
            newBtn.addEventListener('click', function (e) {
                self.app.fire('preset:' + quality);
                self._onPresetChanged(quality);
            });
            // FIX: Das 'touchstart' Event, das auf Handys Klicks blockiert hat, wurde entfernt!
            [
                'mousedown'
            ].forEach((ev) => newBtn.addEventListener(ev, (e) => e.stopPropagation()));
        }
    });
    this._splatCountEl = document.getElementById('splat-count');
    var introModal = document.getElementById('intro-modal');
    var btnIntroStart = document.getElementById('btn-intro-start');
    if (introModal && btnIntroStart) {
        introModal.style.display = 'flex';
        var startIntro = function (e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            introModal.style.display = 'none';
            // Maybe notify app that intro is done
            self.app.fire('ui:intro:finished');
        };
        btnIntroStart.addEventListener('click', startIntro);
        btnIntroStart.addEventListener('touchstart', startIntro, { passive: false });
        btnIntroStart.addEventListener('pointerdown', startIntro);
    }
    var switchBtn = document.getElementById('btn-switch-campus');
    if (switchBtn) {
        switchBtn.onclick = function (e) {
            e.preventDefault();
            self.app.fire('level:switch', 'detmold');
        };
    }
    var card = document.getElementById('controls-card');
    var header = document.getElementById('controls-header');
    if (card && header) {
        header.addEventListener('click', function () {
            card.classList.toggle('collapsed');
        });
        if (platform.mobile) {
            card.style.display = 'none';
            card.classList.add('collapsed');
        } else {
            card.style.display = 'block';
            card.classList.remove('collapsed');
        }
        this._listDesktop = document.getElementById('ctrl-list-desktop');
        this._listTouch = document.getElementById('ctrl-list-touch');
    }
};
UI.prototype._initBurgerMenu = function () {
    var self = this;
    var container = document.getElementById('burger-menu-container');
    var btn = document.getElementById('burger-btn');
    var langBtns = document.querySelectorAll('.lang-btn');
    var homeBtn = document.getElementById('menu-home');
    var helpBtn = document.getElementById('menu-help');
    var resetBtn = document.getElementById('menu-reset');
    var toggleUiBtn = document.getElementById('menu-toggle-ui');
    var burgerDropdown = document.getElementById('burger-dropdown');
    var themeBtn = document.getElementById('menu-theme-toggle');
    if (!container || !btn) return;

    // Theme Toggle Logic
    if (themeBtn) {
        themeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var root = document.documentElement;
            root.classList.toggle('theme-light');

            var isLight = root.classList.contains('theme-light');
            document.getElementById('icon-theme').innerText = isLight ? '🌙' : '☀️';
            document.getElementById('lbl-menu-theme').innerText = isLight ? (self.currentLang === 'de' ? 'Dark Mode' : 'Dark Mode') : (self.currentLang === 'de' ? 'Light Mode' : 'Light Mode');
        });
    }

    // Mouse-Only Indoor Toggle
    window.appSettings = window.appSettings || { indoorMouseOnly: false };
    var mouseBtn = document.getElementById('menu-mouse-toggle');
    if (mouseBtn) {
        mouseBtn.addEventListener('pointerdown', function (e) {
            e.stopPropagation();
            window.appSettings.indoorMouseOnly = !window.appSettings.indoorMouseOnly;
            var isOn = window.appSettings.indoorMouseOnly;
            var lbl = document.getElementById('lbl-menu-mouse');
            if (lbl) lbl.innerText = isOn ? 'Indoor: Maus-Steuerung AN' : 'Indoor: Maus-Steuerung AUS';
            mouseBtn.style.color = isOn ? 'var(--col-red)' : '';
            mouseBtn.style.opacity = isOn ? '1' : '0.7';

            // Re-apply camera mode immediately
            var lm = self.app.root.findByName('LevelManager');
            if (lm && lm.script && lm.script.levelManager) {
                var mgr = lm.script.levelManager;
                var cfg = mgr.getConfigById(mgr.currentLevelId);
                if (cfg) {
                    var hasCol = mgr._dynamicColliderEntity != null || cfg.collider != null;
                    mgr.setCameraMode(cfg.mode || 'fly', cfg.bounds, hasCol);
                }
            }
        });
    }

    // Mobile presets
    ['mob-med', 'mob-ultra'].forEach(preset => {
        var btn = document.getElementById('btn-' + preset);
        if (btn) {
            self._buttons.set(preset, btn);
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            self._buttons.set(preset, newBtn);
            newBtn.addEventListener('click', function (e) {
                self.app.fire('preset:' + preset);
                self._onPresetChanged(preset);
            });
        }
    });

    this._updateButtonStates();

    var controlsCard = document.getElementById('controls-card');
    if (controlsCard) {
        if (window.innerWidth <= 600) {
            controlsCard.style.display = 'none';
        } else {
            controlsCard.classList.add('collapsed');
        }
    }

    var currentPreset = self._isMobileUi ? 'btn-mob-ultra' : 'btn-ultra';
    var activeBtn = document.getElementById(currentPreset);
    if (activeBtn) activeBtn.classList.add('active');

    // TRUE Bulletproof menu handler with Capture Phase
    var toggleMenu = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        container.classList.toggle('open');
        if (container.classList.contains('open')) {
            if (window.innerWidth <= 600) self.app.fire('ui:closePoiSidebar');
            var closeText = (self.currentLang === 'de' ? 'Schließen' : 'Close');
            btn.innerHTML = '<span class="icon">✕</span> <span id="lbl-menu-btn">' + closeText + '</span>';
            btn.setAttribute('data-tooltip', closeText);
            btn.classList.add('active');
        } else {
            var menuText = (self.dict && self.dict[self.currentLang] && self.dict[self.currentLang].menuBtn) ? self.dict[self.currentLang].menuBtn : 'Menü';
            btn.innerHTML = '<span class="icon">☰</span> <span id="lbl-menu-btn">' + menuText + '</span>';
            btn.setAttribute('data-tooltip', menuText);
            btn.classList.remove('active');
        }
        self._translateDynamic();
    };
    btn.onclick = toggleMenu;

    // Use capture phase to intercept before PlayCanvas gets it
    ['touchstart', 'mousedown', 'pointerdown', 'pointerup', 'click', 'dblclick'].forEach(function (ev) {
        btn.addEventListener(ev, function (e) {
            e.stopPropagation();
            if (ev === 'pointerdown' || ev === 'touchstart') toggleMenu(e);
        }, true);
    });

    this.jumpBackBtn = document.getElementById('menu-back');
    if (this.jumpBackBtn) {
        Object.assign(this.jumpBackBtn.style, {
            color: 'var(--text-secondary)',
            fontWeight: 'bold',
            display: 'flex',
            opacity: '0.5',
            pointerEvents: 'none'
        });
        this.jumpBackBtn.onclick = (e) => {
            self.goBack();
            container.classList.remove('open');
            btn.classList.remove('active');
            this._translateDynamic();
        };
    }
    var tourBtn = document.getElementById('menu-tour-toggle');
    if (!tourBtn) {
        tourBtn = document.createElement('button');
        tourBtn.id = 'menu-tour-toggle';
        tourBtn.className = 'menu-item';
        var initText = self._tourVisible ? self.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : self.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
        tourBtn.innerHTML = `<span class="icon">🗺️</span> <span>${initText}</span>`;
        if (resetBtn) resetBtn.parentNode.insertBefore(tourBtn, resetBtn);
        else if (burgerDropdown) burgerDropdown.appendChild(tourBtn);
        tourBtn.onclick = function () {
            self._tourVisible = !self._tourVisible;
            var btnText = self._tourVisible ? self.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : self.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
            this.innerHTML = `<span class="icon">🗺️</span> <span>${btnText}</span>`;
            self.app.fire('ui:toggleTour', self._tourVisible);
        };
    }

    var navOverlay = document.getElementById('nav-overlay');
    var btnMobMap = document.getElementById('btn-mobile-map');
    var navCloseBtn = document.getElementById('nav-close-btn');
    if (btnMobMap) btnMobMap.onclick = function () { if (navOverlay) navOverlay.style.display = 'flex'; };
    if (navCloseBtn) navCloseBtn.onclick = function () { if (navOverlay) navOverlay.style.display = 'none'; };

    var navLevelBtns = document.querySelectorAll('.nav-level-btn');
    navLevelBtns.forEach(function (btn) {
        btn.onclick = function () {
            var lvl = btn.getAttribute('data-level');
            if (lvl && self.app) {
                self.app.fire('level:switch', lvl);
            }
            if (navOverlay) navOverlay.style.display = 'none';
        };
    });

    // Removed menu-level-select (Campus Auswahl) per user request

    // Removed ctrlModeBtn completely per user request

    if (langBtns) {
        langBtns.forEach(function (lBtn) {
            lBtn.onclick = function (e) {
                self.currentLang = lBtn.dataset.lang;
                if (self.dict[self.currentLang]) {
                    self._applyTranslations();
                    self._applyRTL();
                    self.app.fire('lang:switch', self.currentLang);
                } else {
                    self._loadTranslations(self.currentLang, function () {
                        self.app.fire('lang:switch', self.currentLang);
                    });
                }
            };
        });
    }
    btn.addEventListener('click', function (e) {
        // Exit pointer lock so user can interact with menu
        if (document.pointerLockElement) document.exitPointerLock();
        // Do NOT toggle here since toggleMenu on pointerdown might have already toggled it, or handle it properly.
        // Actually, since capture phase calls toggleMenu and calls stopPropagation, this click listener might not fire if a pointer event triggered it.
        // Wait, if it fires, let's just make sure we update the UI text and fire the close event if open.
        // To be safe, we let toggleMenu handle the `.open` class and we just update text based on state.
        if (container.classList.contains('open')) {
            if (window.innerWidth <= 600) self.app.fire('ui:closePoiSidebar');
            var closeText = (self.currentLang === 'de' ? 'Schließen' : 'Close');
            btn.innerHTML = '<span class="icon">✕</span> <span id="lbl-menu-btn">' + closeText + '</span>';
            btn.setAttribute('data-tooltip', closeText);
            btn.classList.add('active');
        } else {
            var menuText = (self.dict && self.dict[self.currentLang] && self.dict[self.currentLang].menuBtn) ? self.dict[self.currentLang].menuBtn : 'Menü';
            btn.innerHTML = '<span class="icon">☰</span> <span id="lbl-menu-btn">' + menuText + '</span>';
            btn.setAttribute('data-tooltip', menuText);
            btn.classList.remove('active');
        }
    });
    this.app.on('ui:closeMenu', function () {
        if (container.classList.contains('open')) {
            container.classList.remove('open');
            var menuText = (self.dict && self.dict[self.currentLang] && self.dict[self.currentLang].menuBtn) ? self.dict[self.currentLang].menuBtn : 'Menü';
            btn.innerHTML = '<span class="icon">☰</span> <span id="lbl-menu-btn">' + menuText + '</span>';
            btn.setAttribute('data-tooltip', menuText);
            btn.classList.remove('active');
        }
    });
    document.addEventListener('click', function (e) {
        if (!container.contains(e.target)) {
            container.classList.remove('open');
            var menuText = (self.dict && self.dict[self.currentLang] && self.dict[self.currentLang].menuBtn) ? self.dict[self.currentLang].menuBtn : 'Menü';
            btn.innerHTML = '<span class="icon">☰</span> <span id="lbl-menu-btn">' + menuText + '</span>';
            btn.setAttribute('data-tooltip', menuText);
            btn.classList.remove('active');
        }
    });
    if (homeBtn) homeBtn.onclick = () => {
        this.app.fire('level:switch', 'lemgo');
    };
    if (resetBtn) resetBtn.onclick = () => {
        this.app.fire('camera:reset');
    };
    if (helpBtn) {
        helpBtn.onclick = function () {
            var controlsCard = document.getElementById('controls-card');
            if (!controlsCard) return;
            var currentVis = controlsCard.style.display !== 'none';
            controlsCard.style.display = currentVis ? 'none' : 'block';
            self._translateDynamic();
        };
    }
    if (toggleUiBtn) {
        toggleUiBtn.onclick = function () {
            self._uiVisible = !self._uiVisible;
            var header = document.getElementById('gsplat-controls');
            var footer = document.getElementById('gsplat-footer');
            var controlsCard = document.getElementById('controls-card');
            var display = self._uiVisible ? '' : 'none';
            var headerDisplay = self._uiVisible ? 'flex' : 'none';
            if (header) header.style.display = headerDisplay;
            if (footer) footer.style.display = display;
            if (controlsCard) controlsCard.style.display = self._uiVisible ? 'block' : 'none';
            self.app.fire('ui:toggleVisibility', self._uiVisible);
            self._translateDynamic();
        };
    }

    var mockFps = document.getElementById('mock-ctrl-fps');
    var mockDrag = document.getElementById('mock-ctrl-drag');
    if (mockFps && mockDrag) {
        mockFps.onclick = function () {
            mockFps.classList.add('active');
            mockFps.style.opacity = '1';
            mockFps.style.color = 'var(--col-red)';
            mockDrag.classList.remove('active');
            mockDrag.style.opacity = '0.5';
            mockDrag.style.color = '';
            self.app.fire('controls:setMode', 'fps');
        };
        mockDrag.onclick = function () {
            mockDrag.classList.add('active');
            mockDrag.style.opacity = '1';
            mockDrag.style.color = 'var(--col-red)';
            mockFps.classList.remove('active');
            mockFps.style.opacity = '0.5';
            mockFps.style.color = '';
            self.app.fire('controls:setMode', 'drag');
        };
    }

    // --- Culling Toggle ---
    this._cullingEnabled = false;
    var cullingBtn = document.getElementById('menu-culling-toggle');
    var updateCullingControls = function (enabled, distance) {
        self._cullingEnabled = !!enabled;
        var lbl = document.getElementById('lbl-culling');
        if (lbl) {
            lbl.innerText = self._cullingEnabled
                ? (self.currentLang === 'de' ? 'Culling: AN' : 'Culling: ON')
                : (self.currentLang === 'de' ? 'Culling: AUS' : 'Culling: OFF');
        }
        if (cullingBtn) {
            cullingBtn.style.color = self._cullingEnabled ? 'var(--col-red)' : '';
            cullingBtn.style.opacity = self._cullingEnabled ? '1' : '0.5';
        }
        var slider = document.getElementById('culling-distance-slider');
        var distanceLabel = document.getElementById('lbl-cull-dist');
        if (slider && Number.isFinite(Number(distance))) slider.value = Number(distance);
        if (slider && distanceLabel) {
            distanceLabel.innerText = (self.currentLang === 'de' ? 'Culling-Distanz: ' : 'Culling Distance: ') + slider.value + 'm';
        }
    };
    this.app.on('culling:state', updateCullingControls);
    if (cullingBtn) {
        cullingBtn.onclick = function () {
            self._cullingEnabled = !self._cullingEnabled;
            updateCullingControls(self._cullingEnabled);
            self.app.fire('culling:toggle', self._cullingEnabled);
        };
    }

    // --- Culling Distance Slider ---
    var cullSlider = document.getElementById('culling-distance-slider');
    var cullLabel = document.getElementById('lbl-cull-dist');
    if (cullSlider) {
        cullSlider.addEventListener('input', function (e) {
            var val = parseInt(e.target.value) || 70;
            if (cullLabel) {
                cullLabel.innerText = (self.currentLang === 'de' ? 'Culling-Distanz: ' : 'Culling Distance: ') + val + 'm';
            }
            self.app.fire('culling:setDistance', val);
        });
        // Stop propagation to prevent canvas interactions
        ['mousedown', 'touchstart'].forEach(function (ev) {
            cullSlider.addEventListener(ev, function (e) { e.stopPropagation(); });
        });
    }

    // --- Debug Mode Toggle ---
    this._debugEnabled = false;
    var debugBtn = document.getElementById('menu-debug-toggle');
    var colScaleContainer = document.getElementById('collider-scale-container');
    var colScaleSlider = document.getElementById('collider-scale-slider');
    var colScaleLbl = document.getElementById('lbl-col-scale');

    if (debugBtn) {
        debugBtn.onclick = function () {
            self._debugEnabled = !self._debugEnabled;
            debugBtn.style.opacity = self._debugEnabled ? '1' : '0.5';
            debugBtn.style.color = self._debugEnabled ? 'var(--col-red)' : '';
            if (colScaleContainer) {
                colScaleContainer.style.display = self._debugEnabled ? 'flex' : 'none';
            }
            // Fire event to toggle debug mode in level-manager + show collider panel
            self.app.fire('debug:menuToggle');
            console.log('[UI] Debug mode:', self._debugEnabled);
        };
    }

    if (colScaleSlider) {
        colScaleSlider.addEventListener('input', function (e) {
            var val = parseFloat(e.target.value) || 1.0;
            if (colScaleLbl) {
                colScaleLbl.innerText = (self.currentLang === 'de' ? 'Collider-Skalierung: ' : 'Collider Scale: ') + val.toFixed(1);
            }
            self.app.fire('collider:setScale', val, val, val);
        });
        ['mousedown', 'touchstart'].forEach(function (ev) {
            colScaleSlider.addEventListener(ev, function (e) { e.stopPropagation(); });
        });
    }

    // --- Screenshot Button ---
    var screenshotBtn = document.getElementById('menu-screenshot');
    if (screenshotBtn) {
        screenshotBtn.onclick = function () {
            self.app.fire('screenshot:take');
        };
    }

    // --- Adaptive Quality Toggle ---
    this._adaptiveEnabled = false;
    var adaptiveBtn = document.getElementById('menu-adaptive-quality');
    if (adaptiveBtn) {
        adaptiveBtn.onclick = function () {
            self._adaptiveEnabled = !self._adaptiveEnabled;
            adaptiveBtn.style.opacity = self._adaptiveEnabled ? '1' : '0.5';
            adaptiveBtn.style.color = self._adaptiveEnabled ? 'var(--col-red)' : '';
            var lbl = document.getElementById('lbl-adaptive');
            if (lbl) {
                lbl.innerText = self._adaptiveEnabled
                    ? (self.currentLang === 'de' ? 'Auto-Qualit\u00e4t: AN' : 'Auto Quality: ON')
                    : (self.currentLang === 'de' ? 'Auto-Qualit\u00e4t: AUS' : 'Auto Quality: OFF');
            }
            self.app.fire('quality:adaptive:toggle', self._adaptiveEnabled);
        };
    }

    // --- Fullscreen Toggle ---
    var fullscreenBtn = document.getElementById('menu-fullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.onclick = function () {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                var el = document.documentElement;
                if (el.requestFullscreen) el.requestFullscreen();
                else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        };
        // Update label on fullscreen change
        var updateFsLabel = function () {
            var lbl = document.getElementById('lbl-fullscreen');
            var isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
            if (lbl) {
                lbl.innerText = isFs
                    ? (self.currentLang === 'de' ? 'Vollbild beenden' : 'Exit Fullscreen')
                    : (self.currentLang === 'de' ? 'Vollbild' : 'Fullscreen');
            }
        };
        document.addEventListener('fullscreenchange', updateFsLabel);
        document.addEventListener('webkitfullscreenchange', updateFsLabel);
    }

    // --- Keyboard Shortcuts Modal ---
    var shortcutsBtn = document.getElementById('menu-shortcuts');
    if (shortcutsBtn) {
        shortcutsBtn.onclick = function () {
            self._showShortcutsModal();
        };
    }

    // --- Gamepad Toggle (Auto-Detect) ---
    window.appSettings = window.appSettings || {};
    window.appSettings.gamepadEnabled = false;
    
    var gamepadToggleBtn = document.getElementById('menu-gamepad-toggle');
    var lblGamepad = document.getElementById('lbl-gamepad');

    var updateGamepadUI = function() {
        if (!gamepadToggleBtn) return;
        gamepadToggleBtn.style.opacity = window.appSettings.gamepadEnabled ? '1' : '0.5';
        gamepadToggleBtn.style.color = window.appSettings.gamepadEnabled ? 'var(--col-red)' : '';
        if (lblGamepad) {
            lblGamepad.innerText = window.appSettings.gamepadEnabled
                ? (self.currentLang === 'de' ? 'Gamepad: AN' : 'Gamepad: ON')
                : (self.currentLang === 'de' ? 'Gamepad: AUS' : 'Gamepad: OFF');
        }
    };

    if (gamepadToggleBtn) {
        gamepadToggleBtn.onclick = function() {
            window.appSettings.gamepadEnabled = !window.appSettings.gamepadEnabled;
            updateGamepadUI();
        };
    }

    // Auto-enable when a controller is connected
    window.addEventListener("gamepadconnected", function(e) {
        console.log("Gamepad connected at index %d: %s.", e.gamepad.index, e.gamepad.id);
        window.appSettings.gamepadEnabled = true;
        updateGamepadUI();
    });

    window.addEventListener("gamepaddisconnected", function(e) {
        console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        var anyConnected = false;
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i] && gamepads[i].connected) anyConnected = true;
        }
        if (!anyConnected) {
            window.appSettings.gamepadEnabled = false;
            updateGamepadUI();
        }
    });

    // --- FPS Meter Toggle (Standard OFF) ---
    this._fpsMeterEnabled = false;
    var fpsToggleBtn = document.getElementById('menu-fps-toggle');
    var fpsBadge = document.getElementById('fps-counter-badge');
    var fpsValEl = document.getElementById('fps-val');
    var fpsMsEl = document.getElementById('fps-ms');
    var lblFps = document.getElementById('lbl-fps');

    if (fpsToggleBtn) {
        fpsToggleBtn.onclick = function () {
            self._fpsMeterEnabled = !self._fpsMeterEnabled;
            if (fpsBadge) fpsBadge.style.display = self._fpsMeterEnabled ? 'flex' : 'none';
            fpsToggleBtn.style.opacity = self._fpsMeterEnabled ? '1' : '0.5';
            fpsToggleBtn.style.color = self._fpsMeterEnabled ? 'var(--col-red)' : '';
            if (lblFps) {
                lblFps.innerText = self._fpsMeterEnabled
                    ? (self.currentLang === 'de' ? 'FPS-Anzeige: AN' : 'FPS Meter: ON')
                    : (self.currentLang === 'de' ? 'FPS-Anzeige: AUS' : 'FPS Meter: OFF');
            }
        };
    }

    // Real-time FPS Calculation in app update loop
    var fpsFrameCount = 0;
    var fpsLastTime = performance.now();
    this.app.on('update', function (dt) {
        if (!self._fpsMeterEnabled) return;
        fpsFrameCount++;
        var now = performance.now();
        var elapsed = now - fpsLastTime;
        if (elapsed >= 500) {
            var fps = Math.round((fpsFrameCount * 1000) / elapsed);
            var ms = (dt * 1000).toFixed(1);
            if (fpsValEl) fpsValEl.innerText = fps;
            if (fpsMsEl) fpsMsEl.innerText = ms + 'ms';
            fpsFrameCount = 0;
            fpsLastTime = now;
        }
    });

    // --- Admin & Level Editor (Password Protected: 'kio') ---
    var adminMenuBtn = document.getElementById('menu-admin-editor');
    var adminModal = document.getElementById('admin-auth-modal');
    var adminForm = document.getElementById('admin-auth-form');
    var adminPwInput = document.getElementById('admin-password-input');
    var adminError = document.getElementById('admin-auth-error');
    var adminCloseBtn = document.getElementById('admin-close-btn');
    var adminCancelBtn = document.getElementById('admin-cancel-btn');
    var editorPanel = document.getElementById('editor-workstation-panel');

    var openEditor = function () {
        if (adminModal) adminModal.classList.add('hidden');
        if (editorPanel) {
            editorPanel.style.display = 'flex';
            self._editorPanelOpen = true;
            self._removeOrphanedBlurState();
            if (self._populateEditorLevel) self._populateEditorLevel(self._currentLevelId);
            self._ensurePrivacyZoneEntities();
            self._setPrivacyVisualsVisible(self._currentLevelId === 'lemgo');
            self._refreshOutlinerTree();
            self._initGizmoSystem();
            self._initViewportPicker();
        }
        self.app.fire('debug:toggle', true);
        var bContainer = document.getElementById('burger-menu-container');
        if (bContainer) bContainer.classList.remove('open');
    };

    var promptAdminAuth = function () {
        if (adminModal) {
            adminModal.classList.remove('hidden');
            if (adminPwInput) {
                adminPwInput.value = '';
                setTimeout(function () { adminPwInput.focus(); }, 50);
            }
            if (adminError) adminError.style.display = 'none';
        }
    };

    if (adminMenuBtn) {
        adminMenuBtn.onclick = function () {
            promptAdminAuth();
        };
    }

    if (adminCloseBtn) adminCloseBtn.onclick = function () { if (adminModal) adminModal.classList.add('hidden'); };
    if (adminCancelBtn) adminCancelBtn.onclick = function () { if (adminModal) adminModal.classList.add('hidden'); };

    if (adminForm) {
        adminForm.onsubmit = function (e) {
            e.preventDefault();
            var pw = adminPwInput ? adminPwInput.value.trim() : '';
            if (pw.toLowerCase() === 'kio') {
                sessionStorage.setItem('thowl_admin', '1');
                if (adminError) adminError.style.display = 'none';
                openEditor();
            } else {
                if (adminError) adminError.style.display = 'block';
                if (adminPwInput) {
                    adminPwInput.style.borderColor = 'var(--col-accent)';
                    adminPwInput.focus();
                    adminPwInput.select();
                    setTimeout(function () { if (adminPwInput) adminPwInput.style.borderColor = ''; }, 1200);
                }
            }
            return false;
        };
    }
};
UI.prototype._initJoystick = function () {
    var self = this;
    var joystickZone = document.getElementById('mobile-joystick-zone');
    var joystickBase = document.getElementById('joystick-base');
    var joystickStick = document.getElementById('joystick-stick');
    if (!joystickZone || !joystickBase || !joystickStick) return;

    var activeTouch = null;
    var baseRect = null;
    var baseCenterX = 0;
    var baseCenterY = 0;
    var maxRadius = 35; // max stick travel from center (half of base minus stick)

    var updateStick = function (touchX, touchY) {
        if (!baseRect) return;
        var dx = touchX - baseCenterX;
        var dy = touchY - baseCenterY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // Clamp to circular radius
        if (dist > maxRadius) {
            dx = (dx / dist) * maxRadius;
            dy = (dy / dist) * maxRadius;
        }

        // Stick is already centered via top/left 50% and negative margin
        joystickStick.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';

        // Normalize to [-1, 1]
        var normX = dx / maxRadius;
        var normY = -dy / maxRadius; // Invert Y: up = positive (forward)
        self.app.fire('joystick:move', normX, normY);
    };

    var resetStick = function () {
        joystickStick.classList.add('joystick-returning');
        joystickStick.style.transform = 'translate(0, 0)';
        self.app.fire('joystick:move', 0, 0);
        activeTouch = null;
        setTimeout(() => { joystickStick.classList.remove('joystick-returning'); }, 200);
    };

    joystickBase.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (activeTouch !== null) return; // Already tracking a touch
        joystickStick.classList.remove('joystick-returning');
        var touch = e.changedTouches[0];
        activeTouch = touch.identifier;
        baseRect = joystickBase.getBoundingClientRect();
        baseCenterX = baseRect.left + baseRect.width / 2;
        baseCenterY = baseRect.top + baseRect.height / 2;
        updateStick(touch.clientX, touch.clientY);
    }, { passive: false });

    joystickBase.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouch) {
                updateStick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                break;
            }
        }
    }, { passive: false });

    var onTouchEnd = function (e) {
        if (activeTouch === null) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouch) {
                resetStick();
                break;
            }
        }
    };

    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    console.log('[UI] Mobile joystick initialized');
};
UI.prototype._initSearch = function () {
    var self = this;
    var searchInput = document.getElementById('level-search');
    var searchResults = document.getElementById('search-results');
    if (!searchInput || !searchResults) return;

    // Prevent clicks in search from closing burger menu
    searchInput.addEventListener('click', function (e) { e.stopPropagation(); });
    searchInput.addEventListener('mousedown', function (e) { e.stopPropagation(); });

    searchInput.addEventListener('input', function () {
        var query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';
        if (query.length < 2) { searchResults.style.display = 'none'; return; }

        var matches = [];
        var levelData = self._levelData;
        for (var id in levelData) {
            var d = levelData[id];
            var name = self.currentLang === 'de' ? d.name_de : d.name_en;
            if (name.toLowerCase().indexOf(query) !== -1 || id.toLowerCase().indexOf(query) !== -1) {
                matches.push({ id: id, name: name, mode: d.mode });
            }
        }

        if (matches.length === 0) {
            searchResults.innerHTML = '<div style="padding:8px 12px; color:rgba(255,255,255,0.5); font-size:12px;">' +
                (self.currentLang === 'de' ? 'Keine Ergebnisse' : 'No results') + '</div>';
            searchResults.style.display = 'block';
            return;
        }

        matches.forEach(function (m) {
            var btn = document.createElement('button');
            btn.className = 'menu-item';
            btn.style.fontSize = '12px';
            btn.style.padding = '6px 12px';
            var modeIcon = m.mode === 'orbit' ? '🌐' : '🏠';
            btn.innerHTML = '<span class="icon">' + modeIcon + '</span> <span>' + m.name + '</span>';
            btn.onclick = function (e) {
                e.stopPropagation();
                self.app.fire('level:switch', m.id);
                searchInput.value = '';
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
                // Close burger menu
                var container = document.getElementById('burger-menu-container');
                if (container) container.classList.remove('open');
            };
            searchResults.appendChild(btn);
        });
        searchResults.style.display = 'block';
    });

    // Exit pointer lock when focusing search
    searchInput.addEventListener('focus', function () {
        if (document.pointerLockElement) document.exitPointerLock();
    });

    console.log('[UI] Search initialized');
};
UI.prototype._initRealtimeEditor = function () {
    var self = this;
    this._editorExpandedNodes = this._editorExpandedNodes || new Set();
    var panel = document.getElementById('editor-workstation-panel');
    if (!panel) return;

    this._editorStep = 0.1;
    this._editorActiveObj = null;

    // --- 1. Draggable Window Logic (Mouse & Touch) ---
    var header = document.getElementById('editor-header');
    if (header) {
        var isDragging = false;
        var startX = 0, startY = 0;
        var initialLeft = 0, initialTop = 0;

        var onDragStart = function (e) {
            if (e.target.closest('.ed-header-controls') || e.target.closest('button')) return;
            isDragging = true;
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            var rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            if (document.pointerLockElement) document.exitPointerLock();
            e.preventDefault();
        };

        var onDragMove = function (e) {
            if (!isDragging) return;
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;
            var dx = clientX - startX;
            var dy = clientY - startY;
            var newLeft = Math.max(10, Math.min(window.innerWidth - panel.offsetWidth - 10, initialLeft + dx));
            var newTop = Math.max(10, Math.min(window.innerHeight - panel.offsetHeight - 10, initialTop + dy));
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        var onDragEnd = function () {
            isDragging = false;
        };

        header.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        header.addEventListener('touchstart', onDragStart, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);
    }

    // --- 2. Window Controls (Minimize & Close) ---
    var closeBtn = document.getElementById('ed-close-btn');
    if (closeBtn) {
        closeBtn.onclick = function (e) {
            e.stopPropagation();
            panel.style.display = 'none';
            self._editorPanelOpen = false;
            self._privacyDrawEntity = null;
            self.app._privacyDrawing = false;
            self._setPrivacyVisualsVisible(false);
            self._selectEntity(null);
            sessionStorage.removeItem('thowl_admin');
        };
    }

    var lockBtn = document.getElementById('ed-lock-btn');
    if (lockBtn) {
        lockBtn.onclick = function (e) {
            e.stopPropagation();
            panel.style.display = 'none';
            self._editorPanelOpen = false;
            self._privacyDrawEntity = null;
            self.app._privacyDrawing = false;
            self._setPrivacyVisualsVisible(false);
            self._selectEntity(null);
            sessionStorage.removeItem('thowl_admin');
        };
    }

    var minBtn = document.getElementById('ed-min-btn');
    if (minBtn) {
        var isMinimized = false;
        minBtn.onclick = function (e) {
            e.stopPropagation();
            isMinimized = !isMinimized;
            var tabs = panel.querySelector('.ed-tabs');
            var content = panel.querySelector('.ed-tab-content-container');
            if (tabs) tabs.style.display = isMinimized ? 'none' : 'flex';
            if (content) content.style.display = isMinimized ? 'none' : 'flex';
            minBtn.innerText = isMinimized ? '▢' : '—';
        };
    }

    // --- 3. Tab Switching & Horizontal Navigation ---
    var tabsContainer = panel.querySelector('.ed-tabs');
    var scrollLeftBtn = document.getElementById('ed-tabs-scroll-left');
    var scrollRightBtn = document.getElementById('ed-tabs-scroll-right');

    if (tabsContainer) {
        tabsContainer.addEventListener('wheel', function (e) {
            if (e.deltaY !== 0) {
                tabsContainer.scrollLeft += e.deltaY;
                e.preventDefault();
            }
        }, { passive: false });
    }

    if (scrollLeftBtn && tabsContainer) {
        scrollLeftBtn.onclick = function (e) {
            e.stopPropagation();
            tabsContainer.scrollBy({ left: -140, behavior: 'smooth' });
        };
    }
    if (scrollRightBtn && tabsContainer) {
        scrollRightBtn.onclick = function (e) {
            e.stopPropagation();
            tabsContainer.scrollBy({ left: 140, behavior: 'smooth' });
        };
    }

    var tabBtns = panel.querySelectorAll('.ed-tab-btn');
    var tabPanes = panel.querySelectorAll('.ed-tab-pane');
    tabBtns.forEach(function (btn) {
        btn.onclick = function (e) {
            e.stopPropagation();
            var targetTab = btn.dataset.tab;
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            tabPanes.forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            var targetPane = document.getElementById(targetTab) || document.getElementById('pane-' + targetTab);
            if (targetPane) targetPane.classList.add('active');
            if (targetTab === 'tab-outliner') self._refreshOutlinerTree();
        };
    });

    // --- 4. Populate Level Dropdowns with ALL 30+ Levels ---
    var levels = [
        { id: 'lemgo', name: 'Lemgo Innovation Campus' },
        { id: 'detmold', name: 'Detmold Kreativ Campus' },
        { id: 'innospin', name: 'InnoSpin Lemgo' },
        { id: 'kio-innen-map-fusion', name: 'KIO Innen (Map Fusion)' },
        { id: 'ciit', name: 'CIIT Außen' },
        { id: 'ciit-citrus', name: 'CIIT Citrus Innen' },
        { id: 'fff-innen', name: 'Future Food Factory Innen' },
        { id: 'fff-labor-neu', name: 'Future Food Factory Labor' },
        { id: 'audimax', name: 'Audimax TH OWL' },
        { id: 'berufsfoerderzentrum', name: 'Berufsförderzentrum' },
        { id: 'pca', name: 'PCA Halle' },
        { id: 'smartfactory-innen', name: 'SmartFactory OWL' },
        { id: 'smartfactory-innen-mit-licht', name: 'SmartFactory (Mit Licht)' },
        { id: 'icl-bistro', name: 'ICL Bistro' },
        { id: 'icl-grosskueche-mensa', name: 'ICL Großküche Mensa' },
        { id: 'icl-holz-hauswirtschaft', name: 'ICL Holz & Hauswirtschaft' },
        { id: 'icl-metallwerkstatt', name: 'ICL Metallwerkstatt' },
        { id: 'icl-ewerkstatt', name: 'ICL E-Werkstatt' },
        { id: 'icl-fotostudio', name: 'ICL Fotostudio' },
        { id: 'icl-mac-raum', name: 'ICL Mac-Labor' },
        { id: 'icl-sternwarte', name: 'ICL Sternwarte' },
        { id: 'innospin-medienzentrum', name: 'InnoSpin Medienzentrum' },
        { id: 'iku-owl-innen', name: 'IKU OWL Innen' },
        { id: 'lernfabrik-innen', name: 'Lernfabrik OWL' },
        { id: 'lt-2et', name: 'Labor Trakt 2. OG' },
        { id: 'lt-eg', name: 'Labor Trakt EG' },
        { id: 'et-3et', name: 'Elektrotechnik 3. OG' },
        { id: 'et-4et', name: 'Elektrotechnik 4. OG' },
        { id: 'gebauede1', name: 'Gebäude 1 Haupttrakt' },
        { id: 'mensa', name: 'Mensa & Cafeteria Lemgo' }
    ];

    var editorLevelManager = self._getLevelManager ? self._getLevelManager() : null;
    if (editorLevelManager && Array.isArray(editorLevelManager.levelConfig)) {
        levels = editorLevelManager.levelConfig.map(function (config) {
            var uiData = self._levelData && self._levelData[config.id];
            return {
                id: config.id,
                name: (uiData && (self.currentLang === 'de' ? uiData.name_de : uiData.name_en)) || config.name || config.id
            };
        });
    }

    var levelSelect = document.getElementById('ed-level-select');
    var pathTargetSelect = document.getElementById('ed-path-target-level');

    var populateSelect = function (sel, includeEmpty) {
        if (!sel) return;
        sel.innerHTML = '';
        if (includeEmpty) {
            var optNone = document.createElement('option');
            optNone.value = '';
            optNone.innerText = '-- Kein Level-Wechsel --';
            sel.appendChild(optNone);
        }
        levels.forEach(function (lvl) {
            var opt = document.createElement('option');
            opt.value = lvl.id;
            opt.innerText = lvl.name + ' (' + lvl.id + ')';
            sel.appendChild(opt);
        });
    };

    populateSelect(levelSelect, false);
    populateSelect(pathTargetSelect, true);

    if (levelSelect) {
        levelSelect.addEventListener('change', function (e) {
            var lvlId = e.target.value;
            self.app.fire('level:switch', lvlId);
            self._populateEditorLevel(lvlId);
        });
    }

    // --- 5. Step Size Chips ---
    var stepChips = panel.querySelectorAll('.ed-step-chip');
    stepChips.forEach(function (chip) {
        chip.onclick = function (e) {
            e.stopPropagation();
            stepChips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            self._editorStep = parseFloat(chip.dataset.step) || 0.1;
        };
    });

    // --- 6. Step +/- Buttons ---
    panel.querySelectorAll('.ed-step-btn').forEach(function (btn) {
        btn.onclick = function (e) {
            e.stopPropagation();
            var target = btn.dataset.target; // 'splat' or 'ins'
            var type = btn.dataset.type; // 'pos', 'rot', 'scale'
            var axis = btn.dataset.axis; // 'x', 'y', 'z'
            var dir = parseFloat(btn.dataset.dir) || 1;

            var inputId = target === 'splat' ? 'ed-splat-' + type + '-' + axis : 'ed-ins-' + (type === 'scale' ? 'scale-' : type + '-') + axis;
            var input = document.getElementById(inputId);
            if (!input) return;
            var isRot = type === 'rot';
            var step = isRot ? Math.max(1, self._editorStep * 10) : self._editorStep;
            var currentVal = parseFloat(input.value) || 0;
            var newVal = currentVal + dir * step;
            input.value = isRot ? newVal.toFixed(1) : newVal.toFixed(3);
            input.dispatchEvent(new Event('input', { bubbles: true }));
        };
    });

    // --- 7. Transform Inputs Event Handlers ---
    var setupInputGroup = function (prefix, eventName) {
        ['pos', 'rot', 'scale'].forEach(function (type) {
            ['x', 'y', 'z'].forEach(function (axis) {
                var input = document.getElementById('ed-' + prefix + '-' + type + '-' + axis);
                if (input) {
                    input.addEventListener('input', function () {
                        self._applyEditorTransform(prefix, eventName);
                    });
                    input.addEventListener('focus', function () {
                        if (document.pointerLockElement) document.exitPointerLock();
                    });
                }
            });
        });
    };

    setupInputGroup('splat', 'splat:setTransform');
    setupInputGroup('cam', 'camera:setTransform');
    setupInputGroup('col', 'collider:setTransform');
    setupInputGroup('poi', 'poi:setTransform');

    // --- 8. Inspector Two-Way Entity Binding ---
    var insName = document.getElementById('ed-inspect-name');
    if (insName) {
        insName.addEventListener('input', function (e) {
            if (self._editorActiveObj) {
                self._editorActiveObj.name = e.target.value;
                if (self._editorActiveObj.tags && self._editorActiveObj.tags.has('custom-editor-privacy')) {
                    self._editorActiveObj._privacyZone.name = e.target.value;
                    self._syncPrivacyZones();
                }
                self._refreshOutlinerTree();
            }
        });
    }

    var setupInspectorTransforms = function () {
        var getNum = function (id) { var el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; };
        var applyTransform = function () {
            if (!self._editorActiveObj) return;
            var px = getNum('ed-ins-pos-x');
            var py = getNum('ed-ins-pos-y');
            var pz = getNum('ed-ins-pos-z');
            var rx = getNum('ed-ins-rot-x');
            var ry = getNum('ed-ins-rot-y');
            var rz = getNum('ed-ins-rot-z');
            var sx = getNum('ed-ins-scale-x');
            var sy = getNum('ed-ins-scale-y');
            var sz = getNum('ed-ins-scale-z');

            self._editorActiveObj.setLocalPosition(px, py, pz);
            self._editorActiveObj.setLocalEulerAngles(rx, ry, rz);
            self._editorActiveObj.setLocalScale(sx, sy, sz);

            if (self._editorActiveObj.rigidbody) {
                self._editorActiveObj.rigidbody.syncEntityToBody();
            }
        };

        ['ed-ins-pos-x', 'ed-ins-pos-y', 'ed-ins-pos-z',
            'ed-ins-rot-x', 'ed-ins-rot-y', 'ed-ins-rot-z',
            'ed-ins-scale-x', 'ed-ins-scale-y', 'ed-ins-scale-z'].forEach(function (id) {
                var el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', applyTransform);
                    el.addEventListener('focus', function () {
                        if (document.pointerLockElement) document.exitPointerLock();
                    });
                }
            });

        var matColor = document.getElementById('ed-ins-mat-color');
        var matOpacity = document.getElementById('ed-ins-mat-opacity');
        if (matColor) {
            matColor.addEventListener('input', function (e) {
                if (!self._editorActiveObj || !self._editorActiveObj.render) return;
                var hex = e.target.value;
                var r = parseInt(hex.substr(1, 2), 16) / 255;
                var g = parseInt(hex.substr(3, 2), 16) / 255;
                var b = parseInt(hex.substr(5, 2), 16) / 255;
                var mats = self._editorActiveObj.render.meshInstances || [];
                mats.forEach(function (mi) {
                    if (mi.material) {
                        mi.material.diffuse = new pc.Color(r, g, b);
                        mi.material.update();
                    }
                });
            });
        }
        if (matOpacity) {
            matOpacity.addEventListener('input', function (e) {
                if (!self._editorActiveObj || !self._editorActiveObj.render) return;
                var op = parseFloat(e.target.value) || 1.0;
                var mats = self._editorActiveObj.render.meshInstances || [];
                mats.forEach(function (mi) {
                    if (mi.material) {
                        mi.material.opacity = op;
                        mi.material.blendType = op < 1.0 ? pc.BLEND_NORMAL : pc.BLEND_NONE;
                        mi.material.update();
                    }
                });
            });
        }

        var focusBtn = document.getElementById('ed-inspect-focus-btn');
        if (focusBtn) {
            focusBtn.onclick = function (e) {
                e.stopPropagation();
                if (!self._editorActiveObj) return;
                var pos = self._editorActiveObj.getPosition();
                var cam = self.app.root.findByName('Camera');
                if (cam) {
                    var offset = new pc.Vec3(0, 1.5, 3);
                    cam.setPosition(pos.x + offset.x, pos.y + offset.y, pos.z + offset.z);
                    cam.lookAt(pos);
                }
            };
        }

        var delBtn = document.getElementById('ed-inspect-del-btn');
        if (delBtn) {
            delBtn.onclick = function (e) {
                e.stopPropagation();
                if (!self._editorActiveObj) return;
                if (confirm('Entity "' + self._editorActiveObj.name + '" wirklich löschen?')) {
                    var wasPrivacyZone = self._editorActiveObj.tags && self._editorActiveObj.tags.has('custom-editor-privacy');
                    if (self._privacyDrawEntity === self._editorActiveObj) {
                        self._privacyDrawEntity = null;
                        self.app._privacyDrawing = false;
                    }
                    self._editorActiveObj.destroy();
                    self._editorActiveObj = null;
                    if (wasPrivacyZone) self._syncPrivacyZones();
                    self._selectEntity(null);
                    self._refreshOutlinerTree();
                }
            };
        }

        // --- Gizmo Mode Buttons ---
        ['translate', 'rotate', 'scale'].forEach(function (m) {
            var btn = document.getElementById('ed-gizmo-mode-' + m);
            if (btn) {
                btn.onclick = function (e) {
                    e.stopPropagation();
                    self._setGizmoMode(m);
                };
            }
        });
        var gizmoToggleBtn = document.getElementById('ed-gizmo-mode-toggle');
        if (gizmoToggleBtn) {
            gizmoToggleBtn.onclick = function (e) {
                e.stopPropagation();
                self._gizmoEnabled = !self._gizmoEnabled;
                gizmoToggleBtn.classList.toggle('active', self._gizmoEnabled);
                self._setGizmoMode(self._gizmoEnabled ? self._gizmoMode : 'none');
            };
        }
    };
    setupInspectorTransforms();

    // --- 9. Outliner Tree & Entity Creation ---
    var outlinerSearch = document.getElementById('ed-outliner-search');
    if (outlinerSearch) {
        outlinerSearch.addEventListener('input', function () {
            self._refreshOutlinerTree();
        });
    }

    var addEntityBtn = document.getElementById('ed-outliner-add-btn');
    var addEntityType = document.getElementById('ed-add-entity-type');
    if (addEntityBtn && addEntityType) {
        addEntityBtn.onclick = function (e) {
            e.stopPropagation();
            var type = addEntityType.value;
            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var forward = cam ? cam.forward : new pc.Vec3(0, 0, -1);
            var spawnPos = new pc.Vec3(pos.x + forward.x * 2.5, pos.y + forward.y * 2.5, pos.z + forward.z * 2.5);

            var entity = new pc.Entity(type.toUpperCase() + '_' + Date.now().toString().slice(-4));
            entity.setPosition(spawnPos);
            entity.tags.add('custom-editor-object');

            var targetLevelId = self._getEditorTargetLevelId();
            var levelContainer = self._getLevelFolder(targetLevelId, true) || self.app.root.findByName('LevelContainer') || self.app.root;

            if (type === 'box' || type === 'sphere' || type === 'plane') {
                entity.addComponent('render', { type: type });
            } else if (type === 'light') {
                entity.addComponent('light', { type: 'omni', color: new pc.Color(1, 0.95, 0.8), range: 10, intensity: 1 });
            } else if (type === 'poi') {
                entity.tags.add('custom-editor-poi');
                entity.addComponent('script');
                entity.script.create('infoHotspot', {
                    attributes: {
                        title: 'Neuer Hotspot',
                        title_en: 'New Hotspot',
                        description: 'Beschreibung hier eingeben...',
                        description_en: 'Enter description here...',
                        linkUrl: ''
                    }
                });
            } else if (type === 'path') {
                entity.tags.add('custom-editor-path');
                entity.addComponent('script');
                entity.script.create('pathVisualizer', {
                    attributes: {
                        title: 'Neuer Laufweg',
                        pathColor: new pc.Color(0, 1, 0.53),
                        pathWidth: 0.8,
                        pathPoints: [spawnPos.x, spawnPos.y - 1.5, spawnPos.z]
                    }
                });
            } else if (type === 'screen') {
                entity.tags.add('custom-editor-media');
                entity.addComponent('render', { type: 'plane' });
                entity.setLocalScale(2.0, 1.125, 1.0);
            } else if (type === 'privacy-blur') {
                if (targetLevelId !== 'lemgo') {
                    alert('Privacy masks can only be drawn on the Lemgo outdoor scan.');
                    return;
                }
                if (self._currentLevelId !== 'lemgo') self.app.fire('level:switch', 'lemgo');
                entity.name = 'BLUR_' + Date.now().toString().slice(-4);
                entity.tags.add('custom-editor-privacy');
                entity._privacyZone = {
                    id: 'privacy-' + Date.now(),
                    name: entity.name,
                    enabled: true,
                    mode: 'blur',
                    points: [],
                    drawY: 0,
                    minY: -10000,
                    maxY: 10000,
                    strength: 8
                };
            }

            levelContainer.addChild(entity);
            entity.setPosition(spawnPos);
            entity._editorLevelId = targetLevelId;
            entity.tags.add('level:' + targetLevelId);
            if (type === 'privacy-blur') {
                self._privacyDrawEntity = entity;
                self.app._privacyDrawing = true;
                self._syncPrivacyZones();
            }
            self._refreshOutlinerTree();
            self._selectEntity(entity);
        };
    }

    // --- 10. World, Splat & Lighting Controls ---
    var ambientCol = document.getElementById('ed-world-ambient-color');
    var ambientInt = document.getElementById('ed-world-ambient-int');
    var splatLodRange = document.getElementById('ed-splat-lod-range');
    var splatLodVal = document.getElementById('ed-splat-lod-val');

    if (ambientCol) {
        ambientCol.addEventListener('input', function (e) {
            var hex = e.target.value;
            var r = parseInt(hex.substr(1, 2), 16) / 255;
            var g = parseInt(hex.substr(3, 2), 16) / 255;
            var b = parseInt(hex.substr(5, 2), 16) / 255;
            var intensity = ambientInt ? parseFloat(ambientInt.value) || 1.0 : 1.0;
            self.app.scene.ambientLight = new pc.Color(r * intensity, g * intensity, b * intensity);
        });
    }
    if (ambientInt) {
        ambientInt.addEventListener('input', function (e) {
            if (ambientCol) ambientCol.dispatchEvent(new Event('input'));
        });
    }
    if (splatLodRange && splatLodVal) {
        splatLodRange.addEventListener('input', function (e) {
            splatLodVal.innerText = e.target.value + 'm';
            var dist = parseFloat(e.target.value) || 15;
            var splats = self.app.root.findByTag('gsplat') || [];
            splats.forEach(function (s) {
                if (s.script && s.script.gsplat) s.script.gsplat.lodBaseDistance = dist;
            });
        });
    }

    // --- 11. Multi-Spawnpoint Management ---
    var addSpawnBtn = document.getElementById('ed-add-spawnpoint-btn') || document.getElementById('ed-add-spawn-btn');
    if (addSpawnBtn) {
        addSpawnBtn.onclick = function (e) {
            e.stopPropagation();
            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var playerRig = self.app.root.findByName('Character_Controller');
            var charCtrl = playerRig && playerRig.script ? playerRig.script['character-controller'] : null;
            var yaw = charCtrl ? charCtrl.yaw : (cam ? cam.getEulerAngles().y : 0);

            var spawnTitle = prompt('Name für diesen Spawnpoint:', 'Spawn ' + (document.querySelectorAll('.ed-spawnpoint-item').length + 1));
            if (!spawnTitle) return;

            var newSpawn = {
                id: 'spawn_' + Date.now(),
                title: spawnTitle,
                position: [parseFloat(pos.x.toFixed(2)), parseFloat(pos.y.toFixed(2)), parseFloat(pos.z.toFixed(2))],
                rotation: [0, parseFloat(yaw.toFixed(1)), 0]
            };

            self._addSpawnpointUI(newSpawn);
        };
    }

    var camCaptureBtn = document.getElementById('ed-cam-capture-btn');
    if (camCaptureBtn) {
        camCaptureBtn.onclick = function (e) {
            e.stopPropagation();
            var playerRig = self.app.root.findByName('Character_Controller');
            var cam = self.app.root.findByName('Camera');
            var pos = playerRig ? playerRig.getPosition() : (cam ? cam.getPosition() : new pc.Vec3());
            var charCtrl = playerRig ? playerRig.script['character-controller'] : null;
            var rx = charCtrl ? charCtrl.pitch : 0;
            var ry = charCtrl ? charCtrl.yaw : 0;

            var setVal = function (id, val) {
                var el = document.getElementById(id);
                if (el) el.value = val;
            };

            setVal('ed-cam-pos-x', pos.x.toFixed(2));
            setVal('ed-cam-pos-y', pos.y.toFixed(2));
            setVal('ed-cam-pos-z', pos.z.toFixed(2));
            setVal('ed-cam-rot-x', rx.toFixed(1));
            setVal('ed-cam-rot-y', ry.toFixed(1));
            setVal('ed-cam-rot-z', '0.0');

            camCaptureBtn.innerText = '✅ Position erfasst!';
            setTimeout(function () { camCaptureBtn.innerText = '📸 Aktuelle Kameraposition übernehmen'; }, 1200);
        };
    }

    // --- 12. Laufwege (Walkway / Path Visualizer) Management ---
    var addPathBtn = document.getElementById('ed-add-path-btn');
    if (addPathBtn) {
        addPathBtn.onclick = function (e) {
            e.stopPropagation();
            var pathName = prompt('Name für den neuen Laufweg:', 'Laufweg Campus');
            if (!pathName) return;

            var pathEntity = new pc.Entity(pathName);
            pathEntity.tags.add('custom-editor-path');
            pathEntity.addComponent('script');
            pathEntity.script.create('pathVisualizer', {
                attributes: {
                    title: pathName,
                    pathColor: new pc.Color(1, 0.23, 0.28),
                    pathWidth: 0.6,
                    pathPoints: []
                }
            });
            var targetLevelId = self._getEditorTargetLevelId();
            var levelContainer = self._getLevelFolder(targetLevelId, true) || self.app.root;
            levelContainer.addChild(pathEntity);
            pathEntity.tags.add('custom-editor-object');
            pathEntity.tags.add('level:' + targetLevelId);
            pathEntity._editorLevelId = targetLevelId;
            self._refreshPathsList(pathEntity.getGuid());
        };
    }

    var addPathPointBtn = document.getElementById('ed-path-add-point-btn') || document.getElementById('ed-add-path-point-btn');
    if (addPathPointBtn) {
        addPathPointBtn.onclick = function (e) {
            e.stopPropagation();
            var pathSelect = document.getElementById('ed-path-select');
            if (!pathSelect || !pathSelect.value) {
                alert('Bitte wählen Sie zuerst einen Laufweg aus!');
                return;
            }
            var pathEntity = self.app.root.findByGuid(pathSelect.value);
            if (!pathEntity || !pathEntity.script || !pathEntity.script.pathVisualizer) return;

            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var pt = [parseFloat(pos.x.toFixed(2)), parseFloat((pos.y - 1.5).toFixed(2)), parseFloat(pos.z.toFixed(2))];

            var pv = pathEntity.script.pathVisualizer;
            if (!pv.pathPoints) pv.pathPoints = [];
            pv.pathPoints = pv.pathPoints.concat(pt);

            self._refreshPathPointsUI(pv.pathPoints);
            addPathPointBtn.innerText = 'Point added (' + (pv.pathPoints.length / 3) + ')';
            setTimeout(function () { addPathPointBtn.innerText = '+ Punkt an Kamera'; }, 1000);
        };
    }

    var pathSelectEl = document.getElementById('ed-path-select');
    if (pathSelectEl) {
        pathSelectEl.addEventListener('change', function (e) {
            var guid = e.target.value;
            var details = document.getElementById('ed-path-details');
            if (!guid) {
                if (details) details.style.display = 'none';
                return;
            }
            if (details) details.style.display = 'block';
            var ent = self.app.root.findByGuid(guid);
            if (ent && ent.script && ent.script.pathVisualizer) {
                var pv = ent.script.pathVisualizer;
                var titleInp = document.getElementById('ed-path-title');
                if (titleInp) titleInp.value = pv.title || ent.name;
                var colorInp = document.getElementById('ed-path-color');
                if (colorInp && pv.pathColor) colorInp.value = '#' + [pv.pathColor.r, pv.pathColor.g, pv.pathColor.b].map(function(value) {
                    return Math.round(value * 255).toString(16).padStart(2, '0');
                }).join('');
                var widthInp = document.getElementById('ed-path-width');
                if (widthInp && pv.pathWidth) widthInp.value = pv.pathWidth;
                self._refreshPathPointsUI(pv.pathPoints || []);
            }
        });
    }

    // --- 13. Hotspots & POIs Management ---
    var addPoiBtn = document.getElementById('ed-add-poi-btn');
    if (addPoiBtn) {
        addPoiBtn.onclick = function (e) {
            e.stopPropagation();
            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var forward = cam ? cam.forward : new pc.Vec3(0, 0, -1);

            var entity = new pc.Entity('POI_' + Date.now().toString().slice(-4));
            entity.setPosition(pos.x + forward.x * 2.5, pos.y + forward.y * 2.5, pos.z + forward.z * 2.5);
            entity.tags.add('custom-editor-poi');
            entity.addComponent('script');
            entity.script.create('infoHotspot', {
                attributes: {
                    title: 'Neuer Hotspot',
                    title_en: 'New Hotspot',
                    description: 'Beschreibung hier eingeben...',
                    description_en: 'Enter description here...',
                    linkUrl: ''
                }
            });
            var targetLevelId = self._getEditorTargetLevelId();
            var levelContainer = self._getLevelFolder(targetLevelId, true) || self.app.root;
            levelContainer.addChild(entity);
            entity.tags.add('custom-editor-object');
            entity.tags.add('level:' + targetLevelId);
            entity._editorLevelId = targetLevelId;
            self._refreshPoiList(entity.getGuid());
        };
    }

    var addConstBtn = document.getElementById('ed-add-const-btn');
    if (addConstBtn) {
        addConstBtn.onclick = function (e) {
            e.stopPropagation();
            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var forward = cam ? cam.forward : new pc.Vec3(0, 0, -1);

            var entity = new pc.Entity('Baustelle_' + Date.now().toString().slice(-4));
            entity.setPosition(pos.x + forward.x * 3, pos.y + forward.y * 3, pos.z + forward.z * 3);
            entity.tags.add('custom-editor-poi');
            entity.addComponent('script');
            entity.script.create('constructionZone', {
                attributes: {
                    title: 'Baustelle Campus',
                    description: 'Modernisierungsarbeiten im Gange.',
                    polygonPoints: [-5, -5, 5, -5, 5, 5, -5, 5],
                    height: 15
                }
            });
            var targetLevelId = self._getEditorTargetLevelId();
            var levelContainer = self._getLevelFolder(targetLevelId, true) || self.app.root;
            levelContainer.addChild(entity);
            entity.tags.add('custom-editor-object');
            entity.tags.add('level:' + targetLevelId);
            entity._editorLevelId = targetLevelId;
            self._refreshPoiList(entity.getGuid());
        };
    }

    var poiSelectEl = document.getElementById('ed-poi-select');
    if (poiSelectEl) {
        poiSelectEl.addEventListener('change', function (e) {
            var guid = e.target.value;
            var details = document.getElementById('ed-poi-details');
            if (!guid) {
                if (details) details.style.display = 'none';
                return;
            }
            if (details) details.style.display = 'block';
            var ent = self.app.root.findByGuid(guid);
            if (ent && ent.script) {
                var hs = ent.script.infoHotspot || ent.script.constructionZone;
                if (hs) {
                    var titleDe = document.getElementById('ed-poi-title-de');
                    if (titleDe) titleDe.value = hs.title || '';
                    var titleEn = document.getElementById('ed-poi-title-en');
                    if (titleEn) titleEn.value = hs.titleEn || hs.title_en || '';
                    var desc = document.getElementById('ed-poi-desc');
                    if (desc) desc.value = hs.description || '';
                    var link = document.getElementById('ed-poi-link');
                    if (link) link.value = hs.linkUrl || '';
                    var pos = ent.getPosition();
                    var px = document.getElementById('ed-poi-pos-x'); if (px) px.value = pos.x.toFixed(2);
                    var py = document.getElementById('ed-poi-pos-y'); if (py) py.value = pos.y.toFixed(2);
                    var pz = document.getElementById('ed-poi-pos-z'); if (pz) pz.value = pos.z.toFixed(2);
                }
            }
        });
    }

    var poiDelBtn = document.getElementById('ed-poi-del-btn');
    if (poiDelBtn) {
        poiDelBtn.onclick = function (e) {
            e.stopPropagation();
            var select = document.getElementById('ed-poi-select');
            if (!select || !select.value) return;
            var ent = self.app.root.findByGuid(select.value);
            if (ent) {
                ent.destroy();
                self._refreshPoiList();
                var details = document.getElementById('ed-poi-details');
                if (details) details.style.display = 'none';
            }
        };
    }

    // --- 14. Media Upload & 3D Video/Image Screen Placement ---
    var mediaDropzone = document.getElementById('ed-media-dropzone');
    var mediaFileInput = document.getElementById('ed-media-file-input');
    var mediaUrlInput = document.getElementById('ed-media-url-input') || document.getElementById('ed-media-url');
    var spawnMediaBtn = document.getElementById('ed-spawn-media-btn') || document.getElementById('ed-create-screen-btn');

    if (mediaDropzone && mediaFileInput) {
        var persistEditorMedia = function (file) {
            var status = mediaDropzone.querySelector('div:nth-child(2)');
            if (status) status.innerText = 'Uploading ' + file.name + '...';
            return new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onerror = function() { reject(new Error('Could not read file')); };
                reader.onload = function() {
                    fetch('/__upload-editor-media', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: file.name, dataUrl: reader.result })
                    }).then(function(response) {
                        if (!response.ok) throw new Error('Upload endpoint unavailable');
                        return response.json();
                    }).then(function(result) {
                        if (!result.success || !result.url) throw new Error(result.error || 'Upload failed');
                        if (mediaUrlInput) mediaUrlInput.value = result.url;
                        if (status) status.innerText = 'Saved to project: ' + file.name;
                        resolve(result.url);
                    }).catch(function(error) {
                        if (mediaUrlInput) mediaUrlInput.value = '';
                        if (status) status.innerText = 'Upload requires the local editor server';
                        alert('This file was not saved. Run npm run dev, upload it again, then commit public/editor-uploads before deploying.');
                        reject(error);
                    });
                };
                reader.readAsDataURL(file);
            });
        };
        mediaDropzone.onclick = function () { mediaFileInput.click(); };
        mediaFileInput.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;
            persistEditorMedia(file).catch(function() {});
            var dropText = mediaDropzone.querySelector('div:nth-child(2)');
            if (dropText) dropText.innerText = '✅ ' + file.name;
        };

        mediaDropzone.addEventListener('dragover', function (e) {
            e.preventDefault();
            mediaDropzone.style.borderColor = 'var(--col-accent)';
            mediaDropzone.style.background = 'rgba(255, 59, 71, 0.1)';
        });
        mediaDropzone.addEventListener('dragleave', function () {
            mediaDropzone.style.borderColor = '';
            mediaDropzone.style.background = '';
        });
        mediaDropzone.addEventListener('drop', function (e) {
            e.preventDefault();
            mediaDropzone.style.borderColor = '';
            mediaDropzone.style.background = '';
            var file = e.dataTransfer.files[0];
            if (file) {
                persistEditorMedia(file).catch(function() {});
                var dropText = mediaDropzone.querySelector('div:nth-child(2)');
                if (dropText) dropText.innerText = '✅ ' + file.name;
            }
        });
    }

    if (spawnMediaBtn) {
        spawnMediaBtn.onclick = function (e) {
            e.stopPropagation();
            var url = mediaUrlInput ? mediaUrlInput.value.trim() : '';
            if (!url) {
                alert('Bitte wählen Sie zuerst ein Foto/Video aus oder geben Sie eine URL ein.');
                return;
            }
            var isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.indexOf('video') !== -1 || url.startsWith('blob:');
            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var forward = cam ? cam.forward : new pc.Vec3(0, 0, -1);

            var w = document.getElementById('ed-media-w') ? parseFloat(document.getElementById('ed-media-w').value) || 2.0 : 2.0;
            var h = document.getElementById('ed-media-h') ? parseFloat(document.getElementById('ed-media-h').value) || 1.125 : 1.125;

            var screenEntity = new pc.Entity('MediaScreen_' + Date.now().toString().slice(-4));
            screenEntity.setPosition(pos.x + forward.x * 3, pos.y + forward.y * 3, pos.z + forward.z * 3);
            screenEntity.lookAt(pos.x, pos.y, pos.z);
            screenEntity.rotateLocal(0, 180, 0);
            screenEntity.setLocalScale(w, h, 1);
            screenEntity.tags.add('custom-editor-media');

            screenEntity.addComponent('render', { type: 'plane' });
            screenEntity.addComponent('script');

            if (isVideo) {
                screenEntity.script.create('videoTexture', {
                    attributes: {
                        videoUrl: url,
                        playAudio: document.getElementById('ed-media-audio') ? document.getElementById('ed-media-audio').checked : false,
                        videoScale: 1.0
                    }
                });
            }

            var targetLevelId = self._getEditorTargetLevelId();
            var levelContainer = self._getLevelFolder(targetLevelId, true) || self.app.root;
            levelContainer.addChild(screenEntity);
            screenEntity.tags.add('custom-editor-object');
            screenEntity.tags.add('level:' + targetLevelId);
            screenEntity._editorLevelId = targetLevelId;
            spawnMediaBtn.innerText = '✅ 3D Screen platziert!';
            setTimeout(function () { spawnMediaBtn.innerText = '✨ Media Screen an Kamera platzieren'; }, 1500);
        };
    }

    // --- 15. Colliders & Netlify Switcher ---
    var colVisToggle = document.getElementById('ed-toggle-col-vis-btn') || document.getElementById('ed-col-vis-toggle');
    if (colVisToggle) {
        colVisToggle.onclick = function (e) {
            e.stopPropagation();
            self.app.fire('collider:toggleVisibility');
        };
    }

    var colSourceSelect = document.getElementById('ed-col-source-select');
    if (colSourceSelect) {
        colSourceSelect.onchange = function (e) {
            self.app.fire('collider:setSource', e.target.value);
        };
    }

    var colScaleSlider = document.getElementById('ed-col-scale-slider');
    var colScaleVal = document.getElementById('ed-col-scale-val');
    if (colScaleSlider) {
        colScaleSlider.addEventListener('input', function (e) {
            var s = parseFloat(e.target.value) || 1.0;
            if (colScaleVal) colScaleVal.innerText = s.toFixed(2);
            self.app.fire('collider:setScale', s, s, s);
        });
    }

    var colSelect3dBtn = document.getElementById('ed-col-select-3d-btn');
    if (colSelect3dBtn) {
        colSelect3dBtn.onclick = function (e) {
            e.stopPropagation();
            var levelManager = self.app.root.findByName('LevelManager');
            var dynCol = (levelManager && levelManager.script && levelManager.script.levelManager && levelManager.script.levelManager._dynamicColliderEntity) ||
                self.app.root.findByName('DynamicCollider_' + self._currentLevelId);
            if (dynCol) {
                if (dynCol.render) dynCol.render.enabled = true;
                self._selectEntity(dynCol);
                var tabBtn = document.querySelector('.ed-tab-btn[data-tab="tab-inspector"]');
                if (tabBtn) tabBtn.click();
                colSelect3dBtn.innerText = '✅ Collider im 3D-Viewer aktiv!';
                setTimeout(function () { colSelect3dBtn.innerText = '🎯 Collider im 3D-Viewer auswählen & bewegen'; }, 1500);
            } else {
                alert('Kein aktiver Collider für dieses Level geladen.');
            }
        };
    }

    // --- 16. Tour Cam Controls ---
    var cinPlayBtn = document.getElementById('ed-cin-play-btn');
    if (cinPlayBtn) {
        cinPlayBtn.onclick = function (e) {
            e.stopPropagation();
            self.app.fire('tour:toggle');
        };
    }
    var cinSpeed = document.getElementById('ed-cin-speed');
    var cinSpeedVal = document.getElementById('ed-cin-speed-val');
    if (cinSpeed && cinSpeedVal) {
        cinSpeed.addEventListener('input', function (e) {
            cinSpeedVal.innerText = e.target.value + 'x';
        });
    }

    // --- 17. Save, Copy, Download & Reset ---
    var bindSaveBtns = function (id, text) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.onclick = function (e) {
                e.stopPropagation();
                self.app.fire('level:saveConfig');
                btn.innerText = '✅ Gespeichert!';
                setTimeout(function () { btn.innerText = text; }, 1500);
            };
        }
    };
    bindSaveBtns('ed-save-local-btn', '💾 Im Browser speichern (LocalStorage)');
    bindSaveBtns('ed-footer-save-btn', '💾 Speichern');

    var bindCopyBtns = function (id, text) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.onclick = function (e) {
                e.stopPropagation();
                self.app.fire('level:dumpConfig');
                btn.innerText = '📋 JSON Kopiert!';
                setTimeout(function () { btn.innerText = text; }, 1500);
            };
        }
    };
    bindCopyBtns('ed-copy-config-btn', '📋 Konfiguration (JSON) kopieren');
    bindCopyBtns('ed-copy-json-btn', '📋 Konfiguration (JSON) kopieren');
    bindCopyBtns('ed-footer-copy-btn', '📋 Copy JSON');

    var downloadJsonBtn = document.getElementById('ed-download-json-btn');
    if (downloadJsonBtn) {
        downloadJsonBtn.onclick = function (e) {
            e.stopPropagation();
            self.app.fire('level:downloadConfig');
            downloadJsonBtn.innerText = '📥 Heruntergeladen!';
            setTimeout(function () { downloadJsonBtn.innerText = '📥 level-config.json herunterladen'; }, 1500);
        };
    }

    var resetDefaultsBtn = document.getElementById('ed-reset-defaults-btn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.onclick = function (e) {
            e.stopPropagation();
            if (confirm('Möchten Sie alle benutzerdefinierten Änderungen auf Werkseinstellungen zurücksetzen?')) {
                localStorage.removeItem('thowl_custom_levels');
                window.location.reload();
            }
        };
    }

    // --- 18. Listen to Collider App Events ---
    this.app.on('collider:loaded', function (pos, rot, scale) {
        var setVal = function (id, val) {
            var el = document.getElementById(id);
            if (el && val !== undefined) el.value = typeof val === 'number' ? val.toFixed(3) : val;
        };
        if (pos) {
            setVal('ed-col-pos-x', pos.x);
            setVal('ed-col-pos-y', pos.y);
            setVal('ed-col-pos-z', pos.z);
        }
        if (rot) {
            setVal('ed-col-rot-x', rot.x);
            setVal('ed-col-rot-y', rot.y);
            setVal('ed-col-rot-z', rot.z);
        }
        if (scale) {
            setVal('ed-col-scale-x', scale.x);
            setVal('ed-col-scale-y', scale.y);
            setVal('ed-col-scale-z', scale.z);
        }
    });

    console.log('[UI] 3D Studio Workstation initialized');
};

UI.prototype._refreshOutlinerTree = function () {
    var tree = document.getElementById('ed-outliner-tree');
    if (!tree) return;
    this._expandedNodes = this._expandedNodes || new Set();

    try {
        tree.innerHTML = '';
        var self = this;
        var search = (this._editorSearchQuery || '').toLowerCase();
        if (!self._editorExpandedNodes) {
            self._editorExpandedNodes = new Set();
        }

        var renderRow = function (name, icon, depth, isSelected, onClick, onEyeClick, isEnabled, hasChildren, isExpanded, onArrowClick) {
            if (search && name.toLowerCase().indexOf(search) === -1) return;
            var row = document.createElement('div');
            row.className = 'ed-tree-node' + (isSelected ? ' selected' : '');
            row.style.paddingLeft = (depth * 14 + 6) + 'px';

            var arrowHtml = '<span style="width:14px; display:inline-block;"></span>';
            if (hasChildren) {
                arrowHtml = '<span class="ed-tree-arrow" style="cursor:pointer; display:inline-block; width:14px; transform:' + (isExpanded ? 'rotate(90deg)' : 'rotate(0deg)') + '">▶</span>';
            }
            var eyeClass = (isEnabled !== false) ? 'ed-tree-eye' : 'ed-tree-eye disabled';
            var eyeHtml = onEyeClick ? '<span class="' + eyeClass + '" title="Ein-/Ausblenden">👁️</span>' : '';

            row.innerHTML = arrowHtml + '<span class="ed-tree-icon">' + icon + '</span>' + '<span class="ed-tree-name">' + name + '</span>' + eyeHtml;

            if (hasChildren && onArrowClick) {
                var arrow = row.querySelector('.ed-tree-arrow');
                if (arrow) arrow.onclick = onArrowClick;
            }
            if (onEyeClick) {
                var eye = row.querySelector('.ed-tree-eye');
                if (eye) eye.onclick = onEyeClick;
            }
            if (onClick) {
                var nameSpan = row.querySelector('.ed-tree-name');
                if (nameSpan) nameSpan.onclick = onClick;
                var iconSpan = row.querySelector('.ed-tree-icon');
                if (iconSpan) iconSpan.onclick = onClick;
            }
            tree.appendChild(row);
            return row;
        };

        var isGlobalSelected = self._editorActiveObj && self._editorActiveObj._isGlobalNode;
        renderRow('App Settings & Export', '⚙️', 0, isGlobalSelected, function (e) {
            e.stopPropagation();
            self._selectEntity({ _isGlobalNode: true, name: 'Global Settings' });
        }, null, true, false, false, null);

        var lmEnt = self.app.root.findByName('LevelManager');
        var levels = lmEnt && lmEnt.script && lmEnt.script.levelManager ? lmEnt.script.levelManager.levelConfig : [];
        
        levels.forEach(function(lvlConfig) {
            var isSelected = self._editorActiveObj && self._editorActiveObj._isLevelNode && self._editorActiveObj.config.id === lvlConfig.id;
            renderRow('[Level Config] ' + (lvlConfig.name || lvlConfig.id), '⚙️', 0, isSelected, function(e) {
                e.stopPropagation();
                self._selectEntity({ _isLevelNode: true, id: lvlConfig.id, name: lvlConfig.name || lvlConfig.id, config: lvlConfig });
                self._refreshOutlinerTree();
            }, null, true, false, false, null);
            var levelDropRow = tree.lastElementChild;
            if (levelDropRow) {
                levelDropRow.title = 'Drop an entity here to assign it to this level';
                levelDropRow.ondragover = function(e) {
                    e.preventDefault();
                    levelDropRow.style.outline = '1px solid var(--col-cyan)';
                };
                levelDropRow.ondragleave = function() { levelDropRow.style.outline = '';
                };
                levelDropRow.ondrop = function(e) {
                    e.preventDefault();
                    levelDropRow.style.outline = '';
                    if (self._outlinerDraggedEntity) {
                        self._assignEntityToLevel(self._outlinerDraggedEntity, lvlConfig.id);
                        self._editorTargetLevelId = lvlConfig.id;
                        self._refreshOutlinerTree();
                    }
                };
            }
        });

        var renderEntityNode = function(node, depth) {
            if (node.tags && node.tags.has('editor-helper')) return;
            var icon = '📦';
            if (node.script) {
                if (node.script.streamedGsplat || node.script.gsplat || node.script.splatCulling) icon = '☁️';
                else if (node.script.infoHotspot || node.script.constructionZone) icon = '🎯';
                else if (node.script.pathVisualizer) icon = '🛣️';
                else if (node.script.videoTexture) icon = '🎬';
                else icon = '📜';
            } else if (node.model || node.render) {
                icon = '🟪';
            } else if (node.camera) {
                icon = '🎥';
            } else if (node.light) {
                icon = '💡';
            }
            if (node.name === 'LevelContainer' || node.name === 'Root') icon = '📁';
            
            var isSelected = self._editorActiveObj === node;
            var displayName = node.name;
            if (node.script && node.script.infoHotspot && node.script.infoHotspot.title) {
                displayName += ' (' + node.script.infoHotspot.title + ')';
            }
            
            var hasChildren = node.children && node.children.length > 0;
            var isExpanded = self._editorExpandedNodes.has(node.getGuid());
            if (search) isExpanded = true;
            
            renderRow(displayName, icon, depth, isSelected, function(e) {
                e.stopPropagation();
                self._selectEntity(node);
                self._refreshOutlinerTree();
            }, function(e) {
                e.stopPropagation();
                node.enabled = !node.enabled;
                self._refreshOutlinerTree();
            }, node.enabled, hasChildren, isExpanded, function(e) {
                e.stopPropagation();
                if (isExpanded) self._editorExpandedNodes.delete(node.getGuid());
                else self._editorExpandedNodes.add(node.getGuid());
                self._refreshOutlinerTree();
            });
            var renderedEntityRow = tree.lastElementChild;
            var canReassignNode = node.tags && node.tags.has('custom-editor-object');
            canReassignNode = canReassignNode || (node.script && (
                node.script.infoHotspot || node.script.pathVisualizer || node.script.constructionZone || node.script.videoTexture
            ));
            if (renderedEntityRow && canReassignNode) {
                renderedEntityRow.draggable = true;
                renderedEntityRow.title = 'Drag onto a level to reassign';
                renderedEntityRow.ondragstart = function(e) {
                    self._outlinerDraggedEntity = node;
                    if (e.dataTransfer) e.dataTransfer.setData('text/plain', node.getGuid());
                };
                renderedEntityRow.ondragend = function() {
                    self._outlinerDraggedEntity = null;
                };
            }
            
            if (hasChildren && isExpanded) {
                node.children.forEach(function(child) {
                    renderEntityNode(child, depth + 1);
                });
            }
        };

        var hierarchyLevelId = self._editorTargetLevelId || self._currentLevelId;
        var hierarchyFolder = self._getLevelFolder(hierarchyLevelId, false);
        if (hierarchyFolder) self._editorExpandedNodes.add(hierarchyFolder.getGuid());
        renderEntityNode(hierarchyFolder || self.app.root, 0);

    } catch (err) {
        document.getElementById('ed-outliner-tree').innerHTML = '<div style="color:#ff5555; font-size:11px; padding:10px;"><b>UI Error:</b><br>' + err.message + '</div>';
    }
};
UI.prototype._selectEntity = function (entity) {
    this._editorActiveObj = entity;
    if (entity && entity._isLevelNode && entity.config) {
        this._editorTargetLevelId = entity.config.id;
        this._getLevelFolder(entity.config.id, true);
    }
    else if (entity) this._editorTargetLevelId = this._getEntityLevelId(entity) || this._editorTargetLevelId;
    this._refreshOutlinerTree();

    var tag = document.getElementById('ed-inspector-selected-tag');
    var nameInp = document.getElementById('ed-inspect-name');
    if (tag) tag.innerText = entity ? entity.name : 'Keine Auswahl';
    if (nameInp && entity) nameInp.value = entity.name;

    if (entity && (entity._isGlobalNode || entity._isLevelNode || entity._isSpawnNode)) {
        if (this._translateGizmo) this._translateGizmo.detach();
        if (this._rotateGizmo) this._rotateGizmo.detach();
        if (this._scaleGizmo) this._scaleGizmo.detach();
        this._renderAttributeEditor(entity);
        return;
    }

    if (entity) {
        var pos = entity.getLocalPosition();
        var rot = entity.getLocalEulerAngles();
        var scale = entity.getLocalScale();

        var setVal = function (id, val) {
            var el = document.getElementById(id);
            if (el) el.value = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(3)) : val;
        };

        setVal('ed-ins-pos-x', pos.x);
        setVal('ed-ins-pos-y', pos.y);
        setVal('ed-ins-pos-z', pos.z);
        setVal('ed-ins-rot-x', rot.x.toFixed(1));
        setVal('ed-ins-rot-y', rot.y.toFixed(1));
        setVal('ed-ins-rot-z', rot.z.toFixed(1));
        setVal('ed-ins-scale-x', scale.x);
        setVal('ed-ins-scale-y', scale.y);
        setVal('ed-ins-scale-z', scale.z);

        // Sync Gizmo attachment
        if (this._gizmoEnabled && this._gizmoMode !== 'none') {
            this._setGizmoMode(this._gizmoMode || 'translate');
        }

        this._renderAttributeEditor(entity);
    } else {
        if (this._translateGizmo) this._translateGizmo.detach();
        if (this._rotateGizmo) this._rotateGizmo.detach();
        if (this._scaleGizmo) this._scaleGizmo.detach();
        this._renderAttributeEditor(null);
    }
};

UI.prototype._initGizmoSystem = function () {
    var self = this;
    if (this._gizmoInitialized) return;
    this._gizmoInitialized = true;
    this._gizmoMode = 'translate';
    this._gizmoEnabled = true;

    var camEntity = this.app.root.findByName('Camera');
    if (!camEntity || !camEntity.camera) return;

    try {
        var gizmoLayer = this.app.scene.layers.getLayerByName('GizmoLayer');
        if (!gizmoLayer && pc.Gizmo && pc.Gizmo.createLayer) {
            gizmoLayer = pc.Gizmo.createLayer(this.app, 'GizmoLayer');
        }

        if (pc.TranslateGizmo && gizmoLayer) {
            this._translateGizmo = new pc.TranslateGizmo(camEntity.camera, gizmoLayer);
            this._rotateGizmo = new pc.RotateGizmo(camEntity.camera, gizmoLayer);
            this._scaleGizmo = new pc.ScaleGizmo(camEntity.camera, gizmoLayer);

            var onGizmoTransform = function () {
                if (self._editorActiveObj) {
                    var p = self._editorActiveObj.getLocalPosition();
                    var r = self._editorActiveObj.getLocalEulerAngles();
                    var s = self._editorActiveObj.getLocalScale();

                    var setVal = function (id, val) {
                        var el = document.getElementById(id);
                        if (el) el.value = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(3)) : val;
                    };
                    setVal('ed-ins-pos-x', p.x);
                    setVal('ed-ins-pos-y', p.y);
                    setVal('ed-ins-pos-z', p.z);
                    setVal('ed-ins-rot-x', r.x.toFixed(1));
                    setVal('ed-ins-rot-y', r.y.toFixed(1));
                    setVal('ed-ins-rot-z', r.z.toFixed(1));
                    setVal('ed-ins-scale-x', s.x.toFixed(3));
                    setVal('ed-ins-scale-y', s.y.toFixed(3));
                    setVal('ed-ins-scale-z', s.z.toFixed(3));

                    if (self._editorActiveObj.name.startsWith('DynamicCollider')) {
                        setVal('ed-col-pos-x', p.x);
                        setVal('ed-col-pos-y', p.y);
                        setVal('ed-col-pos-z', p.z);
                        setVal('ed-col-rot-x', r.x.toFixed(1));
                        setVal('ed-col-rot-y', r.y.toFixed(1));
                        setVal('ed-col-rot-z', r.z.toFixed(1));
                    }

                    if (self._editorActiveObj.rigidbody) {
                        self._editorActiveObj.rigidbody.syncEntityToBody();
                    }
                }
            };

            [this._translateGizmo, this._rotateGizmo, this._scaleGizmo].forEach(function (g) {
                if (g) {
                    g.on('transform:move', onGizmoTransform);
                    g.on('transform:end', onGizmoTransform);
                }
            });
            console.log('[UI] 3D Transform Gizmos ready');
        }
    } catch (e) {
        console.warn('[UI] Gizmo initialization error:', e);
    }
};

UI.prototype._setGizmoMode = function (mode) {
    this._gizmoMode = mode;
    ['translate', 'rotate', 'scale'].forEach(function (m) {
        var btn = document.getElementById('ed-gizmo-mode-' + m);
        if (btn) {
            if (m === mode) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });

    if (this._translateGizmo) this._translateGizmo.detach();
    if (this._rotateGizmo) this._rotateGizmo.detach();
    if (this._scaleGizmo) this._scaleGizmo.detach();

    if (this._editorActiveObj && this._gizmoEnabled && mode !== 'none') {
        var targetGizmo = mode === 'rotate' ? this._rotateGizmo : (mode === 'scale' ? this._scaleGizmo : this._translateGizmo);
        if (targetGizmo) targetGizmo.attach([this._editorActiveObj]);
    }
};

UI.prototype._getLevelManager = function () {
    var managerEntity = this.app.root.findByName('LevelManager');
    return managerEntity && managerEntity.script && managerEntity.script.levelManager;
};

UI.prototype._getLevelFolder = function (levelId, createIfMissing) {
    var manager = this._getLevelManager();
    if (!manager || !levelId) return null;
    var folder = (manager.levelFolders || []).find(function (candidate) {
        return candidate && candidate.name.toLowerCase() === String(levelId).toLowerCase();
    });
    if (!folder) folder = this.app.root.findByName(levelId);
    if (!folder && createIfMissing) {
        folder = new pc.Entity(levelId);
        folder.tags.add('editor-level-folder');
        this.app.root.addChild(folder);
        manager.levelFolders = manager.levelFolders || [];
        manager.levelFolders.push(folder);
        folder.enabled = manager.currentLevelId === levelId;
    }
    return folder;
};

UI.prototype._getEntityLevelId = function (entity) {
    if (!entity) return null;
    if (entity._editorLevelId) return entity._editorLevelId;
    var manager = this._getLevelManager();
    var folders = manager && manager.levelFolders ? manager.levelFolders : [];
    var current = entity;
    while (current) {
        var match = folders.find(function (folder) { return folder === current; });
        if (match) return match.name;
        current = current.parent;
    }
    return null;
};

UI.prototype._getEditorTargetLevelId = function () {
    if (this._editorActiveObj) {
        if (this._editorActiveObj._isLevelNode) return this._editorActiveObj.config.id;
        var owner = this._getEntityLevelId(this._editorActiveObj);
        if (owner) return owner;
    }
    return this._editorTargetLevelId || this._currentLevelId;
};

UI.prototype._assignEntityToLevel = function (entity, levelId) {
    if (!entity || !levelId) return;
    var folder = this._getLevelFolder(levelId, true);
    if (!folder || entity === folder) return;
    var worldPosition = entity.getPosition().clone();
    var worldRotation = entity.getRotation().clone();
    if (entity.parent) entity.parent.removeChild(entity);
    folder.addChild(entity);
    entity.setPosition(worldPosition);
    entity.setRotation(worldRotation);
    entity._editorLevelId = levelId;
    entity.tags.add('level:' + levelId);
    if (entity.tags.has('custom-editor-privacy')) this._syncPrivacyZones();
};

UI.prototype._getPrivacyConfig = function () {
    var managerEntity = this.app.root.findByName('LevelManager');
    var manager = managerEntity && managerEntity.script && managerEntity.script.levelManager;
    if (!manager || !Array.isArray(manager.levelConfig)) return null;
    return manager.levelConfig.find(function (config) { return config.id === 'lemgo'; }) || null;
};

UI.prototype._removeOrphanedBlurState = function () {
    var cleanupKey = 'thowl_orphaned_blur_cleanup_v1';
    try {
        if (localStorage.getItem(cleanupKey) === 'done') return;
    } catch (error) {
        // Continue with the in-memory cleanup when storage is unavailable.
    }

    var privacyEntities = this.app.root.findByTag('custom-editor-privacy').slice();
    var visit = function (entity) {
        entity.children.slice().forEach(visit);
        if (entity.script && entity.script.splatBlur && privacyEntities.indexOf(entity) === -1) {
            privacyEntities.push(entity);
        }
    };
    visit(this.app.root);
    privacyEntities.forEach(function (entity) {
        if (entity && !entity._destroyed) entity.destroy();
    });

    this._privacyDrawEntity = null;
    this.app._privacyDrawing = false;

    var manager = this._getLevelManager();
    if (manager && Array.isArray(manager.levelConfig)) {
        manager.levelConfig.forEach(function (config) {
            if (config.id === 'lemgo') config.privacyZones = [];
            if (Array.isArray(config.entityOverrides)) {
                config.entityOverrides = config.entityOverrides.filter(function (saved) {
                    return !(saved && saved.scripts && saved.scripts.splatBlur);
                });
            }
        });
        try {
            localStorage.setItem('thowl_custom_levels', JSON.stringify(manager.levelConfig));
        } catch (error) {
            console.warn('[Editor] Could not persist orphaned blur cleanup:', error);
        }
        if (manager._updateCulling) manager._updateCulling();
    }

    try { localStorage.setItem(cleanupKey, 'done'); } catch (error) {}
};

UI.prototype._setPrivacyVisualsVisible = function (visible) {
    this.app.root.findByTag('custom-editor-privacy').forEach(function (entity) {
        (entity._privacyVisuals || []).forEach(function (visual) {
            if (visual && visual.render) visual.render.enabled = !!visible;
        });
    });
};

UI.prototype._syncPrivacyZones = function () {
    var config = this._getPrivacyConfig();
    if (!config) return;
    var self = this;
    config.privacyZones = this.app.root.findByTag('custom-editor-privacy').filter(function (entity) {
        return self._getEntityLevelId(entity) === 'lemgo';
    }).map(function (entity) {
        var zone = entity._privacyZone || {};
        zone.name = entity.name;
        zone.points = Array.isArray(zone.points) ? zone.points : [];
        return {
            id: zone.id || ('privacy-' + entity.getGuid()),
            name: zone.name,
            enabled: zone.enabled !== false,
            mode: zone.mode === 'crop' ? 'crop' : 'blur',
            points: zone.points.map(function (point) { return [Number(point[0]) || 0, Number(point[1]) || 0, Number(point[2]) || 0]; }),
            drawY: Number(zone.drawY) || 0,
            minY: Number.isFinite(Number(zone.minY)) ? Number(zone.minY) : -10000,
            maxY: Number.isFinite(Number(zone.maxY)) ? Number(zone.maxY) : 10000,
            strength: Math.max(1, Number(zone.strength) || 8)
        };
    });
    var managerEntity = this.app.root.findByName('LevelManager');
    var manager = managerEntity && managerEntity.script && managerEntity.script.levelManager;
    if (manager && manager._updateCulling) manager._updateCulling();
};

UI.prototype._refreshPrivacyZoneVisual = function (entity) {
    if (!entity || !entity._privacyZone) return;
    (entity._privacyVisuals || []).forEach(function (visual) {
        if (visual && !visual._destroyed) visual.destroy();
    });
    entity._privacyVisuals = [];
    var points = entity._privacyZone.points || [];
    var material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(0.7, 0.05, 0.9);
    material.emissive = new pc.Color(0.35, 0.02, 0.5);
    material.opacity = 0.85;
    material.blendType = pc.BLEND_NORMAL;
    material.update();
    points.forEach(function (point, index) {
        var worldPoint = new pc.Vec3(point[0], point[1], point[2]);
        var marker = new pc.Entity('PrivacyPoint_' + (index + 1));
        marker.addComponent('render', { type: 'sphere' });
        marker.tags.add('editor-helper');
        marker.render.material = material;
        marker.setLocalScale(0.35, 0.35, 0.35);
        entity.addChild(marker);
        marker.setPosition(worldPoint);
        entity._privacyVisuals.push(marker);
        if (index > 0) {
            var previous = points[index - 1];
            var edge = new pc.Entity('PrivacyEdge');
            edge.addComponent('render', { type: 'box' });
            edge.tags.add('editor-helper');
            edge.render.material = material;
            entity.addChild(edge);
            var start = new pc.Vec3(previous[0], previous[1], previous[2]);
            var end = worldPoint;
            edge.setPosition(new pc.Vec3().add2(start, end).mulScalar(0.5));
            edge.lookAt(end);
            edge.setLocalScale(0.08, 0.08, start.distance(end));
            entity._privacyVisuals.push(edge);
        }
    });
    if (points.length > 2) {
        var first = points[0];
        var last = points[points.length - 1];
        var closingEdge = new pc.Entity('PrivacyEdgeClosed');
        closingEdge.addComponent('render', { type: 'box' });
        closingEdge.tags.add('editor-helper');
        closingEdge.render.material = material;
        entity.addChild(closingEdge);
        var firstPosition = new pc.Vec3(first[0], first[1], first[2]);
        var lastPosition = new pc.Vec3(last[0], last[1], last[2]);
        closingEdge.setPosition(new pc.Vec3().add2(firstPosition, lastPosition).mulScalar(0.5));
        closingEdge.lookAt(firstPosition);
        closingEdge.setLocalScale(0.08, 0.08, lastPosition.distance(firstPosition));
        entity._privacyVisuals.push(closingEdge);
    }
};

UI.prototype._ensurePrivacyZoneEntities = function () {
    if (this._currentLevelId !== 'lemgo') return;
    var config = this._getPrivacyConfig();
    if (!config || !Array.isArray(config.privacyZones)) return;
    var existingIds = {};
    this.app.root.findByTag('custom-editor-privacy').forEach(function (entity) {
        if (entity._privacyZone && entity._privacyZone.id) existingIds[entity._privacyZone.id] = true;
    });
    var parent = this._getLevelFolder('lemgo', true) || this.app.root.findByName('LevelContainer') || this.app.root;
    var self = this;
    config.privacyZones.forEach(function (source, index) {
        var id = source.id || ('privacy-saved-' + index);
        if (existingIds[id]) return;
        var entity = new pc.Entity(source.name || ('BLUR_' + (index + 1)));
        entity.tags.add('custom-editor-object');
        entity.tags.add('custom-editor-privacy');
        entity.tags.add('level:lemgo');
        entity._editorLevelId = 'lemgo';
        entity._privacyZone = {
            id: id,
            name: entity.name,
            enabled: source.enabled !== false,
            mode: source.mode === 'crop' ? 'crop' : 'blur',
            points: Array.isArray(source.points) ? source.points.map(function (point) { return point.slice(0, 3); }) : [],
            drawY: Number(source.drawY) || 0,
            minY: Number.isFinite(Number(source.minY)) ? Number(source.minY) : -10000,
            maxY: Number.isFinite(Number(source.maxY)) ? Number(source.maxY) : 10000,
            strength: Math.max(1, Number(source.strength) || 8)
        };
        parent.addChild(entity);
        self._refreshPrivacyZoneVisual(entity);
    });
};

UI.prototype._initViewportPicker = function () {
    var self = this;
    if (this._pickerInitialized) return;
    this._pickerInitialized = true;

    var canvas = this.app.graphicsDevice.canvas;
    var pointerDownPos = { x: 0, y: 0 };
    var pointerDownTime = 0;

    canvas.addEventListener('pointerdown', function (e) {
        pointerDownPos.x = e.clientX;
        pointerDownPos.y = e.clientY;
        pointerDownTime = Date.now();
    });

    canvas.addEventListener('pointerup', function (e) {
        if (!self._editorPanelOpen) return;
        var dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
        if (dist > 6 || Date.now() - pointerDownTime > 300) return;

        var elem = document.elementFromPoint(e.clientX, e.clientY);
        if (elem && elem !== canvas) return;

        var camEntity = self.app.root.findByName('Camera');
        if (!camEntity || !camEntity.camera) return;

        var ray = new pc.Ray();
        camEntity.camera.screenToWorld(e.clientX, e.clientY, camEntity.camera.nearClip, ray.origin);
        var farWorld = new pc.Vec3();
        camEntity.camera.screenToWorld(e.clientX, e.clientY, camEntity.camera.farClip, farWorld);
        ray.direction.sub2(farWorld, ray.origin).normalize();

        if (self._privacyDrawEntity && self._privacyDrawEntity._privacyZone) {
            var rayEnd = new pc.Vec3().copy(ray.direction).mulScalar(camEntity.camera.farClip).add(ray.origin);
            var privacyHit = self.app.systems.rigidbody && self.app.systems.rigidbody.raycastFirst(ray.origin, rayEnd);
            var privacyPoint = privacyHit ? privacyHit.point : null;
            if (!privacyPoint) {
                var drawY = Number(self._privacyDrawEntity._privacyZone.drawY) || 0;
                if (Math.abs(ray.direction.y) < 0.00001) return;
                var planeDistance = (drawY - ray.origin.y) / ray.direction.y;
                if (planeDistance <= 0) return;
                privacyPoint = new pc.Vec3().copy(ray.direction).mulScalar(planeDistance).add(ray.origin);
            }
            var privacyPoints = self._privacyDrawEntity._privacyZone.points;
            if (privacyPoints.length >= 16) {
                alert('A privacy mask supports up to 16 points. Finish this mask or create another.');
                return;
            }
            privacyPoints.push([privacyPoint.x, privacyPoint.y, privacyPoint.z]);
            self._refreshPrivacyZoneVisual(self._privacyDrawEntity);
            self._syncPrivacyZones();
            self._renderAttributeEditor(self._privacyDrawEntity);
            return;
        }

        var candidates = [];
        var levelContainer = self.app.root.findByName('LevelContainer') || self.app.root;

        var checkEntity = function (ent) {
            if (!ent || !ent.enabled || ent._destroyed) return;
            var isSelectable = (ent.tags && (
                ent.tags.has('custom-editor-object') ||
                ent.tags.has('custom-editor-poi') ||
                ent.tags.has('custom-editor-media') ||
                ent.tags.has('custom-editor-path') ||
                ent.tags.has('custom-editor-privacy') ||
                ent.tags.has('gsplat')
            )) || (ent.script && (
                ent.script.infoHotspot || ent.script.pathVisualizer || ent.script.videoTexture || ent.script.constructionZone
            )) || ent.name.startsWith('DynamicCollider') || (ent.render && ent !== self.app.root);

            if (isSelectable) {
                var entPos = ent.getPosition();
                var scale = ent.getLocalScale ? ent.getLocalScale() : new pc.Vec3(1, 1, 1);
                var radius = Math.max(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z)) * 0.8 + 0.3;
                var toCenter = new pc.Vec3().sub2(entPos, ray.origin);
                var proj = toCenter.dot(ray.direction);
                if (proj > 0) {
                    var closestPoint = new pc.Vec3().copy(ray.direction).mulScalar(proj).add(ray.origin);
                    var d2 = closestPoint.distance(entPos);
                    if (d2 <= radius) {
                        candidates.push({ entity: ent, dist: proj });
                    }
                }
            }
            if (ent.children) ent.children.forEach(checkEntity);
        };

        checkEntity(levelContainer);
        var dynamicCol = self.app.root.findByName('DynamicCollider_' + self._currentLevelId);
        if (dynamicCol) checkEntity(dynamicCol);

        if (candidates.length > 0) {
            candidates.sort(function (a, b) { return a.dist - b.dist; });
            var picked = candidates[0].entity;
            console.log('[Editor Viewport] Picked entity in 3D:', picked.name);
            self._selectEntity(picked);

            var tabBtn = document.querySelector('.ed-tab-btn[data-tab="tab-inspector"]');
            if (tabBtn) tabBtn.click();
        }
    });

    // Keyboard Shortcuts for Gizmo (W = Translate, E = Rotate, R = Scale)
    window.addEventListener('keydown', function (e) {
        if (!self._editorPanelOpen) return;
        if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(e.target.tagName) !== -1) return;

        if (e.key === 'w' || e.key === 'W') {
            self._setGizmoMode('translate');
        } else if (e.key === 'e' || e.key === 'E') {
            self._setGizmoMode('rotate');
        } else if (e.key === 'r' || e.key === 'R') {
            self._setGizmoMode('scale');
        } else if (e.key === 'f' || e.key === 'F') {
            var focusBtn = document.getElementById('ed-inspect-focus-btn');
            if (focusBtn) focusBtn.click();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            var delBtn = document.getElementById('ed-inspect-del-btn');
            if (delBtn && self._editorActiveObj) delBtn.click();
        }
    });
};

UI.prototype._duplicateEditorEntity = function (source) {
    if (!source) return null;
    var duplicate;
    if (source.tags && source.tags.has('custom-editor-privacy') && source._privacyZone) {
        duplicate = new pc.Entity(source.name + '_copy');
        duplicate.tags.add('custom-editor-object');
        duplicate.tags.add('custom-editor-privacy');
        duplicate._privacyZone = JSON.parse(JSON.stringify(source._privacyZone));
        duplicate._privacyZone.id = 'privacy-' + Date.now();
        duplicate._privacyZone.name = duplicate.name;
    } else {
        duplicate = source.clone();
        duplicate.name = source.name + '_copy';
        duplicate.tags.add('custom-editor-object');
    }
    var levelId = this._getEntityLevelId(source) || this._getEditorTargetLevelId();
    var parent = this._getLevelFolder(levelId, true) || source.parent || this.app.root;
    parent.addChild(duplicate);
    duplicate.setPosition(source.getPosition().clone().add(new pc.Vec3(0.5, 0, 0.5)));
    duplicate.setRotation(source.getRotation());
    duplicate._editorLevelId = levelId;
    duplicate.tags.add('level:' + levelId);
    if (duplicate._privacyZone) {
        this._refreshPrivacyZoneVisual(duplicate);
        this._syncPrivacyZones();
    }
    this._refreshOutlinerTree();
    this._selectEntity(duplicate);
    return duplicate;
};

UI.prototype._renderAttributeEditor = function (entity) {
    var self = this;
    var container = document.getElementById('ed-ins-scripts');
    if (!container) return;
    container.innerHTML = '';

    if (!entity) return;

    var renderField = function(label, type, val, onChange) {
        var wrap = document.createElement('div');
        wrap.className = 'ed-ins-row';
        var lbl = document.createElement('div');
        lbl.className = 'ed-ins-lbl';
        lbl.innerText = label;
        wrap.appendChild(lbl);
        var ctrl = document.createElement('div');
        ctrl.className = 'ed-ins-ctrl';

        if (type === 'string') {
            var inp = (String(val || '').length > 80 || String(val || '').indexOf('\n') !== -1)
                ? document.createElement('textarea')
                : document.createElement('input');
            if (inp.tagName === 'INPUT') inp.type = 'text';
            else {
                inp.rows = 4;
                inp.style.width = '100%';
                inp.style.resize = 'vertical';
            }
            inp.value = val || '';
            inp.onchange = function(e) { onChange(e.target.value); };
            ctrl.appendChild(inp);
        } else if (type === 'number') {
            var inp = document.createElement('input');
            inp.type = 'number';
            inp.step = '0.01';
            inp.value = val !== undefined ? val : 0;
            inp.onchange = function(e) { onChange(parseFloat(e.target.value)); };
            ctrl.appendChild(inp);
        } else if (type === 'boolean') {
            var inp = document.createElement('input');
            inp.type = 'checkbox';
            inp.checked = !!val;
            inp.onchange = function(e) { onChange(e.target.checked); };
            ctrl.appendChild(inp);
        } else if (type === 'rgb' || type === 'rgba' || type === 'vec2' || type === 'vec3' || type === 'vec4') {
            var makeInp = function(v, i) {
                var inp = document.createElement('input');
                inp.type = 'number';
                inp.step = '0.01';
                inp.style.width = '30%';
                inp.value = v !== undefined ? v : 0;
                inp.onchange = function(e) {
                    var newVal = parseFloat(e.target.value);
                    if (!val) {
                        val = type === 'rgb' ? { r: 1, g: 1, b: 1 } : { x: 0, y: 0, z: 0 };
                    }
                    if (type === 'rgb' || type === 'rgba') {
                        if (i===0) val.r = newVal; else if (i===1) val.g = newVal; else if (i===2) val.b = newVal; else val.a = newVal;
                    } else {
                        if (i===0) val.x = newVal; else if (i===1) val.y = newVal; else if (i===2) val.z = newVal; else val.w = newVal;
                    }
                    onChange(val);
                };
                return inp;
            };
            var v = val || ((type === 'rgb' || type === 'rgba') ? {r:1,g:1,b:1,a:1} : {x:0,y:0,z:0,w:0});
            if (type === 'rgb' || type === 'rgba') {
                ctrl.appendChild(makeInp(v.r, 0)); ctrl.appendChild(makeInp(v.g, 1)); ctrl.appendChild(makeInp(v.b, 2));
                if (type === 'rgba') ctrl.appendChild(makeInp(v.a, 3));
            } else {
                ctrl.appendChild(makeInp(v.x, 0)); ctrl.appendChild(makeInp(v.y, 1));
                if (type !== 'vec2') ctrl.appendChild(makeInp(v.z, 2));
                if (type === 'vec4') ctrl.appendChild(makeInp(v.w, 3));
            }
        } else if (type.indexOf('array_') === 0 || type === 'array') {
            var inp = document.createElement('textarea');
            inp.style.width = '100%';
            inp.style.resize = 'vertical';
            inp.rows = 3;
            
            if (Array.isArray(val)) {
                if (type === 'array_vec3' || (val.length > 0 && val[0] && typeof val[0].x === 'number')) {
                    inp.value = val.map(function(v) {
                        return Array.isArray(v) ? v.slice(0, 3).join(', ') : v.x + ', ' + v.y + ', ' + v.z;
                    }).join('\n');
                } else if (type === 'array_number') {
                    inp.value = val.join(', ');
                } else {
                    inp.value = val.join('\n');
                }
            } else {
                inp.value = '';
            }
            
            inp.onchange = function(e) { 
                var lines = e.target.value.split('\n').map(s=>s.trim()).filter(s=>s.length>0);
                if (type === 'array_number') {
                    var numbers = e.target.value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite);
                    onChange(numbers);
                } else if (type === 'array_vec3' || (val && val.length > 0 && val[0] && typeof val[0].x === 'number')) {
                    var vecs = lines.map(function(line) {
                        var parts = line.split(',').map(s=>parseFloat(s.trim()));
                        return new pc.Vec3(parts[0]||0, parts[1]||0, parts[2]||0);
                    });
                    onChange(vecs);
                } else {
                    onChange(lines); 
                }
            };
            ctrl.appendChild(inp);
        } else if (type === 'entity') {
            var entitySelect = document.createElement('select');
            entitySelect.className = 'ed-select';
            var noneOption = document.createElement('option');
            noneOption.value = '';
            noneOption.innerText = '-- None --';
            entitySelect.appendChild(noneOption);
            var appendEntity = function(candidate, depth) {
                var option = document.createElement('option');
                option.value = candidate.getGuid();
                option.innerText = new Array(depth + 1).join('  ') + candidate.name;
                option.selected = !!val && ((val.getGuid && val.getGuid() === candidate.getGuid()) || val === candidate.getGuid());
                entitySelect.appendChild(option);
                candidate.children.forEach(function(child) { appendEntity(child, depth + 1); });
            };
            appendEntity(self.app.root, 0);
            entitySelect.onchange = function () {
                onChange(entitySelect.value ? self.app.root.findByGuid(entitySelect.value) : null);
            };
            ctrl.appendChild(entitySelect);
        } else if (type === 'asset') {
            var assetInput = document.createElement('input');
            assetInput.type = 'number';
            assetInput.value = val && val.id !== undefined ? val.id : (val || '');
            assetInput.placeholder = 'Asset ID';
            assetInput.onchange = function () {
                onChange(assetInput.value ? self.app.assets.get(Number(assetInput.value)) : null);
            };
            ctrl.appendChild(assetInput);
        } else {
            var jsonInput = document.createElement('textarea');
            jsonInput.rows = 3;
            jsonInput.style.width = '100%';
            try { jsonInput.value = JSON.stringify(val, null, 2); } catch (e) { jsonInput.value = String(val ?? ''); }
            jsonInput.onchange = function () {
                try { onChange(JSON.parse(jsonInput.value)); } catch (e) { jsonInput.style.borderColor = '#ff5555'; }
            };
            ctrl.appendChild(jsonInput);
        }
        wrap.appendChild(ctrl);
        return wrap;
    };

    if (entity._isGlobalNode) {
        var h3 = document.createElement('h3');
        h3.innerText = 'Global Settings & Admin';
        container.appendChild(h3);

        var wrap1 = document.createElement('div');
        wrap1.className = 'ed-ins-row';
        var b1 = document.createElement('button');
        b1.innerText = 'Export JSON';
        b1.onclick = function() { self.app.fire('level:downloadConfig'); };
        wrap1.appendChild(b1);
        container.appendChild(wrap1);

        var wrap2 = document.createElement('div');
        wrap2.className = 'ed-ins-row';
        var b2 = document.createElement('button');
        b2.innerText = 'Local Save';
        b2.onclick = function() { self.app.fire('level:saveConfig'); };
        wrap2.appendChild(b2);
        container.appendChild(wrap2);
        return;
    }

    if (entity._isLevelNode || entity._isSpawnNode) {
        var h3 = document.createElement('h3');
        h3.innerText = entity._isLevelNode ? 'Level Settings' : 'Spawnpoint Settings';
        container.appendChild(h3);

        if (entity._isLevelNode && entity.config) {
            container.appendChild(renderField('Level ID', 'string', entity.config.id, function(v) { entity.config.id = v; }));
            container.appendChild(renderField('URL', 'string', entity.config.url, function(v) { entity.config.url = v; }));
            container.appendChild(renderField('Mode', 'string', entity.config.mode, function(v) { entity.config.mode = v; }));
            if (entity.config.cullingEnabled === undefined) entity.config.cullingEnabled = entity.config.mode !== 'orbit';
            if (entity.config.cullDistance === undefined) entity.config.cullDistance = 70;
            var updateLevelCulling = function () {
                var cullManagerEntity = self.app.root.findByName('LevelManager');
                var cullManager = cullManagerEntity && cullManagerEntity.script && cullManagerEntity.script.levelManager;
                if (cullManager && cullManager.currentLevelId === entity.config.id) {
                    cullManager._cullingEnabled = entity.config.cullingEnabled === true;
                    cullManager._cullDistance = entity.config.cullDistance;
                    cullManager._updateCulling();
                    self.app.fire('culling:state', cullManager._cullingEnabled, cullManager._cullDistance);
                }
            };
            container.appendChild(renderField('Enable camera culling', 'boolean', entity.config.cullingEnabled, function(value) {
                entity.config.cullingEnabled = value;
                updateLevelCulling();
            }));
            container.appendChild(renderField('Splat cull distance', 'number', entity.config.cullDistance, function(value) {
                entity.config.cullDistance = Math.max(1, value);
                updateLevelCulling();
            }));

            var renderedConfigKeys = {
                id: true,
                url: true,
                mode: true,
                cullingEnabled: true,
                cullDistance: true,
                privacyZones: true,
                entityOverrides: true
            };
            var inferConfigType = function (value) {
                if (typeof value === 'boolean') return 'boolean';
                if (typeof value === 'number') return 'number';
                if (typeof value === 'string' || value === null || value === undefined) return 'string';
                if (Array.isArray(value) && value.every(function (item) { return typeof item === 'number'; })) return 'array_number';
                if (Array.isArray(value) && value.every(function (item) { return typeof item === 'string'; })) return 'array_string';
                return 'json';
            };
            var renderConfigSection = function (sectionTitle, keys) {
                var available = keys.filter(function (key) {
                    return Object.prototype.hasOwnProperty.call(entity.config, key);
                });
                if (!available.length) return;
                var sectionHeading = document.createElement('h3');
                sectionHeading.innerText = sectionTitle;
                container.appendChild(sectionHeading);
                available.forEach(function (key) {
                    renderedConfigKeys[key] = true;
                    container.appendChild(renderField(key, inferConfigType(entity.config[key]), entity.config[key], function (value) {
                        entity.config[key] = value;
                    }));
                });
            };
            renderConfigSection('Streaming', ['envUrl', 'lodRangeMin', 'lodRangeMax', 'lodMultiplier', 'lodBaseDistance']);
            renderConfigSection('Splat transform', ['splatPos', 'pos', 'splatRot', 'rotation', 'splatScale']);
            renderConfigSection('Camera and movement', ['cameraStart', 'cameraStartRot', 'bounds', 'spawnpoints', 'speed', 'fastSpeed', 'minHeight', 'maxHeight']);
            renderConfigSection('Collision', ['collider', 'colliderPos', 'colliderRot', 'colliderScale', 'colliderUrl']);
            var advancedKeys = Object.keys(entity.config).filter(function (key) { return !renderedConfigKeys[key]; });
            renderConfigSection('Advanced level properties', advancedKeys);
            var reloadLevelButton = document.createElement('button');
            reloadLevelButton.className = 'unified-btn small';
            reloadLevelButton.innerText = 'Apply and reload this level';
            reloadLevelButton.onclick = function () {
                self.app.fire('level:switch', entity.config.id);
            };
            container.appendChild(reloadLevelButton);
            if (entity.config.id === 'lemgo') {
                var config = entity.config;
                if (!Array.isArray(config.privacyZones)) config.privacyZones = [];
                if (config.cullDistance === undefined) config.cullDistance = 70;
                var managerEntity = self.app.root.findByName('LevelManager');
                var manager = managerEntity && managerEntity.script && managerEntity.script.levelManager;
                var applyPrivacy = function() {
                    if (manager && manager._updateCulling) manager._updateCulling();
                };
                if (false) container.appendChild(renderField('Splat cull distance', 'number', config.cullDistance, function(value) {
                    config.cullDistance = value;
                    applyPrivacy();
                }));

                var entityPrivacyHelp = document.createElement('p');
                entityPrivacyHelp.style.fontSize = '11px';
                entityPrivacyHelp.style.opacity = '0.8';
                entityPrivacyHelp.innerText = 'Create a Privacy Blur / Crop entity from the hierarchy menu, then draw its points directly on the outdoor scan.';
                container.appendChild(entityPrivacyHelp);
                return;

                var privacyTitle = document.createElement('h3');
                privacyTitle.innerText = 'Lemgo Privacy Zones';
                container.appendChild(privacyTitle);
                var privacyHelp = document.createElement('p');
                privacyHelp.innerText = 'World-space boxes. Crop removes splats; Blur makes the selected scan area unreadable. Only administrators can edit these masks.';
                privacyHelp.style.fontSize = '10px';
                privacyHelp.style.opacity = '0.75';
                container.appendChild(privacyHelp);

                var zonesHost = document.createElement('div');
                container.appendChild(zonesHost);
                var renderZones = function() {
                    zonesHost.innerHTML = '';
                    config.privacyZones.forEach(function(zone, zoneIndex) {
                        var zoneBox = document.createElement('div');
                        zoneBox.style.border = '1px solid rgba(255,255,255,0.2)';
                        zoneBox.style.padding = '8px';
                        zoneBox.style.marginBottom = '8px';
                        zoneBox.style.borderRadius = '8px';
                        zoneBox.appendChild(renderField('Name', 'string', zone.name || '', function(value) { zone.name = value; applyPrivacy(); }));
                        zoneBox.appendChild(renderField('Enabled', 'boolean', zone.enabled !== false, function(value) { zone.enabled = value; applyPrivacy(); }));
                        zoneBox.appendChild(renderField('Mode: blur/crop', 'string', zone.mode || 'blur', function(value) {
                            zone.mode = value === 'crop' ? 'crop' : 'blur';
                            applyPrivacy();
                        }));
                        var addVector = function(label, key, fallback) {
                            var row = document.createElement('div');
                            row.className = 'ed-ins-row';
                            var title = document.createElement('div');
                            title.className = 'ed-ins-lbl';
                            title.innerText = label;
                            row.appendChild(title);
                            var controls = document.createElement('div');
                            controls.className = 'ed-ins-ctrl';
                            var values = Array.isArray(zone[key]) ? zone[key] : fallback.slice();
                            zone[key] = values;
                            for (var axis = 0; axis < 3; axis++) {
                                (function(axisIndex) {
                                    var input = document.createElement('input');
                                    input.type = 'number';
                                    input.step = '0.1';
                                    input.style.width = '32%';
                                    input.value = values[axisIndex];
                                    input.onchange = function() {
                                        values[axisIndex] = Number(input.value);
                                        applyPrivacy();
                                    };
                                    controls.appendChild(input);
                                })(axis);
                            }
                            row.appendChild(controls);
                            zoneBox.appendChild(row);
                        };
                        addVector('Minimum XYZ', 'min', [0, 0, 0]);
                        addVector('Maximum XYZ', 'max', [1, 1, 1]);
                        zoneBox.appendChild(renderField('Blur Strength', 'number', zone.strength || 8, function(value) { zone.strength = Math.max(1, value); applyPrivacy(); }));
                        var remove = document.createElement('button');
                        remove.className = 'unified-btn small';
                        remove.innerText = 'Remove Privacy Zone';
                        remove.onclick = function() {
                            config.privacyZones.splice(zoneIndex, 1);
                            applyPrivacy();
                            renderZones();
                        };
                        zoneBox.appendChild(remove);
                        zonesHost.appendChild(zoneBox);
                    });
                };
                var addZone = function(mode) {
                    var camera = self.app.root.findByName('Camera');
                    var position = camera ? camera.getPosition() : new pc.Vec3();
                    config.privacyZones.push({
                        name: mode + ' area',
                        enabled: true,
                        mode: mode,
                        min: [position.x - 10, position.y - 10, position.z - 10],
                        max: [position.x + 10, position.y + 10, position.z + 10],
                        strength: 8
                    });
                    applyPrivacy();
                    renderZones();
                };
                var addBlur = document.createElement('button');
                addBlur.className = 'unified-btn small';
                addBlur.innerText = 'Add Blur Zone At Camera';
                addBlur.onclick = function() { addZone('blur'); };
                container.appendChild(addBlur);
                var addCrop = document.createElement('button');
                addCrop.className = 'unified-btn small';
                addCrop.innerText = 'Add Crop Zone At Camera';
                addCrop.onclick = function() { addZone('crop'); };
                container.appendChild(addCrop);
                renderZones();
            }
        } else if (entity._isSpawnNode && entity.sp) {
            container.appendChild(renderField('Name', 'string', entity.sp.name, function(v) { entity.sp.name = v; }));
            container.appendChild(renderField('Position', 'vec3', entity.sp.pos, function(v) { entity.sp.pos = v; }));
            container.appendChild(renderField('Rotation', 'vec3', entity.sp.rot, function(v) { entity.sp.rot = v; }));
        }
        return;
    }

    var editableWorldEntity = entity.tags && entity.tags.has('custom-editor-object');
    editableWorldEntity = editableWorldEntity || (entity.script && (
        entity.script.infoHotspot || entity.script.pathVisualizer || entity.script.constructionZone || entity.script.videoTexture
    ));
    if (editableWorldEntity) {
        var organizationTitle = document.createElement('h3');
        organizationTitle.innerText = 'Organization';
        container.appendChild(organizationTitle);
        var organizationRow = document.createElement('div');
        organizationRow.className = 'ed-ins-row';
        var organizationLabel = document.createElement('div');
        organizationLabel.className = 'ed-ins-lbl';
        organizationLabel.innerText = 'Assigned level';
        var organizationControl = document.createElement('div');
        organizationControl.className = 'ed-ins-ctrl';
        var levelSelect = document.createElement('select');
        levelSelect.className = 'ed-select';
        var levelManager = self._getLevelManager();
        var currentOwner = self._getEntityLevelId(entity) || self._currentLevelId;
        (levelManager ? levelManager.levelConfig : []).forEach(function (config) {
            var option = document.createElement('option');
            option.value = config.id;
            option.innerText = config.name || config.id;
            option.selected = config.id === currentOwner;
            levelSelect.appendChild(option);
        });
        levelSelect.onchange = function () {
            self._assignEntityToLevel(entity, levelSelect.value);
            self._editorTargetLevelId = levelSelect.value;
            self._refreshOutlinerTree();
        };
        organizationControl.appendChild(levelSelect);
        organizationRow.appendChild(organizationLabel);
        organizationRow.appendChild(organizationControl);
        container.appendChild(organizationRow);
        var duplicateButton = document.createElement('button');
        duplicateButton.className = 'unified-btn small';
        duplicateButton.innerText = 'Duplicate entity';
        duplicateButton.onclick = function () { self._duplicateEditorEntity(entity); };
        container.appendChild(duplicateButton);
    }

    var componentHeadingAdded = false;
    var addComponentHeading = function () {
        if (componentHeadingAdded) return;
        var heading = document.createElement('h3');
        heading.innerText = 'Components';
        container.appendChild(heading);
        componentHeadingAdded = true;
    };
    if (entity.render) {
        addComponentHeading();
        container.appendChild(renderField('Render enabled', 'boolean', entity.render.enabled, function(value) {
            entity.render.enabled = value;
        }));
        container.appendChild(renderField('Cast shadows', 'boolean', entity.render.castShadows, function(value) {
            entity.render.castShadows = value;
        }));
        container.appendChild(renderField('Receive shadows', 'boolean', entity.render.receiveShadows, function(value) {
            entity.render.receiveShadows = value;
        }));
    }
    if (entity.light) {
        addComponentHeading();
        container.appendChild(renderField('Light enabled', 'boolean', entity.light.enabled, function(value) { entity.light.enabled = value; }));
        container.appendChild(renderField('Light color', 'rgb', entity.light.color, function(value) { entity.light.color = value; }));
        container.appendChild(renderField('Light intensity', 'number', entity.light.intensity, function(value) { entity.light.intensity = value; }));
        container.appendChild(renderField('Light range', 'number', entity.light.range, function(value) { entity.light.range = value; }));
        container.appendChild(renderField('Cast shadows', 'boolean', entity.light.castShadows, function(value) { entity.light.castShadows = value; }));
    }
    if (entity.camera) {
        addComponentHeading();
        container.appendChild(renderField('Camera enabled', 'boolean', entity.camera.enabled, function(value) { entity.camera.enabled = value; }));
        container.appendChild(renderField('Field of view', 'number', entity.camera.fov, function(value) { entity.camera.fov = value; }));
        container.appendChild(renderField('Near clip', 'number', entity.camera.nearClip, function(value) { entity.camera.nearClip = value; }));
        container.appendChild(renderField('Far clip', 'number', entity.camera.farClip, function(value) { entity.camera.farClip = value; }));
    }

    if (entity.tags && entity.tags.has('custom-editor-privacy') && entity._privacyZone) {
        var zone = entity._privacyZone;
        var title = document.createElement('h3');
        title.innerText = 'Privacy Mask';
        container.appendChild(title);
        var help = document.createElement('p');
        help.style.fontSize = '11px';
        help.style.opacity = '0.8';
        help.innerText = 'Start drawing, then click points on the Lemgo scan. Three or more points form a closed privacy polygon.';
        container.appendChild(help);

        container.appendChild(renderField('Enabled', 'boolean', zone.enabled !== false, function (value) {
            zone.enabled = value;
            self._syncPrivacyZones();
        }));

        var modeRow = document.createElement('div');
        modeRow.className = 'ed-ins-row';
        var modeLabel = document.createElement('div');
        modeLabel.className = 'ed-ins-lbl';
        modeLabel.innerText = 'Mode';
        var modeControl = document.createElement('div');
        modeControl.className = 'ed-ins-ctrl';
        var modeSelect = document.createElement('select');
        modeSelect.className = 'ed-select';
        ['blur', 'crop'].forEach(function (mode) {
            var option = document.createElement('option');
            option.value = mode;
            option.innerText = mode === 'blur' ? 'Blur' : 'Crop / remove';
            option.selected = zone.mode === mode;
            modeSelect.appendChild(option);
        });
        modeSelect.onchange = function () {
            zone.mode = modeSelect.value;
            self._syncPrivacyZones();
        };
        modeControl.appendChild(modeSelect);
        modeRow.appendChild(modeLabel);
        modeRow.appendChild(modeControl);
        container.appendChild(modeRow);

        container.appendChild(renderField('Minimum height', 'number', zone.minY, function (value) {
            zone.minY = value;
            self._syncPrivacyZones();
        }));
        container.appendChild(renderField('Maximum height', 'number', zone.maxY, function (value) {
            zone.maxY = value;
            self._syncPrivacyZones();
        }));
        container.appendChild(renderField('Blur strength', 'number', zone.strength, function (value) {
            zone.strength = Math.max(1, value);
            self._syncPrivacyZones();
        }));
        container.appendChild(renderField('Fallback drawing height (Y)', 'number', zone.drawY || 0, function (value) {
            zone.drawY = value;
            self._syncPrivacyZones();
        }));

        var coordinatesLabel = document.createElement('div');
        coordinatesLabel.className = 'ed-ins-lbl';
        coordinatesLabel.innerText = 'Polygon coordinates (X, Y, Z)';
        container.appendChild(coordinatesLabel);
        var coordinatesInput = document.createElement('textarea');
        coordinatesInput.rows = 7;
        coordinatesInput.style.width = '100%';
        coordinatesInput.style.resize = 'vertical';
        coordinatesInput.placeholder = '10, 0, 20\n20, 0, 20\n20, 0, 30';
        coordinatesInput.value = (zone.points || []).map(function (point) {
            return point.map(function (value) { return Number(value).toFixed(3); }).join(', ');
        }).join('\n');
        coordinatesInput.onchange = function () {
            var parsedPoints = coordinatesInput.value.split(/\r?\n/).map(function (line) {
                return line.split(/[ ,;]+/).filter(Boolean).map(Number);
            }).filter(function (point) {
                return point.length >= 3 && point.slice(0, 3).every(Number.isFinite);
            }).slice(0, 16).map(function (point) {
                return point.slice(0, 3);
            });
            zone.points = parsedPoints;
            self._refreshPrivacyZoneVisual(entity);
            self._syncPrivacyZones();
            self._renderAttributeEditor(entity);
        };
        container.appendChild(coordinatesInput);
        var testSquareButton = document.createElement('button');
        testSquareButton.className = 'unified-btn small';
        testSquareButton.innerText = 'Create 10m test square at camera';
        testSquareButton.onclick = function () {
            var camera = self.app.root.findByName('Camera');
            var position = camera ? camera.getPosition() : new pc.Vec3();
            var y = Number(zone.drawY);
            if (!Number.isFinite(y)) y = position.y;
            zone.points = [
                [position.x - 5, y, position.z - 5],
                [position.x + 5, y, position.z - 5],
                [position.x + 5, y, position.z + 5],
                [position.x - 5, y, position.z + 5]
            ];
            self._refreshPrivacyZoneVisual(entity);
            self._syncPrivacyZones();
            self._renderAttributeEditor(entity);
        };
        container.appendChild(testSquareButton);

        var pointStatus = document.createElement('p');
        pointStatus.innerText = (zone.points || []).length + ' / 16 points';
        pointStatus.style.fontSize = '11px';
        container.appendChild(pointStatus);

        var drawButton = document.createElement('button');
        drawButton.className = 'unified-btn small';
        drawButton.innerText = self._privacyDrawEntity === entity ? 'Finish drawing' : 'Draw points on scan';
        drawButton.onclick = function () {
            self._privacyDrawEntity = self._privacyDrawEntity === entity ? null : entity;
            self.app._privacyDrawing = !!self._privacyDrawEntity;
            self._renderAttributeEditor(entity);
        };
        container.appendChild(drawButton);

        var undoButton = document.createElement('button');
        undoButton.className = 'unified-btn small';
        undoButton.innerText = 'Undo last point';
        undoButton.disabled = !zone.points || zone.points.length === 0;
        undoButton.onclick = function () {
            zone.points.pop();
            self._refreshPrivacyZoneVisual(entity);
            self._syncPrivacyZones();
            self._renderAttributeEditor(entity);
        };
        container.appendChild(undoButton);

        var clearButton = document.createElement('button');
        clearButton.className = 'unified-btn small';
        clearButton.innerText = 'Clear points';
        clearButton.disabled = !zone.points || zone.points.length === 0;
        clearButton.onclick = function () {
            zone.points = [];
            self._refreshPrivacyZoneVisual(entity);
            self._syncPrivacyZones();
            self._renderAttributeEditor(entity);
        };
        container.appendChild(clearButton);
        return;
    }

    if (entity.script && entity.script.scripts) {
        var scripts = entity.script.scripts;
        scripts.forEach(function(scriptObj) {
            var scriptType = scriptObj.__scriptType || scriptObj.constructor;
            var scriptName = (scriptType && (scriptType.__name || scriptType.scriptName || scriptType.name)) || scriptObj.__scriptName;
            if (!scriptName || !entity.script[scriptName]) {
                scriptName = Object.keys(entity.script).find(function (key) { return entity.script[key] === scriptObj; }) || scriptName;
            }
            var h3 = document.createElement('h3');
            h3.innerText = 'Script: ' + scriptName;
            container.appendChild(h3);
            
            var scriptInst = entity.script[scriptName];
            if (!scriptInst) return;
            container.appendChild(renderField('Script enabled', 'boolean', scriptInst.enabled !== false, function(newValue) {
                scriptInst.enabled = newValue;
            }));
            
            var attributes = scriptType && scriptType.attributes;
            if (attributes && attributes.index) {
                var attrs = Object.keys(attributes.index);
                attrs.forEach(function(attrName) {
                    var attrType = attributes.index[attrName].type;
                    if (attributes.index[attrName].array) {
                        attrType = 'array_' + attrType;
                        if (attrType === 'array_undefined') attrType = 'array';
                    }
                    var val = scriptInst[attrName];
                    var attrTitle = attributes.index[attrName].title || attrName;
                    container.appendChild(renderField(attrTitle, attrType, val, function(newVal) {
                        scriptInst[attrName] = newVal;
                    }));
                });
            }
        });
    }
};

UI.prototype._applyEditorTransform = function (prefix, eventName) {
    var getNum = function (id) {
        var el = document.getElementById(id);
        return el ? parseFloat(el.value) || 0 : 0;
    };
    var px = getNum('ed-' + prefix + '-pos-x');
    var py = getNum('ed-' + prefix + '-pos-y');
    var pz = getNum('ed-' + prefix + '-pos-z');
    var rx = getNum('ed-' + prefix + '-rot-x');
    var ry = getNum('ed-' + prefix + '-rot-y');
    var rz = getNum('ed-' + prefix + '-rot-z');
    var sx = getNum('ed-' + prefix + '-scale-x');
    var sy = getNum('ed-' + prefix + '-scale-y');
    var sz = getNum('ed-' + prefix + '-scale-z');

    if (eventName) {
        this.app.fire(eventName, px, py, pz, rx, ry, rz, sx, sy, sz);
    }
};

UI.prototype._populateEditorLevel = function (levelId) {
    var sel = document.getElementById('ed-level-select');
    if (sel && levelId) sel.value = levelId;

    var levelContainer = this.app.root.findByName('LevelContainer');
    if (!levelContainer) return;

    var setVal = function (id, val) {
        var el = document.getElementById(id);
        if (el) el.value = (typeof val === 'number') ? (Number.isInteger(val) ? val : val.toFixed(3)) : val;
    };

    // --- Splat Discovery ---
    var splatEntity = levelContainer.findByName('Splat') || levelContainer.findByName('GSplat');
    if (!splatEntity) {
        // search by tag or script
        var splats = this.app.root.findByTag('gsplat');
        if (splats.length > 0) splatEntity = splats[0];
    }
    if (splatEntity) {
        var pos = splatEntity.getLocalPosition();
        var rot = splatEntity.getLocalEulerAngles();
        var scale = splatEntity.getLocalScale();
        setVal('ed-splat-pos-x', pos.x);
        setVal('ed-splat-pos-y', pos.y);
        setVal('ed-splat-pos-z', pos.z);
        setVal('ed-splat-rot-x', rot.x);
        setVal('ed-splat-rot-y', rot.y);
        setVal('ed-splat-rot-z', rot.z);
        setVal('ed-splat-scale-x', scale.x);
        setVal('ed-splat-scale-y', scale.y);
        setVal('ed-splat-scale-z', scale.z);
    }

    // --- POI / Hotspot Discovery ---
    var poiSelect = document.getElementById('ed-poi-select');
    if (poiSelect) {
        poiSelect.innerHTML = '<option value="">-- Hotspot auswählen --</option>';
        var allHotspots = [];
        var findHotspots = function (ent) {
            if (!ent || ent._destroyed) return;
            if (ent.script && ent.script.infoHotspot) allHotspots.push(ent);
            if (ent.script && ent.script.constructionZone) allHotspots.push(ent);
            if (ent.tags && ent.tags.has('custom-editor-poi')) {
                if (allHotspots.indexOf(ent) === -1) allHotspots.push(ent);
            }
            if (ent.children) ent.children.forEach(findHotspots);
        };
        findHotspots(levelContainer);
        findHotspots(this.app.root);

        // Deduplicate
        var seen = {};
        allHotspots = allHotspots.filter(function (e) {
            var g = e.getGuid();
            if (seen[g]) return false;
            seen[g] = true;
            return true;
        });

        allHotspots.forEach(function (ent) {
            var opt = document.createElement('option');
            opt.value = ent.getGuid();
            var icon = ent.script && ent.script.constructionZone ? '🚧' : '🎯';
            opt.innerText = icon + ' ' + ent.name;
            poiSelect.appendChild(opt);
        });
    }

    // --- Path / Laufwege Discovery ---
    var pathSelect = document.getElementById('ed-path-select');
    if (pathSelect) {
        pathSelect.innerHTML = '<option value="">-- Laufweg auswählen --</option>';
        var allPaths = [];
        var findPaths = function (ent) {
            if (!ent || ent._destroyed) return;
            if (ent.script && ent.script.pathVisualizer) allPaths.push(ent);
            if (ent.tags && ent.tags.has('custom-editor-path')) {
                if (allPaths.indexOf(ent) === -1) allPaths.push(ent);
            }
            if (ent.children) ent.children.forEach(findPaths);
        };
        findPaths(levelContainer);

        allPaths.forEach(function (ent) {
            var opt = document.createElement('option');
            opt.value = ent.getGuid();
            opt.innerText = '🚶 ' + ent.name;
            pathSelect.appendChild(opt);
        });
    }

    // --- Spawnpoint Discovery ---
    var spawnList = document.getElementById('ed-spawnpoints-list');
    if (spawnList) {
        spawnList.innerHTML = '';
        var self = this;
        // Read from level data if available
        if (this._levelData && levelId && this._levelData[levelId]) {
            var lvlData = this._levelData[levelId];
            if (lvlData.startPos) {
                self._addSpawnpointUI({
                    title: 'Start (' + levelId + ')',
                    position: lvlData.startPos,
                    rotation: lvlData.startRot || [0, 0, 0]
                });
            }
            if (lvlData.spawnpoints) {
                lvlData.spawnpoints.forEach(function (sp) {
                    self._addSpawnpointUI(sp);
                });
            }
        }
    }

    // --- Collider Discovery ---
    var dynCol = this.app.root.findByName('DynamicCollider_' + levelId);
    if (dynCol) {
        var colPos = dynCol.getLocalPosition();
        var colRot = dynCol.getLocalEulerAngles();
        var colScale = dynCol.getLocalScale();
        setVal('ed-col-pos-x', colPos.x);
        setVal('ed-col-pos-y', colPos.y);
        setVal('ed-col-pos-z', colPos.z);
        setVal('ed-col-rot-x', colRot.x);
        setVal('ed-col-rot-y', colRot.y);
        setVal('ed-col-rot-z', colRot.z);
        setVal('ed-col-scale-x', colScale.x);
        setVal('ed-col-scale-y', colScale.y);
        setVal('ed-col-scale-z', colScale.z);
    }

    // Refresh outliner tree
    this._refreshOutlinerTree();

    console.log('[Editor] Level populated:', levelId,
        '| Splat:', !!splatEntity,
        '| Collider:', !!dynCol);
};

UI.prototype._addSpawnpointUI = function (spawn) {
    var list = document.getElementById('ed-spawnpoints-list');
    if (!list) return;

    var row = document.createElement('div');
    row.className = 'ed-item-row ed-spawnpoint-item';
    row.innerHTML = '<div style="display:flex; flex-direction:column; gap:2px; flex:1;">' +
        '<span style="font-weight:600; color:var(--text-bright);">' + spawn.title + '</span>' +
        '<span style="font-size:9px; color:var(--text-secondary); font-family:monospace;">[' + spawn.position.join(', ') + ']</span>' +
        '</div>' +
        '<button class="unified-btn small ed-teleport-spawn" style="padding:2px 6px; font-size:10px;">🎯 Teleport</button>' +
        '<button class="unified-btn small ed-delete-spawn" style="padding:2px 6px; font-size:10px; color:var(--col-red);">🗑️</button>';

    var teleportBtn = row.querySelector('.ed-teleport-spawn');
    if (teleportBtn) {
        teleportBtn.onclick = (e) => {
            e.stopPropagation();
            this.app.fire('camera:setTransform', spawn.position[0], spawn.position[1], spawn.position[2], spawn.rotation[0], spawn.rotation[1], spawn.rotation[2]);
        };
    }

    var delBtn = row.querySelector('.ed-delete-spawn');
    if (delBtn) {
        delBtn.onclick = (e) => {
            e.stopPropagation();
            row.remove();
        };
    }

    list.appendChild(row);
};

UI.prototype._refreshPathsList = function (selectedGuid) {
    var select = document.getElementById('ed-path-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Laufweg auswählen --</option>';

    var paths = this.app.root.findByTag('custom-editor-path');
    paths.forEach(function (p) {
        var opt = document.createElement('option');
        opt.value = p.getGuid();
        opt.innerText = p.name;
        if (p.getGuid() === selectedGuid) opt.selected = true;
        select.appendChild(opt);
    });
};

UI.prototype._refreshPathPointsUI = function (points) {
    var list = document.getElementById('ed-path-points-list');
    if (!list) return;
    list.innerHTML = '';
    var normalized = [];
    if (points.length && Array.isArray(points[0])) normalized = points;
    else {
        for (var pointIndex = 0; pointIndex + 2 < points.length; pointIndex += 3) {
            normalized.push(points.slice(pointIndex, pointIndex + 3));
        }
    }
    normalized.forEach(function (pt, idx) {
        var row = document.createElement('div');
        row.className = 'ed-item-row';
        row.style.fontSize = '10px';
        row.innerHTML = '<span>Punkt #' + (idx + 1) + ' (' + pt.join(', ') + ')</span>';
        list.appendChild(row);
    });
};

UI.prototype._refreshPoiList = function (selectedGuid) {
    var select = document.getElementById('ed-poi-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Hotspot auswählen --</option>';

    var pois = this.app.root.findByTag('custom-editor-poi');
    pois.forEach(function (p) {
        var opt = document.createElement('option');
        opt.value = p.getGuid();
        opt.innerText = p.name;
        if (p.getGuid() === selectedGuid) opt.selected = true;
        select.appendChild(opt);
    });
};
UI.prototype._showShortcutsModal = function () {
    var isDE = this.currentLang === 'de';
    var overlay = document.getElementById('info-modal-overlay');
    var title = document.getElementById('info-title');
    var body = document.getElementById('info-body');
    var link = document.getElementById('info-link');
    if (!overlay || !title || !body) return;

    title.innerText = isDE ? 'Tastenkürzel' : 'Keyboard Shortcuts';
    if (link) link.style.display = 'none';

    var shortcuts = isDE ? [
        {
            cat: '🚶 Bewegung', items: [
                ['WASD / Pfeiltasten', 'Laufen / Bewegen'],
                ['Shift', 'Schneller laufen'],
                ['Q / E', 'Runter / Hoch (Flugmodus)'],
                ['G (halten)', 'Schwerkraft aus (Fliegen)'],
                ['Mausrad', 'Geschwindigkeit anpassen']
            ]
        },
        {
            cat: '🎥 Kamera', items: [
                ['Rechte Maustaste + Ziehen', 'Umsehen'],
                ['1 Finger (Touch)', 'Umsehen (Mobil)'],
                ['Joystick (Touch)', 'Bewegen (Mobil)']
            ]
        },
        {
            cat: '🛠 Debug / Tools', items: [
                ['P', 'Debug-Modus ein/aus + Position kopieren'],
                ['C', 'Kollisions-Mesh ein/aus'],
                ['K', 'Culling ein/aus'],
                ['F2', 'Screenshot speichern']
            ]
        }
    ] : [
        {
            cat: '🚶 Movement', items: [
                ['WASD / Arrow Keys', 'Walk / Move'],
                ['Shift', 'Run faster'],
                ['Q / E', 'Down / Up (Fly mode)'],
                ['G (hold)', 'Disable gravity (Fly)'],
                ['Mouse Wheel', 'Adjust speed']
            ]
        },
        {
            cat: '🎥 Camera', items: [
                ['Right-Click + Drag', 'Look around'],
                ['1 Finger (Touch)', 'Look around (Mobile)'],
                ['Joystick (Touch)', 'Move (Mobile)']
            ]
        },
        {
            cat: '🛠 Debug / Tools', items: [
                ['P', 'Toggle debug mode + Copy position'],
                ['C', 'Toggle collision mesh'],
                ['K', 'Toggle culling'],
                ['F2', 'Save screenshot']
            ]
        }
    ];

    var html = '';
    shortcuts.forEach(function (section) {
        html += '<div style="margin-bottom:16px;"><div style="font-weight:600; color:var(--col-cyan); margin-bottom:8px; font-size:14px;">' + section.cat + '</div>';
        html += '<table style="width:100%; border-collapse:collapse;">';
        section.items.forEach(function (item) {
            html += '<tr><td style="padding:4px 8px; border-bottom:1px solid rgba(255,255,255,0.05);"><kbd style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; font-size:12px; font-family:monospace; border:1px solid rgba(255,255,255,0.15);">' + item[0] + '</kbd></td><td style="padding:4px 8px; color:rgba(255,255,255,0.7); font-size:13px; border-bottom:1px solid rgba(255,255,255,0.05);">' + item[1] + '</td></tr>';
        });
        html += '</table></div>';
    });

    body.innerHTML = html;
    overlay.classList.remove('hidden');
};
UI.prototype._applyTranslations = function () {
    var d = this.dict[this.currentLang];
    var setTxt = (id, txt) => {
        var el = document.getElementById(id);
        if (el) el.innerText = txt;
    };
    var setTt = (id, txt) => {
        var el = document.getElementById(id);
        if (el) el.setAttribute('data-tooltip', txt);
    };
    setTxt('lbl-menu-home', d.menuHome);
    setTxt('lbl-menu-reset', d.menuReset);
    setTxt('lbl-menu-imprint', d.menuImprint);
    setTxt('intro-title', d.welcome);
    // Location intro handled below
    setTxt('lbl-controls-title', d.controls);
    setTxt('lbl-desktop', d.desktop);
    setTxt('lbl-touch', d.touch);
    var backLbl = document.getElementById('lbl-menu-back');
    if (backLbl) backLbl.innerText = d.menuBack;

    setTxt('lbl-mobile-map', d.navMobileMap);
    setTxt('lbl-nav-title', d.navTitle);
    setTxt('lbl-nav-campus', d.navCampus);
    setTxt('lbl-nav-spawnpoints', d.navSpawnpoints);

    setTt('btn-low', d.ttLow);
    setTt('btn-medium', d.ttMed);
    setTt('btn-high', d.ttHigh);
    setTt('btn-ultra', d.ttUltra);
    this._translateDynamic();
    this._updateContent(this._currentLevelId);
};
UI.prototype._translateDynamic = function () {
    var d = this.dict[this.currentLang];
    var btn = document.getElementById('burger-btn');
    var container = document.getElementById('burger-menu-container');
    if (btn && container) {
        var isOpen = container.classList.contains('open');
        var text = isOpen ? (this.currentLang === 'de' ? 'Schließen' : 'Close') : d.menuBtn;
        btn.innerHTML = isOpen ? `<span class="icon">✕</span> <span id="lbl-menu-btn">${text}</span>` : `<span class="icon">☰</span> <span id="lbl-menu-btn">${text}</span>`;
        btn.setAttribute('data-tooltip', text);
    }
    var langFlag = document.getElementById('lang-flag');
    var langText = document.getElementById('lang-text');
    if (langFlag && langText) {
        langFlag.innerText = this.currentLang === 'de' ? '🇬🇧' : '🇩🇪';
        langText.innerText = this.currentLang === 'de' ? 'English' : 'Deutsch';
    }
    var helpBtn = document.getElementById('menu-help');
    var controlsCard = document.getElementById('controls-card');
    if (helpBtn && controlsCard) {
        var isVis = controlsCard.style.display !== 'none';
        helpBtn.innerHTML = isVis ? `<span class="icon">✕</span> <span>${d.menuHelpOff}</span>` : `<span class="icon">🕹️</span> <span>${d.menuHelpOn}</span>`;
    }
    var uiBtn = document.getElementById('menu-toggle-ui');
    if (uiBtn) {
        uiBtn.innerHTML = this._uiVisible ? `<span class="icon">👁️</span> <span>${d.menuUiOff}</span>` : `<span class="icon">👁️‍🗨️</span> <span>${d.menuUiOn}</span>`;
    }
    var tourBtn = document.getElementById('menu-tour-toggle');
    if (tourBtn) {
        var btnText = this._tourVisible ? this.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : this.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
        tourBtn.innerHTML = `<span class="icon">🗺️</span> <span>${btnText}</span>`;
    }

    // Dynamic translations for new elements
    var fpsLbl = document.getElementById('lbl-ctrl-fps');
    if (fpsLbl) fpsLbl.innerText = d.ctrlFps || 'FPS';
    var dragLbl = document.getElementById('lbl-ctrl-drag');
    if (dragLbl) dragLbl.innerText = d.ctrlDrag || 'Drag & Look';
    var toolsHdr = document.getElementById('lbl-tools-header');
    if (toolsHdr) toolsHdr.innerText = d.toolsHeader || 'Tools';
    var cullingLbl = document.getElementById('lbl-culling');
    if (cullingLbl) cullingLbl.innerText = this._cullingEnabled ? (d.cullingOn || 'Culling: ON') : (d.cullingOff || 'Culling: OFF');
    var cullDistLbl = document.getElementById('lbl-cull-dist');
    var cullSlider = document.getElementById('culling-distance-slider');
    if (cullDistLbl && cullSlider) cullDistLbl.innerText = (d.cullDist || 'Culling Distance') + ': ' + cullSlider.value + 'm';
    var debugLbl = document.getElementById('lbl-debug');
    if (debugLbl) debugLbl.innerText = d.debugMode || 'Debug Mode';
    var screenshotLbl = document.getElementById('lbl-screenshot');
    if (screenshotLbl) screenshotLbl.innerText = d.screenshot || 'Screenshot (F2)';
    var adaptiveLbl = document.getElementById('lbl-adaptive');
    if (adaptiveLbl) adaptiveLbl.innerText = this._adaptiveEnabled ? (d.adaptiveOn || 'Auto Quality: ON') : (d.adaptiveOff || 'Auto Quality: OFF');
};
UI.prototype._onLevelSwitchEvent = function (levelId) {
    if (!this.isJumpingBack && this._currentLevelId && this._currentLevelId !== levelId) {
        var state = {
            levelId: this._currentLevelId
        };
        var player = this.app.root.findByName('Character_Controller');
        if (player) {
            state.playerPosition = player.getPosition().clone();
            state.look = new Vec2(0, 0);
            if (player.script && player.script['character-controller'] && player.script['character-controller'].controller) {
                var ctrl = player.script['character-controller'].controller;
                state.look.set(ctrl.look.x, ctrl.look.y);
            }
        }
        var camera = this.app.root.findByName('Camera');
        if (camera && camera.script && camera.script.cameraControls && camera.script.cameraControls._pose) {
            state.camPos = camera.script.cameraControls._pose.position.clone();
            state.camAngles = camera.script.cameraControls._pose.angles.clone();
        }
        this.history.push(state);
        this.updateJumpBackButton();
    }
    this._currentLevelId = levelId;
    this._applyDefaultPresetForLevel(levelId);
    this._privacyDrawEntity = null;
    this.app._privacyDrawing = false;
    this._setPrivacyVisualsVisible(!!this._editorPanelOpen && levelId === 'lemgo');
    var self = this;
    setTimeout(function () {
        self._updateContent(levelId);
    }, 800);
};
UI.prototype._applyDefaultPresetForLevel = function (levelId) {
    var mobile = this._isMobileUi || window.innerWidth <= 600;
    var preset = levelId === 'lemgo'
        ? (mobile ? 'mob-ultra' : 'ultra')
        : (mobile ? 'mob-med' : 'medium');
    this.app.fire('preset:' + preset);
    this._onPresetChanged(preset);
};
UI.prototype.goBack = function () {
    if (this.history.length === 0) return;
    var lastState = this.history.pop();
    this.isJumpingBack = true;
    this.app.fire('level:switch', lastState.levelId);
    var self = this;
    setTimeout(() => {
        var player = self.app.root.findByName('Character_Controller');
        if (player && lastState.playerPosition) {
            if (player.rigidbody) {
                player.rigidbody.teleport(lastState.playerPosition, Vec3.ZERO);
                player.rigidbody.linearVelocity = Vec3.ZERO;
                player.rigidbody.angularVelocity = Vec3.ZERO;
            } else {
                player.setPosition(lastState.playerPosition);
            }
            if (player.script && player.script['character-controller']) {
                var charCtrl = player.script['character-controller'];
                if (charCtrl.controller && lastState.look) {
                    charCtrl.controller.look.set(lastState.look.x, lastState.look.y);
                }
                if (charCtrl.setStartRotation && lastState.look) {
                    charCtrl.setStartRotation(new Vec3(0, lastState.look.x, 0));
                }
            }
        }
        var camera = self.app.root.findByName('Camera');
        if (camera && camera.script && camera.script.cameraControls && lastState.camPos) {
            var controls = camera.script.cameraControls;
            if (controls._pose) {
                controls._pose.position.copy(lastState.camPos);
                if (lastState.camAngles) controls._pose.angles.copy(lastState.camAngles);
            }
            if (controls._controller) {
                controls._controller.detach();
                controls._controller.attach(controls._pose);
            }
        }
    }, 850);
    this.updateJumpBackButton();
    setTimeout(function () {
        self.isJumpingBack = false;
    }, 1000);
};
UI.prototype.updateJumpBackButton = function () {
    if (this.jumpBackBtn) {
        this.jumpBackBtn.style.display = 'flex';
        this.jumpBackBtn.style.opacity = this.history.length > 0 ? '1' : '0.5';
        this.jumpBackBtn.style.pointerEvents = this.history.length > 0 ? 'auto' : 'none';
        this.jumpBackBtn.style.color = this.history.length > 0 ? '#f1c40f' : 'var(--text-secondary)';
    }
};
UI.prototype._updateContent = function (levelId) {
    var data = this._levelData[levelId];
    if (!data) return;
    var introLoc = document.getElementById('intro-location');
    if (introLoc) introLoc.innerText = this.currentLang === 'de' ? data.name_de : data.name_en;

    var currentLocLink = document.getElementById('current-location-link');
    var locPrefix = document.getElementById('location-prefix');
    if (currentLocLink) {
        currentLocLink.innerText = this.currentLang === 'de' ? data.name_de : data.name_en;
        currentLocLink.href = data.link;
    }
    if (locPrefix) {
        locPrefix.innerText = this.currentLang === 'de' ? data.prefix_de : data.prefix_en;
    }

    var logoEl = document.getElementById('header-logo');
    if (!logoEl) {
        logoEl = document.querySelector('.logo');
    }
    if (logoEl) {
        if (levelId === 'detmold') {
            logoEl.src = './kcd.png';
            logoEl.onerror = function () { this.onerror = null; this.src = './public/kcd.png'; };
        } else {
            logoEl.src = './icl.jpg';
            logoEl.onerror = function () { this.onerror = null; this.src = './public/icl.jpg'; };
        }
    }
    var switchText = document.getElementById('switch-campus-text');
    var switchBtn = document.getElementById('btn-switch-campus');
    var d = this.dict[this.currentLang];
    if (switchText && switchBtn) {
        var text = levelId === 'lemgo' ? d.switchDetmold : d.switchLemgo;
        switchText.innerText = text;
        switchBtn.setAttribute('data-tooltip', text);
    }
    this._tourVisible = data.mode !== 'fly';
    this.app.fire('ui:toggleTour', this._tourVisible);
    var tourBtn = document.getElementById('menu-tour-toggle');
    if (tourBtn) {
        var btnText = this._tourVisible ? this.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : this.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
        tourBtn.innerHTML = `<span class="icon">🗺️</span> <span>${btnText}</span>`;
    }

    var navSpContainer = document.getElementById('nav-spawnpoints-container');
    var navSpSection = document.getElementById('nav-spawnpoints-section');
    if (navSpContainer && navSpSection) {
        var lmEntity = this.app.root.findByName('LevelManager');
        if (lmEntity && lmEntity.script && lmEntity.script.levelManager) {
            var cfg = lmEntity.script.levelManager.getConfigById(levelId);
            if (cfg && cfg.spawnpoints && cfg.spawnpoints.length > 0) {
                navSpContainer.innerHTML = '';
                cfg.spawnpoints.forEach(function (sp) {
                    var btn = document.createElement('button');
                    btn.className = 'unified-btn';
                    btn.style.width = '100%';
                    btn.style.justifyContent = 'flex-start';
                    btn.innerHTML = '<span class="icon">📍</span> <span>' + sp.name + '</span>';
                    btn.onclick = function () {
                        var r = sp.rot || [0, 0, 0];
                        lmEntity.script.levelManager.jumpToSpawnpoint(sp.pos, r);
                        var no = document.getElementById('nav-overlay');
                        if (no) no.style.display = 'none';
                    };
                    navSpContainer.appendChild(btn);
                });
                navSpSection.style.display = 'block';
            } else {
                navSpSection.style.display = 'none';
            }
        } else {
            navSpSection.style.display = 'none';
        }
    }

    // Show/hide Steuerungs-Modus section based on mode
    var ctrlSection = document.getElementById('ctrl-mode-section');
    if (ctrlSection) {
        ctrlSection.style.display = data.mode === 'orbit' ? 'none' : 'block';
    }
    this._updateControlsText(data.mode);
};
UI.prototype._updateControlsText = function (mode) {
    if (this._listDesktop && this._listTouch) {
        var d = this.dict[this.currentLang];
        if (mode === 'fly') {
            this._listDesktop.innerHTML = d.flyDesktop;
            this._listTouch.innerHTML = d.flyTouch;
        } else {
            this._listDesktop.innerHTML = d.orbitDesktop;
            this._listTouch.innerHTML = d.orbitTouch;
        }
    }
    var joyZone = document.getElementById('mobile-joystick-zone');
    if (joyZone) {
        joyZone.style.display = 'block';
    }
};
UI.prototype._onPresetChanged = function (presetName) {
    this._currentPreset = presetName;
    this._updateButtonStates();
};
UI.prototype._updateButtonStates = function () {
    var self = this;
    this._buttons.forEach(function (btn, quality) {
        if (!btn || !btn.classList) return;
        if (quality === self._currentPreset) btn.classList.add('active');
        else btn.classList.remove('active');
    });
};
UI.prototype._onUpdateStats = function (rendered) {
    if (this._splatCountEl) {
        var r = rendered >= 1000000 ? (rendered / 1000000).toFixed(2) + 'M' : (rendered / 1000).toFixed(2) + 'K';
        var t = this.totalSplats >= 1000000 ? (this.totalSplats / 1000000).toFixed(2) + 'M' : (this.totalSplats / 1000).toFixed(2) + 'K';
        var separator = this.currentLang === 'de' ? ' von ' : ' of ';
        this._splatCountEl.textContent = 'Splats: ' + r + separator + t;
    }
};
UI.prototype._refreshCustomObjectsList = function () {
    var select = document.getElementById('ed-custom-obj-select');
    if (!select) return;
    var oldVal = select.value;
    select.innerHTML = '<option value="">-- No Object Selected --</option>';

    var traverse = function (node) {
        if (node.script) {
            var isCustom = false;
            var prefix = '';

            var hasScript = function (name) {
                if (node.script.has) return node.script.has(name);
                return node.script[name] !== undefined;
            };

            // Check using explicit names first
            if (hasScript('infoHotspot')) { isCustom = true; prefix = 'POI'; }
            else if (hasScript('pathVisualizer')) { isCustom = true; prefix = 'Path'; }
            else if (hasScript('constructionZone')) { isCustom = true; prefix = 'Const'; }
            else if (hasScript('videoTexture')) { isCustom = true; prefix = 'Video'; }
            else if (hasScript('splatBlur')) { isCustom = true; prefix = 'Blur'; }

            // Fallback: check script instances directly to bypass naming case issues
            if (!isCustom && node.script.scripts) {
                for (var i = 0; i < node.script.scripts.length; i++) {
                    var sName = node.script.scripts[i].__scriptType ? node.script.scripts[i].__scriptType.__name : node.script.scripts[i].name;
                    if (sName === 'infoHotspot') { isCustom = true; prefix = 'POI'; break; }
                    else if (sName === 'pathVisualizer') { isCustom = true; prefix = 'Path'; break; }
                    else if (sName === 'constructionZone') { isCustom = true; prefix = 'Const'; break; }
                    else if (sName === 'videoTexture') { isCustom = true; prefix = 'Video'; break; }
                    else if (sName === 'splatBlur') { isCustom = true; prefix = 'Blur'; break; }
                }
            }

            if (!isCustom && node.tags && node.tags.has('custom-editor-object')) {
                isCustom = true; prefix = 'Obj';
            }
            if (!isCustom && node.tags && node.tags.has('poi')) {
                isCustom = true; prefix = 'POI';
            }

            if (isCustom) {
                var opt = document.createElement('option');
                opt.value = node.getGuid();
                opt.text = prefix + ': ' + node.name;
                select.appendChild(opt);
            }
        }
        node.children.forEach(traverse);
    };

    traverse(this.app.root);
    select.value = oldVal;
};

UI.prototype.onDestroy = function () {
    this.app.off('ui:setPreset', this._onPresetChanged, this);
    this.app.off('ui:updateStats', this._onUpdateStats, this);
    this.app.off('level:switch', this._onLevelSwitchEvent, this);
    if (this.uiContainer && this.uiContainer.parentNode) this.uiContainer.parentNode.removeChild(this.uiContainer);
};
