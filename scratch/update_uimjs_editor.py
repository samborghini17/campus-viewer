with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\js\esm-scripts\ui\ui.mjs', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''        if (entity._isLevelNode && entity.config) {
            container.appendChild(renderField('Level ID', 'string', entity.config.id, function(v) { entity.config.id = v; }));
            container.appendChild(renderField('URL', 'string', entity.config.url, function(v) { entity.config.url = v; }));
            container.appendChild(renderField('Mode', 'string', entity.config.mode, function(v) { entity.config.mode = v; }));
        } else if (entity._isSpawnNode && entity.sp) {'''
replacement = '''        if (entity._isLevelNode && entity.config) {
            container.appendChild(renderField('Level ID', 'string', entity.config.id, function(v) { entity.config.id = v; }));
            container.appendChild(renderField('URL', 'string', entity.config.url, function(v) { entity.config.url = v; }));
            container.appendChild(renderField('Mode', 'string', entity.config.mode, function(v) { entity.config.mode = v; }));
            
            // Culling Bounding Box
            var h4 = document.createElement('h4');
            h4.innerText = 'Culling Box (Crop Campus)';
            h4.style.color = '#ff5555'; h4.style.marginTop = '8px';
            container.appendChild(h4);
            
            if (!entity.config.clipBoxMin) entity.config.clipBoxMin = [-9999, -9999, -9999];
            if (!entity.config.clipBoxMax) entity.config.clipBoxMax = [9999, 9999, 9999];
            
            container.appendChild(renderField('Min X,Y,Z', 'vec3', {x: entity.config.clipBoxMin[0], y: entity.config.clipBoxMin[1], z: entity.config.clipBoxMin[2]}, function(v) { entity.config.clipBoxMin = [v.x, v.y, v.z]; }));
            container.appendChild(renderField('Max X,Y,Z', 'vec3', {x: entity.config.clipBoxMax[0], y: entity.config.clipBoxMax[1], z: entity.config.clipBoxMax[2]}, function(v) { entity.config.clipBoxMax = [v.x, v.y, v.z]; }));

        } else if (entity._isSpawnNode && entity.sp) {'''
if target in c:
    c = c.replace(target, replacement)
else:
    print('Target not found in ui.mjs!')

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\js\esm-scripts\ui\ui.mjs', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated ui.mjs editor')
