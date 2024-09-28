+++
date = 2024-07-16T14:23:09+02:00
title = "Beginner C++ FTXUI Tutorial"
description = "How to create a terminal user interface in C++ with FTXUI"
tags = ["tutorial", "ftxui", "c++", "macos", "linux"]
type = "post"
showTableOfContents = true
draft = true
+++

## Introduction

Transitioning from a simple console application to a full-blown GUI app can be pretty intimidating. There are many well-established GUI libraries to choose from (e.g., Qt), each with its own learning curve and dependencies. A simpler alternative is developing a [terminal user interface (TUI)](https://en.wikipedia.org/wiki/Text-based_user_interface) app, which runs directly in the terminal but offers a rich, GUI-like user experience.

[FTXUI](https://github.com/ArthurSonzogni/FTXUI) is an excellent TUI library for C++. However, its [learn-by-example documentation](https://arthursonzogni.github.io/FTXUI/) omits many details that would be helpful for beginners. This guide fills that gap, first extending upon the [original documentation](https://arthursonzogni.github.io/FTXUI/) and then walking you through creating several TUI applications, from the basics to more advanced projects.


## Requirements

- C++17 or higher
- CMake


## Setup

This tutorial assumes you have a basic understanding of C++ and CMake. To learn about CMake, check out my [CMake tutorial](/posts/simple-cmake-setup/). CMakes helps you manage the build process and dependencies for your C++ projects.

FTXUI has first-class support for CMake and even provides a [starter project](https://github.com/ArthurSonzogni/ftxui-starter) (to which I've contributed in the past), but I shall guide you through setting up a project from scratch with some opinionated defaults.


### Create a C++ Project

Create a new directory for your project and `cd` into it.

```sh
mkdir tui
cd tui
```

Create a `CMakeLists.txt` file in the root directory.

```sh
touch CMakeLists.txt
```

Create a `src` directory for your C++ code.

```sh
mkdir src
```

Create a `main.cpp` file in the `src` directory.

```sh
touch src/main.cpp
```

You should have the following directory structure.

```
.
├── CMakeLists.txt
└── src
    └── main.cpp
```

Add the following to `CMakeLists.txt`.

```cmake
# Set minimum required version of CMake
cmake_minimum_required(VERSION 3.24)

# Set project name and language
project(tui LANGUAGES CXX)

# Set standard without compiler specific extensions, export compile commands
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Require out-of-source builds
if(CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
  message(FATAL_ERROR "In-source builds not allowed. Please make a separate build directory and run CMake from there.")
endif()

# Set default build type to Release
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  message(STATUS "Setting build type to \"Release\" as none was specified.")
  set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Choose the type of build." FORCE)
  # Set the possible values of build type for cmake-gui
  set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Enable ccache (if available, install using "brew install ccache")
find_program(CCACHE ccache)
if(CCACHE)
  message(STATUS "Ccache enabled.")
  set(CMAKE_CXX_COMPILER_LAUNCHER ${CCACHE})
else()
  message(WARNING "Ccache not found. Consider installing it for faster rebuilds.")
endif()

# Add executable target
add_executable(${PROJECT_NAME}
  src/main.cpp
)

# Allow including headers relative to the "src" directory
target_include_directories(${PROJECT_NAME} PRIVATE src)

# Enable compile warnings (if not on Windows)
if(NOT WIN32)
  target_compile_options(${PROJECT_NAME} PRIVATE
    -Wall                 # Enable most warning flags
    -Wcast-align          # Warn for potential performance problems when casting a pointer to a type with stricter alignment requirements
    -Wconversion          # Warn on type conversions that may lose data
    -Wdouble-promotion    # Warn if a float is implicitly promoted to double
    -Werror               # Treat warnings as errors (stop compilation if any warning is present)
    -Wextra               # Enable extra warning flags that are not enabled by "-Wall"
    -Wformat=2            # Warn on security issues around functions that format output (like printf), this includes all "-Wformat" warnings and more
    -Wnon-virtual-dtor    # Warn when a class with virtual functions has a non-virtual destructor, which can lead to undefined behavior
    -Wnull-dereference    # Warn if a null dereference is detected
    -Wold-style-cast      # Warn for usage of C-style casts
    -Woverloaded-virtual  # Warn when a derived class function declaration may be an error due to hiding a virtual function from the base class
    -Wpedantic            # Warn on features that are not part of the ISO C++ standard
    -Wshadow              # Warn when a local variable shadows another local variable, parameter, global variable, or function
    -Wsign-conversion     # Warn on sign conversions (e.g., when a negative integer is converted to an unsigned integer)
    -Wunused              # Warn on anything being unused
  )
endif()

# Setup dependency management, disable updates on every configure, disable quiet mode, set the download directory to "deps"
include(FetchContent)
set(FETCHCONTENT_UPDATES_DISCONNECTED ON)
set(FETCHCONTENT_QUIET OFF)
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/deps)
message(STATUS "Setting up dependencies.")

# Add ftxui as a dependency
message(STATUS "Setting up ftxui...")
FetchContent_Declare(ftxui
  GIT_REPOSITORY https://github.com/arthursonzogni/ftxui.git
  GIT_TAG        v5.0.0
  GIT_PROGRESS   TRUE
  GIT_SHALLOW    TRUE
  EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(ftxui)

# Link the dependencies to the target
target_link_libraries(${PROJECT_NAME}
  PRIVATE ftxui::component  # Remove if not responding to user input
  PRIVATE ftxui::dom
  PRIVATE ftxui::screen
)
message(STATUS "All dependencies set up.")

# Add install target
install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})

# Print the build type
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}.")
```

Add the following to `main.cpp`.

```cpp
#include <cstdlib>  // for EXIT_SUCCESS

#include <ftxui/dom/elements.hpp>
#include <ftxui/screen/screen.hpp>

int main()
{
    using namespace ftxui;

    Element document =
        hbox({
            text("left") | border,
            text("middle") | border,
            text("right") | border,
        });

    auto screen = Screen::Create(
        Dimension::Full(),        // Width: Full screen
        Dimension::Fit(document)  // Height: Fit the document
    );

    Render(screen, document);
    screen.Print();

    return EXIT_SUCCESS;
}
```


### Build the Project

To build the project, create a `build` directory in the root of your project and `cd` into it.

```sh
mkdir build
cd build
```

You should have the following directory structure.

```
[~/tui] $ tree
.
├── CMakeLists.txt
├── build
└── src
    └── main.cpp
```

Now, while in the `build` directory, generate the build files using the `CMakeLists.txt` in the directory above. This will also download FTXUI, so it may take a while. Since my `CMakeLists.txt` defaults to `Release` mode (maximum optimization), you should use the `-DCMAKE_BUILD_TYPE=Debug` flag for faster compilation times at the cost of performance. To build in `Release` mode, simply use `cmake ..` without the flag. I recommend using `Debug` mode for development.

```sh
cmake .. -DCMAKE_BUILD_TYPE=Debug
```

Compile the project.

```sh
make
```

For significantly faster compilation times, use all available cores by passing the `-j` flag with the number of cores available on your system:

```sh
# macOS
make -j$(sysctl -n hw.ncpu)

# GNU/Linux
make -j$(nproc)

# 8-core CPU
make -j8
```

Run the program.

```sh
./tui
```

```
╭────╮╭──────╮╭─────╮
│left││middle││right│
╰────╯╰──────╯╰─────╯
```

Alright. We have a simple TUI app up and running.


## Modules

The library contains three modules:

- `ftxui/screen` defines the `ftxui::Screen`.
- `ftxui/dom` defines a set of `ftxui::Element` (they draw something on the `ftxui::Screen`).
- `ftxui/component` defines a set of `ftxui::Component` (only needed for user input, e.g., cursor, arrow keys).


### The screen module

The `ftxui/screen/*` module contains the `ftxui::Screen`.

`ftxui::Screen` is a grid of non-responsive `ftxui::Pixel`. `ftxui::Pixel` is a single Unicode character and its associated style (bold, colors, etc.).

```cpp
#include <cstdlib>  // for EXIT_SUCCESS

#include <ftxui/screen/screen.hpp>  // <-- ftuxi::Screen

int main()
{
    using namespace ftxui;

    ftxui::Screen screen = Screen::Create(  // <-- ftuxi::Screen
        Dimension::Fixed(16),               // Width: 16 pixels
        Dimension::Fixed(9)                 // Height: 9 pixels
    );

    // Set the first pixel to 'A', with bold and blue color
    ftxui::Pixel &pixel = screen.PixelAt(0, 0);  // <-- ftuxi::Pixel
    pixel.character = U'A';                      // The "U" prefix is for Unicode characters
    pixel.bold = true;
    pixel.foreground_color = Color::Blue;

    screen.Print();

    return EXIT_SUCCESS;
}
```

```
A
```


### The dom module

The `ftxui/dom/*` module contains `ftxui::Element`.

`ftxui::Element` is a single responsive element (and possibly a container). It can be styled, nested, and combined to create more complex layouts.

```cpp
#include <cstdlib>  // for EXIT_SUCCESS

#include <ftxui/dom/elements.hpp>  // <-- ftuxi::Element
#include <ftxui/screen/screen.hpp>

int main()
{
    using namespace ftxui;

    Element document =                                       // <-- ftxui::Element
        vbox({                                               // <-- ftxui::Element
            text("The window") | bold | color(Color::Blue),  // <-- ftxui::Element
            gauge(0.5),                                      // <-- ftxui::Element
            text("The footer"),                              // <-- ftxui::Element
        });

    auto screen = Screen::Create(
        Dimension::Full(),        // Width: Full screen
        Dimension::Fit(document)  // Height: Fit the document
    );

    Render(screen, document);
    screen.Print();

    return EXIT_SUCCESS;
}
```

```
The window
██████████████████████████████████████████████████████████████████████▍
The footer
```


#### Decorators

The `ftxui::Element` can be decorated in three different (but visually equivalent) ways:

```cpp
document = border(document);   // Function call
document = document | border;  // Pipe
document |= border;            // Pipe assignment
```

I personally find the pipe operator (`|`) to be the most readable.

The pipe assignment is useful when you want to apply a decorator later, like so:

```cpp
Element document =
    vbox({
        text("Top"),
        text("Bottom"),
    });

if (foo) {
    document |= color(Color::Red);  // <-- Apply in-place after creation
}
```

Of course, you can combine multiple decorators:

```cpp
Element document =
    vbox({
        bold(border(text("Top"))),       // <-- Function call
        text("Bottom") | border | bold,  // <-- Pipe
    }) | border | color(Color::Pink1);   // <-- Pipe
```


#### Text widget

`ftxui::text` is the simplest widget. It displays a single line of text horizontally.

```cpp
#include <cstdlib>  // for EXIT_SUCCESS

#include <ftxui/dom/elements.hpp>
#include <ftxui/screen/screen.hpp>

int main()
{
    using namespace ftxui;

    Element document =
        vbox({
            text("Hello world!"),    // <-- ftxui::text
            text("Goodbye world!"),  // <-- ftxui::text
        });

    auto screen = Screen::Create(
        Dimension::Full(),
        Dimension::Fit(document));

    Render(screen, document);
    screen.Print();

    return EXIT_SUCCESS;
}
```

```
Hello world!
Goodbye world!
```

The `ftxui::vtext` is its vertical counterpart.

```cpp
vtext("Hello world!");
```

```
H
e
l
l
o

w
o
r
l
d
!
```


#### Paragraph widget

`ftxui::paragraph` is like `ftxui::text`, but responsive. Individual words are wrapped across multiple lines based on the width of the container.

```cpp
#include <cstdlib>  // for EXIT_SUCCESS

#include <ftxui/dom/elements.hpp>
#include <ftxui/screen/screen.hpp>

int main()
{
    using namespace ftxui;

    Element document =
        vbox({
            paragraph("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris augue, ultricies ac congue eu, vulputate eget nibh. Nullam augue elit, commodo et nibh ac, pretium accumsan nulla. Aliquam et aliquet tortor. Suspendisse vitae vehicula mi, sit amet."),  // <-- ftxui::paragraph
        }) | border;

    auto screen = Screen::Create(
        Dimension::Full(),
        Dimension::Fit(document));

    Render(screen, document);
    screen.Print();

    return EXIT_SUCCESS;
}
```

If you make your terminal narrow, the text will be wrapped accordingly.

```
╭──────────────────────────────────────────────────────╮
│Lorem ipsum dolor sit amet, consectetur adipiscing    │
│elit. Mauris mauris augue, ultricies ac congue eu,    │
│vulputate eget nibh. Nullam augue elit, commodo et    │
│nibh ac, pretium accumsan nulla. Aliquam et aliquet   │
│tortor. Suspendisse vitae vehicula mi, sit amet.      │
╰──────────────────────────────────────────────────────╯
```

The `ftxui::paragraph` has four alignment variants:

```cpp
Element paragraph(std::string text);
Element paragraphAlignLeft(std::string text);
Element paragraphAlignRight(std::string text);
Element paragraphAlignCenter(std::string text);
Element paragraphAlignJustify(std::string text);
```

For example, the `ftxui::paragraphAlignRight` will align the text to the right:

```
╭──────────────────────────────────────────────────────╮
│    Lorem ipsum dolor sit amet, consectetur adipiscing│
│    elit. Mauris mauris augue, ultricies ac congue eu,│
│    vulputate eget nibh. Nullam augue elit, commodo et│
│   nibh ac, pretium accumsan nulla. Aliquam et aliquet│
│      tortor. Suspendisse vitae vehicula mi, sit amet.│
╰──────────────────────────────────────────────────────╯
```

As per the [original documentation](https://arthursonzogni.github.io/FTXUI/), paragraphs can be combined with mouse input, which shall be explained later.


<!-- ![Responsive paragraph](/static/content/beginner-ftxui-tutorial/responsive-paragraph.gif) -->


## Final Thoughts

This guide should give you a basic understanding of how to create TUI apps in C++. Consider explording the [FTXUI's GitHub repository](https://github.com/ArthurSonzogni/FTXUI). Perhaps you can contribute to the library or report any issues you encounter.
