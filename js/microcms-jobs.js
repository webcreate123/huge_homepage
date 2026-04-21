(function setupPartTimeJobsFromMicroCms() {
  const jobsList = document.querySelector(".parttime__job .job__category-list");
  if (!jobsList) return;

  const SERVICE_DOMAIN = "0jd49onovl";
  const API_KEY = "P6rvpRFzdA80h8T8D0U1rGtlbfzgxLJoFOzx";
  const ENDPOINT = "jobs";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const toMultilineHtml = (value) =>
    escapeHtml(value)
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n/g, "<br>");

  const createJobItemHtml = (item) => {
    const text = item?.txt ? toMultilineHtml(item.txt) : "";
    const href = item?.url ? escapeHtml(item.url) : "#";
    const openInNewTab = /^https?:\/\//.test(item?.url || "");

    if (!text) return "";

    return `
      <a class="job__category" href="${href}"${openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="job__category-txt">${text}</span>
        <span class="job__category-arrow">
          <svg viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.3348 0.706869L11.106 4.47811L7.3348 8.24934M10.6346 4.47811L0.499434 4.47811" stroke="white" stroke-linecap="square"/>
          </svg>
        </span>
      </a>
    `;
  };

  fetch(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?limit=50&orders=-publishedAt`, {
    headers: {
      "X-MICROCMS-API-KEY": API_KEY,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`microCMS jobs response status: ${res.status}`);
      }
      return res.json();
    })
    .then((response) => {
      const items = Array.isArray(response?.contents) ? response.contents : [];
      const rendered = items.map((item) => createJobItemHtml(item)).join("");
      if (!rendered) return;
      jobsList.innerHTML = rendered;
    })
    .catch((error) => {
      console.error("microCMS JOBS fetch failed:", error);
    });
})();
