import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';
import PostList from './PostList';
import SettingVersionList from './SettingVersionList';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const dataProvider = fakeDataProvider({
  posts: [
    { id: 1, title: 'Hello', body: 'World' },
    { id: 2, title: 'Foo', body: 'Bar' },
  ],
  settingVersion: [
    { data_type: 'getI18nText', updated_at: '2025-08-26 17:32:58', version: '1.0.1' },
    { data_type: 'getCategoryOptionsList', updated_at: '2025-08-26 17:32:58', version: '1.0.1' },
  ],
});


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
        <Resource name="settingVersion" list={SettingVersionList} />
      </Admin>



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
    </>
  )
}

export default App
