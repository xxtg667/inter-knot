import "./style.less";
// @ts-ignore
import Macy from "macy";
import img from "/img.svg?url";
import closeBtn from "/close.svg?raw";
import DOMPurify from "dompurify";

function xss(html: string) {
  return DOMPurify.sanitize(html);
}

// @ts-ignore
LA.init({
  id: "3J6dEY8wQU3ZxACy",
  ck: "3J6dEY8wQU3ZxACy",
  autoTrack: true,
  prefix: "event",
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

async function handleErr(fn: Function) {
  await fn();
}
window.run = async () => {
  handleErr(async () => {
    renderUserInfo({
      curExp: 114514,
      totalExp: 114514,
      level: 70,
      name: "法厄同",
      profilePhoto: "https://static-pages.xxtg666.top/zzz_avatar.jpg",
      url: "https://www.bilibili.com/video/BV1n5YsejE8o",
    });
  });

  handleErr(async () => {
    const nodes = await getDiscussions();
    console.log(nodes);
    renderArticleList(
      nodes.map((e) => {
        const dom = html2dom(e.bodyHTML);
        const firstImg = dom.content?.querySelector("img");
        const cover = firstImg?.src ?? img;
        let parent = firstImg?.parentElement;
        firstImg?.remove();
        while (parent instanceof HTMLElement && parent.children.length == 0) {
          parent?.remove();
          parent = parent.parentElement;
        }
        return {
          cover: cover,
          authorPhoto: e.author.avatarUrl,
          title: e.title,
          author: e.author.login,
          content: dom.innerHTML,
          text: e.bodyText,
          authorUrl: e.author.url,
          commentUrl: e.commentUrl,
          visited: getRandomInt(0, 1001),
          comments: e.comments.nodes.map((e) => ({
            profilePhoto: e.author.avatarUrl,
            name: e.author.login,
            content: e.bodyHTML,
            authorUrl: e.author.url,
          })),
        };
      })
    );
  });
};
function html2dom(html: string) {
  let template = document.createElement("template");
  template.innerHTML = html;
  return template;
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
    authorUrl: string;
    commentUrl: string;
    comments: {
      profilePhoto: string;
      name: string;
      content: string;
      authorUrl: string;
    }[];
  }[]
) {
  document.querySelector(".card-container")!.innerHTML = list
    .map(
      ({ cover, title, author, authorPhoto, text, visited }) =>
        `<div class="card-wrapper"><div class="card"><section class="cover-container"><img class="cover" src="${cover}" alt="封面" loading="lazy" /><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></section><section class="info-container"><div class="profile"><img class="profile-photo" src="${authorPhoto}" alt="头像" loading="lazy" /><div class="username">${author}</div></div><div class="title">${title}</div><div class="content">${text}</div></section></div></div>`
    )
    .join("");
  document
    .querySelectorAll<HTMLImageElement>(".card-container img")
    .forEach((e) => {
      e.addEventListener("load", () => macy.recalculate(true));
      e.addEventListener("error", () => (e.src = img), { once: true });
    });
  document.querySelectorAll(".card-container .card").forEach((e, i) => {
    e.addEventListener("click", () => {
      renderPopup(list[i]);
    });
  });
}

function renderPopup({
  authorPhoto,
  author,
  authorUrl,
  visited,
  cover,
  title,
  content,
  comments,
  commentUrl,
}: {
  authorPhoto: string;
  author: string;
  authorUrl: string;
  visited: number;
  cover: string;
  title: string;
  content: string;
  commentUrl: string;
  comments: {
    profilePhoto: string;
    name: string;
    content: string;
    authorUrl: string;
  }[];
}) {
  popupContainer.innerHTML = `<div class="popup"><header><a target="_blank" href="${authorUrl}"><img class="profile-photo" src="${authorPhoto}" alt="头像" loading="lazy" /></a><div><a target="_blank" href="${authorUrl}">${author}</a><div class="visited"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" ><path fill="currentColor" d="M1.182 12C2.122 6.88 6.608 3 12 3s9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0-2a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>${visited}</div></div><div class="close-btn">${closeBtn}</div></header><main><div class="cover"><img src="${cover}" alt="封面" loading="lazy" /></div><div class="content"><div class="title">${title}</div><div class="text markdown-body">${content}</div><a class="reply" href="${commentUrl}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.243 18.997H21v2H3v-4.243l9.9-9.9l4.242 4.243zm5.07-13.557l2.122-2.121a1 1 0 0 1 1.414 0l2.829 2.828a1 1 0 0 1 0 1.415l-2.122 2.121z"></path></svg>写回复</a><div class="comments">${comments
    .map(
      (e) =>
        `<section class="comment"><a target="_blank" href="${e.authorUrl}"><img class="profile-photo" src="${e.profilePhoto}" alt="头像" loading="lazy" /></a><div><div class="name"><a target="_blank" href="${e.authorUrl}">${e.name}</a></div><div class="text markdown-body">${e.content}</div></div></section>`
    )
    .join("")}</div></div></main></div>`;
  popupContainer
    .querySelectorAll("img")
    .forEach((e) =>
      e.addEventListener("error", () => (e.src = img), { once: true })
    );
  popupContainer.querySelector(".close-btn")!.addEventListener("click", () => {
    popupContainer.classList.remove("open");
    popupContainer.classList.add("closed");
  });
  popupContainer.classList.remove("closed");
  popupContainer.classList.add("open");
}

async function getDiscussions() {
  const {
    data: {
      repository: {
        discussions: { nodes },
      },
    },
  } = await _getDiscussions();
  return nodes
    .map((e) => {
      try {
        return {
          ...e,
          author: {
            ...e.author,
            login: xss(e.author.login),
          },
          title: xss(e.title),
          bodyHTML: xss(e.bodyHTML),
          bodyText: xss(e.bodyText),
          commentUrl: e.url + "#new_comment_form",
          comments: {
            nodes: e.comments.nodes.map((e) => ({
              ...e,
              author: {
                ...e.author,
                login: xss(e.author.login),
              },
              bodyHTML: xss(e.bodyHTML),
            })),
          },
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    })
    .filter((e) => e !== null);
}

/** 不含最大值，含最小值 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
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
  }>(async (resolve, reject) => {
    try {
      const response = await fetch(prop.url.toString(), {
        method: prop.method,
        headers: new Headers(prop.headers),
        body: prop.data instanceof FormData || prop.data instanceof URLSearchParams || typeof prop.data === 'string' || prop.data instanceof Blob || prop.data instanceof File ? prop.data : JSON.stringify(prop.data),
      });

      const responseData = await (function() {
        switch (prop.responseType) {
          case 'arraybuffer':
            return response.arrayBuffer();
          case 'blob':
            return response.blob();
          case 'json':
            return response.json();
          case 'stream':
            return response.body; // Handling stream differently since streams can be read only once
          default:
            return response.text();
        }
      })();

      // Simplify and assume responseText is not needed if other types are used
      resolve({
        finalUrl: response.url,
        response: responseData,
        responseHeaders: Array.from(response.headers.entries()).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>),
        responseText: prop.responseType === 'json' || prop.responseType === 'stream' ? "" : responseData
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function _getDiscussions(){
  const { response: res } = await request({
    method: "GET",
    url: "https://inter-knot-api.xxtg666.top/discussions",
    responseType: "json",
  });
  return res;
}

const i = setInterval(() => {
  if (typeof window.run === "function") {
    window.run();
    clearInterval(i);
  }
}, 1000);
