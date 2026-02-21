import React, { useCallback, useRef, useState } from 'react';
import { Animated, View, Text, TextInput, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { HabitFrequency } from '../constants/enums';

interface QuickAddHabitProps {
  onAdd: (data: { name: string; frequency: HabitFrequency }) => void;
}

const QuickAddHabit = ({ onAdd }: QuickAddHabitProps) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-20)).current;
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback(() => {
    setToastVisible(true);
    toastOpacity.setValue(0);
    toastTranslateY.setValue(-20);

    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(toastTranslateY, { toValue: -20, duration: 300, useNativeDriver: true }),
        ]).start(() => setToastVisible(false));
      }, 2000);
    });
  }, [toastOpacity, toastTranslateY]);

  const isDisabled = !name.trim();

  const handleSubmit = () => {
    if (isDisabled) return;
    onAdd({ name, frequency });
    showToast();
    setName('');
  };

  return (
    <View className={`rounded-3xl p-6 flex-col gap-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/60 shadow-sm shadow-slate-200'}`}>
      {/* Toast */}
      {toastVisible && (
        <Animated.View
          style={{ opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] }}
          className="absolute top-[-56px] left-0 right-0 z-50 flex-row items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3 shadow-lg shadow-emerald-500/20"
        >
          <View className="h-6 w-6 rounded-full bg-white/20 items-center justify-center">
            <Check size={14} color="#fff" />
          </View>
          <Text className="text-sm font-bold text-white tracking-tight">Habit synchronization complete</Text>
        </Animated.View>
      )}

      <View className="w-full space-y-2">
        <View className="flex-row items-center gap-2 mb-1 px-1">
          <View className="h-1 w-4 rounded-full bg-emerald-500/50" />
          <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Define New Objective
          </Text>
        </View>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="What's your next win?"
          placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
          className={`w-full h-14 rounded-2xl border px-5 text-base font-medium ${isDark ? 'border-slate-800 bg-slate-950/50 text-white' : 'border-slate-100 bg-slate-50/50 text-slate-900'}`}
        />
      </View>

      <View className="flex-row gap-4 items-end">
        <View className="flex-1 space-y-2">
          <View className="flex-row items-center gap-2 mb-1 px-1">
            <View className="h-1 w-4 rounded-full bg-sky-500/50" />
            <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Select Cadence
            </Text>
          </View>
          <View className={`flex-row h-14 rounded-2xl p-1.5 border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
            {([HabitFrequency.DAILY, HabitFrequency.WEEKLY] as HabitFrequency[]).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFrequency(f)}
                style={[
                  styles.frequencyButton,
                  frequency === f && styles.frequencyButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    frequency === f ? styles.frequencyTextActive : styles.frequencyTextInactive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isDisabled}
          style={[
            styles.submitButton,
            isDisabled
              ? (isDark ? styles.submitButtonDisabledDark : styles.submitButtonDisabledLight)
              : styles.submitButtonActive,
          ]}
        >
          <Plus size={28} color={isDisabled ? (isDark ? '#475569' : '#94a3b8') : "#fff"} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frequencyButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  frequencyText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  frequencyTextActive: {
    color: '#ffffff',
  },
  frequencyTextInactive: {
    color: '#64748b',
  },
  submitButton: {
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  submitButtonActive: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabledDark: {
    backgroundColor: '#1e293b',
  },
  submitButtonDisabledLight: {
    backgroundColor: '#e2e8f0',
  },
});

export default QuickAddHabit;
