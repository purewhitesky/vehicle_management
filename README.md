# Tailwindcss & Vite

- **template of:** vite + vue
- **tailwindcss:** v3.x

## Started
```bash
npm install
```

---
## Develop
```bash
npm run dev
```

---
## Build
```bash
npm run build
```

---
## 創建docker副本
```bash
npm run build
docker build -t vuedocker{Version} .
```

---
## 保存docker副本
```bash
docker save -o vuedocker{Version}.tar vuedocker{Version}
```

---
## 測試docker副本
```bash
docker run -it -p 3000:80  vuedocker{Version}
```

---
<p align="center">
<img src="./powered-by-vitawind-bright.png">
</p>

## TOMTOM API
```bash
import {} from "@/api/apiTomtom"
```

---
## 流程
建立project ID
建立fences ID
建立objects ID
建立notification ID
建立alert ID

---
## 觸發alert的方式
Report service 的 post模式 ，全參數必要
