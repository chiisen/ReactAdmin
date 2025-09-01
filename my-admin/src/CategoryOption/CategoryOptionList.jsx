import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';

const CategoryOptionList = () => (
    <List resource={ResourceMgr.categoryOption} title="分類項目">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="group_id" />
            <DataTable.Col source="name_key" />
            <DataTable.Col source="description" />
            <DataTable.Col source="sort_order" />
            <DataTable.Col source="updated_at" />
            <DataTable.Col source="created_at" />
        </DataTable>
    </List>
);

export default CategoryOptionList;

