#!/bin/bash

# This script updates the theme to the latest version and removes the unnecessary files

# Exit immediately if a command exits with a non-zero status
set -e

# Remove the existing theme directory
rm -rf themes/gokarna

# Clone the theme
git clone https://github.com/526avijitgupta/gokarna.git themes/gokarna

# Go to themes/gokarna directory
cd themes/gokarna

# Remove useless directories
rm -rf .git
rm -rf .github
rm -rf exampleSite
rm -rf images

# Remove all the languages except English
find i18n -type f ! -iname "en.toml" -delete

# Remove useless files
rm Containerfile
rm README.md
rm requirements.txt

# Remove screenshot.py
rm screenshot.py
