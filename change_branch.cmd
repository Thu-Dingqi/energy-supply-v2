@echo off
:: Set command prompt encoding
chcp 65001
echo Branch Management Tool...

:: Show current branch
echo Current branch:
git branch --show-current
echo.

:: Show available branches with numbers
echo Available branches:
setlocal EnableDelayedExpansion
set branch_count=0

:: Add local branches
for /f "tokens=* delims= " %%a in ('git branch') do (
    set /a branch_count+=1
    set "branch!branch_count!=%%a"
    echo !branch_count!:%%a
)

:: Add remote branches (excluding HEAD and duplicates)
for /f "tokens=* delims= " %%a in ('git branch -r ^| findstr /v "HEAD" ^| findstr /v "origin/main"') do (
    set /a branch_count+=1
    set "branch!branch_count!=%%a"
    echo !branch_count!:%%a
)

:: Add new branch option
set /a branch_count+=1
echo !branch_count!: Create new branch
echo.

:: Prompt for branch selection
set /p choice=Enter number (1-!branch_count!): 

:: Handle branch selection
if "!choice!"=="!branch_count!" (
    :: Create new branch
    set /p new_branch=Enter new branch name: 
    git checkout -b !new_branch!
    echo Created and switched to new branch: !new_branch!
) else (
    :: Get selected branch name
    set selected=!branch%choice%!
    set selected=!selected:* =!
    
    :: Check if it's a remote branch
    echo !selected! | findstr /C:"origin/" > nul
    if not errorlevel 1 (
        :: Extract branch name without 'origin/'
        set branch_name=!selected:origin/=!
    ) else (
        set branch_name=!selected!
    )
    
    :: Try to switch to branch
    git checkout !branch_name! 2>nul || git checkout -b !branch_name! origin/!branch_name!
    echo Switched to branch: !branch_name!
)

endlocal
echo.
echo Branch operation complete!
echo Press any key to exit...
pause > nul
