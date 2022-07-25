import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";


const Graph11 = ({data}) => {
const chart = useRef(null);
    useLayoutEffect(() => {
       if (data.length === 0){
         return
       }
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
    let root = am5.Root.new("chartdiv11");
    let finalData = [];
    data.forEach((item, index) => {
    if (item.product_type == "Папка 1С") {
      if (index === 0) {
        finalData.push({
          product_segment: item.product_segment,
          sales: parseInt(item.sales),
        });
        return;
      }
        let found = false;
        let pos = 0;
        finalData.forEach((item2, index2)=>{
        if(item2.product_segment == item.product_segment)
        {
            found = true;
            pos = finalData.indexOf(item2)
            return;
        }
        })
        if (!found) {
        finalData.push({
          product_segment: item.product_segment,
          sales: parseInt(item.sales),
        });
      } else
      {
        finalData[pos].sales += parseInt(item.sales);
      }
}      });

    root.data = finalData;
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
var chart = root.container.children.push(
  am5percent.PieChart.new(root, {
    endAngle: 270
  })
);

// Create series
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
var series = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "sales",
    categoryField: "product_segment",
    endAngle: 270
  })
);

series.states.create("hidden", {
  endAngle: -90
});

// Set data
// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
series.data.setAll(finalData)
series.appear(1000, 100);
}, [data]);
return [<div id="chartdiv11" style={{ width: "40%", height: "400px",right: "1060px",top: "2060px" ,position: "absolute" }} />,
<p style={{width: "50%", height: "00px", top: "2000px",right: "600px", position: "absolute"}}>Продукты "Папка 1С"</p>]}
export default Graph11
