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
UI.prototype.initialize = function() {
    this._buttons = new Map();
    this._currentPreset = platform.mobile ? 'low' : 'medium';
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
    this._loadTranslations = function(lang, callback) {
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
    
    this._applyRTL = function() {
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
    setInterval(()=>{
        var vrBtn = document.querySelector('.webxr-button, .pc-webxr-button, #webxr-button, button[title*="VR"]');
        if (vrBtn) vrBtn.innerText = this.currentLang === 'de' ? 'VR STARTEN' : 'ENTER VR';
    }, 1000);
    this.app.on('ui:setPreset', this._onPresetChanged, this);
    this.app.on('ui:updateStats', this._onUpdateStats, this);
    this.app.on('level:switch', this._onLevelSwitchEvent, this);
    this.on('destroy', this.onDestroy, this);
    this._updateContent('lemgo');
};
UI.prototype._initElements = function() {
    var self = this;
    [
        'ultra',
        'high',
        'medium',
        'low',
        'mob-med',
        'mob-low'
    ].forEach(function(quality) {
        var btn = document.getElementById('btn-' + quality);
        if (btn) {
            self._buttons.set(quality, btn);
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            self._buttons.set(quality, newBtn);
            newBtn.addEventListener('click', function(e) {
                self.app.fire('preset:' + quality);
                self._onPresetChanged(quality);
            });
            // FIX: Das 'touchstart' Event, das auf Handys Klicks blockiert hat, wurde entfernt!
            [
                'mousedown'
            ].forEach((ev)=>newBtn.addEventListener(ev, (e)=>e.stopPropagation()));
        }
    });
    this._splatCountEl = document.getElementById('splat-count');
    this._prefixEl = document.getElementById('location-prefix');
    this._linkEl = document.getElementById('current-location-link');
    var switchBtn = document.getElementById('btn-switch-campus');
    if (switchBtn) {
        switchBtn.onclick = function(e) {
            e.preventDefault();
            var targetLevel = self._currentLevelId === 'lemgo' ? 'detmold' : 'lemgo';
            self.app.fire('level:switch', targetLevel);
        };
    }
    var card = document.getElementById('controls-card');
    var header = document.getElementById('controls-header');
    if (card && header) {
        header.addEventListener('click', function() {
            card.classList.toggle('collapsed');
        });
        if (platform.mobile) card.classList.add('collapsed');
        this._listDesktop = document.getElementById('ctrl-list-desktop');
        this._listTouch = document.getElementById('ctrl-list-touch');
    }
};
UI.prototype._initBurgerMenu = function() {
    var self = this;
    var container = document.getElementById('burger-menu-container');
    var btn = document.getElementById('burger-btn');
    var langBtns = document.querySelectorAll('.lang-btn');
    var homeBtn = document.getElementById('menu-home');
    var helpBtn = document.getElementById('menu-help');
    var resetBtn = document.getElementById('menu-reset');
    var toggleUiBtn = document.getElementById('menu-toggle-ui');
    var burgerDropdown = document.getElementById('burger-dropdown');
    if (!container || !btn) return;
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
        tourBtn.onclick = function() {
            self._tourVisible = !self._tourVisible;
            var btnText = self._tourVisible ? self.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : self.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
            this.innerHTML = `<span class="icon">🗺️</span> <span>${btnText}</span>`;
            self.app.fire('ui:toggleTour', self._tourVisible);
        };
    }

    var navOverlay = document.getElementById('nav-overlay');
    var btnMobMap = document.getElementById('btn-mobile-map');
    var navCloseBtn = document.getElementById('nav-close-btn');
    if (btnMobMap) btnMobMap.onclick = function() { if(navOverlay) navOverlay.style.display = 'flex'; };
    if (navCloseBtn) navCloseBtn.onclick = function() { if(navOverlay) navOverlay.style.display = 'none'; };
    
    var navLevelBtns = document.querySelectorAll('.nav-level-btn');
    navLevelBtns.forEach(function(btn) {
        btn.onclick = function() {
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
        langBtns.forEach(function(lBtn) {
            lBtn.onclick = function(e) {
                self.currentLang = lBtn.dataset.lang;
                if (self.dict[self.currentLang]) {
                    self._applyTranslations();
                    self._applyRTL();
                    self.app.fire('lang:switch', self.currentLang);
                } else {
                    self._loadTranslations(self.currentLang, function() {
                        self.app.fire('lang:switch', self.currentLang);
                    });
                }
            };
        });
    }
    btn.addEventListener('click', function(e) {
        // Exit pointer lock so user can interact with menu
        if (document.pointerLockElement) document.exitPointerLock();
        container.classList.toggle('open');
        if (container.classList.contains('open')) {
            var closeText = (self.currentLang === 'de' ? 'Schließen' : 'Close');
            btn.innerHTML = '<span class="icon">✕</span> <span id="lbl-menu-btn">' + closeText + '</span>';
            btn.classList.add('active');
        } else {
            var menuText = (self.dict && self.dict[self.currentLang] && self.dict[self.currentLang].menuBtn) ? self.dict[self.currentLang].menuBtn : 'Menü';
            btn.innerHTML = '<span class="icon">☰</span> <span id="lbl-menu-btn">' + menuText + '</span>';
            btn.classList.remove('active');
        }
    });
    document.addEventListener('click', function(e) {
        if (!container.contains(e.target)) {
            container.classList.remove('open');
            var menuText = (self.dict && self.dict[self.currentLang] && self.dict[self.currentLang].menuBtn) ? self.dict[self.currentLang].menuBtn : 'Menü';
            btn.innerHTML = '<span class="icon">☰</span> <span id="lbl-menu-btn">' + menuText + '</span>';
            btn.classList.remove('active');
        }
    });
    if (homeBtn) homeBtn.onclick = ()=>{
        this.app.fire('level:switch', 'lemgo');
    };
    if (resetBtn) resetBtn.onclick = ()=>{
        this.app.fire('camera:reset');
    };
    if (helpBtn) {
        helpBtn.onclick = function() {
            var controlsCard = document.getElementById('controls-card');
            if (!controlsCard) return;
            var currentVis = controlsCard.style.display !== 'none';
            controlsCard.style.display = currentVis ? 'none' : 'block';
            self._translateDynamic();
        };
    }
    if (toggleUiBtn) {
        toggleUiBtn.onclick = function() {
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
        mockFps.onclick = function() {
            mockFps.classList.add('active');
            mockFps.style.opacity = '1';
            mockFps.style.color = 'var(--col-cyan)';
            mockDrag.classList.remove('active');
            mockDrag.style.opacity = '0.5';
            mockDrag.style.color = '';
            self.app.fire('controls:setMode', 'fps');
        };
        mockDrag.onclick = function() {
            mockDrag.classList.add('active');
            mockDrag.style.opacity = '1';
            mockDrag.style.color = 'var(--col-cyan)';
            mockFps.classList.remove('active');
            mockFps.style.opacity = '0.5';
            mockFps.style.color = '';
            self.app.fire('controls:setMode', 'drag');
        };
    }

    // --- Culling Toggle ---
    this._cullingEnabled = false;
    var cullingBtn = document.getElementById('menu-culling-toggle');
    if (cullingBtn) {
        cullingBtn.onclick = function() {
            self._cullingEnabled = !self._cullingEnabled;
            var lbl = document.getElementById('lbl-culling');
            if (lbl) {
                lbl.innerText = self._cullingEnabled 
                    ? (self.currentLang === 'de' ? 'Culling: AN' : 'Culling: ON')
                    : (self.currentLang === 'de' ? 'Culling: AUS' : 'Culling: OFF');
            }
            cullingBtn.style.color = self._cullingEnabled ? 'var(--col-cyan)' : '';
            cullingBtn.style.opacity = self._cullingEnabled ? '1' : '0.5';
            self.app.fire('culling:toggle', self._cullingEnabled);
        };
    }

    // --- Culling Distance Slider ---
    var cullSlider = document.getElementById('culling-distance-slider');
    var cullLabel = document.getElementById('lbl-cull-dist');
    if (cullSlider) {
        cullSlider.addEventListener('input', function(e) {
            var val = parseInt(e.target.value) || 70;
            if (cullLabel) {
                cullLabel.innerText = (self.currentLang === 'de' ? 'Culling-Distanz: ' : 'Culling Distance: ') + val + 'm';
            }
            self.app.fire('culling:setDistance', val);
        });
        // Stop propagation to prevent canvas interactions
        ['mousedown', 'touchstart'].forEach(function(ev) {
            cullSlider.addEventListener(ev, function(e) { e.stopPropagation(); });
        });
    }

    // --- Debug Mode Toggle ---
    this._debugEnabled = false;
    var debugBtn = document.getElementById('menu-debug-toggle');
    var colScaleContainer = document.getElementById('collider-scale-container');
    var colScaleSlider = document.getElementById('collider-scale-slider');
    var colScaleLbl = document.getElementById('lbl-col-scale');

    if (debugBtn) {
        debugBtn.onclick = function() {
            self._debugEnabled = !self._debugEnabled;
            debugBtn.style.opacity = self._debugEnabled ? '1' : '0.5';
            debugBtn.style.color = self._debugEnabled ? 'var(--col-cyan)' : '';
            if (colScaleContainer) {
                colScaleContainer.style.display = self._debugEnabled ? 'flex' : 'none';
            }
            // Fire event to toggle debug mode in level-manager + show collider panel
            self.app.fire('debug:menuToggle');
            console.log('[UI] Debug mode:', self._debugEnabled);
        };
    }

    if (colScaleSlider) {
        colScaleSlider.addEventListener('input', function(e) {
            var val = parseFloat(e.target.value) || 1.0;
            if (colScaleLbl) {
                colScaleLbl.innerText = (self.currentLang === 'de' ? 'Collider-Skalierung: ' : 'Collider Scale: ') + val.toFixed(1);
            }
            self.app.fire('collider:setScale', val, val, val);
        });
        ['mousedown', 'touchstart'].forEach(function(ev) {
            colScaleSlider.addEventListener(ev, function(e) { e.stopPropagation(); });
        });
    }

    // --- Screenshot Button ---
    var screenshotBtn = document.getElementById('menu-screenshot');
    if (screenshotBtn) {
        screenshotBtn.onclick = function() {
            self.app.fire('screenshot:take');
        };
    }

    // --- Adaptive Quality Toggle ---
    this._adaptiveEnabled = false;
    var adaptiveBtn = document.getElementById('menu-adaptive-quality');
    if (adaptiveBtn) {
        adaptiveBtn.onclick = function() {
            self._adaptiveEnabled = !self._adaptiveEnabled;
            adaptiveBtn.style.opacity = self._adaptiveEnabled ? '1' : '0.5';
            adaptiveBtn.style.color = self._adaptiveEnabled ? 'var(--col-cyan)' : '';
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
        fullscreenBtn.onclick = function() {
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
        var updateFsLabel = function() {
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
        shortcutsBtn.onclick = function() {
            self._showShortcutsModal();
        };
    }

    // --- FPS Meter Toggle (Standard OFF) ---
    this._fpsMeterEnabled = false;
    var fpsToggleBtn = document.getElementById('menu-fps-toggle');
    var fpsBadge = document.getElementById('fps-counter-badge');
    var fpsValEl = document.getElementById('fps-val');
    var fpsMsEl = document.getElementById('fps-ms');
    var lblFps = document.getElementById('lbl-fps');

    if (fpsToggleBtn) {
        fpsToggleBtn.onclick = function() {
            self._fpsMeterEnabled = !self._fpsMeterEnabled;
            if (fpsBadge) fpsBadge.style.display = self._fpsMeterEnabled ? 'flex' : 'none';
            fpsToggleBtn.style.opacity = self._fpsMeterEnabled ? '1' : '0.5';
            fpsToggleBtn.style.color = self._fpsMeterEnabled ? 'var(--col-cyan)' : '';
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
    this.app.on('update', function(dt) {
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

    var openEditor = function() {
        if (adminModal) adminModal.classList.add('hidden');
        if (editorPanel) {
            editorPanel.style.display = 'flex';
            if (self._populateEditorLevel) self._populateEditorLevel(self._currentLevelId);
        }
        self.app.fire('debug:toggle', true);
        var bContainer = document.getElementById('burger-menu-container');
        if (bContainer) bContainer.classList.remove('open');
    };

    if (adminMenuBtn) {
        adminMenuBtn.onclick = function() {
            if (sessionStorage.getItem('thowl_admin') === '1') {
                openEditor();
            } else {
                if (adminModal) {
                    adminModal.classList.remove('hidden');
                    if (adminPwInput) {
                        adminPwInput.value = '';
                        adminPwInput.focus();
                    }
                    if (adminError) adminError.style.display = 'none';
                }
            }
        };
    }

    if (adminCloseBtn) adminCloseBtn.onclick = function() { if (adminModal) adminModal.classList.add('hidden'); };
    if (adminCancelBtn) adminCancelBtn.onclick = function() { if (adminModal) adminModal.classList.add('hidden'); };

    if (adminForm) {
        adminForm.onsubmit = function(e) {
            e.preventDefault();
            var pw = adminPwInput ? adminPwInput.value.trim() : '';
            if (pw.toLowerCase() === 'kio') {
                sessionStorage.setItem('thowl_admin', '1');
                if (adminError) adminError.style.display = 'none';
                openEditor();
            } else {
                if (adminError) adminError.style.display = 'block';
                if (adminPwInput) {
                    adminPwInput.style.borderColor = 'var(--col-red)';
                    setTimeout(function() { adminPwInput.style.borderColor = ''; }, 1000);
                }
            }
            return false;
        };
    }
};
UI.prototype._initJoystick = function() {
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

    var updateStick = function(touchX, touchY) {
        if (!baseRect) return;
        var dx = touchX - baseCenterX;
        var dy = touchY - baseCenterY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        
        // Clamp to circular radius
        if (dist > maxRadius) {
            dx = (dx / dist) * maxRadius;
            dy = (dy / dist) * maxRadius;
        }
        
        joystickStick.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
        
        // Normalize to [-1, 1]
        var normX = dx / maxRadius;
        var normY = -dy / maxRadius; // Invert Y: up = positive (forward)
        self.app.fire('joystick:move', normX, normY);
    };

    var resetStick = function() {
        joystickStick.style.transform = 'translate(-50%, -50%)';
        self.app.fire('joystick:move', 0, 0);
        activeTouch = null;
    };

    joystickBase.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        if (activeTouch !== null) return; // Already tracking a touch
        var touch = e.changedTouches[0];
        activeTouch = touch.identifier;
        baseRect = joystickBase.getBoundingClientRect();
        baseCenterX = baseRect.left + baseRect.width / 2;
        baseCenterY = baseRect.top + baseRect.height / 2;
        updateStick(touch.clientX, touch.clientY);
    }, { passive: false });

    joystickBase.addEventListener('touchmove', function(e) {
        e.stopPropagation();
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouch) {
                updateStick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                break;
            }
        }
    }, { passive: false });

    var onTouchEnd = function(e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouch) {
                resetStick();
                break;
            }
        }
    };

    joystickBase.addEventListener('touchend', onTouchEnd, { passive: true });
    joystickBase.addEventListener('touchcancel', onTouchEnd, { passive: true });

    console.log('[UI] Mobile joystick initialized');
};
UI.prototype._initSearch = function() {
    var self = this;
    var searchInput = document.getElementById('level-search');
    var searchResults = document.getElementById('search-results');
    if (!searchInput || !searchResults) return;

    // Prevent clicks in search from closing burger menu
    searchInput.addEventListener('click', function(e) { e.stopPropagation(); });
    searchInput.addEventListener('mousedown', function(e) { e.stopPropagation(); });

    searchInput.addEventListener('input', function() {
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

        matches.forEach(function(m) {
            var btn = document.createElement('button');
            btn.className = 'menu-item';
            btn.style.fontSize = '12px';
            btn.style.padding = '6px 12px';
            var modeIcon = m.mode === 'orbit' ? '🌐' : '🏠';
            btn.innerHTML = '<span class="icon">' + modeIcon + '</span> <span>' + m.name + '</span>';
            btn.onclick = function(e) {
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
    searchInput.addEventListener('focus', function() {
        if (document.pointerLockElement) document.exitPointerLock();
    });

    console.log('[UI] Search initialized');
};
UI.prototype._initRealtimeEditor = function() {
    var self = this;
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

        var onDragStart = function(e) {
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

        var onDragMove = function(e) {
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

        var onDragEnd = function() {
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
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            panel.style.display = 'none';
        };
    }

    var minBtn = document.getElementById('ed-min-btn');
    if (minBtn) {
        var isMinimized = false;
        minBtn.onclick = function(e) {
            e.stopPropagation();
            isMinimized = !isMinimized;
            var tabs = panel.querySelector('.ed-tabs');
            var content = panel.querySelector('.ed-tab-content-container');
            if (tabs) tabs.style.display = isMinimized ? 'none' : 'flex';
            if (content) content.style.display = isMinimized ? 'none' : 'flex';
            minBtn.innerText = isMinimized ? '▢' : '—';
        };
    }

    // --- 3. Tab Switching ---
    var tabBtns = panel.querySelectorAll('.ed-tab-btn');
    var tabPanes = panel.querySelectorAll('.ed-tab-pane');
    tabBtns.forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            var targetTab = btn.dataset.tab;
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            tabPanes.forEach(function(p) { p.classList.remove('active'); });
            btn.classList.add('active');
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

    var levelSelect = document.getElementById('ed-level-select');
    var pathTargetSelect = document.getElementById('ed-path-target-level');

    var populateSelect = function(sel, includeEmpty) {
        if (!sel) return;
        sel.innerHTML = '';
        if (includeEmpty) {
            var optNone = document.createElement('option');
            optNone.value = '';
            optNone.innerText = '-- Kein Level-Wechsel --';
            sel.appendChild(optNone);
        }
        levels.forEach(function(lvl) {
            var opt = document.createElement('option');
            opt.value = lvl.id;
            opt.innerText = lvl.name + ' (' + lvl.id + ')';
            sel.appendChild(opt);
        });
    };

    populateSelect(levelSelect, false);
    populateSelect(pathTargetSelect, true);

    if (levelSelect) {
        levelSelect.addEventListener('change', function(e) {
            var lvlId = e.target.value;
            self.app.fire('level:switch', lvlId);
            self._populateEditorLevel(lvlId);
        });
    }

    // --- 5. Step Size Chips ---
    var stepChips = panel.querySelectorAll('.ed-step-chip');
    stepChips.forEach(function(chip) {
        chip.onclick = function(e) {
            e.stopPropagation();
            stepChips.forEach(function(c) { c.classList.remove('active'); });
            chip.classList.add('active');
            self._editorStep = parseFloat(chip.dataset.step) || 0.1;
        };
    });

    // --- 6. Step +/- Buttons ---
    panel.querySelectorAll('.ed-step-btn').forEach(function(btn) {
        btn.onclick = function(e) {
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
    var setupInputGroup = function(prefix, eventName) {
        ['pos', 'rot', 'scale'].forEach(function(type) {
            ['x', 'y', 'z'].forEach(function(axis) {
                var input = document.getElementById('ed-' + prefix + '-' + type + '-' + axis);
                if (input) {
                    input.addEventListener('input', function() {
                        self._applyEditorTransform(prefix, eventName);
                    });
                    input.addEventListener('focus', function() {
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
        insName.addEventListener('input', function(e) {
            if (self._editorActiveObj) {
                self._editorActiveObj.name = e.target.value;
                self._refreshOutlinerTree();
            }
        });
    }

    var setupInspectorTransforms = function() {
        var getNum = function(id) { var el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; };
        var applyTransform = function() {
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
         'ed-ins-scale-x', 'ed-ins-scale-y', 'ed-ins-scale-z'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', applyTransform);
                el.addEventListener('focus', function() {
                    if (document.pointerLockElement) document.exitPointerLock();
                });
            }
        });

        var matColor = document.getElementById('ed-ins-mat-color');
        var matOpacity = document.getElementById('ed-ins-mat-opacity');
        if (matColor) {
            matColor.addEventListener('input', function(e) {
                if (!self._editorActiveObj || !self._editorActiveObj.render) return;
                var hex = e.target.value;
                var r = parseInt(hex.substr(1, 2), 16) / 255;
                var g = parseInt(hex.substr(3, 2), 16) / 255;
                var b = parseInt(hex.substr(5, 2), 16) / 255;
                var mats = self._editorActiveObj.render.meshInstances || [];
                mats.forEach(function(mi) {
                    if (mi.material) {
                        mi.material.diffuse = new pc.Color(r, g, b);
                        mi.material.update();
                    }
                });
            });
        }
        if (matOpacity) {
            matOpacity.addEventListener('input', function(e) {
                if (!self._editorActiveObj || !self._editorActiveObj.render) return;
                var op = parseFloat(e.target.value) || 1.0;
                var mats = self._editorActiveObj.render.meshInstances || [];
                mats.forEach(function(mi) {
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
            focusBtn.onclick = function(e) {
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
            delBtn.onclick = function(e) {
                e.stopPropagation();
                if (!self._editorActiveObj) return;
                if (confirm('Entity "' + self._editorActiveObj.name + '" wirklich löschen?')) {
                    self._editorActiveObj.destroy();
                    self._editorActiveObj = null;
                    self._refreshOutlinerTree();
                }
            };
        }
    };
    setupInspectorTransforms();

    // --- 9. Outliner Tree & Entity Creation ---
    var outlinerSearch = document.getElementById('ed-outliner-search');
    if (outlinerSearch) {
        outlinerSearch.addEventListener('input', function() {
            self._refreshOutlinerTree();
        });
    }

    var addEntityBtn = document.getElementById('ed-outliner-add-btn');
    var addEntityType = document.getElementById('ed-add-entity-type');
    if (addEntityBtn && addEntityType) {
        addEntityBtn.onclick = function(e) {
            e.stopPropagation();
            var type = addEntityType.value;
            var cam = self.app.root.findByName('Camera');
            var pos = cam ? cam.getPosition() : new pc.Vec3();
            var forward = cam ? cam.forward : new pc.Vec3(0, 0, -1);
            var spawnPos = new pc.Vec3(pos.x + forward.x * 2.5, pos.y + forward.y * 2.5, pos.z + forward.z * 2.5);

            var entity = new pc.Entity(type.toUpperCase() + '_' + Date.now().toString().slice(-4));
            entity.setPosition(spawnPos);
            entity.tags.add('custom-editor-object');

            var levelContainer = self.app.root.findByName('LevelContainer') || self.app.root;

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
                        titleEn: 'New Hotspot',
                        description: 'Beschreibung hier eingeben...',
                        descriptionEn: 'Enter description here...',
                        linkUrl: ''
                    }
                });
            } else if (type === 'path') {
                entity.tags.add('custom-editor-path');
                entity.addComponent('script');
                entity.script.create('pathVisualizer', {
                    attributes: {
                        title: 'Neuer Laufweg',
                        color: '#00ff88',
                        width: 0.8,
                        points: [[spawnPos.x, spawnPos.y - 1.5, spawnPos.z]]
                    }
                });
            } else if (type === 'screen') {
                entity.tags.add('custom-editor-media');
                entity.addComponent('render', { type: 'plane' });
                entity.setLocalScale(2.0, 1.125, 1.0);
            }

            levelContainer.addChild(entity);
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
        ambientCol.addEventListener('input', function(e) {
            var hex = e.target.value;
            var r = parseInt(hex.substr(1, 2), 16) / 255;
            var g = parseInt(hex.substr(3, 2), 16) / 255;
            var b = parseInt(hex.substr(5, 2), 16) / 255;
            var intensity = ambientInt ? parseFloat(ambientInt.value) || 1.0 : 1.0;
            self.app.scene.ambientLight = new pc.Color(r * intensity, g * intensity, b * intensity);
        });
    }
    if (ambientInt) {
        ambientInt.addEventListener('input', function(e) {
            if (ambientCol) ambientCol.dispatchEvent(new Event('input'));
        });
    }
    if (splatLodRange && splatLodVal) {
        splatLodRange.addEventListener('input', function(e) {
            splatLodVal.innerText = e.target.value + 'm';
            var dist = parseFloat(e.target.value) || 15;
            var splats = self.app.root.findByTag('gsplat') || [];
            splats.forEach(function(s) {
                if (s.script && s.script.gsplat) s.script.gsplat.lodBaseDistance = dist;
            });
        });
    }

    // --- 11. Multi-Spawnpoint Management ---
    var addSpawnBtn = document.getElementById('ed-add-spawnpoint-btn') || document.getElementById('ed-add-spawn-btn');
    if (addSpawnBtn) {
        addSpawnBtn.onclick = function(e) {
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
        camCaptureBtn.onclick = function(e) {
            e.stopPropagation();
            var playerRig = self.app.root.findByName('Character_Controller');
            var cam = self.app.root.findByName('Camera');
            var pos = playerRig ? playerRig.getPosition() : (cam ? cam.getPosition() : new pc.Vec3());
            var charCtrl = playerRig ? playerRig.script['character-controller'] : null;
            var rx = charCtrl ? charCtrl.pitch : 0;
            var ry = charCtrl ? charCtrl.yaw : 0;

            var setVal = function(id, val) {
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
            setTimeout(function() { camCaptureBtn.innerText = '📸 Aktuelle Kameraposition übernehmen'; }, 1200);
        };
    }

    // --- 12. Laufwege (Walkway / Path Visualizer) Management ---
    var addPathBtn = document.getElementById('ed-add-path-btn');
    if (addPathBtn) {
        addPathBtn.onclick = function(e) {
            e.stopPropagation();
            var pathName = prompt('Name für den neuen Laufweg:', 'Laufweg Campus');
            if (!pathName) return;

            var pathEntity = new pc.Entity(pathName);
            pathEntity.tags.add('custom-editor-path');
            pathEntity.addComponent('script');
            pathEntity.script.create('pathVisualizer', {
                attributes: {
                    title: pathName,
                    color: '#ff3b47',
                    width: 0.6,
                    points: []
                }
            });
            var levelContainer = self.app.root.findByName('LevelContainer') || self.app.root;
            levelContainer.addChild(pathEntity);
            self._refreshPathsList(pathEntity.getGuid());
        };
    }

    var addPathPointBtn = document.getElementById('ed-path-add-point-btn') || document.getElementById('ed-add-path-point-btn');
    if (addPathPointBtn) {
        addPathPointBtn.onclick = function(e) {
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
            if (!pv.points) pv.points = [];
            pv.points.push(pt);
            if (pv.redraw) pv.redraw();

            self._refreshPathPointsUI(pv.points);
            addPathPointBtn.innerText = '✅ Punkt hinzugefügt (' + pv.points.length + ')';
            setTimeout(function() { addPathPointBtn.innerText = '+ Punkt an Kamera'; }, 1000);
        };
    }

    var pathSelectEl = document.getElementById('ed-path-select');
    if (pathSelectEl) {
        pathSelectEl.addEventListener('change', function(e) {
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
                if (colorInp && pv.color) colorInp.value = pv.color;
                var widthInp = document.getElementById('ed-path-width');
                if (widthInp && pv.width) widthInp.value = pv.width;
                self._refreshPathPointsUI(pv.points || []);
            }
        });
    }

    // --- 13. Hotspots & POIs Management ---
    var addPoiBtn = document.getElementById('ed-add-poi-btn');
    if (addPoiBtn) {
        addPoiBtn.onclick = function(e) {
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
                    titleEn: 'New Hotspot',
                    description: 'Beschreibung hier eingeben...',
                    descriptionEn: 'Enter description here...',
                    linkUrl: ''
                }
            });
            var levelContainer = self.app.root.findByName('LevelContainer') || self.app.root;
            levelContainer.addChild(entity);
            self._refreshPoiList(entity.getGuid());
        };
    }

    var addConstBtn = document.getElementById('ed-add-const-btn');
    if (addConstBtn) {
        addConstBtn.onclick = function(e) {
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
                    status: 'In Bearbeitung',
                    progress: 60
                }
            });
            var levelContainer = self.app.root.findByName('LevelContainer') || self.app.root;
            levelContainer.addChild(entity);
            self._refreshPoiList(entity.getGuid());
        };
    }

    var poiSelectEl = document.getElementById('ed-poi-select');
    if (poiSelectEl) {
        poiSelectEl.addEventListener('change', function(e) {
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
        poiDelBtn.onclick = function(e) {
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
        mediaDropzone.onclick = function() { mediaFileInput.click(); };
        mediaFileInput.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var objectUrl = URL.createObjectURL(file);
            if (mediaUrlInput) mediaUrlInput.value = objectUrl;
            var dropText = mediaDropzone.querySelector('div:nth-child(2)');
            if (dropText) dropText.innerText = '✅ ' + file.name;
        };

        mediaDropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            mediaDropzone.style.borderColor = 'var(--col-accent)';
            mediaDropzone.style.background = 'rgba(255, 59, 71, 0.1)';
        });
        mediaDropzone.addEventListener('dragleave', function() {
            mediaDropzone.style.borderColor = '';
            mediaDropzone.style.background = '';
        });
        mediaDropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            mediaDropzone.style.borderColor = '';
            mediaDropzone.style.background = '';
            var file = e.dataTransfer.files[0];
            if (file) {
                var objectUrl = URL.createObjectURL(file);
                if (mediaUrlInput) mediaUrlInput.value = objectUrl;
                var dropText = mediaDropzone.querySelector('div:nth-child(2)');
                if (dropText) dropText.innerText = '✅ ' + file.name;
            }
        });
    }

    if (spawnMediaBtn) {
        spawnMediaBtn.onclick = function(e) {
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

            var levelContainer = self.app.root.findByName('LevelContainer') || self.app.root;
            levelContainer.addChild(screenEntity);
            spawnMediaBtn.innerText = '✅ 3D Screen platziert!';
            setTimeout(function() { spawnMediaBtn.innerText = '✨ Media Screen an Kamera platzieren'; }, 1500);
        };
    }

    // --- 15. Colliders & Netlify Switcher ---
    var colVisToggle = document.getElementById('ed-toggle-col-vis-btn') || document.getElementById('ed-col-vis-toggle');
    if (colVisToggle) {
        colVisToggle.onclick = function(e) {
            e.stopPropagation();
            self.app.fire('collider:toggleVisibility');
        };
    }

    var colSourceSelect = document.getElementById('ed-col-source-select');
    if (colSourceSelect) {
        colSourceSelect.onchange = function(e) {
            self.app.fire('collider:setSource', e.target.value);
        };
    }

    var colScaleSlider = document.getElementById('ed-col-scale-slider');
    var colScaleVal = document.getElementById('ed-col-scale-val');
    if (colScaleSlider) {
        colScaleSlider.addEventListener('input', function(e) {
            var s = parseFloat(e.target.value) || 1.0;
            if (colScaleVal) colScaleVal.innerText = s.toFixed(2);
            self.app.fire('collider:setScale', s, s, s);
        });
    }

    // --- 16. Tour Cam Controls ---
    var cinPlayBtn = document.getElementById('ed-cin-play-btn');
    if (cinPlayBtn) {
        cinPlayBtn.onclick = function(e) {
            e.stopPropagation();
            self.app.fire('tour:toggle');
        };
    }
    var cinSpeed = document.getElementById('ed-cin-speed');
    var cinSpeedVal = document.getElementById('ed-cin-speed-val');
    if (cinSpeed && cinSpeedVal) {
        cinSpeed.addEventListener('input', function(e) {
            cinSpeedVal.innerText = e.target.value + 'x';
        });
    }

    // --- 17. Save, Copy, Download & Reset ---
    var bindSaveBtns = function(id, text) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.onclick = function(e) {
                e.stopPropagation();
                self.app.fire('level:saveConfig');
                btn.innerText = '✅ Gespeichert!';
                setTimeout(function() { btn.innerText = text; }, 1500);
            };
        }
    };
    bindSaveBtns('ed-save-local-btn', '💾 Im Browser speichern (LocalStorage)');
    bindSaveBtns('ed-footer-save-btn', '💾 Speichern');

    var bindCopyBtns = function(id, text) {
        var btn = document.getElementById(id);
        if (btn) {
            btn.onclick = function(e) {
                e.stopPropagation();
                self.app.fire('level:dumpConfig');
                btn.innerText = '📋 JSON Kopiert!';
                setTimeout(function() { btn.innerText = text; }, 1500);
            };
        }
    };
    bindCopyBtns('ed-copy-config-btn', '📋 Konfiguration (JSON) kopieren');
    bindCopyBtns('ed-copy-json-btn', '📋 Konfiguration (JSON) kopieren');
    bindCopyBtns('ed-footer-copy-btn', '📋 Copy JSON');

    var downloadJsonBtn = document.getElementById('ed-download-json-btn');
    if (downloadJsonBtn) {
        downloadJsonBtn.onclick = function(e) {
            e.stopPropagation();
            self.app.fire('level:downloadConfig');
            downloadJsonBtn.innerText = '📥 Heruntergeladen!';
            setTimeout(function() { downloadJsonBtn.innerText = '📥 level-config.json herunterladen'; }, 1500);
        };
    }

    var resetDefaultsBtn = document.getElementById('ed-reset-defaults-btn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.onclick = function(e) {
            e.stopPropagation();
            if (confirm('Möchten Sie alle benutzerdefinierten Änderungen auf Werkseinstellungen zurücksetzen?')) {
                localStorage.removeItem('thowl_custom_levels');
                window.location.reload();
            }
        };
    }

    // --- 18. Listen to Collider App Events ---
    this.app.on('collider:loaded', function(pos, rot, scale) {
        var setVal = function(id, val) {
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

UI.prototype._refreshOutlinerTree = function() {
    var tree = document.getElementById('ed-outliner-tree');
    if (!tree) return;
    tree.innerHTML = '';
    var search = document.getElementById('ed-outliner-search') ? document.getElementById('ed-outliner-search').value.toLowerCase().trim() : '';
    var self = this;

    var getNodeIcon = function(entity) {
        if (entity.name.toLowerCase().indexOf('splat') !== -1 || entity.tags.has('gsplat')) return '🌐';
        if (entity.name.toLowerCase().indexOf('cam') !== -1 || entity.camera) return '🎥';
        if (entity.name.toLowerCase().indexOf('controller') !== -1 || entity.name === 'Character_Controller') return '🏃';
        if (entity.light) return '💡';
        if (entity.script && entity.script.infoHotspot) return '🎯';
        if (entity.script && entity.script.pathVisualizer) return '🚶';
        if (entity.script && entity.script.videoTexture) return '🎬';
        if (entity.script && entity.script.constructionZone) return '🚧';
        if (entity.render) return '📦';
        return '📁';
    };

    var renderNode = function(entity, depth) {
        if (!entity || entity._destroyed) return;
        if (search && entity.name.toLowerCase().indexOf(search) === -1 && depth === 0) {
            var hasMatchingChild = false;
            var checkChildren = function(c) {
                if (c.name.toLowerCase().indexOf(search) !== -1) hasMatchingChild = true;
                c.children.forEach(checkChildren);
            };
            entity.children.forEach(checkChildren);
            if (!hasMatchingChild) return;
        }

        var row = document.createElement('div');
        row.className = 'ed-tree-node' + (self._editorActiveObj === entity ? ' selected' : '');
        row.style.paddingLeft = (depth * 14 + 6) + 'px';

        var icon = getNodeIcon(entity);
        var hasChildren = entity.children && entity.children.length > 0;
        var arrowHtml = hasChildren ? '<span class="ed-tree-arrow">▼</span>' : '<span style="width:14px; display:inline-block;"></span>';
        var eyeClass = entity.enabled ? 'ed-tree-eye' : 'ed-tree-eye disabled';

        row.innerHTML = arrowHtml +
            '<span class="ed-tree-icon">' + icon + '</span>' +
            '<span class="ed-tree-name">' + entity.name + '</span>' +
            '<span class="' + eyeClass + '" title="Ein-/Ausblenden">👁️</span>';

        var eye = row.querySelector('.ed-tree-eye');
        if (eye) {
            eye.onclick = function(e) {
                e.stopPropagation();
                entity.enabled = !entity.enabled;
                self._refreshOutlinerTree();
            };
        }

        row.onclick = function(e) {
            e.stopPropagation();
            self._selectEntity(entity);
        };

        tree.appendChild(row);
        entity.children.forEach(function(child) {
            renderNode(child, depth + 1);
        });
    };

    var rootNode = this.app.root.findByName('LevelContainer') || this.app.root;
    renderNode(rootNode, 0);
};

UI.prototype._selectEntity = function(entity) {
    this._editorActiveObj = entity;
    this._refreshOutlinerTree();

    var tag = document.getElementById('ed-inspector-selected-tag');
    var nameInp = document.getElementById('ed-inspect-name');
    if (tag) tag.innerText = entity ? entity.name : 'Keine Auswahl';
    if (nameInp && entity) nameInp.value = entity.name;

    if (entity) {
        var pos = entity.getLocalPosition();
        var rot = entity.getLocalEulerAngles();
        var scale = entity.getLocalScale();

        var setVal = function(id, val) {
            var el = document.getElementById(id);
            if (el) el.value = typeof val === 'number' ? val.toFixed(3) : val;
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

        this._renderAttributeEditor(entity);
    }
};

UI.prototype._applyEditorTransform = function(prefix, eventName) {
    var getNum = function(id) {
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

UI.prototype._populateEditorLevel = function(levelId) {
    var sel = document.getElementById('ed-level-select');
    if (sel && levelId) sel.value = levelId;

    var levelContainer = this.app.root.findByName('LevelContainer');
    if (!levelContainer) return;

    var splatEntity = levelContainer.findByName('Splat') || levelContainer.findByName('GSplat');
    if (splatEntity) {
        var pos = splatEntity.getLocalPosition();
        var rot = splatEntity.getLocalEulerAngles();
        var scale = splatEntity.getLocalScale();

        var setVal = function(id, val) {
            var el = document.getElementById(id);
            if (el) el.value = val.toFixed(3);
        };
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
};

UI.prototype._addSpawnpointUI = function(spawn) {
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

UI.prototype._refreshPathsList = function(selectedGuid) {
    var select = document.getElementById('ed-path-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Laufweg auswählen --</option>';

    var paths = this.app.root.findByTag('custom-editor-path');
    paths.forEach(function(p) {
        var opt = document.createElement('option');
        opt.value = p.getGuid();
        opt.innerText = p.name;
        if (p.getGuid() === selectedGuid) opt.selected = true;
        select.appendChild(opt);
    });
};

UI.prototype._refreshPathPointsUI = function(points) {
    var list = document.getElementById('ed-path-points-list');
    if (!list) return;
    list.innerHTML = '';
    points.forEach(function(pt, idx) {
        var row = document.createElement('div');
        row.className = 'ed-item-row';
        row.style.fontSize = '10px';
        row.innerHTML = '<span>Punkt #' + (idx + 1) + ' (' + pt.join(', ') + ')</span>';
        list.appendChild(row);
    });
};

UI.prototype._refreshPoiList = function(selectedGuid) {
    var select = document.getElementById('ed-poi-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Hotspot auswählen --</option>';

    var pois = this.app.root.findByTag('custom-editor-poi');
    pois.forEach(function(p) {
        var opt = document.createElement('option');
        opt.value = p.getGuid();
        opt.innerText = p.name;
        if (p.getGuid() === selectedGuid) opt.selected = true;
        select.appendChild(opt);
    });
};
UI.prototype._showShortcutsModal = function() {
    var isDE = this.currentLang === 'de';
    var overlay = document.getElementById('info-modal-overlay');
    var title = document.getElementById('info-title');
    var body = document.getElementById('info-body');
    var link = document.getElementById('info-link');
    if (!overlay || !title || !body) return;

    title.innerText = isDE ? 'Tastenkürzel' : 'Keyboard Shortcuts';
    if (link) link.style.display = 'none';

    var shortcuts = isDE ? [
        { cat: '🚶 Bewegung', items: [
            ['WASD / Pfeiltasten', 'Laufen / Bewegen'],
            ['Shift', 'Schneller laufen'],
            ['Q / E', 'Runter / Hoch (Flugmodus)'],
            ['G (halten)', 'Schwerkraft aus (Fliegen)'],
            ['Mausrad', 'Geschwindigkeit anpassen']
        ]},
        { cat: '🎥 Kamera', items: [
            ['Rechte Maustaste + Ziehen', 'Umsehen'],
            ['1 Finger (Touch)', 'Umsehen (Mobil)'],
            ['Joystick (Touch)', 'Bewegen (Mobil)']
        ]},
        { cat: '🛠 Debug / Tools', items: [
            ['P', 'Debug-Modus ein/aus + Position kopieren'],
            ['C', 'Kollisions-Mesh ein/aus'],
            ['K', 'Culling ein/aus'],
            ['F2', 'Screenshot speichern']
        ]}
    ] : [
        { cat: '🚶 Movement', items: [
            ['WASD / Arrow Keys', 'Walk / Move'],
            ['Shift', 'Run faster'],
            ['Q / E', 'Down / Up (Fly mode)'],
            ['G (hold)', 'Disable gravity (Fly)'],
            ['Mouse Wheel', 'Adjust speed']
        ]},
        { cat: '🎥 Camera', items: [
            ['Right-Click + Drag', 'Look around'],
            ['1 Finger (Touch)', 'Look around (Mobile)'],
            ['Joystick (Touch)', 'Move (Mobile)']
        ]},
        { cat: '🛠 Debug / Tools', items: [
            ['P', 'Toggle debug mode + Copy position'],
            ['C', 'Toggle collision mesh'],
            ['K', 'Toggle culling'],
            ['F2', 'Save screenshot']
        ]}
    ];

    var html = '';
    shortcuts.forEach(function(section) {
        html += '<div style="margin-bottom:16px;"><div style="font-weight:600; color:var(--col-cyan); margin-bottom:8px; font-size:14px;">' + section.cat + '</div>';
        html += '<table style="width:100%; border-collapse:collapse;">';
        section.items.forEach(function(item) {
            html += '<tr><td style="padding:4px 8px; border-bottom:1px solid rgba(255,255,255,0.05);"><kbd style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; font-size:12px; font-family:monospace; border:1px solid rgba(255,255,255,0.15);">' + item[0] + '</kbd></td><td style="padding:4px 8px; color:rgba(255,255,255,0.7); font-size:13px; border-bottom:1px solid rgba(255,255,255,0.05);">' + item[1] + '</td></tr>';
        });
        html += '</table></div>';
    });

    body.innerHTML = html;
    overlay.classList.remove('hidden');
};
UI.prototype._applyTranslations = function() {
    var d = this.dict[this.currentLang];
    var setTxt = (id, txt)=>{
        var el = document.getElementById(id);
        if (el) el.innerText = txt;
    };
    var setTt = (id, txt)=>{
        var el = document.getElementById(id);
        if (el) el.setAttribute('data-tooltip', txt);
    };
    setTxt('lbl-menu-home', d.menuHome);
    setTxt('lbl-menu-reset', d.menuReset);
    setTxt('lbl-menu-imprint', d.menuImprint);
    setTxt('lbl-welcome', d.welcome);
    setTxt('lbl-location-intro', d.locationIntro);
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
UI.prototype._translateDynamic = function() {
    var d = this.dict[this.currentLang];
    var btn = document.getElementById('burger-btn');
    var container = document.getElementById('burger-menu-container');
    if (btn && container) {
        var isOpen = container.classList.contains('open');
        btn.innerHTML = isOpen ? `<span class="icon">✕</span> ${this.currentLang === 'de' ? 'Schließen' : 'Close'}` : `<span class="icon">☰</span> ${d.menuBtn}`;
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
UI.prototype._onLevelSwitchEvent = function(levelId) {
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
    var self = this;
    setTimeout(function() {
        self._updateContent(levelId);
    }, 800);
};
UI.prototype.goBack = function() {
    if (this.history.length === 0) return;
    var lastState = this.history.pop();
    this.isJumpingBack = true;
    this.app.fire('level:switch', lastState.levelId);
    var self = this;
    setTimeout(()=>{
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
    setTimeout(function() {
        self.isJumpingBack = false;
    }, 1000);
};
UI.prototype.updateJumpBackButton = function() {
    if (this.jumpBackBtn) {
        this.jumpBackBtn.style.display = 'flex';
        this.jumpBackBtn.style.opacity = this.history.length > 0 ? '1' : '0.5';
        this.jumpBackBtn.style.pointerEvents = this.history.length > 0 ? 'auto' : 'none';
        this.jumpBackBtn.style.color = this.history.length > 0 ? '#f1c40f' : 'var(--text-secondary)';
    }
};
UI.prototype._updateContent = function(levelId) {
    var data = this._levelData[levelId];
    if (!data) return;
    if (this._prefixEl) this._prefixEl.innerText = this.currentLang === 'de' ? data.prefix_de : data.prefix_en;
    if (this._linkEl) {
        this._linkEl.innerText = this.currentLang === 'de' ? data.name_de : data.name_en;
        this._linkEl.href = data.link;
    }
    
    var logoEl = document.getElementById('header-logo');
    if (!logoEl) {
        logoEl = document.querySelector('.logo');
    }
    if (logoEl) {
        if (levelId === 'detmold') {
            logoEl.src = './kcd.png';
            logoEl.onerror = function() { this.onerror = null; this.src = './public/kcd.png'; };
        } else {
            logoEl.src = './icl.jpg';
            logoEl.onerror = function() { this.onerror = null; this.src = './public/icl.jpg'; };
        }
    }
    var switchText = document.getElementById('switch-campus-text');
    var d = this.dict[this.currentLang];
    if (switchText) {
        switchText.innerText = levelId === 'lemgo' ? d.switchDetmold : d.switchLemgo;
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
                cfg.spawnpoints.forEach(function(sp) {
                    var btn = document.createElement('button');
                    btn.className = 'unified-btn';
                    btn.style.width = '100%';
                    btn.style.justifyContent = 'flex-start';
                    btn.innerHTML = '<span class="icon">📍</span> <span>' + sp.name + '</span>';
                    btn.onclick = function() {
                        var r = sp.rot || [0,0,0];
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
UI.prototype._updateControlsText = function(mode) {
    if (!this._listDesktop || !this._listTouch) return;
    var d = this.dict[this.currentLang];
    if (mode === 'fly') {
        this._listDesktop.innerHTML = d.flyDesktop;
        this._listTouch.innerHTML = d.flyTouch;
    } else {
        this._listDesktop.innerHTML = d.orbitDesktop;
        this._listTouch.innerHTML = d.orbitTouch;
    }
};
UI.prototype._onPresetChanged = function(presetName) {
    this._currentPreset = presetName;
    this._updateButtonStates();
};
UI.prototype._updateButtonStates = function() {
    var self = this;
    this._buttons.forEach(function(btn, quality) {
        if (quality === self._currentPreset) btn.classList.add('active');
        else btn.classList.remove('active');
    });
};
UI.prototype._onUpdateStats = function(rendered) {
    if (this._splatCountEl) {
        var r = rendered >= 1000000 ? (rendered / 1000000).toFixed(2) + 'M' : (rendered / 1000).toFixed(2) + 'K';
        var t = this.totalSplats >= 1000000 ? (this.totalSplats / 1000000).toFixed(2) + 'M' : (this.totalSplats / 1000).toFixed(2) + 'K';
        var separator = this.currentLang === 'de' ? ' von ' : ' of ';
        this._splatCountEl.textContent = 'Splats: ' + r + separator + t;
    }
};
UI.prototype._refreshCustomObjectsList = function() {
    var select = document.getElementById('ed-custom-obj-select');
    if (!select) return;
    var oldVal = select.value;
    select.innerHTML = '<option value="">-- No Object Selected --</option>';
    
    var traverse = function(node) {
        if (node.script) {
            var isCustom = false;
            var prefix = '';
            
            var hasScript = function(name) {
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

UI.prototype._renderAttributeEditor = function(entity) {
    var container = document.getElementById('ed-custom-attrs');
    if (!container) return;
    container.innerHTML = '';
    if (!entity || !entity.script) return;
    
    var scriptDefs = {
        'infoHotspot': ['title', 'description', 'title_en', 'description_en', 'buttonText', 'buttonText_en', 'targetLevelId', 'linkUrl'],
        'pathVisualizer': ['description'],
        'constructionZone': ['title', 'description', 'status', 'progress'],
        'videoTexture': ['videoUrl', 'playAudio', 'volume', 'cullBack', 'videoScale'],
        'splatBlur': ['blurScale', 'blurIntensity']
    };
    
    Object.keys(scriptDefs).forEach(function(scriptName) {
        if (entity.script[scriptName]) {
            var html = '<div style="margin-top:8px; border-top:1px solid rgba(255,255,255,0.1); padding-top:4px;">';
            html += '<div style="color:#ffaa00; font-weight:bold; margin-bottom:4px;">' + scriptName + ' Attributes:</div>';
            scriptDefs[scriptName].forEach(function(attr) {
                var val = entity.script[scriptName][attr];
                if (val === undefined) return;
                html += '<div style="display:flex; margin-bottom:4px; align-items:center;">';
                html += '<div style="width:75px; font-size:9px; color:#aaa; overflow:hidden; text-overflow:ellipsis;" title="' + attr + '">' + attr + '</div>';
                if (typeof val === 'boolean') {
                    html += '<input type="checkbox" id="attr-' + scriptName + '-' + attr + '" ' + (val ? 'checked' : '') + ' style="flex:1;">';
                } else if (typeof val === 'number') {
                    html += '<input type="number" id="attr-' + scriptName + '-' + attr + '" value="' + val + '" step="0.1" style="flex:1; background:rgba(255,255,255,0.1); border:1px solid #555; color:white; font-size:10px; padding:2px;">';
                } else {
                    html += '<input type="text" id="attr-' + scriptName + '-' + attr + '" value="' + val + '" style="flex:1; background:rgba(255,255,255,0.1); border:1px solid #555; color:white; font-size:10px; padding:2px;">';
                }
                html += '</div>';
            });
            html += '</div>';
            container.innerHTML += html;
            
            // Bind events
            setTimeout(function() {
                scriptDefs[scriptName].forEach(function(attr) {
                    var inp = document.getElementById('attr-' + scriptName + '-' + attr);
                    if (inp) {
                        var updateVal = function(e) {
                            e.stopPropagation();
                            var newVal = typeof entity.script[scriptName][attr] === 'boolean' ? inp.checked : (typeof entity.script[scriptName][attr] === 'number' ? parseFloat(inp.value) : inp.value);
                            entity.script[scriptName][attr] = newVal;
                            if (entity.script[scriptName].fire) {
                                entity.script[scriptName].fire('attr:' + attr, newVal, undefined);
                            }
                            // Force refresh visual if it's infoHotspot
                            if (scriptName === 'infoHotspot' && entity.script.infoHotspot.onReveal) {
                                // A trick to re-render the DOM element
                                entity.script.infoHotspot.onReveal();
                            }
                            if (scriptName === 'pathVisualizer' && entity.script.pathVisualizer.updateDomText) {
                                entity.script.pathVisualizer.updateDomText();
                            }
                            if (scriptName === 'constructionZone' && entity.script.constructionZone.createScanlineTexture) {
                                entity.script.constructionZone.createScanlineTexture();
                            }
                        };
                        inp.addEventListener('input', updateVal);
                        inp.addEventListener('change', updateVal);
                        inp.addEventListener('mousedown', function(e) { e.stopPropagation(); });
                        inp.addEventListener('click', function(e) { e.stopPropagation(); });
                        inp.addEventListener('focus', function() {
                            if (document.pointerLockElement) document.exitPointerLock();
                        });
                    }
                });
            }, 10);
        }
    });
};

UI.prototype.onDestroy = function() {
    this.app.off('ui:setPreset', this._onPresetChanged, this);
    this.app.off('ui:updateStats', this._onUpdateStats, this);
    this.app.off('level:switch', this._onLevelSwitchEvent, this);
    if (this.uiContainer && this.uiContainer.parentNode) this.uiContainer.parentNode.removeChild(this.uiContainer);
};
