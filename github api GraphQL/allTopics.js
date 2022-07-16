const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  repoName: "make-a-vis",
  organization: "cns-iu",
  endCursor: "",
  sinceDate: "2021-04-18T00:00:00",
};
import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";

const baseUrl = "https://api.github.com/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

async function AllTopics() {
  let query_allTopics = {
    query: `query MyQuery {
      organization(login: "cns-iu") {
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
          organization(login: "cns-iu") {
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

AllTopics();
