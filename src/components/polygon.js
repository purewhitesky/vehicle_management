import { ref } from "vue";

//存檔名稱
const saveRouteName = ref([]);
//設定取樣
const setSamplingPoint = ref(20);
//=============================================================================
const seeItinerary = ref([]);
const seeItineraryData = ref([]);
const seeItineraryLengthLabel = ref();

export function usePolygon(features, dataIndex, radius, map) {
  seeItinerary.value = [];
  seeItineraryLengthLabel.value = "";
  seeItineraryData.value = features.itineraryData[0].geometry.coordinates;
  seeItineraryLengthLabel.value = seeItineraryData.value.length;

  for (let i = 0; i < seeItineraryLengthLabel.value; i++) {
    //console.log(seeItineraryData.value[i]);
    if (seeItineraryData.value[i].length > 100) {
      for (
        let j = 0;
        j < seeItineraryData.value[i].length / setSamplingPoint.value;
        j++
      ) {
        seeItinerary.value.push(
          seeItineraryData.value[i][j * setSamplingPoint.value]
        );
      }
    } else {
      for (let j = 0; j < seeItineraryData.value[i].length; j++) {
        seeItinerary.value.push(seeItineraryData.value[i][j]);
      }
    }
  }

  //存儲刪除變數檔
  saveRouteName.value.push([dataIndex + "_line", dataIndex + "_fill"]);
  //設定檔
  const turfOptions = {
    units: "meters",
  };
  //資料檔

  const geometry = {
    type: "LineString",
    shapeType: "Corridor",
    radius: radius,
    coordinates: seeItinerary.value,
  };
  //轉換點成範圍點
  const geoJsonData = turf.buffer(geometry, geometry.radius, turfOptions);

  //亂數顯示路線顏色
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;

  //路線生成

  map.addLayer({
    id: dataIndex + "_line",
    type: "line",
    source: {
      type: "geojson",
      data: features.itineraryData[0], //geojson的資料
    },
    paint: {
      "line-color": `#${randomNumber}`,
      "line-width": 1,
      "line-opacity": 1,
    },
  });
  //圍欄生成
  map.addLayer({
    id: dataIndex + "_fill",
    type: "fill",
    source: {
      type: "geojson",
      data: geoJsonData, //geojson的資料
    },
    layout: {},
    paint: {
      "fill-color": `#${randomNumber}`,
      "fill-opacity": 0.2,
    },
  });
}

export function useRemoveRoutes(RouteArr, map) {
  console.log(RouteArr);
  for (let i = 0; i < RouteArr.length; i++) {
    console.log(RouteArr[i]);
    map.removeLayer(RouteArr[i][0]);
    map.removeSource(RouteArr[i][0]);
    map.removeLayer(RouteArr[i][1]);
    map.removeSource(RouteArr[i][1]);
  }
  saveRouteName.value = [];
}
