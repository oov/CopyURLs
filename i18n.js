const translations = {
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
};

function getTranslation(key) {
  return translations[key] || key;
}

function applyTranslations() {
  const userLanguage = navigator.language || navigator.userLanguage;
  const isJapanese = userLanguage.startsWith('ja');
  if (isJapanese) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });
  }
}
