import pullRequestData from "./pullRequestsdata.json" assert { type: "json" };
console.log(pullRequestData);
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

vegaEmbed("#vis1", visdata);
