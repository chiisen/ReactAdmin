
import React, { useEffect, useState } from 'react';
import { Create, SimpleForm, SelectInput, TextInput } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';
import { localStorageMgr } from '../utils/localStorageMgr';

const SportCategoryCreate = (props) => {
    const [item_idChoices, setItemIdChoices] = useState([]);
    const [option_idChoices, setOptionIdChoices] = useState([]);

    useEffect(() => {
        const sportItem = localStorageMgr.getItem(ResourceMgr.sportItem) || [];
        const categoryOption = localStorageMgr.getItem(ResourceMgr.categoryOption) || [];

        
        const i18nText = localStorageMgr.getItem(ResourceMgr.i18nText);
        sportItem.forEach(item => {
            const found = i18nText.find(i18n => i18n.key === item.name_key && i18n.lang === 'zh-TW');
            if (found) {
                item.i18nText = found.text;
            } else {
                item.i18nText = item.name_key || '無資料';
            }
        });

        categoryOption.forEach(item => {
            const found = i18nText.find(i18n => i18n.key === item.name_key && i18n.lang === 'zh-TW');
            if (found) {
                item.i18nText = found.text;
            } else {
                item.i18nText = item.name_key || '無資料';
            }
        });


        // 轉換成 { id, name } 格式，或只取 id
        const itemIdArray = sportItem.map(item => ({
            id: item.id,
            name: `${item.id}:${item.i18nText}`
        })).sort((a, b) => a.id - b.id);
        const optionIdArray = categoryOption.map(option => ({
            id: option.id,
            name: `${option.id}:${option.i18nText}`
        })).sort((a, b) => a.id - b.id);
        setItemIdChoices(itemIdArray);
        setOptionIdChoices(optionIdArray);
    }, []);

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