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
    this._tourVisible = true;
    this._lastSwitchTime = 0;
    this.history = [];
    this.isJumpingBack = false;
    this.currentLang = 'de';
    this._levelData = {
        'lemgo': {
            prefix_de: 'auf dem',
            name_de: 'Lemgoer Campus',
            prefix_en: 'at',
            name_en: 'Lemgo Campus',
            link: 'https://www.icl-owl.de/',
            mode: 'orbit'
        },
        'detmold': {
            prefix_de: 'auf dem',
            name_de: 'Detmolder Campus',
            prefix_en: 'at',
            name_en: 'Detmold Campus',
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
            welcome: 'Willkommen zum interaktiven Campus der TH OWL',
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
            flyDesktop: '<li><b>WASD / Pfeile</b>: Laufen / Fliegen</li><li><b>Q / E</b>: Runter / Hoch</li><li>• <b>Shift</b>: Schneller</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">• <b>Maus (Ziehen)</b>: Umsehen (Kopf drehen)</li>',
            flyTouch: '<li>• <b>1 Finger</b>: Umsehen</li><li>• <b>2 Finger</b>: Vorwärts laufen</li>',
            orbitDesktop: '<li><b>Linke Taste</b> Drehen (Orbit)</li><li><b>Mausrad</b> Zoomen</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">• <b>WASD</b>: Frei bewegen (Pan)</li><li>• <b>Q/E</b>: Runter/Hoch</li><li>• <b>Shift</b>: Schneller</li>',
            orbitTouch: '<li>• <b>1 Finger</b> Drehen</li><li>• <b>2 Finger</b> Zoom/Pan</li>'
        },
        en: {
            menuBtn: 'Menu',
            menuHome: 'To Start (Lemgo)',
            menuHelpOn: 'Show Controls',
            menuHelpOff: 'Hide Controls',
            menuUiOn: 'Show UI',
            menuUiOff: 'Hide UI',
            menuReset: 'Reset Camera',
            menuImprint: 'Imprint',
            menuBack: 'Jump Back',
            menuToggleControl: 'Controls: Drag/Orbit',
            welcome: 'Welcome to the interactive campus of TH OWL',
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
            flyDesktop: '<li><b>WASD / Arrows</b>: Walk / Fly</li><li><b>Q / E</b>: Down / Up</li><li>• <b>Shift</b>: Faster</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">• <b>Mouse (Drag)</b>: Look around</li>',
            flyTouch: '<li>• <b>1 Finger</b>: Look around</li><li>• <b>2 Finger</b>: Walk forward</li>',
            orbitDesktop: '<li><b>Left Click</b> Rotate (Orbit)</li><li><b>Mouse Wheel</b> Zoom</li><li style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.1);">• <b>WASD</b>: Move freely (Pan)</li><li>• <b>Q/E</b>: Down/Up</li><li>• <b>Shift</b>: Faster</li>',
            orbitTouch: '<li>• <b>1 Finger</b> Rotate</li><li>• <b>2 Finger</b> Zoom/Pan</li>'
        }
    };
    if (this.cssAsset) {
        var style = document.createElement('style');
        style.textContent = this.cssAsset.resource;
        document.head.appendChild(style);
    }
    if (this.htmlAsset) {
        this.uiContainer.innerHTML = this.htmlAsset.resource;
        document.body.appendChild(this.uiContainer);
        this._initElements();
        this._initBurgerMenu();
        this._updateButtonStates();
        this._applyTranslations();
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
    var langBtn = document.getElementById('menu-lang');
    var homeBtn = document.getElementById('menu-home');
    var helpBtn = document.getElementById('menu-help');
    var resetBtn = document.getElementById('menu-reset');
    var toggleUiBtn = document.getElementById('menu-toggle-ui');
    var burgerDropdown = document.getElementById('burger-dropdown');
    if (!container || !btn) return;
    this.jumpBackBtn = document.createElement('button');
    this.jumpBackBtn.className = 'menu-item';
    this.jumpBackBtn.innerHTML = `<span class="icon">⬅</span> <span id="lbl-menu-back">${this.dict[this.currentLang].menuBack}</span>`;
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
        tourBtn.innerHTML = `<span>🗺️</span> ${initText}`;
        if (resetBtn) resetBtn.parentNode.insertBefore(tourBtn, resetBtn);
        else if (burgerDropdown) burgerDropdown.appendChild(tourBtn);
        tourBtn.onclick = function() {
            self._tourVisible = !self._tourVisible;
            var btnText = self._tourVisible ? self.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : self.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
            this.innerHTML = `<span>🗺️</span> ${btnText}`;
            self.app.fire('ui:toggleTour', self._tourVisible);
        };
    }

    this.ctrlModeBtn = document.getElementById('menu-ctrl-toggle');
    if (!this.ctrlModeBtn) {
        this.ctrlModeBtn = document.createElement('button');
        this.ctrlModeBtn.id = 'menu-ctrl-toggle';
        this.ctrlModeBtn.className = 'menu-item';
        this._isDragMode = false;
        var ctrlText = self.dict[self.currentLang].menuToggleControl;
        this.ctrlModeBtn.innerHTML = `<span>🕹️</span> ${ctrlText}`;
        
        if (resetBtn) resetBtn.parentNode.insertBefore(this.ctrlModeBtn, resetBtn);
        else if (burgerDropdown) burgerDropdown.appendChild(this.ctrlModeBtn);

        this.ctrlModeBtn.onclick = function() {
            self._isDragMode = !self._isDragMode;
            var mode = self._isDragMode ? 'drag' : 'joystick';
            self.app.fire('controls:setMode', mode);
            
            var newText = self.currentLang === 'de' ? 
                (self._isDragMode ? 'Steuerung: Joystick' : 'Steuerung: Drag/Orbit') : 
                (self._isDragMode ? 'Controls: Joystick' : 'Controls: Drag/Orbit');
            this.innerHTML = `<span>🕹️</span> ${newText}`;
        };
    }

    if (langBtn) {
        langBtn.onclick = function(e) {
            self.currentLang = self.currentLang === 'de' ? 'en' : 'de';
            self._applyTranslations();
            self.app.fire('lang:switch', self.currentLang);
        };
    }
    btn.addEventListener('click', function(e) {
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
            mockDrag.classList.remove('active');
            mockDrag.style.opacity = '0.5';
            self.app.fire('controls:setMode', 'joystick');
        };
        mockDrag.onclick = function() {
            mockDrag.classList.add('active');
            mockDrag.style.opacity = '1';
            mockFps.classList.remove('active');
            mockFps.style.opacity = '0.5';
            self.app.fire('controls:setMode', 'drag');
        };
    }
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
        helpBtn.innerHTML = isVis ? `<span>✕</span> ${d.menuHelpOff}` : `<span>🕹️</span> ${d.menuHelpOn}`;
    }
    var uiBtn = document.getElementById('menu-toggle-ui');
    if (uiBtn) {
        uiBtn.innerHTML = this._uiVisible ? `<span>👁️</span> ${d.menuUiOff}` : `<span>👁️‍🗨️</span> ${d.menuUiOn}`;
    }
    var tourBtn = document.getElementById('menu-tour-toggle');
    if (tourBtn) {
        var btnText = this._tourVisible ? this.currentLang === 'de' ? 'Tour ausblenden' : 'Hide Tour' : this.currentLang === 'de' ? 'Tour einblenden' : 'Show Tour';
        tourBtn.innerHTML = `<span>🗺️</span> ${btnText}`;
    }

    var ctrlBtn = document.getElementById('menu-ctrl-toggle');
    if (ctrlBtn) {
        var newText = this.currentLang === 'de' ? 
            (this._isDragMode ? 'Steuerung: Joystick' : 'Steuerung: Drag/Orbit') : 
            (this._isDragMode ? 'Controls: Joystick' : 'Controls: Drag/Orbit');
        ctrlBtn.innerHTML = `<span>🕹️</span> ${newText}`;
    }
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
        tourBtn.innerHTML = `<span>🗺️</span> ${btnText}`;
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
UI.prototype.onDestroy = function() {
    this.app.off('ui:setPreset', this._onPresetChanged, this);
    this.app.off('ui:updateStats', this._onUpdateStats, this);
    this.app.off('level:switch', this._onLevelSwitchEvent, this);
    if (this.uiContainer && this.uiContainer.parentNode) this.uiContainer.parentNode.removeChild(this.uiContainer);
};
