# ryouze.net

ryouze.net is a personal website built using [Hugo](https://gohugo.io/).

The website is hosted on [GitHub Pages](https://pages.github.com/) and is accessible at the custom domain [ryouze.net](https://ryouze.net/).


## Motivation

I wanted a personal blog to share my programming tutorials. I chose Hugo because it allows me to write content in Markdown and generate static HTML files that can be hosted on GitHub Pages with minimal effort.

I also included a manual theme update script (`update-theme.sh`), because I couldn't get the theme to update automatically using git submodules when using GitHub Actions.


## Features

- Automatic rebuilds using GitHub Actions.
- Easy content management with Markdown.


## Project Structure

The project is organized as follows:

- `.github`: Contains GitHub Actions workflows (for automatic rebuilds).
- `archetypes`: Contains templates for new posts (e.g., title, date).
- `assets`: Contains static assets (e.g., images).
- `content`: Contains the actual content of the website (posts).
- `data`: Contains configuration files (e.g., JSON, TOML, YAML).
- `i18n`: Contains internationalization files for multilingual websites.
- `layouts`: Contains templates for the website.
- `public`: Contains the generated static files.
- `static`: Contains static files (e.g., CSS, JavaScript).
- `themes`: Contains the theme used by the website.


## Tested Systems

This project has been tested on the following systems:

- macOS 14.4 (Sonoma)

Automated builds are performed on the latest versions of GNU/Linux.


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

To start the Hugo server locally and view changes in real-time:

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


## Credits

- [Hugo](https://gohugo.io/)
- [Gokarna](https://github.com/526avijitgupta/gokarna)


## Contributing

All contributions are welcome.


## License

This project is licensed under the GNU GPLv3 License.
