const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
};

import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";
import json2md from "json2md";

const query_pullrequestClosingTime = {
  query: `query{
		user(login: "${githubData.githubUserName}") {
      organization(login: "cns-iu") {
        repository(name: "macroscope-kiosk") {
          pullRequests(first: 100) {
            nodes {
              closedAt
              createdAt
            
            }
            totalCount
          }
        }
      }
  }
	}`,
};

const query_repodata = {
  query: `query{
		user(login: "${githubData.githubUserName}") {
      organization(login: "cns-iu") {
        repository(name: "macroscope-kiosk") {
          name
          assignableUsers {
            totalCount
          }
          Issuesopen: issues(states: OPEN) {
            totalCount
            nodes {
              createdAt
            }
          }
          Issuesclosed: issues(states: CLOSED) {
            totalCount
            nodes {
              createdAt
            }
          }
          openPullreq:pullRequests(first: 10, states: OPEN) {
            totalCount
          }
          closedPullreq:pullRequests(first: 10, states: CLOSED) {
            totalCount
          }
        }
      }
  }
	}`,
};

const query_pullreqdata = {
  query: `query{
		user(login: "${githubData.githubUserName}") {
      organization(login: "cns-iu") {
        repository(name: "macroscope-kiosk") {

          open: pullRequests(first: 10, states: OPEN) {
            totalCount
          }
          closed: pullRequests(first: 10, states: CLOSED) {
            totalCount
          }
          Merged: pullRequests(first: 10, states: MERGED) {
            totalCount
          }
        }
      }
  }
	}`,
};

const query_projectdata = {
  query: `query{
		user(login: "${githubData.githubUserName}") {
      organization(login: "cns-iu") {
        repository(name: "macroscope-kiosk") {
          project(number: 1) {
            name
            state
            updatedAt
            number
            progress {
              doneCount
              todoPercentage
              donePercentage
              inProgressCount
              inProgressPercentage
              todoCount
            }
          }
        }
      }
  }
	}`,
};

const baseUrl = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

// Getting repository data

// fetch(baseUrl, {
//   method: "POST",
//   headers: headers,
//   body: JSON.stringify(query_repodata),
// })
//   .then((response) => response.text())
//   .then((txt) => {
//     const data = JSON.parse(txt);
//     // console.log(data.data.user.organization);
//     const repository = data.data.user.organization.repository;
//     const repositoryName = repository.name;
//     delete repository.name;
//     const repositoryArray = [];
//     const repositoryObject = {};

//     for (const key in repository) {
//       const valueObject = repository[key];
//       const value = valueObject.totalCount;
//       repositoryObject[key] = value;
//     }
//     repositoryArray.push({ name: repositoryName, ...repositoryObject });
//     // console.log(repositoryArray);

//     const csvString = convertJsonToCsvString(repositoryArray);
//     console.log(csvString);
//     writeFile("Repositorydata.csv", csvString, (err) => {
//       console.log(err);
//     });

//     writeFile("Repositorydata.json", JSON.stringify(repositoryArray), (err) => {
//       console.log(err);
//     });

//     const mdString = JSONTOmdStringRepoData(repositoryName, repositoryObject);
//     // console.log(mdString);
//     writeFile("Repositorydata.md", mdString, (err) => {
//       console.log(err);
//     });
//   })
//   .catch((error) => console.log(error));

//GETTING PULL REQ PIE CHART DATA

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_pullreqdata),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    // console.log(data.data.user.organization);
    const repository = data.data.user.organization.repository;
    const repositoryName = repository.name;
    delete repository.name;
    const repositoryArray = [];
    const repositoryObject = {};

    for (const key in repository) {
      const valueObject = repository[key];
      const value = valueObject.totalCount;
      repositoryObject[key] = value;
    }
    repositoryArray.push({ name: repositoryName, ...repositoryObject });
    // console.log(repositoryArray);

    const csvString = convertJsonToCsvString(repositoryArray);
    console.log(csvString);
    writeFile("PullReqPiedata.csv", csvString, (err) => {
      console.log(err);
    });

    writeFile("PullReqPiedata.json", JSON.stringify(repositoryArray), (err) => {
      console.log(err);
    });

    // const mdString = JSONTOmdStringRepoData(repositoryName, repositoryObject);
    // console.log(mdString);
    // writeFile("PullReqPiedata.md", mdString, (err) => {
    //   console.log(err);
    // });
  })
  .catch((error) => console.log(error));

// //Getting Pull requests data

