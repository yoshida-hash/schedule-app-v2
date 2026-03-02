import { Calendar, Printer, Settings } from 'lucide-react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 print:bg-white text-slate-800">
            {/* 画面用ヘッダー（印刷時は非表示） */}
            <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between no-print sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                    <h1 className="text-base md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-none">
                        スケジュール共有
                    </h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-xs md:text-sm shadow-sm"
                    >
                        <Printer className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        <span className="hidden xs:inline">印刷する</span>
                    </button>
                    <button className="p-1.5 md:p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* スマホ用スクロールヒント */}
            <div className="md:hidden bg-blue-50 text-blue-600 text-[10px] py-1 px-4 text-center border-b border-blue-100 flex items-center justify-center gap-1 no-print">
                <div className="animate-bounce">←</div>
                左右にスワイプして1週間を確認できます
                <div className="animate-bounce">→</div>
            </div>

            {/* メインの印刷される領域 */}
            <main className="flex-grow p-2 md:p-6 print:p-0 print:m-0 w-full max-w-[1600px] mx-auto flex flex-col gap-4 md:gap-6">
                {children}
            </main>
        </div>
    );
}
