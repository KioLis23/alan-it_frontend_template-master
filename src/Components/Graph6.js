import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5radar from "@amcharts/amcharts5/radar";
const Graph6 = ({data}) => {

  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv6");
    let finalData = [];

    data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          year: item.year,
          sales: parseInt(item.sales),
        });
        return;
      }
        let found = false;
        let pos = 0;
        finalData.forEach((item2, index2)=>{
        if(item2.year == item.year)
        {
            found = true;
            pos = finalData.indexOf(item2)
            return;
        }
        })
        if (!found) {
        finalData.push({
          year: item.year,
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
var chart = root.container.children.push(am5radar.RadarChart.new(root, {
  panX: true,
  panY: true,
  wheelX: "none",
  wheelY: "none",
  innerRadius:am5.percent(40)
}));

// We don't want zoom-out button to appear while animating, so we hide it
chart.zoomOutButton.set("forceHidden", true);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xRenderer = am5radar.AxisRendererCircular.new(root, {
  minGridDistance: 30
});

xRenderer.grid.template.set("visible", false);

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0.3,
  categoryField: "year",
  renderer: xRenderer
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  min: 0,
  renderer: am5radar.AxisRendererRadial.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "sales",
  categoryXField: "year"
}));

// Rounded corners for columns
series.columns.template.setAll({
  cornerRadius: 5,
  tooltipText:"{categoryX}: {valueY}"
});

// Make each column to be of a different color
series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target ));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target ));
});

// Set data
//var data = [{finalData}];

xAxis.data.setAll(finalData);
series.data.setAll(finalData);

// update data with random values each 1.5 sec
setInterval(function () {
  updateData();
}, 1500)

function updateData() {
  am5.array.each(series.dataItems, function (dataItem) {
    var value = dataItem.get("valueY") + Math.round(Math.random() * 400 - 200);
    if (value < 0) {
      value = 10;
    }
    // both valueY and workingValueY should be changed, we only animate workingValueY
    dataItem.set("valueY", value);
    dataItem.animate({
      key: "valueYWorking",
      to: value,
      duration: 600,
      easing: am5.ease.out(am5.ease.cubic)
    });
  })

  sortCategoryAxis();
}


// Get series item by category
function getSeriesItem(category) {
  for (var i = 0; i < series.dataItems.length; i++) {
    var dataItem = series.dataItems[i];
    if (dataItem.get("categoryX") == category) {
      return dataItem;
    }
  }
}


// Axis sorting
function sortCategoryAxis() {

  // Sort by value
  series.dataItems.sort(function (x, y) {
    return y.get("valueY") - x.get("valueY"); // descending
    //return y.get("valueY") - x.get("valueY"); // ascending
  })

  // Go through each axis item
  am5.array.each(xAxis.dataItems, function (dataItem) {
    // get corresponding series item
    var seriesDataItem = getSeriesItem(dataItem.get("category"));

    if (seriesDataItem) {
      // get index of series data item
      var index = series.dataItems.indexOf(seriesDataItem);
      // calculate delta position
      var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
      // set index to be the same as series data item index
      dataItem.set("index", index);
      // set deltaPosition instanlty
      dataItem.set("deltaPosition", -deltaPosition);
      // animate delta position to 0
      dataItem.animate({
        key: "deltaPosition",
        to: 0,
        duration: 1000,
        easing: am5.ease.out(am5.ease.cubic)
      })
    }
  });

  // Sort axis items by index.
  // This changes the order instantly, but as deltaPosition is set,
  // they keep in the same places and then animate to true positions.
  xAxis.dataItems.sort(function (x, y) {
    return x.get("index") - y.get("index");
  });
}


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);



    chart.current = root;
    return () => {
          root.dispose();
    };
  }, [data]);

  return [<div id="chartdiv6" style={{width: "200%", height: "500px", top: "1500px",right: "-310px", position: "absolute"}} />,
  <p style={{width: "50%", height: "00px", top: "00px",right: "-950px", position: "relative"}}>Диаграмма зависимости области и продажи </p>];
};

export default Graph6;