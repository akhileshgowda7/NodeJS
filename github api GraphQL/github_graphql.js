// import fetch from "node-fetch";
// const githubData = {
//   username: "akhileshgowda7",
//   token: "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",
// };

// const queryQL = {
//   query: `
//   query {
// 	  user(login: "${githubData.username}"){
// 	    pullRequests(last: 100, orderBy: {field: CREATED_AT, direction: DESC}){
//       totalCount
//       nodes{
//         id
//         title
//         url
//         state
// 	      mergedBy {
// 	          avatarUrl
// 	          url
// 	          login
// 	      }
// 	      createdAt
// 	      number
//         changedFiles
// 	      additions
// 	      deletions
//         baseRepository {
// 	          name
// 	          url
// 	          owner {
// 	            avatarUrl
// 	            login
// 	            url
// 	          }
// 	        }
//       }
//     }
// 	}
// }`,
// };

// const baseUrl = "https://api.github.com/graphql";

// const headers = {
//   "content-type": "application/json",
//   Authentication: "bearer" + githubData["token"],
// };

// fetch(baseUrl, {
//   method: "POST",
//   headers: headers,
//   body: JSON.stringify(queryQL),
// })
//   .then((response) => {
//     console.log(JSON.stringify(response));
//   })
//   .catch((err) => {
//     console.log(JSON.stringify(err));
//   });

const githubData = {
  githubConvertedToken: "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",
  githubUserName: "akhileshgowda7",
};

import fetch from "node-fetch";
import { writeFile } from "fs";

import json2md from "json2md";

const query_pull_requests = {
  query: `
	query { 
    organization(login: "cns-iu") {
      id
      repository(name: "scimaps") {
        id
        description
        pull: pullRequests(states: CLOSED, first: 100) {
          totalCount
          nodes {
            closedAt
            number
          }
        }
      }
    }
  }
	`,
};

const baseUrl = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubConvertedToken,
};

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_pull_requests),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    console.log(data);
    console.log(data.data.organization.repository.pull.nodes);
    // const csvString = convertJsonToCsvString(
    //   data.data.organization.repository.pull.nodes
    // );
    // console.log(csvString);
    // writeFile("data.csv", csvString, (err) => {
    //   console.log(err);
    // });
    const mdString = JSONTOmdString(data.data.organization.repository);
    console.log(mdString);
    writeFile("data.md", mdString, (err) => {
      console.log(err);
    });
  })
  .catch((error) =>
    console.log("Error occured in pinned projects 2", JSON.stringify(error))
  );

function convertJsonToCsvString(data) {
  const keys = Object.keys(data[0]);
  const commaSeparatedString = [
    keys.join(","),
    data.map((row) => keys.map((key) => row[key]).join(",")).join("\n"),
  ].join("\n");
  return commaSeparatedString;
}

function JSONTOmdString(data) {
  return json2md([
    { h1: data.description },
    { blockquote: data.id },

    { h2: "Pull" },
    {
      ul: data.pull.nodes.map(
        (item) => `ClosedAt: ${item.closedAt} <br> Number: ${item.number}`
      ),
    },
  ]);
}
