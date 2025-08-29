import { List, DataTable } from 'react-admin';

const PostList = () => (
    <List resource="posts" title="文章列表">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
    </List>
);

export default PostList;

