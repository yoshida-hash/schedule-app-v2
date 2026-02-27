import React, { useMemo } from 'react';
import { getCalendarMonthDays, getWeekDays } from '../utils/calendarUtils';
import { getRokuyo } from '../utils/rokuyoUtils';
import { isSameMonth, isToday, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import JapaneseHolidays from 'japanese-holidays';

export default function CalendarGrid({ monthDate, events = [], onDayClick, onEventClick }) {
    const days = getCalendarMonthDays(monthDate);
    const weekDays = getWeekDays();

    // Dense Packing: 各イベントに row（行番号）を割り当てる
    const eventsWithRow = useMemo(() => {
        const sorted = [...events].sort((a, b) => {
            const startA = a.startDate || a.date;
            const startB = b.startDate || b.date;
            if (startA !== startB) return startA.localeCompare(startB);
            const durA = new Date(a.endDate || a.date) - new Date(startA);
            const durB = new Date(b.endDate || b.date) - new Date(startB);
            return durB - durA; // 長い順（期間が長い予定を優先配置）
        });

        const rows = [];
        sorted.forEach(evt => {
            const start = evt.startDate || evt.date;
            const end = evt.endDate || evt.date;
            let r = 0;
            while (true) {
                const collision = sorted.find(other =>
                    other.id !== evt.id &&
                    other.row === r &&
                    start <= (other.endDate || other.date) &&
                    end >= (other.startDate || other.date)
                );
                if (!collision) {
                    evt.row = r;
                    break;
                }
                r++;
            }
        });
        return sorted;
    }, [events]);

    const getEventsForDate = (dateString) => {
        return eventsWithRow.filter(e => {
            const start = e.startDate || e.date;
            const end = e.endDate || e.date;
            return dateString >= start && dateString <= end;
        });
    };

    const CATEGORY_MAP = {
        koji: { label: '工事', bgColor: 'bg-[#E0E7FF]', textColor: 'text-indigo-800', borderColor: 'border-indigo-300' },
        setsuie: { label: '設営', bgColor: 'bg-[#E0F2FE]', textColor: 'text-blue-800', borderColor: 'border-blue-300' },
        kensa: { label: '検査', bgColor: 'bg-[#FEF3C7]', textColor: 'text-amber-800', borderColor: 'border-amber-300' },
        seisaku: { label: '制作', bgColor: 'bg-[#F3E8FF]', textColor: 'text-purple-800', borderColor: 'border-purple-300' },
        kokoku: { label: '広告', bgColor: 'bg-[#DCFCE7]', textColor: 'text-green-800', borderColor: 'border-green-300' },
        event: { label: 'イベント', bgColor: 'bg-[#FCE7F3]', textColor: 'text-pink-800', borderColor: 'border-pink-300' },
        kokyaku: { label: '顧客', bgColor: 'bg-[#FFE4E6]', textColor: 'text-rose-800', borderColor: 'border-rose-300' }
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
                        className={`py-2 text-center text-sm font-bold border-r border-slate-200 print:border-r-2 print:border-slate-800 last:border-r-0
              ${i === 0 ? 'text-red-500 bg-red-50 print:bg-white' : i === 6 ? 'text-blue-500 bg-blue-50 print:bg-white' : 'text-slate-700 bg-slate-50 print:bg-white'} `}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 日付グリッド */}
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
                    const eventsAreaHeight = Math.max((maxRow + 1) * 22, 0); // 1行22px

                    return (
                        <div
                            key={dateString}
                            onClick={() => onDayClick && onDayClick(dateString)}
                            className={`min-h-[100px] print:min-h-[80px] border-b border-r border-slate-200 print:border-b-2 print:border-r-2 print:border-slate-800 p-1 flex flex-col cursor-pointer transition-colors hover:bg-slate-50
                ${!isCurrentMonth ? 'bg-slate-50 opacity-50 print:opacity-100 print:bg-white' : 'bg-white'}
`}
                        >
                            {/* 日付ヘッダー領域 */}
                            <div className="flex justify-between items-start mb-1 h-6">
                                <div className="flex flex-col z-20">
                                    <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday(date) ? 'bg-blue-600 text-white' : ''}
                  ${!isToday(date) && isHolidayOrSunday ? 'text-red-500' : ''}
                  ${!isToday(date) && isSaturday && !isHolidayOrSunday ? 'text-blue-500' : ''}
                  ${!isToday(date) && !isHolidayOrSunday && !isSaturday ? 'text-slate-700' : ''}
`}>
                                        {dayNumber}
                                    </span>
                                    {holidayName && (
                                        <span className="text-[9px] text-red-500 whitespace-nowrap overflow-hidden -mt-1 ml-1 font-bold">{holidayName}</span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium z-20 ${rokuyo === '大安' ? 'text-red-500' : rokuyo === '仏滅' ? 'text-slate-400' : 'text-slate-500'} `}>
                                    {rokuyo}
                                </span>
                            </div>

                            {/* イベント表示領域 */}
                            <div className="flex-1 relative print:overflow-visible mt-1" style={{ minHeight: `${eventsAreaHeight}px` }}>
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
                                            className={`absolute left-0 right-0 text-[11px] leading-tight h-[18px] px-1 font-bold cursor-pointer hover:opacity-90 z-10 overflow-hidden flex items-center border shadow-sm
                      ${catInfo.bgColor} ${catInfo.borderColor} ${catInfo.textColor}
                      ${isStartNode ? 'rounded-l-md ml-1' : 'border-l-0'}
                      ${isEndNode ? 'rounded-r-md mr-1' : 'border-r-0'}
                      ${!isMultiDay ? 'rounded-md mx-1' : ''}
`}
                                            style={{
                                                top: `${(event.row || 0) * 22}px`,
                                                ...(!isStartNode && isMultiDay ? { marginLeft: '-5px', paddingLeft: '6px' } : {}),
                                                ...(!isEndNode && isMultiDay ? { marginRight: '-5px', paddingRight: '6px' } : {})
                                            }}
                                        >
                                            <div className="flex items-center w-full min-w-0">
                                                {(isStartNode || isWeekStartNode || !isMultiDay) && (
                                                    <>
                                                        <span className="bg-white px-1.5 py-0.5 mr-1.5 rounded-sm text-[9px] whitespace-nowrap border border-current shadow-sm shrink-0">
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
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
