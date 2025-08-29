import { Create, SimpleForm, TextInput } from 'react-admin';

const SportItemCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name_key" />
            <TextInput source="description" />
            <TextInput source="link_type" />
            <TextInput source="link_sub_type" />
            <TextInput source="updated_at" />
        </SimpleForm>
    </Create>
);

export default SportItemCreate;