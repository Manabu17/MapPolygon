// script.js
// Google Maps および DrawingManager の初期化や /getApiKey からのキー取得

// グローバル変数
window.map = null;
window.drawingManager = null;
window.selectedPolygon = null;
window.polygonMap = {}; // ポリゴンID -> google.maps.Polygon インスタンス

/**
 * Google Map 初期化関数 (Maps API のコールバック)
 */
function initMap() {
  // マップ作成
  window.map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6895, lng: 139.6917 },
    zoom: 15,
    mapTypeId: "satellite",
  });

  // DrawingManager 設定
  window.drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      editable: true,
      draggable: true,
      fillColor: "yellow",
      strokeColor: "yellow",
    },
  });

  window.drawingManager.setMap(window.map);

  // 新規ポリゴン作成完了時
  google.maps.event.addListener(window.drawingManager, "overlaycomplete", function(event) {
    if (event.type === google.maps.drawing.OverlayType.POLYGON) {
      // Firebase側の savePolygon 関数を呼ぶ
      if (typeof window.savePolygon === "function") {
        window.savePolygon(event.overlay); 
      } else {
        console.error("savePolygon 関数が定義されていません。");
      }
    }
  });

  // マップ初期化後に Firestore から既存ポリゴンを読み込む
  if (typeof window.loadPolygons === "function") {
    window.loadPolygons();
  } else {
    // まだ読み込まれていない場合は再試行
    setTimeout(() => {
      if (typeof window.loadPolygons === "function") {
        window.loadPolygons();
      }
    }, 2000);
  }
}

// --- サーバーから Google Maps APIキーを取得し、Maps JavaScript API を動的に読み込む ---
fetch('/getApiKey')
  .then(response => response.json())
  .then(data => {
    const apiKey = data.apiKey;
    if (!apiKey) throw new Error("APIキーが取得できませんでした。");

    // scriptタグを動的に生成
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing&callback=initMap`;
    script.async = true; 
    script.defer = true;
    document.head.appendChild(script);
  })
  .catch(err => {
    console.error("Google Maps APIキーの取得に失敗:", err);
  });

// initMap をグローバルに登録 (callback=initMap のために必要)
window.initMap = initMap;
