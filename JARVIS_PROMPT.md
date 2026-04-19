# TASK — Batch Import + Duplicate Detection

## Output Format (READ THIS FIRST)
When complete, output:
VERIFICATION REPORT
===================
FIX 1: ✅/❌ — [one line]
FIX 2: ✅/❌ — [one line]
BUILD: ✅/❌
FILES CHANGED: [list]
MANUAL STEPS REQUIRED: yes/no
NEXT ACTION: [what]

## Fix 1 — Duplicate Detection
File: src/app/api/import-tool/route.ts

Before inserting, query Supabase:
SELECT id, name FROM tools WHERE website_url = url

If found: return 409 JSON:
{ error: "duplicate", message: "Already exists", existing_name: name }

File: src/components/admin/import-tool-button.tsx
On 409: show amber-400 warning "Already exists: {name}"
Do not clear the form.

## Fix 2 — Batch Import
File: src/components/admin/import-tool-button.tsx

Add two tabs to import panel: "Single" (existing) and "Batch" (new).

Batch tab UI:
- Textarea placeholder: "Uniswap | https://uniswap.org"
- One tool per line, format: Name | URL
- Button: "Start Batch Import"

Batch behavior (sequential, not parallel):
- Parse each line into name + url
- For each tool:
  1. Check duplicate via POST /api/import-tool with checkOnly flag
  2. If duplicate: mark as skipped, continue
  3. If new: call POST /api/import-tool, auto-publish to Supabase
  4. Wait 1500ms before next tool
- Show live progress: "Processing 2/10: MetaMask..."
- Show per-tool result:
  emerald-400 for published
  amber-400 for skipped
  red-400 for failed
- Final summary: "Done: 8 published, 1 skipped, 1 failed"
- Refresh tools list after complete

File: src/app/api/import-tool/route.ts
Add support for checkOnly mode:
If body contains { checkOnly: true, url: string }
Only check duplicate, return 200 or 409, skip Claude API call.

## Constraints
- No new npm dependencies
- Tailwind zinc/emerald palette only
- Run npm run build, confirm zero errors