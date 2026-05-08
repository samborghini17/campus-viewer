var LayoutTool = pc.createScript('layoutTool');

LayoutTool.attributes.add('targetSplat', { type: 'entity', title: 'Main Splat' });
LayoutTool.attributes.add('cameraEnt', { type: 'entity', title: 'Camera' });

LayoutTool.prototype.initialize = function() {
    this.createUI();
    this.mode = 'splat';
    this.app.on('update', () => this.onUpdate());
};

LayoutTool.prototype.createUI = function() {
    const style = `
        position: fixed; top: 10px; left: 10px; width: 280px;
        background: rgba(0, 0, 0, 0.85); color: #ddd; font-family: monospace;
        padding: 12px; border-radius: 4px; border: 1px solid #555; z-index: 10000;
        display: flex; flex-direction: column; gap: 8px; font-size: 11px;
    `;

    this.panel = document.createElement('div');
    this.panel.style.cssText = style;
    this.panel.innerHTML = `
        <div style="font-weight:bold; color:#fc0; border-bottom:1px solid #555; padding-bottom:4px;">LAYOUT TOOL</div>
        
        <div style="display:flex; gap:10px;">
            <label><input type="radio" name="lt_mode" value="splat" checked> Edit Splat</label>
            <label><input type="radio" name="lt_mode" value="cam"> Read Camera</label>
        </div>

        <div id="lt_controls"></div>

        <button id="lt_copy" style="background:#4CAF50; border:none; padding:8px; color:white; cursor:pointer; font-weight:bold; margin-top:5px;">COPY DATA</button>
        <div id="lt_status" style="color:#aaa; text-align:center;">Ready</div>
    `;
    document.body.appendChild(this.panel);

    this.inputs = {};
    this.createInputs();

    this.panel.querySelectorAll('input[name="lt_mode"]').forEach(r => {
        r.addEventListener('change', (e) => { this.mode = e.target.value; });
    });
    this.panel.querySelector('#lt_copy').addEventListener('click', () => this.copyToClipboard());
};

LayoutTool.prototype.createInputs = function() {
    const container = this.panel.querySelector('#lt_controls');
    const axes = ['x', 'y', 'z'];
    
    const createRow = (label, idPrefix, step) => {
        const row = document.createElement('div');
        row.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;";
        row.innerHTML = `<span style="width:30px;">${label}</span>`;
        
        axes.forEach(axis => {
            const inp = document.createElement('input');
            inp.type = 'number';
            inp.step = step;
            inp.style.cssText = "width:50px; background:#333; color:white; border:1px solid #555;";
            inp.id = `${idPrefix}_${axis}`;
            
            inp.addEventListener('input', () => {
                if(this.mode === 'splat') this.applyToSplat();
            });
            
            this.inputs[`${idPrefix}_${axis}`] = inp;
            row.appendChild(inp);
        });
        container.appendChild(row);
    };

    createRow('POS', 'pos', 0.1);
    createRow('ROT', 'rot', 1.0);
};

LayoutTool.prototype.onUpdate = function() {
    // 1. Camera Mode: Read-Only (zeigt wo du gerade bist)
    if (this.mode === 'cam' && this.cameraEnt) {
        const p = this.cameraEnt.getPosition(); 
        const r = this.cameraEnt.getEulerAngles(); 
        this.updateFields(p, r);
    }
    // 2. Splat Mode: Read values (falls sich was ändert), aber nicht überschreiben beim Tippen
    else if (this.mode === 'splat' && this.targetSplat) {
        if (document.activeElement.tagName !== 'INPUT') {
            const p = this.targetSplat.getLocalPosition();
            const r = this.targetSplat.getLocalEulerAngles();
            this.updateFields(p, r);
        }
    }
};

LayoutTool.prototype.updateFields = function(p, r) {
    const set = (k, v) => this.inputs[k].value = v.toFixed(2);
    set('pos_x', p.x); set('pos_y', p.y); set('pos_z', p.z);
    set('rot_x', r.x); set('rot_y', r.y); set('rot_z', r.z);
};

LayoutTool.prototype.applyToSplat = function() {
    if (!this.targetSplat) return;
    const get = (k) => parseFloat(this.inputs[k].value) || 0;
    
    this.targetSplat.setLocalPosition(get('pos_x'), get('pos_y'), get('pos_z'));
    this.targetSplat.setLocalEulerAngles(get('rot_x'), get('rot_y'), get('rot_z'));
};

LayoutTool.prototype.copyToClipboard = function() {
    const t = this.mode === 'splat' ? this.targetSplat : this.cameraEnt;
    const p = t.mode === 'splat' ? t.getLocalPosition() : t.getPosition();
    const r = t.getEulerAngles(); // Rotation ist immer Euler

    let text = '';
    if (this.mode === 'splat') {
        text = `splatPos: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}],\n            splatRot: [${r.x.toFixed(0)}, ${r.y.toFixed(0)}, ${r.z.toFixed(0)}],`;
    } else {
        // HIER NEU: Camera Start UND Rotation
        text = `cameraStart: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}],\n            cameraStartRot: [${r.x.toFixed(0)}, ${r.y.toFixed(0)}, ${r.z.toFixed(0)}],`;
    }

    navigator.clipboard.writeText(text).then(() => {
        const stat = this.panel.querySelector('#lt_status');
        stat.innerText = "COPIED! Paste to Manager";
        stat.style.color = "#4CAF50";
        setTimeout(() => { stat.innerText = "Ready"; stat.style.color = "#aaa"; }, 3000);
    });
};