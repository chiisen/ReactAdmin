
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
        // 轉換成 { id, name } 格式，或只取 id
        const itemIdArray = sportItem.map(item => ({
            id: item.id,
            name: `${item.id}:${item.description || item.dscription || ''}`
        })).sort((a, b) => a.id - b.id);
        const optionIdArray = categoryOption.map(option => ({
            id: option.id,
            name: `${option.id}:${option.description || option.dscription || ''}`
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