@echo off
:: Set command prompt encoding
chcp 65001
echo Preparing to upload to GitHub...

:: Set proxy if needed
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

:: Show current branch
echo Current branch:
git branch --show-current
echo.

:: Show available branches
echo Available branches:
git branch -a
echo.

:: Prompt for branch selection
set /p branch_choice=Enter branch name to use (or type 'new' to create new branch): 

:: Handle branch selection
if "%branch_choice%"=="new" (
    set /p new_branch=Enter new branch name: 
    git checkout -b %new_branch%
    echo Created and switched to new branch: %new_branch%
) else (
    git checkout %branch_choice%
    echo Switched to branch: %branch_choice%
)

:: Show current changes
echo Current changes:
git status -s
echo.

:: Add all changes
git add .

:: Prompt for commit message
set /p commit_msg=Enter commit message (press Enter for default 'Update data'): 
if "%commit_msg%"=="" set commit_msg=Update data

:: Commit with message
git commit -m "%commit_msg%"

:: Push to selected branch
git push origin %branch_choice%

echo.
echo Upload complete!
echo Press any key to exit...
pause > nul 