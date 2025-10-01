import { CreateButton, TopToolbar, Filter, SelectInput, Button } from 'react-admin';
import { useListContext } from 'react-admin';


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


const I18nTextFilter = () => {
    const { setFilters } = useListContext();

    const handleResetFilter = () => {
        setFilters({});
    };

    return (
        <Filter>
            <SelectInput
                source="lang"
                label="語言"
                alwaysOn
                choices={[
                    { id: 'de-DE', name: '德語 (de-DE)' },
                    { id: 'en-US', name: '英文 (en-US)' },
                    { id: 'es-ES', name: '西班牙語 (es-ES)' },
                    { id: 'fr-FR', name: '法語 (fr-FR)' },
                    { id: 'it-IT', name: '義大利語 (it-IT)' },
                    { id: 'ja-JP', name: '日語 (ja-JP)' },
                    { id: 'pt-PT', name: '葡萄牙語 (pt-PT)' },
                    { id: 'zh-CN', name: '簡體中文 (zh-CN)' },
                    { id: 'zh-TW', name: '繁體中文 (zh-TW)' },
                ]}
            />
            <Button label="重置" onClick={handleResetFilter} />
        </Filter>
    );
};

const columns = [
    <DataTable.Col key="id" source="id" align="right" />,
    <DataTable.Col key="key" source="key" align="left" />,
    <DataTable.Col key="lang" source="lang" align="left" />,
    <DataTable.Col key="text" source="text" align="left" />,
    <DataTable.Col key="updated_at" source="updated_at" align="left" />,
    <DataTable.Col key="created_at" source="created_at" align="left" />,
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
            filters={<I18nTextFilter />}
        >
            <DataTable className="center-header">
                {columns}
            </DataTable>
        </List>
    </>
);

export default I18nTextList;

