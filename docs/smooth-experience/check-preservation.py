"""Compare checkpoint against the previous responsive source ZIP, without extracting it."""
import json
import sys
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[2]
allowed = {
    'app/components/CalBooking.tsx', 'app/components/Navbar.tsx',
    'app/contact/_components/ContactForm.tsx',
    'app/careers/_components/CareersClient.tsx', 'app/layout.tsx',
    'app/insights/page.tsx', 'app/blogs/[slug]/page.tsx',
    'app/newsroom/[slug]/page.tsx',
    'next-env.d.ts',  # Next regenerates dev/production route-type references.
    'SHA256SUMS.txt',  # Regenerated package integrity manifest.
    'lib/resend.ts', 'lib/supabase.ts', 'app/api/careers/apply/route.ts',
    'app/admin/content/page.tsx',  # Required P0 Careers follow-up, documented separately.
}
changed, missing, unexpected = [], [], []
checked = 0
with zipfile.ZipFile(sys.argv[1]) as baseline:
    for item in baseline.infolist():
        if item.is_dir():
            continue
        relative = item.filename.split('/', 1)[1]
        local = root / relative
        checked += 1
        if not local.is_file():
            missing.append(relative)
        elif local.read_bytes() != baseline.read(item):
            changed.append(relative)
            if relative not in allowed:
                unexpected.append(relative)

result = {'baseline': Path(sys.argv[1]).name, 'existing_files_checked': checked,
          'changed_existing_files': sorted(changed), 'missing_files': missing,
          'unexpected_changes': unexpected,
          'passed': not missing and not unexpected,
          'note': 'New frontend/docs files are not part of the original ZIP comparison. P0 Careers changes are now explicitly allowed and documented in P0_FOLLOWUP.md. next-env.d.ts and SHA256SUMS.txt are generated. This checks bytes, not browser behavior.'}
print(json.dumps(result, indent=2))
(root / 'docs/smooth-experience/preservation.json').write_text(json.dumps(result, indent=2) + '\n')
sys.exit(0 if result['passed'] else 1)
