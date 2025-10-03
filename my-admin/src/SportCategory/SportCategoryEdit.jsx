import { Edit, SimpleForm, TextInput, FormDataConsumer, Labeled, SelectInput } from 'react-admin';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { localStorageMgr } from '../utils/localStorageMgr';
import { ResourceMgr } from '../ResourceMgr';
import { useMemo } from 'react';

const SportCategoryEdit = (props) => {

    // 如果沒有緩存，則從 localStorage 獲取
    const sportItems = useMemo(() => localStorageMgr.getItem(ResourceMgr.sportItem) || [], []);
    const categoryOptions = useMemo(() => localStorageMgr.getItem(ResourceMgr.categoryOption) || [], []);

    const [processedSportItems, setProcessedSportItems] = useState([]);
    const [processedCategoryOptions, setProcessedCategoryOptions] = useState([]);

    useEffect(() => {

        // 處理 i18nText
        const i18nText = localStorageMgr.getItem(ResourceMgr.i18nText);

        const processedSport = sportItems.map(row => {
            const found = i18nText.find(i18n => i18n.key === row.name_key && i18n.lang === 'zh-TW');
            return {
                ...row,
                i18nText: found ? found.text : row.name_key || '無資料'
            };
        });

        const processedCategory = categoryOptions.map(row => {
            const found = i18nText.find(i18n => i18n.key === row.name_key && i18n.lang === 'zh-TW');
            return {
                ...row,
                i18nText: found ? found.text : row.name_key || '無資料'
            };
        });

        setProcessedSportItems(processedSport);
        setProcessedCategoryOptions(processedCategory);

    }, [sportItems, categoryOptions]);


    const categoryOptionChoices = useMemo(() => {
        return processedCategoryOptions.map(option => ({
            id: option.id,
            name: `${option.id} (${option.i18nText})`
        }));
    }, [processedCategoryOptions]);


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

                <SelectInput source="option_id" choices={categoryOptionChoices} alwaysOn />

                <TextInput source="sort_order" alwaysOn />
            </SimpleForm>
        </Edit>
    );
};

export default SportCategoryEdit;