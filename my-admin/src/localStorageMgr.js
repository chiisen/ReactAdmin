export class localStorageMgr {
    /**
     * 儲存到 localStorage
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    static setItem(key, value) {
        if (typeof key !== 'string' || !key) {
            console.warn('localStorage setItem failed: key 必須是非空字串');
            return;
        }
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (e) {
            console.warn('localStorage setItem failed:', e);
        }
    }

    /**
     * 從 localStorage 取得資料並解析
     * @param {*} key 
     * @returns 
     */
    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('localStorage getItem failed:', e);
            return null;
        }
    }
}