export const CATEGORY_MAP = {
    koji: { label: '工事', bgColor: 'bg-[#E0E7FF]', textColor: 'text-indigo-800', borderColor: 'border-indigo-300' },
    setsuie: { label: '設営', bgColor: 'bg-[#E0F2FE]', textColor: 'text-blue-800', borderColor: 'border-blue-300' },
    kensa: { label: '検査', bgColor: 'bg-[#FEF3C7]', textColor: 'text-amber-800', borderColor: 'border-amber-300' },
    seisaku: { label: '制作', bgColor: 'bg-[#F3E8FF]', textColor: 'text-purple-800', borderColor: 'border-purple-300' },
    kokoku: { label: '広告', bgColor: 'bg-[#DCFCE7]', textColor: 'text-green-800', borderColor: 'border-green-300' },
    event: { label: 'イベント', bgColor: 'bg-[#FCE7F3]', textColor: 'text-pink-800', borderColor: 'border-pink-300' },
    kokyaku: { label: '顧客', bgColor: 'bg-[#FFE4E6]', textColor: 'text-rose-800', borderColor: 'border-rose-300' }
};

export const CATEGORIES = Object.entries(CATEGORY_MAP).map(([value, info]) => ({
    value,
    ...info
}));
