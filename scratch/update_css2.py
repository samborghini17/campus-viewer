import re

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249966\1\ui.css', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Global Font and mobile-only fix
target_body = '''body, html {
    margin: 0; padding: 0; width: 100%; height: 100%; 
    overflow: hidden; background: #0a0c12; font-family: var(--font-family);
    user-select: none; -webkit-user-select: none;
}'''
replacement_body = '''.mobile-only { display: none !important; }
body, html {
    margin: 0; padding: 0; width: 100%; height: 100%; 
    overflow: hidden; background: #0a0c12; font-family: var(--font-family);
    user-select: none; -webkit-user-select: none;
}'''
if target_body in c:
    c = c.replace(target_body, replacement_body)

# 2. Update .poi-item.active
c = c.replace('.poi-item.active { background: rgba(255, 59, 71, 0.18); color: var(--text-bright); border-left: 3px solid var(--col-accent); }',
              '.poi-item.active { background: rgba(255, 59, 48, 0.2); color: var(--text-bright); border-left: 3px solid var(--col-red); }')

# 3. Redesign #gsplat-footer to Liquid Glass
target_footer = '''#gsplat-footer {
    position: absolute; bottom: 10px; right: 10px;
    padding: 4px 10px; background: var(--bg-glass);
    backdrop-filter: var(--blur-strong); -webkit-backdrop-filter: var(--blur-strong);
    border: 1px solid var(--border-glass); border-radius: var(--radius-sm);
    color: var(--text-primary); font-size: 11px; font-weight: 500;
    pointer-events: none; z-index: 100; box-shadow: var(--shadow-glass-sm);
}'''
replacement_footer = '''#gsplat-footer {
    position: absolute; bottom: 10px; right: 10px;
    padding: 8px 16px; background: var(--bg-glass-card);
    backdrop-filter: var(--blur-strong); -webkit-backdrop-filter: var(--blur-strong);
    border: 1px solid var(--border-glass); border-radius: 24px;
    color: var(--text-primary); font-size: 12px; font-weight: 600;
    pointer-events: none; z-index: 100; box-shadow: var(--shadow-glass);
}'''
if target_footer in c:
    c = c.replace(target_footer, replacement_footer)

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249966\1\ui.css', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated ui.css phase 2')
