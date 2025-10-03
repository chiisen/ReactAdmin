// 共用函數：為列表添加 i18nText
export const addI18nText = (list, i18nText) => {
    return list.map(row => {
        const found = i18nText.find(i18n => i18n.key === row.name_key && i18n.lang === 'zh-TW');
        return {
            ...row,
            i18nText: found ? found.text : (row.name_key || '無資料')
        };
    });
};