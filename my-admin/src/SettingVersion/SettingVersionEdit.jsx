import { Edit, SimpleForm, TextInput, DateTimeInput } from 'react-admin';

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
            <DateTimeInput source="updated_at" options={{ ampm: false }} /> {/* 一般不開放修改，但是版本號支援修改更新日期 */}
        </SimpleForm>
    </Edit>
);

export default SettingVersionEdit;