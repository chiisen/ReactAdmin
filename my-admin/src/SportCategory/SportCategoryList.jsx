import React from 'react';
import { CreateButton, TopToolbar, Pagination } from 'react-admin';
import { useListContext, useDataProvider } from 'react-admin';
// Import or define exportWithBOM
import { exportWithBOM } from '../utils/exportWithBOM'; // Adjust the path as needed
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';


import { useEffect, useState } from 'react';
import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';

import { localStorageMgr } from '../utils/localStorageMgr'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 自定義匯出按鈕
 * @param {*} param0 
 * @returns 
 */
const CustomExportButton = ({ columns }) => {
    const dataProvider = useDataProvider();
    const { resource } = useListContext();
    const fields = React.Children.toArray(columns)
        .map(child => ({
            source: child.props.source,
            label: child.props.label || child.props.source
        }));

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


const getColumns = (sportItemList, categoryOptionList) => [
    <DataTable.Col source="id" />,
    <DataTable.Col source="item_id" label="item_id (表:sport_item)"
        render={record => {
            let array = sportItemList;
            if (array && Array.isArray(array)) {
                const found = array.find(item => item.id === record.item_id);
                return found ? `${found.id} (${found.dscription || found.description || ''})` : record.item_id;
            } else {
                return record.item_id;
            }
        }}
    />,
    <DataTable.Col source="option_id" label="option_id (表:category_option)" render={record => {
        let array = categoryOptionList;
        if (array && Array.isArray(array)) {
            const found = array.find(item => item.id === record.option_id);
            return found ? `${found.id} (${found.dscription || found.description || ''})` : record.option_id;
        } else {
            return record.option_id;
        }
    }} />,
    <DataTable.Col source="updated_at" />,
    <DataTable.Col source="created_at" />,
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
const SportCategoryList = () => {
    const [sportItemList, setSportItemList] = useState([]);
    const [categoryOptionList, setCategoryOptionList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchSportItems = fetch(`${API_BASE_URL}/${ResourceMgr.sportItem}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appName': 'ReactAdmin'
            },
            body: JSON.stringify({
                pagination: {
                    page: 1,
                    perPage: 1000,
                }
            })
        })
            .then(res => res.json())
            .then(json => {
                setSportItemList(json.data || []);

                localStorageMgr.setItem(ResourceMgr.sportItem, json.data || []); // 儲存到 localStorage
            })
            .catch(err => {
                setSportItemList([]);
                console.error('API Fetch sport items 錯誤', err);
            });

        const fetchCategoryOptions = fetch(`${API_BASE_URL}/${ResourceMgr.categoryOption}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appName': 'ReactAdmin'
            },
            body: JSON.stringify({
                pagination: {
                    page: 1,
                    perPage: 1000,
                }
            })
        })
            .then(res => res.json())
            .then(json => {
                setCategoryOptionList(json.data || []);

                localStorageMgr.setItem(ResourceMgr.categoryOption, json.data || []); // 儲存到 localStorage
            })
            .catch(err => {
                setCategoryOptionList([]);
                console.error('API Fetch category options 錯誤', err);
            });

        Promise.all([fetchSportItems, fetchCategoryOptions]).finally(() => {
            setLoading(false);
        });
    }, []);


    if (loading) return <div>載入中 ...</div>;


    const columns = getColumns(sportItemList, categoryOptionList);

    return (
        <List
            resource={ResourceMgr.sportCategory}
            title="運動項目"
            actions={<ListActions columns={columns} />}
            pagination={<CustomPagination />}
        >
                <DataTable>
                    {columns.map((col, idx) => React.cloneElement(col, { key: col.props.source || idx }))}
                </DataTable>
        </List>
    );
};

export default SportCategoryList;

