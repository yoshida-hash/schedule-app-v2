import React, { useState, useEffect } from 'react';

const CATEGORIES = [
    { value: 'koji', label: '工事', bgColor: 'bg-[#E0E7FF]', textColor: 'text-indigo-800', borderColor: 'border-indigo-300' },
    { value: 'setsuie', label: '設営', bgColor: 'bg-[#E0F2FE]', textColor: 'text-blue-800', borderColor: 'border-blue-300' },
    { value: 'kensa', label: '検査', bgColor: 'bg-[#FEF3C7]', textColor: 'text-amber-800', borderColor: 'border-amber-300' },
    { value: 'seisaku', label: '制作', bgColor: 'bg-[#F3E8FF]', textColor: 'text-purple-800', borderColor: 'border-purple-300' },
    { value: 'kokoku', label: '広告', bgColor: 'bg-[#DCFCE7]', textColor: 'text-green-800', borderColor: 'border-green-300' },
    { value: 'event', label: 'イベント', bgColor: 'bg-[#FCE7F3]', textColor: 'text-pink-800', borderColor: 'border-pink-300' },
    { value: 'kokyaku', label: '顧客', bgColor: 'bg-[#FFE4E6]', textColor: 'text-rose-800', borderColor: 'border-rose-300' }
];

export default function EventModal({ isOpen, onClose, onSave, onDelete, initialDate, initialEvent }) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('koji');

    useEffect(() => {
        if (initialEvent) {
            setTitle(initialEvent.title || '');
            setStartDate(initialEvent.startDate || initialEvent.date || '');
            setEndDate(initialEvent.endDate || initialEvent.date || '');
            setCategory(initialEvent.category || 'koji');
        } else if (initialDate) {
            setTitle('');
            setStartDate(initialDate);
            setEndDate(initialDate);
            setCategory('koji');
        }
    }, [initialDate, initialEvent, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !startDate || !endDate) return;

        if (startDate > endDate) {
            alert('終了日は開始日以降の日付を指定してください');
            return;
        }

        onSave({
            id: initialEvent?.id,
            title: title.trim(),
            startDate,
            endDate,
            category
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialEvent ? '予定の編集' : '予定の追加'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {/* タイトル入力 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">予定タイトル <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例: 見学会準備"
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        />
                    </div>

                    {/* 期間入力 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">期間 <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    if (endDate && e.target.value > endDate) {
                                        setEndDate(e.target.value);
                                    }
                                }}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow w-full"
                            />
                            <span className="text-slate-500 font-bold">〜</span>
                            <input
                                type="date"
                                required
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow w-full"
                            />
                        </div>
                    </div>

                    {/* カテゴリ選択 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">カテゴリー</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
                        >
                            {CATEGORIES.map(c => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setCategory(c.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${c.bgColor} ${c.textColor} ${c.borderColor} ${category === c.value ? 'ring-2 ring-offset-1 ring-blue-500' : 'opacity-40 hover:opacity-100'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ボタン領域 */}
                    <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                        {initialEvent ? (
                            <button
                                type="button"
                                onClick={() => onDelete(initialEvent.id)}
                                className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            >
                                削除
                            </button>
                        ) : (
                            <div /> // スペーサー
                        )}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}
