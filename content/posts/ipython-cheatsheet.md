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

So I recently started a job as a machine learning engineer. I was told to learn IPython. I have seen it being downloaded alongside Jupyter Notebook, but when I tried it, it seemed like a regular Python REPL with syntax highlighting. I didn't see the point of it. But after some research, I found out that IPython is much more than that.

IPython is essentially the Python REPL but on steroids. Or rather, it's Jupyter's older sibling. Or Jupyter notebooks without all the web bloat. I actually don't like Jupyter Notebooks that much because of how bloated they are. It's just a REPL with a fancy web interface that is so slow and clunky.

So Jupyter Notebooks without the bloat? I like the sound of that!

IPython began in 2001 as an enhanced interactive shell for Python, designed to improve the default interpreter with features like tab completion, syntax highlighting, rich introspection, and inline help. Over time, it grew into a larger project that included a web-based notebook interface for writing and running Python code interactively.

In 2014, the notebook component was split into a new project called Jupyter, which generalized the idea of interactive notebooks beyond Python to support many programming languages through "kernels." The IPython project is now used as the default kernel for Jupyter notebooks.

Per the official documentation:
> IPython provides a rich toolkit to help you make the most of using Python interactively. Its main components are:
> - A powerful interactive Python shell.
> - A Jupyter kernel to work with Python code in Jupyter notebooks and other interactive frontends.
>
> The enhanced interactive Python shells and kernel have the following main features:
> > - Comprehensive object introspection.
> - Input history, persistent across sessions.
> - Caching of output results during a session with automatically generated references.
> - Extensible tab completion, with support by default for completion of Python variables and keywords, filenames and function keywords.
> - Extensible system of ‘magic’ commands for controlling the environment and performing many tasks related to IPython or the operating system.
> - A rich configuration system with easy switching between different setups (simpler than changing $PYTHONSTARTUP environment variables every time).
> - Session logging and reloading.
> - Extensible syntax processing for special purpose situations.
> - Access to the system shell with user-extensible alias system.
> - Easily embeddable in other Python programs and GUIs.
> - Integrated access to the pdb debugger and the Python profiler.
>
> The Command line interface inherits the above functionality and adds
> - real multi-line editing thanks to prompt_toolkit.
> - syntax highlighting as you type.
> - integration with command line editor for a better workflow.
>
> The kernel also has its share of features. When used with a compatible frontend, it allows:
> - the object to create a rich display of HTML, Images, LaTeX, Sound and Video.
> - interactive widgets with the use of the ipywidgets package.

