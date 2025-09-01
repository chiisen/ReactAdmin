import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';

const SportCategoryList = () => (
    <List resource={ResourceMgr.sportCategory} title="運動項目" >
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="item_id" />
            <DataTable.Col source="option_id" />
            <DataTable.Col source="updated_at" />
            <DataTable.Col source="created_at" />
        </DataTable>
    </List>
);

export default SportCategoryList;

