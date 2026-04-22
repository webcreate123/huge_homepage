function setupHomeNewsFromMicroCms() {
  const newsList = document.querySelector(".home__news .news__list");
  if (!newsList) return;

  const SERVICE_DOMAIN = "0jd49onovl";
  const API_KEY = "P6rvpRFzdA80h8T8D0U1rGtlbfzgxLJoFOzx";
  const ENDPOINT = "blogs";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const toDateText = (item) => {
    const raw = item.date || item.publishedAt || item.createdAt;
    if (!raw) return "";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  const createNewsItemHtml = (item) => {
    const title = escapeHtml(item.title || item.name || "");
    const date = escapeHtml(toDateText(item));
    const href = item.url || item.link || "";
    const hasLink = !!href;

    if (!title) return "";

    if (!hasLink) {
      return `
        <li class="news__item news__item--nolink">
          <div class="news__link">
            <div class="news__main">
              <time class="news__date">${date}</time>
              <h3 class="news__article">${title}</h3>
            </div>
          </div>
        </li>
      `;
    }

    return `
      <li class="news__item">
        <a class="news__link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
          <div class="news__main">
            <time class="news__date">${date}</time>
            <h3 class="news__article">${title}</h3>
          </div>
          <div class="news__arrow">
            <svg viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4365 0.707163L17.4705 6.74114L11.4365 12.7751M16.7163 6.74114L0.499948 6.74114" stroke="white" stroke-linecap="square"/>
            </svg>
          </div>
        </a>
      </li>
    `;
  };

  const url = new URL(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}`);
  url.searchParams.set("limit", "3");
  // url.searchParams.set("orders", "-publishedAt");
  url.searchParams.set("filters", "category[equals]0i1mnp82jk79");

  fetch(url.toString(), {
    headers: {
      "X-MICROCMS-API-KEY": API_KEY,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`microCMS response status: ${res.status}`);
      }
      return res.json();
    })
    .then((response) => {
      const items = Array.isArray(response?.contents) ? response.contents : [];
      const rendered = items.map((item) => createNewsItemHtml(item)).join("");
      if (!rendered) return;
      newsList.innerHTML = rendered;
    })
    .catch((error) => {
      console.error("microCMS NEWS fetch failed:", error);
    });
}
