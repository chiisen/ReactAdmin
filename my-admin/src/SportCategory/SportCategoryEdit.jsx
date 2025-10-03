import { Edit, SimpleForm, TextInput, FormDataConsumer, Labeled, SelectInput } from 'react-admin';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { localStorageMgr } from '../utils/localStorageMgr';
import { ResourceMgr } from '../ResourceMgr';
import { addI18nText } from '../utils/I18nText';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SportCategoryEdit = (props) => {

    const [sportItems, setSportItems] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [i18nTexts, setI18nTexts] = useState([]);
    const [options, setOptions] = useState([{ id: '', name: 'Loading...' }]);
    const [processedSportItems, setProcessedSportItems] = useState([]);

    // 加載數據到 localStorage，如果沒有
    useEffect(() => {
        const loadData = async () => {
            const lastCall = localStorage.getItem('sportCategoryLastApiCall');
            const delayTime = 5 * 60 * 1000; // 5 分鐘
            if (lastCall && Date.now() - parseInt(lastCall) < delayTime) {
                // 從 localStorage 獲取
                setSportItems(localStorageMgr.getItem(ResourceMgr.sportItem) || []);
                setCategoryOptions(localStorageMgr.getItem(ResourceMgr.categoryOption) || []);
                setI18nTexts(localStorageMgr.getItem(ResourceMgr.i18nText) || []);
                return;
            }

            // 從 API 加載
            const fetchSportItems = fetch(`${API_BASE_URL}/${ResourceMgr.sportItem}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'appName': 'ReactAdmin'
                },
                body: JSON.stringify({
                    pagination: { page: 1, perPage: 1000 }
                })
            })
                .then(res => res.json())
                .then(json => {
                    const data = json.data || [];
                    setSportItems(data);
                    localStorageMgr.setItem(ResourceMgr.sportItem, data);
                })
                .catch(err => {
                    console.error('API Fetch sport items 錯誤', err);
                    setSportItems([]);
                });

            const fetchCategoryOptions = fetch(`${API_BASE_URL}/${ResourceMgr.categoryOption}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'appName': 'ReactAdmin'
                },
                body: JSON.stringify({
                    pagination: { page: 1, perPage: 1000 }
                })
            })
                .then(res => res.json())
                .then(json => {
                    const data = json.data || [];
                    setCategoryOptions(data);
                    localStorageMgr.setItem(ResourceMgr.categoryOption, data);
                })
                .catch(err => {
                    console.error('API Fetch category options 錯誤', err);
                    setCategoryOptions([]);
                });

            const fetchI18nTexts = fetch(`${API_BASE_URL}/${ResourceMgr.i18nText}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'appName': 'ReactAdmin'
                },
                body: JSON.stringify({
                    pagination: { page: 1, perPage: 1000 },
                    filter: { lang: 'zh-TW' }
                })
            })
                .then(res => res.json())
                .then(json => {
                    const data = json.data || [];
                    setI18nTexts(data);
                    localStorageMgr.setItem(ResourceMgr.i18nText, data);
                })
                .catch(err => {
                    console.error('API Fetch i18n texts 錯誤', err);
                    setI18nTexts([]);
                });

            await Promise.all([fetchSportItems, fetchCategoryOptions, fetchI18nTexts]);
            localStorage.setItem('sportCategoryLastApiCall', Date.now().toString());
        };

        loadData();
    }, []);

    useEffect(() => {
        if (sportItems.length > 0 && categoryOptions.length > 0 && i18nTexts.length > 0) {
            const processedSport = addI18nText(sportItems, i18nTexts);
            const processedCategory = addI18nText(categoryOptions, i18nTexts);

            setProcessedSportItems(processedSport);
            setOptions(processedCategory.sort((a, b) => a.id - b.id).map(option => ({
                id: option.id,
                name: `${option.id} (${option.i18nText})`
            })));
        }
    }, [sportItems, categoryOptions, i18nTexts]);


    return (
        <Edit {...props}>
            <SimpleForm>
                <p>item_id 不能修改，只能修改 option_id 和 sort_order </p>
                <TextInput source="id" disabled />
                <FormDataConsumer>
                    {({ formData }) => {
                        const item = processedSportItems.find(item => item.id === formData.item_id);
                        return (
                            <Labeled label="item_id">
                                <Typography>{formData.item_id} ({item ? item.i18nText : ''})</Typography>
                            </Labeled>
                        );
                    }}
                </FormDataConsumer>

                {options.length === 1 && options[0].id === '' ? (
                    <TextInput source="option_id" disabled label="Loading options..." />
                ) : (
                    <SelectInput source="option_id" choices={options} alwaysOn />
                )}

                <TextInput source="sort_order" alwaysOn />
            </SimpleForm>
        </Edit>
    );
};

export default SportCategoryEdit;