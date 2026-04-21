(function setupCareerPickupFromMicroCms() {
  const pickupWrapper = document.querySelector(".pickup__content .swiper-wrapper");
  if (!pickupWrapper) return;

  const SERVICE_DOMAIN = "0jd49onovl";
  const API_KEY = "P6rvpRFzdA80h8T8D0U1rGtlbfzgxLJoFOzx";
  const ENDPOINT = "pick_up";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const createPickupItemHtml = (item) => {
    const href = item?.url ? escapeHtml(item.url) : "#";
    const imageUrl = item?.image_url?.url ? escapeHtml(item.image_url.url) : "";
    const imageAlt = escapeHtml(item?.name_jp || item?.name_en || "店舗画像");
    const nameEn = escapeHtml(item?.name_en || "");
    const nameEnSm = escapeHtml(item?.name_en_sm || "");
    const nameJp = escapeHtml(item?.name_jp || "");
    const title = escapeHtml(item?.title || "");
    const role = escapeHtml(item?.Role || "");
    const content = escapeHtml(item?.content || "");

    if (!nameEn || !nameJp || !title || !role || !content) return "";

    return `
      <a class="swiper-slide pickup__item" href="${href}" target="_blank" rel="noopener noreferrer">
        <div class="pickup__top">
          <div class="pickup__img">
            ${imageUrl ? `<img src="${imageUrl}" alt="${imageAlt}" loading="lazy">` : ""}
          </div>
          <div class="pickup__link">
            <span class="pickup__link-txt">この店舗の求人を見る</span>
            <span class="pickup__link-arrow">
              <svg viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.78794 0.586281L10.3044 4.10275L6.78794 7.61922M9.86485 4.10275L0.41434 4.10275" stroke="#333333" stroke-width="0.829225" stroke-linecap="square" />
              </svg>
            </span>
          </div>
        </div>
        <div class="pickup__category-list">
          <div class="pickup__category">PICK UP</div>
          <div class="pickup__category">積極募集中</div>
          <div class="pickup__category">オープニング</div>
        </div>
        <div class="pickup__main">
          <div class="pickup__name">
            <span class="pickup__name-en">${nameEn}${nameEnSm ? `<span>${nameEnSm}</span>` : ""}</span>
            <span class="pickup__name-jp">${nameJp}</span>
          </div>
          <div class="pickup__message">
            <div class="pickup__message-tab">${title}</div>
            <div class="pickup__message-content">
              <div class="pickup__message-label">${role}</div>
              <div class="pickup__message-txt">
                <p>${content}</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
  };

  try {
    const url = new URL(`https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}`);
    url.searchParams.set("orders", "-publishedAt");
    url.searchParams.set("limit", "10");

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url.toString(), false);
    xhr.setRequestHeader("X-MICROCMS-API-KEY", API_KEY);
    xhr.send();

    if (xhr.status < 200 || xhr.status >= 300) {
      throw new Error(`microCMS pick_up response status: ${xhr.status}`);
    }

    const response = JSON.parse(xhr.responseText || "{}");
    const items = Array.isArray(response?.contents) ? response.contents : [];
    const rendered = items.map((item) => createPickupItemHtml(item)).join("");
    if (!rendered) return;

    pickupWrapper.innerHTML = rendered;
  } catch (error) {
    console.error("microCMS PICK UP fetch failed:", error);
  }
})();
