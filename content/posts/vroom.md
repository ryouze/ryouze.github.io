+++
date = 2025-08-19T21:21:26+02:00
title = "Building vroom: A C++20 Racing Game from Scratch"
description = "How I built a complete 2D racing game using modern C++20 features, SFML3, procedural track generation, AI behavior, and cross-platform development techniques"
tags = ["C++", "SFML", "Game Development", "CMake", "Dear ImGui", "Procedural Generation", "Cross-Platform", "Modern C++", "Game Physics", "AI Programming"]
type = "post"
showTableOfContents = true
image = "/images/vroom.webp"
+++

## Introduction

I wanted to build a 2D racing game from scratch, without relying on existing game engines like Godot or Unity. To achieve this, I chose to build my own game engine in C++, allowing me to improve my understanding of C++ and game development.

The end result is *vroom*, an arcade-style racing game that features arcade drift physics, procedurally-generated tracks, and waypoint AI.

It's built using C++20 and [SFML3](https://github.com/SFML/SFML). The UI itself is built uses [Dear ImGui](https://github.com/ocornut/imgui) (with [ImGui‑SFML](https://github.com/SFML/imgui-sfml)) and I'm using [toml++](https://github.com/marzer/tomlplusplus) for persistent configuration storage on disk. Logging is handled by [spdlog](https://github.com/gabime/spdlog) and I'm also using [snitch](https://github.com/snitch-org/snitch) for unit testing.

Everything is cross-platform - pre-built binaries are available macOS, GNU/Linux, and Windows.


## Learning by Building

Looking at the git history, I can see how the project evolved over time. It started with just getting a basic 2D game world SFML, then gradually added features like car movement, track generation, AI behavior, and eventually a full UI with menus, sounds, and persistent configuration.

### Project Structure

The first thing I had to figure out was how to organize the code. I decided to keep core engine stuff (like window management and UI) separate from game-specific code (like car physics). All the files in `src/core/` are independent - they cannot include each other as a rule.

```cpp
// Core modules are independent building blocks
#include "core/backend.hpp"  // Window management (SFML)
#include "core/sfx.hpp"      // Sound effects (SFML)
#include "core/widgets.hpp"  // UI components (ImGui)
#include "core/world.hpp"    // Track generation
```

The `src/game/` directory contains game-specific logic that can import core modules but remains independent from other game modules.


### Using C++20

I have built previous projects in C++17, because C++20 wasn't supported by some runners on GitHub Actions at the time. Setting them up to use C++20 wouldn't be difficult, but I wanted to stick to what I had at hand for the time being since even the latest version of SFML (SFML3) also uses C++17.

After completing my C++17 [aegyo](https://github.com/ryouze/aegyo) project (GUI Korean learning app), I wanted to move to C++20. Here are the key features I used:

*Mathematical constants (`std::numbers`):*
```cpp
#include <numbers>
const float heading_difference =
    std::remainder(desired_heading - current_heading, 2.0f *
        std::numbers::pi_v<float>);
```

*`std::format` for string formatting:*
```cpp
#include <format>
// Type-safe string formatting
mode_names.emplace_back(std::format("{}x{} ({}-bit)", mode.size.x, mode.size.y, mode.bitsPerPixel));
```

*`[[likely]]` and `[[unlikely]]` attributes:*
```cpp
if (current_state == core::states::GameState::Playing) [[likely]] {
    // Game logic runs most of the time
} else [[unlikely]] {
    // Menu/pause states are less frequent
}
```

Not a whole lot, but `std::format` allowed me to replace the 3rd party `fmt` library completely. It's very convienient, although not as convienient as Python's f-strings.


### CMake and Assets

Of course, I used CMake to manage the build process and dependencies. The configuration automatically downloads all the libraries I need using CMake's FetchContent, rather than Git submodules, so a regular `git clone` is all you need to get started.

The project uses strict compile flags across all compilers, although that, and other options, can be easily toggled.

```cmake
# Project options with sensible defaults
option(BUILD_TESTS "Build tests" OFF)
option(ENABLE_COMPILE_FLAGS "Enable compile flags" ON)
option(ENABLE_STRIP "Enable symbol stripping for Release builds" ON)
option(ENABLE_LTO "Enable Link Time Optimization" ON)
option(ENABLE_CCACHE "Enable ccache for faster builds" ON)
```

The assets (textures and sounds) are embedded directly into the executable as headers. To do that, I have written a custom CLI tool in C called [asset-packer](https://github.com/ryouze/asset-packer). There is a plethora of similar tools available, but let's learn by building.


### Track Generation

Getting the procedural track generation working was one of the hardest part of this project. It took me a really long time to get the detours right because they use different textures of corners based on orientation. I actually add ASCII art of how the textures look to the code as comments to help me visualize which texture I am using.

The track uses tile-based textures from [Kenney's Racing Pack](https://kenney.nl/assets/racing-pack). I upscaled them using [Waifu2x](https://unlimited.waifu2x.net/) to make them look better at higher resolutions. The algorithm builds rectangular track layouts with optional "detour bubbles" that create outward detours. Both the vertical and horizontal width of the track is configurable in the GUI. The detour percentage can also be configured. The AI, will of course, adapt to any track configuration.


#### Bubble Detours

The track is built in several phases:

1. Layout Planning: Calculate the grid dimensions and tile positioning based on user parameters (width, height, tile size)
2. Corner Placement: Place the four corner tiles that define the track's outer boundary
3. Edge Processing: Process each edge (top, right, bottom, left) while placing optional detour bubbles
4. Bubble Generation: Use probability-based detour placement with height validation to ensure structural integrity
5. Waypoint Creation: Generate AI navigation waypoints at each tile center with proper driving type classification

The most complex part is the "bubble detour" system. Each vertical edge can have random "bubbles" that create wider sections and interesting corners. The algorithm walks along each edge and randomly decides whether to place a detour based on a probability setting. When placing a detour, it has to make sure the bubble fits in the remaining track space and connects properly with the main track.

```cpp
// Simplified vertical edge bubble placement algorithm (runs on track generation)
void place_detour_bubbles(float main_x, float detour_x)
{
    for (std::size_t row = 1; row < vertical_count - 1;) {
        if (random_float() < detour_probability) {
            // Find viable bubble heights that fit in remaining space
            vector<std::size_t> viable_heights;
            for (auto height : {3, 4}) {  // Allowed bubble sizes
                if (row + height < vertical_count)
                    viable_heights.emplace_back(height);
            }

            if (!viable_heights.empty()) {
                auto height = choose_random(viable_heights);

                // Place entry curves
                place_tile(entry_curve_main, {main_x, row_y});
                place_tile(entry_curve_detour, {detour_x, row_y});

                // Place vertical segments
                for (std::size_t i = 1; i < height - 1; ++i)
                    place_tile(vertical_tile, {detour_x, row_y + i * tile_size});

                // Place exit curves
                place_tile(exit_curve_detour, {detour_x, row_y + (height - 1) * tile_size});
                place_tile(exit_curve_main, {main_x, row_y + (height - 1) * tile_size});

                row += height;  // Skip past this detour
                continue;
            }
        }
        // No detour: place regular vertical tile
        place_tile(vertical_tile, {main_x, row_y});
        ++row;
    }
}
```


### Car Physics

Getting the car physics to feel right was another big challenge. I wanted arcade-style physics that were fun to play rather than realistic simulation. I wanted a simple, fun and responsive game.

So how does it work? The system treats each car as a point with velocity and rotation.

Every frame, each car updates its physics in several steps. Player input (or AI decisions) determine acceleration and steering. The car's velocity gets updated based on acceleration, then position gets updated based on velocity. I use delta time to make sure the physics work consistently regardless of frame rate.

I had to get a lof of help from ChatGPT, because I have never written a game engine before. But the end result is fun to drive, in fact, the acceleration is a bit ridicolous, and it's easy to just hold gas and drift around corners, it doesn't require a lot of skill to play (or any, but perhaps that comes from my experience in playing racing games a lot, I really like them). But I'm not developing a realistic game, and it's fun to play, so I think it works well.

The key goal is that physics are only applied to the cars themselves; it is a method of the Car class. A full physics engine does seem like a challenging and fun project to work in the future, though.

```cpp
// Simplified physics implementation (runs on every frame)
void Car::apply_physics_step(const float dt)
{
    // Calculate forward direction from current sprite rotation
    const float heading_radians = this->sprite_.getRotation().asRadians();
    const sf::Vector2f forward_vector = {std::cos(heading_radians), std::sin(heading_radians)};
    float current_speed = std::hypot(this->velocity_.x, this->velocity_.y);

    // Apply acceleration if enabled
    if (this->current_input_.throttle > 0.0f) {
        const float throttle_force = this->current_input_.throttle *
                                     this->config_.throttle_acceleration_rate_pixels_per_second_squared * dt;
        this->velocity_ += forward_vector * throttle_force;
        current_speed = std::hypot(this->velocity_.x, this->velocity_.y);
    }

    // Apply braking if enabled and moving
    if (this->current_input_.brake > 0.0f && current_speed > stopped_speed_threshold) {
        const float brake_force = this->current_input_.brake *
                                  this->config_.brake_deceleration_rate_pixels_per_second_squared * dt;
        const float brake_reduction = std::min(brake_force, current_speed);
        const sf::Vector2f velocity_unit = this->velocity_ / current_speed;
        this->velocity_ -= velocity_unit * brake_reduction;
        current_speed -= brake_reduction;
    }

    // Apply handbrake if enabled and moving
    if (this->current_input_.handbrake > 0.0f && current_speed > stopped_speed_threshold) {
        const float handbrake_force = this->current_input_.handbrake *
                                      this->config_.handbrake_deceleration_rate_pixels_per_second_squared * dt;
        const float new_speed = current_speed - handbrake_force;
        if (new_speed < stopped_speed_threshold) {
            this->velocity_ = {0.0f, 0.0f};  // Complete stop to prevent jitter
        }
        else {
            this->velocity_ = (this->velocity_ / current_speed) * new_speed;
        }
        current_speed = std::max(new_speed, 0.0f);
    }

    // Apply engine drag if no input and moving
    const bool no_input = (this->current_input_.throttle <= 0.0f &&
                           this->current_input_.brake <= 0.0f &&
                           this->current_input_.handbrake <= 0.0f);
    if (no_input && current_speed > stopped_speed_threshold) {
        const float drag = this->config_.engine_braking_rate_pixels_per_second_squared * dt;
        const float speed_after_drag = std::max(current_speed - drag, 0.0f);
        const float drag_scale = (current_speed > 0.0f) ? speed_after_drag / current_speed : 0.0f;
        this->velocity_ *= drag_scale;
        current_speed = speed_after_drag;
    }

    // Apply maximum speed limit if exceeded
    if (current_speed > this->config_.maximum_movement_pixels_per_second) {
        const float scale = this->config_.maximum_movement_pixels_per_second / current_speed;
        this->velocity_ *= scale;
        current_speed = this->config_.maximum_movement_pixels_per_second;
    }

    // Get forward and lateral velocity components
    const float signed_forward_speed = dot(forward_vector, this->velocity_);
    const sf::Vector2f forward_velocity = forward_vector * signed_forward_speed;
    const sf::Vector2f lateral_velocity = this->velocity_ - forward_velocity;

    // Apply lateral slip damping (simulating tire friction)
    const float slip_damping = 1.0f - std::clamp(
                                          this->config_.lateral_slip_damping_coefficient_per_second * dt, 0.0f, 1.0f);
    this->velocity_ = forward_velocity + lateral_velocity * slip_damping;

    // Apply steering wheel angle if enabled
    if (std::abs(this->current_input_.steering) > 0.01f) {
        const float steering_rate = this->current_input_.steering *
                                    this->config_.steering_turn_rate_degrees_per_second * dt;
        this->steering_wheel_angle_ += steering_rate;
    }
    else {
        // Otherwise, auto-center
        if (std::abs(this->steering_wheel_angle_) > this->config_.steering_autocenter_epsilon_degrees &&
            current_speed > 0.0f) {
            const float centering_factor = std::clamp(
                this->config_.steering_autocenter_rate_degrees_per_second * dt /
                    std::abs(this->steering_wheel_angle_),
                0.0f, 1.0f);
            this->steering_wheel_angle_ = std::lerp(this->steering_wheel_angle_, 0.0f, centering_factor);
        }
        else {
            this->steering_wheel_angle_ = 0.0f;
        }
    }

    // Clamp steering to physical limits
    this->steering_wheel_angle_ = std::clamp(this->steering_wheel_angle_,
                                             -this->config_.maximum_steering_angle_degrees,
                                             this->config_.maximum_steering_angle_degrees);

    // Apply steering based on speed
    if (std::abs(signed_forward_speed) > this->config_.minimum_speed_for_rotation_pixels_per_second) {
        const float speed_ratio = std::clamp(current_speed / this->config_.maximum_movement_pixels_per_second, 0.0f, 1.0f);
        const float steering_sensitivity = std::lerp(
            this->config_.steering_sensitivity_at_zero_speed,
            this->config_.steering_sensitivity_at_maximum_speed,
            speed_ratio);
        const float direction_sign = (signed_forward_speed >= 0.0f) ? 1.0f : -1.0f;
        // Apply rotation to sprite
        this->sprite_.rotate(sf::degrees(direction_sign * this->steering_wheel_angle_ * steering_sensitivity * dt));
    }

    // Apply velocity to sprite
    this->sprite_.move(this->velocity_ * dt);

    // If not on track, bounce off walls
    if (!this->track_.is_on_track(this->sprite_.getPosition())) {
        // ...
    }
}
```

### AI Behavior

The AI system was probably the most complex part to get working well.

While building the track, the system also creates waypoints for the AI to follow. Each tile gets a waypoint at its center, and the system marks them as either straight sections or corners based on the tile type. After the track is built, the waypoints get reordered to start from the finish line so the AI cars can follow them in the right racing order.

Thus, regardless of track configuration, the AI can always find its way around the track. The difficult part is making sure it won't just drive into walls due to excessive speed while also not being too slow.

The cars follow a sequence of waypoints placed along the track.

On every frame, each car (including the player) runs an `update()` function. For AI cars, it sets the AI inputs based on the car's position, velocity, and the direction of the next waypoint.

The AI checks the distance to the next waypoint to determine if it has been reached. Once a waypoint is reached, the AI advances to the next one, looping through the track. Waypoints are classified as `Straight` or `Corner` based on the procedurally generated track layout.

To steer, the AI compares the car's current heading to the direction of the next waypoint. If the misalignment exceeds a threshold, the AI turns left or right. When approaching corners, the AI turns earlier and more aggressively; on straight sections, it steers more smoothly.

The AI sets a target speed depending on whether the car is approaching a corner or traveling on a straight. If the current speed exceeds the target, the AI decelerates; if it is below the target, it accelerates. If the speed is close to the target, the AI coasts, relying on drag.

To avoid collisions, the AI scans ahead for potential wall impacts. If a crash is likely, it applies the handbrake and increases steering. The current, somewhat conservative values seem to prevent the AI from crashing into walls completely, but feedback is welcome.

To prevent AI cars from behaving identically, each instance uses its own random number generator. This introduces small variations in reaction distances, turn sensitivity, and target speeds.

AI logic updates at 30 Hz. Testing shows that 20 Hz is acceptable, while 10 Hz causes frequent wall collisions. Physics simulation runs at the current frame rate and uses delta time to maintain consistent behavior across different refresh rates.


### Sound Effects

I used SFML's audio system for all the sound effects. All the audio files come from [OpenGameArt.org](https://opengameart.org/), which has lots of free game assets.

The most complicated audio feature is the engine sound system. I took a basic engine loop sound from [OpenGameArt](https://opengameart.org/content/car-engine-loop-96khz-4s) and looped it. The code then simulates a 5-gear transmission by calculating fake RPM values based on car speed, figuring out what gear the car should be in, and adjusting the pitch and volume accordingly.

On top of that, tire screeching plays when you're drifting, using a [tire squeal sample](https://opengameart.org/content/car-tire-squeal-skid-loop) that fades in and out based on how much you're sliding. When you hit walls, it plays a [collision sound](https://opengameart.org/content/ingame-samples-audio) that I slowed down to 60% speed for more impact, with volume based on how hard you hit.

Lastly, every button click and menu interaction plays a sound effect from [UI sound packs](https://opengameart.org/content/ui-and-item-sound-effect-jingles-sample-2).


For all sounds, the volume controls work in real-time and save to the config file using [toml++](https://github.com/marzer/tomlplusplus).


### Window Management

Getting a window from SFML is easy. Creating a game-engine like system that can handle switching between fullscreen and windowed modes, different resolutions, and anti-aliasing settings is a bit more complex. On top of that, I wanted to support V-sync and frame rate limiting. And all of these settings should be configurable in the UI, and then saved to a config file on disk.

The tricky part is that when you change certain settings like anti-aliasing, you have to completely recreate the SFML window because those properties can only be set when the window is first created. Changing the frame rate limit or V-sync does not require a window recreation, but they cannot be enabled at the same time, so I had to handle that as well.

I ended up recreating the window whenever the user changes any setting for simplicity, as it allows me to apply all changes at once.


### Settings System

The settings system loads configuration at startup and saves it when the app closes. All the values are validated to prevent crashes if someone manually edits the config file or if there are corrupted values. For example, FPS values get checked against a list of supported frame rates.

Notably, getting the game to work on different operating systems meant figuring out where to save config files. Each OS has different conventions for where applications should store user data.

I wrote platform-specific code that uses the native APIs to find the right directories:

- Windows: Uses `SHGetFolderPath` to get the Local AppData folder.
- macOS: Uses Foundation framework's `NSSearchPathForDirectoriesInDomains` to get the Application Support directory.
- Linux: Follows the XDG Base Directory Specification by checking `XDG_DATA_HOME` first, falling back to `~/.local/share` if not set.

This makes sure config files end up in the right places:
- macOS: `~/Library/Application Support/vroom/config.toml`
- Linux: `$XDG_DATA_HOME/vroom/config.toml` (or `~/.local/share/vroom/config.toml`)
- Windows: `%LOCALAPPDATA%/vroom/config.toml`


### ImGui User Interface

The entire interface is built using Dear ImGui with [ImGui-SFML bindings](https://github.com/SFML/imgui-sfml), which makes it easy to integrate immediate-mode GUI with SFML's rendering. I used the [Moonlight theme](https://github.com/Madam-Herta/Moonlight) to make it look a little less like a development tool and more like a game UI.


#### Widgets

I built several ImGui widgets to show real-time game information:

- FPS Counter: Shows current frame rate, frame time in milliseconds, and V-sync status. The colors change automatically - green for good performance (60+ FPS), yellow for moderate (30-60 FPS), and red for poor performance (below 30 FPS).
- Minimap: One of the more complex widgets - it renders the entire game scene to an SFML render texture, then displays that texture in an ImGui window. Features include configurable refresh rate (defaults to 10Hz for performance), and adjustable resolution (256x256, 512x512, or 1024x1024).
- Leaderboard: Tracks lap times and positions for all cars. It automatically sorts by position and highlights the player's current standing, including best lap times and current lap progress.
- Speedometer: Displays current speed in kilometers per hour (km/h).


#### Settings Menu

The settings menu uses a tabbed interface with five sections. Every setting change gets immediately saved to disk as a TOML file.

- Game Tab: Controls the core racing settings. You can adjust track generation parameters like track width (3-20 tiles), track height (3-20 tiles), tile size (256-2048 pixels), and detour probability (0.0-1.0) for variety. Camera settings include zoom level (1x-15x) and which vehicle the camera follows. Changes trigger immediate track regeneration.
- Controls Tab: Handles both keyboard and gamepad input with full customization. For gamepad users: Live display of all available gamepad axes when a controller is connected, any axis can be mapped to steering, gas, or brake, undividual invert toggles for each axis, handbrake can be mapped to any gamepad button, automatic fallback to keyboard when gamepad is disconnected.
- Graphics Tab: Visual quality and performance settings: Toggle between windowed and fullscreen modes, full list of supported resolutions, anti-aliasing options from disabled to 16x samples, v-sync toggle and manual FPS limiting (30, 60, 90, 120, 144, unlimited), real-time FPS and frame time display, changes to anti-aliasing or display mode require window recreation, which happens automatically.
- Audio Tab: Volume controls for all sound categories: Master volume, engine volume, effects volume, UI volume, individual mute toggles for each category, volume changes are applied in real-time with sample sounds for feedback
- About Tab: System information and diagnostics: Game version, build configuration and time, compiler, C++ standard, platform details, and build options

The aforementioned settings system saves everything on scope exit (i.e., game exit). And on the next boot, all values are validated when loaded to prevent crashes from corrupted config files. Settings are stored in the platform-appropriate location and survive between sessions.


### UI Sound Feedback

I added sound effects to every UI interaction to make it feel more polished. Every button click, checkbox toggle, and menu navigation plays an appropriate sound effect. The sounds respect the UI volume setting, and volume changes trigger a sample sound at the new level for immediate feedback.

### Cross-Platform Support

The game runs on macOS, Linux, and Windows. It performs well - I get 90 FPS while using only 3 watts on the Steam Deck OLED.

Platform-specific code is kept in the `core/platform/` directory; everything is abstracted away.


### Testing

On each push, automated testing is performed on the latest versions of macOS, GNU/Linux, and Windows using GitHub Actions.

The project uses [snitch](https://github.com/snitch-org/snitch) for unit testing.

## What I Learned

I used RAII throughout the project to avoid manual memory management, as per modern C++ best practices. The embedded asset system eliminates file I/O issues, which simplifies distrubtion.

I learned how to use SFML to build a complete game engine, with graphics, sounds, and input handling (including gamepad support). I also learned how to build a user interface using Dear ImGui.


## Final Thoughts

Building vroom from scratch was a great learning experience.

The complete source code is available on [GitHub](https://github.com/ryouze/vroom), and there are pre-built binaries for macOS, Linux and Windows.
