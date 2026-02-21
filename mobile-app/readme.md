npx create-expo-app@latest --template blank


Install Nativewind with Expo
1. Install Nativewind
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo


2. Setup Tailwind CSS
Run npx tailwindcss init to create a tailwind.config.js file

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. Create a CSS file [global.css] and add the Tailwind directives.

```css

@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Add the Babel preset

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

5. Create or modify your metro.config.js
Create a metro.config.js file in the root of your project if you don't already have one, then add the following configuration:

```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
 
module.exports = withNativeWind(config, { input: './global.css' })
```


6. Import your CSS file in App.tsx
```tsx
import "./global.css"
 
export default App() {
  /* Your App */
}
```

7. Modify your app.json
Switch the bundler to use the Metro bundler
```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

8. TypeScript setup (optional)

```ts
/// <reference types="nativewind/types" />
```

9. Write tailwindcss classes

```tsx
import "./global.css"
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}
```

10. VS Code setting
.vscode/settings.json

```json
{
    "tailwindCSS.classAttributes": [
        "class",
        "className"
    ],
    "tailwindCSS.experimental.classRegex": [
        ["className=[\"'`]([^\"'`]*)"],
        ["className=\"([^\"]*)\""],
        ["className='([^']*)'"],
        ["className=`([^`]*)`"],
        ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^'\"`]*)(?:'|\"|`)"]
    ],
    "editor.quickSuggestions": {
        "strings": true
    },
    "tailwindCSS.lint.cssConflict": "warning",
    "tailwindCSS.lint.invalidApply": "warning",
    "tailwindCSS.lint.invalidScreen": "warning",
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```