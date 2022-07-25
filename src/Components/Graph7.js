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
          date: item.year + "-" + item.month + "-" + item.day,
          day: item.day,
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
          date: item.year + "-" + item.month + "-" + item.day,
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

chart.zoomOutButton.set("forceHidden", true);

chart.get("colors").set("step", 2);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  baseInterval: { timeUnit: "day", count: 1 },
  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
  tooltip: am5.Tooltip.new(root, {})
}));


var distanceAxisRenderer = am5xy.AxisRendererY.new(root, {});
distanceAxisRenderer.grid.template.set("forceHidden", true);
var distanceAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: distanceAxisRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

var latitudeAxisRenderer = am5xy.AxisRendererY.new(root, {});
latitudeAxisRenderer.grid.template.set("forceHidden", true);
var latitudeAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: latitudeAxisRenderer,
  forceHidden: true
}));

var durationAxisRenderer = am5xy.AxisRendererY.new(root, {
  opposite: true
});
durationAxisRenderer.grid.template.set("forceHidden", true);
var durationAxis = chart.yAxes.push(am5xy.DurationAxis.new(root, {
  baseUnit:"year",
  renderer: durationAxisRenderer,
  extraMax:0.3
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var distanceSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
  xAxis: xAxis,
  yAxis: distanceAxis,
  valueYField: "profit",
  valueXField: "date",
  tooltip:am5.Tooltip.new(root, {
    labelText:"{valueY} profit"
  })
}));

distanceSeries.data.processor = am5.DataProcessor.new(root, {
  dateFields: ["date"],
  dateFormat: "yyyy-MM-dd"
});

var latitudeSeries = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: latitudeAxis,
  valueYField: "amount",
  valueXField: "date",
  tooltip:am5.Tooltip.new(root, {
    labelText:"amount: {valueY} ({manager})"
  })
}));

latitudeSeries.strokes.template.setAll({ strokeWidth: 2 });

// Add circle bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
latitudeSeries.bullets.push(function() {
  var graphics = am5.Circle.new(root, {
    strokeWidth: 2,
    radius: 5,
    stroke: latitudeSeries.get("stroke"),
    fill: root.interfaceColors.get("background"),
  });

  graphics.adapters.add("radius", function(radius, target) {
    return target.dataItem.dataContext.townSize;
  })

  return am5.Bullet.new(root, {
    sprite: graphics
  });
});

var durationSeries = chart.series.push(am5xy.LineSeries.new(root, {
  xAxis: xAxis,
  yAxis: durationAxis,
  valueYField: "profit",
  valueXField: "date",
  tooltip:am5.Tooltip.new(root, {
    labelText:"sales: {valueY}"
  })
}));

durationSeries.strokes.template.setAll({ strokeWidth: 2 });

// Add circle bullet
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
durationSeries.bullets.push(function() {
  var graphics = am5.Rectangle.new(root, {
    width:10,
    height:10,
    centerX:am5.p50,
    centerY:am5.p50,
    fill: durationSeries.get("stroke")
  });

  return am5.Bullet.new(root, {
    sprite: graphics
  });
});

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis,
  yAxis: distanceAxis
}));



distanceSeries.data.setAll(finalData);
latitudeSeries.data.setAll(finalData);
durationSeries.data.setAll(finalData);
xAxis.data.setAll(finalData);

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
distanceSeries.appear(1000);
chart.appear(1000, 100);
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