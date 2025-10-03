import React from 'react';
import { CreateButton, TopToolbar, Filter, SelectInput, Button } from 'react-admin';
import { useListContext, useDataProvider } from 'react-admin';
import { languageChoices } from '../utils/languageChoices';
import * as XLSX from 'xlsx';

import { Tooltip } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
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
        <ImportExcelButton columns={columns} />
        {/* 其他按鈕 */}
    </TopToolbar>
);

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
            const languageName = [
                'zh-TW繁體中文',
                'zh-CN簡體中文',
                'en-US英文(美國)',                
                'de-DE德語(德國)',
                'fr-FR法語(法國)',
                'it-IT義語(義大利)',
                'ja-JP日文',
                'es-ES西班牙語(西班牙)',
                'pt-PT葡萄牙語(葡萄牙)'
            ];

            // 語言欄位到 lang 代碼的映射
            const langMap = {
                'zh-TW繁體中文': 'zh-TW',
                'zh-CN簡體中文': 'zh-CN',
                'en-US英文(美國)': 'en-US',
                'de-DE德語(德國)': 'de-DE',
                'fr-FR法語(法國)': 'fr-FR',
                'it-IT義語(義大利)': 'it-IT',
                'ja-JP日文': 'ja-JP',
                'es-ES西班牙語(西班牙)': 'es-ES',
                'pt-PT葡萄牙語(葡萄牙)': 'pt-PT'
            };

            const diffLogs = [];
            excelRows.forEach(excelRow => {
                const excelLinkTypeRaw = excelRow[LinkTypeName];
                if (excelLinkTypeRaw === undefined) return;

                if (excelRow['停用Deactivate']?.trim() === 'Y') {
                    return; // 跳過停用的項目
                }

                const excel_tw = excelRow['zh-TW繁體中文'];

                // 檢查每個語言欄位
                languageName.forEach(langField => {
                    const langCode = langMap[langField];
                    
                    const excel_i18nText = excelRow[langField];
                    if (excel_i18nText) {
                        // 找到對應的 API 資料
                        const apiRow = apiRows.find(a => a.text === excel_i18nText && a.lang === langCode);
                        if (!apiRow) {
                            // Excel 有但 API 沒有，視為差異或新增
                            diffLogs.push({
                                excel_tw: excel_tw,
                                lang: langCode,
                                excel_i18nText: excel_i18nText
                            });
                        }
                    }
                });
            });
            let msg = '';
            if (diffLogs.length === 0) {
                msg += '所有 翻譯 都一致\n';
            } else {
                msg += '翻譯 不一致如下(新增或差異)：\n';
                diffLogs.forEach(log => {
                    msg += `excel_tw: ${log.excel_tw}, lang: ${log.lang}, excel_i18nText: ${log.excel_i18nText}\n`;
                });
            }

            alert(msg);

            // 產生 diff.txt 並自動下載
            const blob = new Blob([msg], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'i18ntext_diff.txt';
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
                    label="Import Excel"
                    startIcon={<GetAppIcon />}
                    variant="text"
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
                />
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
                choices={languageChoices}
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

