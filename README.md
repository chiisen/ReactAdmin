# 🚀 React Admin
React Admin 操作紀錄 📝

📖 參考: [React-Admin Tutorial](https://marmelab.com/react-admin/Tutorial.html)  

# 🛠️ Create React Project
[建立 React 專案](./docs/CreateReactProject.md)  

# 📺 Demo
[React Admin 使用 PostList 的 Demo 操作說明](./docs/PostList.md)  

# 🐳 docker-compose.yml
目前 docker-compose.yml 設定容器端口為 80（- "3006:80"），這是 Nginx 服務靜態檔案的預設端口。  
而 launch.json 的 5173 是 Vite 開發伺服器的預設端口，僅用於本地開發，不會出現在 Docker production build。  

簡單說明：  

開發時（Vite）：http://localhost:5173  
Docker production（Nginx）：http://localhost:3006（對應容器內 80）  
如果你要在 Docker 裡直接跑 Vite 開發伺服器，容器端口要設 5173；  
但目前 Dockerfile 是 production build，Nginx 只用 80 埠。  

# ⚠️ 注意事項
## 🔍 getList
在 React Admin 中，[getList](./my-admin/src/App.jsx) API 回傳的每個資料物件都必須有一個唯一的 id 欄位。  
如果你的 API 沒有 id 欄位，可以在 dataProvider 內部做資料轉換，把 API 的主鍵欄位（例如 uuid、_id、key 等）映射成 id。  

## 📮 API 處理方式 (POST ONLY)
App.jsx 中，所有 /list、/get、/create、/update、/delete API 都是用 POST 方法呼叫的，不是用 GET。  
雖然 RESTful 標準通常會用：  

- 📑 `/list`、`/get`：`GET`
- ➕ `/create`：`POST`
- 📝 `/update`：`PUT` 或 `PATCH`
- 🗑️ `/delete`：`DELETE`
但為了統一程式碼全部都用 POST，並且資料都放在 request body。  
這是後端 API 的設計決定，前端只要照這樣呼叫即可。  

## 🌐 伺服器資訊 (235)
目前 API 的 port 為 3005  
### .env
```bash
VITE_API_BASE_URL=http://192.168.1.235:3005
```
前端 port 為 3006  

## 🏃‍♂️ 運動子類別對照表
參考來源: Q:\APP+CLOUD\Ala 共用模組\AlaCenter新版本運動與生活追蹤資料格式V1.6.8.xlsx 的 【運動子類別對照表】  
[SportItemChoices.js](./my-admin/src/SportItem/SportItemChoices.js)  

## ⚡ 快速執行批次檔
正常需要 cd my-admin 進去再執行 npm run dev
現在執行執行下面的批次檔案
```bash
.\run
```

## 🦊 GitLab 遠端同步
```bash
git push gitlab main
```

## 📦 Docker 部署
```bash
docker-compose up --build
```

