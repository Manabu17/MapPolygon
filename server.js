// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// "public" フォルダを静的ファイルとして配信
app.use(express.static(path.join(__dirname, 'public')));

// ※ /getApiKey は削除。HTMLに直接キーを書き込むため不要。

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
