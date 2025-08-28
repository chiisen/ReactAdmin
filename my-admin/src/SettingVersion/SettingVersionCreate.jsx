import { Create, SimpleForm, TextInput } from 'react-admin';

const SettingVersionCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="data_type" />
            <TextInput source="updated_at" />
            <TextInput source="version" />
        </SimpleForm>
    </Create>
);

export default SettingVersionCreate;