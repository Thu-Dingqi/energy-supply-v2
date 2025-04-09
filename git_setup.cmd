@echo off
echo Setting up Git repository and pushing to GitHub...

:: Configure Git proxy settings
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

:: Configure user information
git config --global user.email "dingq23@mails.tsinghua.edu.cn"
git config --global user.name "Thu-Dingqi"

:: Verify proxy settings
git config --global --get http.proxy
git config --global --get https.proxy

:: Initialize new Git repository
git init

:: Add remote repository
git remote add origin https://github.com/Thu-Dingqi/energy-supply-v2.git

:: Add all files to staging
git add .

:: Prompt user for commit message
set /p "commit_msg=Please enter your commit message (press Enter for default): "

:: If no message entered, use default
if "%commit_msg%"=="" set "commit_msg=update"

:: Commit with message
git commit -m "%commit_msg%"

:: Create main branch and switch to it
git branch -M main

:: Push to main branch
git push -u origin main

echo Repository setup and push completed!
pause 


