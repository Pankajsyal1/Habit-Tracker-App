import React, { useCallback, useRef, useState } from 'react';
import { View, ScrollView, useColorScheme, TouchableOpacity, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import QuickAddHabit from '../components/QuickAddHabit';
import { useHabits } from '../hooks/useHabits';

export default function CreateHabitScreen({ navigation }: any) {
    const { addHabit } = useHabits();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [showToast, setShowToast] = useState(false);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const toastTranslateY = useRef(new Animated.Value(20)).current;

    // Reset toast state when screen is focused or mounted
    React.useEffect(() => {
        if (!navigation) return;
        let unsubscribe: (() => void) | undefined;
        try {
            unsubscribe = navigation.addListener('focus', () => {
                setShowToast(false);
                toastOpacity.setValue(0);
                toastTranslateY.setValue(20);
            });
        } catch {
            // Navigation context not available yet — safe to ignore
        }
        return () => unsubscribe?.();
    }, [navigation, toastOpacity, toastTranslateY]);

    const triggerSuccessToast = useCallback(() => {
        setShowToast(true);
        Animated.parallel([
            Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(toastTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
    }, [toastOpacity, toastTranslateY]);

    const handleAddHabit = useCallback((data: any) => {
        addHabit(data);
        triggerSuccessToast();
        
        setTimeout(() => {
            try {
                navigation?.goBack();
            } catch {
                // Navigation context not available — safe to ignore
            }
        }, 2000);
    }, [addHabit, navigation, triggerSuccessToast]);

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`} edges={['top', 'bottom']}>
            <View className="flex-row items-center justify-between px-6 py-4">
                <View>
                    <Text className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Start New <Text className="text-emerald-500">Journey</Text>
                    </Text>
                    <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Build consistency today
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    className={`h-12 w-12 items-center justify-center rounded-2xl ${isDark ? 'bg-slate-900' : 'bg-white shadow-sm shadow-slate-200'}`}
                >
                    <X size={24} color={isDark ? '#94a3b8' : '#64748b'} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            {/* Success Toast */}
            {showToast && (
                <Animated.View 
                    style={{ 
                        opacity: toastOpacity, 
                        transform: [{ translateY: toastTranslateY }],
                        position: 'absolute',
                        bottom: 40,
                        left: 20,
                        right: 20,
                        zIndex: 100
                    }}
                    className="flex-row items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3 shadow-lg shadow-emerald-500/20"
                >
                    <View className="h-6 w-6 rounded-full bg-white/20 items-center justify-center">
                        <Check size={14} color="#fff" />
                    </View>
                    <Text className="text-sm font-bold text-white tracking-tight">DailyRise updated successfully!</Text>
                </Animated.View>
            )}

            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
                <View className="pb-10">
                    <QuickAddHabit onAdd={handleAddHabit} />
                    
                    <View className={`mt-8 p-6 rounded-3xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
                        <Text className={`text-sm font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            Pro Tip
                        </Text>
                        <Text className={`text-xs leading-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Start small. Success is built on tiny habits repeated consistently. Focus on one main objective at a time for maximum impact.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
