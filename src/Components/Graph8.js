import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph8 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv8");
    let finalData = [];

    data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          manager: item.manager,
          profit: parseInt(item.profit),
          amount: parseInt(item.amount),
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
          profit: parseInt(item.profit),
          amount: parseInt(item.amount),
          sales: parseInt(item.sales),
        });
      } else
      {
        finalData[pos].amount += parseInt(item.amount);
        finalData[pos].profit += parseInt(item.profit);
        finalData[pos].sales += parseInt(item.sales);
      }
      });

    root.data = finalData;

root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: true,
  panY: true,
  wheelY: "zoomXY",
  pinchZoomX:true,
  pinchZoomY:true
}));

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series0 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "profit",
  valueXField: "amount",
  tooltip: am5.Tooltip.new(root, {
    labelText: "Менеджер: {manager}, Профит: {profit}, Количество: {amount}"
  })
}));


// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
series0.bullets.push(function() {
  var graphics = am5.Triangle.new(root, {
    fill: series0.get("fill"),
    width: 15,
    height: 13
  });
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});


// Create second series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series1 = chart.series.push(am5xy.LineSeries.new(root, {
  calculateAggregates: true,
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "sales",
  valueXField: "amount",
  tooltip: am5.Tooltip.new(root, {
     labelText: "Менеджер: {manager}, Продажи: {sales}, Количество: {amount}"
  })
}));

series0.strokes.template.set("strokeOpacity", 0);
series1.strokes.template.set("strokeOpacity", 0);

// Add bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
series1.bullets.push(function() {
  var graphics = am5.Triangle.new(root, {
    fill: series1.get("fill"),
    width: 15,
    height: 13,
    rotation: 180
  });
  return am5.Bullet.new(root, {
    sprite: graphics
  });
});

// trend series
var trendSeries0 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "profit",
  valueXField: "amount",
  stroke: series0.get("stroke")
}));

trendSeries0.data.setAll(finalData)

var trendSeries1 = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "sales",
  valueXField: "amount",
  stroke: series1.get("stroke")
}));

trendSeries1.data.setAll(finalData)

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  yAxis: yAxis,
  snapToSeries: [series0, series1]
}));

// Add scrollbars
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));

chart.set("scrollbarY", am5.Scrollbar.new(root, {
  orientation: "vertical"
}));

series0.data.setAll(finalData);
series1.data.setAll(finalData);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series0.appear(1000);
series1.appear(1000);

trendSeries0.appear(1000);
trendSeries1.appear(1000);

chart.appear(1000, 100);
    chart.current = root;
    return () => {
          root.dispose();
    };
  }, [data]);

  return [<div id="chartdiv8" style={{width: "60%", height: "500px", top: "1450px",right: "50px",position: "absolute"}} />,
  <p style={{width: "50%", height: "00px", top: "1420px",right: "-250px", position: "absolute"}}>Диаграмма зависимости менеджеров, продаж и прибыли </p>];
};

export default Graph8;