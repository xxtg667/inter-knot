import "./style.less";
// @ts-ignore
import Macy from "macy";
import img from "/img.svg?url";
import closeBtn from "/close.svg?raw";

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

const popupContainer = document.querySelector(".popup-container")!;
popupContainer.addEventListener("click", (e) => {
  if (e.target === popupContainer) {
    popupContainer.classList.remove("open");
    popupContainer.classList.add("closed");
  }
});

const macy = Macy({
  container: ".card-container",
  columns: 5,
  margin: { x: 0, y: 0 },
});

setTimeout(() => {
  if (typeof window.GM_xmlhttpRequest === "undefined") {
    alert("请先安装“绳网跨域助手”");
    location.href = "https://greasyfork.org/zh-CN/scripts/502874";
  }
}, 3000);

window.run = async () => {
  if (!(localStorage.getItem("access_token")?.startsWith("ghu_") ?? false)) {
    if (new URL(location.href).searchParams.has("code")) {
      try {
        await getAccessToken(new URL(location.href).searchParams.get("code")!);
      } catch {
        getCode();
      }
    } else getCode();
  }

  handleErr(async () => {
    const userInfo = await getUserInfo(localStorage.getItem("access_token")!);
    renderUserInfo({
      curExp: 6982,
      totalExp: 10000,
      level: userInfo.public_repos,
      name: userInfo.name,
      profilePhoto: userInfo.avatar_url,
      url: userInfo.html_url,
    });
  });

  handleErr(async () => {
    const nodes = await getDiscussions(localStorage.getItem("access_token")!);
    renderArticleList(
      nodes.map((e) => {
        const dom = html2dom(e.bodyHTML);
        const cover = dom?.querySelector<HTMLImageElement>("img")?.src ?? img;
        dom?.querySelector("img")?.remove();
        return {
          cover: cover,
          authorPhoto: e.author.avatarUrl,
          title: e.title,
          author: e.author.login,
          content: dom?.outerHTML!,
          text: e.bodyText,
          url: e.url + "#new_comment_form",
          visited: getRandomInt(0, 1001),
          comments: e.comments.nodes.map((e) => ({
            profilePhoto: e.author.avatarUrl,
            name: e.author.login,
            content: e.bodyHTML,
          })),
        };
      })
    );
  });
};

async function handleErr(fn: Function) {
  try {
    await fn();
  } catch (e) {
    console.error(e);
    try {
      await refreshAccessToken(localStorage.getItem("refresh_token")!);
      await fn();
    } catch (e) {
      console.error(e);
      getCode();
    }
  }
}

function request<T>(
  prop: Partial<{
    method: "GET" | "HEAD" | "POST";
    url: string | URL;
    headers: Record<string, string>;
    data: string | Blob | File | Object | Array<T> | FormData | URLSearchParams;
    responseType: "arraybuffer" | "blob" | "stream" | "json";
  }>
) {
  return new Promise<{
    finalUrl: string;
    response: any;
    responseHeaders: Record<string, string>;
    responseText: string;
  }>((resolve, reject) => {
    GM_xmlhttpRequest({
      ...prop,
      onload: resolve,
      onerror: reject,
    });
  });
}

function html2dom(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.firstElementChild;
}

function renderUserInfo({
  curExp,
  totalExp,
  level,
  name,
  profilePhoto,
  url,
}: {
  curExp: number;
  totalExp: number;
  level: number;
  name: string;
  profilePhoto: string;
  url: string;
}) {
  document.querySelector<HTMLAnchorElement>(".user-info")!.href = url;
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
    text: string;
    url: string;
    comments: {
      profilePhoto: string;
      name: string;
      content: string;
    }[];
  }[]
) {
  document.querySelector(".card-container")!.innerHTML = list
    .map(
      ({ cover, title, author, authorPhoto, text, visited }) =>
        `<div class="card-wrapper"><div class="card"><section class="cover-container"><img class="cover" src="${cover}" alt="封面" loading="lazy" /><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></section><section class="info-container"><div class="profile"><img class="profile-photo" src="${authorPhoto}" alt="头像" loading="lazy" /><div class="username">${author}</div></div><div class="title">${title}</div><div class="content">${text}</div></section></div></div>`
    )
    .join("");
  document.querySelectorAll(".card-container img").forEach((e) =>
    e.addEventListener("load", () => macy.recalculate(true), {
      once: true,
    })
  );
  document.querySelectorAll(".card-container .card").forEach((e, i) => {
    e.addEventListener("click", () => {
      renderPopup(list[i]);
    });
  });
}

