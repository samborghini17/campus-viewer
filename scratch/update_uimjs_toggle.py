with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\js\esm-scripts\ui\ui.mjs', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''        themeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var root = document.documentElement;
            root.classList.toggle('theme-light');
            
            var isLight = root.classList.contains('theme-light');
            document.getElementById('icon-theme').innerText = isLight ? '??' : '??';
            document.getElementById('lbl-menu-theme').innerText = isLight ? (self.currentLang === 'de' ? 'Dark Mode' : 'Dark Mode') : (self.currentLang === 'de' ? 'Light Mode' : 'Light Mode');
        });
    }'''
replacement = '''        themeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var root = document.documentElement;
            root.classList.toggle('theme-light');
            
            var isLight = root.classList.contains('theme-light');
            document.getElementById('icon-theme').innerText = isLight ? '??' : '??';
            document.getElementById('lbl-menu-theme').innerText = isLight ? (self.currentLang === 'de' ? 'Dark Mode' : 'Dark Mode') : (self.currentLang === 'de' ? 'Light Mode' : 'Light Mode');
        });
    }
    
    // Mouse Toggle Logic
    window.appSettings = window.appSettings || { indoorMouseOnly: false };
    var mouseBtn = document.getElementById('menu-mouse-toggle');
    if (mouseBtn) {
        mouseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.appSettings.indoorMouseOnly = !window.appSettings.indoorMouseOnly;
            var isMouse = window.appSettings.indoorMouseOnly;
            document.getElementById('lbl-menu-mouse').innerText = isMouse ? 'Indoor: Maus-Steuerung AN' : 'Indoor: Maus-Steuerung AUS';
            
            // Re-apply camera mode if level manager exists
            var lm = self.app.root.findByName('LevelManager');
            if (lm && lm.script && lm.script.levelManager) {
                var lmm = lm.script.levelManager;
                var currentLvl = lmm.getConfigById(lmm.currentLevelId);
                if (currentLvl) {
                    var hasCollider = lmm._dynamicColliderEntity != null || currentLvl.collider != null;
                    lmm.setCameraMode(currentLvl.mode, currentLvl.bounds, hasCollider);
                }
            }
        });
    }'''
if target in c:
    c = c.replace(target, replacement)

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\js\esm-scripts\ui\ui.mjs', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated ui.mjs with mouse toggle')
