+++
date = 2024-05-19T18:17:13+02:00
title = "Simple C++ App Setup (CMake)"
description = "How to setup a simple project for C++ apps"
tags = ["Tutorial", "CMake", "C++", "macOS", "Linux"]
type = "post"
showTableOfContents = true
image = "/images/simple-cmake-setup-preview.webp"
+++

![Preview](/images/simple-cmake-setup-preview.webp)


## Introduction

One of the most discouraging things about CMake is that every tutorial assumes that you have multiple libraries and executables to build.

But what if you're just starting out and don't know what you're doing? This guide is for you.

This guide has been tested on macOS and GNU/Linux.


## Setup

### Download CMake

First, you need to install CMake. On macOS, you can install it with [Homebrew](https://brew.sh/).

```sh
brew install cmake
```

Then, ensure it's installed by running:

```sh
cmake --version
```

### Create a C++ Project

Create a new directory for your project and `cd` into it.

```sh
mkdir myapp
cd myapp
```

Create a `src` directory for your C++ code.

```sh
mkdir src
```

Create a bunch of C++ files in the `src` directory.

```sh
touch src/main.cpp
touch src/lib.hpp
touch src/lib.cpp
```

You should have the following directory structure.

```
[~/myapp] $ tree
.
└── src
    ├── lib.cpp
    ├── lib.hpp
    └── main.cpp
```

Add the following to `main.cpp`.

```cpp
#include <iostream>  // for std::cout

#include "lib.hpp"

int main()
{
    std::cout << lib::get_hello_world() << '\n';
    return 0;
}
```

Add the following to `lib.hpp`.

**Note:** `[[nodiscard]]` requires C++17 and should be only placed in headers.

```cpp
#pragma once

#include <string>  // for std::string

namespace lib {

/**
 * @brief Get the hello world string.
 *
 * @return String containing "Hello World!".
 */
[[nodiscard]] std::string get_hello_world();

}  // namespace lib
```

Add the following to `lib.cpp`.

```cpp
#include "lib.hpp"

#include <string>  // for std::string

namespace lib {

std::string get_hello_world()
{
    return "Hello World!";
}

}  // namespace lib
```


### Create a CMakeLists.txt

Create a new file called `CMakeLists.txt` in the root of your project.

```touch
touch CMakeLists.txt
```

You should have the following directory structure.

```
[~/myapp] $ tree
.
├── CMakeLists.txt
└── src
    ├── lib.cpp
    ├── lib.hpp
    └── main.cpp
```

Add the following to `CMakeLists.txt`.

```cmake
# Set minimum required version of CMake
cmake_minimum_required(VERSION 3.24)

# Set project name and language
project(myapp LANGUAGES CXX)

# Set C++ standard to C++17, disable compiler-specific extensions and shared libraries
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(BUILD_SHARED_LIBS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Enforce out-of-source builds
if(CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
  message(FATAL_ERROR "In-source builds are not allowed. Use a separate build directory.")
endif()

# Set default build type to Release
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  message(STATUS "Defaulting to 'Release' build type.")
  set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Choose the build type." FORCE)
  set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Add executable target
add_executable(${PROJECT_NAME}
  src/main.cpp
  src/lib.cpp
)

# Include headers relatively to the src directory
target_include_directories(${PROJECT_NAME} PRIVATE src)

# Enable compile flags
if(NOT MSVC)
  # Clang, GCC
  target_compile_options(${PROJECT_NAME} PRIVATE
    -Wall                  # Enable all common warnings
    -Wextra                # Enable extra warnings
    -Wpedantic             # Enforce ISO C++ standards strictly
    -Werror                # Treat all warnings as errors
    -Wconversion           # Warn on implicit type conversions that may change value
    -Wsign-conversion      # Warn on sign conversions
    -Wshadow               # Warn when variables shadow others
    -Wnon-virtual-dtor     # Warn on classes with virtual functions but non-virtual destructors
    -Wold-style-cast       # Warn on C-style casts
    -Woverloaded-virtual   # Warn when a derived class function hides a virtual function
    -Wnull-dereference     # Warn if null dereference is detected
    -Wdouble-promotion     # Warn when a float is implicitly promoted to double
    -Wcast-align           # Warn on cast that increases required alignment
    -Wformat=2             # Enable format warnings (printf, etc.)
    -Wunused               # Warn on anything unused
    -finput-charset=UTF-8  # Set input file charset to UTF-8
    -fexec-charset=UTF-8   # Set execution charset to UTF-8
  )
else()
  # MSVC
  target_compile_options(${PROJECT_NAME} PRIVATE
    /W4              # Enable high warning level
    /WX              # Treat warnings as errors
    /utf-8           # Use UTF-8 encoding for source and execution
    /permissive-     # Enforce strict C++ standard conformance
    /Zc:__cplusplus  # Set __cplusplus macro to correct value
  )
endif()

# Add install target (for "sudo cmake --install .")
include(GNUInstallDirs)
install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})

# Print the build type
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}.")
```

Now let's go step by step through the `CMakeLists.txt`.

1. Set the minimum required version of CMake. As a rule of thumb, you should set this to the version you have installed, but refer to [this](https://cliutils.gitlab.io/modern-cmake/chapters/intro/dodonot.html) for more information.
    ```cmake
    cmake_minimum_required(VERSION 3.24)
    ```

2. Set the project's name to `myapp` and the language to C++. You can replace `myapp` with your project's name, e.g., `awesome`.
    ```cmake
    project(myapp LANGUAGES CXX)
    ```

3. Set the required C++ standard to 17 and disable compiler-specific extensions (e.g., `gnu++17`) to ensure that your code is cross-platform. Disable shared libraries to ensure that the executable is self-contained (larger file size but less headaches). Enable exporting of the compile commands to a JSON file, which is useful for IDEs.
    ```cmake
    set(CMAKE_CXX_STANDARD 17)
    set(CMAKE_CXX_STANDARD_REQUIRED ON)
    set(CMAKE_CXX_EXTENSIONS OFF)
    set(BUILD_SHARED_LIBS OFF)
    set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
    ```

4. Ensure that you don't build in the root or `src` directory. You should always build in the `build` directory to ensure that your project doesn't get polluted with build files and cache.
    ```cmake
    if(CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
      message(FATAL_ERROR "In-source builds are not allowed. Use a separate build directory.")
    endif()
    ```

5. Set the default build type to `Release`. By default, CMake will not set any build type. You'd probably want to set it to `Release` by default to make it more convenient for end users. This will also enable the all optimizations (e.g., `-O3` or `-O2`). When developing, you'd probably want to use the `Debug` build type using the `-DCMAKE_BUILD_TYPE=BUILD_TYPE` flag, as it makes compilation much faster at the cost of performance. This is done using `cmake .. -DCMAKE_BUILD_TYPE=Debug` command.
    ```cmake
    if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
      message(STATUS "Defaulting to 'Release' build type.")
      set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Choose the build type." FORCE)
      set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
    endif()
    ```

6. Set the executable's name to `${PROJECT_NAME}` (which is `myapp` in this case) and add the source files to it. The files should be listed explicitly, as globbing will require re-running CMake to detect new files. Listing the files explicitly is a [good practice](https://stackoverflow.com/questions/1027247/is-it-better-to-specify-source-files-with-glob-or-each-file-individually-in-cmak), especially when working with [multiple people](https://stackoverflow.com/questions/32411963/why-is-cmake-file-glob-evil).
    ```cmake
    add_executable(${PROJECT_NAME}
      src/main.cpp
      src/lib.cpp
    )
    ```

7. Allow including headers relative to the `src` directory. This allows includes to be relative to the `src` directory instead of the `.cpp` file. For example, if you wanted to include `src/core/header.hpp` inside `src/utils/string.cpp`, you'd write `#include "core/header.hpp"` (relative to `src`) instead of `#include "../core/header.hpp"` (relative to `src/utils/string.cpp`). Normally, you'd use it to include headers from a different directory, e.g., `root/include/myapp`, but I prefer to keep everything in the `src` directory. It's a matter of preference, *unless* you're creating a library, in which case you should put the headers in a separate directory.
    ```cmake
    target_include_directories(${PROJECT_NAME} PRIVATE src)
    ```

    If you wrap your code in namespaces that match the subdirectory names...

    ```cpp
    // src/core/header.hpp

    #pragma once

    namespace core::header {    // Same as the directory name (core), same as the header name (header.hpp)

    void foo();

    }  // namespace core::header
    ```

    ...then this approach makes namespace resolution match the include path, which looks clean.

    ```cpp
    // src/utils/string.cpp

    #include "core/header.hpp"  // Relative to "src"

    core::header::foo();
    ```

    Otherwise, you'd have to add the `..`, which looks ugly.

    ```cpp
    // src/utils/string.cpp

    #include "../core/header.hpp" // Relative to "src/utils/string.cpp"

    core::header::foo();
    ```

8.  Enable compile warnings. This is a good practice to catch potential bugs early. Use `target_compile_options` instead of `add_compile_options` to only enable it for your code. If you add a 3rd party library, you don't want to see their warnings.
    ```cmake
    # Enable compile flags
    if(NOT MSVC)
      # Clang, GCC
      target_compile_options(${PROJECT_NAME} PRIVATE
        -Wall                  # Enable all common warnings
        -Wextra                # Enable extra warnings
        -Wpedantic             # Enforce ISO C++ standards strictly
        -Werror                # Treat all warnings as errors
        -Wconversion           # Warn on implicit type conversions that may change value
        -Wsign-conversion      # Warn on sign conversions
        -Wshadow               # Warn when variables shadow others
        -Wnon-virtual-dtor     # Warn on classes with virtual functions but non-virtual destructors
        -Wold-style-cast       # Warn on C-style casts
        -Woverloaded-virtual   # Warn when a derived class function hides a virtual function
        -Wnull-dereference     # Warn if null dereference is detected
        -Wdouble-promotion     # Warn when a float is implicitly promoted to double
        -Wcast-align           # Warn on cast that increases required alignment
        -Wformat=2             # Enable format warnings (printf, etc.)
        -Wunused               # Warn on anything unused
        -finput-charset=UTF-8  # Set input file charset to UTF-8
        -fexec-charset=UTF-8   # Set execution charset to UTF-8
      )
    else()
      # MSVC
      target_compile_options(${PROJECT_NAME} PRIVATE
        /W4              # Enable high warning level
        /WX              # Treat warnings as errors
        /utf-8           # Use UTF-8 encoding for source and execution
        /permissive-     # Enforce strict C++ standard conformance
        /Zc:__cplusplus  # Set __cplusplus macro to correct value
      )
    endif()
    ```

9.  Add install target, so that the program can be installed using `sudo cmake --install .`.
    ```cmake
    include(GNUInstallDirs)
    install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})
    ```

10. Print the build type to the console as a sanity check.
    ```cmake
    message(STATUS "Build type: ${CMAKE_BUILD_TYPE}.")
    ```


### Build the Project

To build the project, create a `build` directory in the root of your project and `cd` into it.

```sh
mkdir build
cd build
```

You should have the following directory structure.

```
[~/myapp] $ tree
.
├── CMakeLists.txt
├── build
└── src
    ├── lib.cpp
    ├── lib.hpp
    └── main.cpp
```

Generate the build files using the `CMakeLists.txt` in the directory above with the `Debug` build type (while still in the `build` directory).

```sh
cmake .. -DCMAKE_BUILD_TYPE=Debug
```

Compile the project (while still in the `build` directory).

```sh
cmake --build . --parallel
```

Run the program (while still in the `build` directory).

```sh
./myapp
```

Now let's go step by step through what you did.

1. You created a `build` directory in the root of your project and `cd` into it.
    ```sh
    mkdir build
    cd build
    ```

2. You used CMake to generate a platform-specific build system while being in the `build` directory. The `..` is a relative path pointing to the directory above. In this context, it refers to the root of your project (`~/myapp`), which is where the `CMakeLists.txt` is located. The `-DCMAKE_BUILD_TYPE=BUILD_TYPE` flag, as mentioned earlier, sets the build type to `Debug` for faster compilation times at the cost of performance. Depending on your environment, the output could be a Makefile, Ninja, or a Visual Studio solution. If you've ever had to manually create a Makefile, you'll appreciate how CMake simplifies this process by automatically generating the build system for you.
    ```sh
    cmake .. -DCMAKE_BUILD_TYPE=Debug
    ```

3. You used the generated build system to compile the project. The `-parallel` flag is used to speed up the compilation process by utilizing multiple cores.
    ```sh
    cmake --build . --parallel
    ```

Once you have generated the build system, you don't need to run `cmake ..` again. You only need to run `cmake --build . --parallel` to compile the project. The regeneration will only be required if you modify the `CMakeLists.txt` (e.g., add more source files).


## Add 3rd Party Libraries

If you want to add a 3rd party library, you can use `FetchContent` to download it during the configuration step. `FetchContent` is quite flexible and can even download a Git repository at a specific tag - refer to [this](https://www.foonathan.net/2022/06/cmake-fetchcontent/) for more information. [Git submodules](https://lchsk.com/how-to-use-git-submodules-and-cmake-to-install-c-libraries) are also quite convenient, but they are beyond the scope of this tutorial.

The basic usage is as follows - you download a [3rd party library](https://github.com/daniele77/cli) and link it to your project. The `GIT_SHALLOW` option is used to download only the latest commit and not the entire history. The `EXCLUDE_FROM_ALL` option is used to exclude the library from the default build target, so that you don't have to build it every time you run `cmake --build . --parallel`. The `SYSTEM` option is used to tell CMake that the library is a system library, which prevents compile warnings from being applied to it. You don't want to see warnings from 3rd party libraries, as they are out of your control.

```cmake
include(FetchContent)

FetchContent_Declare(
  cli
  GIT_REPOSITORY https://github.com/daniele77/cli.git
  GIT_TAG        v2.1.0
  GIT_PROGRESS   TRUE
  GIT_SHALLOW    TRUE
  EXCLUDE_FROM_ALL
  SYSTEM
)
FetchContent_MakeAvailable(cli)

target_link_libraries(${PROJECT_NAME} PRIVATE cli::cli)
```

The same goes for downloading content using a URL.

```cmake
FetchContent_Declare(
  json
  URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
  EXCLUDE_FROM_ALL
  SYSTEM
)
```

Once you run `cmake ..` inside the `build` directory, the `cli` library will be downloaded, built, and linked to your project.

However, you can also disable updates on every configure, enable verbose logging, and set the download directory to `deps` instead of storing it in the `build` directory. This makes it easier to `rm -rf` the `build` directory if something goes wrong.

```cmake
include(FetchContent)

# Setup dependency management, disable updates on every configure, enable verbose logging, set the download directory to "deps"
set(FETCHCONTENT_UPDATES_DISCONNECTED ON)
set(FETCHCONTENT_QUIET OFF)
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/deps)

FetchContent_Declare(
  cli
  GIT_REPOSITORY https://github.com/daniele77/cli.git
  GIT_TAG        v2.1.0
  GIT_PROGRESS   TRUE
  GIT_SHALLOW    TRUE
  EXCLUDE_FROM_ALL
  SYSTEM
)
FetchContent_MakeAvailable(cli)

target_link_libraries(${PROJECT_NAME} PRIVATE cli::cli)
```


### Final CMakeLists.txt

Here is the final `CMakeLists.txt` with the `cli` library added.

```cmake
# Set minimum required version of CMake
cmake_minimum_required(VERSION 3.24)

# Set project name and language
project(myapp LANGUAGES CXX)

# Set C++ standard to C++17, disable compiler-specific extensions and shared libraries
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(BUILD_SHARED_LIBS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Enforce out-of-source builds
if(CMAKE_SOURCE_DIR STREQUAL CMAKE_BINARY_DIR)
  message(FATAL_ERROR "In-source builds are not allowed. Use a separate build directory.")
endif()

# Set default build type to Release
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  message(STATUS "Defaulting to 'Release' build type.")
  set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Choose the build type." FORCE)
  set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Add executable target
add_executable(${PROJECT_NAME}
  src/main.cpp
  src/lib.cpp
)

# Include headers relatively to the src directory
target_include_directories(${PROJECT_NAME} PRIVATE src)

# Enable compile flags
if(NOT MSVC)
  # Clang, GCC
  target_compile_options(${PROJECT_NAME} PRIVATE
    -Wall                  # Enable all common warnings
    -Wextra                # Enable extra warnings
    -Wpedantic             # Enforce ISO C++ standards strictly
    -Werror                # Treat all warnings as errors
    -Wconversion           # Warn on implicit type conversions that may change value
    -Wsign-conversion      # Warn on sign conversions
    -Wshadow               # Warn when variables shadow others
    -Wnon-virtual-dtor     # Warn on classes with virtual functions but non-virtual destructors
    -Wold-style-cast       # Warn on C-style casts
    -Woverloaded-virtual   # Warn when a derived class function hides a virtual function
    -Wnull-dereference     # Warn if null dereference is detected
    -Wdouble-promotion     # Warn when a float is implicitly promoted to double
    -Wcast-align           # Warn on cast that increases required alignment
    -Wformat=2             # Enable format warnings (printf, etc.)
    -Wunused               # Warn on anything unused
    -finput-charset=UTF-8  # Set input file charset to UTF-8
    -fexec-charset=UTF-8   # Set execution charset to UTF-8
  )
else()
  # MSVC
  target_compile_options(${PROJECT_NAME} PRIVATE
    /W4              # Enable high warning level
    /WX              # Treat warnings as errors
    /utf-8           # Use UTF-8 encoding for source and execution
    /permissive-     # Enforce strict C++ standard conformance
    /Zc:__cplusplus  # Set __cplusplus macro to correct value
  )
endif()

# Setup dependency management, disable updates on every configure, enable verbose logging, set the download directory to "deps"
include(FetchContent)
set(FETCHCONTENT_UPDATES_DISCONNECTED ON)
set(FETCHCONTENT_QUIET OFF)
set(FETCHCONTENT_BASE_DIR ${CMAKE_SOURCE_DIR}/deps)

# Add cli as a dependency
FetchContent_Declare(
  cli
  GIT_REPOSITORY https://github.com/daniele77/cli.git
  GIT_TAG        v2.1.0
  GIT_PROGRESS   TRUE
  GIT_SHALLOW    TRUE
  EXCLUDE_FROM_ALL
  SYSTEM
)
FetchContent_MakeAvailable(cli)

# Link the dependencies to the target
target_link_libraries(${PROJECT_NAME} PRIVATE cli::cli)

# Add install target (for "sudo cmake --install .")
include(GNUInstallDirs)
install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})

# Print the build type
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}.")
```

Once you run `mkdir build && cd build && cmake .. && cmake --build . --parallel`, the final directory structure will look similar to this.

```
[~/myapp] $ tree
.
├── CMakeLists.txt
├── build
│   ├── Makefile
│   └── myapp
├── deps
│   └── cli-src
└── src
    ├── lib.cpp
    ├── lib.hpp
    └── main.cpp
```

That's it.


## Final Thoughts

This guide should give you a basic understanding of how to set up a simple CMake project with 3rd party libraries. Don't forget to add `build` and `deps` to your `.gitignore`.

```
/build
/deps
```
