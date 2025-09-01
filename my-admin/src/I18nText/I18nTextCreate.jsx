import { Create, SimpleForm, TextInput } from 'react-admin';

const I18nTextCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p>key 必填</p>
            <TextInput source="key" />
            <p>lang 必填</p>
            <TextInput source="lang" />
            <p>text 必填</p>
            <TextInput source="text" />
        </SimpleForm>
    </Create>
);

export default I18nTextCreate;