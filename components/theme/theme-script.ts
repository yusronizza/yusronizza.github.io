/**
 * Runs synchronously before paint (inlined into <head>) to apply the saved
 * or system theme and avoid a flash of the wrong theme on load.
 */
export const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || (!stored && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;
