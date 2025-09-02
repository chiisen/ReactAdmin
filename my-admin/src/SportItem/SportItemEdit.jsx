import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { link_type_Choices } from './SportItemChoices';

const SportItemEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <p>id 不能修改</p>
            <TextInput source="id" disabled />
            <TextInput source="name_key" />
            <TextInput source="description" />
            <SelectInput source="link_type" choices={link_type_Choices} />
            <TextInput source="link_sub_type" />
            <TextInput source="updated_at" />
        </SimpleForm>
    </Edit>
);

export default SportItemEdit;