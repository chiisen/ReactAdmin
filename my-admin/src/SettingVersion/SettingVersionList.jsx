import React from 'react';
import { CreateButton, TopToolbar, Pagination } from 'react-admin';
import { useListContext, useDataProvider } from 'react-admin';
// Import or define exportWithBOM
import { exportWithBOM } from '../utils/exportWithBOM'; // Adjust the path as needed
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';


import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';


/**
 * 自定義匯出按鈕
 * @param {*} param0 
 * @returns 
 */
const CustomExportButton = ({ columns }) => {
    const dataProvider = useDataProvider();
    const { resource } = useListContext();
    const fields = React.Children.toArray(columns)
        .map(child => ({ source: child.props.source }));

    const handleExport = async () => {
        const { data } = await dataProvider.getList(resource, {
            pagination: { page: 1, perPage: 10000 }, // 依你的 API 支援最大值
            sort: { field: 'id', order: 'ASC' },
            filter: {},
        });
        exportWithBOM(data, fields, resource);
    };

    return (
        <Button
            startIcon={<GetAppIcon />}
            variant="text"
            color="inherit"
            size="small"
            sx={{
                fontFamily: 'inherit', // 跟隨父層
                fontSize: '0.8125rem',
                textTransform: 'none',
                color: 'primary.main', // 跟隨父層顏色
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&:hover': {
                    backgroundColor: 'action.hover',
                    boxShadow: 'none',
                },
            }}
            onClick={handleExport}
        >
            Export CSV
        </Button>
    );
};

/**
 * 自定義列表頁面頂部按鈕
 * @param {*} param0 
 * @returns 
 */
const ListActions = ({ columns }) => (
    <TopToolbar>
        <CreateButton />
        <CustomExportButton columns={columns} />
        {/* 其他按鈕 */}
    </TopToolbar>
);

const columns = [
    <DataTable.Col key="id" source="id" />,
    <DataTable.Col key="data_type" source="data_type" />,
    <DataTable.Col key="version" source="version" />,
    <DataTable.Col key="updated_at" source="updated_at" />,
    <DataTable.Col key="created_at" source="created_at" />,
];

/**
 * 自定義分頁，每頁可選擇顯示數量
 * @param {*} props 
 * @returns 
 */
const CustomPagination = props => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50, 100, 500, 1000]} {...props} />
);


/**
 * 頁面欄位顯示標籤
 * @returns 
 */
const SettingVersionList = () => (
    <List
        resource={ResourceMgr.settingVersion}
        title="版本號碼"
        actions={<ListActions columns={columns} />}
        pagination={<CustomPagination />}
    >
        <DataTable>
            {columns}
        </DataTable>
    </List>
);

export default SettingVersionList;

