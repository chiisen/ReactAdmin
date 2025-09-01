import { Create, SimpleForm, TextInput } from 'react-admin';

const SportCategoryCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p>item_id 必填，必須在 Sport_Item 內有 id</p>
            <TextInput source="item_id" />
            <p>option_id 必填</p>
            <TextInput source="option_id" />
        </SimpleForm>
    </Create>
);

export default SportCategoryCreate;