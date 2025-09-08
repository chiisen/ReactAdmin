import { Edit, SimpleForm, TextInput } from 'react-admin';

const I18nTextEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改，只能刪除再重建</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <p>key 不能修改</p>
            <TextInput source="key" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 key 一定送出 */}
            <p>lang 不能修改</p>
            <TextInput source="lang" disabled alwaysOn/> {/* 設定屬性 alwaysOn 時 lang 一定送出 */}
            <TextInput source="text" />
            <p>updated_at 不能修改</p>
            <TextInput source="updated_at" disabled />
        </SimpleForm>
    </Edit>
);

export default I18nTextEdit;