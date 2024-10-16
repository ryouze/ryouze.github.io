+++
date = 2024-10-16T16:33:00+02:00
title = "Building C++ SFML App Bundles on macOS (CMake)"
description = "How to package a cross-platform C++ SFML app as an app bundle on macOS using CMake"
tags = ["tutorial", "cmake", "c++", "macos", "sfml"]
type = "post"
showTableOfContents = true
+++

## Introduction

The [CMake SFML Project Template](https://github.com/SFML/cmake-sfml-project) is a great starter template for creating cross-platform applications with SFML. Unfortunately, it doesn't include a way to package the application for native macOS deployment, i.e., as an app bundle.

For simple command-line applications that are linked statically (`set(BUILD_SHARED_LIBS OFF)`), you can use `install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})` to make the app install to `/usr/local/bin` with `sudo cmake --install .`. Unfortunately, if you install a SFML app this way, it will complain about missing dynamically-linked dependencies, such as [FreeType](https://freetype.org/). Moreover, the app must be started from the command line, which is not user-friendly.

GUI apps are typically distributed as an app bundle that users can drag and drop into their `Applications` folder. App bundles are directories with a `.app` extension that contain the app's executable, resources, and metadata. For example, your SFML `example.app` app bundle might look like this:

```sh
[/Applications] $ tree -l CMakeSFMLProject.app/
CMakeSFMLProject.app/
└── Contents
    ├── Frameworks
    │   └── freetype.framework
    │       ├── Resources -> Versions/Current/Resources
    │       │   └── Info.plist
    │       ├── Versions
    │       │   ├── A
    │       │   │   ├── Resources
    │       │   │   │   └── Info.plist
    │       │   │   └── freetype
    │       │   └── Current -> A  [recursive, not followed]
    │       └── freetype -> Versions/Current/freetype
    ├── Info.plist
    └── MacOS
        └── CMakeSFMLProject
```


## Download the CMake SFML Project Template

Follow these steps to download the project template.

1. **Clone the repository**:

    ```sh
    git clone https://github.com/SFML/cmake-sfml-project.git
    ```

2. **Change directory to the cloned repository**:

    ```sh
    cd cmake-sfml-project
    ```

3. **Change to the commit used in this tutorial**:

    This is for simplicity, use the latest commit when building your own app (i.e., don't checkout to this specific commit).

    ```sh
    git checkout 969c5cd70278bd7316742bd27d9ccd7a363196e5
    ```


## Modify the CMakeLists.txt File

We only need to make a few changes to the `CMakeLists.txt` file to package the app as an app bundle.

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
        COMMAND rsync -a ${CMAKE_BINARY_DIR}/_deps/sfml-src/extlibs/libs-osx/Frameworks/
            $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
        COMMENT "Copying all SFML frameworks into the app bundle"
    )

    # # Copy only the SFML freetype framework into the app bundle
    # add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    #     COMMAND rsync -a ${CMAKE_BINARY_DIR}/_deps/sfml-src/extlibs/libs-osx/Frameworks/freetype.framework
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

We also need `Info.plist.in` in the root directory to generate the `Info.plist` file:

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

Ok, so what's new?

We changed all instances of `main` into `${PROJECT_NAME}` to make the output executable name match the project name. This is personal preference, you can put `SET(EXECUTABLE_NAME "example")` somewhere below `project()` and replace `${PROJECT_NAME}` with `${EXECUTABLE_NAME}` if you prefer.

```cmake
cmake_minimum_required(VERSION 3.28)
project(CMakeSFMLProject LANGUAGES CXX)
set(EXECUTABLE_NAME "hello")
```

We added a conditional block that checks if the platform is macOS. If it is, we set the `MACOSX_BUNDLE` property to `TRUE` and provide the path to the `Info.plist` file. We also set the `INSTALL_RPATH` property to `@executable_path/../Frameworks` to tell the app where to find the SFML frameworks. We then copy all the SFML frameworks into the app bundle using `add_custom_command`. The `rsync` command ensures that we preserve symlinks, so we don't make unnecessary copies of the frameworks. Finally, we add an install target for the macOS app bundle.

**Note:** The uncommented `# Copy all frameworks into the app bundle` block copies all frameworks (graphics, audio, etc.) into the app bundle. If you don't use audio, you can comment out the `# Copy all frameworks into the app bundle` block and uncomment the `# Copy only the SFML freetype framework into the app bundle` block to copy only the freetype framework. This will greatly reduce the size of the app bundle. But if you're just starting out, copying all frameworks is a good idea.

```cmake
# Copy all frameworks into the app bundle
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND rsync -a ${CMAKE_BINARY_DIR}/_deps/sfml-src/extlibs/libs-osx/Frameworks/
        $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
    COMMENT "Copying all SFML frameworks into the app bundle"
)

# # Copy only the SFML freetype framework into the app bundle
# add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
#     COMMAND rsync -a ${CMAKE_BINARY_DIR}/_deps/sfml-src/extlibs/libs-osx/Frameworks/freetype.framework
#         $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
#     COMMENT "Copying SFML freetype framework into the app bundle"
# )
```

```cmake
# # Copy all frameworks into the app bundle
# add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
#     COMMAND rsync -a ${CMAKE_BINARY_DIR}/_deps/sfml-src/extlibs/libs-osx/Frameworks/
#         $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
#     COMMENT "Copying all SFML frameworks into the app bundle"
# )

# Copy only the SFML freetype framework into the app bundle
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND rsync -a ${CMAKE_BINARY_DIR}/_deps/sfml-src/extlibs/libs-osx/Frameworks/freetype.framework
        $<TARGET_BUNDLE_DIR:${PROJECT_NAME}>/Contents/Frameworks/
    COMMENT "Copying SFML freetype framework into the app bundle"
)
```


## Building the App Bundle

Follow these steps to build the project:

1. **Generate the build system**:

    ```sh
    mkdir build && cd build
    cmake .. -DCMAKE_BUILD_TYPE=Release
    ```

2. **Compile the project**:

    To compile the project, use the following command:

    ```sh
    make -j
    ```

Now the app is compiled.

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

As you can see, the `Info.plist` file was generated based on the variables we set in the `CMakeLists.txt` file. We now also have an app bundle in the `bin` directory.

Let's run it. You can either double-click the app bundle in Finder (`bin/CMakeSFMLProject.app`) or run it from the command line:

```sh
open bin/CMakeSFMLProject.app
```


## Installing the App Bundle

To install the app bundle to `/Applications`, use the following command while in the `build` directory:

```sh
sudo cmake --install .
```

We can now find the app in `/Applications`:

```sh
[/Applications] $ tree -l CMakeSFMLProject.app/
CMakeSFMLProject.app/
└── Contents
    ├── Frameworks
    │   └── freetype.framework
    │       ├── Resources -> Versions/Current/Resources
    │       │   └── Info.plist
    │       ├── Versions
    │       │   ├── A
    │       │   │   ├── Resources
    │       │   │   │   └── Info.plist
    │       │   │   └── freetype
    │       │   └── Current -> A  [recursive, not followed]
    │       └── freetype -> Versions/Current/freetype
    ├── Info.plist
    └── MacOS
        └── CMakeSFMLProject
```

As you can see, I only copied the freetype framework into the app bundle.

TODO:
- Add a section on how to create a DMG file for distribution.
- Add building and packaging with GitHub Actions (already done, just need to fix caching).


## Final Thoughts

Packaging an SFML app as an app bundle on macOS is relatively straightforward. You just need to copy the necessary frameworks into the app bundle.
