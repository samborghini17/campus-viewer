import { script } from './playcanvas-stable.min.mjs';

script.createLoadingScreen(function(app) {
    // ------------------------------------------------------------------------
    // CONFIGURATION
    // ------------------------------------------------------------------------
    // REPLACE THIS string with the actual URL or Asset ID of your uploaded logo
    var LOGO_URL = 'https://kreativ.institute/assets/images/kio_logo_long_onwhite.svg';
    // Color Configuration matching KreativInstitut OWL
    var COLOR_BG = '#ffffff'; // White background
    var COLOR_BAR_BG = '#000000'; // Black bar track
    var COLOR_BAR_FILL = '#55ff00'; // Neon KIO Green
    // ------------------------------------------------------------------------
    // CSS STYLES
    // ------------------------------------------------------------------------
    var showSplash = function() {
        // Create the style element
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            body {
                background-color: ${COLOR_BG};
            }

            #application-splash-wrapper {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: ${COLOR_BG};
                z-index: 1000; /* Ensure it stays on top */
            }

            #application-splash {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70%; /* Responsive width */
                max-width: 400px; /* Max width for desktop */
                text-align: center;
            }

            #application-splash img {
                width: 100%;
                height: auto;
                display: block;
                margin-bottom: 20px; /* Space between logo and bar */
            }

            #progress-bar-container {
                width: 100%;
                height: 6px; /* Height of the progress bar */
                background-color: ${COLOR_BAR_BG};
                position: relative;
                overflow: hidden;
                border-radius: 4px; /* Slight rounding for polish */
            }

            #progress-bar {
                width: 0%;
                height: 100%;
                background-color: ${COLOR_BAR_FILL};
                transition: width 0.1s ease-out; /* Smooth movement */
            }
        `;
        document.head.appendChild(style);
        // --------------------------------------------------------------------
        // HTML STRUCTURE
        // --------------------------------------------------------------------
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        var logo = document.createElement('img');
        logo.src = LOGO_URL;
        logo.alt = 'KreativInstitut OWL';
        splash.appendChild(logo);
        var barContainer = document.createElement('div');
        barContainer.id = 'progress-bar-container';
        splash.appendChild(barContainer);
        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        barContainer.appendChild(bar);
    };
    var hideSplash = function() {
        var wrapper = document.getElementById('application-splash-wrapper');
        if (wrapper) {
            wrapper.parentElement.removeChild(wrapper);
        }
    };
    var setProgress = function(value) {
        var bar = document.getElementById('progress-bar');
        if (bar) {
            // value is between 0 and 1
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };
    // ------------------------------------------------------------------------
    // EVENT LISTENERS
    // ------------------------------------------------------------------------
    app.on('preload:start', showSplash);
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});
