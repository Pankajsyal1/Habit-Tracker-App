import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { ReactNode, useState } from "react";
import "./global.css";
import { HabitProvider } from "./context/HabitContext";
import RootNavigator from "./navigation/RootNavigator";
import SplashScreen from "./components/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";

interface AppProps { }

export default function App(): ReactNode {
    const colorScheme = useColorScheme();
    const [showSplash, setShowSplash] = useState(true);

    const handleAnimationFinish = React.useCallback(() => {
        setShowSplash(false);
    }, []);

    return (
        <HabitProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
            {showSplash && (
                <SplashScreen onAnimationFinish={handleAnimationFinish} />
            )}
            <StatusBar style={showSplash ? "light" : (colorScheme === 'dark' ? 'light' : 'dark')} />
        </HabitProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
