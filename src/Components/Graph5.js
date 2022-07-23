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
var root = am5.Root.new("chartdiv5");
    let finalData = [];
     data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          service: item.service,
          profit: parseInt(item.profit),
        });
        return;
      }
        let found = false;
        let pos = 0;
        finalData.forEach((item2, index2)=>{
        if(item2.service == item.service)
        {
            found = true;
            pos = finalData.indexOf(item2)
            return;
        }
        })
        if (!found) {
        finalData.push({
          service: item.service,
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
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
// start and end angle must be set both for chart and series
var chart = root.container.children.push(am5percent.PieChart.new(root, {
  startAngle: 180,
  endAngle: 360,
  layout: root.verticalLayout,
  innerRadius: am5.percent(50)
}));

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
// start and end angle must be set both for chart and series
var series = chart.series.push(am5percent.PieSeries.new(root, {
  startAngle: 180,
  endAngle: 360,
  valueField: "profit",
  categoryField: "service",
  alignLabels: false
}));

series.states.create("hidden", {
  startAngle: 180,
  endAngle: 180
});

series.slices.template.setAll({
  cornerRadius: 5
});

series.ticks.template.setAll({
  forceHidden: true
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll(finalData);

    return () => {
    };
  }, [data]);

  return <div id="chartdiv5" style={{width: "50%", height: "300px", top: "450px",right: "-110px", position: "absolute"}} />;
};
export default Graph3;