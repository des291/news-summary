function currentTime() {
  let date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  hour = updateTime(hour);
  min = updateTime(min);
  sec = updateTime(sec);
  document.getElementById("clock").innerHTML = hour + " : " + min + " : " + sec;
}

function updateTime(time) {
  if (time < 10) {
    return "0" + time;
  } else {
    return time;
  }
}

setInterval(currentTime, 1000);

// async function getArticleData(file) {
//     const response = await fetch(file);
//     const articles = await response.json();
//     console.log("in function" + articles);
//     return articles;

// }

// let bbc = getArticleData("../data/bbc.json").then(articles => {
//     articles;
// });

// console.log("variable" + bbc);

let headlines = document.getElementsByClassName("headline");
let summaries = document.getElementsByClassName("summary");
let links = document.getElementsByClassName("link");
let guardian_links = document.getElementsByClassName("guardian_link");

const bbc = fetch("../data/bbc.json");

bbc
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < headlines.length; i++) {
      headlines[i].innerHTML = data[i]["title"];
      summaries[i].innerHTML = data[i]["summary"];
      links[i].setAttribute("href", data[i]["link"]);
      guardian_links[i].setAttribute("href", data[i]["guardian_link"])
    }
  });

// for (let i = 0; i < headlines.length; i++) {
//     headlines[i].innerHTML = bbc[i]['title'];
// }

//  make heradlines into collapsible buttons
for (let i = 0; i < headlines.length; i++) {
  headlines[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    let link = content.nextElementSibling;
    let guardian_link = link.nextElementSibling;
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      link.classList.remove("hidden");
      guardian_link.classList.remove("hidden");
    } else {
      content.classList.add("hidden");
      link.classList.add("hidden");
      guardian_link.classList.add("hidden");
    }
  });
}
