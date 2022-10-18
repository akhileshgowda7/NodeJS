import { readAllFiles } from "../summary-page/readFiles.js";

//setting directory paths
const directoryPaths = [
  "../data/cns-iu/issuesClosedAuthor.json",
  "../data/cns-iu/pullReqclosedby.json",
  "../data/cns-iu/issuesOfRepo.json",
  "../data/cns-iu/pullReqsInRepo.json",
  "../data/cns-iu/commitsBy.json",
  "../data/cns-iu/noOfAdditions.json",
  "../data/cns-iu/commitsInRepo.json",
  "../data/cns-iu/inActiveRepos.json",
  "../data/dates.json",
];

//creating an object to store all the files read
const db = await readAllFiles(directoryPaths);

//Editing the date to be displayed on visualization

const since =
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

const until =
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
document
  .getElementById("submitButton")
  .addEventListener("click", renderVegaGraph);

/**
 * function for Vega-Lite visualtzation
 * @param {to prevent default behaviour} e
 */
function renderVegaGraph(e) {
  if (e) e.preventDefault();
  let value = document.getElementById("myInput").value;
  const targetDiv = document.getElementsByClassName("container");

  targetDiv[0].style.display = "flex";

  if (value in db.noOfAdditions) {
    const AdditionsbyPerson = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Additions by a person based on Given time range",
      title: `# Additions by a person from ${since} to ${until}`,
      data: {
        values: db.noOfAdditions[value],
      },
      encoding: {
        x: { field: "additions", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "additions", type: "quantitative" },
          },
        },
      ],
    };

    vegaEmbed("#vis7", AdditionsbyPerson);
  }

  if (value in db.commitsBy) {
    const CommitsbyPerson = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Commits done by a person based on Given time range",
      title: `# Commits done by a person from ${since} to ${until}`,
      data: {
        values: db.commitsBy[value],
      },
      encoding: {
        x: { field: "noOfCommits", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "noOfCommits", type: "quantitative" },
          },
        },
      ],
    };

    vegaEmbed("#vis6", CommitsbyPerson);
  }

  if (value in db.issuesClosedAuthor) {
    const issueClosedAuthor = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description:
        "no of issues closed by the authors based on Given time range",
      title: `# issues closed by the authors from ${since} to ${until}`,

      data: {
        values: db.issuesClosedAuthor[value],
      },

      encoding: {
        x: { field: "issuesClosed", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "issuesClosed", type: "quantitative" },
          },
        },
      ],
    };

    vegaEmbed("#vis5", issueClosedAuthor);
  }

  if (value in db.pullReqclosedby) {
    const pullReqClosedAuthor = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description:
        "no of Pull requests closed by the authors based on Given time range",
      title: `# Pull requests closed by the authors from ${since} to ${until}`,

      data: {
        values: db.pullReqclosedby[value],
      },

      encoding: {
        x: { field: "PullreqsClosed", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "PullreqsClosed", type: "quantitative" },
          },
        },
      ],
    };

    vegaEmbed("#vis4", pullReqClosedAuthor);
  }

  if (value in db.issuesOfRepo) {
    const issuesInRepo = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "No of Issues in the repo for a given range",
      title: `# Issues in the repo from ${since} to ${until}`,
      data: {
        values: db.issuesOfRepo[value],
      },
      encoding: {
        x: { field: "count", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "count", type: "quantitative" },
          },
        },
      ],
    };

    vegaEmbed("#vis3", issuesInRepo);
  }
  if (value in db.pullReqsInRepo) {
    const PullReqInRepo = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "No of Pull Requests in the repo for a given range",
      title: `# Pull Requests in the repo from ${since} to ${until}`,
      data: {
        values: db.pullReqsInRepo[value],
      },
      encoding: {
        x: { field: "pullReqCount", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "pullReqCount", type: "quantitative" },
          },
        },
      ],
    };
    vegaEmbed("#vis2", PullReqInRepo);
  }

  if (value in db.commitsInRepo) {
    const CommitsRepo = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "No of commits in the repo for a given range",
      title: `# commits in the repo from ${since} to ${until}`,
      data: {
        values: db.commitsInRepo[value],
      },
      encoding: {
        x: { field: "totalCount", type: "quantitative" },
        y: { field: "name", type: "nominal", axis: { labelAngle: 0 } },
        color: { field: "name" },
      },
      layer: [
        {
          mark: "bar",
        },
        {
          mark: {
            type: "text",
            align: "left",
            baseline: "middle",
            dx: 2,
          },
          encoding: {
            text: { field: "totalCount", type: "quantitative" },
          },
        },
      ],
    };
    vegaEmbed("#vis1", CommitsRepo);
  }
}

// displaying all the active repositories

const repoArray = Object.keys(db.issuesClosedAuthor);
const taskRepos = document.querySelector(".container-repos");

function DisplayAllRepo(repoArray) {
 

  for (let i = 0; i < repoArray.length; i++) {
    let al = document.createElement("a");
    al.className = "repos-container";
    al.href = "#";
    al.addEventListener("click", selectRepo);
    al.appendChild(document.createTextNode(repoArray[i]));
    taskRepos.appendChild(al);
  }
}
DisplayAllRepo(repoArray);

function selectRepo(e) {
  const repoName = e.target.childNodes[0].data;
  let input = document.getElementById("myInput");
  input.value = repoName;
  renderVegaGraph();
}
//  displaying all the inactive repositories

const inActibeArray = db.inActiveRepos;
const taskInactiveRepos = document.querySelector(".inactive-repos-container");
function DisplayInactiveRepos(repoArray) {
  for (let i = 0; i < repoArray.length; i++) {
    let al = document.createElement("a");
    al.className = "inactiveRepos-container";
    al.href = "#";
    al.appendChild(document.createTextNode(repoArray[i]));
    taskInactiveRepos.appendChild(al);
  }
}
DisplayInactiveRepos(inActibeArray);
