#!/bin/bash

# This script updates the theme to the latest version and removes the unwanted files

# Exit immediately if a command exits with a non-zero status
set -e

# Remove the existing theme directory (fresh start)
rm -rf themes/gokarna

# Clone the theme
git clone https://github.com/526avijitgupta/gokarna.git themes/gokarna

# Go to themes/gokarna directory
cd themes/gokarna

# Remove unwanted directories
rm -rf .git
rm -rf .github
rm -rf exampleSite
rm -rf images

# Remove all the languages except English
find i18n -type f ! -iname "en.toml" -delete

# Remove unwanted files
rm Containerfile
rm README.md
rm requirements.txt
rm screenshot.py
