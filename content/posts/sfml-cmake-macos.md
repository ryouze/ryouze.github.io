+++
date = 2024-10-16T16:33:00+02:00
title = "Building C++ SFML App Bundles on macOS"
description = "How to package a cross-platform C++ SFML app as an app bundle on macOS using CMake"
tags = ["Tutorial", "CMake", "C++", "macOS", "SFML"]
type = "post"
showTableOfContents = true
image = "/images/sfml-cmake-macos-preview.webp"
+++

![Preview](/images/sfml-cmake-macos-preview.webp)


## Note

This guide is temporarily outdated due to the release of SFML 3.

In particular, the section about bundling frameworks applies only to SFML 2, as SFML 3 bundles all the required frameworks into the static library. It even bundles the audio on Windows, which was previously a separate DLL.

I will update this guide for SFML 3 once I finish my [2D drift racing game](https://github.com/ryouze/vroom). In the meantime, as a workaround, you can probably remove the following:

```
INSTALL_RPATH "@executable_path/../Frameworks"
BUILD_WITH_INSTALL_RPATH TRUE

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E remove_directory $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks
  COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks
  COMMENT "Cleaning Frameworks directory"
)

# Copy all frameworks into the app bundle
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
  COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/
      $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
  COMMENT "Copying all SFML frameworks into the app bundle"
)
```

There are some differences in targets, for example, `sfml-main` became `SFML::Main`.

As mentioned earlier, I will update this once my game is finished. I have added this note to help you out in the meantime.


## Introduction

The [CMake SFML Project Template](https://github.com/SFML/cmake-sfml-project) is a great starter template for creating cross-platform applications with SFML. Unfortunately, it does not include a method to package the application for native macOS deployment, i.e., as an app bundle.

For simple command-line applications that are statically linked (`set(BUILD_SHARED_LIBS OFF)`), you can use `install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})` to install the app to `/usr/local/bin` with `sudo cmake --install .`. However, if you install an SFML app this way, it will complain about missing dynamically linked dependencies such as [FreeType](https://freetype.org/). Moreover, the app must be started from the command line, which is not user-friendly.

GUI apps are typically distributed as app bundles that users can drag and drop into their `Applications` folder. App bundles are directories with a `.app` extension that contain the app's executable, resources, and metadata. For example, your SFML `CMakeSFMLProject.app` app bundle might look like this:

```sh
[/Applications] $ tree -l CMakeSFMLProject.app/
CMakeSFMLProject.app/
└── Contents
    ├── Frameworks
    │   └── freetype.framework
    │       ├── Resources -> Versions/Current/Resources
    │       │   └── Info.plist
    │       ├── Versions
    │       │   ├── A
    │       │   │   ├── Resources
    │       │   │   │   └── Info.plist
    │       │   │   └── freetype
    │       │   └── Current -> A  [recursive, not followed]
    │       └── freetype -> Versions/Current/freetype
    ├── Info.plist
    └── MacOS
        └── CMakeSFMLProject
```


## Download the CMake SFML Project Template

Follow these steps to download the project template:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/SFML/cmake-sfml-project.git
    ```

2. **Change directory to the cloned repository**:

    ```sh
    cd cmake-sfml-project
    ```

3. **Check out the commit used in this tutorial**:

    This is for simplicity. Use the latest commit when building your own app (i.e., do not check out this specific commit).

    ```sh
    git checkout 969c5cd70278bd7316742bd27d9ccd7a363196e5
    ```


### Modify the CMakeLists.txt File

You only need to make a few changes to the `CMakeLists.txt` file to package the app as an app bundle.

Original `CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.28)
project(CMakeSFMLProject LANGUAGES CXX)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)

include(FetchContent)
FetchContent_Declare(SFML
    GIT_REPOSITORY https://github.com/SFML/SFML.git
    GIT_TAG 2.6.x
    GIT_SHALLOW ON
    EXCLUDE_FROM_ALL
    SYSTEM)
FetchContent_MakeAvailable(SFML)

add_executable(main src/main.cpp)
target_link_libraries(main PRIVATE sfml-graphics)
target_compile_features(main PRIVATE cxx_std_17)

if(WIN32)
    add_custom_command(
        TARGET main
        COMMENT "Copy OpenAL DLL"
        PRE_BUILD COMMAND ${CMAKE_COMMAND} -E copy ${SFML_SOURCE_DIR}/extlibs/bin/$<IF:$<EQUAL:${CMAKE_SIZEOF_VOID_P},8>,x64,x86>/openal32.dll $<TARGET_FILE_DIR:main>
        VERBATIM)
endif()
```

Modified `CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.28)
project(CMakeSFMLProject LANGUAGES CXX)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)

