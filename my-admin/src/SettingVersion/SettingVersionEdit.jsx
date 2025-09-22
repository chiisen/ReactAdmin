import { Edit, SimpleForm, TextInput, DateTimeInput } from 'react-admin';

// 時間欄位處理說明：
// - react-admin 的 DateTimeInput 在表單中會給出一個 Date 物件（以瀏覽器本地時區解析顯示）。
// - 後端目前期望接收的格式為字串 'YYYY-MM-DD HH:mm:ss'（24 小時制，含秒）。
// - 因此在提交時需將 Date 轉為上述格式字串；若值為空則不處理。
// - 注意：這裡使用的是「本地時間」格式化，如果後端需要 UTC，需改成以 UTC 取值（getUTC*）。
// - 若未來要支援毫秒、時區標記（如 ISO8601），請同步調整格式與後端解析。
const formatDateTimeString = (value) => {
    if (!value) return value;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date)) return undefined;
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const MM = pad(date.getMinutes());
    const SS = pad(date.getSeconds());
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
};

// 表單提交前的資料轉換：
// - 將 updated_at 統一轉成後端期望的字串格式
// - 若 updated_at 為空值，保留為原樣（避免覆蓋）
const transform = (data) => ({
    ...data,
    updated_at: data?.updated_at ? formatDateTimeString(data.updated_at) : data?.updated_at,
});

const SettingVersionEdit = (props) => (
    <Edit {...props} transform={transform}>
        <SimpleForm>
            <p>id 不能修改</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <p>data_type 不能修改</p>
            <TextInput source="data_type" disabled />
            <TextInput source="version" />
            {/*
                updated_at 欄位：
                - options.ampm=false 強制使用 24 小時制顯示，與後端格式一致（HH:mm:ss）。
                - 若需要自訂顯示格式，可改用 format/parser 或自訂組件；
                  但務必保持 transform 的輸出與後端協議一致。
            */}
            <DateTimeInput source="updated_at" options={{ ampm: false }} /> {/* 一般不開放修改，但是版本號支援修改更新日期 */}
        </SimpleForm>
    </Edit>
);

export default SettingVersionEdit;