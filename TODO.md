# TODO - Fix NOT_FOUND handling

- [ ] Inspect current server-side error handling and identify where NOT_FOUND is surfaced.
- [ ] Update `src/lib/error-page.ts` to include a dedicated 404 HTML renderer.
- [x] Update `src/server.ts` to detect 404 / NOT_FOUND responses and return proper 404 HTML + status.
- [ ] Rebuild (`npm run build`) and verify the failing route/assets no longer surface as NOT_FOUND incorrectly.


