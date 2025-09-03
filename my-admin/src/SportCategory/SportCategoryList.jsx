
import { useEffect, useState } from 'react';
import { List, DataTable } from 'react-admin';
import { ResourceMgr } from '../ResourceMgr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SportCategoryList = () => {
    const [sportItemList, setSportItemList] = useState([]);
    const [categoryOptionList, setCategoryOptionList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sportItemResource = ResourceMgr.sportItem;
        const categoryOptionResource = ResourceMgr.categoryOption;

        const fetchSportItems = fetch(`${API_BASE_URL}/${sportItemResource}/list`, {
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
            })
            .catch(err => {
                setSportItemList([]);
                console.error('API Fetch sport items 錯誤', err);
            });

        const fetchCategoryOptions = fetch(`${API_BASE_URL}/${categoryOptionResource}/list`, {
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
            })
            .catch(err => {
                setCategoryOptionList([]);
                console.error('API Fetch category options 錯誤', err);
            });

        Promise.all([fetchSportItems, fetchCategoryOptions]).finally(() => {
            setLoading(false);
        });
    }, []);


    if (loading) return <div>載入中 ...</div>;


    return (
        <List resource={ResourceMgr.sportCategory} title="運動項目">
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="item_id" label="item_id (表:sport_item)" render={record => {
                    let array = sportItemList;
                    if (array && Array.isArray(array)) {
                        const found = array.find(item => item.id === record.item_id);
                        return found ? `${found.id} (${found.dscription || found.description || ''})` : record.item_id;
                    } else {
                        return record.item_id;
                    }
                }}
                />
                <DataTable.Col source="option_id" label="option_id (表:category_option)" render={record => {
                    let array = categoryOptionList;
                    if (array && Array.isArray(array)) {
                        const found = array.find(item => item.id === record.option_id);
                        return found ? `${found.id} (${found.dscription || found.description || ''})` : record.option_id;
                    } else {
                        return record.option_id;
                    }
                }} />
                <DataTable.Col source="updated_at" />
                <DataTable.Col source="created_at" />
            </DataTable>
        </List>
    );
};

export default SportCategoryList;

