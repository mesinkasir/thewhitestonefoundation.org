export function registerShortcodes(eleventyConfig) {
  
  eleventyConfig.addPairedShortcode("logoContainer", (content) => {
    return `<div class="row mt-3 g-4 justify-content-center align-items-stretch">${content}</div>`;
  });

  
  eleventyConfig.addShortcode("logoItem", (url, img, label) => {
    if (!img) return ""; 

    return `
      <div class="col-6 col-sm-6 col-md-6 col-lg-6 d-flex">
        <a href="${url}" class="logo-card" target="_blank" rel="noopener">
          <div class="logo-box">
    <img src="${img}" class="img-fluid" alt="${label}" loading="lazy" style="max-width:100%; max-height:100%; width:auto; height:auto;">
</div>
          <span class="logo-text">${label}</span>
        </a>
      </div>`.trim();
  });
}