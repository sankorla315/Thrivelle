import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const packagesDir = join(repoRoot, "packages");

type PackageJson = {
  name?: string;
  private?: boolean;
  main?: string;
  types?: string;
  scripts?: Record<string, string>;
};

type LibraryPackage = {
  dir: string;
  path: string;
  json: PackageJson;
};

function readJson(path: string): PackageJson {
  return JSON.parse(readFileSync(path, "utf8")) as PackageJson;
}

const libraryPackages: LibraryPackage[] = readdirSync(packagesDir, {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const path = join(packagesDir, entry.name);
    return { dir: entry.name, path, json: readJson(join(path, "package.json")) };
  });

describe("workspace layout", () => {
  it("discovers the library packages", () => {
    expect(libraryPackages.length).toBeGreaterThan(0);
  });

  it("uses unique package names", () => {
    const names = libraryPackages.map((pkg) => pkg.json.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe.each(libraryPackages.map((pkg) => [pkg.dir, pkg] as const))(
  "packages/%s",
  (_dir, pkg) => {
    it("is a private @thrivelle package", () => {
      expect(pkg.json.name).toMatch(/^@thrivelle\//);
      expect(pkg.json.private).toBe(true);
    });

    it("declares the shared task scripts", () => {
      const scripts = pkg.json.scripts ?? {};
      expect(Object.keys(scripts)).toEqual(
        expect.arrayContaining(["lint", "typecheck", "test"]),
      );
    });

    it("extends the shared typescript and eslint configs", () => {
      const tsconfig = JSON.parse(
        readFileSync(join(pkg.path, "tsconfig.json"), "utf8"),
      ) as { extends?: string };
      expect(tsconfig.extends).toBe("../../tooling/typescript-config/base.json");
      expect(existsSync(join(pkg.path, "eslint.config.mjs"))).toBe(true);
    });

    it("points main and types at an existing entrypoint", () => {
      const entry = pkg.json.main;
      expect(entry).toBeDefined();
      expect(pkg.json.types).toBe(entry);
      expect(existsSync(join(pkg.path, entry!))).toBe(true);
    });

    it("has an importable entrypoint", async () => {
      const entry = pathToFileURL(join(pkg.path, pkg.json.main!)).href;
      await expect(import(entry)).resolves.toBeTypeOf("object");
    });
  },
);
