import React from 'react';
import { CreateButton, TopToolbar, Pagination } from 'react-admin';
import { useListContext, useDataProvider } from 'react-admin';
// Import or define exportWithBOM
import { exportWithBOM } from '../utils/exportWithBOM'; // Adjust the path as needed
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as XLSX from 'xlsx';


import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';
import { link_type_Choices } from './SportItemChoices';
import CustomPagination from '../utils/CustomPagination';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { localStorageMgr } from '../utils/localStorageMgr'

import { addI18nText } from '../utils/I18nText';


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
 * 匯入 Excel 按鈕元件
 * Excel 格式參照(存成 .xlsx 格式): https://docs.google.com/spreadsheets/d/1eQyNQjjV27I1-z6HhP7IL7tb8-h-QsSqxwCSjmMvC80/edit?gid=0#gid=0
 */
const ImportExcelButton = () => {
    const dataProvider = useDataProvider();
    const { resource } = useListContext();
    const inputRef = React.useRef();

    // 取得 API 資料
    const fetchApiData = async () => {
        const { data } = await dataProvider.getList(resource, {
            pagination: { page: 1, perPage: 10000 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
        });
        return data;
    };

    // 解析 Excel 並比對差異
    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // 只比對 "運動類型-apple" sheet，找不到就報錯中止
            const sheetName = workbook.SheetNames.find(name => name === '運動類型-apple');
            if (!sheetName) {
                window.alert('錯誤：找不到 sheet 名稱「運動類型-apple」，請確認檔案內容');
                return;
            }
            const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // 取得 API 資料
            const apiRows = await fetchApiData();

            // 依需求比對 zh-TW繁體中文 與 description
            // excelRows: { 'zh-TW繁體中文', 'Link Type', ... }
            // apiRows: { id, description, link_type, ... }

            // Excel 欄位名稱
            const LinkTypeName = 'Link Type';
            const SportItemName = 'zh-TW繁體中文';

            const diffLogs = [];
            const excelNewLogs = [];
            excelRows.forEach(excelRow => {
                const excelLinkTypeRaw = excelRow[LinkTypeName];
                if (!excelRow[SportItemName] || excelLinkTypeRaw === undefined) return;


                const i18nText = localStorageMgr.getItem(ResourceMgr.i18nText);

                addI18nText(apiRows, i18nText);

                // 找到 description 一樣的 apiRow
                const apiRow = apiRows.find(a => a.i18nText === excelRow[SportItemName]);
                if (apiRow) {
                    // excel_link_type 只取冒號前的數字
                    const excelLinkTypeNum = String(excelLinkTypeRaw).split(':')[0].trim();
                    if (String(excelLinkTypeNum) !== String(apiRow.link_type)) {
                        diffLogs.push({
                            id: apiRow.id,
                            i18nText: apiRow.i18nText,
                            link_type: apiRow.link_type,
                            excel_link_type: excelLinkTypeRaw
                        });
                    }
                } else {
                    // Excel 有但 API 沒有，視為新增
                    excelNewLogs.push({
                        excel_i18nText: excelRow[SportItemName],
                        excel_link_type: excelLinkTypeRaw
                    });
                }
            });
            let msg = '';
            if (diffLogs.length === 0) {
                msg += '所有 Link Type 與 link_type 都一致\n';
            } else {
                msg += 'Link Type 與 link_type 不一致如下：\n';
                diffLogs.forEach(log => {
                    msg += `id: ${log.id}, i18nText: ${log.i18nText}, excel_link_type: ${log.excel_link_type}, api_link_type: ${log.link_type}\n`;
                });
            }
            if (excelNewLogs.length > 0) {
                msg += '\nExcel 新增資料如下：\n';
                excelNewLogs.forEach(log => {
                    msg += `excel_i18nText: ${log.excel_i18nText}, excel_link_type: ${log.excel_link_type}\n`;
                });
            }
            alert(msg);
            // 也可用 console.log(diffLogs, excelNewLogs) 輸出詳細資料
            //console.log('Link Type 差異:', diffLogs);
            //console.log('Excel 新增資料:', excelNewLogs);

            // 產生 diff.txt 並自動下載
            const blob = new Blob([msg], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sport_item_diff.txt';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        };
        reader.readAsArrayBuffer(file);
        // 清空 input 以便重複上傳
        e.target.value = '';
    };

    return (
        <>
            <Tooltip title="匯入 Excel 檔案，檢查檔案與資料庫的設定差異">
                <Button
                    startIcon={<GetAppIcon />}
                    variant="text"
                    color="inherit"
                    size="small"
                    sx={{
                        fontFamily: 'inherit',
                        fontSize: '0.8125rem',
                        textTransform: 'none',
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            boxShadow: 'none',
                        },
                    }}
                    onClick={() => inputRef.current.click()}
                >
                    Import Excel
                </Button>
            </Tooltip>
            <input
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={handleImport}
            />
        </>
    );
};

/**
 * Action 可以決定顯示那些按鈕
 * @param {*} param0 
 * @returns 
 */
const ListActions = ({ columns }) => (
    <TopToolbar>
        <CreateButton />
        <CustomExportButton columns={columns} />
        <ImportExcelButton columns={columns} />
        {/* 其他按鈕 */}
    </TopToolbar>
);

/**
 * 
 * @param {*} i18nTextList 
 * @returns 
 */
const getColumns = (i18nTextList) => [
    <DataTable.Col source="id" key="id" align="right" />,
    <DataTable.Col source="name_key" key="name_key" align="left" />,


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


    <DataTable.Col source="description" key="description" align="left" />,


    <DataTable.Col source="link_type" key="link_type" align="left"
        render={record => {
            const found = link_type_Choices.find(choice => choice.id === String(record.link_type));
            return found ? found.name : record.link_type;
        }}
    />,
    <DataTable.Col source="link_sub_type" key="link_sub_type" align="right" />,
    <DataTable.Col source="updated_at" key="updated_at" align="left" />,
    <DataTable.Col source="created_at" key="created_at" align="left" />,
];


import { useEffect, useRef, useState } from 'react';
const ListContentWithLoading = ({ columns }) => {
    const { isLoading } = useListContext();
    const [showLoading, setShowLoading] = useState(true); // 初始即顯示 loading
    const timerRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            setShowLoading(true);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        } else {
            setShowLoading(false);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isLoading]);

    if (showLoading) {
        return (
            <div
                style={{
                    width: '100%',
                    maxWidth: '900px',
                    margin: '0 auto',
                    minWidth: '300px',
                    minHeight: '300px',
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '1.2rem',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                Loading ...
            </div>
        );
    }
    return <DataTable className="center-header">{columns}</DataTable>;
};

/**
 * 頁面欄位顯示標籤
 * @returns 
 */
const SportItemList = () => {
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
                resource={ResourceMgr.sportItem}
                title="運動類型"
                actions={<ListActions columns={columns} />}
                pagination={<CustomPagination />}
            >
                <ListContentWithLoading columns={columns} />
            </List>
        </>
    );
};

export default SportItemList;

