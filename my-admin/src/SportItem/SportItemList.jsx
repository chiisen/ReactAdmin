import { List, DataTable } from 'react-admin';

const SportItemList = () => (
    <List resource="sportItem" title="運動類型">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name_key" />
            <DataTable.Col source="description" />
            <DataTable.Col source="link_type" />
            <DataTable.Col source="link_sub_type" />
            <DataTable.Col source="updated_at" />
            <DataTable.Col source="created_at" />
        </DataTable>
    </List>
);

export default SportItemList;

