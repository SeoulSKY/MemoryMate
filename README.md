# MemoryMate

<img src="https://github.com/SeoulSKY/MemoryMate/actions/workflows/eslint.yml/badge.svg" alt="eslint">

## How to Set up and Run

### Setting Environment Variables

Create a `.env` file, copy and paste all contents from the `.env.example` file, and fill in the values for your development environment.

### Description of each environment variable

| Name                     | Description                                                             |
|--------------------------|-------------------------------------------------------------------------|
| EXPO_PUBLIC_GEMINI_TOKEN | [Token](https://aistudio.google.com/app/apikey) for using the Gemini AI API |

### For Android

#### Setting up the Android Emulator

* Open up the [Android Studio](https://developer.android.com/studio)
* Open the `Device Manager` window and select `Create Virtual Device`
* Select `Pixel 7 Pro` and press the `Next` button
* Select the `UpsideDownCakePrivacySandbox` image and press the `Next` button
* Select the `Portrait` as the startup orientation and press the `Finish` button

#### Running on an Android Emulator

Run the following command:

```bash
npm run android
```

### For IOS

This option only works in a `macOS`

#### Setting up the Simulator

* Open up the [Xcode](https://developer.apple.com/xcode/)
* Navigate to `Window` -> `Device and Simulator`
* Select the `Simulators` tab and press the `+` button
* Set `Simulator Name` as `iPhone 15 Pro Max`
* Set `Device Type` as `iPhone 15 Pro Max`
* Set `OS Version` as `iOS 17.4`
* Press the `Create` button

#### Running on a Simulator

Run the following command:

```bash
npm run ios
```
