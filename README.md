<div align="center">
    <img src="https://github.com/SeoulSKY/MemoryMate/blob/main/assets/MemoryMate.png" width=300 aspect-ratio=1 alt="memorymate">
    <h1>Memory Mate</h1>
</div>

<blockquote align="center">
    Connect with our empathetic AI companion tailored for those with dementia, offering friendly conversations and engaging personalized brain games to enhance cognitive abilities.
</blockquote>

<div align="center">
    <img src="https://img.shields.io/badge/Node.js-v21.7-84ba64" alt="nodejs">
    <img src="https://github.com/SeoulSKY/MemoryMate/actions/workflows/eslint.yml/badge.svg" alt="eslint">
    <img src="https://github.com/SeoulSKY/MemoryMate/actions/workflows/jest.yml/badge.svg" alt="jest">
</div>


## How to Set up and Run

Install [Node.js](https://nodejs.org/en/download/).

### Setting Environment Variables

Create a `.env` file, copy and paste all contents from the `.env.example` file, and fill in the values for your development environment.

### Description of each environment variable

| Name                     | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| EXPO_PUBLIC_GEMINI_TOKEN | [Token](https://aistudio.google.com/app/apikey) for using the Gemini AI API |

### Installing Dependencies

Run the following command:

```bash
npm install
```

### With Physical Device (Both Android and iOS)

* Install Expo Go([Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) | [IOS](https://apps.apple.com/us/app/expo-go/id982107779)) on your device.
* Sign up/Log in to Expo Go.
* Run the following command:

```bash
npm start
```

#### For Android
* Open the Expo Go app and scan the QR code from the terminal.

#### For iOS
* Open the Camera app and scan the QR code from the terminal.

### With Android Emulator

* Open up the [Android Studio](https://developer.android.com/studio)
* Go to `Settings -> Languages & Frameworks -> Android SDK` and select `Android 14.0 ("UpsideDownCake")`
* Open the `Device Manager` window and select `Create Virtual Device`
* Select `Pixel 7 Pro` and press the `Next` button
* Select the `UpsideDownCake` image and press the `Next` button
* Select the `Portrait` as the startup orientation and press the `Finish` button
* Open the `Device Manager` window and press the `Play` button to start the emulator
* Run the following command:

```bash
npm run android
```

### With iOS Simulator

This option only works in a latest `macOS`

* Open up the [Xcode](https://developer.apple.com/xcode/)
* Navigate to `Window -> Device and Simulator`
* Select the `Simulators` tab and press the `+` button
* Set `Simulator Name` as `iPhone 15 Pro Max`
* Set `Device Type` as `iPhone 15 Pro Max`
* Set `OS Version` as `iOS 17.4`
* Press the `Create` button
* Open up the Simulator
* Navigate to `File -> Open Simulator`, then select `iPhone 15 Pro Max`
* Run the following command:

```bash
npm run ios
```
