import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
const Analytics = () => {
  const [chartData, setChartData] = useState([
    { x: new Date("2023-01-01").getTime(), y: 10 },
    { x: new Date("2023-02-01").getTime(), y: 25 },
    { x: new Date("2023-03-01").getTime(), y: 18 },
    { x: new Date("2023-04-01").getTime(), y: 35 },
    { x: new Date("2023-05-01").getTime(), y: 30 },
    { x: new Date("2023-06-01").getTime(), y: 45 },
    { x: new Date("2023-07-01").getTime(), y: 40 },
  ]);

  const barChart = {
    series: [
      {
        name: "Q1 Budget",
        group: "budget",
        data: [44000, 55000, 41000, 67000, 22000],
      },
      {
        name: "Q1 Actual",
        group: "actual",
        data: [48000, 50000, 40000, 65000, 25000],
      },
      {
        name: "Q2 Budget",
        group: "budget",
        data: [13000, 36000, 20000, 8000, 13000],
      },
      {
        name: "Q2 Actual",
        group: "actual",
        data: [20000, 40000, 25000, 10000, 12000],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      dataLabels: {
        formatter: (val) => {
          return val / 1000 + "K";
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: [
          "Online advertising",
          "Sales Training",
          "Print advertising",
          "Catalogs",
          "Meetings",
        ],
        labels: {
          formatter: (val) => {
            return val / 1000 + "K";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: ["#80c7fd", "#008FFB", "#80f1cb", "#00E396"],
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    },
  };

  const chartOptions = {
    series: [
      {
        name: "BMR Records",
        data: chartData,
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "BMR Records Chart",
        align: "left",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Record Count",
        },
      },
      tooltip: {
        shared: false,
      },
    },
  };

  const pieChart = {
    series: [44, 55, 41, 17,58, 15,20,35,54],
    options: {
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  return (
    <div>
      <div id="chart" className="mt-10">
        <ReactApexChart
          options={chartOptions.options}
          series={chartOptions.series}
          type="area"
          height={350}
        />
      </div>
      <div id="chart" className="mt-20">
        <ReactApexChart
          options={barChart.options}
          series={barChart.series}
          type="bar"
          height={350}
        />
      </div>
      <div id="chart" className="mt-20 w-[500px] ">
        <ReactApexChart
          options={pieChart.options}
          series={pieChart.series}
          type="donut"
        />
      </div>
    </div>
  );
};

export default Analytics;
