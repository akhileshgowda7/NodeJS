import issuesClosedByAuthor from "./data/HubissuesClosedAuthor.json" assert { type: "json" };
import pullReqClosedByAuthor from "./data/HubpullReqclosedby.json" assert { type: "json" };

import issuesInaRepo from "./data/HubissuesOfRepo.json" assert { type: "json" };
import pullreqRepo from "./data/HubpullReqsInRepo.json" assert { type: "json" };

const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  // repoName: "ccf-organ-vr-gallery",
  // hubmapconsortium
  organization: "hubmapconsortium",
  endCursor: "",
  sinceDate: "2021-04-18T00:00:00",
  created: "2018-10-31",
};
import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";

const baseUrl = "https://api.github.com/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

async function GetAllRepoNames() {
  let query_Allrepos = {
    query: `query{
      organization(login: "${githubData["organization"]}") {
        repositories(first: 100) {
          nodes {
            name
          }
          pageInfo{
            hasNextPage
            endCursor
          }
        }
      }
    }`,
  };
  let endCursor;
  let repositoryData = [];

  var hasNextPage = true;
  while (hasNextPage) {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query_Allrepos),
    });

    const txt = await response.text();
    const data = JSON.parse(txt);
    let newRepoData = data.data.organization.repositories.nodes;
    repositoryData = [...repositoryData, ...newRepoData];

    const hasNextPage =
      data.data.organization.repositories.pageInfo.hasNextPage;

    if (hasNextPage) {
      endCursor = data.data.organization.repositories.pageInfo.endCursor;
      query_Allrepos = {
        query: `query{
          organization(login: "${githubData["organization"]}") {
            repositories(first: 100,after:"${endCursor}") {
              nodes {
                name
              }
              pageInfo{
                hasNextPage
                endCursor
              }
            }
          }
        }`,
      };
    }
    if (!hasNextPage) break;
  }
  console.log(githubData["organization"]);
  const Reponames = repositoryData.map((item) => {
    return item.name;
  });
  // console.log(Reponames);
  return Reponames;
}

const Reponames = await GetAllRepoNames();

Reponames.forEach((element) => {
  // IssuesClosedAuthor(element);
  // PullRequestClosedAuthor(element);
  IssuesInRepo(element);
  // PullReqInRepo(element);
  CommitsByaPerson(element);
});

async function IssuesClosedAuthor(repoName) {
  if (repoName in issuesClosedByAuthor) return;
  let query_IssuesClosed = {
    query: `query{
        organization(login: "${githubData["organization"]}") {
      repository(name: "${repoName}") {
        issues(states: CLOSED, first: 100, filterBy: {since: "${githubData["sinceDate"]}"}) {
          totalCount
          nodes {
            author {
              ... on User {
                name
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    }`,
  };
  let endCursor;
  let repositoryData = [];
  while (true) {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query_IssuesClosed),
    });

    const txt = await response.text();
    const data = JSON.parse(txt);
    // console.log(data.data.organization.repository.issues);
    let newRepoData = data.data.organization.repository.issues.nodes;
    repositoryData = [...repositoryData, ...newRepoData];
    // console.log(repositoryData);
    // console.log(data.data.organization.repository.issues.pageInfo);
    const hasNextPage =
      data.data.organization.repository.issues.pageInfo.hasNextPage;

    if (hasNextPage) {
      endCursor = data.data.organization.repository.issues.pageInfo.endCursor;
      query_IssuesClosed = {
        query: `query{
        organization(login: "${githubData["organization"]}") {
      repository(name: "${repoName}") {
        issues(states: CLOSED, first: 100, filterBy: {since: "${githubData["sinceDate"]}"},after:"${endCursor}") {
          totalCount
          nodes {
            author {
              ... on User {
                name
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    }`,
      };
    }
    if (!hasNextPage) break;
  }
  const names = repositoryData.map((item) => {
    return item.author.name;
  });

  const counts = {};
  names.forEach((element) => {
    counts[element] = (counts[element] || 0) + 1;
  });

  var transformArray = [];
  for (const key in counts) {
    transformArray.push({ name: key, issuesClosed: counts[key] });
  }
  // const pullReqForRepoDateRange = {};
  issuesClosedByAuthor[repoName] = transformArray;
  // console.log(counts);
  writeFile(
    "data/HubissuesClosedAuthor.json",
    JSON.stringify(issuesClosedByAuthor),
    (err) => {
      console.log(err);
    }
  );
}

