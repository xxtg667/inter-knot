import "./style.less";
import Macy from "macy";

// @ts-ignore
LA.init({
  id: "3J6dEY8wQU3ZxACy",
  ck: "3J6dEY8wQU3ZxACy",
  autoTrack: true,
  prefix: "inter-knot/event",
});

const tabs = [...document.querySelectorAll(".tab-container .tab")];
tabs.forEach((e) => {
  e.addEventListener("click", () => {
    tabs.forEach((e) => e.classList.remove("active"));
    e.classList.add("active");
  });
});
Macy({
  container: ".card-container",
  margin: {
    x: 0,
    y: 0,
  },
});
renderUserInfo({
  curExp: 5000,
  totalExp: 10000,
  level: 9999,
  name: "share121",
  profilePhoto: new URL("/我的头像.png", import.meta.url).href,
});
renderArticleList(
  Array(200)
    .fill(null)
    .map(() => ({
      title: "标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题",
      content:
        "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      author:
        "作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者作者",
      authorPhoto: new URL(`image${getRandomInt(0, 3)}.png`, location.href)
        .href,
      cover: new URL(`image${getRandomInt(0, 3)}.png`, location.href).href,
      visited: getRandomInt(0, 10000),
    }))
);

/**  不包含最大值，包含最小值 */
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function renderUserInfo({
  curExp,
  totalExp,
  level,
  name,
  profilePhoto,
}: {
  curExp: number;
  totalExp: number;
  level: number;
  name: string;
  profilePhoto: string;
}) {
  document.querySelector<HTMLImageElement>(".user-info .profile-photo")!.src =
    profilePhoto;
  document.querySelector(".user-info .curExp")!.textContent = curExp + "";
  document.querySelector(".user-info .totalExp")!.textContent = totalExp + "";
  document.querySelector(".user-info .level-num")!.textContent = level + "";
  document.querySelector(".user-info .username")!.textContent = name;
  document.querySelector<HTMLDivElement>(".user-info .bar")!.style.width =
    (curExp / totalExp) * 100 + "%";
}

function renderArticleList(
  list: {
    cover: string;
    title: string;
    author: string;
    authorPhoto: string;
    content: string;
    visited: number;
  }[]
) {
  document.querySelector(".card-container")!.innerHTML = list
    .map(
      ({ cover, title, author, authorPhoto, content, visited }) =>
        `<div class="card-wrapper"><div class="card"><section class="cover-container"><img class="cover" src="${cover}" alt="封面" /><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></section><section class="info-container"><div class="profile"><img class="profile-photo" src="${authorPhoto}" alt="头像" /><div class="username">${author}</div></div><div class="title">${title}</div><div class="content">${content}</div></section></div></div>`
    )
    .join("");
}
