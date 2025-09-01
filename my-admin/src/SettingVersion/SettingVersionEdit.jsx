import { Edit, SimpleForm, TextInput } from 'react-admin';

const SettingVersionEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p >id 不能修改</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <p >data_type 不能修改</p>
            <TextInput source="data_type" disabled />
            <TextInput source="version" />
            <TextInput source="updated_at" /> {/* 一般不開放修改，但是版本號支援修改更新日期 */}
        </SimpleForm>
    </Edit>
);

export default SettingVersionEdit;