include(FetchContent)
FetchContent_Declare(SFML
    GIT_REPOSITORY https://github.com/SFML/SFML.git
    GIT_TAG 2.6.x
    GIT_SHALLOW ON
    EXCLUDE_FROM_ALL
    SYSTEM)
FetchContent_MakeAvailable(SFML)

add_executable(${PROJECT_NAME} src/main.cpp)
target_link_libraries(${PROJECT_NAME} PRIVATE sfml-graphics)
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)

# For all platforms, add install targets
# If on macOS, bundle the executable into an app bundle
if(APPLE)
    # Set variables for Info.plist
    set(MACOSX_BUNDLE_BUNDLE_NAME ${PROJECT_NAME})  # Short name
    set(MACOSX_BUNDLE_GUI_IDENTIFIER "com.yourname.${PROJECT_NAME}")  # com.YOURCOMPANY.YOURAPP
    set(MACOSX_BUNDLE_BUNDLE_VERSION "1.0")
    set(MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0")

    # Generate the Info.plist file
    configure_file(${CMAKE_SOURCE_DIR}/Info.plist.in ${CMAKE_BINARY_DIR}/Info.plist @ONLY)

    # Set macOS-specific properties
    set_target_properties(${PROJECT_NAME} PROPERTIES
        MACOSX_BUNDLE TRUE
        MACOSX_BUNDLE_INFO_PLIST ${CMAKE_BINARY_DIR}/Info.plist
        INSTALL_RPATH "@executable_path/../Frameworks"
        BUILD_WITH_INSTALL_RPATH TRUE
    )

    # # Copy the icon into the app bundle
    # add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    #     COMMAND ${CMAKE_COMMAND} -E copy
    #         ${CMAKE_SOURCE_DIR}/Icon.icns
    #         $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Resources/Icon.icns
    #     COMMENT "Copying icon to the app bundle"
    # )

    # Clean up the Frameworks directory before copying
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E remove_directory $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks
        COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks
        COMMENT "Cleaning Frameworks directory"
    )

    # Copy all frameworks into the app bundle
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/
            $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
        COMMENT "Copying all SFML frameworks into the app bundle"
    )

    # # Copy only the SFML freetype framework into the app bundle
    # add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    #     COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/freetype.framework
    #         $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
    #     COMMENT "Copying SFML freetype framework into the app bundle"
    # )

    # Add install target for macOS app bundle
    install(TARGETS ${PROJECT_NAME} BUNDLE DESTINATION /Applications)
else()
    # Add install target for regular executable
    install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})
endif()

if(WIN32)
    add_custom_command(
        TARGET ${PROJECT_NAME}
        COMMENT "Copy OpenAL DLL"
        PRE_BUILD COMMAND ${CMAKE_COMMAND} -E copy ${SFML_SOURCE_DIR}/extlibs/bin/$<IF:$<EQUAL:${CMAKE_SIZEOF_VOID_P},8>,x64,x86>/openal32.dll $<TARGET_FILE_DIR:${PROJECT_NAME}>
        VERBATIM)
