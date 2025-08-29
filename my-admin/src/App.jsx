// Vite + React 官網範例
//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'
import { Admin, Resource } from 'react-admin';

// Post 範例
//import PostList from './Post/PostList';
//import PostEdit from './Post/PostEdit';
//import PostCreate from './Post/PostCreate';

import SettingVersionList from './SettingVersion/SettingVersionList';
import SettingVersionEdit from './SettingVersion/SettingVersionEdit';
import SettingVersionCreate from './SettingVersion/SettingVersionCreate';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



// RESTful API dataProvider 實作
const dataProvider = {
  getList: async (resource, params) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        sort: params.sort, // 確保排序參數有傳遞
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
  },
  getOne: async (resource, params) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error: ${response.status} - ${text}`);
    }
    const result = await response.json();
    if (Array.isArray(result.data)) {
      throw new Error("getOne: 回傳型別錯誤，應為物件而非陣列。請檢查 API 是否誤用 getList 結構。");
    }
    if (!result.data || result.data.id === undefined) {
      throw new Error("getOne: 回傳資料缺少 id 欄位");
    }
    return {
      data: result.data,
    };
  },
  create: async (resource, params) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
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
  },
  update: async (resource, params) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
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
  },
  delete: async (resource, params) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
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
  },
  deleteMany: async (resource, params) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/deleteMany`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'appName': 'ReactAdmin' },
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
  },
};


function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <div className="admin-wrapper">
        <Admin dataProvider={dataProvider}>
          {/*
          <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
          />
          */}
          <Resource
            name="settingVersion"
            list={SettingVersionList}
            edit={SettingVersionEdit}
            create={SettingVersionCreate}
          />
        </Admin>
      </div>
      {/*
      <div className="info-section">
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
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
      */}
    </>
  )
}

export default App
