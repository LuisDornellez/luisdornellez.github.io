(() => {
  const audio = document.getElementById('musica');
  const player = document.getElementById('player');
  const boton = document.getElementById('botonMusica');
  const barra = document.getElementById('progreso');
  const relleno = document.getElementById('progresoBarra');
  const tiempo = document.getElementById('tiempo');
  if (!audio || !boton) return;

  const fmt = s => Number.isFinite(s)
    ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0')
    : '0:00';

  const setEstado = sonando => {
    boton.textContent = sonando ? '❚❚' : '▶';
    boton.setAttribute('aria-label', sonando ? 'Pausar música' : 'Reproducir música');
  };

  boton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setEstado(true)).catch(() => setEstado(false));
    } else {
      audio.pause();
      setEstado(false);
    }
  });

  audio.addEventListener('timeupdate', () => {
    const d = audio.duration;
    const t = audio.currentTime;
    const p = d ? (t / d) * 100 : 0;
    relleno.style.width = p + '%';
    barra.setAttribute('aria-valuenow', Math.round(p));
    tiempo.textContent = fmt(t) + (d ? ' / ' + fmt(d) : '');
  });

  audio.addEventListener('ended', () => {
    setEstado(false);
    audio.currentTime = 0;
  });

  // Si el archivo de audio no existe o no carga, se oculta el reproductor
  audio.addEventListener('error', () => { player.hidden = true; });

  barra.addEventListener('click', e => {
    if (!audio.duration) return;
    const r = barra.getBoundingClientRect();
    const f = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    audio.currentTime = f * audio.duration;
  });

  barra.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') audio.currentTime += 5;
    if (e.key === 'ArrowLeft') audio.currentTime -= 5;
  });
})();