function renderPopup({
  authorPhoto,
  author,
  visited,
  cover,
  title,
  content,
  comments,
  url,
}: {
  authorPhoto: string;
  author: string;
  visited: number;
  cover: string;
  title: string;
  content: string;
  url: string;
  comments: {
    profilePhoto: string;
    name: string;
    content: string;
  }[];
}) {
  popupContainer.innerHTML = `<div class="popup"><header><img class="profile-photo" src="${authorPhoto}" alt="头像" loading="lazy" /><div><div>${author}</div><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></div><div class="close-btn">${closeBtn}</div></header><main><div class="cover"><img src="${cover}" alt="封面" loading="lazy" /></div><div class="content"><div class="title">${title}</div><div class="text">${content}</div><a class="reply" href="${url}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.243 18.997H21v2H3v-4.243l9.9-9.9l4.242 4.243zm5.07-13.557l2.122-2.121a1 1 0 0 1 1.414 0l2.829 2.828a1 1 0 0 1 0 1.415l-2.122 2.121z"></path></svg>写回复</a><div class="comments">${comments
    .map(
      (e) =>
        `<section class="comment"><img class="profile-photo" src="${e.profilePhoto}" alt="头像" loading="lazy" /><div><div class="name">${e.name}</div><div class="text">${e.content}</div></div></section>`
    )
    .join("")}</div></div></main></div>`;
  document.querySelector(".close-btn")!.addEventListener("click", () => {
    popupContainer.classList.remove("open");
    popupContainer.classList.add("closed");
  });
  popupContainer.classList.remove("closed");
  popupContainer.classList.add("open");
}

function getCode() {
  location.href =
    "https://github.com/login/oauth/authorize?client_id=Iv23li8gf1MxGAgvw5lU";
}

async function getAccessToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: "";
  token_type: "bearer";
}> {
  const { response: res } = await request({
    method: "POST",
    url: `https://github.com/login/oauth/access_token?client_id=Iv23li8gf1MxGAgvw5lU&client_secret=3ea999c0e2d7283f602ab4994cc684ada2eeec2b&code=${code}`,
    headers: {
      accept: "application/json",
    },
    responseType: "json",
  });
  localStorage.setItem("access_token", res.access_token);
  localStorage.setItem("refresh_token", res.refresh_token);
  return res;
}

async function refreshAccessToken(refresh_token: string): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: "";
  token_type: "bearer";
}> {
  const { response: res } = await request({
    method: "POST",
    url: `https://github.com/login/oauth/access_token?client_id=Iv23li8gf1MxGAgvw5lU&client_secret=3ea999c0e2d7283f602ab4994cc684ada2eeec2b&grant_type=refresh_token&refresh_token=${refresh_token}`,
    headers: {
      accept: "application/json",
    },
    responseType: "json",
  });
  localStorage.setItem("access_token", res.access_token);
  localStorage.setItem("refresh_token", res.refresh_token);
  return res;
}

async function getUserInfo(access_token: string): Promise<{
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}> {
  const { data } = await graphql({
    access_token,
    data: "query { viewer { avatarUrl login repositories { totalCount } } }",
  });
  return {
    name: data.viewer.login,
    avatar_url: data.viewer.avatarUrl,
    html_url: `https://github.com/${data.viewer.login}`,
    public_repos: data.viewer.repositories.totalCount,
  };
}

async function getDiscussions(access_token: string) {
  const {
    data: {
      repository: {
        discussions: { nodes },
      },
    },
  }: {
    data: {
      repository: {
        discussions: {
          nodes: {
            author: {
              avatarUrl: string;
              login: string;
              url: string;
            };
            bodyHTML: string;
            bodyText: string;
            title: string;
            url: string;
            comments: {
              nodes: {
                author: {
                  avatarUrl: string;
                  login: string;
                  url: string;
                };
                bodyHTML: string;
              }[];
            };
          }[];
        };
      };
    };
  } = await graphql({
    access_token,
    data: 'query { repository(owner: "share121", name: "inter-knot") { discussions(first: 100) { nodes { author { avatarUrl login url } bodyHTML url bodyText title comments(first: 100) { nodes { author { avatarUrl login url } bodyHTML } } } } } }',
  });
  return nodes;
}

/** 不含最大值，含最小值 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

async function graphql({
  access_token,
  data,
}: {
  access_token: string;
  data: string;
}) {
  const { response: res } = await request({
    method: "POST",
    url: "https://api.github.com/graphql",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    responseType: "json",
    data: JSON.stringify({ query: data }),
  });
  return res;
}
