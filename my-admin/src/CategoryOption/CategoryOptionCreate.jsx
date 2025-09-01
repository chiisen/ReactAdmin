import { Create, SimpleForm, TextInput } from 'react-admin';

const CategoryOptionCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p>group_id 必填</p>
            <TextInput source="group_id" />
            <p>name_key 必填</p>
            <TextInput source="name_key" />
            <p>description 選填</p>
            <TextInput source="description" />
            <p>sort_order 必填</p>
            <TextInput source="sort_order" />
        </SimpleForm>
    </Create>
);

export default CategoryOptionCreate;