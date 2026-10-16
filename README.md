# Git Pushups

![Banner](https://gitpushups.com/readmeBanner.png)

![Reps](https://gitpushups.com/repoBadge.svg?cacheBust=1)

## How it works

1. **Download the app**

   <p>
     <a href="https://apps.apple.com/us/app/git-pushups/id6747657596">
       <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" style="height:40px; width:auto;" />
     </a>
     <a href="https://play.google.com/store/apps/details?id=com.gitpushups.android">
       <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" style="height:40px; width:auto;" />
     </a>
   </p>

2. **Install the Git hook**

   You can block your commits on any github user's gitpushup activity. Simply reference their github username in your git-hook.
   For example, to block on [@higgins](https://github.com/higgins) daily pushup activity:

```bash
d=$(date +%F)
res=$(curl -fs https://gitpushups.com/@higgins?d=$d)

if [ "$res" != "true" ]; then
  echo "\033[0;31m✗ Do your pushups first!\033[0m" >&2
  exit 1
else
  echo "\033[0;32m✓ Pushups verified!\033[0m"
fi
```

  Obviously, you're encouraged to block on your own pushups...but it can be fun to do with your coworkers too.

3. **Do pushups or your git hook will fail**

---

## Feature Requests / Bug Fixes

I welcome community input!

If you have bug fix for this site's content, you can [open a bug report](https://github.com/higgins/gitpushups.com/issues/new?template=bug_report.md) or submit a Pull Request.

If you have a feature request, you can DM me on any channel you find me at or [open an issue](https://github.com/higgins/gitpushups.com/issues/new?template=feature_request.md). I don't promise I'll build every requested feature as I'd like this tool to remain simple and valuable to its users.

**NOTE:** the native client code is not open sourced but you can open bug reports for them nonetheless.

---

## Pull Requests for this site's content
Pull requests are welcome if they fix broken content, typos, or other issues in this repository. Please:
  1. Fork the repo.
  2. Create a branch for your fix (`git checkout -b fix/typo-or-bug`).
  3. Commit your changes.
  4. Open a Pull Request with a short description of the fix.

---

## Profile link previews

Sharing the ordinary `https://gitpushups.com/@username` profile URL produces
personalized Open Graph and Twitter metadata. `/social/profile/username?v=5`
renders a 1200×630 PNG with the mascot and locked laptop on the right and a
decorative contribution grid across the background. A centered stack in the
open space on the left shows the GitHub avatar, “@username”, “N pushups”,
“in YEAR”, and the GitPushups logo. Each text line fits its available width
without wrapping or truncation. There is no separate sharing flow, and the
design never indicates whether the user did their pushups today.

The annual total uses real contribution data through the profile API's local
date. The background grid is generic artwork, not the user's actual activity.
Missing contribution data produces neutral copy without a number; missing
avatars use the username's first letter. Only GitHub's avatar host is fetched,
with time and size bounds and no followed redirects.

The existing Cloudflare deployment's Cache API stores rendered cards for
one day (86,400 seconds) per normalized username/template version in each
data center, including cards with a missing avatar or contribution data.
Cache keys ignore cookies and arbitrary query parameters. Social networks maintain
their own caches: these settings cannot force an already-posted preview to
refresh. The rendered card identifies the year of the total.

The background, logo and font are served through the existing `ASSETS` binding.
`public/social/fonts/BarlowCondensed-Bold.ttf` comes from
[Google Fonts](https://github.com/google/fonts/tree/main/ofl/barlowcondensed)
under the adjacent `OFL.txt` license. No paid image service or new binding is
required. Change `PROFILE_CARD_VERSION` when revising the layout; also change
the template filename when replacing its artwork. Test with `npm run test:social`, then an OpenNext build
and local Wrangler preview; image rendering must be exercised in Workers,
not just Node.

## License
This project is licensed under the MIT Non-Commercial License (MIT-NC).
You may use, copy, and modify the code for personal or educational purposes,
but **commercial use is prohibited** without prior written permission.
See [LICENSE](./LICENSE) for full terms.

## Thank you!
