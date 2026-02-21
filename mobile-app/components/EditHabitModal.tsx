import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, useColorScheme, Animated, StyleSheet } from 'react-native';
import { X, Check } from 'lucide-react-native';
import type { Habit } from '../types';
import { HabitFrequency } from '../constants/enums';

interface EditHabitModalProps {
  isOpen: boolean;
  habit: Habit | null;
  onSave: (updates: Partial<Habit>) => void;
  onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  habit,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY);
  const [showToast, setShowToast] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setFrequency(habit.frequency);
    }
  }, [habit]);

  // Reset toast when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowToast(false);
      toastOpacity.setValue(0);
      toastTranslateY.setValue(20);
    }
  }, [isOpen, toastOpacity, toastTranslateY]);

  const triggerSuccessToast = useCallback(() => {
    setShowToast(true);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity, toastTranslateY]);

  if (!habit) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), frequency });
    triggerSuccessToast();

    // Close modal after showing toast
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-slate-950/60">
        <View className={`w-full rounded-t-3xl p-6 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Habit</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#64748b' : '#94a3b8'} />
            </TouchableOpacity>
          </View>
          
          <View className="space-y-6">
            <View className="space-y-2">
              <Text className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Habit Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className={`w-full h-12 rounded-xl border px-4 text-sm ${isDark ? 'border-slate-800 bg-slate-950/50 text-slate-100' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                placeholder="Habit name..."
                placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
              />
            </View>

            <View className="space-y-2">
              <Text className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Frequency
              </Text>
              <View className={`flex-row h-12 rounded-xl p-1 border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
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

            <View className="flex-row gap-3 pt-4 mb-4">
              <TouchableOpacity
                onPress={onClose}
                className={`flex-1 h-12 rounded-xl border items-center justify-center active:scale-95 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'}`}
              >
                <Text className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 h-12 rounded-xl bg-emerald-500 items-center justify-center active:scale-95"
              >
                <Text className="text-sm font-bold text-slate-950">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
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
              zIndex: 100,
            }}
            className="flex-row items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3 shadow-lg shadow-emerald-500/20"
          >
            <View className="h-6 w-6 rounded-full bg-white/20 items-center justify-center">
              <Check size={14} color="#fff" />
            </View>
            <Text className="text-sm font-bold text-white tracking-tight">Habit updated successfully!</Text>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  frequencyButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#10b981',
  },
  frequencyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  frequencyTextActive: {
    color: '#0f172a',
  },
  frequencyTextInactive: {
    color: '#64748b',
  },
});

export default EditHabitModal;
