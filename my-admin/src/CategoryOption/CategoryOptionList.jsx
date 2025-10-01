import { CreateButton, TopToolbar } from 'react-admin';


import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';
import CustomPagination from '../utils/CustomPagination';
import { CustomExportLabelButton } from '../utils/CustomExportButton';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { localStorageMgr } from '../utils/localStorageMgr'


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

/**
 * 
 * @param {*} i18nTextList 
 * @returns 
 */
const getColumns = (i18nTextList) => [
    <DataTable.Col key="id" source="id" align="right" />,
    <DataTable.Col key="group_id" source="group_id" align="left" />,
    <DataTable.Col key="name_key" source="name_key" align="left" />,


    <DataTable.Col key="I18nText" source="I18nText" label="I18nText (表:I18nText)" align="left"
        render={record => {
            let array = i18nTextList;
            if (array && Array.isArray(array)) {
                const found = array.find(item => item.key === record.name_key && item.lang === 'zh-TW');
                return found ? `${found.text}` : record.name_key;
            } else {
                return record.name_key || '無資料';
            }
        }}
    />,


    <DataTable.Col key="description" source="description" align="left" />,
    <DataTable.Col key="sort_order" source="sort_order" align="right" />,
    <DataTable.Col key="updated_at" source="updated_at" align="left" />,
    <DataTable.Col key="created_at" source="created_at" align="left" />,
];


/**
 * 頁面欄位顯示標籤
 * @returns 
 */
import React, { useState, useEffect } from 'react';

const CategoryOptionList = () => {
    const [i18nTextList, setI18nTextList] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/${ResourceMgr.i18nText}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appName': 'ReactAdmin'
            },
            body: JSON.stringify({
                pagination: {
                    page: 1,
                    perPage: 1000,
                },
                filter: {
                    lang: 'zh-TW'
                },
            })
        })
            .then(res => res.json())
            .then(json => {
                setI18nTextList(json.data || []);
                localStorageMgr.setItem(ResourceMgr.i18nText, json.data || []); // 儲存到 localStorage
            })
            .catch(err => {
                setI18nTextList([]);
                console.error('API Fetch i18nText 錯誤', err);
            });
    }, []);

    const columns = getColumns(i18nTextList);

    return (
        <>
            <style>
                {`
                    .center-header th {
                        text-align: center !important;
                    }
                `}
            </style>
            <List
                resource={ResourceMgr.categoryOption}
                title="分類項目"
                actions={<ListActions columns={columns} />}
                pagination={<CustomPagination />}
            >
                <DataTable className="center-header" actions={[]} bulkActionButtons={false}>
                    {columns}
                </DataTable>
            </List>
        </>
    );
};

export default CategoryOptionList;