endif()
```

You also need `Info.plist.in` in the root directory to generate the `Info.plist` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Name of the executable file in the bundle. -->
    <key>CFBundleExecutable</key>
    <string>@MACOSX_BUNDLE_BUNDLE_NAME@</string>

    <!-- Unique identifier for the application, typically in reverse DNS format. -->
    <key>CFBundleIdentifier</key>
    <string>@MACOSX_BUNDLE_GUI_IDENTIFIER@</string>

    <!-- Short name of the bundle. This is the name that appears in the Finder and other parts of the macOS user interface. -->
    <key>CFBundleName</key>
    <string>@MACOSX_BUNDLE_BUNDLE_NAME@</string>

    <!-- Version of the bundle. This is a string that represents the build version of the application. -->
    <key>CFBundleVersion</key>
    <string>@MACOSX_BUNDLE_BUNDLE_VERSION@</string>

    <!-- Release version number of the bundle. This is a user-visible version number. -->
    <key>CFBundleShortVersionString</key>
    <string>@MACOSX_BUNDLE_SHORT_VERSION_STRING@</string>

    <!-- Type of bundle. For applications, this is typically APPL. -->
    <key>CFBundlePackageType</key>
    <string>APPL</string>

    <!-- Path to the application icon file -->
    <!-- <key>CFBundleIconFile</key>
    <string>Icon.icns</string> -->
</dict>
</plist>
```

```sh
[~/dev/cmake-sfml-project] $ tree
.
├── CMakeLists.txt
├── Info.plist.in
├── LICENSE.md
├── README.md
└── src
    └── main.cpp
```

Ok, so what is new?

We changed all instances of `main` to `${PROJECT_NAME}` to make the output executable name match the project name. This is personal preference; you can set `SET(EXECUTABLE_NAME "example")` below `project()` and replace `${PROJECT_NAME}` with `${EXECUTABLE_NAME}` if you prefer.

```cmake
cmake_minimum_required(VERSION 3.28)
project(CMakeSFMLProject LANGUAGES CXX)
set(EXECUTABLE_NAME "hello")
```

We added a conditional block that checks if the platform is macOS. If it is, we set the `MACOSX_BUNDLE` property to `TRUE` and provide the path to the `Info.plist` file. We also set the `INSTALL_RPATH` property to `@executable_path/../Frameworks` to tell the app where to find the SFML frameworks. We then copy all the SFML frameworks into the app bundle using `add_custom_command`. The `rsync` command preserves symlinks, so unnecessary copies of the frameworks are not made. Finally, we add an install target for the macOS app bundle.

**Note:** The uncommented `# Copy all frameworks into the app bundle` block copies all frameworks (graphics, audio, etc.) into the app bundle. If you do not use audio, you can comment out the `# Copy all frameworks into the app bundle` block and uncomment the `# Copy only the SFML freetype framework into the app bundle` block to copy only the freetype framework. This will greatly reduce the size of the app bundle. However, if you are just starting out, copying all frameworks is a good idea.

```cmake
# Copy all frameworks into the app bundle
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/
        $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
    COMMENT "Copying all SFML frameworks into the app bundle"
)

# # Copy only the SFML freetype framework into the app bundle
# add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
#     COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/freetype.framework
#         $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
#     COMMENT "Copying SFML freetype framework into the app bundle"
# )
```

```cmake
# # Copy all frameworks into the app bundle
# add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
#     COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/
#         $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
#     COMMENT "Copying all SFML frameworks into the app bundle"
# )

# Copy only the SFML freetype framework into the app bundle
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND rsync -a ${SFML_SOURCE_DIR}/extlibs/libs-osx/Frameworks/freetype.framework
        $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
    COMMENT "Copying SFML freetype framework into the app bundle"
)
```


### Building the App Bundle

Follow these steps to build the project:

1. **Generate the build system**:

    ```sh
    mkdir build && cd build
    cmake .. -DCMAKE_BUILD_TYPE=Release
    ```

2. **Compile the project**:

    ```sh
    cmake --build . --parallel
    ```

The app is now compiled.

