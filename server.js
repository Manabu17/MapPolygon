// server.js
const express = require('express');
const path = require('path');

const app = express();

// ここで一度だけ宣言
// process.env.PORT があればそれを使い、無ければ3000
const PORT = process.env.PORT || 3000;

// 公開フォルダを指定 (publicディレクトリに index.html や script.js を置く)
app.use(express.static(path.join(__dirname, 'public')));

// テスト用: /getApiKey にアクセスすると APIキーをJSONで返す
// ※本番では「リファラ制限」など必須
app.get('/getApiKey', (req, res) => {
  // ここに自身のGoogle Maps APIキーを記載
  const googleMapsApiKey = 'AIzaSyBiuOKh_PSyULKO48_aSdPZfUSTQaJgKPk';
  res.json({ apiKey: googleMapsApiKey });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
