import { Create, SimpleForm, TextInput } from 'react-admin';

const SportItemCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <DataTable.Col source="id" />
            <DataTable.Col source="name_key" />
            <DataTable.Col source="description" />
            <DataTable.Col source="link_type" />
            <DataTable.Col source="link_sub_type" />
            <DataTable.Col source="created_at" />
            <DataTable.Col source="updated_at" />
        </SimpleForm>
    </Create>
);

export default SportItemCreate;