```sh
[~/dev/cmake-sfml-project/build] $ tree -L2
.
├── CMakeCache.txt
├── CMakeFiles
│   ├── 3.30.4
│   ├── CMakeConfigureLog.yaml
│   ├── CMakeDirectoryInformation.cmake
│   ├── CMakeSFMLProject.dir
│   ├── CMakeScratch
│   ├── Makefile.cmake
│   ├── Makefile2
│   ├── TargetDirectories.txt
│   ├── cmake.check_cache
│   ├── pkgRedirects
│   └── progress.marks
├── CPackConfig.cmake
├── CPackSourceConfig.cmake
├── Info.plist
├── Makefile
├── _deps
│   ├── sfml-build
│   ├── sfml-src
│   └── sfml-subbuild
├── bin
│   └── CMakeSFMLProject.app
└── cmake_install.cmake
```

As you can see, the `Info.plist` file was generated based on the variables set in the `CMakeLists.txt` file. There is now also an app bundle in the `bin` directory.

To run it, you can either double-click the app bundle in Finder (`bin/CMakeSFMLProject.app`) or run it from the command line:

```sh
open bin/CMakeSFMLProject.app
```


### Installing the App Bundle

To install the app bundle to `/Applications`, use the following command while in the `build` directory:

```sh
sudo cmake --install .
```

You can now find the app in `/Applications`:

```sh
[/Applications] $ tree -l CMakeSFMLProject.app/
CMakeSFMLProject.app/
└── Contents
    ├── Frameworks
    │   └── freetype.framework
    │       ├── Resources -> Versions/Current/Resources
    │       │   └── Info.plist
    │       ├── Versions
    │       │   ├── A
    │       │   │   ├── Resources
    │       │   │   │   └── Info.plist
    │       │   │   └── freetype
    │       │   └── Current -> A  [recursive, not followed]
    │       └── freetype -> Versions/Current/freetype
    ├── Info.plist
    └── MacOS
        └── CMakeSFMLProject
```

As shown, only the freetype framework was copied into the app bundle.


## Cross-platform CI/CD

Building the app on your local machine is sufficient for development, but GitHub Actions can build and package your app for macOS, Linux, and Windows, all at the same time. Setting up a CI/CD pipeline is straightforward if you are already using a cross-platform build system like CMake.

The CMake SFML Project Template already includes a simple `.github/workflows/ci.yml` file, but you can extend it.

Original `.github/workflows/ci.yml`:

```yml
name: CI

on: [push, pull_request]

defaults:
  run:
    shell: bash

jobs:
  build:
    name: ${{ matrix.platform.name }} ${{ matrix.config.name }}
    runs-on: ${{ matrix.platform.os }}

    strategy:
      fail-fast: false
      matrix:
        platform:
        - { name: Windows VS2019, os: windows-2019  }
        - { name: Windows VS2022, os: windows-2022  }
        - { name: Linux GCC,      os: ubuntu-latest }
        - { name: Linux Clang,    os: ubuntu-latest, flags: -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ }
        - { name: macOS,          os: macos-latest  }
        config:
        - { name: Shared, flags: -DBUILD_SHARED_LIBS=TRUE }
        - { name: Static, flags: -DBUILD_SHARED_LIBS=FALSE }

    steps:
    - name: Install Linux Dependencies
      if: runner.os == 'Linux'
      run: sudo apt-get update && sudo apt-get install libxrandr-dev libxcursor-dev libudev-dev libopenal-dev libflac-dev libvorbis-dev libgl1-mesa-dev libegl1-mesa-dev

    - name: Checkout
      uses: actions/checkout@v4

    - name: Configure
      run: cmake -B build ${{matrix.platform.flags}} ${{matrix.config.flags}}

    - name: Build
      run: cmake --build build --config Release
```

Modified `.github/workflows/ci.yml`:

