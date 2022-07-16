import pullReqForRepoDateRange from "./data/pullReqForRepoDateRange.json" assert { type: "json" };
// import issueDataForRepoDateRange from "./data/issuesDataForRepoDateRange.json" assert { type: "json" };

// import issueClosedForRepoDateRange from "./data/issueClosedForRepoDateRange.json" assert { type: "json" };
// import noOfcommitsForRepoDateRange from "./data/noOfCommitsForRepoDateRange.json" assert { type: "json" };
// import pullReqDataForRepoDateRange from "./data/PullReqDataForRepoDateRange.json" assert { type: "json" };
// import topicData from "./data/topicData.json" assert { type: "json" };
// import allReposData from "./data/allReposData.json" assert { type: "json" };

const pullReqAuthor = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Authors of Closed Pull Requests based on Given time range",
  title: "Authors of Closed Pull Requests based on Given time range",
  width: 500,
  height: 500,
  data: {
    values: pullReqForRepoDateRange["make-a-vis"],
  },
  mark: "bar",
  encoding: {
    x: { field: "Pullreq", type: "quantitative" },
    y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
    color: { field: "name" },
  },
};

vegaEmbed("#vis1", pullReqAuthor);

// const IssuesClosedbyPerson = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "Issues closed by a person based on Given time range",
//   title: "Issues closed by a person based on Given time range",
//   width: 500,
//   height: 500,
//   data: {
//     values: issueClosedForRepoDateRange,
//   },
//   mark: "bar",
//   encoding: {
//     x: { field: "issuesClosed", type: "quantitative" },
//     y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
//     color: { field: "name" },
//   },
// };

// vegaEmbed("#vis2", IssuesClosedbyPerson);

// const CommitsbyPerson = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "Issues closed by a person based on Given time range",
//   title: "Commits done by a person based on Given time range",
//   width: 500,
//   height: 500,
//   data: {
//     values: noOfcommitsForRepoDateRange,
//   },
//   mark: "bar",
//   encoding: {
//     x: { field: "noOfCommits", type: "quantitative" },
//     y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
//     color: { field: "name" },
//   },
// };

// vegaEmbed("#vis3", CommitsbyPerson);

// const issuesInRepo = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "No of Issues in the repo for a given range",
//   title: "No of Issues in the repo for a given range",
//   width: 500,
//   height: 500,
//   data: {
//     values: issueDataForRepoDateRange,
//   },
//   mark: "bar",
//   encoding: {
//     x: { field: "count", type: "quantitative" },
//     y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
//     color: { field: "name" },
//   },
// };

// vegaEmbed("#vis4", issuesInRepo);

// const PullReqInRepo = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "No of Pull Requests in the repo for a given range",
//   title: "No of Pull Requests in the repo for a given range",
//   width: 500,
//   height: 500,
//   data: {
//     values: pullReqDataForRepoDateRange,
//   },
//   mark: "bar",
//   encoding: {
//     x: { field: "pullReqCount", type: "quantitative" },
//     y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
//     color: { field: "name" },
//   },
// };

// vegaEmbed("#vis5", PullReqInRepo);

// const pieChart = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "A simple pie chart with labels.",
//   width: 500,
//   height: 500,
//   data: {
//     values: pullReqDataForRepoDateRange,
//   },
//   encoding: {
//     theta: { field: "pullReqCount", type: "quantitative", stack: true },
//     color: { field: "name", type: "nominal", legend: null },
//     fill: { field: "name" },
//   },
//   layer: [
//     {
//       mark: { type: "arc", outerRadius: 80 },
//     },
//     {
//       mark: { type: "text", radius: 90 },
//       encoding: {
//         text: { field: "name", type: "nominal" },
//       },
//     },
//   ],
// };

// vegaEmbed("#vis6", pieChart);

// const topicsData = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description:
//     "Reposiories Filtered by Topics and showing results of no of Issues and pull requests",
//   title:
//     "Reposiories Filtered by Topics and showing results of no of Issues and pull requests",
//   width: 500,
//   height: 500,
//   data: {
//     values: topicData,
//   },
//   repeat: {
//     layer: [
//       "openIssue",
//       "closedIssue",
//       "openPullreq",
//       "closedPullreq",
//       "mergedPullreq",
//     ],
//   },
//   spec: {
//     mark: "bar",
//     encoding: {
//       y: {
//         field: "name",
//         type: "nominal",
//         title: "Repositories",
//       },
//       x: {
//         field: { repeat: "layer" },
//         type: "quantitative",
//         title: "value",
//       },
//       color: { datum: { repeat: "layer" }, title: "Gross" },
//       yOffset: { datum: { repeat: "layer" } },
//     },
//   },
//   config: {
//     mark: { invalid: null },
//   },
// };

// vegaEmbed("#vis7", topicsData);

// const allRepositoryData = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: " showing results of Across all repos",
//   title: "showing results of Across all repos",

//   data: {
//     values: allReposData,
//   },
//   repeat: {
//     layer: [
//       "openIssue",
//       "closedIssue",
//       "openPullreq",
//       "closedPullreq",
//       "mergedPullreq",
//     ],
//   },
//   spec: {
//     mark: "bar",
//     encoding: {
//       y: {
//         field: "name",
//         type: "nominal",
//         title: "Repositories",
//       },
//       x: {
//         field: { repeat: "layer" },
//         type: "quantitative",
//         title: "value",
//       },
//       color: { datum: { repeat: "layer" }, title: "Gross" },
//       yOffset: { datum: { repeat: "layer" } },
//     },
//   },
//   config: {
//     mark: { invalid: null },
//   },
// };

// vegaEmbed("#vis8", allRepositoryData);
