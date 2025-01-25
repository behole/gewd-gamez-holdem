# Git Instructions for Poker Game Changes

## Committing Current Changes

1. Stage all changes:
```bash
git add .
```

2. Commit with a descriptive message:
```bash
git commit -m "Implement poker game flow fixes:
- Fix blind posting order
- Improve betting round completion
- Add proper action tracking
- Fix dealer rotation"
```

3. Push to GitHub:
```bash
git push origin main
```

## Reverting Changes Later

If you need to undo these changes later, you have two options:

### Option 1: Revert the Commit (Recommended)
This creates a new commit that undoes the changes while preserving history.

1. Find the commit hash:
```bash
git log
```

2. Create a revert commit:
```bash
git revert <commit-hash>
git push origin main
```

### Option 2: Reset to Previous Version
This rewrites history by moving the branch pointer back.

1. Find the commit hash you want to return to:
```bash
git log
```

2. Reset to that commit:
```bash
git reset --hard <commit-hash>
git push -f origin main
```

**Note:** Option 1 (revert) is safer as it:
- Preserves git history
- Is safer for shared repositories
- Makes it easier to undo the revert if needed

Option 2 (reset) should only be used if you:
- Haven't shared the changes with others
- Want to completely remove the changes from history
- Are absolutely sure about the reset point

## Best Practices

1. Always commit with clear, descriptive messages
2. Prefer `git revert` over `git reset` for shared repositories
3. Make sure you're on the right branch before committing
4. Pull latest changes before pushing:
```bash
git pull origin main
git push origin main
```

## Checking Status

You can always check:
- Current status: `git status`
- Commit history: `git log`
- Current branch: `git branch`

This ensures you know exactly what state your repository is in before making changes.