```yml
# This starter workflow is for a CMake project running on multiple platforms. There is a different starter workflow if you just want a single platform.
# See: https://github.com/actions/starter-workflows/blob/main/ci/cmake-single-platform.yml
name: CI

on:
  push:
    branches:
      - main
    paths-ignore:
      - "LICENSE"
      - "README.md"
  pull_request:
    branches:
      - main
    paths-ignore:
      - "LICENSE"
      - "README.md"

jobs:
  build:
    runs-on: ${{ matrix.os }}

    strategy:
      # If true, cancel the workflow run if any matrix job fails.
      # If false, continue to run the workflow and complete all matrix jobs, even if one or more jobs fail.
      fail-fast: false

      matrix:
        include:
          - os: macos-latest
            build_type: Release
            # c_compiler: clang
            cpp_compiler: clang++
          - os: ubuntu-latest
            build_type: Release
            # c_compiler: gcc
            cpp_compiler: g++
          - os: windows-latest
            build_type: Release
            # c_compiler: cl
            cpp_compiler: cl

    steps:
    - uses: actions/checkout@v4

    - name: Set reusable strings
      # Turn repeated input strings (such as the build output directory) into step outputs. These step outputs can be used throughout the workflow file.
      id: strings
      shell: bash
      run: |
        echo "build-output-dir=${{ github.workspace }}/build" >> "$GITHUB_OUTPUT"

    - name: Cache CMake build directory
      uses: actions/cache@v4
      with:
        path: ${{ steps.strings.outputs.build-output-dir }}
        key: ${{ runner.os }}-build-${{ hashFiles('CMakeLists.txt') }}-${{ hashFiles('cmake/**') }}
        restore-keys: |
          ${{ runner.os }}-build-

    - name: Install Linux dependencies
      if: runner.os == 'Linux'
      run: sudo apt-get update && sudo apt-get install libxrandr-dev libxcursor-dev libudev-dev libopenal-dev libflac-dev libvorbis-dev libgl1-mesa-dev libegl1-mesa-dev

    - name: Configure CMake
      # Configure CMake in a 'build' subdirectory. `CMAKE_BUILD_TYPE` is only required if you are using a single-configuration generator such as make.
      # See https://cmake.org/cmake/help/latest/variable/CMAKE_BUILD_TYPE.html?highlight=cmake_build_type
      # Set "-DCMAKE_C_COMPILER=${{ matrix.c_compiler }}" for C/C++ projects, otherwise use CXX for C++ only projects.
      run: >
        cmake -B ${{ steps.strings.outputs.build-output-dir }}
        -DCMAKE_CXX_COMPILER=${{ matrix.cpp_compiler }}
        -DCMAKE_BUILD_TYPE=${{ matrix.build_type }}
        -S ${{ github.workspace }}

    - name: Build
      # Build your program with the given configuration. Note that --config is needed because the default Windows generator is a multi-config generator (Visual Studio generator).
      run: cmake --build ${{ steps.strings.outputs.build-output-dir }} --config Release --parallel
```

