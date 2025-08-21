+++
title = "Projects"
type = "page"
description = "Personal and professional projects spanning cross-platform apps, developer tools, automation pipelines, and machine learning systems."
+++

This page highlights my work as a software developer, covering a broad range of domains such as system utilities, backend tooling, cross-platform applications, game development, and machine learning.

Projects are listed in alphabetical order, not by importance or recency.


### Personal Projects

Notable projects include `vroom` (a 2D game engine) and `header-warden` (a static C++ dependency checker). The latter is part of my daily C++ workflow.

| Name                                                             | Stack               | Type              | Description                                                                                                     |
| ---------------------------------------------------------------- | ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| [aegyo](https://github.com/ryouze/aegyo)                         | C++17, SFML3        | Desktop app       | Cross-platform GUI app for learning Korean Hangul with mouse and keyboard input.                                |
| [applefetch](https://github.com/ryouze/applefetch)               | C++17               | CLI tool          | macOS CLI system information tool, inspired by neofetch.                                                        |
| [asset-packer](https://github.com/ryouze/asset-packer)           | C17                 | CLI tool          | *nix CLI tool for embedding assets (e.g., images, sounds, fonts) into C++ headers.                              |
| [google-usa-search](https://github.com/ryouze/google-usa-search) | JavaScript          | Browser extension | Firefox extension that forces Google to display search results in American English.                             |
| [header-warden](https://github.com/ryouze/header-warden)         | C++17               | CLI tool          | Cross-platform multithreaded CLI tool that identifies and reports missing standard library headers in C++ code. |
| [py-template](https://github.com/ryouze/py-template)             | Python, Poetry      | Template          | Barebones Python project template with poetry and pytest setup.                                                 |
| [vroom](https://github.com/ryouze/vroom)                         | C++20, SFML3, ImGui | Game Engine       | Cross-platform 2D racing game with arcade drift physics, procedurally generated tracks, and waypoint AI.        |
| [yt-table](https://github.com/ryouze/yt-table)                   | C++17               | CLI tool          | Cross-platform CLI tool for managing YouTube subscriptions locally through a shell-like interface.              |


### Professional Work

The majority of this code is not publicly available due to legal and privacy constraints (e.g., the `survey` repository processes GDPR-protected personal data). Some components may be open-sourced in the future.

For a broader overview, visit the [project website](https://prodis-opus19.github.io) or see my [paper](https://arxiv.org/abs/2404.10112).

| Name                                                         | Stack                   | Type        | Description                                                                                                                 |
| ------------------------------------------------------------ | ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`prodis-opus19.github.io`](https://prodis-opus19.github.io) | HTML, CSS, JavaScript   | Website     | Main website for the PRODIS project, with experiment subpage for collecting data.                                           |
| asr                                                          | Python, Whisper         | CLI tool    | CLI wrapper around OpenAI Whisper for batch automatic speech recognition with stereo-to-mono conversion.                    |
| datasets                                                     | Python, Pandas          | CLI tool    | Data processing scripts for downloading, cleaning, and phonemizing OpenSubtitles, OSCAR, and Wikipedia corpora into IPA.    |
| fattura                                                      | C++17, SFML2            | Desktop app | Cross-platform GUI app for editing verification statuses with auto-saving and keyboard navigation.                          |
| model                                                        | Python, PyTorch, Pandas | CLI tool    | Pipeline for training a phoneme-level GPT model on Polish IPA with custom tokenizer and multithreaded postprocessing tools. |
| survey                                                       | Python, Pandas          | CLI tool    | CI-based tool for cleaning and standardizing Microsoft Forms exports with translation and data validation.                  |
| transcriptions                                               | Python                  | CLI tool    | CI-based repository scanner that verifies audio transcription structure and generates verification status reports.          |
| wordfreq-stress                                              | Python, Pandas          | CLI tool    | Data processing scripts for Polish word frequency statistics and X-SAMPA syllabification with cleaning and alignment.       |
