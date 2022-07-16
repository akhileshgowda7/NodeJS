const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  repoName: "hubmapconsortium",
  organization: "hubmapconsortium",
  endCursor: "",
  sinceDate: "2021-04-18T00:00:00",
  created: "2018-10-31",
  topic: "ccf",
};
import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";

const baseUrl = "https://api.github.com/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

// // const topicsArrayHub = ["ccf", "gehlenborglab", "hubmap"];
// const topicsArrayHub = ["hubmap", "ccf"];

//getting all topics

async function AllTopics() {
  let query_allTopics = {
    query: `query MyQuery {
      organization(login: "${githubData["organization"]}") {
        repositories(first: 100) {
          nodes {
            repositoryTopics(first: 10) {
              nodes {
                topic {
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
      }
    }`,
  };
  let endCursor;
  let repositoryData = [];
  while (true) {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query_allTopics),
    });

    const txt = await response.text();
    const data = JSON.parse(txt);
    let newRepoData = data.data.organization.repositories.nodes;
    // console.log(newRepoData);
    repositoryData = [...repositoryData, ...newRepoData];
    // console.log(repositoryData);
    const hasNextPage =
      data.data.organization.repositories.pageInfo.hasNextPage;
    // console.log(hasNextPage);
    if (hasNextPage) {
      endCursor = data.data.organization.repositories.pageInfo.endCursor;
      // console.log(endCursor);
      query_allTopics = {
        query: `query MyQuery {
          organization(login: "${githubData["organization"]}") {
            repositories(first: 100 ,after: "${endCursor}") {
              nodes {
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
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
          }
        }`,
      };
    }
    if (!hasNextPage) break;
  }

  const mapData = repositoryData.map((element) => {
    let item = element.repositoryTopics.nodes;
    return item;
  });
  // console.log(mapData);
  const filtered = mapData.filter((element) => {
    if (element != 0) {
      return element;
    }
  });
  // console.log(filtered);

  const topics = [];
  for (var i = 0; i < filtered.length; i++) {
    for (var j = 0; j < filtered[i].length; j++) {
      var topicName = filtered[i][j].topic.name;
      if (topics.indexOf(topicName) == -1) {
        topics.push(topicName);
      }
    }
  }
  // console.log(topics);
  writeFile("data/topicNames.json", JSON.stringify(topics), (err) => {
    if (err) console.log(err);
  });
  return topics;
}
const topicnames = await AllTopics();
const reponamesObj = {};

topicnames.forEach((element) => {
  topicSearch(element);
});

async function topicSearch(topic) {
  const query_topic = {
    query: `query{
      search(
        first: 100
        type: REPOSITORY
        query: "topic:${topic} org:${githubData["organization"]} created:>2017-04-20T00:00:00"
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

  //moving all names into an Array
  const keyArray = [];
  elements.forEach((element) => {
    keyArray.push(element.name);
  });

  //transforming the data with totalcount

  const transformObject = elements.map(function (object) {
    return {
      openIssue: object["openIssue"].totalCount,
      closedIssue: object["closedIssue"].totalCount,
      openPullreq: object["openPullreq"].totalCount,
      closedPullreq: object["closedPullreq"].totalCount,
      mergedPullreq: object["mergedPullreq"].totalCount,
    };
  });

  const name = "name";
  transformObject.forEach((element, index) => {
    element[name] = keyArray[index]; //adding the name back to the object after transforming the data
  });
  // console.log(transformObject);
  // const reponamesObj = {};
  reponamesObj[topic] = transformObject;
  console.log(reponamesObj);

  writeFile("data/topicData.json", JSON.stringify(reponamesObj), (err) => {
    if (err) console.log(err);
  });
}
