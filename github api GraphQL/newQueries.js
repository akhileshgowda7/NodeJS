const githubData = {
  githubToken: "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",
  githubUserName: "akhileshgowda7",
  repoName: "make-a-vis",
  organization1: "cns-iu",
  organization2: "hubmapconsortium",
};
import fetch from "node-fetch";
import { writeFile, appendFile } from "fs";

const baseUrl = "https://api.github.com/graphql";
const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubData.githubToken,
};

//query to fetch the authors of pull requests in the given range
const query_userData = {
  query: `{
    search(
      first: 100
      query: "repo:cns-iu/${githubData["repoName"]} is:pr  created:2018-10-31..2023-01-01"
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
        hasNextPage
      }
    }
  }`,
};

//query to fetch number of issues closed in a given range (need to work for longer range)

const query_IssuesClosed = {
  query: `query{
		organization(login: "${githubData["organization2"]}") {
      repository(name: "${githubData["repoName"]}") {
        issues(states: CLOSED, first: 100, filterBy: {since: "2019-04-18T00:00:00"}) {
          totalCount
          nodes {
            author {
              ... on User {
                name
              }
            }
          }
        }
      }
    }
	}`,
};

//query for no pf commits in a repository
const query_commitsOfRepo = {
  query: `query{
    repository(owner: "${githubData["organization1"]}", name: "${githubData["repoName"]}") {
      object(expression: "develop") {
        ... on Commit {
          history(since: "2020-04-18T00:00:00", until: "2021-04-20T00:00:00") {
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

const query_IssuesData = {
  query: `query MyQuery {
    user(login: "${githubData["githubUserName"]}") {
      organization(login: "${githubData["organization1"]}") {
        repository(name: "${githubData["repoName"]}") {
          issuesOpen:issues(filterBy: {states: OPEN, since: "2018-04-18T00:00:00"}) {
            totalCount
          }
          issuesClosed:issues(filterBy: {states: CLOSED, since: "2018-04-18T00:00:00"}) {
            totalCount
          }
        }
      }
    }
  }`,
};

//query for pull req data
const query_pullReqData = {
  query: `query{
    openIssues:search(
      first: 100
      query: "repo:cns-iu/make-a-vis is:pr is:open created:2018-10-31..2023-01-01"
      type: ISSUE
    ) {
      issueCount
    }
      closedIssues:search(
      first: 100
      query: "repo:cns-iu/make-a-vis is:pr is:closed created:2018-10-31..2023-01-01"
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

//query to get repositories based on topic

const query_topic = {
  query: `query{
    search(
      first: 100
      type: REPOSITORY
      query: "topic:ccf org:hubmapconsortium created:>2017-04-20T00:00:00"
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

const query_allRepos = {
  query: `query{
    search(
      first: 100
      type: REPOSITORY
      query: " org:cns-iu created:>2022-04-20T00:00:00"
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

// fetching the authors of pull requests in the given range

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_userData),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    const repositoryData = data.data.search.nodes;
    const names = repositoryData.map((item) => {
      return item.author.name;
    });

    const counts = {};
    names.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });

    var transformArray = [];
    for (const key in counts) {
      transformArray.push({ name: key, Pullreq: counts[key] });
    }

    writeFile(
      "data/pullReqForRepoDateRange.json",
      JSON.stringify(transformArray),
      (err) => {
        console.log(err);
      }
    );
  })
  .catch((error) => console.log(error));

//fetching the persons number of issues closed in a given range

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_IssuesClosed),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    const repositoryData = data.data.organization.repository.issues.nodes;

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

    writeFile(
      "data/issueClosedForRepoDateRange.json",
      JSON.stringify(transformArray),
      (err) => {
        console.log(err);
      }
    );
  })
  .catch((error) => console.log(error));

//fetching query_commitsOfRepo

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_commitsOfRepo),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    const repositoryData = data.data.repository.object.history.nodes;

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

    writeFile(
      "data/noOfCommitsForRepoDateRange.json",
      JSON.stringify(transformArray),
      (err) => {
        console.log(err);
      }
    );
  })
  .catch((error) => console.log(error));

//fetching query_issuesData

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_IssuesData),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    const IssuesData = data.data.user.organization.repository;

    const transformData = {};
    for (var key in IssuesData) {
      const value = IssuesData[key];
      transformData[key] = value["totalCount"];
    }

    var transformArray = [];
    for (const key in transformData) {
      transformArray.push({ name: key, count: transformData[key] });
    }

    writeFile(
      "data/IssuesDataForRepoDateRange.json",
      JSON.stringify(transformArray),
      (err) => {
        console.log(err);
      }
    );
  })
  .catch((error) => console.log(error));

//fetching query_pullReqData

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_pullReqData),
})
  .then((response) => response.text())
  .then((txt) => {
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

    writeFile(
      "data/PullReqDataForRepoDateRange.json",
      JSON.stringify(transformArray),
      (err) => {
        console.log(err);
      }
    );
  })
  .catch((error) => console.log(error));

//fetching query_topic

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_topic),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    // console.log(data.data.search.repos);
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
    // console.log(transformObject);

    writeFile("data/topicData.json", JSON.stringify(transformObject), (err) => {
      console.log(err);
    });
  })
  .catch((error) => console.log(error));

//fetching query_all Repos

fetch(baseUrl, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(query_allRepos),
})
  .then((response) => response.text())
  .then((txt) => {
    const data = JSON.parse(txt);
    // console.log(data.data.search.repos);
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

    writeFile(
      "data/allReposData.json",
      JSON.stringify(transformObject),
      (err) => {
        console.log(err);
      }
    );
  })
  .catch((error) => console.log(error));
