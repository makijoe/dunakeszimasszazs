# Working rules

1. **Never change project files while checks are running.** Wait for all checks to finish before editing any file.

2. **Before writing a file, check whether it already exists and add to it rather than overwrite it.**

3. **A change is done only when:** all checks pass on the final code, any relevant docs are updated, the change is merged to main, and the full changed code plus a plain-English summary have been sent to the user.

4. **If the same check fails twice for a reason you don't understand, stop and tell the user** instead of trying again.

## Check command

This project has no automated test suite. Run the two checks below — TypeScript type-checking acts as the correctness proxy. The command fails if TypeScript errors increase or ESLint violations appear.

```
cd app && npm run lint && npx tsc --noEmit
```

## Security

The Stripe live key (`sk_live_...`) must **never** be committed to code. It goes only in Google Apps Script Script Properties.
