# AGENTS.md

**ryouze.github.io** is a personal Hugo site using the Gokarna theme, deployed via GitHub Pages at https://ryouze.net/.

---

## Technology Stack

| Component                | Description                                     |
| ------------------------ | ----------------------------------------------- |
| **Language**             | Markdown, TOML                                  |
| **Build System**         | Hugo                                            |
| **Theme**                | Gokarna (managed locally via `update-theme.sh`) |
| **Hosting**              | GitHub Pages                                    |
| **Supported OS**         | macOS (development), Linux (CI/CD)              |
| **Primary Dev Platform** | macOS 15+                                       |

---

## Repository Layout

```
/.github/                    # CI/CD workflows and automation
/archetypes/                 # Templates for new posts
/content/                    # Posts (website content)
/content/contact.md          # Tab: Contact (e-mail and social media)
/content/index-about.md      # Homepage
/content/posts/              # Blog posts (most content lives here)
/content/projects/_index.md  # Tab: Projects (portfolio of GitHub work)
/public/                     # Generated website (output of Hugo build)
/static/                     # Static files (images, gifs, videos)
/static/images/              # Images used in blog posts
/themes                      # Website theme (Gokarna)
hugo.toml                    # Hugo configuration
update-theme.sh              # Script to update Gokarna theme
```

---

## Common Tasks

- Create a new blog post: `hugo new posts/title.md`
- Run the local dev server: `hugo server`
- Build without minification: `hugo`
- Build with minification: `hugo --minify`
- Update the theme manually: `./update-theme.sh`