I have based my CI setup on the [CMake multi-platform starter](https://github.com/actions/starter-workflows/blob/main/ci/cmake-multi-platform.yml) workflow. I have also added caching for the `build` directory, since building SFML from source normally takes a long time. I also removed the `BUILD_SHARED_LIBS` option, compile flags, and other settings that I typically set in the `CMakeLists.txt` file (see [Final Thoughts](#final-thoughts) for a working example).

Now let's create a release action that will package the app bundle for all platforms: `.github/workflows/release.yml`.

```yml
name: Release

on:
  release:
    types: [created]

permissions:
  contents: write

jobs:
  build-and-upload:
    runs-on: ${{ matrix.os }}

    strategy:
      # If true, cancel the workflow run if any matrix job fails.
      # If false, continue to run the workflow and complete all matrix jobs, even if one or more jobs fail.
      fail-fast: true

      matrix:
        include:
          - os: macos-latest
            # c_compiler: clang
            cpp_compiler: clang++
            input_name: bin/CMakeSFMLProject.app
            output_name: CMakeSFMLProject-macos-arm64.app
            archive_name: CMakeSFMLProject-macos-arm64.tar.gz
            archive_type: tar
          - os: ubuntu-latest
            # c_compiler: gcc
            cpp_compiler: g++
            input_name: bin/CMakeSFMLProject
            output_name: CMakeSFMLProject-linux-x86_64
            archive_name: CMakeSFMLProject-linux-x86_64.tar.gz
            archive_type: tar
          - os: windows-latest
            # c_compiler: cl
            cpp_compiler: cl
            input_name: bin/Release/CMakeSFMLProject.exe
            output_name: CMakeSFMLProject-windows-x86_64.exe
            archive_name: CMakeSFMLProject-windows-x86_64.zip
            archive_type: zip

    steps:
      - uses: actions/checkout@v4

      - name: Set reusable strings
        # Turn repeated input strings (such as the build output directory) into step outputs. These step outputs can be used throughout the workflow file.
        id: strings
        shell: bash
        run: |
          echo "build-output-dir=${{ github.workspace }}/build" >> "$GITHUB_OUTPUT"

      - name: Cache CMake build directory
        uses: actions/cache@v4
        with:
          path: ${{ steps.strings.outputs.build-output-dir }}
          key: ${{ runner.os }}-build-${{ hashFiles('CMakeLists.txt') }}-${{ hashFiles('cmake/**') }}
          restore-keys: |
            ${{ runner.os }}-build-

      - name: Install Linux dependencies
        if: runner.os == 'Linux'
        run: sudo apt-get update && sudo apt-get install libxrandr-dev libxcursor-dev libudev-dev libopenal-dev libflac-dev libvorbis-dev libgl1-mesa-dev libegl1-mesa-dev

      - name: Configure CMake
        # Configure CMake in a 'build' subdirectory. `CMAKE_BUILD_TYPE` is only required if you are using a single-configuration generator such as make.
        # See https://cmake.org/cmake/help/latest/variable/CMAKE_BUILD_TYPE.html?highlight=cmake_build_type
        # Set the project version to the tag name instead of git commit.
        # Set "-DCMAKE_C_COMPILER=${{ matrix.c_compiler }}" for C/C++ projects, otherwise use CXX for C++ only projects.
        run: >
          cmake -B ${{ steps.strings.outputs.build-output-dir }}
          -DCMAKE_CXX_COMPILER=${{ matrix.cpp_compiler }}
          -DCMAKE_BUILD_TYPE=Release
          -DPROJECT_VERSION="${{ github.ref_name }}"
          -S ${{ github.workspace }}

      - name: Build
        # Build your program with the given configuration. Note that --config is needed because the default Windows generator is a multi-config generator (Visual Studio generator).
        run: cmake --build ${{ steps.strings.outputs.build-output-dir }} --config Release --parallel

      - name: Rename binary
        # Rename the binary to match the platform.
        working-directory: ${{ steps.strings.outputs.build-output-dir }}
        shell: bash
        run: |
          echo "Renaming '${{ matrix.input_name }}' to '${{ matrix.output_name }}'"
          mv "${{ matrix.input_name }}" "${{ matrix.output_name }}"

      - name: Archive binary
        uses: thedoctor0/zip-release@0.7.6
        with:
          type: ${{ matrix.archive_type }}
          filename: "${{ matrix.archive_name }}"
          directory: ${{ steps.strings.outputs.build-output-dir }}
          path: ${{ matrix.output_name }}

      - name: Release
        # Upload the binary to the release page.
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: ${{ steps.strings.outputs.build-output-dir }}/${{ matrix.archive_name }}
```

This workflow builds the app, renames it to append the platform name and architecture, then archives it and uploads it to the release page. I have hardcoded the names, because inferring them from the project name is complicated for something you only need to set up once.

To trigger it, go to your project's releases page and click "Draft a new release." Then, create a new git tag (e.g., `v0.0.1`) and click "Publish release." The workflow will start automatically, and the packaged binaries for macOS, Linux, and Windows will be uploaded automatically.

Notably, the app bundle for macOS must be a `.tar.gz` archive, because a `.zip` archive will not preserve the symlinks in the app bundle. Instead, each symlink will become a copy, resulting in a bloated app bundle (for `freetype`, this adds about 5 MB of unnecessary copies).

<!-- TODO:
- Add a section on how to create a DMG file for distribution. -->


## Final Thoughts

Packaging an SFML app as an app bundle on macOS is relatively straightforward. You just need to copy the necessary frameworks into the app bundle.

If you want to see a working example, check out my [vroom](https://github.com/ryouze/vroom) project. It is a 2D drift racing game that uses SFML 3 and CMake. The CI/CD pipeline builds the app for macOS, Linux, and Windows.
