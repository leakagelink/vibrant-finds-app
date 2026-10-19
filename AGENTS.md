<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture decisions

- Public event details use `/moments/$id` for card navigation and sharing; only approved host events render there, keeping direct links consistent with discovery. Local display filtering is not a server authorization boundary.
- Until verified server authentication exists, login must not create simulated sessions and host/admin panels remain unavailable; client-stored roles must never unlock privileged tools.

- The app is also wrapped as an Android app with Capacitor. The build must stay Capacitor-compatible: `vite.config.ts` uses TanStack Start SPA mode (`spa: { enabled: true }`), `npm run build` copies `_shell.html` to `dist/client/index.html` (scripts/spa-index.mjs), and `capacitor.config.ts` points `webDir` at `dist/client`. Why: Capacitor serves static files only — no SSR/prerender-per-request is possible in the WebView. Logo images are transparent PNGs in `src/assets/` imported with `?inline` (embedded as data URLs, never `.asset.json` pointers), so they always render in the APK regardless of asset paths.
- Never name modules `*.client.*` (SSR build rejects them); browser APIs stay inside `useEffect`/handlers per the execution-model rules.
