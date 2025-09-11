import { Edit, SimpleForm, TextInput } from 'react-admin';

const CategoryGroupEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改</p>
            <TextInput source="id" disabled alwaysOn /> {/* 設定屬性 alwaysOn 時 id 一定送出 */}
            <TextInput source="name_key" />
            <TextInput source="description" />
            <TextInput source="sort_order" />
            <TextInput source="updated_at" disabled />
        </SimpleForm>
    </Edit>
);

export default CategoryGroupEdit;