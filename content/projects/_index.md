+++
title = "Projects"
type = "page"
description = "Personal and professional projects spanning cross-platform apps, developer tools, automation pipelines, and machine learning systems."
+++

This page showcases my work as a machine learning engineer and software developer, spanning data science, automation pipelines, cross-platform applications, and developer tooling.

---

## Professional Work

My professional work centers on machine learning research and data processing pipelines for linguistic analysis. During my 3-year paid internship on the [PRODIS project](https://prodis-opus19.github.io), I built the complete ML and data processing infrastructure, including a first-of-its-kind [phoneme-level GPT model for Polish](https://arxiv.org/abs/2404.10112).

The majority of this code is not publicly available due to legal and privacy constraints (e.g., GDPR-protected personal data). Some components may be open-sourced in the future.

| Name                                                       | Stack                               | Type        | Description                                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| model                                                      | Python, PyTorch, Pandas, Matplotlib | CLI tool    | Pipeline for training a phoneme-level GPT model on Polish IPA with custom tokenizer and multithreaded postprocessing tools. |
| asr                                                        | Python, Whisper                     | CLI tool    | CLI wrapper around OpenAI Whisper for batch automatic speech recognition with stereo-to-mono conversion.                    |
| datasets                                                   | Python, Pandas                      | CLI tool    | Data processing scripts for downloading, cleaning, and phonemizing OpenSubtitles, OSCAR, and Wikipedia corpora into IPA.    |
| survey                                                     | Python, Pandas                      | CLI tool    | CI-based tool for cleaning and standardizing Microsoft Forms exports with translation and data validation.                  |
| transcriptions                                             | Python                              | CLI tool    | CI-based repository scanner that verifies audio transcription structure and generates verification status reports.          |
| wordfreq-stress                                            | Python, Pandas                      | CLI tool    | Data processing scripts for Polish word frequency statistics and X-SAMPA syllabification with cleaning and alignment.       |
| [prodis-opus19.github.io](https://prodis-opus19.github.io) | HTML, CSS, JavaScript               | Website     | Main website for the PRODIS project, with experiment subpage for collecting data.                                           |
| fattura                                                    | C++17, SFML2                        | Desktop app | Cross-platform GUI app for editing verification statuses with auto-saving and keyboard navigation.                          |

---

## Personal Projects

I believe in the saying "if you want to understand how something works, build it yourself." My personal projects thus tackle challenging programming problems from the ground up. A notable example is `vroom`, a 2D game engine built from scratch.

As a developer, I also build tools to eliminate repeating problems that slow down my workflow. One such project is `header-warden`, a static C++ dependency checker that's now part of my C++ workflow.

| Name                                                             | Stack               | Type              | Description                                                                                                     |
| ---------------------------------------------------------------- | ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| [vroom](https://github.com/ryouze/vroom)                         | C++20, SFML3, ImGui | Game Engine       | Cross-platform 2D racing game with arcade drift physics, procedurally generated tracks, and waypoint AI.        |
| [header-warden](https://github.com/ryouze/header-warden)         | C++17               | CLI tool          | Cross-platform multithreaded CLI tool that identifies and reports missing standard library headers in C++ code. |
| [aegyo](https://github.com/ryouze/aegyo)                         | C++17, SFML3        | Desktop app       | Cross-platform GUI app for learning Korean Hangul with mouse and keyboard input.                                |
| [yt-table](https://github.com/ryouze/yt-table)                   | C++17               | CLI tool          | Cross-platform CLI tool for managing YouTube subscriptions locally through a shell-like interface.              |
| [asset-packer](https://github.com/ryouze/asset-packer)           | C17                 | CLI tool          | *nix CLI tool for embedding assets (e.g., images, sounds, fonts) into C++ headers.                              |
| [applefetch](https://github.com/ryouze/applefetch)               | C++17               | CLI tool          | macOS CLI system information tool, inspired by neofetch.                                                        |
| [py-template](https://github.com/ryouze/py-template)             | Python, Poetry      | Template          | Barebones Python project template with poetry and pytest setup.                                                 |
| [google-usa-search](https://github.com/ryouze/google-usa-search) | JavaScript          | Browser extension | Firefox extension that forces Google to display search results in American English.                             |
