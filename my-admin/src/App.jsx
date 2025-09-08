// Vite + React 官網範例
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import { Admin, Resource } from 'react-admin';

// 版本號碼
import SettingVersionList from './SettingVersion/SettingVersionList';
import SettingVersionEdit from './SettingVersion/SettingVersionEdit';
import SettingVersionCreate from './SettingVersion/SettingVersionCreate';

// 運動類型
import SportItemList from './SportItem/SportItemList';
import SportItemEdit from './SportItem/SportItemEdit';
import SportItemCreate from './SportItem/SportItemCreate';

// 運動項目
import SportCategoryList from './SportCategory/SportCategoryList';
import SportCategoryEdit from './SportCategory/SportCategoryEdit'; // 因為雙 key 無法修改，所以不提供編輯功能，只能新增與刪除
import SportCategoryCreate from './SportCategory/SportCategoryCreate';

// 分類維度
import CategoryGroupList from './CategoryGroup/CategoryGroupList';
import CategoryGroupEdit from './CategoryGroup/CategoryGroupEdit';
import CategoryGroupCreate from './CategoryGroup/CategoryGroupCreate';

// 分類項目
import CategoryOptionList from './CategoryOption/CategoryOptionList';
import CategoryOptionEdit from './CategoryOption/CategoryOptionEdit';
import CategoryOptionCreate from './CategoryOption/CategoryOptionCreate'

// 多語系文字
import I18nTextList from './I18nText/I18nTextList';
import I18nTextEdit from './I18nText/I18nTextEdit';
import I18nTextCreate from './I18nText/I18nTextCreate';


import { ResourceMgr } from './ResourceMgr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



/** RESTful API dataProvider 實作 */
const dataProvider = {
  getList: async (resource, params) => {
    const route = `${API_BASE_URL}/${resource}/list`;
    const method = 'POST';
    try {
      const response = await fetch(route, {
        method,
        headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
        body: JSON.stringify({
          ...params,
          sort: params.sort, // 確保排序參數有傳遞
          page: params.pagination?.page,
          perPage: params.pagination?.perPage,
        })
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const result = await response.json();
      return {
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      let msg = `API 連線失敗\nRoute: ${route}\nMethod: ${method}`;
      if (error.status) msg += `\nHTTP Code: ${error.status}`;
      msg += `\nError: ${error.message || String(error)}`;
      window.alert(msg);
      throw error;
    }
  },
  getOne: async (resource, params) => {
    const route = `${API_BASE_URL}/${resource}/get`;
    const method = 'POST';
    try {
      const response = await fetch(route, {
        method,
        headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const result = await response.json();
      if (Array.isArray(result.data)) {
        if (result.data.length === 0) {
          throw new Error("getOne: 查無資料（API 回傳空陣列）");
        }
        throw new Error("getOne: 回傳型別錯誤，應為物件而非陣列。請檢查 API 是否誤用 getList 結構。");
      }
      if (!result.data || result.data.id === undefined) {
        throw new Error("getOne: 回傳資料缺少 id 欄位");
      }
      return {
        data: result.data,
      };
    } catch (error) {
      let msg = `API 連線失敗\nRoute: ${route}\nMethod: ${method}`;
      if (error.status) msg += `\nHTTP Code: ${error.status}`;
      msg += `\nError: ${error.message || String(error)}`;
      window.alert(msg);
      throw error;
    }
  },
  create: async (resource, params) => {
    const route = `${API_BASE_URL}/${resource}/create`;
    const method = 'POST';
    try {
      const response = await fetch(route, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'appName': 'ReactAdmin'
        },
        body: JSON.stringify(params.data)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const result = await response.json();
      return {
        data: result.data,
      };
    } catch (error) {
      let msg = `API 連線失敗\nRoute: ${route}\nMethod: ${method}`;
      if (error.status) msg += `\nHTTP Code: ${error.status}`;
      msg += `\nError: ${error.message || String(error)}`;
      window.alert(msg);
      throw error;
    }
  },
  update: async (resource, params) => {
    const route = `${API_BASE_URL}/${resource}/update`;
    const method = 'POST';
    try {
      const response = await fetch(route, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'appName': 'ReactAdmin'
        },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const result = await response.json();
      return {
        data: result.data,
      };
    } catch (error) {
      let msg = `API 連線失敗\nRoute: ${route}\nMethod: ${method}`;
      if (error.status) msg += `\nHTTP Code: ${error.status}`;
      msg += `\nError: ${error.message || String(error)}`;
      window.alert(msg);
      throw error;
    }
  },
  delete: async (resource, params) => {
    const route = `${API_BASE_URL}/${resource}/delete`;
    const method = 'POST';
    try {
      const response = await fetch(route, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'appName': 'ReactAdmin'
        },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const result = await response.json();
      return {
        data: result.data,
      };
    } catch (error) {
      let msg = `API 連線失敗\nRoute: ${route}\nMethod: ${method}`;
      if (error.status) msg += `\nHTTP Code: ${error.status}`;
      msg += `\nError: ${error.message || String(error)}`;
      window.alert(msg);
      throw error;
    }
  },
  deleteMany: async (resource, params) => {
    const route = `${API_BASE_URL}/${resource}/deleteMany`;
    const method = 'POST';
    try {
      const response = await fetch(route, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'appName': 'ReactAdmin'
        },
        body: JSON.stringify({ ids: params.ids })
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const result = await response.json();
      return {
        data: result.data,
      };
    } catch (error) {
      let msg = `API 連線失敗\nRoute: ${route}\nMethod: ${method}`;
      if (error.status) msg += `\nHTTP Code: ${error.status}`;
      msg += `\nError: ${error.message || String(error)}`;
      window.alert(msg);
      throw error;
    }
  },
};


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="admin-wrapper">
        <Admin dataProvider={dataProvider}>
          <Resource
            name={ResourceMgr.settingVersion}
            options={{ label: 'setting_versions' }}
            list={SettingVersionList}
            edit={SettingVersionEdit}
            create={SettingVersionCreate}
          />
          <Resource
            name={ResourceMgr.sportItem}
            options={{ label: 'sport_item' }}
            list={SportItemList}
            edit={SportItemEdit}
            create={SportItemCreate}
          />
          <Resource
            name={ResourceMgr.sportCategory}
            options={{ label: 'sport_category' }}
            list={SportCategoryList}
            edit={SportCategoryEdit}
            create={SportCategoryCreate}
          />
          <Resource
            name={ResourceMgr.categoryGroup}
            options={{ label: 'category_group' }}
            list={CategoryGroupList}
            edit={CategoryGroupEdit}
            create={CategoryGroupCreate}
          />
          <Resource
            name={ResourceMgr.categoryOption}
            options={{ label: 'category_option' }}
            list={CategoryOptionList}
            edit={CategoryOptionEdit}
            create={CategoryOptionCreate}
          />
          <Resource
            name={ResourceMgr.i18nText}
            options={{ label: 'i18n_text' }}
            list={I18nTextList}
            edit={I18nTextEdit}
            create={I18nTextCreate}
          />
        </Admin>
      </div>
      <div className="info-section">
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>React Admin</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
