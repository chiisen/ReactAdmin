import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { link_type_Choices } from './SportItemChoices';

const SportItemCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p>name_key 必填</p>
            <TextInput source="name_key" />
            <p>description 選填</p>
            <TextInput source="description" />
            <p>link_type 必填(1-7)</p>
            <SelectInput source="link_type" choices={link_type_Choices} />
            <p>link_sub_type 必填</p>
            <TextInput source="link_sub_type" />
        </SimpleForm>
    </Create>
);

export default SportItemCreate;