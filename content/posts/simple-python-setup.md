+++
date = 2024-04-24T00:40:16+02:00
title = "Simple Python App Setup"
description = "How to setup a simple project for Python apps"
tags = ["tutorial", "python", "macos", "linux"]
type = "post"
showTableOfContents = true
+++

## Introduction

Many tutorials show you how to create a basic Python app with a couple of modules, but they rarely explain how to set up a whole project.

This guide will show you how to set up a simple Python project with automated testing and a [virtual environment](https://docs.python.org/3/tutorial/venv.html) for 3rd party packages. I have based it on [Dead Simple Python: Project Structure and Imports](https://dev.to/codemouse92/dead-simple-python-project-structure-and-imports-38c6) by [Jason C. McDonald](https://dev.to/codemouse92) with some opinionated changes.

This guide has been tested on macOS and GNU/Linux.

## Setup

### Download Python

First, you need to install Python. On macOS, you can install it with [Homebrew](https://brew.sh/). Do not use the Python version that comes pre-installed with macOS, as it's not only outdated but also integral to the OS.

```sh
brew install python3
```

Then, ensure it's installed by running:

```sh
python3 --version
```


### Create a Python Project

Create a new directory for your project and `cd` into it (e.g., `calculator`, `myapp`, etc.).

```sh
mkdir myapp
cd myapp
```

Create a directory called `src` for your Python code to create a [top-level package](https://stackoverflow.com/questions/7948494/whats-the-difference-between-a-module-and-package-in-python).

```sh
mkdir src
```

Create a bunch of Python modules in the top-level package.

```sh
touch src/__init__.py
touch src/__main__.py
touch src/app.py
```

You should have the following directory structure.

```
[~/myapp] $ tree
.
└── src
    ├── __init__.py
    ├── __main__.py
    └── app.py
```

Add the following to `src/app.py`.

```python
def run() -> None:
    print("Hello World!")
```

Add the following to `src/__main__.py`.

```python
from src import app


def main() -> None:
    app.run()


if __name__ == "__main__":
    main()
```

Run the app.

```sh
python3 -m src
```

```
Hello World!
```

Now let's go step by step through what you did.

1. You created a top-level package in the root of your project (e.g., `~/myapp/src`).
    ```sh
    mkdir src
    ```

2. You created a bunch of Python modules in the top-level *package* directory. Each package must contain an `__init__.py`. The `__main__.py` serves as the entry point to the app (launched using `python3 -m src`) and `app.py` houses the actual app's logic. You could technically put everything from `app.py` inside `__main__.py`. However, I prefer to keep `__main__.py` small, much like `main.cpp` in my C++ projects, where I wrap the actual app logic inside a try-catch block. The decision is up to you.
    ```sh
    touch src/__init__.py
    touch src/__main__.py
    touch src/app.py
    ```

3. In `src/app.py`, you defined a `run()` function that prints `Hello World!`.
    ```python
    def run() -> None:
        print("Hello World!")
    ```

4. In `src/__main__.py`, you used absolute imports to import the `app` module from the top-level `src` package. You then defined a `main()` function. This function executes when the script is ran directly using `python3 -m src`.
    ```python
    from src import app


    def main() -> None:
        app.run()


    if __name__ == "__main__":
        main()
    ```

    If you don't want to run the app using `python3 -m src`, you can run it using `python3 src/__main__.py`. However, in that case you must use relative imports.

    ```python
    import app

    def main() -> None:
        app.run()

    if __name__ == "__main__":
        main()
    ```

    For an app, I'd use absolute imports. For a collection of scripts, I'd use relative imports. The choice is yours.


### Create Subpackages

You can create subpackages in the top-level package directory. For example, you can create a `core` (or `common`) package that contains the core logic of your app that does not depend on anything else, an `io` package that contains input/output logic (e.g., reading from disk), a `tests` package that contains tests (optional), and a `utils` package that contains utility functions (e.g., normalizing and tokenizing a string).

Create a bunch of subpackages in the top-level package directory.

```sh
mkdir src/core
mkdir src/io
mkdir src/tests
mkdir src/utils
```

Add `__init__.py` to each of the subpackages.

```sh
touch src/core/__init__.py
touch src/io/__init__.py
touch src/tests/__init__.py
touch src/utils/__init__.py
```

Create two modules in the `core` and `io` subpackages: `config.py` and `disk.py`.

```sh
touch src/core/config.py
touch src/io/disk.py
```

You should have the following directory structure.

```
[~/myapp] $ tree
.
└── src
    ├── __init__.py
    ├── __main__.py
    ├── app.py
    ├── core
    │   ├── __init__.py
    │   └── config.py
    ├── io
    │   ├── __init__.py
    │   └── disk.py
    ├── tests
    │   └── __init__.py
    └── utils
        └── __init__.py
```

Add the following to `src/core/config.py`.

```python
verbose: bool = True
```

Add the following to `src/io/disk.py`.

```python
from src.core import config


def write_to_disk(file_path: str, data: str) -> None:
    with open(file_path, mode="w", encoding="utf-8") as f:
        if config.verbose:
            print(f"Writing data to '{file_path}'")
        f.write(data)
```

Modify `src/app.py` to use the `write_to_disk()` function.

```python
from src.io.disk import write_to_disk


def run() -> None:
    write_to_disk("output.txt", "Hello World!\n")
```

Now if you run the app, an `output.txt` file will be created with the content `Hello World!` in your CWD. Since the global `verbose` variable is set to `True`, the function will print a message to the console.

```sh
python3 -m src
```

```
Writing data to 'output.txt'
```

Now let's go step by step through what you did.

1. You created a bunch of subpackages in the top-level package directory. To keep in line with best practices, every package should contain an `__init__.py` file. This is not mandatory Python 3.3, but it's still a good idea to include it, as you can put initialization code there and define what is imported using `__all__`. Refer to the [official documentation](https://docs.python.org/3/tutorial/modules.html#packages) for more information.
    ```sh
    mkdir src/core
    mkdir src/io
    mkdir src/tests
    mkdir src/utils
    touch src/core/__init__.py
    touch src/io/__init__.py
    touch src/tests/__init__.py
    touch src/utils/__init__.py
    ```

2. You created two modules in the `core` and `io` subpackages.
    ```sh
    touch src/core/config.py
    touch src/io/disk.py
    ```

3. In `src/core/config.py`, you defined a `verbose` variable that can be set to `True` or `False` to control the verbosity of the program. This module contains global variables that can be read and modified by the program.
    ```python
    verbose: bool = True
    ```

4. In `src/io/disk.py`, you used absolute imports to import the `config` module from the `core` subpackage. You then defined a `write_to_disk()` function. This function writes data to a file on disk. If the `config.verbose` variable is set to `True`, the function prints a message to the console.
    ```python
    from src.core import config


    def write_to_disk(
        file_path: str,
        data: str,
    ) -> None:
        with open(file_path, mode="w", encoding="utf-8") as f:
            if config.verbose:
                print(f"Writing data to '{file_path}'")
            f.write(data)
    ```


### Create Tests

You can create [unit tests](https://docs.python.org/3/library/unittest.html) for your app. First, let's create something to test.

Create a `src/utils/case.py` module.

```sh
touch src/utils/case.py
```

Add the following to `src/utils/case.py`.

```python
def lower(
    text: str,
) -> str:
    return text.lower()
```

Create a `src/tests/test_case.py` module. The file name must start with `test_` to be discovered by the test runner (which will be explained later).

```sh
touch src/tests/test_case.py
```

Add the following to `src/tests/test_case.py`. You should create a test (beginning with `test_`) for each function in the `case.py` module. The test methods must be independent of each other and you can have multiple [assert methods](https://docs.python.org/3/library/unittest.html#assert-methods) within a single test method.

```python
import unittest

from src.utils import case


class TestCase(unittest.TestCase):
    def test_lower(
        self,
    ) -> None:
        self.assertEqual(case.lower("HELLO"), "hello")
        self.assertEqual(case.lower("WORLD"), "world")
        self.assertEqual(case.lower("GitHub"), "github")


if __name__ == "__main__":
    unittest.main()
```

You should have the following directory structure.

```
[~/myapp] $ tree
.
├── output.txt
└── src
    ├── __init__.py
    ├── __main__.py
    ├── app.py
    ├── core
    │   ├── __init__.py
    │   └── config.py
    ├── io
    │   ├── __init__.py
    │   └── disk.py
    ├── tests
    │   ├── __init__.py
    │   └── test_case.py
    └── utils
        ├── __init__.py
        └── case.py
```

Now you can run the tests. This will run all the tests in the `src/tests` package.

```sh
python3 -m unittest discover src.tests
```


### Create Virtual Environment

If you use any third-party libraries, you should create a [virtual environment](https://docs.python.org/3/tutorial/venv.html) to avoid conflicts with other projects. It might seem inconvenient at first, but you'll get used to it, because every Python developer has to deal with it due to the way Python handles packages. Do not install third-party libraries globally. In fact, some GNU/Linux distributions prohibit this, as it can break system packages that rely on specific versions of packages.

You can either create a virtual environment in the *root of the project* (`python3 -m venv ./env`) or in a *separate directory* (`python3 -m venv ~/.local/env/`). Most people seem to create the virtual environment in the *root of the project*, keeping all packages contained. For large libraries, it might be better to create a virtual environment in a separate directory, so they can be shared across multiple projects (e.g., `transformers`, `torch`, `tensorflow`, etc.). The choice is yours, but if you don't know what to do, I recommend creating a virtual environment in the *root of the project*.

Create a Python virtual environment for the project.

```sh
python3 -m venv ./env
```

Activate the virtual environment. You have to do this every time you open a new terminal. In VSCode, you can use the `Python: Select Interpreter` command to select the interpreter. Alternatively, [set the Python interpreter manually](https://code.visualstudio.com/docs/python/environments#_manually-specify-an-interpreter). Finally, enable `python.terminal.activateEnvInCurrentTerminal` to do this automatically every time you open a new terminal in VSCode.

```sh
. env/bin/activate
```

Create a `requirements.txt` file with the required dependencies in the root of your project (e.g., `~/myapp/requirements.txt`).

```sh
touch requirements.txt
```

Add the following to `requirements.txt`.

```
loguru
```

Install the required dependencies from the `requirements.txt` file. You can `pip3 install` the dependencies yourself but the point of `requirements.txt` is to make it easier for others to install the dependencies required for your project. You can also specify the version of the package you want to install by adding `==` followed by the version number (e.g., `loguru==0.5.3`). This is useful if you want to ensure that the package's developer doesn't break your app by releasing a new version that breaks compatibility. Having said that, if you're just starting out, then you shouldn't specify the version number to keep things simple.

```sh
pip3 install -r requirements.txt
```

Modify `src/__main__.py` to use the `loguru` for logging.

```python
from loguru import logger

from src import app


def main() -> None:
    logger.info("Running app")
    app.run()
    logger.success("App ran successfully")


if __name__ == "__main__":
    main()
```

Now if you run the app, you will see log messages in the console.

```sh
python3 -m src
```

```
2024-08-22 18:01:35.634 | INFO     | __main__:main:7 - Running app
Writing data to 'output.txt'
2024-08-22 18:01:35.634 | SUCCESS  | __main__:main:9 - App ran successfully
```

That's it.


## Final Thoughts

This guide should give you a basic understanding of how to set up a simple Python project with automated testing and a virtual environment for 3rd party packages.

Don't forget to add `env` to your `.gitignore`, so you don't accidentally commit 500 MB of packages to your GitHub repository.

```
/env
```
