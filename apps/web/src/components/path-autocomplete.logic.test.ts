import { describe, expect, it } from "vitest";
import {
  buildPrefill,
  filterDirSuggestions,
  joinDirPath,
  parsePath,
} from "./path-autocomplete.logic";

// ── parsePath ────────────────────────────────────────────────────────

describe("parsePath", () => {
  it("returns null cwd for input without a slash", () => {
    expect(parsePath("hello")).toEqual({ cwd: null, query: "" });
  });

  it("returns null cwd for empty input", () => {
    expect(parsePath("")).toEqual({ cwd: null, query: "" });
  });

  it("splits at the last slash", () => {
    expect(parsePath("/Users/sol/projects/my")).toEqual({
      cwd: "/Users/sol/projects",
      query: "my",
    });
  });

  it("handles trailing slash (empty query)", () => {
    expect(parsePath("/Users/sol/projects/")).toEqual({
      cwd: "/Users/sol/projects",
      query: "",
    });
  });

  it("handles root path", () => {
    expect(parsePath("/")).toEqual({ cwd: "/", query: "" });
  });

  it("handles root with partial name", () => {
    expect(parsePath("/usr")).toEqual({ cwd: "/", query: "usr" });
  });

  it("handles deeply nested paths", () => {
    expect(parsePath("/a/b/c/d/e/f")).toEqual({ cwd: "/a/b/c/d/e", query: "f" });
  });
});

// ── joinDirPath ──────────────────────────────────────────────────────

describe("joinDirPath", () => {
  it("joins parent and child with trailing slash", () => {
    expect(joinDirPath("/Users/sol", "projects")).toBe("/Users/sol/projects/");
  });

  it("handles root parent without double slash", () => {
    expect(joinDirPath("/", "usr")).toBe("/usr/");
  });

  it("handles nested parent", () => {
    expect(joinDirPath("/a/b/c", "d")).toBe("/a/b/c/d/");
  });
});

// ── buildPrefill ─────────────────────────────────────────────────────

describe("buildPrefill", () => {
  it("adds trailing slash when missing", () => {
    expect(buildPrefill("/Users/sol/projects")).toBe("/Users/sol/projects/");
  });

  it("keeps existing trailing slash", () => {
    expect(buildPrefill("/Users/sol/projects/")).toBe("/Users/sol/projects/");
  });

  it("handles root", () => {
    expect(buildPrefill("/")).toBe("/");
  });
});

// ── filterDirSuggestions ─────────────────────────────────────────────

describe("filterDirSuggestions", () => {
  const directories = [
    "audio-visualizer",
    "autorenter",
    "build-tools",
    "node_modules",
    "scripts",
    "src",
  ];

  it("returns all directories for empty query", () => {
    expect(filterDirSuggestions(directories, "")).toEqual(directories);
  });

  it("filters by prefix (case-insensitive)", () => {
    expect(filterDirSuggestions(directories, "au")).toEqual(["audio-visualizer", "autorenter"]);
  });

  it("filters by prefix (uppercase query)", () => {
    expect(filterDirSuggestions(directories, "AU")).toEqual(["audio-visualizer", "autorenter"]);
  });

  it("returns single match", () => {
    expect(filterDirSuggestions(directories, "b")).toEqual(["build-tools"]);
  });

  it("returns multiple matches for single char", () => {
    expect(filterDirSuggestions(directories, "s")).toEqual(["scripts", "src"]);
  });

  it("returns empty when no match", () => {
    expect(filterDirSuggestions(directories, "xyz")).toEqual([]);
  });

  it("handles exact name match", () => {
    expect(filterDirSuggestions(directories, "src")).toEqual(["src"]);
  });

  it("handles empty directory list", () => {
    expect(filterDirSuggestions([], "a")).toEqual([]);
  });
});
