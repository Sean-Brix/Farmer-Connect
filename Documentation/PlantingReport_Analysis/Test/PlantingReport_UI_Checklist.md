# Planting Report UI Troubleshooting Checklist

Use this quick list when seeded data exists but nothing shows in the UI.

## Environment & Connectivity
- Confirm backend is running on port 8080 (or the value of `VITE_API_URL`) and reachable: `http://localhost:8080/api/planting-reports/reports`.
- Verify `VITE_API_URL` in `client/.env` (or defaults) matches the running server (should be `http://localhost:8080/api`).
- Restart the client dev server after any env or service URL changes.
- Check browser devtools Network tab for failing requests (CORS, 401/403, 404).

## Authentication & Session
- Log in with seeded admin credentials (username: `admin`, password: `123456`).
- Confirm cookies/session are present; if missing, re-login and retry.
- If calls return 401, the API may require re-authentication or a different origin.

## Data Expectations
- Seeding run should create 10 planting reports plus seasons/varieties; confirm via API:
  - `GET /planting-reports/reports?page=1&limit=25`
  - `GET /varieties`
  - `GET /seasons`
- Ensure DB rows are not soft-deleted (`isDeleted = false`) or archived if your filters exclude them.

## Frontend Filters & State
- Check active tab (All vs Distribution vs Deleted); seeded reports are non-distribution and non-deleted.
- Clear search filters and state filters; ensure pagination page is 1.
- Verify the table uses the correct TanStack query keys and isn’t stuck with stale filters.

## Code/Hook Wiring
- `plantingReportService` base URL points to 8080; client restarted after change.
- `usePlantingReportQueries` / context should call `getAll`/`getAllReports` with proper params.
- Ensure `distributionLinked` filter isn’t defaulting to true.
- Check error boundary/toasts for hidden errors; open console for stack traces.

## UI Rendering
- Mobile vs desktop views: on mobile the list renders as cards; on desktop as table—resize to confirm.
- Confirm columns aren’t hidden by state filters; check “Deleted” and “All Reports” tabs.
- Look for skeleton loaders that never resolve (a sign of a failing query).

## Next Steps if Still Empty
- Hit the API manually; if data returns, the issue is frontend filtering/wiring.
- If API also empty, rerun seeding: `cd server && npm run seed:modular`.
- If CORS/auth blocking, align client origin with server CORS config or login again.
