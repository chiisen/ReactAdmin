import { Create, SimpleForm, TextInput } from 'react-admin';

const SportItemCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p >name_key 必填</p>
            <TextInput source="name_key" />
            <p >description 選填</p>
            <TextInput source="description" />
            <p >link_type 必填</p>
            <TextInput source="link_type" />
            <p >link_sub_type 必填</p>
            <TextInput source="link_sub_type" />
        </SimpleForm>
    </Create>
);

export default SportItemCreate;