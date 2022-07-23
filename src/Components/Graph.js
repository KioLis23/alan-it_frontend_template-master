import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

const Graph = ({ data }) => {
  const chart = useRef(null);

  useLayoutEffect(() => {
    let x = am4core.create("chartdiv", am4charts.XYChart);

    x.paddingRight = 250;

    let finalData = [];

    data.splice(1, 1);
    data.forEach((item, index) => {
      if (index === 0) {
        finalData.push({
          date: item.year + "-" + item.month,
          year: item.year,
          month: item.month,
          sales: parseInt(item.sales),
        });
        return;
      }
      if (
        item.year !== finalData[finalData.length - 1].year ||
        item.month !== finalData[finalData.length - 1].month
      ) {
        finalData.push({
          date: item.year + "-" + item.month,
          year: item.year,
          month: item.month,
          sales: parseInt(item.sales),
        });
      } else {
        finalData[finalData.length - 1].sales += parseInt(item.sales);
      }
    });

    x.data = finalData;

    let dateAxis = x.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = x.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "sales";
    series.tooltipText = "{valueY}";
    x.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    x.scrollbarX = scrollbarX;

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [data]);

  return [<div id="chartdiv" style={{ width: "70%", height: "300px", }} />]

};

export default Graph;
