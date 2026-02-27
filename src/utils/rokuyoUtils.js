import { Solar } from 'lunar-javascript';

const ROKUYO_ARRAY = ['大安', '赤口', '先勝', '友引', '先負', '仏滅'];

export function getRokuyo(date) {
    try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const solar = Solar.fromYmd(year, month, day);
        const lunar = solar.getLunar();

        // 六曜の計算式: (旧暦の月 + 旧暦の日) % 6
        // ただし、0が大安となるように調整
        const lunarMonth = Math.abs(lunar.getMonth()); // 閏月対策で絶対値
        const lunarDay = lunar.getDay();

        const index = (lunarMonth + lunarDay) % 6;
        return ROKUYO_ARRAY[index];
    } catch (e) {
        console.error('Failed to get Rokuyo for date', date, e);
        return '';
    }
}
