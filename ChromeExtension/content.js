const targetClasses = [
  "x1i10hfl", "xjbqb8w", "x1ejq31n", "xd10rxx", "x1sy0etr", "x17r0tee",
  "x972fbf", "xcfux6l", "x1qhh985", "xm0m39n", "x9f619", "x1ypdohk",
  "xe8uvvx", "xdj266r", "x11i5rnm", "xat24cr", "x1mh8g0r", "xexx8yu",
  "x4uap5", "x18d9i69", "xkhd6sd", "x16tdsg8", "x1hl2dhg", "xggy1nq",
  "x1a2a7pz", "xjp7ctv", "xeq5yr9", "_a6hd"
];

const classSelector = targetClasses.map(cls => `.${cls}`).join("");

const anchors = Array.from(document.querySelectorAll(`a${classSelector}`));

anchors.map(anchor => ({
  html: anchor.outerHTML,
  href: anchor.getAttribute("href")
}));
