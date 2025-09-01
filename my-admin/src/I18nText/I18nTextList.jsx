import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';

const I18nTextList = () => (
    <List resource={ResourceMgr.i18nText} title="多語系文字">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="key" />
            <DataTable.Col source="lang" />
            <DataTable.Col source="text" />
            <DataTable.Col source="updated_at" />
            <DataTable.Col source="created_at" />
        </DataTable>
    </List>
);

export default I18nTextList;

