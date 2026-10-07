const players = [...document.querySelectorAll('.audio-player')];
const clock = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

for (const player of players) {
  const audio = player.querySelector('audio');
  const controls = player.querySelector('.audio-controls');
  const toggle = player.querySelector('.audio-toggle');
  const mute = player.querySelector('.audio-mute');
  const seek = player.querySelector('.audio-seek');
  const waveform = player.querySelector('.audio-waveform');
  const current = player.querySelector('.audio-current');
  const durationLabel = player.querySelector('.audio-duration');
  const status = player.querySelector('.audio-status');
  const name = player.dataset.name;
  let duration = Number(player.dataset.duration);
  let pendingSeek = null;
  let pointerId = null;
  let failed = false;

  function seekTo(seconds) {
    const target = Math.max(0, Math.min(duration, seconds));
    if (audio.readyState >= 1) audio.currentTime = target;
    else pendingSeek = target;
    seek.value = target;
    current.textContent = clock(target);
    player.style.setProperty('--progress', `${duration ? target / duration * 100 : 0}%`);
  }

  function seekAtPointer(event) {
    const bounds = waveform.getBoundingClientRect();
    if (bounds.width) seekTo((event.clientX - bounds.left) / bounds.width * duration);
  }

  waveform.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointerId !== null) return;
    event.preventDefault();
    pointerId = event.pointerId;
    seek.focus({ preventScroll: true });
    waveform.setPointerCapture(pointerId);
    seekAtPointer(event);
  });
  waveform.addEventListener('pointermove', event => {
    if (event.pointerId === pointerId) seekAtPointer(event);
  });
  waveform.addEventListener('pointerup', event => {
    if (event.pointerId !== pointerId) return;
    seekAtPointer(event);
    waveform.releasePointerCapture(pointerId);
    pointerId = null;
    update();
  });
  waveform.addEventListener('pointercancel', () => { pointerId = null; });

  function update() {
    const position = pendingSeek ?? audio.currentTime;
    current.textContent = clock(position);
    if (pointerId === null && pendingSeek === null) seek.value = audio.currentTime;
    seek.setAttribute('aria-valuetext', `${clock(position)} of ${clock(duration)}`);
    player.style.setProperty('--progress', `${duration ? position / duration * 100 : 0}%`);
    toggle.firstElementChild.textContent = failed ? '↻' : audio.paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', `${failed ? 'Retry' : audio.paused ? 'Play' : 'Pause'} ${name}`);
  }

  function showError() {
    failed = true;
    status.hidden = false;
    status.textContent = 'Audio could not be loaded. Press Retry to load it again.';
    audio.controls = true;
    update();
  }

  controls.hidden = false;
  audio.controls = false;
  durationLabel.textContent = clock(duration);
  toggle.addEventListener('click', async () => {
    if (!audio.paused) audio.pause();
    else {
      if (failed || audio.error) {
        failed = false;
        status.hidden = true;
        audio.controls = false;
        const source = new URL(audio.src, document.baseURI);
        source.searchParams.set('retry', String(Date.now()));
        audio.src = source.href;
        audio.load();
      }
      try { await audio.play(); }
      catch (error) {
        if (error.name !== 'AbortError') showError();
        else update();
      }
    }
  });
  audio.addEventListener('play', () => {
    for (const other of players) {
      const otherAudio = other.querySelector('audio');
      if (otherAudio !== audio) otherAudio.pause();
    }
    update();
  });
  audio.addEventListener('pause', update);
  audio.addEventListener('ended', update);
  audio.addEventListener('timeupdate', update);
  audio.addEventListener('seeked', update);
  audio.addEventListener('error', showError);
  audio.addEventListener('loadedmetadata', () => {
    failed = false;
    status.hidden = true;
    audio.controls = false;
    if (Number.isFinite(audio.duration)) duration = audio.duration;
    seek.max = duration;
    if (pendingSeek !== null) {
      audio.currentTime = Math.min(duration, pendingSeek);
      pendingSeek = null;
    }
    durationLabel.textContent = clock(duration);
    update();
  });
  seek.addEventListener('input', () => {
    seekTo(Number(seek.value));
    update();
  });
  mute.addEventListener('click', () => {
    audio.muted = !audio.muted;
    mute.textContent = audio.muted ? 'Sound off' : 'Sound on';
    mute.setAttribute('aria-label', `${audio.muted ? 'Unmute' : 'Mute'} ${name}`);
    mute.setAttribute('aria-pressed', String(audio.muted));
  });
  update();
}
