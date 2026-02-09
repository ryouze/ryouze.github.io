+++
title = "Projects"
type = "page"
description = "Portfolio of my work, including CLI tools, desktop applications, and machine learning projects."
+++

This page contains a portfolio of my work, including CLI tools, desktop applications, and machine learning projects.

---

## Professional Work

I currently work at [EPR Labs](https://epr-labs.com/). My prior work focused on machine learning and large-scale linguistic data processing.

During a 3-year paid internship on the [PRODIS project](https://prodis-opus19.github.io), I developed the project's complete ML and data infrastructure, including the first [phoneme-level GPT model for Polish](https://arxiv.org/abs/2404.10112).

Due to legal and privacy restrictions involving GDPR-protected data, most source code cannot be released publicly. Select components may be open-sourced later.

| Name                                                       | Stack                               | Type        | Description                                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| model                                                      | Python, PyTorch, Pandas, Matplotlib | CLI tool    | Pipeline for training a phoneme-level GPT model to predict surprisal in Polish. Custom IPA tokenizer, parallelized steps for formant extraction, alignment, and stress annotation. |
| asr                                                        | Python, Whisper                     | CLI tool    | Pipeline for batch automatic speech recognition with stereo-to-mono conversion.                    |
| datasets                                                   | Python, Pandas                      | CLI tool    | Data processing scripts for downloading, cleaning, and phonemizing OpenSubtitles, OSCAR, and Wikipedia corpora into IPA.    |
| survey                                                     | Python, Pandas                      | CLI tool    | CI-based tool for cleaning and standardizing Microsoft Forms exports with translation and data validation.                  |
| transcriptions                                             | Python                              | CLI tool    | CI-based repository scanner that verifies audio transcription structure and generates verification status reports.          |
| wordfreq-stress                                            | Python, Pandas                      | CLI tool    | Data processing scripts for Polish word frequency statistics and X-SAMPA syllabification with cleaning and alignment.       |
| [prodis-opus19.github.io](https://prodis-opus19.github.io) | HTML, CSS, JavaScript               | Website     | Main website for the PRODIS project, with experiment subpage for collecting data.                                           |
| fattura                                                    | C++17, SFML2                        | Desktop app | Cross-platform GUI app for editing verification statuses with auto-saving and keyboard navigation.                          |

---

## Personal Projects

| Name                                                             | Stack               | Type              | Description                                                                                                     |
| ---------------------------------------------------------------- | ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| [vroom](https://github.com/ryouze/vroom)                         | C++20, SFML3, ImGui | Game              | Cross-platform 2D racing game with arcade drift physics, procedurally-generated tracks, and waypoint AI.        |
| [header-warden](https://github.com/ryouze/header-warden)         | C++17               | CLI tool          | Cross-platform multithreaded static analysis tool that reports missing standard library headers in C++ code. |
| [aegyo](https://github.com/ryouze/aegyo)                         | C++17, SFML3        | Desktop app       | Cross-platform GUI app for learning Korean Hangul with mouse and keyboard input.                                |
| [ungpt](https://github.com/ryouze/ungpt)                         | C++20, SFML3        | Desktop app       | Cross-platform GUI app that converts ChatGPT's smart punctuation and symbols to plain ASCII.                    |
| [yt-table](https://github.com/ryouze/yt-table)                   | C++17               | CLI tool          | Cross-platform CLI tool for managing YouTube subscriptions locally through a shell-like interface.              |
| [asset-packer](https://github.com/ryouze/asset-packer)           | C17                 | CLI tool          | *nix CLI tool for embedding assets (e.g., images, sounds, fonts) into C++ headers.                              |
| [applefetch](https://github.com/ryouze/applefetch)               | C++17               | CLI tool          | macOS CLI system information tool, inspired by neofetch.                                                        |
| [py-template](https://github.com/ryouze/py-template)             | Python, Poetry      | Template          | Minimal Python project template (poetry, pytest, CI).                                                           |
| [google-usa-search](https://github.com/ryouze/google-usa-search) | JavaScript          | Browser extension | Firefox extension that forces Google to display search results in American English.                             |
