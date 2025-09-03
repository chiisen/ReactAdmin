import { Edit, SimpleForm, TextInput } from 'react-admin';

const I18nTextEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改，只能刪除再重建</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <p>key 不能修改</p>
            <TextInput source="key" disabled />
            <p>lang 不能修改</p>
            <TextInput source="lang" disabled />
            <TextInput source="text" />
            <TextInput source="updated_at" />
        </SimpleForm>
    </Edit>
);

export default I18nTextEdit;