const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  repoName: "make-a-vis",
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

async function PullReqInRepo() {
  // if (githubData["repoName"] in pullReqForRepoDateRange) return;

  const query_pullReqData = {
    query: `query{
      openIssues:search(
        first: 100
        query: "repo:${githubData["organization"]}/${githubData["repoName"]} is:pr is:open created:2018-10-31..2023-01-01"
        type: ISSUE
      ) {
        issueCount
      }
        closedIssues:search(
        first: 100
        query: "repo:${githubData["organization"]}/${githubData["repoName"]} is:pr is:closed created:2018-10-31..2023-01-01"
        type: ISSUE
      ) {
        issueCount
      }
       mergedIssues: search(
        first: 100
        query: "repo:cns-iu/make-a-vis is:pr is:merged created:2018-10-31..2023-01-01"
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
  console.log(data.data);

  const transformData = {};
  for (var key in pullReqData) {
    const value = pullReqData[key];
    transformData[key] = value["issueCount"];
  }

  var transformArray = [];
  for (const key in transformData) {
    transformArray.push({ name: key, pullReqCount: transformData[key] });
  }
  console.log(transformArray);
  const pullreqRepo = {};
  pullreqRepo[githubData["repoName"]] = transformArray;
  // console.log(counts);
  writeFile("data/pullReqsInRepo.json", JSON.stringify(pullreqRepo), (err) => {
    console.log(err);
  });
}

PullReqInRepo();
