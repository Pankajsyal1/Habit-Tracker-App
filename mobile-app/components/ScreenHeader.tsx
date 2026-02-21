import React, { ReactNode } from 'react';
import { View, Text, useColorScheme } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  accentColor?: 'emerald' | 'sky' | 'violet' | 'rose' | 'amber';
  rightElement?: ReactNode;
}

const accentMap = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const ScreenHeader = ({
  title,
  subtitle,
  icon,
  accentColor = 'emerald',
  rightElement,
}: ScreenHeaderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const accent = accentMap[accentColor];

  return (
    <View className={`px-5 pt-2 pb-4 border-b ${isDark ? 'bg-slate-950 border-slate-800/60' : 'bg-white border-slate-200/80'}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          {icon && (
            <View className={`h-10 w-10 items-center justify-center rounded-2xl border ${accent.bg} ${accent.border}`}>
              {icon}
            </View>
          )}
          <View className="flex-1">
            <Text className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </Text>
            <Text className="text-[11px] font-medium text-slate-400 mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>
        {rightElement && <View className="ml-3">{rightElement}</View>}
      </View>
    </View>
  );
};

export default ScreenHeader;
