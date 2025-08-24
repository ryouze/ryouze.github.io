+++
date = 2025-08-24T14:23:55+02:00
title = "IPython Cheatsheet"
description = "A cheatsheet with useful IPython commands and features."
tags = ["Python", "IPython", "Notes", "Cheatsheet"]
type = "post"
showTableOfContents = true
image = "/images/ipython-cheatsheet.webp"
+++

![Preview](/images/ipython-cheatsheet.webp)

## Introduction

I recently started a job as a machine learning engineer and was told to learn IPython. Until now, I had only seen it bundled with Jupyter Notebook, and when I tried it, it looked like a regular Python REPL with syntax highlighting. I didn't see the point.

After some research, I realized it's actually quite useful. Allow me to explain.

I don't like Jupyter Notebooks because they feel bloated and take a long time to start. Thankfully, VSCode can open them, so at least my formatter and linter combo (Ruff) still works.

IPython started in 2001 as an enhanced interactive Python shell with features like tab completion, rich introspection, and inline help. Over time it grew into the project that created the web-based notebook interface. In 2014, that notebook component was [split into Jupyter](https://blog.jupyter.org/the-big-split-9d7b88a031a7), which generalized the idea of interactive notebooks beyond Python to support many languages through "kernels." IPython itself continues as the Python kernel for Jupyter, while also being available as a standalone REPL in your terminal.

In other words: Jupyter gives you the notebook interface, IPython provides the engine behind it. Running IPython directly feels like using a Notebook without the clunky web UI. On top of that, it offers powerful magic commands, including built-in ones that make debugging easier.

This post is a cheatsheet of useful IPython commands and features, based on [Sebastian Witowski's talk](https://www.youtube.com/watch?v=S9rgGJYAQ8o) *IPython can do that?!* from freeCodeCamp Talks. I've added some extra notes, but full credit goes to him. Thanks, Sebastian!

## Installation

To install IPython, use pip:

```sh
pip install ipython
```

## Core Concepts

### Caching

IPython caches the [input and output of each command](https://ipython.org/ipython-doc/3/interactive/reference.html#input-caching-system), which can be accessed via global variables.

To prevent storing an output in the cache, end the line with a semicolon (`;`). This [hides the result](https://ipython.readthedocs.io/en/stable/interactive/tips.html#suppress-output) and excludes it from `Out`.

#### Input Caching

Input commands are stored in global variables for easy access.

| Variable             | Description                     | Example  |
| -------------------- | ------------------------------- | -------- |
| `_i`, `_ii`, `_iii`  | Last three input commands.      | `_i`     |
| `_i<cell_number>`    | Input from a specific cell.     | `_i9`    |
| `_ih[<cell_number>]` | List of all inputs (1-indexed). | `_ih[9]` |
| `In[<cell_number>]`  | Same as `_ih`.                  | `In[9]`  |

```ipython
In [9]: 1+2
Out[9]: 3

In [10]: _i
Out[10]: '1+2'

In [11]: _i9
Out[11]: '1+2'
```

#### Output Caching

Output results are also stored in global variables.

| Variable             | Description                               |
| -------------------- | ----------------------------------------- |
| `_`, `__`, `___`     | Last three output results.                |
| `_<cell_number>`     | Output from a specific cell (e.g., `_9`). |
| `_oh[<cell_number>]` | Dictionary of all outputs (1-indexed).    |
| `Out[<cell_number>]` | Same as `_oh`.                            |

### Help and Introspection

| Command                | Description                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `?object` or `object?` | Show [help](https://ipython.readthedocs.io/en/stable/interactive/python-ipython-diff.html#accessing-help) for an object (e.g., `?str.replace`). |
| `object??`             | Show source code for an object (when available).                                                                                                |
| `*text*?`              | Search for objects with [wildcards](https://ipython.readthedocs.io/en/stable/api/generated/IPython.utils.wildcard.html) (e.g., `os.*dir*?`).    |
| **CTRL + R**           | Search command history.                                                                                                                         |

### Shell Interaction

You can run shell commands directly from IPython. Commands starting with `!` are treated as [shell commands](https://ipython.readthedocs.io/en/stable/interactive/shell.html), and some common ones (`cd`, `ls`, `pwd`, etc.) are available as magics without the `!`.

```ipython
In [1]: !echo "hello world" > new_file
In [2]: !cat new_file
hello world
```

#### Aliases

Create aliases for shell commands using the [`%alias`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#alias) magic function.

```ipython
In [1]: %alias lr ls -alrt
In [2]: lr
total 8
-rw-r--r--   1 user  staff    12 May 26 20:17 new_file
-rw-r--r--   1 user  staff     0 May 26 20:16 test_file

In [3]: %alias print_args echo %s %s
In [4]: %print_args hello world
hello world
```

#### Rehashing

The [`%rehashx`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#rehashx) magic loads all executables from your `$PATH` into the IPython alias table, allowing you to call them without the `!` prefix.

## Magic Functions

Magic functions are special commands prefixed with `%` (line magics) or `%%` (cell magics).

* **Line Magics (`%`):** Operate on a single line of input.
* **Cell Magics (`%%`):** Operate on the entire cell (multiple lines of input).

Use [`%lsmagic`](https://ipython.readthedocs.io/en/stable/interactive/magics.html) to list all available magic functions.

### Common Magic Commands

| Magic                                                                                                                                                                   | Description                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`%history`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#history)                                                                                  | Print input history with powerful filtering options.              |
| [`%edit`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#edit)                                                                                        | Open an editor to write and execute code.                         |
| [`%run`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#run)                                                                                          | Run a Python script and load its data into the current namespace. |
| [`%rerun`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#rerun)                                                                                      | Rerun a command or a range of commands from history.              |
| [`%recall`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#recall) / [`%rep`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#rep)   | Recall or re-execute a command from history.                      |
| [`%macro`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#macro)                                                                                      | Define a macro from previous input commands.                      |
| [`%save`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#save)                                                                                        | Save a range of input history to a file.                          |
| [`%pastebin`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#pastebin)                                                                                | Upload code to a pastebin service.                                |
| [`%store`](https://ipython.readthedocs.io/en/stable/config/extensions/storemagic.html)                                                                                  | Store variables, aliases, or macros for use in future sessions.   |
| [`%who`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#who) / [`%whos`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#whos)       | List all interactive variables.                                   |
| [`%xmode`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#xmode)                                                                                      | Control the verbosity of exception tracebacks.                    |
| [`%debug`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#debug) / [`%pdb`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#pdb)     | Debug code interactively.                                         |
| [`%time`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#time) / [`%timeit`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#timeit) | Time code execution.                                              |
| [`%prun`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#prun)                                                                                        | Run code with the Python profiler.                                |

### Top 3 Magic Commands

Out of that list, here are the top 3 most interesting / useful ones.

#### `%history`

* `%history`: Print the entire history.
* `%history 5`: Print line 5.
* `%history 2-3 5 7-9`: Print a mix of ranges and single lines.
* `%history ~2/7`: Print line 7 from two sessions ago.
* `%history ~8/1-~6/5`: Print from the 1st line 8 sessions ago to the 5th line 6 sessions ago.

#### `%edit`

Opens a temporary file in your default editor (`$EDITOR`). The code is executed upon saving and closing.

* `%edit`: Open a new temporary file.
* `%edit -p`: Open the previous temporary file for editing.
* `%edit <filename>`: Open a specific file.
* `%edit <variable>`: Open a file with the content of the variable.
* `%edit <object>`: Open the source file where the object is defined.

Docs: [`%edit`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#edit).

#### `%run`

Executes a Python script. Useful for testing modules without repeated imports.

* `%run my_script.py`
* Combine with the [`%autoreload`](https://ipython.readthedocs.io/en/stable/config/extensions/autoreload.html) extension to automatically reload modules before execution:

  ````ipython
  %load_ext autoreload
  %autoreload 2
  ```

### Cell Magics for Other Languages

IPython can execute other languages via the `%%script` family and helpers like `%%bash`, which run external interpreters as subprocesses. These do not require separate Jupyter kernels. Display-oriented magics like `%%javascript`, `%%html`, and `%%latex` render rich outputs and are most useful in notebooks.

```ipython
In [2]: %%script python2
...: print "but" "this" "will"
...:
but this will

In [3]: %%script ruby
...: puts "hello from Ruby!"
...:
hello from Ruby!
```

As a side-note, IPython's architecture separates the frontend (REPL) from the backend (kernel). This allows you to use the IPython interface with kernels for other languages like Julia, R, or JavaScript.

* Find kernels on the [Jupyter kernels list](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels).
* Start IPython with a specific kernel: `jupyter console --kernel <kernel_name>`.

## Customization

### Writing Your Own Magic Functions

1. Write a Python function that accepts at least one parameter (the string passed to the magic).
2. Decorate it with `@register_line_magic` or `@register_cell_magic`.

```python
from IPython.core.magic import register_line_magic


@register_line_magic("reverse")  # The name of the magic function
def lmagic(line):
    """Line magic to reverse a string."""
    return line[::-1]
```

**Usage:**

```ipython
In [2]: %reverse hello world
Out[2]: 'drow olleh'
```

Docs: [Defining custom magics](https://ipython.readthedocs.io/en/stable/config/custommagics.html).

### Extensions

Package your magic functions into reusable extensions.

1. **Create an extension file**: Create a Python file (e.g., `reverser.py`)
2. **Define `load_ipython_extension`**: This function is the entry point for your extension.

```python
# ~/.ipython/extensions/reverser.py
from IPython.core.magic import register_line_magic


def load_ipython_extension(ipython):
    @register_line_magic("reverse")
    def lmagic(line):
        """Line magic to reverse a string."""
        return line[::-1]

    # The 'ipython' argument is the active InteractiveShell instance.
    # You can also define an unload_ipython_extension(ipython) function.
```

3. **Load the extension**:

```ipython
In [1]: %load_ext reverser
In [2]: %reverse Hello world!
Out[2]: '!dlrow olleH'
```

**Note**: While placing extensions in `~/.ipython/extensions` works, the recommended modern approach is to package them and install them via PyPI.

Docs: [IPython extensions and `load_ipython_extension`](https://ipython.readthedocs.io/en/stable/config/extensions/index.html).

### Startup Files

For simpler customizations, place Python scripts (`.py` or `.ipy`) in `~/.ipython/profile_default/startup/`. These scripts run every time IPython starts, making it easy to define helper functions or import common modules.

```python
# Example: ~/.ipython/profile_default/startup/my_magic.py
from IPython.core.magic import register_line_magic


@register_line_magic("reverse")
def lmagic(line):
    """Line magic to reverse a string."""
    return line[::-1]
```

Docs: [Configuration intro, profiles, and startup files](https://ipython.readthedocs.io/en/stable/config/intro.html).

### Configuration and Profiles

* **Configuration File**: Run `ipython profile create` to generate the default configuration file at `~/.ipython/profile_default/ipython_config.py`. This file contains a vast number of options to customize IPython's behavior.
* **Profiles**: Create separate profiles for different workflows using `ipython profile create <profile_name>`. Launch IPython with a specific profile using `ipython --profile=<profile_name>`. This allows you to have different startup files, extensions, and configurations for different tasks.

Docs: [Configuration intro](https://ipython.readthedocs.io/en/stable/config/intro.html).

## Debugging

IPython provides powerful, integrated debugging capabilities.

### Embedding IPython

You can embed an IPython shell anywhere in your code to inspect its state at that point. This is useful for pausing execution and exploring variables interactively.

To do this, import the `embed` function from IPython and call it.

```python
# embedding_example.py
a = 10
b = 15

from IPython import embed; embed()  # Embed shell here
print(f"a+b = {a + b}")
```

Placing `from IPython import embed;` and `embed()` on a single line makes it easy to remove later because it often triggers a linting warning, reminding you to remove it before committing your code.

When you run the script, an IPython shell will open at the `embed()` call. You can inspect and even change variables. Exiting the embedded shell (with `exit` or `Ctrl-D`) will resume the script's execution.

```
$ python embedding_example.py
IPython 9.4.0 -- An enhanced Interactive Python.

In [1]: a
Out[1]: 10

In [2]: b = 100

In [3]: exit
a+b = 110
```

### The `ipdb` Debugger

IPython's debugger, `ipdb`, is an enhanced version of Python's standard `pdb` with features like syntax highlighting, tab completion, and better tracebacks.

#### Running a Script with the Debugger

Use the [`%run -d`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#run) magic command to run a script from the beginning with the debugger. It will place a breakpoint on the first line.

```ipython
In [1]: %run -d my_file.py
Breakpoint 1 at /path/to/my_file.py:1
NOTE: Enter 'c' at the ipdb> prompt to continue execution.
> /path/to/my_file.py(1)<module>()
----> 1 a = 10
      2 b = 15
      3 print(f"a+b = {a+b}")

ipdb> next
> /path/to/my_file.py(2)<module>()
      1 a = 10
----> 2 b = 15
      3 print(f"a+b = {a+b}")

ipdb> continue
a+b = 25
```

#### Post-Mortem Debugging with `%debug`

If your code crashes with an exception, you can run the [`%debug`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#debug) magic command immediately afterward. This will start the debugger at the exact point where the exception occurred, allowing you to inspect the call stack and variables to understand the cause of the error. This is incredibly useful for diagnosing issues without having to re-run a long script with the debugger enabled from the start.

```python
# my_broken_function.py
def function2(n):
    a_list = [1, 2, 3, 4]
    total = sum(a_list)
    total += a_list[n]  # This will raise an IndexError
    return total


def function1():
    return function2(5)


function1()
```

```ipython
In [1]: %run my_broken_function.py
---------------------------------------------------------------------------
IndexError                                Traceback (most recent call last)
...
IndexError: list index out of range

In [2]: %debug
> /path/to/my_broken_function.py(4)function2()
      2     a_list = [1, 2, 3, 4]
      3     total = sum(a_list)
----> 4     total += a_list[n] # This will raise an IndexError
      5     return total

ipdb> print(n)
5
ipdb> print(a_list)
[1, 2, 3, 4]
```

#### Automatic Debugger with `%pdb`

Run the [`%pdb`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#pdb) magic command to toggle automatic debugger activation. When it's ON, IPython will automatically start the debugger whenever an unhandled exception occurs.

```ipython
In [1]: %pdb
Automatic pdb calling has been turned ON

In [2]: 1/0
---------------------------------------------------------------------------
ZeroDivisionError                         Traceback (most recent call last)
...
ZeroDivisionError: division by zero
> <ipython-input-2-9e1622b385b6>(1)<module>()
----> 1 1/0

ipdb>
```

### Exception Verbosity (`%xmode`)

Control the level of detail in exception tracebacks.

* `%xmode Minimal`: Most concise, shows only the exception type and message.
* `%xmode Plain`: Standard traceback.
* `%xmode Context`: Default, shows context around the error line.
* `%xmode Verbose`: Most detailed, includes local and global variables for each frame in the stack trace.

Docs: [`%xmode`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#xmode).

## Profiling

IPython provides excellent tools to measure code execution time and identify performance bottlenecks.

### Measuring Execution Time with `%time` and `%timeit`

* **`%time`**: A simple magic to measure the execution time of a single statement. It runs the code once and reports the CPU and wall clock time.

  ```ipython
  In [2]: %time run_calculations()
  CPU times: user 2.68 s, sys: 10.9 ms, total: 2.69 s
  Wall time: 2.71 s
  ```
* **`%timeit`**: A more robust tool for timing. It automatically runs a statement multiple times to get a reliable average execution time and standard deviation. It's smart enough to adjust the number of loops based on how long the code takes to run.

  ```ipython
  In [5]: %timeit run_calculations()
  2.82 s ± 124 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
  ```
* **`%%timeit`**: The cell magic version of `timeit`, which is convenient for timing multiline code blocks. You can also provide setup code that runs once but is not included in the timing measurement.

  ```ipython
  In [1]: %%timeit
     ...: total = 0
     ...: for x in range(10000):
     ...:     total += x
  2.7 s ± 25.7 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
  ```

Docs: [`%time` and `%timeit`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-timeit).

### Function Profiling with `%prun`

When you know your code is slow, `%prun` helps you find out *why*. It runs your code with the standard Python `cProfile` profiler and provides a detailed report showing how many times each function was called and the total time spent inside each one. This is invaluable for pinpointing bottlenecks.

```ipython
In [1]: %prun a_slow_function()
         50035004 function calls in 12.653 seconds

   Ordered by: internal time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
    10000    8.683    0.001   12.645    0.001 my_file.py:6(helper_function)
 49995000    3.956    0.000    3.956    0.000 my_file.py:15(check_factor)
...
```

The output shows that most of the time is spent in `helper_function`, making it the primary candidate for optimization.

Docs: [`%prun`](https://ipython.readthedocs.io/en/stable/interactive/magics.html#prun).

### Line-by-Line Profiling with `%lprun`

For an even more granular view, the `%lprun` magic profiles your code on a line-by-line basis. It shows how much time was spent executing each line of a function.

1. **Install**: `pip install line_profiler`
2. **Load extension**: `%load_ext line_profiler`
3. **Run**: `%lprun -f function_to_profile code_to_run()`

You must specify which function(s) to profile with the `-f` flag.

```ipython
In [1]: %lprun -f important_function long_running_script()
Timer unit: 1e-06 s

Total time: 27.3258 s
File: /path/to/my_file.py
Function: important_function at line 1

# Line #   Hits     Time     Per Hit   % Time   Line Contents
==============================================================
 1                                           def important_function(a, num):
 2   10000     27310547  2731.1   99.9        b = helper_function(a, num)
 3   10000     11686.0      1.2    0.0        b += 10
 4   10000      3560.0      0.4    0.0        return b
```

Docs: [`line_profiler` and `%lprun`](https://kernprof.readthedocs.io/en/latest/). Note: this works best when the profiled function is defined in a file rather than the interactive namespace.

### Memory Profiling with `%mprun`

Similar to the line profiler, the memory profiler (`%mprun`) analyzes memory usage on a line-by-line basis, helping you find memory leaks or inefficient memory usage.

1. **Install**: `pip install memory_profiler`
2. **Load extension**: `%load_ext memory_profiler`
3. **Run**: `%mprun -f function_to_profile code_to_run()`

```ipython
In [1]: %mprun -f memory_intensive memory_intensive()
Filename: /path/to/my_file.py

# Line #    Mem usage    Increment   Line Contents
==============================================================
 1     57.4 MiB     57.4 MiB   def memory_intensive():
 2    820.3 MiB    762.9 MiB       a = [1] * (10 ** 8)
 3   2159.0 MiB   1338.6 MiB       b = [2] * (2 * 10 ** 8)
 4    618.1 MiB  -1540.9 MiB       del b
 5    618.1 MiB      0.0 MiB       return a
```

Docs: [`memory_profiler` and `%mprun` on PyPI](https://pypi.org/project/memory-profiler/). Note: the function generally needs to live in a module on disk; memory measurement can vary by OS. ([PyPI][13])

## Advanced Features

### Asynchronous Code

IPython supports top-level `await`, allowing you to run asynchronous code directly in the REPL, which is a `SyntaxError` in the standard Python REPL.

```ipython
In [1]: import aiohttp
In [2]: session = aiohttp.ClientSession()
In [3]: response = await session.get("https://api.github.com")
In [4]: response
Out[4]: <ClientResponse(https://api.github.com) [200 OK]>
```

Docs: [Autoawait in IPython](https://ipython.readthedocs.io/en/stable/interactive/autoawait.html) and the `InteractiveShell.autoawait` option in [terminal options](https://ipython.readthedocs.io/en/latest/config/options/).

### Events and Hooks

IPython has an event system to register callbacks for events like `pre_execute` or `post_run_cell`. Hooks are similar but are used for specific actions where only one handler should succeed (e.g., opening an editor).

**Example: An event callback to print variables after each cell execution.**

```python
# varprinter.py (in ~/.ipython/extensions/)
class VarPrinter:
    def __init__(self, ip):
        self.ip = ip

    def post_run_cell(self, result):
        print("--- Variables after cell execution: ---")
        self.ip.run_line_magic("whos", "")


def load_ipython_extension(ip):
    vp = VarPrinter(ip)
    ip.events.register("post_run_cell", vp.post_run_cell)
```

Load with `%load_ext varprinter`.

Docs: [Event loop integration](https://ipython.readthedocs.io/en/stable/config/eventloops.html) and extension API references above.

## Alternatives to IPython

* **bpython**: A lightweight REPL with syntax highlighting, autocompletion, and a "rewind" feature.
* **ptpython**: A more advanced REPL built on `prompt_toolkit`, offering multiline editing, syntax validation, and Vim/Emacs modes.
* **xonsh**: A Python-powered shell language that is a superset of Python, combining shell and Python syntax.
