import { Edit, SimpleForm, TextInput } from 'react-admin';

const PostEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);

export default PostEdit;