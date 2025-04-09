@echo off
:: Set command prompt encoding to UTF-8
chcp 65001
echo Repository Update Tool Starting...
echo.

:: Display current branch information
echo Current Branch:
git branch --show-current
echo.

:: Fetch latest content from remote repository
echo Fetching updates from remote repository...
git fetch origin
if errorlevel 1 (
    echo Error: Unable to fetch updates from remote repository.
    goto error
)
echo Remote repository updates fetched successfully.
echo.

:: Show local modifications
echo Checking local changes...
git status --porcelain
if errorlevel 1 (
    echo Error: Unable to check local modification status.
    goto error
)

:: Ask user for confirmation
set /p choice=Continue with update? This will overwrite all local changes (Y/N): 
if /i "%choice%"=="Y" (
    :: Perform hard reset
    echo Updating local repository...
    git reset --hard origin/main
    if errorlevel 1 (
        echo Error: Failed to update local repository.
        goto error
    )
    echo Local repository has been successfully updated to the latest state!
) else (
    echo Operation cancelled.
)
goto end

:error
echo An error occurred during the update process. Please check the error message above.
pause
exit /b 1

:end
echo.
echo Operation completed!
pause 