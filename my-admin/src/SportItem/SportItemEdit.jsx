import { Edit, SimpleForm, TextInput } from 'react-admin';

const SportItemEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name_key" />
            <TextInput source="description" />
            <TextInput source="link_type" />
            <TextInput source="link_sub_type" />
            <TextInput source="updated_at" />
        </SimpleForm>
    </Edit>
);

export default SportItemEdit;