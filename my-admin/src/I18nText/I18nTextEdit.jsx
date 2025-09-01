import { Edit, SimpleForm, TextInput } from 'react-admin';

const I18nTextEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <TextInput source="key" disabled />
            <TextInput source="lang" />
            <TextInput source="text" />
            <TextInput source="updated_at" />
        </SimpleForm>
    </Edit>
);

export default I18nTextEdit;