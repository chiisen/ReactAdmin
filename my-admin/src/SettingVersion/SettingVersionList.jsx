import { List, DataTable } from 'react-admin';

const SettingVersionList = () => (
    <List resource="settingVersion" title="版本號碼">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="data_type" />
            <DataTable.Col source="updated_at" />
            <DataTable.Col source="created_at" />
            <DataTable.Col source="version" />
        </DataTable>
    </List>
);

export default SettingVersionList;

