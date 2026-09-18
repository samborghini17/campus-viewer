with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249953\1\ui.html', 'r', encoding='utf-8') as f:
    c = f.read()

target_menu = '''        <!-- Burger Menu Section -->
        <div class="menu-section">
            <h4>Einstellungen</h4>
            <div class="menu-item toggle-item">
                <span>Light Mode</span>
                <div class="toggle-switch" id="theme-toggle">
                    <div class="toggle-thumb"></div>
                </div>
            </div>
        </div>'''
replacement_menu = '''        <!-- Burger Menu Section -->
        <div class="menu-section">
            <h4>Einstellungen</h4>
            <div class="menu-item toggle-item">
                <span>Light Mode</span>
                <div class="toggle-switch" id="theme-toggle">
                    <div class="toggle-switch-thumb"></div>
                </div>
            </div>
            <div class="menu-item toggle-item">
                <span title="Indoor-Steuerung auf Maus-Only (Orbit) umstellen">Maus-Steuerung (Indoor)</span>
                <div class="toggle-switch" id="mouse-control-toggle">
                    <div class="toggle-switch-thumb"></div>
                </div>
            </div>
        </div>'''
if target_menu in c:
    c = c.replace(target_menu, replacement_menu)

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249953\1\ui.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated ui.html with toggle')
