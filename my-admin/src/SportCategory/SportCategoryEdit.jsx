import { Edit, SimpleForm, TextInput } from 'react-admin';

const SportCategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>item_id 不能修改，只能修改 option_id 和 sort_order </p>
            <TextInput source="id" disabled />
            <TextInput source="item_id" disabled alwaysOn />
            <TextInput source="option_id" alwaysOn />
            <TextInput source="sort_order" alwaysOn />
        </SimpleForm>
    </Edit>
);

export default SportCategoryEdit;