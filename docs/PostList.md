# React Admin 使用 PostList 的 Demo 操作說明

## 安裝步驟

1. 安裝必要套件  
在專案根目錄下執行：
```powershell
npm install react-admin ra-data-fakerest
```

2. 新增 `PostList.jsx`  
在 `src` 資料夾下建立 `PostList.jsx`，內容如下：
```jsx
import { List, DataTable } from 'react-admin';

const PostList = () => (
		<List resource="posts">
				<DataTable>
						<DataTable.Col source="id" />
						<DataTable.Col source="title" />
						<DataTable.Col source="body" />
				</DataTable>
		</List>
);

export default PostList;
```

3. 修改 `App.jsx`  
將 `App.jsx` 改為以下內容，加入假資料與 dataProvider：
```jsx
import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';
import PostList from './PostList';

const dataProvider = fakeDataProvider({
	posts: [
		{ id: 1, title: 'Hello', body: 'World' },
		{ id: 2, title: 'Foo', body: 'Bar' },
	],
});

function App() {
	return (
		<Admin dataProvider={dataProvider}>
			<Resource name="posts" list={PostList} />
		</Admin>
	);
}

export default App;
```

4. 啟動專案  
在專案根目錄下執行：
```powershell
npm run dev
```
瀏覽器開啟 http://localhost:5173 即可看到 demo 畫面。

## 注意事項

- 請確認 `react-admin` 版本支援 `DataTable` 元件（建議 v4 以上）。
- 若遇到安裝或啟動錯誤，請檢查 node 版本或提供錯誤訊息協助排除。

---

如需進一步自訂或串接 API，請參考 [react-admin 官方文件](https://marmelab.com/react-admin/)。