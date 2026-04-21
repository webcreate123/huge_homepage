(function setupHomeInterviewFromMicroCms() {
  const interviewWrapper = document.querySelector(".interview__slider .swiper-wrapper");
  if (!interviewWrapper) return;
  const filterType = document.body?.dataset?.interviewType || "";

  const SERVICE_DOMAIN = "0jd49onovl";
  const API_KEY = "P6rvpRFzdA80h8T8D0U1rGtlbfzgxLJoFOzx";
  const ENDPOINT = "interview";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const TYPE_MAP = {
    new: {
      label: "新卒入社",
      className: "interview__category--newgrad",
      beforeJobPrefix: "",
    },
    mid: {
      label: "中途入社",
      className: "interview__category--career",
      beforeJobPrefix: "前職:",
    },
    staff: {
      label: "スタッフ入社→社員",
      className: "interview__category--entry",
      beforeJobPrefix: "前職:",
    },
  };

  const toCategory = (item) => {
    const key = Array.isArray(item?.Type) ? item.Type[0] : "";
    return TYPE_MAP[key] || { label: "社員インタビュー", className: "", beforeJobPrefix: "前職:" };
  };

  const createInterviewItemHtml = (item, index) => {
    const category = toCategory(item);
    const title = escapeHtml(item?.Title || "");
    const keyword = escapeHtml(item?.Keyword || "");
    const beforeJob = escapeHtml(item?.BeforeJob || "");
    const videoUrl = escapeHtml(item?.Url || "");
    const poster = `img/interview_img${index + 1}.png`;
    const beforeJobText = beforeJob ? `${category.beforeJobPrefix}${beforeJob}` : "";

    if (!title || !keyword || !videoUrl) return "";

    return `
      <div class="swiper-slide interview__item js-interview-modal-trigger" role="button" tabindex="0" aria-label="インタビュー詳細を開く">
        <div class="interview__video">
          <video src="${videoUrl}" muted loop playsinline poster="${poster}"></video>
          <span class="interview__btn">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0ZM34 51L53 40L34 29V51Z" fill="#FFD700"/>
            </svg>
          </span>
        </div>
        <div class="interview__main">
          <div class="interview__category-list">
            <span class="interview__category ${category.className}">${category.label}</span>
            ${beforeJobText ? `<span class="interview__category">${beforeJobText}</span>` : ""}
          </div>
          <div class="interview__txt">
            <p>${title}</p>
          </div>
        </div>
        <div class="interview__name">${keyword}</div>
      </div>
    `;
  };

  try {
    const url = new URL(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}`);
    url.searchParams.set("limit", "10");
    url.searchParams.set("orders", "publishedAt");

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url.toString(), false);
    xhr.setRequestHeader("X-MICROCMS-API-KEY", API_KEY);
    xhr.send();

    if (xhr.status < 200 || xhr.status >= 300) {
      throw new Error(`microCMS interview response status: ${xhr.status}`);
    }

    const response = JSON.parse(xhr.responseText || "{}");
    const sourceItems = Array.isArray(response?.contents) ? response.contents : [];
    const items = filterType
      ? sourceItems.filter((item) => Array.isArray(item?.Type) && item.Type.includes(filterType))
      : sourceItems;
    const rendered = items.map((item, index) => createInterviewItemHtml(item, index)).join("");
    if (!rendered) return;

    interviewWrapper.innerHTML = rendered;
  } catch (error) {
    console.error("microCMS INTERVIEW fetch failed:", error);
  }
})();
