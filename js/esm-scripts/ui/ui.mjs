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
            adaptiveOff: 'Auto-Qualität: AUS'
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
            adaptiveOff: 'Auto Quality: OFF'
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
    this.jumpBackBtn = document.createElement('button');
    this.jumpBackBtn.className = 'menu-item';
    this.jumpBackBtn.innerHTML = `<span class="icon">⬅️</span> <span id="lbl-menu-back">${this.dict[this.currentLang].menuBack}</span>`;
    Object.assign(this.jumpBackBtn.style, {
        color: '#f1c40f',
        fontWeight: 'bold',
        display: 'none'
    });
    if (homeBtn && homeBtn.parentNode) homeBtn.parentNode.insertBefore(this.jumpBackBtn, homeBtn.nextSibling);
    else if (burgerDropdown) burgerDropdown.appendChild(this.jumpBackBtn);
    this.jumpBackBtn.onclick = (e)=>{
        self.goBack();
        container.classList.remove('open');
        btn.classList.remove('active');
        this._translateDynamic();
    };
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
    var lvlSelectBtn = document.getElementById('menu-level-select');
    if (!lvlSelectBtn) {
        var lvlContainer = document.createElement('div');
        lvlContainer.className = 'menu-item';
        lvlContainer.style.padding = '0';
        lvlContainer.style.background = 'transparent';
        
        var lvlSelect = document.createElement('select');
        lvlSelect.id = 'menu-level-select';
        lvlSelect.style.width = '100%';
        lvlSelect.style.padding = '6px';
        lvlSelect.style.background = 'rgba(255,255,255,0.05)';
        lvlSelect.style.color = 'white';
        lvlSelect.style.border = 'none';
        lvlSelect.style.borderRadius = '6px';
        lvlSelect.style.outline = 'none';
        lvlSelect.style.cursor = 'pointer';
        
        var defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.text = "🗺️ Campus Auswahl";
        lvlSelect.appendChild(defaultOpt);
        
        lvlContainer.appendChild(lvlSelect);
        if (resetBtn) resetBtn.parentNode.insertBefore(lvlContainer, resetBtn);
        else if (burgerDropdown) burgerDropdown.appendChild(lvlContainer);
        
        // Populate after a short delay to ensure levelManager is ready
        setTimeout(function() {
            var lm = self.app.root.findByName('Camera') ? self.app.root.findByName('Camera').script.cameraControls : null; 
            // Better to find levelManager directly via script registry or scene
            var lmEntity = self.app.root.findByName('LevelManager');
            if (lmEntity && lmEntity.script && lmEntity.script.levelManager) {
                var config = lmEntity.script.levelManager.levelConfig;
                config.forEach(function(lvl) {
                    var opt = document.createElement('option');
                    opt.value = lvl.id;
                    opt.text = lvl.id;
                    lvlSelect.appendChild(opt);
                });
            } else {
                // If the LevelManager is not an entity by name, just get all entities with the script
                var allEnts = self.app.root.find(function(node) { return node.script && node.script.levelManager; });
                if (allEnts.length > 0) {
                    var config = allEnts[0].script.levelManager.levelConfig;
                    config.forEach(function(lvl) {
                        var opt = document.createElement('option');
                        opt.value = lvl.id;
                        opt.text = lvl.id;
                        lvlSelect.appendChild(opt);
                    });
                }
            }
        }, 1000);

        lvlSelect.addEventListener('change', function(e) {
            if(this.value) {
                self.app.fire('level:switch', this.value);
                this.value = "";
                container.classList.remove('open');
                btn.classList.remove('active');
            }
        });
    }

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
            btn.innerHTML = '<span class="icon">✕</span> ' + (self.currentLang === 'de' ? 'Schließen' : 'Close');
            btn.classList.add('active');
        } else {
            btn.innerHTML = '<span class="icon">☰</span> ' + self.dict[self.currentLang].menuBtn;
            btn.classList.remove('active');
        }
    });
    document.addEventListener('click', function(e) {
        if (!container.contains(e.target)) {
            container.classList.remove('open');
            btn.innerHTML = '<span class="icon">☰</span> ' + self.dict[self.currentLang].menuBtn;
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
    var panel = document.createElement('div');
    panel.id = 'realtime-editor-panel';
    Object.assign(panel.style, {
        position: 'fixed', top: '80px', left: '20px',
        width: '320px', background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(0,255,136,0.3)', borderRadius: '8px',
        padding: '12px', fontFamily: 'monospace', fontSize: '11px',
        color: '#00ff88', zIndex: '10001', display: 'none',
        pointerEvents: 'auto', userSelect: 'none',
        maxHeight: '80vh', overflowY: 'auto'
    });

    panel.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">' +
        '<span style="font-weight:bold; color:#ff0; font-size:13px;">🛠 Realtime Level Editor</span>' +
        '<button id="ed-close-btn" style="background:none; border:none; color:#888; cursor:pointer; font-size:16px;">×</button>' +
        '</div>';
    
    // Debug Hotkeys info
    panel.innerHTML += '<div style="font-size: 10px; color: #888; margin-bottom: 12px; line-height: 1.4;">' +
        '<b style="color: #00ff88;">Hotkeys:</b><br>' +
        '<b>P</b>: Toggle Debug | <b>C</b>: Collider Vis | <b>K</b>: Culling | <b>F2</b>: Screenshot<br>' +
        '<b>Numpad 8/2,4/6,7/9,1/3</b>: Transform Collider <i>(+Shift fast)</i>' +
        '</div>';

    // Step size
    panel.innerHTML += '<div style="margin-bottom:12px; display:flex; gap:4px; align-items:center; justify-content:center;">' +
        '<span style="color:#888; font-size:10px;">Step:</span>' +
        '<button class="step-size-btn" data-step="0.01" style="padding:2px 6px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:white;border-radius:3px;cursor:pointer;">0.01</button>' +
        '<button class="step-size-btn active" data-step="0.1" style="padding:2px 6px;border:1px solid rgba(0,255,136,0.5);background:rgba(0,255,136,0.15);color:white;border-radius:3px;cursor:pointer;">0.1</button>' +
        '<button class="step-size-btn" data-step="1" style="padding:2px 6px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:white;border-radius:3px;cursor:pointer;">1.0</button>' +
        '<button class="step-size-btn" data-step="5" style="padding:2px 6px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:white;border-radius:3px;cursor:pointer;">5.0</button>' +
        '</div>';

    var createSection = function(id, title, color) {
        var html = '<div style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">';
        html += '<div style="font-weight:bold; color:' + color + '; margin-bottom:6px;">' + title + '</div>';
        
        ['pos', 'rot'].forEach(function(type) {
            html += '<div style="display:flex; gap:4px; margin-bottom:4px;">';
            html += '<div style="width:24px; color:#888; padding-top:4px;">' + (type === 'pos' ? 'Pos' : 'Rot') + '</div>';
            ['x', 'y', 'z'].forEach(function(axis) {
                html += '<div style="flex:1; display:flex; flex-direction:column; align-items:center;">';
                html += '<span style="color:#888; font-size:9px;">' + axis.toUpperCase() + '</span>';
                html += '<input type="number" id="ed-' + id + '-' + type + '-' + axis + '" value="0" step="0.1" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); border-radius:3px; padding:2px; color:white; font-family:monospace; font-size:10px; text-align:center; outline:none; box-sizing:border-box;">';
                html += '<div style="display:flex; width:100%; gap:2px; margin-top:2px;">';
                html += '<button class="ed-step" data-id="' + id + '" data-type="' + type + '" data-axis="' + axis + '" data-dir="-1" style="flex:1; border:none; background:rgba(255,255,255,0.1); color:white; border-radius:2px; cursor:pointer; font-size:9px;">-</button>';
                html += '<button class="ed-step" data-id="' + id + '" data-type="' + type + '" data-axis="' + axis + '" data-dir="1" style="flex:1; border:none; background:rgba(255,255,255,0.1); color:white; border-radius:2px; cursor:pointer; font-size:9px;">+</button>';
                html += '</div></div>';
            });
            html += '</div>';
        });
        html += '</div>';
        return html;
    };

    panel.innerHTML += createSection('splat', '🌌 Splat (.sog)', '#4488ff');
    panel.innerHTML += createSection('cam', '🎥 Camera Start', '#ffaa00');
    panel.innerHTML += createSection('col', '📦 Collider Mesh', '#ff4444');

    panel.innerHTML += '<div style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">' +
        '<div style="font-weight:bold; color:#00ff88; margin-bottom:6px;">✨ Custom Objects</div>' +
        '<div style="display:flex; gap:4px; margin-bottom:8px;">' +
        '<select id="ed-custom-obj-select" style="flex:1; background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.2); border-radius:3px; padding:4px; font-size:10px;"><option value="">-- No Object Selected --</option></select>' +
        '</div>' +
        '<button id="ed-add-poi" style="flex:1; padding:4px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; border-radius:3px; cursor:pointer;">+ POI</button>' +
        '<button id="ed-add-path" style="flex:1; padding:4px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; border-radius:3px; cursor:pointer;">+ Path</button>' +
        '<button id="ed-add-const" style="flex:1; padding:4px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; border-radius:3px; cursor:pointer;">+ Const</button>' +
        '<button id="ed-add-video" style="flex:1; padding:4px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:white; border-radius:3px; cursor:pointer;">+ Video</button>' +
        '<button id="ed-delete-obj" style="flex:0.8; padding:4px; border:1px solid rgba(255,68,68,0.5); background:rgba(255,68,68,0.15); color:#ff4444; border-radius:3px; cursor:pointer;">🗑️ Del</button>' +
        '</div>' +
        '</div>';
    
    panel.innerHTML += createSection('custom', 'Custom Object Transform', '#00ff88');
    panel.innerHTML += '<div id="ed-custom-attrs" style="margin-top:8px; max-height:250px; overflow-y:auto; padding-right:4px;"></div>';

    // Action Buttons
    panel.innerHTML += '<div style="display:flex; gap:6px; margin-top:16px;">' +
        '<button id="ed-save-btn" style="flex:1;padding:8px;border:1px solid rgba(255,170,0,0.5);background:rgba(255,170,0,0.15);color:#ffaa00;border-radius:4px;cursor:pointer;font-weight:bold;">💾 Save to Disk</button>' +
        '<button id="ed-dump-btn" style="flex:1;padding:8px;border:1px solid rgba(0,255,136,0.5);background:rgba(0,255,136,0.15);color:#00ff88;border-radius:4px;cursor:pointer;font-weight:bold;">📋 Copy JSON</button>' +
        '<button id="ed-col-vis-btn" style="flex:1;padding:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:white;border-radius:4px;cursor:pointer;">👁 Col Vis</button>' +
        '</div>';

    document.body.appendChild(panel);
    
    var closeBtn = document.getElementById('ed-close-btn');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            panel.style.display = 'none';
        };
    }

    this._editorStep = 0.1;

    // Step size buttons
    panel.querySelectorAll('.step-size-btn').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            self._editorStep = parseFloat(btn.dataset.step);
            panel.querySelectorAll('.step-size-btn').forEach(function(b) {
                b.style.border = '1px solid rgba(255,255,255,0.2)';
                b.style.background = 'rgba(255,255,255,0.05)';
            });
            btn.style.border = '1px solid rgba(0,255,136,0.5)';
            btn.style.background = 'rgba(0,255,136,0.15)';
        };
    });

    // Plus/Minus step buttons
    panel.querySelectorAll('.ed-step').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            var id = btn.dataset.id;
            var type = btn.dataset.type;
            var axis = btn.dataset.axis;
            var dir = parseInt(btn.dataset.dir);
            var input = document.getElementById('ed-' + id + '-' + type + '-' + axis);
            if (!input) return;
            var step = type === 'rot' ? Math.max(1, self._editorStep * 10) : self._editorStep;
            input.value = (parseFloat(input.value) + dir * step).toFixed(type === 'rot' ? 1 : 3);
            self._applyRealtimeTransform(id);
        };
    });

    // Input listeners
    ['splat', 'cam', 'col', 'custom'].forEach(function(id) {
        ['pos', 'rot'].forEach(function(type) {
            ['x', 'y', 'z'].forEach(function(axis) {
                var input = document.getElementById('ed-' + id + '-' + type + '-' + axis);
                if (input) {
                    input.addEventListener('input', function() { self._applyRealtimeTransform(id); });
                    input.addEventListener('click', function(e) { e.stopPropagation(); });
                    input.addEventListener('mousedown', function(e) { e.stopPropagation(); });
                    input.addEventListener('focus', function() {
                        if (document.pointerLockElement) document.exitPointerLock();
                    });
                }
            });
        });
    });

    // Save to Disk button
    var saveBtn = document.getElementById('ed-save-btn');
    if (saveBtn) {
        saveBtn.onclick = function(e) {
            e.stopPropagation();
            self.app.fire('level:saveConfig');
            saveBtn.innerText = '⏳ Saving...';
            setTimeout(function() { saveBtn.innerText = '💾 Save to Disk'; }, 1500);
        };
    }

    // Copy JSON dump button
    var dumpBtn = document.getElementById('ed-dump-btn');
    if (dumpBtn) {
        dumpBtn.onclick = function(e) {
            e.stopPropagation();
            self.app.fire('level:dumpConfig');
            dumpBtn.innerText = '✅ JSON Copied!';
            setTimeout(function() { dumpBtn.innerText = '📋 Copy Level JSON'; }, 1500);
        };
    }

    // Visibility toggle
    var visBtn = document.getElementById('ed-col-vis-btn');
    if (visBtn) {
        visBtn.onclick = function(e) {
            e.stopPropagation();
            self.app.fire('collider:toggleVisibility');
        };
    }

    // Toggle Debug UI
    this.app.on('debug:toggle', function(enabled) {
        panel.style.display = enabled ? 'block' : 'none';
        // When opening the panel, populate current camera position automatically
        if (enabled) {
            var playerRig = self.app.root.findByName('Character_Controller');
            var cam = self.app.root.findByName('Camera');
            var pos = playerRig ? playerRig.getPosition() : (cam ? cam.getPosition() : new pc.Vec3());
            var charCtrl = playerRig ? playerRig.script['character-controller'] : null;
            var rx = charCtrl ? charCtrl.pitch : 0;
            var ry = charCtrl ? charCtrl.yaw : 0;
            var rz = 0;
            
            document.getElementById('ed-cam-pos-x').value = pos.x.toFixed(2);
            document.getElementById('ed-cam-pos-y').value = pos.y.toFixed(2);
            document.getElementById('ed-cam-pos-z').value = pos.z.toFixed(2);
            document.getElementById('ed-cam-rot-x').value = rx.toFixed(0);
            document.getElementById('ed-cam-rot-y').value = ry.toFixed(0);
            document.getElementById('ed-cam-rot-z').value = rz.toFixed(0);
            
            self._refreshCustomObjectsList();
        }
    });

    // Populate Collider data when loaded
    this.app.on('collider:loaded', function(pos, rot) {
        document.getElementById('ed-col-pos-x').value = pos.x.toFixed(3);
        document.getElementById('ed-col-pos-y').value = pos.y.toFixed(3);
        document.getElementById('ed-col-pos-z').value = pos.z.toFixed(3);
        document.getElementById('ed-col-rot-x').value = rot.x.toFixed(1);
        document.getElementById('ed-col-rot-y').value = rot.y.toFixed(1);
        document.getElementById('ed-col-rot-z').value = rot.z.toFixed(1);
    });

    // Custom Object Selection Logic
    document.getElementById('ed-custom-obj-select').addEventListener('change', function(e) {
        var objId = e.target.value;
        if (!objId) {
            document.getElementById('ed-custom-attrs').innerHTML = '';
            return;
        }
        var entity = self.app.root.findByGuid(objId);
        if (entity) {
            var pos = entity.getLocalPosition();
            var rot = entity.getLocalEulerAngles();
            document.getElementById('ed-custom-pos-x').value = pos.x.toFixed(3);
            document.getElementById('ed-custom-pos-y').value = pos.y.toFixed(3);
            document.getElementById('ed-custom-pos-z').value = pos.z.toFixed(3);
            document.getElementById('ed-custom-rot-x').value = rot.x.toFixed(1);
            document.getElementById('ed-custom-rot-y').value = rot.y.toFixed(1);
            document.getElementById('ed-custom-rot-z').value = rot.z.toFixed(1);
            self._renderAttributeEditor(entity);
        }
    });

    var spawnCustom = function(type) {
        var entity = new pc.Entity(type + '_' + Math.floor(Math.random() * 10000));
        var camPos = self.app.root.findByName('Camera').getPosition();
        var forward = self.app.root.findByName('Camera').forward;
        entity.setPosition(camPos.x + forward.x * 2, camPos.y + forward.y * 2, camPos.z + forward.z * 2);
        entity.tags.add('custom-editor-object');
        entity.addComponent('script');
        
        if (type === 'POI') {
            entity.script.create('infoHotspot', { attributes: { title: 'New POI' } });
        } else if (type === 'Path') {
            entity.script.create('pathVisualizer', { attributes: { title: 'New Path' } });
        } else if (type === 'Const') {
            entity.script.create('constructionZone', { attributes: { title: 'New Construction' } });
        } else if (type === 'Video') {
            entity.script.create('videoTexture', { attributes: { videoUrl: '', loop: true, autoPlay: true } });
            entity.setLocalScale(2, 1.125, 1);
        }
        self.app.root.findByName('LevelContainer').addChild(entity);
        
        var select = document.getElementById('ed-custom-obj-select');
        var opt = document.createElement('option');
        opt.value = entity.getGuid();
        opt.text = entity.name;
        select.appendChild(opt);
        select.value = opt.value;
        select.dispatchEvent(new Event('change'));
    };
    
    document.getElementById('ed-add-poi').onclick = function() { spawnCustom('POI'); };
    document.getElementById('ed-add-path').onclick = function() { spawnCustom('Path'); };
    document.getElementById('ed-add-const').onclick = function() { spawnCustom('Const'); };
    document.getElementById('ed-add-video').onclick = function() { spawnCustom('Video'); };

    document.getElementById('ed-delete-obj').onclick = function() {
        var objId = document.getElementById('ed-custom-obj-select').value;
        if (!objId) return;
        var entity = self.app.root.findByGuid(objId);
        if (entity) {
            entity.destroy();
            self._refreshCustomObjectsList();
        }
    };

    console.log('[UI] Realtime Editor initialized');
};

