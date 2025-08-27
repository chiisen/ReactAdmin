# React Admin
React Admin  操作紀錄

參考: [React-Admin Tutorial](https://marmelab.com/react-admin/Tutorial.html)

# Create React Project
[建立 React 專案](./docs/CreateReactProject.md)  

# Demo
[React Admin 使用 PostList 的 Demo 操作說明](./docs/PostList.md)  

# docker-compose.yml
目前 docker-compose.yml 設定容器端口為 80（- "3006:80"），這是 Nginx 服務靜態檔案的預設端口。
而 launch.json 的 5173 是 Vite 開發伺服器的預設端口，僅用於本地開發，不會出現在 Docker production build。

簡單說明：

開發時（Vite）：http://localhost:5173
Docker production（Nginx）：http://localhost:3006（對應容器內 80）
如果你要在 Docker 裡直接跑 Vite 開發伺服器，容器端口要設 5173；但目前 Dockerfile 是 production build，Nginx 只用 80 埠。
