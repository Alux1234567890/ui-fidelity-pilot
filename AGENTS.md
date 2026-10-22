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

- Keep theme state in the shared ThemeProvider and express both themes through global semantic tokens so every page surface stays consistent; browser-only preference reads run after hydration.
- Site chat widget answers via a server function (src/lib/chat.functions.ts) calling Lovable AI Gateway, grounded by keyword retrieval over src/lib/knowledge.ts; keys stay server-side.
- Booking uses the shared Radix Dialog to keep focus, dismissal, scroll locking, and small-screen sizing consistent.
