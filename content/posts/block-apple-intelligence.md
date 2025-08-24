+++
date = 2025-02-10T20:14:59+01:00
title = "Block Apple Intelligence in macOS 15.3"
description = "How to block Apple Intelligence from being enabled by default in macOS 15.3 (Sequoia)"
tags = ["Tutorial", "macOS", "AI"]
type = "post"
showTableOfContents = true
image = "/images/block-apple-intelligence-preview.webp"
+++

![Preview](/images/block-apple-intelligence-preview.webp)

## Introduction

With macOS 15.3, **Apple Intelligence is [enabled by default](https://arstechnica.com/gadgets/2025/01/ios-18-3-disables-controversial-ai-generated-news-app-notifications/)**.

If you're not interested in [beta-testing for free](https://arstechnica.com/apple/2024/11/apple-intelligence-notification-summaries-are-honestly-pretty-bad/), there is a simple workaround to prevent it from being opt-out (at least for now).


## How to Disable Apple Intelligence

![Screenshot of System Settings](/images/apple-intelligence-is-not-available.webp)

1. Open **System Settings** > **Apple Intelligence & Siri**.
2. **Enable Siri** (you can't change the language without enabling Siri first).
3. Change the Siri language to **something other than your primary language**. Some regional variations (e.g., English (UK)) *may* work, but for extra safety, I chose **Korean**.
4. (Optional) **Disable Siri** again if you don't use it.

After doing this, you should see a message saying:

> Apple Intelligence is not available when Siri is set to Korean.

Perfect. Time to update from 15.2.


## Bonus

You can also use the **Content & Privacy** settings to disable other Apple Intelligence features for good measure. This approach, however, enables content restrictions, so it might not be suitable for everyone.

1. Open **System Settings** > **Screen Time** > **Content & Privacy**.
2. Enable **Content & Privacy**.
3. Open **Intelligence & Siri**.
4. Turn all Apple Intelligence settings off:
   - Image Creation
   - Writing Tools
   - ChatGPT Extension

![Screenshot of Content & Privacy in System Settings](/images/apple-intelligence-content-and-privacy.webp)
