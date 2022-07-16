const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  repoName: "entity-api",
  organization1: "cns-iu",
  organization2: "hubmapconsortium",
  topic: "ccf", //enter the topic needed to search eg- ccf
  created: "2017-04-20T00:00:00",
};
import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";

const baseUrl = "https://api.github.com/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

async function TopicSearch() {
  //query to fetch number of issues closed in a given range (need to work for longer range)
  const query_topic = {
    query: `query{
      search(
        first: 100
        type: REPOSITORY
        query: "topic:${githubData["topic"]} org:${githubData["organization2"]} created:>${githubData["created"]}"
        ) {
          repositoryCount
          repos: edges {
            repo: node {
              ... on Repository {
                name
                openIssue:issues(states: OPEN) {
                  totalCount
                }
                closedIssue:issues(states: CLOSED) {
              totalCount
            }
            openPullreq: pullRequests(states: OPEN) {
              totalCount
            }
            closedPullreq: pullRequests(states: CLOSED) {
              totalCount
            }
            mergedPullreq: pullRequests(states: MERGED) {
              totalCount
            }
            
          }
        }
      }
    }
  }`,
  };

  //fetching the persons number of issues closed in a given range

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(query_topic),
  });
  const txt = await response.text();
  const data = JSON.parse(txt);
  const topicData = data.data.search.repos;

  //transforming the data into array of elements
  const elements = [];
  for (const key in topicData) {
    elements.push(topicData[key].repo);
    // console.log(topicData[key]);
  }
  // console.log(elements);

  //moving all names into an Array
  const keyArray = [];
  elements.forEach((element) => {
    keyArray.push(element.name);
  });
  // console.log(keyArray);

  //transforming the data with totalcount

  const objectArray = [];
  const transformObject = elements.map(function (object) {
    return {
      openIssue: object["openIssue"].totalCount,
      closedIssue: object["closedIssue"].totalCount,
      openPullreq: object["openPullreq"].totalCount,
      closedPullreq: object["closedPullreq"].totalCount,
      mergedPullreq: object["mergedPullreq"].totalCount,
    };
  });
  // console.log(transformObject);
  const transformData = {};
  const name = "name";
  transformObject.forEach((element, index) => {
    element[name] = keyArray[index]; //adding the name back to the object after transforming the data
  });
  console.log(transformObject);

  writeFile("data/topicData.json", JSON.stringify(transformObject), (err) => {
    console.log(err);
  });
}

TopicSearch();
