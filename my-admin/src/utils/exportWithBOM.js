// src/utils/exportWithBOM.js
/**
 * 匯出 CSV 並加入 BOM 頭以支援 Excel 正確開啟
 * @param {*} data 
 * @param {*} fields 
 * @param {*} resource 
 */
export function exportWithBOM(data, fields, resource) {
    const csvRows = [];
    csvRows.push(fields.map(f => f.label || f.source).join(','));
    data.forEach(row => {
        csvRows.push(fields.map(f => {
            let value = row[f.source];
            // 這裡可根據需要自訂欄位格式化
            return `"${value ?? ''}"`;
        }).join(','));
    });
    const csv = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}