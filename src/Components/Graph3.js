import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
const Graph3 = ({data}) => {
  const chart = useRef(null);

  useLayoutEffect(() => {


  if (data.length === 0){
         return
       }
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    let root = am5.Root.new("chartdiv3");
    let finalData = [];
           data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          region: item.region,
          sales: parseInt(item.sales),
        });
        return;
      }
        let found = false;
        let pos = 0;
        finalData.forEach((item2, index2)=>{
        if(item2.region == item.region)
        {
            found = true;
            pos = finalData.indexOf(item2)
            return;
        }
        })
        if (!found) {
        finalData.push({
          region: item.region,
          sales: parseInt(item.sales),
        });
      } else
      {
        finalData[pos].sales += parseInt(item.sales);
      }
      });
    root.data = finalData;

 var chart = root.container.children.push(am5percent.PieChart.new(root, {
  layout: root.verticalLayout,
  innerRadius: am5.percent(70)
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
var series = chart.series.push(am5percent.PieSeries.new(root, {
  valueField: "sales",
  categoryField: "region",
  alignLabels: false
}));

series.labels.template.setAll({
  textType: "circular",
  centerX: 0,
  centerY: 0
});


// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll(finalData);


// Create legend
// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
var legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.percent(50),
  x: am5.percent(50),
  marginTop: 15,
  marginBottom: 15,
}));

legend.data.setAll(series.dataItems);


// Play initial series animation
// https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
series.appear(1000, 100);
    return () => {
    };
  }, [data]);

  return <div id="chartdiv3" style={{ width: "80%", height: "400px", right: "20px", position: "absolute" }} />;
};
export default Graph3;