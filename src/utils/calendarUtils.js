import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, isSameMonth, format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function getCalendarMonthDays(monthDate) {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    // カレンダーグリッドの開始日（最初の日・週の始まり：日曜日）
    const calendarStart = startOfWeek(start, { weekStartsOn: 0 });
    // カレンダーグリッドの終了日（最後の日・週の終わり：土曜日）
    const calendarEnd = endOfWeek(end, { weekStartsOn: 0 });

    const days = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd
    });

    return days.map(day => ({
        date: day,
        isCurrentMonth: day >= start && day <= end,
        dateString: format(day, 'yyyy-MM-dd'),
        dayOfWeek: format(day, 'E', { locale: ja }),
        dayNumber: format(day, 'd')
    }));
}

export function getWeekDays() {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end }).map(day => format(day, 'E', { locale: ja }));
}
