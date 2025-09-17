import { Edit, SimpleForm, TextInput } from 'react-admin';

const SportCategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改，只能刪除再重建</p>
            <TextInput source="id" disabled />
            <TextInput source="item_id" disabled  alwaysOn />
            <TextInput source="option_id" disabled  alwaysOn />
            <TextInput source="sort_order" />
        </SimpleForm>
    </Edit>
);

export default SportCategoryEdit;