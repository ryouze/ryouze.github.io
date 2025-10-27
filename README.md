# ryouze.github.io

[![Deploy Hugo site to Pages](https://github.com/ryouze/ryouze.github.io/actions/workflows/hugo.yml/badge.svg)](https://github.com/ryouze/ryouze.github.io/actions/workflows/hugo.yml)

ryouze.github.io is a personal website built using [Hugo](https://gohugo.io/).

The website is hosted on [GitHub Pages](https://pages.github.com/) and is accessible at the custom domain [ryouze.net](https://ryouze.net/).


## Motivation

I wanted a personal blog to share my programming tutorials. I chose Hugo because it allows me to write content in Markdown and generate static HTML files that can be hosted on GitHub Pages with minimal effort.

I included a manual theme update script (`update-theme.sh`) because I could not get the theme to update automatically using Git submodules when running GitHub Actions.


## Features

- Automatic rebuilds using GitHub Actions.
- Simple content management with Markdown.


## Project Structure

The project is organized as follows:

- `.github`: GitHub Actions workflows (for automatic rebuilds).
- `archetypes`: Templates for new posts (e.g., title and date).
- `content`: Actual website content (posts and projects).
- `public`: Hugo-generated output website (will be built by CI/CD on push).
- `static`: Static files (e.g., images, GIFs, videos).
- `themes`: Theme used by the website.


## Tested Systems

This project has been tested on the following systems:

- macOS 15.7 (Sonoma)

Automated builds are performed on the latest versions of Linux.


## Requirements

To build this project, you'll need:

- Hugo


## Build

Follow these steps to build the project:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/ryouze/ryouze.github.io.git
    ```

2. **Change into the project directory**:

    ```sh
    cd ryouze.github.io
    ```

3. **(Optional) Update the Gokarna theme**:

    ```sh
    ./update-theme.sh
    ```

    This script fetches the latest theme files using `git`.

4. **Build the project**:

    ```sh
    hugo --gc --minify
    ```

    - `--gc` cleans Hugo's resource cache so no outdated assets are published.
    - `--minify` compresses HTML/CSS/JS.

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
hugo server -D
```

`-D` serves content marked as drafts, which is handy while editing new posts.

To update the Gokarna theme:

```sh
./update-theme.sh
```

> [!TIP]
> Consider using [imageresizer.com](https://imageresizer.com/) to convert images to WebP format for faster loading.


## Credits

- [Hugo](https://gohugo.io/)
- [Gokarna](https://github.com/526avijitgupta/gokarna)


## Contributing

All contributions are welcome.


## License

This project is licensed under the GNU GPLv3 License.
