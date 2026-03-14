# Contributing

## Branch Strategy

| Prefix | When to use | Example |
|---|---|---|
| `feat/` | New feature | `feat/user-bookmarks` |
| `fix/` | Bug fix | `fix/mobile-swipe-direction` |
| `chore/` | Maintenance, deps, config | `chore/update-vite` |
| `docs/` | Documentation only | `docs/add-deployment-guide` |
| `content/` | Adding or editing terms | `content/add-marketing-terms` |

All branches target `main`. Never commit directly to `main`.

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Optional longer body explaining why.
```

**Types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `content`

**Scope:** optional — `frontend`, `backend`, `docs`, `data`

**Examples:**
```
feat(frontend): add level filter to categories section
fix(backend): handle missing DATABASE_URL gracefully in development
content(data): add 5 marketing terms to brand category
docs: update deployment guide with Render steps
```

---

## Pull Request Template

When opening a PR, answer:

1. **What changed?** — summary of the change
2. **Why?** — the motivation (bug, feature request, content update)
3. **How to test?** — steps to verify the change manually
4. **Screenshots** (if UI changes)

---

## Code Standards

### Frontend
- Components in `PascalCase` — `GridCard.jsx`
- Hooks in `camelCase` with `use` prefix — `useWindowSize.js`
- Utils in `camelCase` — `filterUtils.js`
- No default exports except `App` and route-level components
- Prefer named exports for all other components and functions

### Backend
- ES modules (`import`/`export`) throughout
- Controller methods call service methods — no Prisma calls in controllers
- Service methods have no Express imports — no `req`/`res` in services
- All responses via `apiResponse.success()` or `apiResponse.error()`

---

## CI

Two GitHub Actions workflows run on every PR:

- **frontend-ci:** `npm install && npm run build` in `packages/frontend`
- **backend-ci:** `npm install && npm run lint` in `packages/backend`

PRs cannot be merged if CI fails.

---

## No force-push to main

`main` is the production branch. Force-pushing can break deployments. Use `git revert` to undo a bad commit on `main`.
