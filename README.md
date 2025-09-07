# Git Pushups

![Banner](https://gitpushups.com/readmeBanner.png)

![Reps](https://gitpushups.com/repoBadge.svg?cacheBust=1)

## How it works

1. **Download the app**

   <p>
     <a href="https://apps.apple.com/us/app/git-pushups/id6747657596">
       <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" height="60"/>
     </a>
     <a href="https://play.google.com/store/apps/details?id=com.gitpushups.android">
       <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" height="60"/>
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
If you have bug fix for this site's content, you can [open a bug report](issues/new?template=bug_report.md) or submit a Pull Request
If you have a feature request, you can DM me on any channel you find me at or [open an issue](issues/new?template=feature_request.md). I don't promise I'll build every requested feature as I'd like this tool to remain simple and valuable to its users. That being said, PRO users' feature requests will be prioritzed

NOTE: the native client code is not open sourced but you can open bug reports for them nonetheless.

---

## Pull Requests for this site's content
Pull requests are welcome if they fix broken content, typos, or other issues in this repository. Please:
  1. Fork the repo.
  2. Create a branch for your fix (`git checkout -b fix/typo-or-bug`).
  3. Commit your changes.
  4. Open a Pull Request with a short description of the fix.

---

## License
This project is licensed under the MIT Non-Commercial License (MIT-NC).
You may use, copy, and modify the code for personal or educational purposes,
but **commercial use is prohibited** without prior written permission.
See [LICENSE](./LICENSE) for full terms.
