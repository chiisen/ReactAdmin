import React from 'react';
import { CreateButton, TopToolbar } from 'react-admin';
import { useListContext, useDataProvider } from 'react-admin';
// Import or define exportWithBOM
import { exportWithBOM } from '../utils/exportWithBOM'; // Adjust the path as needed
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';


import { useEffect, useState } from 'react';
import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';


import { localStorageMgr } from '../utils/localStorageMgr'
import CustomPagination from '../utils/CustomPagination';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import * as XLSX from 'xlsx';

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
 * 匯入 Excel 按鈕元件
 * Excel 格式參照(存成 .xlsx 格式): https://docs.google.com/spreadsheets/d/1eQyNQjjV27I1-z6HhP7IL7tb8-h-QsSqxwCSjmMvC80/edit?gid=0#gid=0
 */
const ImportExcelButton = ({ categoryOptionList, sportItemList }) => {
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

    /**
     * 更新 API 資料
     * @param {*} diffLogs 
     */
    const updateApiData = async (diffLogs) => {
        await fetch(`${API_BASE_URL}/${ResourceMgr.sportCategory}/updateMany`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appName': 'ReactAdmin'
            },
            body: JSON.stringify({
                ids: diffLogs, // 這裡假設 diffLogs 有 id 欄位
            })
        })
            .then(res => res.json())
            .then(json => {

                console.log('API 更新結果', json);
            })
            .catch(err => {

                console.error('API Fetch sportCategory 錯誤', err);
            });
    };

    /**
     * 解析 Excel 並比對差異
     * @param {*} e 
     * @returns 
     */
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

            // 依需求比對 zh-TW繁體中文 與 Category Option
            // excelRows: { 'zh-TW繁體中文', 'Category Option', ... }
            // apiRows: { id, item_id, option_id, ... }
            const diffLogs = [];
            const excelNewLogs = [];

            // Excel 欄位名稱
            const CategoryOptionName = 'Category Option';
            const SportItemName = 'zh-TW繁體中文';

            excelRows.forEach(excelRow => {
                const excelOptionIdRaw = excelRow[CategoryOptionName];
                const excelItemIdRaw = excelRow[SportItemName];
                if (!excelOptionIdRaw || excelOptionIdRaw === undefined) {
                    //console.warn(`Option: "${CategoryOptionName}" 跳過空白列或缺少必要欄位的列:`, excelRow);
                    //CategoryOptionName 欄位空白就跳過
                    return;
                }
                if (!excelItemIdRaw || excelItemIdRaw === undefined) {
                    console.warn(`Item: "${SportItemName}" 跳過空白列或缺少必要欄位的列:`, excelRow);
                    return;
                }

                const excelSortOrder = excelRow['排序Sort order'] || 0;

                // excelOptionIdRaw 只取描述部分
                const excelOptionIdRawTrimmed = excelOptionIdRaw.trim().split(':')[1]?.trim() || '';

                const excelOptionIdNum = categoryOptionList.find(co => co.i18nText === excelOptionIdRawTrimmed)?.id;
                if (excelOptionIdNum === undefined) {
                    alert(`找不到對應的 Category Option 描述: "${excelOptionIdRawTrimmed}"，請確認資料是否正確`);
                    throw new Error(`找不到對應的 Category Option 描述: "${excelOptionIdRawTrimmed}"，請確認資料是否正確`);
                }
                const apiOptionIdDescription = categoryOptionList.find(si => si.id === excelOptionIdNum)?.i18nText || '無描述';
                if (apiOptionIdDescription === undefined) {
                    alert(`找不到對應的 Category Option ID: "${excelOptionIdNum}"，請確認資料是否正確`);
                    throw new Error(`找不到對應的 Category Option ID: "${excelOptionIdNum}"，請確認資料是否正確`);
                }

                // excelItemIdRaw 只取數字
                const excelItemIdNum = sportItemList.find(si => si.i18nText === excelItemIdRaw)?.id;
                if (excelItemIdNum === undefined) {
                    //console.warn(`找不到對應的 Sport Item 描述: "${excelItemIdRaw}"，請確認資料是否正確`);
                }

                let deactivateStatus = '';
                if (excelRow['停用Deactivate']?.trim() === 'Y') {
                    deactivateStatus = '[❌停用❌] ';
                }

                // 找到 item_id 與 option_id 一樣的 apiRow
                const apiRow_item_id = apiRows.find(a => a.item_id === excelItemIdNum);
                if (apiRow_item_id) {
                    // 通常情況都是 item_id 一樣，但是調整 option_id
                    // 所以先判斷 item_id 一樣的，再來判斷 option_id
                    const apiRow = apiRows.find(a => a.item_id === excelItemIdNum && a.option_id === excelOptionIdNum && a.sort_order === excelSortOrder);
                    if (!apiRow) {
                        // 如果 Excel 標記為停用，則不檢查差異
                        if (deactivateStatus === '[❌停用❌] ') {
                            return;
                        }
                        else {
                            // item_id 一樣，但 option_id 不一樣，視為差異
                            diffLogs.push({
                                api_id: apiRow_item_id.id,
                                api_option_id: apiRow_item_id.option_id,
                                api_option_id_description: apiOptionIdDescription,
                                excel_option_id: excelOptionIdNum,
                                excel_option_id_description: excelOptionIdRaw,
                                excel_item_id: excelItemIdNum,
                                excel_item_id_description: deactivateStatus + excelItemIdRaw,
                                api_sort_order: apiRow_item_id.sort_order,
                                excel_sort_order: excelSortOrder,
                            });
                        }
                    }
                    else {
                        // 完全一樣，不處理
                        if (deactivateStatus === '[❌停用❌] ') {
                            // 如果 Excel 標記為停用，但 API 資料沒有停用，則視為差異
                            diffLogs.push({
                                api_id: apiRow.id,
                                api_option_id: apiRow.option_id,
                                api_option_id_description: apiOptionIdDescription,
                                excel_option_id: excelOptionIdNum,
                                excel_option_id_description: excelOptionIdRaw,
                                excel_item_id: excelItemIdNum,
                                excel_item_id_description: deactivateStatus + excelItemIdRaw,
                                api_sort_order: apiRow_item_id.sort_order,
                                excel_sort_order: excelSortOrder,
                            });
                        }
                    }
                } else {
                    // Excel 有但 API 沒有，視為新增
                    if (deactivateStatus === '[❌停用❌] ') {
                        // 如果 Excel 標記為停用，則不視為新增
                        return;
                    }
                    else {
                        let itemId = excelItemIdNum;
                        if (itemId === undefined) {
                            itemId = "🚫未建立🚫";
                        }
                        excelNewLogs.push({
                            excel_option_id: excelOptionIdNum,
                            excel_option_id_description: excelOptionIdRaw,
                            excel_item_id: itemId,
                            excel_item_id_description: excelItemIdRaw,
                            excel_sort_order: excelSortOrder,
                        });
                    }
                }
            });
            let msg = '';
            if (diffLogs.length === 0) {
                msg += '所有 option_id 與 item_id 都一致\n';
            } else {
                msg += 'option_id 與 item_id 不一致如下(已修正)：\n';
                diffLogs.forEach(log => {
                    msg += `
api| id: ${log.api_id},
excel| item_id: ${log.excel_item_id}(${log.excel_item_id_description}), 
api| option_id: ${log.api_option_id}(${log.api_option_id_description}), 
excel| option_id: ${log.excel_option_id}(${log.excel_option_id_description}), 
api| sort_order: ${log.api_sort_order},
excel| sort_order: ${log.excel_sort_order}
\n`;
                });

                // 更新 API 資料
                updateApiData(diffLogs);
            }
            if (excelNewLogs.length > 0) {
                msg += '\nExcel 新增資料如下：\n';
                excelNewLogs.forEach(log => {
                    msg += `
excel| item_id: ${log.excel_item_id}(${log.excel_item_id_description}), 
excel| option_id: ${log.excel_option_id}(${log.excel_option_id_description}), 
excel| sort_order: ${log.excel_sort_order}
\n`;
                });

                // 呼叫 Create API

            }
            alert(msg);
            // 也可用 console.log(diffLogs, excelNewLogs) 輸出詳細資料
            //console.log('item_id && option_id 差異:', diffLogs);
            //console.log('Excel 新增資料:', excelNewLogs);

            // 產生 diff.txt 並自動下載
            const blob = new Blob([msg], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sport_category_diff.txt';
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
 * 自定義列表頁面頂部按鈕
 * @param {*} param0 
 * @returns 
 */
const ListActions = ({ columns, categoryOptionList, sportItemList }) => (
    <TopToolbar>
        <CreateButton />
        <CustomExportButton columns={columns} />
        <ImportExcelButton columns={columns} categoryOptionList={categoryOptionList} sportItemList={sportItemList} />
        {/* 其他按鈕 */}
    </TopToolbar>
);

/**
 * 
 * @param {*} sportItemList 
 * @param {*} categoryOptionList 
 * @returns 
 */
const getColumns = (sportItemList, categoryOptionList) => [
    <DataTable.Col source="id" align="right" />,
    <DataTable.Col source="item_id" label="item_id (表:sport_item)" align="left"
        render={record => {
            let array = sportItemList;
            if (array && Array.isArray(array)) {
                const found = array.find(item => item.id === record.item_id);
                return found ? `${found.id} (${found.i18nText || found.i18nText || ''})` : record.item_id;
            } else {
                return record.item_id;
            }
        }}
    />,
    <DataTable.Col source="option_id" label="option_id (表:category_option)" align="left" render={record => {
        let array = categoryOptionList;
        if (array && Array.isArray(array)) {
            const found = array.find(item => item.id === record.option_id);
            return found ? `${found.id} (${found.i18nText || found.i18nText || ''})` : record.option_id;
        } else {
            return record.option_id;
        }
    }} />,
    <DataTable.Col source="sort_order" align="right" />,
    <DataTable.Col source="updated_at" align="left" />,
    <DataTable.Col source="created_at" align="left" />,
];

/**
 * 頁面欄位顯示標籤
 * @returns 
 */
const SportCategoryList = () => {
    const [sportItemList, setSportItemList] = useState([]);
    const [categoryOptionList, setCategoryOptionList] = useState([]);
    const [i18nTextList, setI18nTextList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const lastCall = localStorage.getItem('sportCategoryLastApiCall');
        const delayTime = 1;// 5 * 60 * 1000
        if (lastCall && Date.now() - parseInt(lastCall) < delayTime) {
            // 五分鐘內，從 localStorage 獲取數據，避免重複呼叫 API
            const sportItems = localStorageMgr.getItem(ResourceMgr.sportItem) || [];
            const categoryOptions = localStorageMgr.getItem(ResourceMgr.categoryOption) || [];
            const i18nTexts = localStorageMgr.getItem(ResourceMgr.i18nText) || [];
            setSportItemList(sportItems);
            setCategoryOptionList(categoryOptions);
            setI18nTextList(i18nTexts);
            setLoading(false);
            return;
        }

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

        const fetchi18nTexts = fetch(`${API_BASE_URL}/${ResourceMgr.i18nText}/list`, {
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
                console.error('API Fetch i18n texts 錯誤', err);
            });

        Promise.all([fetchSportItems, fetchCategoryOptions, fetchi18nTexts]).finally(() => {
            // 記錄 API 呼叫時間
            localStorage.setItem('sportCategoryLastApiCall', Date.now().toString());
            // loading 最少顯示 0.001 秒
            setTimeout(() => {
                setLoading(false);
            }, 1);
        });

    }, []);


    const i18nText = localStorageMgr.getItem(ResourceMgr.i18nText);
    categoryOptionList.forEach(row => {
        const found = i18nText.find(i18n => i18n.key === row.name_key && i18n.lang === 'zh-TW');
        if (found) {
            row.i18nText = found.text;
        } else {
            row.i18nText = row.name_key || '無資料';
        }
    });

    sportItemList.forEach(row => {
        const found = i18nText.find(i18n => i18n.key === row.name_key && i18n.lang === 'zh-TW');
        if (found) {
            row.i18nText = found.text;
        } else {
            row.i18nText = row.name_key || '無資料';
        }
    });


    const columns = getColumns(sportItemList, categoryOptionList, i18nTextList);

    // 新增一個包裝元件，根據 loading 狀態顯示提示
    const ListContentWithLoading = ({ columns }) => {
        const { isLoading } = useListContext();
        if (isLoading) {
            return <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading...</div>;
        }
        return <DataTable className="center-header">{columns}</DataTable>;
    };

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
                resource={ResourceMgr.sportCategory}
                title="運動項目"
                actions={<ListActions columns={columns} categoryOptionList={categoryOptionList} sportItemList={sportItemList} i18nTextList={i18nTextList} />}
                pagination={<CustomPagination />}
            >
                {loading ? (
                    <div
                        style={{
                            width: '100%',
                            minWidth: '300px',
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#888',
                            fontSize: '1.2rem',
                            boxSizing: 'border-box',
                        }}
                    >
                        Loading ...
                    </div>
                ) : (
                    <DataTable className="center-header">
                        {columns.map((col, idx) => React.cloneElement(col, { key: `${col.props.source || idx}` }))}
                    </DataTable>
                )}
            </List>
        </>
    );
};

export default SportCategoryList;

