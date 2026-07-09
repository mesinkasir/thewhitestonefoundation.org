import { readFileSync } from 'node:fs';

function getSsgVersion() {
  try {
    const packageJsonPath = new URL('../../package.json', import.meta.url);
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.devDependencies?.['@11ty/eleventy'] || 'unknown';
  } catch {
    return 'unknown';
  }
}

const ssgName = 'Eleventy';
const ssgVersion = getSsgVersion();

export default {
  now: new Date(),
  ssgName,
  ssgVersion,
  generator: `${ssgName} ${ssgVersion}`
};
