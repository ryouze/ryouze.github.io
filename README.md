# ryouze.github.io

[![CD: Deploy website to GitHub Pages](https://github.com/ryouze/ryouze.github.io/actions/workflows/cd-deploy-website.yml/badge.svg)](https://github.com/ryouze/ryouze.github.io/actions/workflows/cd-deploy-website.yml)

Personal website built using [Hugo](https://gohugo.io/), available at [ryouze.net](https://ryouze.net/).

## Build

1. **Clone the repository**:

   ```sh
   git clone --recurse-submodules https://github.com/ryouze/ryouze.github.io
   ```

2. **Change into the project directory**:

   ```sh
   cd ryouze.github.io
   ```

3. **Build the project**:

   ```sh
   hugo --gc --minify
   ```

   - `--gc` = clean unused cache files (e.g., resized images).
   - `--minify` = compress HTML/CSS/JS.

After successful build, the generated static files are written to the `public` directory.

## Development

To create a new post:

```sh
hugo new posts/title.md
```

> [!NOTE]
> Hugo creates new content as drafts. Set `draft = false` before publishing so CI includes the page.

To start the Hugo server locally and view changes in real time:

```sh
hugo server --buildDrafts
```

## Credits

- [Hugo](https://gohugo.io/)
- [Gokarna](https://github.com/526avijitgupta/gokarna)
