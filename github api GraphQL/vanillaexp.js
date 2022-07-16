// import pullReqForRepoDateRange from "./data/pullReqForRepoDateRange.json" assert { type: "json" };

const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  repoName: "ccf-organ-vr-gallery",
  organization: "cns-iu",
  endCursor: "",
  sinceDate: "2017-04-18T00:00:00",
};
import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";

const baseUrl = "https://api.github.com/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

// async function GetAllRepoNames() {
//   let query_Allrepos = {
//     query: `query{
//       organization(login: "${githubData["organization"]}") {
//         repositories(first: 100) {
//           nodes {
//             name
//           }
//           pageInfo{
//             hasNextPage
//             endCursor
//           }
//         }
//       }
//     }`,
//   };
//   let endCursor;
//   let repositoryData = [];

//   var hasNextPage = true;
//   while (hasNextPage) {
//     const response = await fetch(baseUrl, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(query_Allrepos),
//     });

//     const txt = await response.text();
//     const data = JSON.parse(txt);
//     // console.log(data.data.organization.repository.issues);
//     let newRepoData = data.data.organization.repositories.nodes;
//     repositoryData = [...repositoryData, ...newRepoData];
//     // console.log(repositoryData);
//     // console.log(data.data.organization.repository.issues.pageInfo);
//     // console.log(data.data.organization.repositories.nodes);
//     const hasNextPage =
//       data.data.organization.repositories.pageInfo.hasNextPage;

//     if (hasNextPage) {
//       endCursor = data.data.organization.repositories.pageInfo.endCursor;
//       query_Allrepos = {
//         query: `query{
//           organization(login: "${githubData["organization"]}") {
//             repositories(first: 100,after:"${endCursor}") {
//               nodes {
//                 name
//               }
//               pageInfo{
//                 hasNextPage
//                 endCursor
//               }
//             }
//           }
//         }`,
//       };
//     }
//     if (!hasNextPage) break;
//     // hasNextPage = false;
//   }
//   const Reponames = repositoryData.map((item) => {
//     return item.name;
//   });

//   console.log(Reponames);
//   return Reponames;
// }

// const Reponames = await GetAllRepoNames();

// Reponames.forEach((element) => {
//   PullRequestClosedAuthor(element);
// });

async function PullRequestClosedAuthor(repoName) {
  // if (githubData["repoName"] in pullReqForRepoDateRange) return;

  let query_IssuesClosed = {
    query: `query{
        organization(login: "${githubData["organization"]}") {
      repository(name: "${githubData["repoName"]}") {
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
    console.log(data.data.organization.repository.issues);
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
      repository(name: "${githubData["repoName"]}") {
        issues(states: CLOSED, first: 100, filterBy: {since: "2017-04-18T00:00:00"},after:"${endCursor}") {
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
  const pullReqForRepoDateRange = {};
  pullReqForRepoDateRange[`${githubData["repoName"]}`] = transformArray;
  // console.log(counts);
  writeFile(
    "data/pullReqForRepoDateRange.json",
    JSON.stringify(pullReqForRepoDateRange),
    (err) => {
      console.log(err);
    }
  );
}

PullRequestClosedAuthor();
