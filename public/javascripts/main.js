//  make headlines into collapsible buttons
let headlines = document.getElementsByClassName("headline");

for (let i = 0; i < headlines.length; i++) {
  headlines[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    let span = content.nextElementSibling;
    let link = span.nextElementSibling;
    let guardian_link = link.nextElementSibling;
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      span.classList.remove("hidden");
      link.classList.remove("hidden");
      guardian_link.classList.remove("hidden");
    } else {
      content.classList.add("hidden");
      span.classList.add("hidden");
      link.classList.add("hidden");
      guardian_link.classList.add("hidden");
    }
  });
}
