let filesRead = {}
const directoryPaths = ["../data/cns-iu/issuesClosedAuthor.json","../data/cns-iu/RepositoryData.json"];
async function readFile(filesPath){
  const response = await fetch(filesPath)
  const name = JSON.stringify(filesPath).slice(16,filesPath.length-4);
  const data = await response.json()
  filesRead[name] = data;
}
await Promise.all(directoryPaths.map(d => readFile(d)));

/**
 * the autocomplete function takes two arguments,
 * the text field element and an array of possible autocompleted values:
 * @param {input} inp 
 * @param {array of possible autocompleted values} arr 
 */
function autocomplete(inp, arr) {
  
  let currentFocus;
  /**
   * execute a function when someone writes in the text field:
   */
  inp.addEventListener("input", function (e) {
    let a,
      b,
      i,
      val = this.value;
    
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    
    this.parentNode.appendChild(a);
    
    for (i = 0; i < arr.length; i++) {
      
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  /**
   *a function to classify an item as "active":
   * 
   * @param {element to set current currentFocus} x 
   */
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  /**
   *a function to remove the "active" class from all autocomplete items:
   * 
   * @param {element} x 
   */
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  /**
   * close all autocomplete lists in the document,
    except the one passed as an argument
   * @param {element in autocomplete} elmnt 
   */
  function closeAllLists(elmnt) {
    
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /**
   * execute a function when someone clicks in the document
   */
  
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

autocomplete(
  document.getElementById("myInput"),
  Object.keys(filesRead.issuesClosedAuthor)
);

let button = document.getElementById("display-btn"); 
let inActive = document.getElementById("inactive-btn");

button.onclick = function () {
  const div = document.getElementsByClassName("container-repos")[0];
  const div2 = document.getElementsByClassName("inactive-repos-container")[0];
  const button1 = document.getElementById("display-btn");
  const button2 = document.getElementById("inactive-btn");
  if (div.style.display !== "none") {
    div.style.display = "none";
  } else {
    div.style.display = "flex";
    div2.style.display = "none"
    button1.style.backgroundColor = "#4caf50"
    button2.style.backgroundColor = "#24292f"
  }
};

inActive.onclick = function () {
  const div = document.getElementsByClassName("inactive-repos-container")[0];
  const div2 = document.getElementsByClassName("container-repos")[0];
  const button1 = document.getElementById("display-btn");
  const button2 = document.getElementById("inactive-btn");

  if (div.style.display !== "none") {
    div.style.display = "none";
    div2.style.display = "flex";
    button2.style.backgroundColor = "#24292f"
    button1.style.backgroundColor = "#4caf50"
  } else {
    div.style.display = "flex";
    div2.style.display = "none";
    button1.style.backgroundColor = "#24292f"
    button2.style.backgroundColor = "#4caf50"
  }
};

const repodataBar = document.querySelector(".repo-data-bar");
const htmlRepoDataBar = ` 
<div class="repoDataStyle">
<p>Total Repositories - ${filesRead.RepositoryData.TotalRepos}</p>
<p>Active Repositories - ${filesRead.RepositoryData.ActiveRepos}</p>
<p>Inactive Repositories - ${filesRead.RepositoryData.InActiveRepos}</p>
</div>`;

repodataBar.insertAdjacentHTML("afterbegin", htmlRepoDataBar);
