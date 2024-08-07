import "./style.less";
import Macy from "macy";

// @ts-ignore
LA.init({
  id: "3J6dEY8wQU3ZxACy",
  ck: "3J6dEY8wQU3ZxACy",
  autoTrack: true,
  prefix: "inter-knot/event",
});

(async () => {
  if (!(localStorage.getItem("access_token")?.startsWith("ghu_") ?? false)) {
    if (new URL(location.href).searchParams.has("code")) {
      try {
        await getAccessToken(new URL(location.href).searchParams.get("code")!);
      } catch {
        getCode();
      }
    } else {
      getCode();
    }
  }

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

  try {
    const userInfo = await getUserInfo(localStorage.getItem("access_token")!);
    render({ userInfo });
  } catch {
    try {
      await refreshAccessToken(localStorage.getItem("refresh_token")!);
      const userInfo = await getUserInfo(localStorage.getItem("access_token")!);
      render({ userInfo });
    } catch {
      getCode();
    }
  }

  getDiscussions(localStorage.getItem("access_token")!);

  function render({
    userInfo,
  }: {
    userInfo: {
      name: string;
      avatar_url: string;
      html_url: string;
      public_repos: number;
    };
  }) {
    renderUserInfo({
      curExp: 6982,
      totalExp: 10000,
      level: userInfo.public_repos,
      name: userInfo.name,
      profilePhoto: userInfo.avatar_url,
      url: userInfo.html_url,
    });
    // renderArticleList([]);
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
    }[]
  ) {
    document.querySelector(".card-container")!.innerHTML = list
      .map(
        ({ cover, title, author, authorPhoto, content, visited }) =>
          `<div class="card-wrapper"><div class="card"><section class="cover-container"><img class="cover" src="${cover}" alt="封面" /><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></section><section class="info-container"><div class="profile"><img class="profile-photo" src="${authorPhoto}" alt="头像" /><div class="username">${author}</div></div><div class="title">${title}</div><div class="content">${content}</div></section></div></div>`
      )
      .join("");
    document
      .querySelectorAll(".card-container img")
      .forEach((e) =>
        e.addEventListener("load", () => macy.recalculate(true), { once: true })
      );
    document.querySelectorAll(".card-container .card").forEach((e, i) => {
      const { cover, title, author, authorPhoto, content, visited } = list[i];
      e.addEventListener("click", () => {
        renderPopup({
          cover,
          title,
          author,
          authorPhoto,
          content,
          visited,
          comments: [],
        });
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
  }: {
    authorPhoto: string;
    author: string;
    visited: number;
    cover: string;
    title: string;
    content: string;
    comments: {
      profilePhoto: string;
      name: string;
      text: string;
    }[];
  }) {
    popupContainer.innerHTML = `<div class="popup"><header><img class="profile-photo" src="${authorPhoto}" alt="头像" /><div><div>${author}</div><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></div><div class="close-btn"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="m12 10.587l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.415 1.414l-4.95-4.95l-4.949 4.95l-1.414-1.415l4.95-4.95l-4.95-4.95L7.05 5.638z" /></svg></div></header><main><div class="cover"><img src="${cover}" alt="封面" /></div><div class="content"><div class="title">${title}</div><div class="text">${content}</div><div class="comments">${comments
      .map(
        (e) =>
          `<section class="comment"><img class="profile-photo" src="${e.profilePhoto}" alt="头像" /><div><div class="name">${e.name}</div><div class="text">${e.text}</div></div></section>`
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
    const res = await fetch(
      `https://github.com/login/oauth/access_token?client_id=Iv23li8gf1MxGAgvw5lU&client_secret=3ea999c0e2d7283f602ab4994cc684ada2eeec2b&code=${code}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    ).then((e) => e.json());
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
    const res = await fetch(
      `https://github.com/login/oauth/access_token?client_id=Iv23li8gf1MxGAgvw5lU&client_secret=3ea999c0e2d7283f602ab4994cc684ada2eeec2b&grant_type=refresh_token&refresh_token=${refresh_token}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    ).then((e) => e.json());
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

  async function getDiscussions(access_token: string): Promise<any> {
    console.log(
      await graphql({
        access_token,
        data: `
        query {
          repository(owner: "share121", name: "inter-knot") {
            discussions {
              nodes {
                author {
                  avatarUrl
                  login
                  url
                }
                bodyHTML
                title
                comments {
                  nodes {
                    author {
                      avatarUrl
                      login
                      url
                    }
                    bodyHTML
                  }
                }
              }
            }
          }
        }
      `,
      })
    );
  }

  function graphql({
    access_token,
    data,
  }: {
    access_token: string;
    data: string;
  }) {
    return fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify({ query: data }),
    }).then((e) => e.json());
  }
})();
