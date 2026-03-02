import React, { useMemo } from 'react';
import { getCalendarMonthDays, getWeekDays } from '../utils/calendarUtils';
import { getRokuyo } from '../utils/rokuyoUtils';
import { isSameMonth, isToday, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import JapaneseHolidays from 'japanese-holidays';
import { CATEGORY_MAP } from '../lib/constants';

export default function CalendarGrid({ monthDate, events = [], onDayClick, onEventClick }) {
    const days = getCalendarMonthDays(monthDate);
    const weekDays = getWeekDays();

    // Dense Packing: 各イベントに row（行番号）を割り当てる (不変性を維持)
    const eventsWithRow = useMemo(() => {
        const sorted = [...events].sort((a, b) => {
            const startA = a.startDate || a.date;
            const startB = b.startDate || b.date;
            if (startA !== startB) return startA.localeCompare(startB);
            const durA = new Date(a.endDate || a.date) - new Date(startA);
            const durB = new Date(b.endDate || b.date) - new Date(startB);
            return durB - durA;
        });

        const result = [];
        sorted.forEach(evt => {
            const start = evt.startDate || evt.date;
            const end = evt.endDate || evt.date;
            let r = 0;
            while (true) {
                const collision = result.find(other =>
                    other.row === r &&
                    start <= (other.endDate || other.date) &&
                    end >= (other.startDate || other.date)
                );
                if (!collision) {
                    result.push({ ...evt, row: r });
                    break;
                }
                r++;
            }
        });
        return result;
    }, [events]);

    const getEventsForDate = (dateString) => {
        return eventsWithRow.filter(e => {
            const start = e.startDate || e.date;
            const end = e.endDate || e.date;
            return dateString >= start && dateString <= end;
        });
    };

    return (
        <div className="flex flex-col mb-8 bg-white print:border-t-2 print:border-l-2 print:border-slate-800 print:mb-4 page-break-inside-avoid shadow-sm rounded-lg overflow-hidden border border-slate-200">
            {/* 月ヘッダー */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-lg font-bold text-slate-800 print:bg-slate-200 print:border-slate-800 print:border-b-2">
                {format(monthDate, 'yyyy年 M月', { locale: ja })}
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 border-b border-slate-200 print:border-b-2 print:border-slate-800">
                {weekDays.map((day, i) => (
                    <div
                        key={day}
                        className={`py-1 md:py-2 text-center text-[10px] md:text-sm font-bold border-r border-slate-200 print:border-r-2 print:border-slate-800 last:border-r-0
              ${i === 0 ? 'text-red-500 bg-red-50 print:bg-white' : i === 6 ? 'text-blue-500 bg-blue-50 print:bg-white' : 'text-slate-700 bg-slate-50 print:bg-white'} `}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 日付グリッド (レスポンシブ: 常に7列) */}
            <div className="flex-grow grid grid-cols-7 grid-rows-auto">
                {days.map((dayObj) => {
                    const { date, isCurrentMonth, dateString, dayNumber } = dayObj;
                    const isSunday = date.getDay() === 0;
                    const isSaturday = date.getDay() === 6;
                    const holidayName = JapaneseHolidays.isHoliday(date);
                    const isHolidayOrSunday = isSunday || !!holidayName;
                    const rokuyo = getRokuyo(date);
                    const dayEvents = getEventsForDate(dateString);

                    // セル内の最大行番号を計算して高さを確保
                    const maxRow = dayEvents.reduce((max, e) => Math.max(max, e.row || 0), -1);
                    const eventsAreaHeight = Math.max((maxRow + 1) * 22, 0);

                    // 画像を持つイベントを抽出
                    const imageEvents = dayEvents.filter(e => e.imageUrl && (e.startDate || e.date) === dateString);

                    return (
                        <div
                            key={dateString}
                            onClick={() => onDayClick && onDayClick(dateString)}
                            className={`min-h-[60px] md:min-h-[120px] print:min-h-[80px] border-b border-r border-slate-200 print:border-b-2 print:border-r-2 print:border-slate-800 p-0.5 md:p-1 flex flex-col cursor-pointer transition-colors hover:bg-slate-50 relative
                ${!isCurrentMonth ? 'bg-slate-50 opacity-40 print:opacity-100 print:bg-white' : 'bg-white'}
`}
                        >
                            {/* 日付ヘッダー領域 */}
                            <div className="flex justify-between items-start mb-0.5 h-4 md:h-6">
                                <div className="flex items-center gap-0.5 md:gap-2 z-20">
                                    <span className={`text-[10px] md:text-sm font-bold w-4 h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full
                                        ${isToday(date) ? 'bg-blue-600 text-white' : ''}
                                        ${!isToday(date) && isHolidayOrSunday ? 'text-red-500' : ''}
                                        ${!isToday(date) && isSaturday && !isHolidayOrSunday ? 'text-blue-500' : ''}
                                        ${!isToday(date) && !isHolidayOrSunday && !isSaturday ? 'text-slate-700' : ''}
                                    `}>
                                        {dayNumber}
                                    </span>
                                    {holidayName && (
                                        <span className="hidden md:block text-[10px] text-red-500 whitespace-nowrap font-bold">{holidayName}</span>
                                    )}
                                </div>
                                <span className={`text-[8px] md:text-[10px] font-medium z-20 ${rokuyo === '大安' ? 'text-red-500' : rokuyo === '仏滅' ? 'text-slate-400' : 'text-slate-500'} `}>
                                    {rokuyo}
                                </span>
                            </div>

                            {/* イベント表示領域 */}
                            {/* maxRowに基づいて高さを動的に計算 (モバイル: 16px, PC: 22px) */}
                            <div
                                className="flex-1 relative print:overflow-visible"
                                style={{
                                    minHeight: `${Math.max((maxRow + 1) * (typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 22), 20)}px`
                                }}
                            >
                                {dayEvents.map(event => {
                                    const start = event.startDate || event.date;
                                    const end = event.endDate || event.date;
                                    const isStartNode = dateString === start;
                                    const isEndNode = dateString === end;
                                    const isMultiDay = start !== end;
                                    const isWeekStartNode = date.getDay() === 0 && !isStartNode;
                                    const catInfo = CATEGORY_MAP[event.category || 'koji'] || CATEGORY_MAP.koji;

                                    return (
                                        <div
                                            key={event.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick && onEventClick(event);
                                            }}
                                            className={`absolute left-0 right-0 text-[7px] md:text-[11px] leading-tight h-[14px] md:h-[18px] px-0.5 md:px-1 font-bold cursor-pointer hover:opacity-90 z-10 overflow-hidden flex items-center border shadow-sm transition-all
                                                ${catInfo.bgColor} ${catInfo.borderColor} ${catInfo.textColor}
                                                ${isStartNode ? 'rounded-l-sm md:rounded-l-md' : 'border-l-0'}
                                                ${isEndNode ? 'rounded-r-sm md:rounded-r-md' : 'border-r-0'}
                                                ${!isMultiDay ? 'rounded-sm md:rounded-md mx-0.5' : ''}
                                            `}
                                            style={{
                                                top: `${(event.row || 0) * (typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 22)}px`,
                                                ...(!isStartNode && isMultiDay ? { marginLeft: '-2px', paddingLeft: '3px' } : {}),
                                                ...(!isEndNode && isMultiDay ? { marginRight: '-2px', paddingRight: '3px' } : {})
                                            }}
                                        >
                                            <div className="flex items-center w-full min-w-0">
                                                {(isStartNode || isWeekStartNode || !isMultiDay) && (
                                                    <>
                                                        <span className="hidden md:inline-block bg-white px-1 py-0 mr-1 rounded-sm text-[8px] md:text-[9px] whitespace-nowrap border border-current shadow-sm shrink-0">
                                                            {catInfo.label}
                                                        </span>
                                                        <span className="truncate flex-1">
                                                            {event.title}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* 画像の表示 (予定の数に合わせて上部にマージンを確保) */}
                                {imageEvents.length > 0 && (
                                    <div
                                        className="flex flex-wrap gap-1 pb-1"
                                        style={{
                                            marginTop: `${(maxRow + 1) * (typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 22) + 4}px`
                                        }}
                                    >
                                        {imageEvents.map((event, idx) => (
                                            <div
                                                key={`${event.id}-img-${idx}`}
                                                className="w-10 h-10 md:w-16 md:h-16 rounded-sm md:rounded-md overflow-hidden border border-white md:border-2 shadow-sm md:shadow-md transform rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer relative z-20"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                            >
                                                <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
