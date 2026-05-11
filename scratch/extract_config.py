import json
import re

with open('scratch/old_level_manager.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)
    content = data['content']
    
    # Find the levelConfig array
    match = re.search(r'this\.levelConfig\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if match:
        config = match.group(1)
        with open('scratch/extracted_config.txt', 'w', encoding='utf-8') as out:
            out.write(config)
        print("Successfully extracted levelConfig")
    else:
        print("Could not find levelConfig in content")
