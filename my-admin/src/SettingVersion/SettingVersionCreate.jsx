import { Create, SimpleForm, TextInput } from 'react-admin';

const SettingVersionCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p >data_type 必填</p>
            <TextInput source="data_type" />
            <p >version 不填預設為 1.0.0</p>
            <TextInput source="version" />
        </SimpleForm>
    </Create>
);

export default SettingVersionCreate;