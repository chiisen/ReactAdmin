import React from 'react'; // React 要從 'react' 匯入
import { useListContext, useDataProvider } from 'react-admin';
import { exportWithBOM } from './exportWithBOM';
import Button from '@mui/material/Button';
import GetAppIcon from '@mui/icons-material/GetApp';

/**
 * 自定義匯出按鈕
 * @param {*} param0 
 * @returns 
 */
const CustomExportLabelButton = ({ columns }) => {
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
 * 自定義匯出按鈕
 * @param {*} param0 
 * @returns 
 */
const CustomExportDefaultButton = ({ columns }) => {
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

export { CustomExportLabelButton, CustomExportDefaultButton };


