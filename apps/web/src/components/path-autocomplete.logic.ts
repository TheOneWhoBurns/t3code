/**
 * Split a path string at the last `/` into the parent directory and
 * the partial name being typed.
 */
export function parsePath(input: string): { cwd: string | null; query: string } {
  const trimmed = input.trim();
  const lastSlash = trimmed.lastIndexOf("/");
  if (lastSlash < 0) return { cwd: null, query: "" };
  return {
    cwd: trimmed.slice(0, lastSlash) || "/",
    query: trimmed.slice(lastSlash + 1),
  };
}

/**
 * Join a parent directory and child name into a full path with trailing `/`.
 */
export function joinDirPath(parent: string, child: string): string {
  const base = parent === "/" ? "" : parent;
  return `${base}/${child}/`;
}

/**
 * Build the pre-fill value from a server CWD, ensuring a trailing `/`.
 */
export function buildPrefill(serverCwd: string): string {
  return serverCwd.endsWith("/") ? serverCwd : `${serverCwd}/`;
}

/**
 * Filter a list of directory names by exact prefix (case-insensitive).
 * Returns all directories when query is empty.
 */
export function filterDirSuggestions(
  directories: readonly string[],
  query: string,
): readonly string[] {
  if (query.length === 0) return directories;
  const q = query.toLowerCase();
  return directories.filter((name) => name.toLowerCase().startsWith(q));
}
