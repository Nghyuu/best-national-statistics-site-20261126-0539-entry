import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));

const out = process.env.MAKEFUN_OUTPUT_DIR;
if (!out) {
  throw new Error('MAKEFUN_OUTPUT_DIR is not set');
}

// The grader runs as an unprivileged user and the output directory itself
// may be owned by someone else (e.g. root), so chmod on it throws EPERM.
// Every chmod below is best-effort: files and directories this program
// creates are owned by it, so their chmods succeed and the grader can read
// them; a failed chmod on the pre-existing top-level output dir must never
// kill the run.
function safeChmod(path: string, mode: number): void {
  try {
    chmodSync(path, mode);
  } catch {
    // Output dir may not be owned by us; files we created are still chmodded.
  }
}

function fixModes(dir: string): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      safeChmod(p, 0o755);
      fixModes(p);
    } else {
      safeChmod(p, 0o644);
    }
  }
}

mkdirSync(out, { recursive: true });
safeChmod(out, 0o755);

cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Normalize modes on everything this program created (0644 files, 0755
// dirs) so the grader, running as another user, can read the output.
// The top-level output dir chmod inside fixModes is best-effort via
// safeChmod and cannot throw.
safeChmod(out, 0o755);
fixModes(out);
