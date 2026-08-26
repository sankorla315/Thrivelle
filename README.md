# Thrivelle
Open Source Behavioral Health Engagement Framework, with a small demo app proving how the framwork can be used.

## Testing

Every package under `packages/` runs [Vitest](https://vitest.dev) through the shared config in
`tooling/test-config`. Add specs as `src/**/*.test.ts` or `tests/**/*.test.ts`.

```bash
pnpm test                                  # every package, via turbo
pnpm --filter @thrivelle/task-engine test  # one package
pnpm --filter @thrivelle/task-engine test:watch
```

## CI

`.github/workflows/ci.yml` runs `lint`, `typecheck`, `test`, and `build` on pushes to `main` and on
every pull request, using the Node version in `.nvmrc`.
