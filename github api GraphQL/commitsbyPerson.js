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

async function CommitsByaPerson() {
  // if (githubData["repoName"] in pullReqForRepoDateRange) return;

  let query_commitsOfRepo = {
    query: `query{
      repository(owner: "${githubData["organization"]}", name: "${githubData["repoName"]}") {
        object(expression: "develop") {
          ... on Commit {
            history(since: "${githubData["sinceDate"]}",first: 100) {
              totalCount
              nodes {
                author {
                  name
                }
              
              }
              pageInfo{
                endCursor
                hasNextPage
              }
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
      body: JSON.stringify(query_commitsOfRepo),
    });

    const txt = await response.text();
    const data = JSON.parse(txt);
    console.log(data.data.repository.object.history);
    let newRepoData = data.data.repository.object.history.nodes;
    repositoryData = [...repositoryData, ...newRepoData];
    // console.log(repositoryData);
    // console.log(data.data.organization.repository.issues.pageInfo);
    const hasNextPage =
      data.data.repository.object.history.pageInfo.hasNextPage;

    if (hasNextPage) {
      endCursor = data.data.repository.object.history.pageInfo.endCursor;
      query_commitsOfRepo = {
        query: `query{
          repository(owner: "${githubData["organization"]}", name: "${githubData["repoName"]}") {
            object(expression: "develop") {
              ... on Commit {
                history(since: "${githubData["sinceDate"]}",first: 100,after:"${endCursor}") {
                  totalCount
                  nodes {
                    author {
                      name
                    }

                  }
                  pageInfo{
                    endCursor
                    hasNextPage
                  }
                }
              }
            }
          }
        }`,
      };
    }
    if (!hasNextPage) break;

    const names = repositoryData.map((item) => {
      return item.author.name;
    });

    const counts = {};
    names.forEach((element) => {
      counts[element] = (counts[element] || 0) + 1;
    });

    var transformArray = [];
    for (const key in counts) {
      transformArray.push({ name: key, noOfCommits: counts[key] });
    }
    console.log(transformArray);
    const noOfCommits = {};
    noOfCommits[githubData["repoName"]] = transformArray;
    // console.log(counts);
    writeFile("data/commitsby.json", JSON.stringify(noOfCommits), (err) => {
      console.log(err);
    });
  }
}

CommitsByaPerson();
