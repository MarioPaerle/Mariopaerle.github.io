(() => {
  if (location.hostname !== 'mariopaerle.github.io') return;

  function count(path, title) {
    if (typeof window.goatcounter?.count !== 'function') return;
    try {
      window.goatcounter.count({ path, title, event: true });
    } catch (_) {}
  }

  const driveFolders = new Map([
    ['1H8RPLpUjnRy4grvidcRvtLt1DuVlx28L', 'downloads'],
    ['1o06ajqFQ5Xg6Qt3SHa7nXkVN21D4fS2B', 'installs'],
    ['1aOazeWahV1ejrFAYoCrjCu5ErglAob9Z', 'bundle'],
    ['1K3xwuBQd_-S2MKIzE9qv2Ba1qsnV8qSm', 'single-packs'],
  ]);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    if (url.hostname !== 'drive.google.com') return;
    const target = driveFolders.get(url.pathname.split('/').pop()) || 'other';
    count(`drive-${target}`, `Drive: ${target}`);
  });

  const played = new WeakSet();
  document.addEventListener('playing', event => {
    const audio = event.target;
    if (!(audio instanceof HTMLAudioElement) || played.has(audio)) return;
    played.add(audio);
    const name = audio.closest('.audio-player')?.dataset.name;
    if (name) count(`audio-${name}`, `Audio: ${name}`);
  }, true);
})();
