import pullRequestData from "./pullRequestsdata.json" assert { type: "json" };
// import RepositoryData from "./Repositorydata.json" assert { type: "json" };
// import PullReqPieData from "./PullReqPiedata.json" assert { type: "json" };

const pullData = pullRequestData.map(function (data) {
  return { Pull_Requests: data.counter, no_of_days: data.diffInDays };
});
console.log(pullData);

const visdata = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "A simple bar chart with embedded data.",
  data: {
    values: pullRequestData.map(function (data) {
      return { Pull_Requests: data.counter, no_of_days: data.diffInDays };
    }),
  },
  mark: "bar",
  encoding: {
    x: { field: "no_of_days", type: "quantitative" },
    y: { field: "Pull_Requests", type: "nominal", axis: { labelAngle: 0 } },
  },
};

// vegaEmbed("#vis1", visdata);

 const pieChart = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "A simple pie chart with labels.",
//   data: {
//     values: Object.keys(PullReqPieData[0]).map((key) => {
//       const value = PullReqPieData[0][key];
//       console.log(key, value);
//       return { category: key, value: value };
//     }),
//   },
//   encoding: {
//     theta: { field: "value", type: "quantitative", stack: true },
//     color: { field: "category", type: "nominal", legend: null },
//   },
//   layer: [
//     {
//       mark: { type: "arc", outerRadius: 80 },
//     },
//     {
//       mark: { type: "text", radius: 90 },
//       encoding: {
//         text: { field: "category", type: "nominal" },
//       },
//     },
//   ],
// };

// vegaEmbed("#vis2", pieChart);
//