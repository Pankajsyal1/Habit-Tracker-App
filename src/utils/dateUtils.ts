import { differenceInCalendarDays, isSameDay, parseISO } from 'date-fns';

export const toIsoDate = (date: Date) => date.toISOString();

export const todayIso = () => toIsoDate(new Date());

export const isSameDayIso = (a: string, b: string) =>
  isSameDay(parseISO(a), parseISO(b));

export const daysBetweenIso = (a: string, b: string) =>
  Math.abs(differenceInCalendarDays(parseISO(a), parseISO(b)));

