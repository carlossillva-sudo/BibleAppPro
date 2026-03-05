interface ChangeEntry {
  buildNumber: number;
  version: string;
  date: string;
  notes: string;
}

const changelog: ChangeEntry[] = [];

export function addChange(entry: ChangeEntry) {
  changelog.push(entry);
}

export function generateBuildSummary(buildNumber?: number) {
  if (buildNumber != null) {
    const entry = changelog.find((c) => c.buildNumber === buildNumber);
    if (entry) {
      return `${entry.version} (build ${entry.buildNumber}) - ${entry.date}\n${entry.notes}`;
    }
  }
  return changelog
    .map((c) => `${c.version} (build ${c.buildNumber}) - ${c.date}`)
    .join('\n');
}

export { changelog };
