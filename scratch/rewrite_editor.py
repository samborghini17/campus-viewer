import re

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\js\esm-scripts\ui\ui.mjs', 'r', encoding='utf-8') as f:
    c = f.read()

start_idx = c.find('UI.prototype._initRealtimeEditor = function() {')
end_idx = c.find('UI.prototype._updateButtonStates = function() {')

if start_idx != -1 and end_idx != -1:
    new_editor = '''UI.prototype._initRealtimeEditor = function() {
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
            panel.style.left = (initialLeft + dx) + 'px';
            panel.style.top = (initialTop + dy) + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        var onDragEnd = function() { isDragging = false; };

        header.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        header.addEventListener('touchstart', onDragStart, {passive: false});
        document.addEventListener('touchmove', onDragMove, {passive: false});
        document.addEventListener('touchend', onDragEnd);
    }

    // Controls
    var closeBtn = document.getElementById('ed-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', function() { panel.style.display = 'none'; });

    var adminBtn = document.getElementById('menu-admin-editor');
    if (adminBtn) adminBtn.addEventListener('click', function() { 
        panel.style.display = 'flex'; 
        self._refreshOutliner();
    });

    // --- 2. Advanced PlayCanvas Outliner & Inspector ---
    this._refreshOutliner = function() {
        var treeContainer = document.getElementById('ed-entity-tree');
        if (!treeContainer) return;
        treeContainer.innerHTML = '';
        
        // Build recursive tree
        var buildNode = function(entity, parentEl) {
            var el = document.createElement('div');
            el.style.paddingLeft = '10px';
            el.style.marginTop = '2px';
            
            var label = document.createElement('div');
            label.className = 'ed-tree-node';
            label.style.cursor = 'pointer';
            label.style.padding = '2px 4px';
            label.style.borderRadius = '4px';
            
            var icon = '??';
            if (entity.name === 'Root') icon = '??';
            if (entity.name === 'lemgo' || entity.name === 'laufwege') icon = '???';
            if (entity.script && entity.script.infoHotspot) icon = '??';
            if (entity.script && entity.script.mediaScreen) icon = '??';
            if (entity.camera) icon = '??';
            
            label.innerText = icon + ' ' + entity.name;
            
            label.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.ed-tree-node').forEach(n => n.style.background = 'transparent');
                label.style.background = 'var(--col-accent-glow)';
                self._inspectEntity(entity);
            });
            
            el.appendChild(label);
            parentEl.appendChild(el);
            
            entity.children.forEach(function(child) {
                buildNode(child, el);
            });
        };
        
        buildNode(self.app.root, treeContainer);
    };

    this._inspectEntity = function(entity) {
        self._editorActiveObj = entity;
        var inspector = document.getElementById('ed-inspector-container');
        if (!inspector) return;
        
        inspector.innerHTML = '<div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: var(--text-bright); border-bottom: 1px solid var(--border-glass); padding-bottom: 4px;">?? Inspector: ' + entity.name + '</div>';
        
        // 1. Transform Block
        var transformHTML = 
            <div style="margin-bottom: 12px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 8px; border: 1px solid var(--border-glass);">
                <div style="font-weight: bold; font-size: 11px; color: var(--col-cyan); margin-bottom: 8px;">?? TRANSFORM</div>
                <div style="display:flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 10px; width: 40px;">POS</span>
                    <input id="ed-px" type="number" step="0.1" value="\" class="ed-input" style="width: 40px;">
                    <input id="ed-py" type="number" step="0.1" value="\" class="ed-input" style="width: 40px;">
                    <input id="ed-pz" type="number" step="0.1" value="\" class="ed-input" style="width: 40px;">
                </div>
                <div style="display:flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 10px; width: 40px;">ROT</span>
                    <input id="ed-rx" type="number" step="1" value="\" class="ed-input" style="width: 40px;">
                    <input id="ed-ry" type="number" step="1" value="\" class="ed-input" style="width: 40px;">
                    <input id="ed-rz" type="number" step="1" value="\" class="ed-input" style="width: 40px;">
                </div>
                <div style="display:flex; justify-content: space-between;">
                    <span style="font-size: 10px; width: 40px;">SCL</span>
                    <input id="ed-sx" type="number" step="0.1" value="\" class="ed-input" style="width: 40px;">
                    <input id="ed-sy" type="number" step="0.1" value="\" class="ed-input" style="width: 40px;">
                    <input id="ed-sz" type="number" step="0.1" value="\" class="ed-input" style="width: 40px;">
                </div>
            </div>
        ;
        inspector.innerHTML += transformHTML;

        // Script Detection
        if (entity.script) {
            // INFO HOTSPOT
            if (entity.script.infoHotspot) {
                var hs = entity.script.infoHotspot;
                inspector.innerHTML += 
                <div style="margin-bottom: 12px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 8px; border: 1px solid var(--border-glass);">
                    <div style="font-weight: bold; font-size: 11px; color: var(--col-red); margin-bottom: 8px;">?? INFO HOTSPOT SCRIPT</div>
                    <div style="margin-bottom: 6px;"><span style="font-size:10px;">Type:</span><input id="ed-hs-type" type="text" value="\" class="ed-input" style="width:100%; margin-top:2px;"></div>
                    <div style="margin-bottom: 6px;"><span style="font-size:10px;">Title:</span><input id="ed-hs-title" type="text" value="\" class="ed-input" style="width:100%; margin-top:2px;"></div>
                    <div style="margin-bottom: 6px;"><span style="font-size:10px;">Target Level:</span><input id="ed-hs-level" type="text" value="\" class="ed-input" style="width:100%; margin-top:2px;"></div>
                    <div style="margin-bottom: 6px;"><span style="font-size:10px;">Target View:</span><input id="ed-hs-view" type="text" value="\" class="ed-input" style="width:100%; margin-top:2px;"></div>
                    <button id="ed-hs-save" class="unified-btn" style="width: 100%; margin-top: 8px;">?? Skript Speichern</button>
                </div>
                ;
            }
            
            // LEVEL MANAGER
            if (entity.script.levelManager) {
                inspector.innerHTML += 
                <div style="margin-bottom: 12px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 8px; border: 1px solid var(--border-glass);">
                    <div style="font-weight: bold; font-size: 11px; color: var(--col-accent); margin-bottom: 8px;">?? LEVEL MANAGER SCRIPT</div>
                    <p style="font-size: 10px;">Managed in config.json. Use JSON export to save changes permanently.</p>
                </div>
                ;
            }
        }
        
        // Add Live Event Listeners
        var bindInput = function(id, callback) {
            var input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', callback);
                input.addEventListener('input', callback);
            }
        };

        var updateTransform = function() {
            var px = parseFloat(document.getElementById('ed-px').value);
            var py = parseFloat(document.getElementById('ed-py').value);
            var pz = parseFloat(document.getElementById('ed-pz').value);
            var rx = parseFloat(document.getElementById('ed-rx').value);
            var ry = parseFloat(document.getElementById('ed-ry').value);
            var rz = parseFloat(document.getElementById('ed-rz').value);
            var sx = parseFloat(document.getElementById('ed-sx').value);
            var sy = parseFloat(document.getElementById('ed-sy').value);
            var sz = parseFloat(document.getElementById('ed-sz').value);
            
            entity.setLocalPosition(px, py, pz);
            entity.setLocalEulerAngles(rx, ry, rz);
            entity.setLocalScale(sx, sy, sz);
        };

        bindInput('ed-px', updateTransform); bindInput('ed-py', updateTransform); bindInput('ed-pz', updateTransform);
        bindInput('ed-rx', updateTransform); bindInput('ed-ry', updateTransform); bindInput('ed-rz', updateTransform);
        bindInput('ed-sx', updateTransform); bindInput('ed-sy', updateTransform); bindInput('ed-sz', updateTransform);

        // Script bindings
        var saveHs = document.getElementById('ed-hs-save');
        if (saveHs) {
            saveHs.addEventListener('click', function() {
                if (entity.script && entity.script.infoHotspot) {
                    entity.script.infoHotspot.type = document.getElementById('ed-hs-type').value;
                    entity.script.infoHotspot.titleText = document.getElementById('ed-hs-title').value;
                    entity.script.infoHotspot.targetLevel = document.getElementById('ed-hs-level').value;
                    entity.script.infoHotspot.targetView = document.getElementById('ed-hs-view').value;
                    if(entity.script.infoHotspot.updateMaterials) entity.script.infoHotspot.updateMaterials();
                    
                    // Show success
                    saveHs.innerText = '? Gespeichert!';
                    setTimeout(() => saveHs.innerText = '?? Skript Speichern', 1500);
                }
            });
        }
    };
};
'''
    c = c[:start_idx] + new_editor + c[end_idx:]
    with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\js\esm-scripts\ui\ui.mjs', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Rewrote _initRealtimeEditor successfully!")
else:
    print("Could not find start or end index")
