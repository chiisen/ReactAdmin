import { Edit, SimpleForm, TextInput } from 'react-admin';

const SportCategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改</p>
            <TextInput source="id" disabled />
            <TextInput source="item_id" disabled />
            <TextInput source="option_id" disabled />
        </SimpleForm>
    </Edit>
);

export default SportCategoryEdit;