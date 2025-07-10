+++
title = "Projects"
type = "page"
description = "A collection of my personal and professional projects, ranging from GUI applications to CLI tools and research work."
+++

Here's a showcase of my software development work, spanning various domains from system utilities to machine learning research.

### Personal Projects

- [aegyo](https://github.com/ryouze/aegyo) - Cross-platform GUI app for learning Korean Hangul.
- [applefetch](https://github.com/ryouze/applefetch) - macOS CLI system information tool, inspired by neofetch.
- [asset-packer](https://github.com/ryouze/asset-packer) - *nix CLI tool for embedding assets (e.g., images, sounds, fonts) into C++ headers.
- [google-usa-search](https://github.com/ryouze/google-usa-search) - Firefox extension that forces Google to display search results in American English.
- [header-warden](https://github.com/ryouze/header-warden) - Cross-platform multithreaded CLI tool that identifies and reports missing standard library headers in C++ code.
- [py-template](https://github.com/ryouze/py-template) - Barebones Python project template (poetry + pytest).
- [vroom](https://github.com/ryouze/vroom) - Cross-platform 2D racing game with arcade physics, procedurally-generated track, and waypoint AI.
- [yt-table](https://github.com/ryouze/yt-table) - Cross-platform CLI tool for managing YouTube subscriptions locally through a shell-like interface.


### Research & Professional Work

Most of the code is not public yet (or perhaps ever, as the survey data contains personal data protected by the GDPR). Refer to the [scientific paper](https://arxiv.org/abs/2404.10112) or the [project's website](https://prodis-opus19.github.io/) for a full overview.

- [prodis-opus19.github.io](https://github.com/prodis-opus19/prodis-opus19.github.io) - Project website built using plain HTML and CSS for the OPUS research grant.
- `asr` - CLI wrapper around OpenAI Whisper for batch automatic speech recognition with stereo-to-mono conversion and optional model/language selection.
- `datasets` - Data-centric repository of Polish text corpora, with scripts for downloading, cleaning, and phonemizing OpenSubtitles, OSCAR, and Wikipedia data into IPA.
- `fattura` - Cross-platform GUI tool for editing verification status in structured CSV data, with auto-saving and keyboard navigation.
- `model` - All-in-one collection of scripts to train and predict surprisal using a phoneme-level GPT model. Features include a custom tokenizer, TOML-based config system, full support for resuming training, and controlled sampling. Includes multithreaded tools for extracting formants from TextGrids, detecting segmental overlap, appending stress values, and aligning model predictions with acoustic data. The pipeline handles all steps from model training to final CSV outputs, with robust error handling and per-script logging.
  - Please refer to the [scientific paper](https://arxiv.org/abs/2404.10112) for more details.
- `survey` - CI-based repository that parses raw Microsoft Forms exports, filters incomplete entries, fixes malformed emails, standardizes formatting, translates Polish fields and responses to English, adds real names, computes metadata (e.g., duration, age group), generates unique PRODIS IDs, and outputs a clean CSV.
- `transcriptions` - CI-based repository that scans participant directories, verifies the presence and structure of audio transcriptions, checks TextGrid tiers, and generates a README summarizing verification status and inconsistencies, followed by a list of analysis-ready data.
- `wordfreq-stress` - Data-centric repository of Polish word frequency statistics and X-SAMPA syllabification, with scripts for cleaning, normalizing, and aligning data.
