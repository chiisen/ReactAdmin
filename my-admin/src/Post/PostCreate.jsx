import { Create, SimpleForm, TextInput } from 'react-admin';

const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Create>
);

export default PostCreate;