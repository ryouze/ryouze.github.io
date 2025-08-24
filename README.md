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

- macOS 15.6 (Sonoma)

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

2. **Update the Gokarna theme (optional)**:

    ```sh
    cd ryouze.github.io
    chmod +x update-theme.sh
    ./update-theme.sh
    ```

3. **Build the project**:

    ```sh
    hugo --minify
    ```

After successful build, you can access the generated static files in the `public` directory.


## Usage

To create a new post:

```sh
hugo new posts/title.md
```

To start the Hugo server locally and view changes in real time:

```sh
hugo server
```

To build the site and generate static files:

```sh
hugo
```

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
