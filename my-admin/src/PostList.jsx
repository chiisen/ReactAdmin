import { List, DataTable } from 'react-admin';

const PostList = () => (
    <List resource="posts">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
    </List>
);

export default PostList;

