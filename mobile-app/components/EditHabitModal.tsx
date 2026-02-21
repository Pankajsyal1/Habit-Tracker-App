import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { X } from 'lucide-react-native';
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setFrequency(habit.frequency);
    }
  }, [habit]);

  if (!habit) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), frequency });
    onClose();
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
                    className={`flex-1 rounded-lg items-center justify-center ${frequency === f
                      ? 'bg-emerald-500'
                      : ''
                      }`}
                  >
                    <Text className={`text-[10px] font-bold uppercase tracking-wider ${frequency === f ? 'text-slate-900' : 'text-slate-500'}`}>
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
      </View>
    </Modal>
  );
};

export default EditHabitModal;
