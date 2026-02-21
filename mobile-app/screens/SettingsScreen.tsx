import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Database, AlertTriangle, LineChart, Download, Trash2, Github, Settings as SettingsIcon } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ScreenHeader from '../components/ScreenHeader';
import { dbService } from '../db/db';

export default function SettingsScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleExport = async () => {
    try {
      const habits = await dbService.getHabits();
      if (habits.length === 0) {
        Alert.alert('No Data', 'You have no habits to export.');
        return;
      }
      
      const data = JSON.stringify({ habits }, null, 2);
      const filename = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = (FileSystem as any).documentDirectory + filename;
      
      await (FileSystem as any).writeAsStringAsync(fileUri, data);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sharing Unavailable', 'File saved to cache but sharing is not supported on this device.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', 'An error occurred while exporting your data.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Factory Reset',
      'This will permanently delete all your tracking data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await dbService.clearDatabase();
            Alert.alert('Success', 'Application data has been reset.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`} edges={['top']}>
      <ScreenHeader
        title="System Preferences"
        subtitle="Manage your data ecosystem and application state."
        icon={<SettingsIcon size={20} color="#f59e0b" />}
        accentColor="amber"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-8 gap-8 pb-10">

          <View className="gap-6">
            <View className={`rounded-3xl p-6 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <View className="flex-row items-center gap-4 mb-4">
                 <View className="h-12 w-12 bg-sky-500/10 rounded-2xl items-center justify-center">
                    <Database size={24} color="#38bdf8" />
                 </View>
                 <View>
                    <Text className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Data Management</Text>
                    <Text className="text-[10px] text-slate-500 mt-0.5">Backup and mobility controls</Text>
                 </View>
              </View>
              
              <Text className="text-xs leading-relaxed text-slate-500 mb-6">
                Keep your progress safe. Export your habit data as a JSON snapshot that can be restored or analyzed externally.
              </Text>

              <TouchableOpacity
                onPress={handleExport}
                className={`w-full flex-row items-center justify-center gap-3 rounded-2xl h-14 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} active:scale-95`}
              >
                <Download size={20} color="#38bdf8" />
                <Text className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Export Backup</Text>
              </TouchableOpacity>
            </View>

            <View className={`rounded-3xl p-6 border ${isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
              <View className="flex-row items-center gap-4 mb-4">
                 <View className="h-12 w-12 bg-emerald-500/10 rounded-2xl items-center justify-center">
                    <LineChart size={24} color="#10b981" />
                 </View>
                 <View>
                    <Text className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Insights</Text>
                    <Text className="text-[10px] text-slate-500 mt-0.5">Performance optimization</Text>
                 </View>
              </View>
              
              <Text className="text-xs leading-relaxed text-slate-500 mb-6">
                Explore detailed statistics and trends about your consistency and growth over time.
              </Text>

              <TouchableOpacity
                onPress={() => (navigation as any).navigate('Analytics')}
                className={`w-full flex-row items-center justify-center gap-3 rounded-2xl h-14 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} active:scale-95`}
              >
                <LineChart size={20} color="#10b981" />
                <Text className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Audit Performance</Text>
              </TouchableOpacity>
            </View>

            <View className={`rounded-3xl p-6 border ${isDark ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
              <View className="flex-row items-center gap-4 mb-4">
                 <View className="h-12 w-12 bg-rose-500/10 rounded-2xl items-center justify-center">
                    <AlertTriangle size={24} color="#f43f5e" />
                 </View>
                 <View>
                    <Text className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Danger Zone</Text>
                    <Text className="text-[10px] text-slate-500 mt-0.5">Destructive system actions</Text>
                 </View>
              </View>

              <Text className="text-xs leading-relaxed text-slate-500 mb-6">
                Resetting your workspace will purge all habit definitions and streak history. This action is irreversible.
              </Text>

              <TouchableOpacity
                onPress={handleReset}
                className="w-full flex-row items-center justify-center gap-3 rounded-2xl h-14 bg-rose-500 active:scale-95"
              >
                <Trash2 size={20} color="#ffffff" />
                <Text className="text-xs font-bold uppercase tracking-widest text-white">Factory Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4 items-center">
             <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Habit Flow v1.0 • LocalStorage Mobile
             </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
