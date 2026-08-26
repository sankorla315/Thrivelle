# Thrivelle
Open Source Behavioral Health Engagement Framework, with a small demo app priving how the framwork can be used.

## Testing

Every package under `packages/` runs [Vitest](https://vitest.dev) through the shared config in
`tooling/test-config`. Add specs as `src/**/*.test.ts` or `tests/**/*.test.ts`.

```bash
pnpm test                                  # every package, via turbo
pnpm --filter @thrivelle/task-engine test  # one package
pnpm --filter @thrivelle/task-engine test:watch
```
