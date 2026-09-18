with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249944\1\level-manager.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''    // Cull gsplat children based on squared distance (performance)
    var children = this._levelRoot.children;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.name.indexOf('GSplat') !== -1 || child.tags.has('gsplat') || (child.render && child.render.meshInstances.length > 0)) {
            var childPos = child.getPosition();
            
            // Fast distance check without Math.sqrt
            var dx = childPos.x - camPos.x;
            var dy = childPos.y - camPos.y;
            var dz = childPos.z - camPos.z;
            var distSq = dx*dx + dy*dy + dz*dz;
            
            if (distSq > cullDistSq) {
                if (child.enabled) {
                    child.enabled = false;
                    if (this._culledEntities.indexOf(child) === -1) {
                        this._culledEntities.push(child);
                    }
                }
            } else {
                if (!child.enabled) {
                    child.enabled = true;
                    var idx = this._culledEntities.indexOf(child);
                    if (idx !== -1) this._culledEntities.splice(idx, 1);
                }
            }
        }
    }'''

replacement = '''    // Cull gsplat children based on squared distance (performance) and Bounding Box
    var children = this._levelRoot.children;
    var clipMin = data.clipBoxMin || [-9999, -9999, -9999];
    var clipMax = data.clipBoxMax || [9999, 9999, 9999];

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.name.indexOf('GSplat') !== -1 || child.tags.has('gsplat') || (child.render && child.render.meshInstances.length > 0)) {
            var childPos = child.getPosition();
            
            // 1. AABB Crop Check
            var isOutsideAABB = false;
            if (childPos.x < clipMin[0] || childPos.y < clipMin[1] || childPos.z < clipMin[2] ||
                childPos.x > clipMax[0] || childPos.y > clipMax[1] || childPos.z > clipMax[2]) {
                isOutsideAABB = true;
            }

            // 2. Fast distance check without Math.sqrt
            var dx = childPos.x - camPos.x;
            var dy = childPos.y - camPos.y;
            var dz = childPos.z - camPos.z;
            var distSq = dx*dx + dy*dy + dz*dz;
            
            if (distSq > cullDistSq || isOutsideAABB) {
                if (child.enabled) {
                    child.enabled = false;
                    if (this._culledEntities.indexOf(child) === -1) {
                        this._culledEntities.push(child);
                    }
                }
            } else {
                if (!child.enabled) {
                    child.enabled = true;
                    var idx = this._culledEntities.indexOf(child);
                    if (idx !== -1) this._culledEntities.splice(idx, 1);
                }
            }
        }
    }'''

if target in c:
    c = c.replace(target, replacement)
else:
    print('Target not found in level-manager.js')

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249944\1\level-manager.js', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated level-manager.js with AABB culling')
