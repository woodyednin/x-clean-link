(function () {
  const statusUrl = /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/\w+\/status\/\d+/i;

  function clean(url) {
    return url.replace(/\?.*$/, '');
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    const original = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = function (text) {
      if (typeof text === 'string' && statusUrl.test(text)) {
        text = clean(text);
      }
      return original(text);
    };
  }

  const originalExec = document.execCommand.bind(document);
  document.execCommand = function (command, ...args) {
    if (command === 'copy') {
      const sel = window.getSelection()?.toString() || '';
      if (statusUrl.test(sel)) {
        navigator.clipboard?.writeText(clean(sel));
        return true;
      }
    }
    return originalExec(command, ...args);
  };
})();
