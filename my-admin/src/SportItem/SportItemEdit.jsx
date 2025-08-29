import { Edit, SimpleForm, TextInput } from 'react-admin';

const SportItemEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <DataTable.Col source="id" />
            <DataTable.Col source="name_key" />
            <DataTable.Col source="description" />
            <DataTable.Col source="link_type" />
            <DataTable.Col source="link_sub_type" />
            <DataTable.Col source="created_at" />
            <DataTable.Col source="updated_at" />
        </SimpleForm>
    </Edit>
);

export default SportItemEdit;