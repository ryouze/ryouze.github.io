+++
title = "Projects"
type = "page"
description = "Portfolio of my work, including CLI tools, desktop applications, and machine learning projects."
+++

## Professional Work

I currently work at [EPR Labs](https://epr-labs.com), where I develop software and data pipelines for training, evaluating, and deploying predictive and generative ML models in Python.

Previously, as part of the [PRODIS project](https://prodis-opus19.github.io), I developed the complete ML and data processing infrastructure, including the first [phoneme-level GPT model for Polish](https://arxiv.org/abs/2404.10112).

Due to legal and privacy restrictions involving GDPR-protected data, most source code cannot be released publicly. Select components may be open-sourced later.

| Name                                                         | Stack                          | Type    | Description                                                                                                                                                                         |
| ------------------------------------------------------------ | ------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phoneme-level GPT pipeline                                   | Python, PyTorch, NumPy, Pandas | CLI     | Pipeline for training a phoneme-level GPT model to predict surprisal in Polish. Custom IPA tokenizer, parallelized formant extraction, and automatic alignment + stress annotation. |
| Bulk automatic speech recognition                            | Python, Whisper, FFmpeg        | CLI     | Pipeline for bulk automatic speech recognition (ASR) using OpenAI Whisper. Also performs stereo-to-mono conversion using FFmpeg.                                                    |
| Dataset preparation                                          | Python, Pandas                 | CLI     | Data processing scripts for downloading, cleaning, and phonemizing OpenSubtitles, OSCAR, and Wikipedia corpora into IPA.                                                            |
| Survey cleaner                                               | Python, Pandas                 | CLI     | CI-based tool for cleaning and standardizing Microsoft Forms exports with Polish-to-English translation and data validation.                                                        |
| Transcriptions status                                        | Python                         | CLI     | CI-based repository scanner that verifies audio transcription structure and generates verification status reports.                                                                  |
| Word frequency                                               | Python, Pandas                 | CLI     | Data processing scripts for Polish word frequency statistics and X-SAMPA syllabification with cleaning and alignment.                                                               |
| [`prodis-opus19.github.io`](https://prodis-opus19.github.io) | HTML, CSS, JavaScript          | Website | Main website for the PRODIS project, with experiment subpage for collecting data.                                                                                                   |
| Fattura                                                      | C++17, SFML2                   | Desktop | Simple cross-platform GUI app for editing verification statuses with auto-saving and keyboard navigation.                                                                           |

---

## Personal Projects

| Name                                                       | Stack                             | Type    | Description                                                                                         |
| ---------------------------------------------------------- | --------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| [`vroom`](https://github.com/ryouze/vroom)                 | C++20, SFML3, ImGui               | Game    | 2D racing game with arcade drift physics, procedurally generated tracks, and waypoint-based AI.     |
| [`yt`](https://github.com/ryouze/yt)                       | Python, Streamlit, SQLite, Docker | Web app | YouTube subscription manager.                                                                       |
| [`header-warden`](https://github.com/ryouze/header-warden) | C++17                             | CLI     | CLI tool that identifies and reports missing standard library headers in C++ code.                  |
| [`aegyo`](https://github.com/ryouze/aegyo)                 | C++17, SFML3                      | Desktop | GUI app for learning Korean Hangul.                                                                 |
| [`ungpt`](https://github.com/ryouze/ungpt)                 | C++20, SFML3                      | Desktop | GUI app that converts ChatGPT's smart punctuation and symbols to plain ASCII.                       |
| [`yt-table`](https://github.com/ryouze/yt-table)           | C++17                             | CLI     | CLI for managing YouTube subscriptions. See the newer [`yt`](https://github.com/ryouze/yt) instead. |
| [`asset-packer`](https://github.com/ryouze/asset-packer)   | C17                               | CLI     | CLI tool for embedding assets (e.g., images, sounds, fonts) into C++ headers.                       |
| [`applefetch`](https://github.com/ryouze/applefetch)       | C++17                             | CLI     | CLI system information tool inspired by neofetch.                                                   |