UI.prototype._applyRealtimeTransform = function(id) {
    var px = parseFloat(document.getElementById('ed-' + id + '-pos-x').value) || 0;
    var py = parseFloat(document.getElementById('ed-' + id + '-pos-y').value) || 0;
    var pz = parseFloat(document.getElementById('ed-' + id + '-pos-z').value) || 0;
    var rx = parseFloat(document.getElementById('ed-' + id + '-rot-x').value) || 0;
    var ry = parseFloat(document.getElementById('ed-' + id + '-rot-y').value) || 0;
    var rz = parseFloat(document.getElementById('ed-' + id + '-rot-z').value) || 0;
    
    if (id === 'splat') this.app.fire('splat:setTransform', px, py, pz, rx, ry, rz);
    else if (id === 'cam') this.app.fire('camera:setTransform', px, py, pz, rx, ry, rz);
    else if (id === 'col') this.app.fire('collider:setTransform', px, py, pz, rx, ry, rz);
    else if (id === 'custom') {
        var objId = document.getElementById('ed-custom-obj-select').value;
        if (objId) {
            var entity = this.app.root.findByGuid(objId);
            if (entity) {
                entity.setLocalPosition(px, py, pz);
                entity.setLocalEulerAngles(rx, ry, rz);
            }
        }
    }
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
        this.jumpBackBtn.style.display = this.history.length > 0 ? 'flex' : 'none';
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
            logoEl.src = '/kcd.png';
        } else {
            logoEl.src = '/icl.jpg';
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

    // --- Spawnpoints UI ---
    var spContainer = document.getElementById('menu-spawnpoint-container');
    if (!spContainer) {
        spContainer = document.createElement('div');
        spContainer.id = 'menu-spawnpoint-container';
        spContainer.className = 'menu-item';
        spContainer.style.padding = '0';
        spContainer.style.background = 'transparent';
        
        var spSelect = document.createElement('select');
        spSelect.id = 'menu-spawnpoint-select';
        spSelect.style.width = '100%';
        spSelect.style.padding = '6px';
        spSelect.style.background = 'rgba(255,255,255,0.05)';
        spSelect.style.color = 'var(--col-cyan)';
        spSelect.style.border = 'none';
        spSelect.style.borderRadius = '6px';
        spSelect.style.outline = 'none';
        spSelect.style.cursor = 'pointer';
        
        spContainer.appendChild(spSelect);
        
        var lvlSelectBtn = document.getElementById('menu-level-select');
        if (lvlSelectBtn && lvlSelectBtn.parentNode) {
            lvlSelectBtn.parentNode.parentNode.insertBefore(spContainer, lvlSelectBtn.parentNode.nextSibling);
        } else {
            var bDropdown = document.getElementById('burger-dropdown');
            if (bDropdown) bDropdown.appendChild(spContainer);
        }

        var self = this;
        spSelect.addEventListener('change', function(e) {
            if(this.value) {
                var parts = this.value.split('|');
                var pos = [parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2])];
                var rot = [parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5])];
                var lmEnt = self.app.root.findByName('LevelManager');
                if (lmEnt && lmEnt.script && lmEnt.script.levelManager) {
                    lmEnt.script.levelManager.jumpToSpawnpoint(pos, rot);
                }
                this.value = "";
                var bContainer = document.getElementById('burger-menu-container');
                var bBtn = document.getElementById('burger-btn');
                if (bContainer) bContainer.classList.remove('open');
                if (bBtn) bBtn.classList.remove('active');
            }
        });
    }

    // Populate Spawnpoints if they exist
    var lmEntity = this.app.root.findByName('LevelManager');
    if (lmEntity && lmEntity.script && lmEntity.script.levelManager) {
        var cfg = lmEntity.script.levelManager.getConfigById(levelId);
        var spSelect = document.getElementById('menu-spawnpoint-select');
        if (spSelect) {
            spSelect.innerHTML = '';
            if (cfg && cfg.spawnpoints && cfg.spawnpoints.length > 0) {
                var def = document.createElement('option');
                def.value = "";
                def.text = "📍 " + (this.currentLang === 'de' ? 'Orte im Raum' : 'Locations');
                spSelect.appendChild(def);
                cfg.spawnpoints.forEach(function(sp) {
                    var opt = document.createElement('option');
                    var r = sp.rot || [0,0,0];
                    opt.value = sp.pos.join('|') + '|' + r.join('|');
                    opt.text = sp.name;
                    spSelect.appendChild(opt);
                });
                spContainer.style.display = 'block';
            } else {
                spContainer.style.display = 'none';
            }
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
