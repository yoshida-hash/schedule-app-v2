import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../lib/constants';
import { uploadImage } from '../lib/eventService';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';

export default function EventModal({ isOpen, onClose, onSave, onDelete, initialDate, initialEvent }) {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('koji');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialEvent) {
            setTitle(initialEvent.title || '');
            setStartDate(initialEvent.startDate || initialEvent.date || '');
            setEndDate(initialEvent.endDate || initialEvent.date || '');
            setCategory(initialEvent.category || 'koji');
            setImageUrl(initialEvent.imageUrl || '');
        } else if (initialDate) {
            setTitle('');
            setStartDate(initialDate);
            setEndDate(initialDate);
            setCategory('koji');
            setImageUrl('');
        }
    }, [initialDate, initialEvent, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            setImageUrl(url);
        } catch (error) {
            console.error(error);
            alert('画像のアップロードに失敗しました');
        } finally {
            setIsUploading(false);
        }
    };

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
            category,
            imageUrl
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print text-slate-800">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialEvent ? '予定の編集' : '予定の追加'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
                    {/* タイトル入力 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">予定タイトル <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例: 見学会準備"
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
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
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-full shadow-sm"
                            />
                            <span className="text-slate-500 font-bold">〜</span>
                            <input
                                type="date"
                                required
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-full shadow-sm"
                            />
                        </div>
                    </div>

                    {/* カテゴリ選択 */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">カテゴリー</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setCategory(c.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all shadow-sm ${c.bgColor} ${c.textColor} ${c.borderColor} ${category === c.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 画像アップロード */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 font-bold flex items-center gap-2">
                            <ImageIcon size={16} /> 画像・写真の添付
                        </label>
                        <div className="mt-1 relative border-2 border-dashed border-slate-300 rounded-xl p-4 transition-colors hover:border-blue-400 bg-slate-50 group">
                            {imageUrl ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-inner">
                                    <img src={imageUrl} alt="Attached" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-sm text-slate-500 font-medium">クリックして画像を選択</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </label>
                            )}
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
