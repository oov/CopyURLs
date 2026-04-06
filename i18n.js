const translations = {
  en: {
    copyButton: "Copy All Tabs to Clipboard",
    copied: "Copied!",
    format: "Format",
    textUrlOnly: "Text (URLs Only)",
    textWithTitle: "Text (Title + URL)",
    jsonUrlArray: "JSON (URL Array)",
    jsonArray: "JSON (2D Array)",
    jsonObject: "JSON (Object Array)",
    csv: "CSV",
    tsv: "TSV",
    options: "Options",
    emptyLines: "Add Empty Lines",
    formatting: "Pretty Print",
    error: "An error occurred: ",
  },
  ja: {
    copyButton: "全てのタブをクリップボードにコピー",
    copied: "コピーしました！",
    format: "フォーマット",
    textUrlOnly: "テキスト（URLのみ）",
    textWithTitle: "テキスト（タイトル+URL）",
    jsonUrlArray: "JSON（URL配列）",
    jsonArray: "JSON（二次元配列）",
    jsonObject: "JSON（オブジェクト配列）",
    csv: "CSV",
    tsv: "TSV",
    options: "オプション",
    emptyLines: "空行を追加",
    formatting: "整形して表示",
    error: "エラーが発生しました: ",
  },
};

function getUserLanguageCode() {
  const userLanguage = navigator.language || navigator.userLanguage || '';
  return userLanguage.toLowerCase().replace(/-/g, '_');
}

function findTranslation(key, languageCode = getUserLanguageCode()) {
  if (!languageCode) {
    return undefined;
  }
  const primaryLanguage = languageCode.split('_')[0];
  return translations[languageCode]?.[key] || translations[primaryLanguage]?.[key];
}

function getTranslation(key) {
  return findTranslation(key) || key;
}

function applyTranslations() {
  const languageCode = getUserLanguageCode();
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = findTranslation(key, languageCode);
    if (translation) {
      element.textContent = translation;
    }
  });
}
