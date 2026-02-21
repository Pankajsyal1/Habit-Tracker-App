import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onAnimationFinish: () => void;
}

const SplashScreen = ({ onAnimationFinish }: SplashScreenProps) => {
    // Animation values
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateY = useRef(new Animated.Value(20)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const bgOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Stage 1: Logo sequence
        const logoAnimation = Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            }),
        ]);

        // Stage 2: Text sequence
        const textAnimation = Animated.parallel([
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(textTranslateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]);

        // Stage 3: Tagline sequence (fades in slightly after text)
        const taglineAnimation = Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        });

        // Run the sequence with better timing
        Animated.sequence([
            logoAnimation,
            Animated.delay(100),
            textAnimation,
            Animated.delay(100),
            taglineAnimation,
        ]).start();

        // Finish sequence - wait for user to see the beautiful UI
        const timer = setTimeout(() => {
            Animated.timing(bgOpacity, {
                toValue: 0,
                duration: 800,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            }).start(() => {
                onAnimationFinish();
            });
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: bgOpacity }
            ]}
        >
            <View style={styles.content}>
                {/* Logo Section */}
                <Animated.View
                    style={{
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                        marginBottom: 40
                    }}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/favicon.png')}
                            style={{ width: 48, height: 48 }}
                            resizeMode="contain"
                        />
                    </View>
                </Animated.View>

                {/* Brand Section */}
                <View style={styles.brandContainer}>
                    <Animated.View
                        style={{
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }]
                        }}
                    >
                        <Text style={styles.title}>
                            Daily<Text style={{ color: '#10b981' }}>Rise</Text>
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={{
                            opacity: taglineOpacity,
                            marginTop: 16
                        }}
                    >
                        <Text style={styles.tagline}>
                            Build streaks, not stress.
                        </Text>
                    </Animated.View>
                </View>
            </View>

            {/* Footer Decor */}
            <View style={styles.footer}>
                <View style={styles.footerLine} />
                <Text style={styles.footerText}>
                    Personal Success Engine
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020617',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        height: 144,
        width: 144,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 44,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    brandContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: -2,
    },
    tagline: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8',
        letterSpacing: 4,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    footer: {
        position: 'absolute',
        bottom: 64,
        alignItems: 'center',
        width: '100%',
    },
    footerLine: {
        height: 2,
        width: 64,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderRadius: 1,
        marginBottom: 12,
    },
    footerText: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(16, 185, 129, 0.4)',
        letterSpacing: 5,
        textTransform: 'uppercase',
    },
});

export default SplashScreen;
