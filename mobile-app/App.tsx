import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { ReactNode } from "react";
import "./global.css";
import { HabitProvider } from "./context/HabitContext";
import RootNavigator from "./navigation/RootNavigator";

interface AppProps { }

export default function App(): ReactNode {
    const colorScheme = useColorScheme();
    return (
        <HabitProvider>
            <RootNavigator />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
