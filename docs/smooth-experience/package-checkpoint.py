"""Create a source-only checkpoint, regenerating the integrity manifest."""
import hashlib
import sys
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[2]
destination = Path(sys.argv[1]).resolve()
excluded_parts = {'node_modules', '.next', '.git', '__pycache__'}
files = []
for path in sorted(root.rglob('*')):
    if not path.is_file() or path.is_symlink():
        continue
    relative = path.relative_to(root)
    if any(part in excluded_parts for part in relative.parts):
        continue
    if path.name.startswith('.env') and path.name != '.env.example':
        continue
    if path.suffix in {'.zip', '.log', '.tsbuildinfo', '.pyc'}:
        continue
    if str(relative) == 'public/responsive-audit.html':
        continue
    if str(relative) != 'SHA256SUMS.txt':
        files.append((relative, path))

manifest = ''.join(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {relative.as_posix()}\n' for relative, path in files)
(root / 'SHA256SUMS.txt').write_text(manifest)
files.append((Path('SHA256SUMS.txt'), root / 'SHA256SUMS.txt'))
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED) as archive:
    for relative, path in files:
        archive.write(path, f'OSYSTIC_Smooth_Polish_Checkpoint/{relative.as_posix()}')
with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
print(f'Created and CRC-checked {destination.name}: {len(files)} files, {destination.stat().st_size} bytes.')
