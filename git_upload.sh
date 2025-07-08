#!/bin/bash

# Set command prompt encoding (macOS terminals are usually UTF-8 by default, so this is not needed)
# chcp 65001 # Windows command

echo "Preparing to upload to GitHub..."

# Set proxy if needed
# Note: This sets the proxy globally. You might want to remove or comment this out
# if you don't always need the proxy or prefer per-repository settings.
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# Show current branch
echo "" # Blank line for spacing
echo "Current branch:"
git branch --show-current
echo "" # Blank line

# Show available branches
echo "Available branches:"
git branch -a
echo "" # Blank line

# Prompt for branch selection
read -p "Enter branch name to use (or type 'new' to create new branch, press Enter for 'main'): " branch_choice

# --- Modified check for empty input to default to 'main' ---
if [ -z "$branch_choice" ]; then
    branch_choice="main"
    echo "No branch name entered. Defaulting to branch: $branch_choice"
fi
# --- End modified check ---


# Handle branch selection
if [ "$branch_choice" = "new" ]; then
    read -p "Enter new branch name: " new_branch
    # Check if new_branch is empty
    if [ -z "$new_branch" ]; then
        echo "Error: New branch name cannot be empty."
        exit 1 # Exit with an error code
    fi
    git checkout -b "$new_branch"
    # Check if checkout was successful
    if [ $? -ne 0 ]; then
        echo "Error creating or switching to new branch: $new_branch"
        exit 1 # Exit with an error code
    fi
    echo "Created and switched to new branch: $new_branch"
    # Update branch_choice to the new branch name for the push command later
    branch_choice="$new_branch" # Ensure branch_choice holds the actual branch name for push
else
    # User entered an existing branch name (or the default 'main')
    git checkout "$branch_choice"
    # Check if checkout was successful
    if [ $? -ne 0 ]; then
        echo "Error switching to branch: $branch_choice"
        # Note: The Git fatal error might appear before this line depending on the exact error
        exit 1 # Exit with an error code
    fi
    echo "Switched to branch: $branch_choice"
fi

# Show current changes
echo "" # Blank line
echo "Current changes:"
git status -s
echo "" # Blank line

# Add all changes
git add .

# Prompt for commit message
read -p "Enter commit message (press Enter for default 'Update data'): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update data"
fi

# Commit with message
git commit -m "$commit_msg"
# Check if commit was successful (e.g., if there were changes to commit)
if [ $? -ne 0 ]; then
    echo "No changes to commit or commit failed."
    # Decide if you want to exit here or continue to push (pushing with no new commits is harmless)
    # exit 1 # Uncomment to exit if commit fails
fi


# Push to selected branch
# Use the potentially updated branch_choice variable
echo "" # Blank line
echo "Pushing to origin/$branch_choice..."
git push origin "$branch_choice"
# Check if push was successful
if [ $? -ne 0 ]; then
    echo "Error pushing to origin/$branch_choice"
    # Consider adding 'git push --set-upstream origin "$branch_choice"' for new branches
    # git push --set-upstream origin "$branch_choice" # Uncomment if you want to try setting upstream on failure
    # exit 1 # Uncomment to exit if push fails
fi


echo "" # Blank line
echo "Upload complete!"
echo "" # Blank line

# Pause (macOS equivalent of Windows 'pause')
read -n 1 -s -r -p "Press any key to exit..."
echo "" # Add a newline after the pause prompt
