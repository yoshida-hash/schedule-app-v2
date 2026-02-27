import { Calendar, Printer, Settings } from 'lucide-react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 print:bg-white text-slate-800">
            {/* 画面用ヘッダー（印刷時は非表示） */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between no-print sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="text-blue-600 w-6 h-6" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                        スケジュール共有カレンダー
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <Printer className="w-4 h-4" />
                        印刷する
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* メインの印刷される領域 */}
            <main className="flex-grow p-6 print:p-0 print:m-0 w-full max-w-[1600px] mx-auto flex flex-col gap-6">
                {children}
            </main>
        </div>
    );
}