// IssuesClosedAuthor();

async function PullRequestClosedAuthor(repoName) {
  if (repoName in pullReqClosedByAuthor) return;

  let query_pullReqClosedBy = {
    query: `{
      search(
        first: 100
        query: "repo:${githubData["organization"]}/${repoName} is:pr  created:>${githubData["created"]}"
        type: ISSUE
      ) {
        issueCount
        nodes {
          ... on PullRequest {
            author {
              ... on Bot {
                name:login
              }
              ... on User {
                name
              }
            }
          }
        }
        pageInfo{
          hasNextPage
          endCursor
        }
      }
    }`,
  };
  let endCursor;
  let repositoryData = [];
  while (true) {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query_pullReqClosedBy),
    });

    const txt = await response.text();
    const data = JSON.parse(txt);
    // console.log(data.data);
    let newRepoData = data.data.search.nodes;
    repositoryData = [...repositoryData, ...newRepoData];
    // console.log(repositoryData);
    // console.log(data.data.organization.repository.issues.pageInfo);
    const hasNextPage = data.data.search.pageInfo.hasNextPage;

    if (hasNextPage) {
      endCursor = data.data.search.pageInfo.endCursor;
      query_pullReqClosedBy = {
        query: `{
          search(
            first: 100
            query: "repo:${githubData["organization"]}/${githubData["repoName"]} is:pr created:>${githubData["created"]}"
            type: ISSUE
            after:"${endCursor}"
          ) {
            issueCount
            nodes {
              ... on PullRequest {
                author {
                  ... on Bot {
                    name:login
                  }
                  ... on User {
                    name
                  }
                }
              }
            }
            pageInfo{
              hasNextPage
              endCursor
            }
          }
        }`,
      };
    }
    if (!hasNextPage) break;
  }
  const names = repositoryData.map((item) => {
    return item.author.name;
  });

  const counts = {};
  names.forEach((element) => {
    counts[element] = (counts[element] || 0) + 1;
  });

  var transformArray = [];
  for (const key in counts) {
    transformArray.push({ name: key, PullreqsClosed: counts[key] });
  }
  // const pullReqForRepoDateRange = {};
  pullReqClosedByAuthor[repoName] = transformArray;
  // console.log(counts);
  writeFile(
    "data/HubpullReqclosedby.json",
    JSON.stringify(pullReqClosedByAuthor),
    (err) => {
      console.log(err);
    }
  );
}

// PullRequestClosedAuthor();

//IssuesData Starts here

async function IssuesInRepo(repoName) {
  let query_IssuesData = {
    query: `query MyQuery {
      user(login: "${githubData["githubUserName"]}") {
        organization(login: "${githubData["organization"]}") {
          repository(name: "${repoName}") {
            issuesOpen:issues(filterBy: {states: OPEN, since: "${githubData["sinceDate"]}"}) {
              totalCount
            }
            issuesClosed:issues(filterBy: {states: CLOSED, since: "${githubData["sinceDate"]}"}) {
              totalCount
            }
          }
        }
      }
    }`,
  };
  // console.log(repoName);
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(query_IssuesData),
  });

  const txt = await response.text();
  const data = JSON.parse(txt);
  // console.log(data.data);
  let IssuesData = data.data.user.organization.repository;

  const transformData = {};
  for (var key in IssuesData) {
    const value = IssuesData[key];
    transformData[key] = value["totalCount"];
  }

  var transformArray = [];
  for (const key in transformData) {
    transformArray.push({ name: key, count: transformData[key] });
  }
  // console.log(transformArray);
  // const issuesRepo = {};
  issuesInaRepo[repoName] = transformArray;
  // console.log(counts);
  writeFile(
    "data/HubissuesOfRepo.json",
    JSON.stringify(issuesInaRepo),
    (err) => {
      console.log(err);
    }
  );
}

//Pull reqs in repo

