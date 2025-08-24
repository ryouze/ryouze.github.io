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

IPython started in 2001 as an enhanced interactive Python shell with features like tab completion, rich introspection, and inline help. Over time it grew into the project that created the web-based notebook interface. In 2014, that notebook component was split into Jupyter, which generalized the idea of interactive notebooks beyond Python to support many languages through "kernels." IPython itself continues as the Python kernel for Jupyter, while also being available as a standalone REPL in your terminal.

In other words: Jupyter gives you the notebook interface, IPython provides the engine behind it. Running IPython directly feels like using a Notebook without the clunky web UI. On top of that, it offers powerful magic commands, including built-in ones that make debugging easier.

This post is a cheatsheet of useful IPython commands and features, based on [Sebastian Witowski's talk](https://www.youtube.com/watch?v=S9rgGJYAQ8o) *IPython can do that?!* from freeCodeCamp Talks. I've added some extra notes, but full credit goes to him. Thanks, Sebastian!

## Installation

To install IPython, use pip:
```sh
pip install ipython
```

## Core Concepts

### Caching
IPython caches the input and output of each command, which can be accessed via global variables. To prevent caching for a specific command, end the line with a semicolon (`;`).

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
| `_oh[<cell_number>]` | List of all outputs (1-indexed).          |
| `Out[<cell_number>]` | Same as `_oh`.                            |

### Help and Introspection

| Command                | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `?object` or `object?` | Show help for an object (e.g., `?str.replace`).          |
| `object??`             | Show source code for an object (e.g., `os.path.join??`). |
| `*text*?`              | Search for objects with wildcards (e.g., `os.*dir*?`).   |
| **CTRL + R**           | Search command history.                                  |

### Shell Interaction

You can run shell commands directly from IPython. Commands starting with `!` are treated as shell commands, and some common commands (`cd`, `ls`, `pwd`, etc.) don't require the `!` prefix.

```ipython
In [1]: !echo "hello world" > new_file
In [2]: !cat new_file
hello world
```

#### Aliases
Create aliases for shell commands using the `%alias` magic function.
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

#### `%rehashx`
The `%rehashx` magic loads all executables from your `$PATH` into the IPython alias table, allowing you to call any shell command without the `!` prefix.

## Magic Functions

Magic functions are special commands prefixed with `%` (line magics) or `%%` (cell magics).
- **Line Magics (`%`):** Operate on a single line of input.
- **Cell Magics (`%%`):** Operate on the entire cell (multiple lines of input).

Use `%lsmagic` to list all available magic functions.

### Common & Useful Magics

| Magic            | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `%history`       | Print input history with powerful filtering options.              |
| `%edit`          | Open an editor to write and execute code.                         |
| `%run`           | Run a Python script and load its data into the current namespace. |
| `%rerun`         | Rerun a command or a range of commands from history.              |
| `%recall`        | Recall and edit a command from history before executing.          |
| `%macro`         | Define a macro from previous input commands.                      |
| `%save`          | Save a range of input history to a file.                          |
| `%pastebin`      | Upload code to a pastebin service (e.g., Gist).                   |
| `%store`         | Store variables, aliases, or macros for use in future sessions.   |
| `%who` / `%whos` | List all interactive variables.                                   |
| `%xmode`         | Control the verbosity of exception tracebacks.                    |
| `%debug`         | Activate the interactive post-mortem debugger.                    |
| `%timeit`        | Time the execution of code for performance measurement.           |
| `%prun`          | Run code with the Python code profiler.                           |

### In-Depth Magic Commands

#### `%history`
- `%history`: Print the entire history.
- `%history 5`: Print line 5.
- `%history 2-3 5 7-9`: Print a mix of ranges and single lines.
- `%history ~2/7`: Print line 7 from two sessions ago.
- `%history ~8/1-~6/5`: Print from the 1st line 8 sessions ago to the 5th line 6 sessions ago.

#### `%edit`
Opens a temporary file in your default editor (`$EDITOR`). The code is executed upon saving and closing.
- `%edit`: Open a new temporary file.
- `%edit -p`: Open the previous temporary file for editing.
- `%edit <filename>`: Open a specific file.
- `%edit <variable>`: Open a file with the content of the variable.
- `%edit <object>`: Open the source file where the object is defined.

#### `%run`
Executes a Python script. Useful for testing modules without repeated imports.
- `%run my_script.py`
- Combine with the `%autoreload` extension to automatically reload modules before execution:
  ```ipython
  %load_ext autoreload
  %autoreload 2
  ```

### Cell Magics for Other Languages
IPython can execute code in other languages if the corresponding kernel is installed.
- `%%bash`
- `%%ruby`
- `%%javascript`
- `%%python2`

```ipython
In [2]: %%python2
...: print "but" "this" "will"
...:
but this will

In [3]: %%ruby
...: puts "hello from Ruby!"
...:
hello from Ruby!
```

## Customization

### Writing Your Own Magic Functions
1.  Write a Python function that accepts at least one parameter (the string passed to the magic).
2.  Decorate it with `@register_line_magic` or `@register_cell_magic`.

```python
from IPython.core.magic import register_line_magic

@register_line_magic("reverse")  # The name of the magic function
def lmagic(line):
    "Line magic to reverse a string"
    return line[::-1]
```
**Usage:**
```ipython
In [2]: %reverse hello world
Out[2]: 'drow olleh'
```

### Extensions
Package your magic functions into reusable extensions.

1.  **Create an extension file**: Create a Python file (e.g., `reverser.py`)
2.  **Define `load_ipython_extension`**: This function is the entry point for your extension.

```python
# ~/.ipython/extensions/reverser.py
from IPython.core.magic import register_line_magic

def load_ipython_extension(ipython):
    @register_line_magic("reverse")
    def lmagic(line):
        "Line magic to reverse a string"
        return line[::-1]

    # The 'ipython' argument is the active InteractiveShell instance.
    # You can also define an unload_ipython_extension(ipython) function.
```

3.  **Load the extension**:
```ipython
In [1]: %load_ext reverser
In [2]: %reverse Hello world!
Out[2]: '!dlrow olleH'
```
**Note**: While placing extensions in `~/.ipython/extensions` works, the recommended modern approach is to package them and install them via PyPI.

### Startup Files
For simpler customizations, place Python scripts (`.py` or `.ipy`) in `~/.ipython/profile_default/startup/`. These scripts run every time IPython starts, making it easy to define helper functions or import common modules.

```bash
# Example: ~/.ipython/profile_default/startup/my_magic.py
from IPython.core.magic import register_line_magic

@register_line_magic("reverse")
def lmagic(line):
    "Line magic to reverse a string"
    return line[::-1]
```

### Configuration and Profiles
- **Configuration File**: Run `ipython profile create` to generate the default configuration file at `~/.ipython/profile_default/ipython_config.py`. This file contains a vast number of options to customize IPython's behavior.
- **Profiles**: Create separate profiles for different workflows using `ipython profile create <profile_name>`. Launch IPython with a specific profile using `ipython --profile=<profile_name>`. This allows you to have different startup files, extensions, and configurations for different tasks.

## Debugging
IPython provides powerful, integrated debugging capabilities.

### Embedding IPython
Embed an IPython shell anywhere in your code to inspect its state at that point.
```python
# embedding_example.py
a = 10
b = 15
from IPython import embed; embed() # Embed shell here
print(f"a+b = {a + b}")
```
When you run `python embedding_example.py`, an IPython shell will open. You can inspect and even change variables before exiting to continue the script's execution.

### The `ipdb` Debugger
IPython's debugger, `ipdb`, is an enhanced version of `pdb` with features like syntax highlighting and tab completion.

- **Run with Debugger**: `%run -d my_file.py`
  - This command starts the script under the debugger and places a breakpoint at the first line.
- **Post-Mortem Debugging**: `%debug`
  - If your code crashes with an exception, run `%debug` immediately after. It will open the debugger at the exact point where the exception occurred, allowing you to inspect the call stack and variables.
- **Automatic Debugger**: `%pdb`
  - Run `%pdb` to toggle automatic debugger activation. When ON, IPython will automatically start the debugger on any unhandled exception.

### Exception Verbosity (`%xmode`)
Control the level of detail in exception tracebacks.

- `%xmode Minimal`: `IndexError: list index out of range`
- `%xmode Plain`: Standard traceback.
- `%xmode Context`: Default, shows context around the error line.
- `%xmode Verbose`: Most detailed, includes local and global variables for each frame in the stack trace.

## Profiling
Identify performance bottlenecks in your code.

### Timing Code
- `%time <statement>`: Measures the wall clock and CPU time of a single execution.
- `%%timeit`: A cell magic that is more convenient for multiline code. It can also take setup code that is not included in the timing.
- `%timeit <statement>`: Runs a statement multiple times to get a reliable average execution time. It intelligently determines the number of runs.

```ipython
In [5]: %timeit run_calculations()
2.82 s $ 124 ms per loop (mean $ std. dev. of 7 runs, 1 loop each)
```

### Function Profiling with `%prun`
`%prun` runs your code with the `cProfile` profiler and provides a detailed report of time spent in each function.

```ipython
In [1]: %prun a_slow_function()
         50035004 function calls in 12.653 seconds

   Ordered by: internal time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
    10000    8.683    0.001   12.645    0.001 my_file.py:6(helper_function)
 49995000    3.956    0.000    3.956    0.000 my_file.py:15(check_factor)
...
```

### Line-by-Line Profiling with `%lprun`
For a more granular view, `%lprun` profiles code line by line.
1.  Install: `pip install line_profiler`
2.  Load extension: `%load_ext line_profiler`
3.  Run: `%lprun -f function_to_profile code_to_run()`

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

### Memory Profiling with `%mprun`
Profile memory usage line by line.
1.  Install: `pip install memory_profiler`
2.  Load extension: `%load_ext memory_profiler`
3.  Run: `%mprun -f function_to_profile code_to_run()`

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

## Advanced Features

### Asynchronous Code
IPython supports top-level `await`, allowing you to run asynchronous code directly in the REPL, which is a `SyntaxError` in the standard Python REPL.

```ipython
In [1]: import aiohttp
In [2]: session = aiohttp.ClientSession()
In [3]: result = session.get("https://api.github.com")
In [4]: response = await result
In [5]: response
Out[5]: <ClientResponse(https://api.github.com) [200 OK]>
```

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

### Kernels
IPython's architecture separates the frontend (REPL) from the backend (kernel). This allows you to use the IPython interface with kernels for other languages like Julia, R, or JavaScript.
- Find kernels on the [Jupyter kernels list](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels).
- Start IPython with a specific kernel: `jupyter console --kernel <kernel_name>`.

## Alternatives to IPython
- **bpython**: A lightweight REPL with syntax highlighting, autocompletion, and a "rewind" feature.
- **ptpython**: A more advanced REPL built on `prompt_toolkit`, offering multiline editing, syntax validation, and Vim/Emacs modes.
- **xonsh**: A Python-powered shell language that is a superset of Python, combining shell and Python syntax.
