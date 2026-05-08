# 🔧 Troubleshooting & Rebuild Guide

## Issue: TypeError in Dev Server

**Error:** `TypeError: e[o] is not a function` in webpack-runtime.js  
**Cause:** Stale `.next` build cache  
**Solution:** Clear cache and rebuild

---

## Quick Fix (Already Applied)

```bash
# 1. Clear the cache
rm -rf .next

# 2. Rebuild
npm run build

# 3. Start dev server
npm run dev
```

**Status:** ✅ Cache cleared and fresh build complete

---

## What Was Done

1. ✅ Removed stale `.next` directory (containing old webpack bundle)
2. ✅ Rebuilt from scratch with `npm run build`
3. ✅ All pages compiled successfully
4. ✅ TypeScript validation passed
5. ✅ No dependency issues found

---

## Dev Server Status

The dev server should now work cleanly. If you still see errors:

### Step 1: Stop All Running Servers
```bash
# Kill any existing node processes
killall node
# or use Activity Monitor to quit them
```

### Step 2: Fresh Install (if needed)
```bash
# Clear everything
rm -rf .next node_modules
npm install
npm run build
```

### Step 3: Start Fresh
```bash
npm run dev
```

---

## Verification Checklist

Before starting the dev server, ensure:

- [ ] `.next` directory is deleted
- [ ] `npm run build` completes with ✓ Compiled successfully
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] All pages showing: `○ (Static)` prerendered as static content

---

## Expected Dev Server Output

When starting `npm run dev`, you should see:

```
  ▲ Next.js 14.2.35
  - Local: http://localhost:3000
  - Environments: .env.local
  ✓ Ready in XXXms
```

**NOT:**
```
TypeError: e[o] is not a function
```

---

## Files Modified (for Reference)

- `app/dca/page.tsx` - Simplified page structure
- `app/compound-interest/page.tsx` - Simplified page structure
- `.next/` - Cleared and rebuilt

---

## All Systems Go ✅

Your site should now be working perfectly!

**To start the dev server:**
```bash
npm run dev
```

Then visit: http://localhost:3000

---

## If Issues Persist

1. Check terminal for full error message
2. Look for the actual error (not just TypeScript)
3. Verify all files were saved correctly
4. Try the "Fresh Install" option above

---

**Last Updated:** May 9, 2026  
**Build Status:** ✅ Clean & Ready  
**Next Step:** Start dev server with `npm run dev`
