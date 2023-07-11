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
建立project ID →
建立fences ID →
建立objects ID →
建立notification ID →
建立alert ID →

---
## 觸發alert的方式
Report service 的 post模式 ，全參數必要

---
##更新日誌

V1.15版 
-暫時解決地點顯示不對的問題
-更新按鈕樣式
-更新圍欄初版使用模式

預計下一版更新
-圍欄與對象的警報追蹤
---
V1.16版 
-整合路線顯示testMapFleet (圍欄、商店以及商店標題、車輛、路線、)
-更變車輛圖示 mdiTruck
-更變商店圖示 mdiMapMarkerRadiusOutline
-更變按鈕數量 (整合為單一按鈕)
-更變圍欄顏色追加邊框 (色調淺藍#61ade0)
-追加車輛違規色碼(數字0為綠色、數字1為紅色)

預計下一版更新
-圍欄與對象的警報追蹤
-警報註冊頁面
-圍欄註冊頁面


