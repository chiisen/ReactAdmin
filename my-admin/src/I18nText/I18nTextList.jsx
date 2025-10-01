import { CreateButton, TopToolbar } from 'react-admin';


import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';
import CustomPagination from '../utils/CustomPagination';
import { CustomExportLabelButton } from '../utils/CustomExportButton';

/**
 * 自定義列表頁面頂部按鈕
 * @param {*} param0 
 * @returns 
 */
const ListActions = ({ columns }) => (
    <TopToolbar>
        <CreateButton />
        <CustomExportLabelButton columns={columns} />
        {/* 其他按鈕 */}
    </TopToolbar>
);


const columns = [
    <DataTable.Col key="id" source="id" align="right" />, 
    <DataTable.Col key="key" source="key" align="left" />, 
    <DataTable.Col key="lang" source="lang" align="left"  />, 
    <DataTable.Col key="text" source="text" align="left"  />, 
    <DataTable.Col key="updated_at" source="updated_at" align="left"  />, 
    <DataTable.Col key="created_at" source="created_at" align="left"  />,
];


/**
 * 頁面欄位顯示標籤
 * @returns 
 */
const I18nTextList = () => (
    <>
        <style>
            {`
                .center-header th {
                    text-align: center !important;
                }
            `}
        </style>
        <List
            resource={ResourceMgr.i18nText}
            title="多語系文字"
            actions={<ListActions columns={columns} />}
            pagination={<CustomPagination />}
        >
            <DataTable className="center-header">
                {columns}
            </DataTable>
        </List>
    </>
);

export default I18nTextList;

