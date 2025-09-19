# Check Git Pushups Action

This composite GitHub Action verifies whether the author of a pull request has completed their daily pushups using the [GitPushups API](https://api.gitpushups.com).
If the user has not done their pushups for the current day, the action fails the workflow.

## Usage

```yaml
name: Pushup Check
on: [pull_request]

jobs:
  pushups:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: higgins/gitpushups.com/pushups-action@main
```
