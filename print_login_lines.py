from pathlib import Path
path = Path('src/components/Login.jsx')
for i, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 150):
    if 165 <= i <= 190:
        print(f"{i}: {repr(line)}")
