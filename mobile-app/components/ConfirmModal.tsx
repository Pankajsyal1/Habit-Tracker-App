import React from 'react';
import { Modal, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center p-6 bg-slate-950/60">
        <View className="w-full max-w-md rounded-2xl p-6 border border-slate-700 bg-slate-900">
          <View className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 mb-6">
            <AlertTriangle size={28} color="#f43f5e" />
          </View>
          
          <Text className="text-xl font-bold text-white mb-2">{title}</Text>
          <Text className="text-sm text-slate-400 leading-relaxed mb-8">
            {message}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 h-12 rounded-xl border border-slate-700 bg-slate-800 items-center justify-center active:scale-95"
            >
              <Text className="text-sm font-bold text-slate-300">{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 h-12 rounded-xl bg-rose-500 items-center justify-center active:scale-95"
            >
              <Text className="text-sm font-bold text-slate-950">{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
