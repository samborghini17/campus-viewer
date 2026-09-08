import re

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249966\1\ui.css', 'r', encoding='utf-8') as f:
    c = f.read()

new_root = '''
:root {
    /* Apple Liquid Glass Theme (Dark Default) */
    --bg-glass: rgba(30, 30, 30, 0.35);
    --bg-glass-card: rgba(45, 45, 45, 0.45);
    --bg-glass-btn: rgba(255, 255, 255, 0.1);
    --bg-glass-btn-hover: rgba(255, 255, 255, 0.2);
    --bg-glass-btn-active: rgba(255, 255, 255, 0.3);
    
    --border-glass: rgba(255, 255, 255, 0.15);
    --border-glass-hover: rgba(255, 255, 255, 0.25);
    --border-glass-active: rgba(255, 255, 255, 0.35);

    --text-primary: rgba(255, 255, 255, 0.95);
    --text-secondary: rgba(235, 235, 245, 0.6);
    --text-bright: #ffffff;

    --col-accent: #007aff;
    --col-accent-glow: rgba(0, 122, 255, 0.35);
    --col-cyan: #32ade6;
    --col-red: #ff3b30;
    --col-amber: #ffcc00;
    --font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    
    --spacing-md: 10px;
    --blur-strong: blur(30px) saturate(200%);
    --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    --shadow-glass-sm: 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    --shadow-ui: 0 4px 14px rgba(0, 0, 0, 0.15);
    --logo-height: 36px;
    
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-right: env(safe-area-inset-right, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-left: env(safe-area-inset-left, 0px);
    
    --radius-ui: 24px;
    --radius-btn: 20px;
}

:root.theme-light {
    /* Apple Liquid Glass Theme (Light Variant) */
    --bg-glass: rgba(255, 255, 255, 0.45);
    --bg-glass-card: rgba(255, 255, 255, 0.6);
    --bg-glass-btn: rgba(0, 0, 0, 0.05);
    --bg-glass-btn-hover: rgba(0, 0, 0, 0.1);
    --bg-glass-btn-active: rgba(0, 0, 0, 0.15);
    
    --border-glass: rgba(0, 0, 0, 0.1);
    --border-glass-hover: rgba(0, 0, 0, 0.2);
    --border-glass-active: rgba(0, 0, 0, 0.3);

    --text-primary: rgba(0, 0, 0, 0.9);
    --text-secondary: rgba(60, 60, 67, 0.6);
    --text-bright: #000000;

    --col-accent: #007aff;
    --col-accent-glow: rgba(0, 122, 255, 0.35);
    --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    --shadow-glass-sm: 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
'''

root_end_idx = c.find('.hidden {')
if root_end_idx != -1:
    c = new_root + c[root_end_idx:]
else:
    print('Could not find .hidden class to replace root')

c = re.sub(r'border-radius:\s*12px;', 'border-radius: 24px;', c)
c = re.sub(r'border-radius:\s*8px;', 'border-radius: 20px;', c)
c = re.sub(r'border-radius:\s*6px;', 'border-radius: 16px;', c)

c = re.sub(r'#burger-btn \{[\s\S]*?\}', lambda m: m.group(0).replace('border-radius: 12px', 'border-radius: 50%').replace('border-radius: 24px', 'border-radius: 50%').replace('border-radius: 20px', 'border-radius: 50%'), c)
c = re.sub(r'\.lang-btn \{[\s\S]*?\}', lambda m: m.group(0).replace('border-radius: 8px', 'border-radius: 18px').replace('border-radius: 20px', 'border-radius: 18px'), c)

joystick_base = '''#joystick-base {
    position: fixed;
    bottom: calc(var(--safe-bottom) + 30px);
    left: calc(var(--safe-left) + 30px);
    width: 120px;
    height: 120px;
    background: var(--bg-glass-card);
    border: 1px solid var(--border-glass);
    border-radius: 50%;
    backdrop-filter: var(--blur-strong);
    -webkit-backdrop-filter: var(--blur-strong);
    box-shadow: var(--shadow-glass);
    touch-action: none;
    pointer-events: auto;
    z-index: 1000;
}'''

joystick_stick = '''#joystick-stick {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    margin-top: -25px;
    margin-left: -25px;
    background: var(--text-primary);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    pointer-events: none;
}'''

c = re.sub(r'#joystick-base\s*\{[\s\S]*?\}', joystick_base, c)
c = re.sub(r'#joystick-stick\s*\{[\s\S]*?\}', joystick_stick, c)

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249966\1\ui.css', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated ui.css')
