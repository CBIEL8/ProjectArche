// JavaScript for YouTube player with scrolling transcript
let player;
let transcriptTimer;

// Example transcript data with word-level timing
const exampleTranscript = [
  { start: 0.0, end: 0.5, text: 'Hello' },
  { start: 0.5, end: 1.2, text: 'world' },
  { start: 1.2, end: 1.8, text: 'this' },
  { start: 1.8, end: 2.2, text: 'is' },
  { start: 2.2, end: 2.8, text: 'a' },
  { start: 2.8, end: 3.5, text: 'test.' }
];

function extractVideoID(url) {
  const regex = /(?:v=|\/embed\/|\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function renderTranscript(words) {
  const container = document.getElementById('transcript');
  container.innerHTML = '';
  words.forEach(w => {
    const span = document.createElement('span');
    span.textContent = w.text + ' ';
    span.dataset.start = w.start;
    span.dataset.end = w.end;
    container.appendChild(span);
  });
}

function updateTranscriptHighlight() {
  if (!player || typeof player.getCurrentTime !== 'function') return;
  const time = player.getCurrentTime();
  const spans = document.querySelectorAll('#transcript span');
  let current = null;
  spans.forEach(span => {
    const start = parseFloat(span.dataset.start);
    const end = parseFloat(span.dataset.end);
    if (time >= start && time < end) {
      current = span;
      span.classList.add('highlight');
    } else {
      span.classList.remove('highlight');
    }
  });
  if (current) {
    current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function startTranscriptSync() {
  clearInterval(transcriptTimer);
  transcriptTimer = setInterval(updateTranscriptHighlight, 100);
}

function onPlayerReady() {
  renderTranscript(exampleTranscript);
  startTranscriptSync();
}

function loadVideo() {
  const url = document.getElementById('videoURL').value.trim();
  const videoId = extractVideoID(url);
  if (videoId) {
    if (player) {
      player.loadVideoById(videoId);
    } else {
      player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: videoId,
        events: { onReady: onPlayerReady }
      });
    }
  } else {
    const container = document.getElementById('player');
    container.textContent = 'Invalid YouTube URL';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loadVideo').addEventListener('click', loadVideo);
});
