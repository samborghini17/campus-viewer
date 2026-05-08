var SceneReveal = pc.createScript('sceneReveal');

// Zeit in Sekunden, bis die Punkte erscheinen sollen
SceneReveal.attributes.add('delay', { type: 'number', default: 2.0, title: 'Delay (Sekunden)' });

SceneReveal.prototype.initialize = function() {
    // Wir warten X Sekunden nach Start, dann feuern wir das Event
    setTimeout(() => {
        this.app.fire('scene:reveal');
        console.log("Revealing POIs...");
    }, this.delay * 1000);
};