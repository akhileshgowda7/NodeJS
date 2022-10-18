import { readAllFiles, readFile } from "./readFiles.js";

// setting directory paths
const directoryPaths = [
  "../data/summaryData/commonOrgReposData.json",
  "../data/summaryData/commonOrgAuthorsData.json",
  "../data/dates.json",
  "../data/summaryData/top5Repos.json",
  "../data/summaryData/Last5Repos.json",
  "../data/summaryData/top5Authors.json",
  "../data/summaryData/last5Authors.json",
  "../data/orgs.json",
];

//creating an object to store all the files read
const db = await readAllFiles(directoryPaths);

await Promise.all(
  db.orgs.map(async (org) => {
    const path = `../data/${org}/commitsInRepo.json`;
    const name = `${org.slice(0, 3)}Commits`;
    db[name] = await readFile(path);
  })
);


//Editing the date to be displayed on visualization
const sinceDate =
  new Date(db.dates.sinceDate).toLocaleDateString("en-US", {
    day: "numeric",
  }) +
  "-" +
  new Date(db.dates.sinceDate).toLocaleDateString("en-US", {
    month: "short",
  }) +
  "-" +
  new Date(db.dates.sinceDate).toLocaleDateString("en-US", {
    year: "numeric",
  });

const untilDate =
  new Date(db.dates.untilDate).toLocaleDateString("en-US", {
    day: "numeric",
  }) +
  "-" +
  new Date(db.dates.untilDate).toLocaleDateString("en-US", {
    month: "short",
  }) +
  "-" +
  new Date(db.dates.untilDate).toLocaleDateString("en-US", {
    year: "numeric",
  });

renderVegaGraph(
  null,
  db.commonOrgReposData,
  db.top5Repos,
  db.Last5Repos
);

document
  .getElementById("Authors-Display")
  .addEventListener("click", (e) =>
    renderVegaGraphAuthor(
      e,
      db.commonOrgAuthorsData,
      db.top5Authors,
      db.last5Authors
    )
  );

document
  .getElementById("display-btn")
  .addEventListener("click", (e) =>
    renderVegaGraph(
      e,
      db.commonOrgReposData,
      db.top5Repos,
      db.Last5Repos
    )
  );

/**
 *
 * @param {to prevent default behaviour} e
 * @param {data to be displayed in visualization} data
 * @param {Top 20 authors to be displayed} top5
 * @param {Last 20 authors to be displayed} last5
 */
function renderVegaGraphAuthor(e, data, top5, last5) {
  if (e) e.preventDefault();

  const ol = document.getElementsByClassName("ActiveList")[0];
  ol.innerHTML = "";

  for (let item in top5) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerText = `${item} - ${top5[item]}`;
    a.setAttribute("href", `https://github.com/${item}`);
    a.setAttribute("target", "_blank");
    ol.appendChild(li);
    li.append(a);
  }

  const ol2 = document.getElementsByClassName("InactiveList")[0];
  ol2.innerHTML = "";

  for (let item in last5) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerText = `${item} - ${last5[item]}`;
    a.setAttribute("href", `https://github.com/${item}`);
    a.setAttribute("target", "_blank");
    ol2.appendChild(li);
    li.append(a);
  }

  const targetDiv = document.getElementsByClassName("container");

  targetDiv[0].style.display = "flex";

  const topicsData = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A simple grid of bar charts to compare performance data.",
    title: `Showing Data for common repos among 3 different organization from ${sinceDate} to ${untilDate}`,
    data: {
      values: data,
    },
    width: 200,
    height: { step: 10 },
    spacing: 5,
    mark: "bar",
    encoding: {
      y: { field: "c", type: "nominal", axis: null },
      x: {
        field: "p",
        type: "quantitative",
        title: null,
      },
      color: {
        field: "c",
        type: "nominal",
        legend: { orient: "bottom", titleOrient: "left" },
        title: "settings",
      },
      row: {
        field: "a",
        title: "Repositories",
        header: { labelAngle: 0, labelAlign: "left" },
      },
      column: { field: "b", title: null },
    },
  };
  vegaEmbed("#vis1", topicsData);
}

/**
 *
 * @param {To prevent default behaviour} e
 * @param {data to be displayed in visulization} data
 * @param {top 20 active repositories to be displayed} top5
 * @param {Least 20 active repositories to be displayed} last5
 */
function renderVegaGraph(e, data, top5, last5) {
  if (e) e.preventDefault();

  const ol = document.getElementsByClassName("ActiveList")[0];
  ol.innerHTML = "";

  let org = "";
  //creating links for the repositories to be clicked
  for (let item in top5) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerText = `${item} - ${top5[item]}`;
    if (item in db.cnsCommits) {
      org = "cns-iu";
    } else if (item in db.hubCommits) {
      org = "hubmapconsortium";
    } else if (item in db.senCommits) {
      org = "senetconsortium";
    }
    a.setAttribute("href", `https://github.com/${org}/${item}`);
    a.setAttribute("target", "_blank");
    ol.appendChild(li);
    li.append(a);
  }

  const ol2 = document.getElementsByClassName("InactiveList")[0];
  ol2.innerHTML = "";

  for (let item in last5) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerText = `${item} - ${last5[item]}`;
    if (item in db.cnsCommits) {
      org = "cns-iu";
    } else if (item in db.hubCommits) {
      org = "hubmapconsortium";
    } else if (item in db.senCommits) {
      org = "sennetconsortium";
    }
    a.setAttribute("href", `https://github.com/${org}/${item}`);
    a.setAttribute("target", "_blank");
    ol2.appendChild(li);
    li.append(a);
  }

  const targetDiv = document.getElementsByClassName("container");

  targetDiv[0].style.display = "flex";

  const topicsData = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A simple grid of bar charts to compare performance data.",
    title: `Showing Data for common repos among 3 different organization from ${sinceDate} to ${untilDate}`,
    data: {
      values: data,
    },
    width: 200,
    height: { step: 10 },
    spacing: 5,
    mark: "bar",
    encoding: {
      y: { field: "c", type: "nominal", axis: null },
      x: {
        field: "p",
        type: "quantitative",
        title: null,
      },
      color: {
        field: "c",
        type: "nominal",
        legend: { orient: "bottom", titleOrient: "left" },
        title: "settings",
      },
      row: {
        field: "a",
        title: "Repositories",
        header: { labelAngle: 0, labelAlign: "left" },
      },
      column: { field: "b", title: null },
    },
  };
  vegaEmbed("#vis1", topicsData);
}
