window.addEventListener("load", async () => {
  const resultDiv = document.getElementById('result');
  try {
    applyTranslations();
    
    await loadSettings();
    
    const tabs = await getTabs();
    updateDisplay(tabs);
    
    document.querySelectorAll('input[name="format"], #use-json-formatting, #use-empty-lines').forEach(input => {
      input.addEventListener('change', () => {
        updateDisplay(tabs);
        saveSettings();
      });
    });
    
    document.getElementById('copy-button').addEventListener('click', () => {
      copyToClipboard(formatData(tabs, getSelectedFormat(), useJsonFormatting(), useEmptyLines()));
      const originalText = document.getElementById('copy-button').textContent;
      document.getElementById('copy-button').textContent = getTranslation('copied');
      setTimeout(() => {
        document.getElementById('copy-button').textContent = originalText;
      }, 1500);
    });
    
    toggleOptionsVisibility();
    document.querySelectorAll('input[name="format"]').forEach(radio => {
      radio.addEventListener('change', toggleOptionsVisibility);
    });
  } catch (error) {
    resultDiv.textContent = getTranslation('error') + error.message;
  }
}, { once: true });

function saveSettings() {
  const settings = {
    format: getSelectedFormat(),
    jsonFormatting: useJsonFormatting(),
    emptyLines: useEmptyLines()
  };
  
  chrome.storage.sync.set({ settings });
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('settings', (data) => {
      if (data.settings) {
        const formatRadio = document.querySelector(`input[name="format"][value="${data.settings.format}"]`);
        if (formatRadio) {
          formatRadio.checked = true;
        }
        if (document.getElementById('use-json-formatting')) {
          document.getElementById('use-json-formatting').checked = data.settings.jsonFormatting;
        }
        if (document.getElementById('use-empty-lines')) {
          document.getElementById('use-empty-lines').checked = data.settings.emptyLines;
        }
        toggleOptionsVisibility();
      }
      resolve();
    });
  });
}

async function getTabs() {
  return await new Promise((resolve) => {
    chrome.tabs.query({}, resolve);
  });
}

function getSelectedFormat() {
  return document.querySelector('input[name="format"]:checked').value;
}

function useJsonFormatting() {
  return document.getElementById('use-json-formatting').checked;
}

function useEmptyLines() {
  return document.getElementById('use-empty-lines').checked;
}

function toggleOptionsVisibility() {
  const format = getSelectedFormat();
  const jsonOptions = document.querySelector('.json-options');
  const textOptions = document.querySelector('.text-options');
  const detailsSection = document.querySelector('.details-section');
  const showJsonOptions = format.startsWith('json');
  jsonOptions.style.display = showJsonOptions ? 'block' : 'none';
  const showTextOptions = format.startsWith('text');
  textOptions.style.display = showTextOptions ? 'block' : 'none';
  const hasOptions = showJsonOptions || showTextOptions;
  detailsSection.style.display = hasOptions ? 'block' : 'none';
}

function escapeCSV(str) {
  if (!str) return '';
  return str.replace(/"/g, '""');
}

function escapeTSV(str) {
  if (!str) return '';
  return str.replace(/\t/g, ' ').replace(/\n/g, ' ');
}
function formatData(tabs, format, useJsonFormatting, useEmptyLines) {
  if (format === 'json-object') {
    const data = tabs.map(tab => ({ title: tab.title, url: tab.url }));
    return JSON.stringify(data, useJsonFormatting ? null : undefined, useJsonFormatting ? 2 : undefined);
  } else if (format === 'json-array') {
    const data = tabs.map(tab => [tab.title, tab.url]);
    return JSON.stringify(data, useJsonFormatting ? null : undefined, useJsonFormatting ? 2 : undefined);
  } else if (format === 'json-url-array') {
    const data = tabs.map(tab => tab.url);
    return JSON.stringify(data, useJsonFormatting ? null : undefined, useJsonFormatting ? 2 : undefined);
  } else if (format === 'csv') {
    const rows = tabs.map(tab => `"${escapeCSV(tab.title)}","${escapeCSV(tab.url)}"`).join('\n');
    return rows + '\n';
  } else if (format === 'tsv') {
    const rows = tabs.map(tab => `${escapeTSV(tab.title)}\t${escapeTSV(tab.url)}`).join('\n');
    return rows + '\n';
  } else if (format === 'text-url-only') {
    const separator = useEmptyLines ? '\n\n' : '\n';
    return tabs.map(tab => tab.url).join(separator) + '\n';
  } else {
    const separator = useEmptyLines ? '\n\n' : '\n';
    return tabs.map(tab => `${tab.title}\n${tab.url}`).join(separator) + '\n';
  }
}

function updateDisplay(tabs) {
  const format = getSelectedFormat();
  const jsonFormatting = useJsonFormatting();
  const emptyLines = useEmptyLines();
  const formattedData = formatData(tabs, format, jsonFormatting, emptyLines);
  document.getElementById('result').textContent = formattedData;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("failed to copy to clipbard:", err);
    // fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

