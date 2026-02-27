import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function NotesSection({ projectId }) {
  const [generalNotes, setGeneralNotes] = useState('');
  const [cautionNotes, setCautionNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 初回ロード＆リアルタイム購読
  useEffect(() => {
    if (!projectId) return;
    const unsub = onSnapshot(doc(db, 'settings', `global-notes-${projectId}`), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGeneralNotes(data.general || '');
        setCautionNotes(data.caution || '');
      } else {
        setGeneralNotes('');
        setCautionNotes('');
      }
    });
    return () => unsub();
  }, [projectId]);

  // タイムアウトを利用した自動保存 (デバウンス)
  useEffect(() => {
    if (!projectId) return;
    const timer = setTimeout(async () => {
      // データの変更がなければスキップ
      if (generalNotes === '' && cautionNotes === '') return;

      setIsSaving(true);
      try {
        await setDoc(doc(db, 'settings', `global-notes-${projectId}`), {
          general: generalNotes,
          caution: cautionNotes,
          updatedAt: new Date().toISOString() // 簡易更新日時
        }, { merge: true });
      } catch (e) {
        console.error("備考の保存に失敗", e);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1秒入力が止まったら保存

    return () => clearTimeout(timer);
  }, [generalNotes, cautionNotes, projectId]);

  return (
    <div className="p-6 bg-slate-50 print:bg-white flex gap-6 print:break-inside-avoid relative mt-4 rounded-b-xl border border-slate-200 border-t-0 print:border-none print:mt-0 print:rounded-none">
      {isSaving && (
        <span className="absolute top-2 right-6 text-xs text-slate-400 no-print animate-pulse">保存中...</span>
      )}
      <div className="flex-1 flex flex-col min-h-[40px]">
        <h3 className="text-sm font-bold text-slate-700 mb-2 print:text-black print:block print:border-b-2 print:border-slate-800 print:pb-1 print:mb-4">全体共有事項</h3>
        <textarea
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          className="flex-1 w-full min-h-[96px] p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none print:hidden overflow-hidden bg-white text-sm"
          placeholder="共有事項を入力してください..."
        />
        <div className="hidden print:block whitespace-pre-wrap text-[13px] leading-relaxed text-slate-900 px-1">
          {generalNotes || '（なし）'}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-[40px]">
        <h3 className="text-sm font-bold text-slate-700 mb-2 print:text-black print:block print:border-b-2 print:border-slate-800 print:pb-1 print:mb-4">注意事項</h3>
        <textarea
          value={cautionNotes}
          onChange={(e) => setCautionNotes(e.target.value)}
          className="flex-1 w-full min-h-[96px] p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none print:hidden overflow-hidden bg-white text-sm"
          placeholder="注意事項を入力してください..."
        />
        <div className="hidden print:block whitespace-pre-wrap text-[13px] leading-relaxed text-slate-900 px-1">
          {cautionNotes || '（なし）'}
        </div>
      </div>
    </div>
  );
}