// fetch(baseUrl, {
//   method: "POST",
//   headers: headers,
//   body: JSON.stringify(query_pullrequests),
// })
//   .then((response) => response.text())
//   .then((txt) => {
//     const data = JSON.parse(txt);
//     // console.log(data.data.user.organization);
//     const pullReqData =
//       data.data.user.organization.repository.pullRequests.nodes;
//     // console.log(pullReqData);
//     const pullReqDataUpdated = [];
//     var counter = 1;
//     pullReqData.forEach((data, index) => {
//       const createdAt = data.createdAt;
//       const closedAt = data.closedAt;
//       const diffInDays = getDateDiff(createdAt, closedAt);
//       pullReqDataUpdated.push({
//         counter,
//         ...data,
//         diffInDays: diffInDays,
//       });
//       counter = counter + 1;
//     });
//     console.log(pullReqDataUpdated);
//     const csvString = convertJsonToCsvString(pullReqDataUpdated);
//     // console.log(csvString);
//     writeFile("pullRequestsdata.csv", csvString, (err) => {
//       console.log(err);
//     });
//     writeFile(
//       "pullRequestsdata.json",
//       JSON.stringify(pullReqDataUpdated),
//       (err) => {
//         console.log(err);
//       }
//     );

//     const mdString = JSONTOmdStringPullData(pullReqDataUpdated);
//     // console.log(mdString);
//     writeFile("pullRequestsdata.md", mdString, (err) => {
//       console.log(err);
//     });
//   })
//   .catch((error) => console.log(error));

// //fetching projects data

// fetch(baseUrl, {
//   method: "POST",
//   headers: headers,
//   body: JSON.stringify(query_projectdata),
// })
//   .then((response) => response.text())
//   .then((txt) => {
//     const data = JSON.parse(txt);
//     // console.log(data.data.user.organization.repository);
//     const prodata = data.data.user.organization.repository.project;
//     const progressdata =
//       data.data.user.organization.repository.project.progress;
//     delete prodata.progress;
//     const projectData = [
//       {
//         ...prodata,
//         ...progressdata,
//       },
//     ];
//     // console.log(projectData);

//     const csvString = convertJsonToCsvString(projectData);
//     // console.log(csvString);
//     writeFile("projectdata.csv", csvString, (err) => {
//       console.log(err);
//     });

//     const mdString = JSONTOmdStringProjectData(projectData);
//     // console.log(mdString);
//     writeFile("projectdata.md", mdString, (err) => {
//       console.log(err);
//     });
//   })
//   .catch((error) => console.log(error));

function convertJsonToCsvString(data) {
  const keys = Object.keys(data[0]);
  const commaSeparatedString = [
    keys.join(","),
    data.map((row) => keys.map((key) => row[key]).join(",")).join("\n"),
  ].join("\n");
  return commaSeparatedString;
}

function JSONTOmdStringRepoData(repoName, repoDataObject) {
  console.log(repoDataObject);
  return json2md([
    { h1: repoName },

    { h2: "Repository data" },
    {
      ul: Object.keys(repoDataObject).map(
        (key) => `${key} -  <strong>${repoDataObject[key]}</strong>`
      ),
    },
  ]);
}

function getDateDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const t1 = d1.getTime();
  const t2 = d2.getTime();
  const diff = t2 - t1;
  const diffInSec = diff / 1000;
  const diffInMin = diffInSec / 60;
  const diffInHours = diffInMin / 60;
  // if (diffInHours < 1) return `${Math.floor(diffInMin)} mins`;
  const diffInDays = diffInHours / 24;
  const diffInMonths = diffInDays / 24;
  // if (diffInDays < 1) return `${Math.floor(diffInHours)} hours`;
  // if (diffInMonths < 1)
  //   return Math.floor(diffInDays) == 1
  //     ? `${Math.floor(diffInDays)} day`
  //     : `${Math.floor(diffInDays)} days`;
  // return Math.floor(diffInMonths) == 1
  //   ? `${Math.floor(diffInMonths)} month`
  //   : `${Math.floor(diffInMonths)} months`;
  return Math.floor(diffInDays);
}

function JSONTOmdStringPullData(data) {
  // console.log(data);
  return json2md([
    { h1: "Pull Request Data " },

    {
      table: {
        headers: Object.keys(data[0]),
        rows: data,
      },
    },
  ]);
}

function JSONTOmdStringProjectData(data) {
  // console.log(data);
  return json2md([
    { h1: `Project Name - ${data[0].name} ` },

    {
      table: {
        headers: Object.keys(data[0]),
        rows: data,
      },
    },
  ]);
}
