import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph1 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv1");
    let finalData = [];

    data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          manager: item.manager,
          sales: parseInt(item.sales),
        });
        return;
      }
        let found = false;
        let pos = 0;
        finalData.forEach((item2, index2)=>{
        if(item2.manager == item.manager)
        {
            found = true;
            pos = finalData.indexOf(item2)
            return;
        }
        })
        if (!found) {
        finalData.push({
          manager: item.manager,
          sales: parseInt(item.sales),
        });
      } else
      {
        finalData[pos].sales += parseInt(item.sales);
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
let chart = root.container.children.push(am5xy.XYChart.new(root, {}));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 20 });
xRenderer.labels.template.setAll({
  rotation: 90,
  centerY: am5.p50,
  centerX: am5.p100,
  paddingRight: 15
});

let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "manager",
    maxDeviation: 0.3,
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
let series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "sales",
  sequencedInterpolation: true,
  categoryXField: "manager",
  tooltip: am5.Tooltip.new(root, {
    labelText:"{valueY}"
  })
}));

series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
series.columns.template.adapters.add("fill", function(fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function(stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

xAxis.data.setAll(finalData);
series.data.setAll(finalData);
series.appear(1000);
chart.appear(1000, 100);
// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    chart.current = root;
    return () => {
          root.dispose();
    };
  }, [data]);

  return <div id="chartdiv1" style={{width: "40%", height: "300px", top: "50px",right: "50px",position: "absolute"}} />;
};

export default Graph1;