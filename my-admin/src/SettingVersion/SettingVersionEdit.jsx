import { Edit, SimpleForm, TextInput } from 'react-admin';

const SettingVersionEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="data_type" />
            <TextInput source="updated_at" />
            <TextInput source="version" />
        </SimpleForm>
    </Edit>
);

export default SettingVersionEdit;