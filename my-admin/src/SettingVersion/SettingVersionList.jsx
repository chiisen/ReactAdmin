import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';

const SettingVersionList = () => (
    <List resource={ResourceMgr.settingVersion} title="版本號碼">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="data_type" />
            <DataTable.Col source="version" />
            <DataTable.Col source="updated_at" />
            <DataTable.Col source="created_at" />
        </DataTable>
    </List>
);

export default SettingVersionList;

