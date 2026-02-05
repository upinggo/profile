#!/bin/bash

# Script to test semantic release locally
# This helps verify that semantic-release will work correctly before pushing to remote

echo "🔍 Testing Semantic Release locally..."

# Check if we're on the main branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch. Current branch: $current_branch"
    echo "Semantic release typically runs on main branch only."
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes. Please commit or stash them before testing."
fi

# Run semantic-release in dry-run mode
echo "🚀 Running semantic-release in dry-run mode..."
npx semantic-release --dry-run

echo "✅ Local semantic release test completed!"
echo "If no errors occurred above, your semantic release setup is working correctly."