import { Edit, SimpleForm, TextInput } from 'react-admin';

const CategoryOptionEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <TextInput source="group_id" />
            <TextInput source="name_key" />
            <TextInput source="description" />
            <TextInput source="sort_order" />
            <TextInput source="updated_at" />
        </SimpleForm>
    </Edit>
);

export default CategoryOptionEdit;