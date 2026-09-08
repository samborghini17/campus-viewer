with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249953\1\ui.html', 'r', encoding='utf-8') as f:
    c = f.read()

target_btn = '<button id="burger-btn" aria-label="Menü">'
replacement_btn = '<button id="burger-btn" aria-label="Menü" style="z-index: 999999 !important; position: relative;">'
if target_btn in c:
    c = c.replace(target_btn, replacement_btn)

theme_toggle_html = '''        <button id="menu-theme-toggle" class="menu-item">
            <span class="icon" id="icon-theme">??</span> <span id="lbl-menu-theme">Light Mode</span>
        </button>'''

target_tools = '<div class="menu-item" style="pointer-events: none; color: var(--text-secondary); padding-bottom: 2px; font-size: 11px; text-transform: uppercase; font-weight: 600;" id="lbl-tools-header">Werkzeuge</div>'
if target_tools in c:
    c = c.replace(target_tools, theme_toggle_html + '\n        <div class="menu-separator"></div>\n        ' + target_tools)
else:
    c = c.replace('<button id="menu-admin-editor"', theme_toggle_html + '\n        <button id="menu-admin-editor"')

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249953\1\ui.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('ui.html updated')
