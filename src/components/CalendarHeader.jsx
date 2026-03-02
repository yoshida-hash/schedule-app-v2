import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function CalendarHeader({ baseDate, setBaseDate, monthCount, setMonthCount, zoomLevel, setZoomLevel, projectName }) {

    const handlePrev = () => setBaseDate(subMonths(baseDate, 1));
    const handleNext = () => setBaseDate(addMonths(baseDate, 1));
    const handleToday = () => setBaseDate(startOfMonth(new Date()));

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));

    // 終了月を計算して表示文字列を作成
    const endMonth = addMonths(baseDate, monthCount - 1);
    const dateRangeStr = monthCount === 1
        ? format(baseDate, 'yyyy年 M月', { locale: ja })
        : `${format(baseDate, 'yyyy年 M月', { locale: ja })}〜${format(endMonth, 'M月', { locale: ja })}`;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 bg-slate-50 print:bg-white print:border-b-2 print:border-slate-800 gap-3">
            <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
                <div className="flex flex-col">
                    {projectName && (
                        <h1 className="text-lg md:text-xl font-extrabold text-blue-700 hidden print:block mb-1">
                            {projectName}
                        </h1>
                    )}
                    <h2 className="text-lg md:text-2xl font-bold text-slate-800 print:text-xl whitespace-nowrap">{dateRangeStr}</h2>
                </div>
                <div className="flex items-center gap-2 md:gap-4 no-print">
                    <select
                        value={monthCount}
                        onChange={(e) => setMonthCount(Number(e.target.value))}
                        className="text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-300 px-2 md:px-3 py-1.5 rounded-md no-print outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                    >
                        <option value={1}>1ヶ月</option>
                        <option value={2}>2ヶ月</option>
                        <option value={3}>3ヶ月</option>
                    </select>

                    <div className="flex items-center bg-white border border-slate-300 rounded-md shadow-sm no-print">
                        <button onClick={handleZoomOut} className="p-1 md:p-1.5 text-slate-600 hover:bg-slate-100 rounded-l-md transition-colors">
                            <ZoomOut className="w-3 md:w-4 h-3 md:h-4" />
                        </button>
                        <span className="text-[10px] md:text-xs font-medium text-slate-600 px-1 md:px-2 min-w-[35px] md:min-w-[50px] text-center border-l border-r border-slate-200">
                            {zoomLevel}%
                        </span>
                        <button onClick={handleZoomIn} className="p-1 md:p-1.5 text-slate-600 hover:bg-slate-100 rounded-r-md transition-colors">
                            <ZoomIn className="w-3 md:w-4 h-3 md:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 no-print">
                <button onClick={handlePrev} className="p-2 border border-slate-300 rounded hover:bg-slate-100 transition-colors bg-white shadow-sm">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button onClick={handleToday} className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 transition-colors font-medium text-slate-700 bg-white shadow-sm">
                    今日
                </button>
                <button onClick={handleNext} className="p-2 border border-slate-300 rounded hover:bg-slate-100 transition-colors bg-white shadow-sm">
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
            </div>
        </div>
    );
}
