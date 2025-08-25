# ReactAdmin
React Admin

# 安裝
選擇一個存在且支援 React 17 的版本
例如，ra-data-simple-rest@3.19.5 常用於 React 17 專案：
```bash
npm install ra-data-simple-rest@3.19.5 react-admin@3.19.12
```
安裝已經成功完成，沒有錯誤，只是有警告：
@material-ui/styles@4.11.5 和 @material-ui/core@4.12.4 已經停止維護，建議未來升級到 Material UI v5。
這些只是警告（WARN），不會影響目前專案運作。你可以繼續開發，未來有需要再考慮升級 Material UI 套件。

# 安裝所有依賴套件
```bash
npm install
```
# 模擬 API Server
建立 Json 檔案 db.json
```json
{
    "posts": [
        {
            "id": 1,
            "title": "Hello World",
            "body": "This is my first post."
        },
        {
            "id": 2,
            "title": "React Admin 101",
            "body": "Learn the basics of React Admin."
        }
    ]
}
```
執行 json-server
```bash
npx json-server --watch db.json --port 3001
```

# 啟動
請在 package.json 加入 scripts 欄位，例如：
```bash
{
  "dependencies": {
    "ra-data-simple-rest": "^3.19.5",
    "react-admin": "^3.19.12"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
```
如果你沒有安裝 react-scripts，請先執行：
```bash
npm install react-scripts
```
然後再執行：
```bash
npm start
```