This post is a cheatsheet with useful IPython commands and features. It is heavily based on the [IPython can do that?! - talk by Sebastian Witowski](https://www.youtube.com/watch?v=S9rgGJYAQ8o) from freeCodeCamp Talks. I am not taking credit for it, rather, I am just keeping notes for myself, with additional explanations and examples. Big thanks to Sebastian Witowski!

## Installation

To install IPython, you can use pip:

```sh
pip install ipython
```

### Input and output caching

- IPython stores the input and output of each command in the current session
- It also stores the input (and output - if enabled in the settings) of previous sessions

If you don't want to cache the input for a given command, you can put a semicolon at the end of the line (e.g., `1+2;`). IPython won't print the results and it also won't store the results in cache.

### Input caching

You access them through global variables.

Input commands are stored in:
- (for the last 3 inputs) `_i`, `_ii`, `_iii`
- `_i<cell_number>`
- `_ih[<cell_number>]`
- `In[<cell_number>]`
`_ih` and `In` are lists indexed from 1!

E.g.,
```
In [9]: 1+2
Out [9]: 3
In [10]: _i
Out[10]: '1+2'
In [11]: _i9
Out[11]: '1+2'
In [12]: _ih[9]
Out [12]: '1+2'
In [13]: In[9]
Out[13]: '1+2'
In [14]:
```

### Output caching

You also access them through global variables.

Output commands are stored in:
- (for the last 3 outputs) `_`, `__`, `___`
- `_<cell_number>`
- `_oh[<cell_number>]`
- `Out[<cell_number>]`

### Commands

- CTRL + R = Search command history
- `?command` or `command?` = Show help for command (e.g., `?pandas`)
- `command??` = Show source code for command (e.g., `pandas??`)
- `!command` = Run shell command (e.g., `!ls`)
- `os.*dir*?` = Use wildcards to see the functions matching certain strings (e.g., `os.makedirs`)

### Magic Functions

- Magic functions - helper functions that start with `%` or `%%`, e.g: `%history -n -o 1-10`
- IPython magic functions != Python magic methods (`__add__`)!

There are two types of magic functions:
- Line magics - work on a single line. `%timeit` is a line magic function (similar to shell commands).
  - E.g., `%timeit -n 100 -r 3 sum(range(10000))`
- Cell magics - work on multiple lines, e.g., `%%timeit` at the start of a cell
  - E.g., `%%timeit is a cell magic function`
    ```
    %%timeit -n 100 -r 3
    total = 0
    for x in range(10000):
        total += x
    ```
    Once you are done writing, you need to press enter twice.

To list all magic functions use `%lsmagic`.

The most useful magic functions are (according to the talk):
- `%alias`
- `%cpaste`
- `%debug`
- `%edit`
- `%history`
- `%load`
- `%load_ext`
- `%ls`
- `%macro`
- `%prun`
- `%recall`
- `%rehashx`
- `%rerun`
- `%save`
- `%store`
- `%timeit`
- `%who` / `%whos`
- `%xmode`

#### Line Magics in detail

Let's explain some of the most interesting ones in detail:

1. `%history` - Prints the input history:
```
%history - Print whole history
%history 5 - Line 5
%history 2-3 5 7-9 - Range of lines
```
- `%history 2-3 5 7-9`
  - Range 7-9 means: line 7, 8 AND 9 (unlike Python's range)
  - You can mix ranges and single lines (duplicates are fine too!)
- `%history 457/7` # Line 7 from session number 457
- `%history ~2/7` # Line 7 from 2 sessions ago
- `%history ~1/` # The whole previous session
- `%history ~8/1-~6/5` # From the 1st line 8 sessions ago until the 5th line of 6 sessions ago

2. `%edit` - Opens a temporary file (in your favorite editor*.) and executes the code after you save and quit:
```
%edit
%edit -p
```
* Based on the $EDITOR (or $VISUAL) environment variable. By default uses vim, nano or notepad.
Each time you run `%edit`, it opens a new temporary file. If you want to edit the same file, use `-p` (previous). And to save you typing the `%edit` thing, you can just press F2, it's a shortcut.

`%edit ARGUMENT`

What's cool about `%edit` is that it will behave differently based on the argument you give it.

Where argument can be:
- a filename - open the file
- range of input history - open a new file and copy the lines from history into it
- a variable - it will open the file and copy the content of that variable to that file
- an object but not a variable (e.g. a function name) - IPython will try to figure out in which file that function is defined and open the file exactly on the line where the function definition starts, which makes it easy to monkey patch functions on the fly
- a macro - if you created a macro, you can edit the macro

3. `%run` - Run a Python script and load its data into the current namespace
Useful when writing a module (instead of `importlib.reload()`) or a bunch of functions in a file. It makes it easy to test them.
Bonus:
- There is a configuration option of IPython called `%autoreload` - if you enable it, IPython will always reload a module before executing a function from that module

4. `%rerun` - rerun a command from the history
5. `%recall` - like `%rerun`, but lets you edit the commands before executing
6. `%macro` - store previous commands as a macro
7. `%save` - save commands to a file
8. `%pastebin` - save commands to a pastebin (similar to GitHub gist)
9. `%store` - save macros, variables or aliases in IPython storage. This is because once you close IPython, everything is lost, so we can save them in the database and retrieve them back in another session.
10. `%who` and `%whos` - print all interactive variables in a nicely formatted way.

#### Cell magics for different programming languages

So far all of the magic functions mentioned were line magics. But using cell magics, you can run code in other programming languages too.

- `%%python2`
- `%%bash`
- `%%ruby`
- `%%javascript`

```

In [1]: print "this" "won't" "work"
File "<ipython-input-1-94cbffc45fdb>", line 1
print "this" "won't" "work"
SyntaxError: Missing parentheses in call to 'print'. Did
you mean print("this" "won't" "work")?
In [2]: %%python2
...: print "but" "this" "will"
...:
...:
but this will
In [3]: %%ruby
...: puts "hello from Ruby!"
...:
...:
hello from Ruby!
In [4]:
```

And it will even correctly highlight the Ruby syntax!

### Writing magic functions

So what if those hundreds of magic functions are not enough?

How to write a magic function:
1. Write a function
2. Decorate it with `@register_line_magic` or `@register_cell_magic`

Each magic function should accept at least one parameter - the string that will be passed to that function.

Reverse a string:
```
from IPython.core.magic import register_line_magic

@register_line_magic("reverse")  # <-- The name of the magic function
def lmagic(line):
    "Line magic to reverse a string"
    return line[::-1]

In [2]: %reverse hello world
Out[2]: 'drow olleh'
```

Keep in mind that all arguments passed to the magic function are strings. So there is no need to worry about checking types if you can reverse it or not.

### Extensions

Creating magic functions is easy but to be able to run our magic function, we have to copy and paste our code into IPython. If we want to run our magic functions often, then each time you start a new IPython session, you have to copy and paste the code again, which sounds terribly inconvenient.

So we want to turn our magic function into an extension.

Extensions in IPython are an easy way to make your magic functions reusable and share them with others through PyPI...
- ... but they are not only limited to magic functions (key bindings, custom colors, custom IPython configuration, etc.)

That is to say, they are not limited only to the magic functions - you can for example write some code that modifies any part of IPython - from custom key bindings, custom colors, modifications to the configuration, and you can very easily turn that into an extension.

#### Writing an extension

- To create an extension you need to create a file containing `load_ipython_extension` function (and optionally the `unload_ipython_extension`)

```python
# myextension.py
def load_ipython_extension(ipython):
    # The "ipython" argument is the currently active 'InteractiveShell'
    # instance, which can be used in any way. This allows you to register
    # new magics or aliases, for example.

def unload_ipython_extension(ipython):
    # If you want your extension to be unloadable, put that logic here.

# https://ipython.readthedocs.io/en/stable/config/extensions/index.html
```

- And save the file in a folder called `.ipython/extensions`

So all we have to do is take our magic function and put it inside `load_ipython_extension`. For example:

```python
#~/.ipython/extensions/reverser.py

from IPython.core.magic import register_line_magic

def load_ipython_extension(ipython):
    @register_line_magic("reverse")
    def lmagic(line):
        "Line magic to reverse a string"
        return line[::-1]
```

Keep in mind that this function should always accept one parameter - the ipython object. So even though we are not using it in our example, we have to accept this parameter. Otherwise IPython will complain.

Now if we start IPython and load our extension the magic function reverse will be available in our session.

```
In [1]: %load_ext reverser
Loading extensions from ~/.ipython/extensions is deprecated. We recommend managing extensions
like any other Python packages, in site-packages.
In [2]: %reverse Hello world!
Out[2]: '!dlrow olleH'
In [3]:
```

All the `%load_ext` magic method does is to find a file with a matching name and call the `load_ipython_extension` function from that file.

So you probably notice this deprecation warning and might be thinking why am I showing you something that is deprecated. Well it's not really deprecated, it's just a subtle way of IPython telling you like - hey I see you have created an extension, how about you share it with others, and publish it on PyPI?

### Where to find extensions?

- Extensions Index - a wiki page in IPython repository (some extensions are *old* and you might have problems installing them)
- `Framework::IPython` filter on PyPI - the recommended way to share extensions
  - However, not everyone is tagging their extensions properly, so search for "IPython" or "IPython magic" on PyPI

#### Example extensions

- IPython-SQL - interact with SQL databases from IPython
- IPython Cypher - interact with Neo4j
- Django ORM magic - define Django models on the fly

However, the popularity of those extensions is not very high, many of them are below version 1.0 or have been abandoned a long time ago. But sometimes you can actually find something useful.

### Other cool features

So what else can you do with IPython?

#### Shell commands

- Commands starting with `!` are treated as shell commands
- Some common commands don't require `!` prefix (`cd`, `ls`, `pwd`, etc.)

```
In [1]: cd test_dir/
/Users/switowski/workspace/test_dir
In [2]: ls
test_file
In [3]: !echo "hello world" > new_file
In [4]: !cat new_file
hello world
In [5]: 1
```

#### Aliases

`%alias` - Similar to Linux alias command, they let you call a system command under a different name:

```
In [1]: %alias lr ls -alrt
In [2]: lr
total 8
drwxr-xr-x   4 switowski  staff   128 May 26 20:14 .
drwxr-xr-x  10 switowski  staff   320 May 26 20:14 ..
-rw-r--r--   1 switowski  staff     0 May 26 20:16 test_file
-rw-r--r--   1 switowski  staff    12 May 26 20:17 new_file
In [3]: %alias print echo %s %s
In [4]: %print hello world
hello world
```

#### Path

Speaking of aliases there is actually a cool and probably not very well known magic function called `rehashx`.

`%rehashx` - Loads all executables from $PATH into the alias table

It will load all the executables from the path variable into the IPython session which basically means that now you can call any shell command right from IPython which is pretty cool. Little curiosity: here I'm starting a node REPL inside IPython REPL. I wanted to go deep down and start more REPLs but I failed.

#### Setting verbosity of exceptions

IPython has four different settings for how verbose the exceptions should be.

`%xmode` - Changes how verbose the exceptions should be.

`minimal` - lowest:

```
In [10]: %xmode minimal
Exception reporting mode: Minimal
In [11]: function1()
IndexError: list index out of range
```

`plain` - a bit more verbose:

```
In [14]: %xmode plain
Exception reporting mode: Plain
In [15]: function1()
Traceback (most recent call last):
File "<ipython-input-15-c8b3cafe2887>", line 1, in <module>
function1()
File "/Users/switowski/workspace/playground/my_broken_function.py", line 1, in function1
return function2(5)
File "/Users/switowski/workspace/playground/my_broken_function.py", line 6, in function2
total += a_list[x]
IndexError: list index out of range
```

`context` - the default one:

```
In [18]: %xmode context
Exception reporting mode: Context
In [19]: function1()
IndexError
Traceback (most recent call last)
File "<ipython-input-19-c0b3cafe2087>", line 1, in <module>
function1()
File "/workspace/playground/my_broken_function.py", line 2, in function1
return function2(5)
File "/workspace/playground/my_broken_function.py", line 7, in function2
total += a_list[x]
IndexError: list index out of range
```

`verbose` - the most verbose one, it will also show local and global variables for each point in the stack trace:

```
In [20]: %xmode verbose
Exception reporting mode: Verbose
In [21]: function1()
IndexError
Traceback (most recent call last)
File "<ipython-input-21-c0b3cafe2087>", line 1, in <module>
function1()
global function1 = <function function1 at 0x10df42158>
File "/workspace/playground/my_broken_function.py", line 2, in function1
return function2(5)
global function2 = <function function2 at 0x10df2c6a8>
File "/workspace/playground/my_broken_function.py", line 7, in function2
total += a_list[x]
total = 10
a_list = [1, 2, 3, 4]
x = 4
IndexError: list index out of range
```

### Autowait

Asynchronous code in REPL - you can execute asynchronous code by using `await` wherever you want.

So if you try to put an await in a top-level scope in standard Python REPL you will get a syntax error.

```
$ python
Python 3.7.2 (default, Jan 25 2019, 18:07:26)
[Clang 10.0.0 (clang-1000.10.44.4)] on darwin
Type "help", "copyright", "credits" or "license" for more information.

>>> import aiohttp
>>> session = aiohttp.ClientSession()
_main_:1: DeprecationWarning: The object should be created from async function
>>> result = session.get("https://api.github.com")
>>> response = await result
>>> File "<stdin>", line 1
>>> SyntaxError: 'await' outside function
```

However IPython has implemented some hacks to make it work, so if you're playing with some asynchronous code and you want to quickly await an asynchronous function, this is a great way to do this. Just keep in mind that this is not actually valid Python code so don't do this in production!

IPython:
```
$ ipython
Python 3.7.2 (default, Jan 25 2019, 18:07:26)
Type 'copyright', 'credits' or 'license' for more information
IPython 7.4.0 -- An enhanced Interactive Python. Type '?' for help.
In [1]: import aiohttp
In [2]: session = aiohttp.ClientSession()
/Users/switowski/.virtualenvs/testipython/bin/ipython:1: DeprecationWarning: The object should be created from async function
In [3]: result = session.get("https://api.github.com")
In [4]: response = await result
In [5]: response
Out[5]:
<ClientResponse(https://api.github.com) [200 OK]>
<CIMultiDictProxy('Server': 'GitHub.com', 'Date': 'Mon, 27 May 2019 13:20:45 GMT', 'Content-Type': 'application/json; charset=utf-8', 'Transfer-Encoding': 'chunked', 'Status': '200 OK', 'X-RateLimit-Limit': '60', 'X-RateLimit-Remaining': '59', 'X-RateLimit-Reset': '1558966845', 'Cache-Control': 'public, max-age=60')>

```

### Demo mode

There is a demo mode in IPython.

To use it, you have to create a Python file with some simple markup in the comments.
```python
# demo.py
print("Hello, welcome to an interactive IPython demo.")
# <demo> --- stop ---

x = 1
y = 2

# <demo> --- stop ---

z = x + y

print("z=", x)
# <demo> --- stop ---
print("z is now:", z)

print("bye!")
```

And then you need to load that file into the demo object.

```
from IPython.lib.demo import Demo
mydemo = Demo("demo.py")
mydemo()
```

This is how it works in practice: each time you call the demo object, IPython will execute the next block of code from the demo in the current namespace.

```
In [1]: from IPython.lib.demo import Demo
In [2]: mydemo = Demo("demo.py")
In [3]: mydemo()
<demo.py> block # 0 (3 remaining)
print("Hello, welcome to an interactive IPython demo.")
Press <q> to quit, <Enter> to execute.
```

So you will have access to all the variables and functions that were created in that block of code and you can play with them before executing the next block. So demo mode is pretty similar to what you can do with Jupyter notebooks and to be honest, for a presentation I would stick to Jupyter notebooks so people can actually see what code you are executing.

But if you live in a terminal and you want to impress your colleagues with a pretty cool coding demo for your next presentation this is a great tool!

### Configuration

So IPython comes with a lot of good defaults. In fact I never actually felt I needed to modify the configuration file.

- IPython has pretty good defaults
- But if you need to change something, there is a configuration file: `~/.ipython/profile_default/ipython_config.py`
- To create this file, run: `ipython profile create`

When you first install IPython, the file is not there - you have to first run `ipython profile create` command that will generate the file with default values.

And if you look inside that file you will see a huge amount of options that you can change.

For example, you can:

- execute specific lines of code at startup
- execute files at startup
- load extensions
- disable the banner and configuration files (faster startup)
- disable/enable autocalls
- change the color scheme
- change the size of output cache or history length
- automatically start pdb after each exception
- change exception mode
- select editor for the `%edit`
- set the SQLite DB location
- enable output caching between sessions
- restore all variables from `%store` on startup

### Startup files

If you look at what else is inside the IPython profile default folder you will see a bunch of directories, most of them are internal to IPython.

```
[HIKARI:~/.ipython/profile_default] $ ll
total 56
-rw-r--r--@ 1 hikari  staff    28K Aug 24 13:13 history.sqlite
drwxr-xr-x@ 3 hikari  staff    96B Aug 24 12:23 startup
drwxr-xr-x@ 2 hikari  staff    64B Aug 24 12:23 db
drwxr-xr-x@ 2 hikari  staff    64B Aug 24 12:23 log
drwx------@ 2 hikari  staff    64B Aug 24 12:23 pid
drwx------@ 2 hikari  staff    64B Aug 24 12:23 security
```

So there is nothing interesting for us, but there is one that is particularly interesting - it's called `startup`.

It contains a readme file that explains what's the purpose of this directory - basically any file with `.py` or `.ipy` extension that you put in that directory will be executed when IPython starts.

```
[HIKARI:~/.ipython/profile_default/startup] $ ll
total 8
-rw-r--r--@ 1 hikari  staff   371B Aug 24 12:23 README
[HIKARI:~/.ipython/profile_default/startup] $ head README
This is the IPython startup directory

.py and .ipy files in this directory will be run *prior* to any code or files specified
via the exec_lines or exec_files configurables whenever you load this profile.

Files will be run in lexicographical order, so you can control the execution order of files
with a prefix, e.g.:

    00-first.py
    50-middle.py
```

So we can use this folder to define some helper methods or maybe magic functions.

Remember when we wrote our magic method and we had to create an extension to be able to use our magic method between sessions? Well an easier solution would be to just create a file in the startup directory and put the code of our magic method there.

```
[HIKARI:~/.ipython/profile_default/startup] $ cat my_magic.py
from IPython.core.magic import register_line_magic

@register_line_magic("reverse")
def lmagic(line):
    "Line magic to reverse a string"
    return line[::-1]
```

Just keep in mind that whatever you put in that folder gets executed each time IPython starts, so if you put a bunch of slow functions there then it's going to make your IPython startup time very slow. In this case it's better to create a separate profile for those slow functions.

## Profiles

- Profiles are like accounts on your computer (each has a separate configuration and startup files)
- Each profile is a separate directory in `.ipython` directory

- Create a new profile: `$ ipython profile create foo`
- Start IPython with that profile: `$ ipython --profile=foo`
- By default, IPython starts with the *default* profile

So for example you can have a profile just for debugging and profiling your code - exceptions are set to be as verbose as possible and you can load a few extensions for profiling.

But since you are not debugging your code all the time, instead of putting all those things into the default configuration you can create a separate profile for that.

## Events

So we talked about magic functions and extensions before and I told you that a lot of extensions define magic functions that you can use but that's not the only thing you can do with the extensions.

Another thing that you can do is to register some callbacks to IPython events. IPython defines a set of events like - "before I run the code", "after I run the code", "after I start IPython" and you can very easily plug custom functions that will be executed during those events.

For example:
- `IPython.core.events.pre_execute()` - Fires before code is executed in response to user/frontend action.
- `IPython.core.events.pre_run_cell(info)` - Fires before user-entered code runs.
- `IPython.core.events.post_execute()` - Fires after code is executed in response to user/frontend action.
- `IPython.core.events.post_run_cell(result)` - Fires after user-entered code runs.
- `IPython.core.events.shell_initialized(p)` - ip (InteractiveShell) - The newly initialized shell.

To add a callback to an event:
- Define your callback (check `Module:core.events` documentation)
- Define `load_ipython_extension(ip)` function
  - Register callback with `ip.events.register()`
- Load the extension (with `%load_ext` function)

### Writing a custom event

Let's see how it works in practice - let's say we want to make a function that will print the variables after the execution of each cell.

So this is all the code that we need for it:

```python
class VarPrinter:
    def __init__(self, ip):
        self.ip = ip

    def post_run_cell(self, result):
        print("--------------------------------")
        print("Variables after cell execution:")
        self.ip.run_line_magic("whos", "")
```

First, we create a class that will store our callback function - I'm using a class to store the reference to the IPython object that I will use inside my callback function, then I'm defining the callback function - the result parameter will be passed from the event so even though I'm not actually using it in my function, I still have to put it in the function signature. Inside my callback function I'm calling the magic method `whos` to print the variables - but since it has to be valid Python code, I can't just use `%whos` as this is going to give me a syntax error.

So this run line magic function is actually a way to call IPython magic functions from valid Python code.

```python
def load_ipython_extension(ip):
    vp = VarPrinter(ip)
    ip.events.register("post_run_cell", vp.post_run_cell)
```

And finally, I'm registering the callback inside the `load_ipython_extension` function. Now I'm saving the file in my extensions directory as `varprinter.py` in `~/.ipython/extensions/`.

If I load it in an IPython session it will automatically start working and printing the variables after each cell:

```
In [1]: %load_ext varprinter
Loading extensions from ~/.ipython/extensions is deprecated.
Variables after cell execution:
Interactive namespace is empty.
In [2]: a = 10
Variables after cell execution:
Variable   Type    Data/Info
a          int     10
In [3]: b = [1,2,3]
Variables after cell execution:
Variable   Type    Data/Info
a          int     10
b          list    n=3
In [4]:
```

### Hooks

So speaking of events there is also something quite interesting similar to events that is called hooks.

Hooks are similar to events, used for example when:

- Opening an editor (with `%edit`)
- Shutting down IPython
- Copying text from clipboard

Events vs Hooks:

- There can be multiple callback functions run on one event (they are independent of each other)
- But only one function will run for a given hook (unless it fails - then the next function will be tried)!

So you can have a bunch of callback functions that are independent from each other and all of them will be called when an event happens.

Hooks, on the other hand, will call only one function - so if you have multiple functions attached to the same hook, IPython will call the first one and if it's successful it will stop. But if the function throws an exception IPython will try to call the next function and the next and the next until it finds one that's actually successful.

So let's see an example of a hook.

```python
import os
from IPython.core.error import TryNext

def calljed(self, filename, linenum):
    "My editor hook calls the jed editor directly."
    print("Calling my own editor, jed ...")
    if os.system("jed +%d %s" % (linenum, filename)) != 0:
        raise TryNext()

def load_ipython_extension(ip):
    ip.set_hook("editor", calljed)
```

Here we are registering our own function that will be executed when the editor is open. This function will try to use the jed editor instead of the default one. An interesting piece of code is this `TryNext` exception - it's used to indicate that this hook failed and IPython should try to use the next function. If for some reason, there was a problem with the jed editor, IPython will try to open another editor instead of failing.

## Debugging

IPython is a great default debugger.

So how can you use IPython as your debugger?

#### Debugging via Embedding

Well first thing that you can do is to embed IPython anywhere in your code.

To do that, you need to import the embed function from IPython and then just call it.

```python
# embedding_example.py

a = 10
b = 15

from IPython import embed; embed()  # Single line so that IDEs complain
print(f"a+b = {a + b}")
```

You can put those two statements on one line so you can remove them with just one keystroke and also all the code linters will complain about it so you don't forget to remove it when you're done.

Now you can run your script and when the interpreter gets to that line in the code it will open the IPython shell. You will have access to all the variables set at that point so you can poke around and see what's going on with your code.

```
(.venv) [HIKARI:~/dev/misc/learn-python] $ python3 embedding_example.py
Python 3.13.7 (main, Aug 14 2025, 11:12:11) [Clang 17.0.0 (clang-1700.0.13.3)]
Type 'copyright', 'credits' or 'license' for more information
IPython 9.4.0 -- An enhanced Interactive Python. Type '?' for help.

In [1]: a
Out[1]: 10

In [2]: b
Out[2]: 15

In [3]: a = 100
```

When you're done you just exit IPython and the code execution will continue:

```
In [4]:
Do you really want to exit ([y]/n)? y

a+b = 115
```

Note that if you change some variables from IPython those changes will persist after you close the embedded session. So embedding is nice but it's not really debugging.

#### Actually Running The Debugger

To actually run the debugger, you can run the magic function `%run -d` and then specify the file name.

For example: `%run -d my_file.py`

- Runs the file through pdb (ipdb)
- Puts the breakpoint on the 1st line

IPython will then run the file with the ipdb debugger and put a breakpoint on the first line.

```
In [1]: %run -d my_file.py
Breakpoint 1 at /Users/switowski/workspace/playground/my_file.py:1
NOTE: Enter 'c' at the ipdb> prompt to continue execution.
> /Users/switowski/workspace/playground/my_file.py(1)<module>()
----> 1 a = 10
      2 b = 15
      3
      4 print(f"a+b = {a+b}")

ipdb> next
> /Users/switowski/workspace/playground/my_file.py(2)<module>()
      1 a = 10
----> 2 b = 15
      3
      4 print(f"a+b = {a+b}")

ipdb> continue
a+b = 25
In [2]:
```

ipdb debugger is just a wrapper around the standard pdb debugger that adds some features from IPython like syntax highlighting, tab completion and other small improvements.

### Post mortem debugger

So imagine you're running a Python script - a long running Python script - almost there and suddenly it crashes because that's what programs do!

And you're probably sitting there and thinking: man I wish I ran this script with a debugger enabled! Now I have to enable the debugger, run this slow function again and wait to see what's the problem!

Well now you don't - at least not when you're using IPython.

So you can run the `%debug` magic command after the exception happened and it will start the debugger for the last exception - you can inspect variables, move up and down the stack trace, the same stuff as you can do with the standard debugger.

```
-/workspace/playground/pmdebug-py in do_calculations(a, b)
341
--→> 36|
37
35 def do_calculations(a, b):
return b/a
38 def long_running-scriptO:
ZeroDivisionError: division by zero
› /Users/swi towski/workspace/playground/pmdebug-py(36)do_calculations
341
35 def do_calculations(a, b):
--→> 36|
return b / a
37
38 def long_running_scriptO:
ipdb> varsOl
('a': 0, 'b': 1000}
ipdb> up
› /Users/swi towski/workspace/playground/pmdebug-py(33)a_method)l
31|
b = 1000
32 new_a - a - 980
---> 33
34
return do_calculations(nen_a, b)
35 def do_calculations(a, b):
ipdb» varsO
('a': 980, 'b': 1000, 'new_a": 0}
ipdb>
```

### Automatic debugger

Finally, if you want to automatically start the debugger when the exception happens there is a magic function called `%pdb` that you can use to enable this behavior.

```
In [1]: %pdb
Automatic pdb calling has been turned ON
In [2]: 1/0
ZeroDivisionError|
<ipython-input-2-9e1622b385b6> in ‹module>
----> 1 1/0
ZeroDivisionError: division by zero
› <ipython-input-2-9e1622b385b6>(1) ‹module>O
----> 1 1/0
ipdb»
Traceback (most recent call last)
```

## Profiling

So that was debugging. Another interesting set of functions is related to profiling code.

If you're curious how slow your code is or more importantly where the bottleneck is, IPython has a few magic tricks up its sleeve.

### Time

The first magic function is called `%time`.

`%time` - Measure how long it takes to execute some code:

```
In [2]: %time run_calculations())
CPU times: user 2.68 s, sys: 10.9 ms, total: 2.69 s
Wall time: 2.71 s
Out [2]: 166616670000
```

It's the simplest way to measure the execution time of a piece of code. It will just run your code once and print how long it took according to the CPU clock and the wall clock. Kind of boring.

### Timeit

So there is a much more interesting function called `%timeit`.

`%timeit` - Measure how long it takes to execute some code. But also figures out how many times it should run to give you reliable results.

```
In [5]: %timeit run_calculations()
2.82 s $ 124 ms per loop (mean $ std. dev. of 7 runs, 1 loop each)
```

By default it will automatically determine how many times your code should run to give you reliable results - for a very fast function it might run a few thousand times and for a slow one it might just run a few times.

### Cell timeit

There's also a cell magic version of the timing function - `%%timeit`.

```
In [1]: %%timeit [arguments] <optional_setup_code>
・・・： total = 0
...: for x in range(10000):
…・・：
for y in range(x):
・・・：
total += y
2.7 5 t 25.7 ms per 100p (mean # std.
2.7 s $ 25.7 ms per loop (mean ‡ std. dev. of 7 runs, 1 loop each)
```

It's more convenient if you want to profile code that has multiple lines.

One nice thing about the cell magic version is that after the arguments you can pass some setup code that will be executed but it won't be part of the measurement.


### Prun

Once we know that our code is slow we probably want to see why exactly it's slow - what's taking so much time?

So we can run the `%prun` magic function and it will show us a nice overview of: how many times a given function was called, what was the total time spent on calling those functions, where a given function is located etc.

```

In [1]: %prun a_slow_function()
50035004 function calls in 12.653 seconds

Ordered by: internal time

ncalls  tottime  percall  cumtime  percall filename:lineno(function)
10000   8.683    0.001    12.645   0.001   my_file.py:6(helper_function)
49995000 3.956   0.000    3.956    0.000   my_file.py:15(check_factor)
10000   0.005    0.000    12.650   0.001   my_file.py:1(important_function)
10000   0.004    0.000    0.006    0.000   my_file.py:19(a_method)
1       0.003    0.003    12.653   12.653  my_file.py:28(long_running_script)
10000   0.001    0.000    0.001    0.000   my_file.py:24(do_calculations)
1       0.000    0.000    12.653   12.653  {built-in method builtins.exec}
0       0.000    0.000    0.000    0.000   <string>:1(<module>)
0       0.000    0.000    0.000    0.000   {method 'disable' of '_lsprof.Profiler' objects}

```

So here we can see that our slow function is running for 12 seconds and is performing 50 million function calls and most of the time is spent in a function called `check_factor` in a file called `my_file.py`.

So now we can go there and check what's wrong with this function and if we can make it better.

### Line profiler

Another interesting type of profiler is line profiler.

- `%prun` returns a function-by-function report
- `%lprun` returns a line-by-line report
- It's not included by default in IPython:
  - Install from pip: `pip install line_profiler`
  - Load extension: `%load_ext line_profiler`

The `%prun` will report how much time each function took but the line profiler or `%lprun` will give you even more detailed information and show you a line by line report of how your code was executed.

Since this profiler is not included by default with IPython you have to install it from pip and then load it as an extension.

Once you do this you can use the magic `%lprun` command - `%lprun -f function_name -f function2_name statement`

Now to run this profiler you need two things: you need a statement (a function or a piece of code that will be executed) and then you need to specify which functions you want to profile.

```

In [1]: %lprun -f long_running_script -f important_function long_running_script()
Timer unit: 1e-06 s

Total time: 27.3258 s
File: /Users/switowski/workspace/playground/my_file.py
Function: important_function at line 1

# Line #   Hits     Time     Per Hit   % Time   Line Contents

```
 1                                           def important_function(a, num):
 2   10000     27310547  2731.1   99.9        b = helper_function(a, num)
 3   10000     11686.0      1.2    0.0        b += 10
 4   10000      3560.0      0.4    0.0        return b
```

Total time: 27.3539 s
File: /Users/switowski/workspace/playground/my_file.py
Function: long_running_script at line 28

# Line #   Hits     Time     Per Hit   % Time   Line Contents

```
28                                           def long_running_script():
29       1         2.0      2.0    0.0        total = 1
30   10000      4033.0      0.4    0.0        for x in range(10000):
31   10000  27349839.0   2735.0  100.0            total += important_function(total, x)
32       1         0.0      0.0    0.0        return total
```

```

So here I'm running a function called `long_running_script` and I want my profiler to check two functions: the `long_running_script` itself and the one that it's calling, `important_function`.

So line profiler will generate this nice report for each function that I specify where I can see how many times each line was run, how much time Python spent on this line and what percentage of the total running time was spent on that particular line.

### Memory Profiler

The last profiler I want to mention is called memory profiler.

- Profiles the memory usage of Python programs
- It's not included by default in IPython:
  - Install from pip: `pip install memory_profiler`
  - Load extension: `%load_ext memory_profiler`

And as the name suggests it can be used to profile the memory usage of your programs.

Again to be able to use it we have to install it from pip first and then load the extension.

You run it basically in the same way as the line profiler: `%mprun -f function_name -f function2_name statement`

So you specify which functions you want to profile and then a statement that needs to be run.

And then you get output that is again similar to the one from the line profiler:

```

In [1]: %mprun -f memory_intensive memory_intensive()
Filename: /Users/switowski/workspace/playground/my_file.py

# Line #    Mem usage    Increment   Line Contents

```
 1     57.4 MiB     57.4 MiB   def memory_intensive():
 2    820.3 MiB    762.9 MiB       a = [1] * (10 ** 8)
 3   2159.0 MiB   1338.6 MiB       b = [2] * (2 * 10 ** 8)
 4    618.1 MiB  -1540.9 MiB       del b
 5    618.1 MiB      0.0 MiB       return a
```

```

You see how the memory usage has changed between each line of your code.

## Kernels

- In IPython REPL, the "E" (Evaluation) happens in a separate process called kernel
- You can use a different kernel than the default (Python) one
  - The interface won't change, but you will be using a different programming language (Ruby, JS, etc.)

So in IPython the evaluation part of REPL happens in a separate process - it means that the process evaluating your code called kernel can be decoupled from the rest of IPython. It has one great advantage - IPython is not limited just to Python programming language, you can easily swap kernels and use a completely different language! The interface won't change but a different interpreter will be running your code.

So if you want to quickly run some Ruby or JavaScript code - that's one way to do this.

So how can we change the kernel?

- Find a kernel you want (at Jupyter kernels wiki page)
- Install the dependencies and the kernel itself
- Run it (either in IPython REPL or Jupyter Notebooks)

Well first we have to find the kernel that we want to use on the list that is published at Jupyter GitHub repo.

It will contain a link to the documentation explaining how to install the kernel. Since each kernel has different dependencies there is no one standard way to install kernels.

So let's try to install the IJulia package and once we do this we can start IPython with the Julia kernel.

```
$ jupyter console --kernel julia-1.1
Starting kernel event loops.
Jupyter console 5.2.0
Julia: A fresh approach to technical computing.
```

As you can see the REPL still looks the same but now you can use Julia syntax and if we try to write Python then we're going to get a syntax error.

So the new kernel will work with both IPython REPL and Jupyter notebooks and while installing a custom kernel to use with the notebooks is a pretty good idea, installing a custom kernel just to use with IPython might be a bit of an overkill - nowadays programming languages have a very solid REPL of their own so it's probably easier to use that instead. Unless you really really want to use IPython all the time!

## Other Cool Features

And if you really really love IPython there is still a bunch of crazy stuff that you can do but I don't have time to discuss them all so I'm just gonna quickly show some of them.

- Enable autocalls, so you can skip brackets when calling functions (any Ruby or Haskell fans?)
- Or run commands like that:
  - `print a b c` # Equivalent to print("a", "b", "c")
- Enable autoreloading, so you can change modules on the fly (no need to reimport them after changes)
- Turn on the "doctest mode" so you can easily write the doctest documentation
- Turn IPython into your system shell (show current directory in prompt + autocalls + %rehashx)
- Add custom keyboard shortcuts
  - Or input transformations
  - Or AST transformations

So you can enable autocalls so you don't have to use brackets when calling functions, or you can start a line with a comma so you don't even have to put quotes around the parameters when calling a function. You can enable the autoreloading that I mentioned before so you can change the imported modules on the fly and then you don't have to re-import them each time. And if you're writing doctests you can turn on the doctest mode to make copying code from IPython easier. You can use IPython as your shell which would require for example changing the prompt to show you the current directory, enabling autocalls and running rehashx for all the aliases. Or you can add custom keyboard shortcuts or input transformations or if you're brave enough, AST transformations.

## Alternatives

And since this is already a talk about the Python REPL replacement it wouldn't be fair to at least not mention the alternatives. So there are three main ones:

- bpython
- ptpython
- xonsh shell

### bpython

The first alternative is bpython.

Lightweight alternative to IPython:
- Syntax highlighting
- Smart indentation
- Autocompletion
- Suggestions when typing
- Rewind

In the quest of making a replacement for the default Python REPL, bpython took a more lightweight approach. It has a lot fewer features than IPython but it has the essential ones like syntax highlighting, smart indentation, autocompletion and suggestions when you're typing.

And it has a very interesting feature called rewind that basically lets you remove the last command from the history like it never happened.

### ptpython

Next there is ptpython - a Python REPL built on top of the prompt toolkit.

It's slightly more advanced than bpython as it contains a bit more features:

- Syntax highlighting
- Multiline editing
- Autocompletion
- Shell commands
- Syntax validation
- Vim and Emacs mode
- Menus

The obvious ones are the syntax highlighting, multiline editing with smart indentation, autocompletion or shell commands. But there are some more innovative ones like syntax validation that checks your code if it's correct before executing it, Vim or Emacs key bindings, or those nice menus for configuration or the history.

### xonsh shell

And finally there is xonsh - it's quite different than IPython, bpython or ptpython because it's not really a Python REPL.

"Xonsh is a Python-powered, cross-platform, Unix-gazing shell language and command prompt. The language is a superset of Python 3.5+ with additional shell primitives that you are used to from Bash and IPython." - https://xon.sh/index.html

So it's a shell that's adding Python on top of Bash so you can actually use both and it has a massive amount of features.
