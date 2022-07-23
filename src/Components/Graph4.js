import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
const Graph4 = ({data}) => {
  const chart = useRef(null);

  useLayoutEffect(() => {


  if (data.length === 0){
         return
       }
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    let root = am5.Root.new("chartdiv4");
    let finalData = [];
     data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          product_type: item.product_type,
          profit: parseInt(item.profit),
        });
        return;
      }
        let found = false;
        let pos = 0;
        finalData.forEach((item2, index2)=>{
        if(item2.product_type == item.product_type)
        {
            found = true;
            pos = finalData.indexOf(item2)
            return;
        }
        })
        if (!found) {
        finalData.push({
          product_type: item.product_type,
          profit: parseInt(item.profit),
        });
      } else
      {
        finalData[pos].profit += parseInt(item.profit);
      }
      });

    root.data = finalData;
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX"
  })
);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });

var xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "product_type",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  })
);

var yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "profit",
    sequencedInterpolation: true,
    categoryXField: "product_type"
  })
);

series.columns.template.setAll({
  width: am5.percent(120),
  fillOpacity: 0.9,
  strokeOpacity: 0
});
series.columns.template.adapters.add("fill", (fill, target) => {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", (stroke, target) => {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.set("draw", function (display, target) {
  let w = target.getPrivate("width", 0);
  let h = target.getPrivate("height", 0);
  display.moveTo(0, h);
  display.bezierCurveTo(w / 4, h, w / 4, 0, w / 2, 0);
  display.bezierCurveTo(w - w / 4, 0, w - w / 4, h, w, h);
});

// Set data

xAxis.data.setAll(finalData);
series.data.setAll(finalData);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);



  }, [data]);

  return <div id="chartdiv4" style={{ width: "40%", height: "300px" }} />;
};

export default Graph4;