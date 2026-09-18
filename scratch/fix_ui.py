with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249966\1\ui.css', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Global .mobile-only
target_body = '''body, html {
    margin: 0; padding: 0; width: 100%; height: 100%;'''
replacement_body = '''.mobile-only { display: none !important; }
body, html {
    margin: 0; padding: 0; width: 100%; height: 100%;'''
if target_body in c and '.mobile-only { display: none !important; }' not in c[:500]:
    c = c.replace(target_body, replacement_body)

# 2. Burger menu alignment
target_burger = '''#burger-menu-container {
    position: absolute;
    top: calc(var(--safe-top) + 12px);
    right: calc(var(--safe-right) + 12px);'''
replacement_burger = '''#burger-menu-container {
    position: absolute;
    top: calc(var(--safe-top) + 12px);
    right: calc(var(--safe-right) + 14px);
    height: 48px;
    align-items: center;'''
if target_burger in c:
    c = c.replace(target_burger, replacement_burger)

# 3. gsplat-footer rounding
target_footer = '''#gsplat-footer {
    position: absolute; bottom: 10px; right: 10px;
    padding: 8px 16px; background: var(--bg-glass-card);
    backdrop-filter: var(--blur-strong); -webkit-backdrop-filter: var(--blur-strong);
    border: 1px solid var(--border-glass); border-radius: var(--radius-pill);'''
replacement_footer = '''#gsplat-footer {
    position: absolute; bottom: 10px; right: 10px;
    padding: 8px 16px; background: var(--bg-glass-card);
    backdrop-filter: var(--blur-strong); -webkit-backdrop-filter: var(--blur-strong);
    border: 1px solid var(--border-glass); border-radius: 24px;'''
if target_footer in c:
    c = c.replace(target_footer, replacement_footer)

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249966\1\ui.css', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated ui.css')

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249953\1\ui.html', 'r', encoding='utf-8') as f:
    h = f.read()

target_btn = '''<button id="btn-switch-campus" class="unified-btn" style="padding: 4px 12px; margin-right: 8px; font-size: 13px;">
            <span class="icon" style="margin-right: 4px;">??</span> <span id="switch-campus-text">Detmold Campus</span>
        </button>'''
replacement_btn = '''<button id="btn-switch-campus" class="unified-btn" style="padding: 4px 10px; margin-right: 8px; font-size: 12px; white-space: nowrap;">
            <span class="icon" style="margin-right: 4px;">??</span> <span id="switch-campus-text">Zum Kreativcampus Detmold</span>
        </button>'''
if target_btn in h:
    h = h.replace(target_btn, replacement_btn)

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249953\1\ui.html', 'w', encoding='utf-8') as f:
    f.write(h)
print('Updated ui.html')