async function PullReqInRepo(repoName) {
  if (repoName in pullreqRepo) return;

  const query_pullReqData = {
    query: `query{
      openIssues:search(
        first: 100
        query: "repo:${githubData["organization"]}/${repoName} is:pr is:open created:>${githubData["created"]}"
        type: ISSUE
      ) {
        issueCount
      }
        closedIssues:search(
        first: 100
        query: "repo:${githubData["organization"]}/${repoName} is:pr is:closed created:>${githubData["created"]}"
        type: ISSUE
      ) {
        issueCount
      }
       mergedIssues: search(
        first: 100
        query: "${githubData["organization"]}/${repoName} is:pr is:merged created:>${githubData["created"]}"
        type: ISSUE
      ) {
        issueCount
      } 
    }`,
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(query_pullReqData),
  });

  const txt = await response.text();
  const data = JSON.parse(txt);
  const pullReqData = data.data;

  const transformData = {};
  for (var key in pullReqData) {
    const value = pullReqData[key];
    transformData[key] = value["issueCount"];
  }

  var transformArray = [];
  for (const key in transformData) {
    transformArray.push({ name: key, pullReqCount: transformData[key] });
  }
  // console.log(transformArray);
  pullreqRepo[repoName] = transformArray;
  // console.log(counts);
  writeFile(
    "data/HubpullReqsInRepo.json",
    JSON.stringify(pullreqRepo),
    (err) => {
      console.log(err);
    }
  );
}

//commits by person

// async function CommitsByaPerson(repoName) {
//   // if (githubData["repoName"] in pullReqForRepoDateRange) return;

//   let query_commitsOfRepo = {
//     query: `query{
//       repository(owner: "${githubData["organization"]}", name: "${repoName}") {
//         object(expression: "develop") {
//           ... on Commit {
//             history(since: "${githubData["sinceDate"]}",first: 100) {
//               totalCount
//               nodes {
//                 author {
//                   name
//                 }

//               }
//               pageInfo{
//                 endCursor
//                 hasNextPage
//               }
//             }
//           }
//         }
//       }
//     }`,
//   };
//   let endCursor;
//   let repositoryData = [];
//   while (true) {
//     const response = await fetch(baseUrl, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(query_commitsOfRepo),
//     });

//     const txt = await response.text();
//     const data = JSON.parse(txt);
//     // console.log(data.data.repository);
//     // console.log(data.data);
//     // if (data.data == null) {
//     //   // console.log(repoName);
//     //   continue;
//     // }

//     // if (data.data.repository.object == null) continue;
//     let newRepoData = data.data.repository.object.history.nodes;
//     repositoryData = [...repositoryData, ...newRepoData];
//     // console.log(repositoryData);
//     const hasNextPage =
//       data.data.repository.object.history.pageInfo.hasNextPage;

//     if (hasNextPage) {
//       endCursor = data.data.repository.object.history.pageInfo.endCursor;
//       query_commitsOfRepo = {
//         query: `query{
//           repository(owner: "${githubData["organization"]}", name: "${repoName}") {
//             object(expression: "develop") {
//               ... on Commit {
//                 history(since: "${githubData["sinceDate"]}",first: 100,after:"${endCursor}") {
//                   totalCount
//                   nodes {
//                     author {
//                       name
//                     }

//                   }
//                   pageInfo{
//                     endCursor
//                     hasNextPage
//                   }
//                 }
//               }
//             }
//           }
//         }`,
//       };
//     }
//     if (!hasNextPage) break;

//     const names = repositoryData.map((item) => {
//       return item.author.name;
//     });

//     const counts = {};
//     names.forEach((element) => {
//       counts[element] = (counts[element] || 0) + 1;
//     });

//     var transformArray = [];
//     for (const key in counts) {
//       transformArray.push({ name: key, noOfCommits: counts[key] });
//     }
//     console.log(transformArray);
//     const noOfCommits = {};
//     noOfCommits[repoName] = transformArray;
//     // console.log(noOfCommits);
//     writeFile("data/commitsby.json", JSON.stringify(noOfCommits), (err) => {
//       console.log(err);
//     });
//   }
// }

//commits by a person
