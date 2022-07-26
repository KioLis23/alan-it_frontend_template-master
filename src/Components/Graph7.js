import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const Graph7 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv7");
    let finalData = [];

    data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          manager: item.manager,
          date: item.year + "-" + item.month,
          year: item.year,
          month: item.month,
          sales: parseInt(item.sales),
          amount: parseInt(item.amount),
          profit: parseInt(item.profit)
        });
        return;
      }
        if (
        item.year !== finalData[finalData.length - 1].year ||
        item.month !== finalData[finalData.length - 1].month
      ) {
        finalData.push({
          manager: item.manager,
          date: item.year + "-" + item.month,
          year: item.year,
          month: item.month,
          sales: parseInt(item.sales),
          amount: parseInt(item.amount),
          profit: parseInt(item.profit)
        });
      } else
      {
        finalData[finalData.length - 1].sales += parseInt(item.sales);
        finalData[finalData.length - 1].profit += parseInt(item.profit);
        finalData[finalData.length - 1].amount += parseInt(item.amount);
      }
      });

    root.data = finalData;


root.setThemes([am5themes_Animated.new(root)]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout
  })
);

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set(
  "scrollbarX",
  am5.Scrollbar.new(root, {
    orientation: "horizontal"
  })
);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "date",
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
  })
);

xAxis.data.setAll(finalData);

var yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    min: 0,
    extraMax: 0.1,
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/

var series1 = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    name: "Sales",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "sales",
    categoryXField: "date",
    tooltip:am5.Tooltip.new(root, {
      pointerOrientation:"horizontal",
      labelText:"{name} in {categoryX}: {valueY} {info}"
    })
  })
);

series1.columns.template.setAll({
  tooltipY: am5.percent(10),
  templateField: "columnSettings"
});

series1.data.setAll(finalData);

var series2 = chart.series.push(
  am5xy.LineSeries.new(root, {
    name: "Profit",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "profit",
    categoryXField: "date",
    tooltip:am5.Tooltip.new(root, {
      pointerOrientation:"horizontal",
      labelText:"{name} in {categoryX}: {valueY} {info}"
    })
  })
);

series2.strokes.template.setAll({
  strokeWidth: 3,
  templateField: "strokeSettings"
});


series2.data.setAll(finalData);

series2.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      strokeWidth: 3,
      stroke: series2.get("stroke"),
      radius: 5,
      fill: root.interfaceColors.get("background")
    })
  });
});

chart.set("cursor", am5xy.XYCursor.new(root, {}));

// Add legend
// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
var legend = chart.children.push(
  am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  })
);
legend.data.setAll(chart.series.values);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
series1.appear();
// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
    chart.current = root;
    return () => {
          root.dispose();
    };
  }, [data]);

  return [<div id="chartdiv7" style={{width: "100%", height: "300px", top: "1100px",right: "10px", position: "absolute"}} />,
  <p style={{width: "50%", height: "00px", top: "100px",right: "-250px", position: "relative"}}>Диаграмма профита и продаж </p>];
  }

export default Graph7;