# GitHub Setup Guide

## Prerequisites

You need to install Git first. Here are the options:

### Option 1: Install Git for Windows
1. Download from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt

### Option 2: Use Git from GitHub Desktop
1. Download GitHub Desktop: https://desktop.github.com/
2. It includes Git automatically

### Option 3: Use Git from Visual Studio Code
1. Install VS Code with Git extension
2. Use integrated terminal

## Setup Steps

### 1. Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Initialize Repository
```bash
cd "C:\Users\Monika\Desktop\hackathon\anonymous_reporter"
git init
```

### 3. Add Files
```bash
git add .
```

### 4. Create First Commit
```bash
git commit -m "Initial commit: Anonymous Reporter app"
```

### 5. Set Main Branch
```bash
git branch -M main
```

### 6. Add Remote Origin
```bash
git remote add origin https://github.com/annbbbb/Anonymous_reporter.git
```

### 7. Push to GitHub
```bash
git push -u origin main
```

## Alternative: Using GitHub Desktop

1. Open GitHub Desktop
2. Click "Add an Existing Repository from your Hard Drive"
3. Select the `anonymous_reporter` folder
4. Click "Publish repository" on GitHub
5. Enter repository name: `Anonymous_reporter`
6. Make it public or private as needed
7. Click "Publish Repository"

## Troubleshooting

### If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Go to GitHub Settings > Developer settings > Personal access tokens
3. Generate new token with repo permissions
4. Use token as password when prompted

### If you get "repository not found":
1. Make sure the repository exists on GitHub
2. Check the URL is correct
3. Make sure you have write permissions

### If you get "fatal: not a git repository":
1. Make sure you're in the right directory
2. Run `git init` first

## Next Steps After Push

1. Go to your GitHub repository
2. Verify all files are uploaded
3. Set up GitHub Pages (optional)
4. Configure branch protection rules
5. Add collaborators if needed

## Useful Git Commands

```bash
# Check status
git status

# Add specific file
git add filename

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Check remote
git remote -v
```


