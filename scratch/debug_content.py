import json

with open('scratch/old_level_manager.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)
    content = data['content']
    print(content[:2000])
