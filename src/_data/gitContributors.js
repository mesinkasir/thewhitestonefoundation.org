import { execSync } from 'node:child_process';

function normalizeContributor(name, email) {
  return {
    name: (name || '').trim(),
    email: (email || '').trim().toLowerCase()
  };
}

function extractUsernameFromEmail(email) {
  if (!email) {
    return '';
  }

  const githubNoReply = email.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i);
  if (githubNoReply) {
    return githubNoReply[1].toLowerCase();
  }

  return '';
}

function extractUsernameFromName(name) {
  const normalized = (name || '').trim();
  if (!normalized) {
    return '';
  }

  // Accept simple handle-like names such as "mesinkasir".
  if (/^[a-z0-9_.-]+$/i.test(normalized) && !/\s/.test(normalized)) {
    return normalized.toLowerCase();
  }

  return '';
}

function getDisplayNameScore(name) {
  const normalized = (name || '').trim();
  if (!normalized) {
    return -1;
  }

  let score = 0;
  if (/\s/.test(normalized)) {
    score += 3;
  }
  if (/[A-Z]/.test(normalized)) {
    score += 2;
  }
  if (normalized.length > 10) {
    score += 1;
  }

  return score;
}

function mergeContributor(existing, incoming) {
  if (!existing) {
    return {
      displayName: incoming.name,
      username: extractUsernameFromEmail(incoming.email) || extractUsernameFromName(incoming.name),
      email: incoming.email
    };
  }

  const existingScore = getDisplayNameScore(existing.displayName);
  const incomingScore = getDisplayNameScore(incoming.name);
  const displayName = incomingScore > existingScore ? incoming.name : existing.displayName;

  const username =
    existing.username ||
    extractUsernameFromEmail(existing.email) ||
    extractUsernameFromEmail(incoming.email) ||
    extractUsernameFromName(existing.displayName) ||
    extractUsernameFromName(incoming.name);

  return {
    displayName,
    username,
    email: existing.email || incoming.email
  };
}

function contributorKey(contributor) {
  if (contributor.email) {
    return contributor.email;
  }

  return contributor.name.toLowerCase();
}

function addUniqueContributor(contributors, contributor) {
  if (!contributor.name) {
    return;
  }

  const key = contributorKey(contributor);
  const merged = mergeContributor(contributors.get(key), contributor);
  contributors.set(key, merged);
}

function getContributorsFromGit() {
  try {
    const logOutput = execSync('git log --format="%an <%ae>%n%b%n---"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });

    const contributors = new Map();
    const lines = logOutput.split(/\r?\n/);
    const coAuthorPattern = /^co-authored-by:\s*(.+?)\s*<([^>]+)>\s*$/i;
    const authorPattern = /^(.+?)\s*<([^>]+)>\s*$/;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line === '---') {
        continue;
      }

      const coAuthorMatch = line.match(coAuthorPattern);
      if (coAuthorMatch) {
        addUniqueContributor(
          contributors,
          normalizeContributor(coAuthorMatch[1], coAuthorMatch[2])
        );
        continue;
      }

      const authorMatch = line.match(authorPattern);
      if (authorMatch) {
        addUniqueContributor(
          contributors,
          normalizeContributor(authorMatch[1], authorMatch[2])
        );
      }
    }

    return Array.from(contributors.values()).sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  } catch {
    return [];
  }
}

export default getContributorsFromGit();
