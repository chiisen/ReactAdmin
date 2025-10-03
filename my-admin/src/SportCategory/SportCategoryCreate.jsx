
import { useEffect, useState } from 'react';
import { Create, SimpleForm, SelectInput, TextInput } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';
import { localStorageMgr } from '../utils/localStorageMgr';
import { addI18nText } from '../utils/I18nText';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SportCategoryCreate = (props) => {
    const [sportItems, setSportItems] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [i18nTexts, setI18nTexts] = useState([]);
    const [item_idChoices, setItemIdChoices] = useState([]);
    const [option_idChoices, setOptionIdChoices] = useState([]);

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

            // 轉換成 { id, name } 格式，或只取 id
            const itemIdArray = processedSport.map(item => ({
                id: item.id,
                name: `${item.id}:${item.i18nText}`
            })).sort((a, b) => a.id - b.id);
            const optionIdArray = processedCategory.map(option => ({
                id: option.id,
                name: `${option.id}:${option.i18nText}`
            })).sort((a, b) => a.id - b.id);
            setItemIdChoices(itemIdArray);
            setOptionIdChoices(optionIdArray);
        }
    }, [sportItems, categoryOptions, i18nTexts]);

    return (
        <Create {...props}>
            <SimpleForm>
                <p>item_id 必填，必須在 Sport_Item 內有 id</p>
                <SelectInput source="item_id" choices={item_idChoices} />
                <p>option_id 必填</p>
                <SelectInput source="option_id" choices={option_idChoices} />
                <TextInput source="sort_order" />
            </SimpleForm>
        </Create>
    );
};

export default SportCategoryCreate;