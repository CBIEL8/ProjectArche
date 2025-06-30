// JavaScript for YouTube player with scrolling transcript
let player;
let transcriptTimer;
let currentVideoId;

// Attempt to fetch timedtext captions from YouTube
async function fetchTranscript(videoId, lang = 'en') {
  const url =
    'https://cors.isomorphic-git.org/https://video.google.com/timedtext?lang=' +
    encodeURIComponent(lang) +
    '&v=' +
    encodeURIComponent(videoId);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Failed to fetch transcript');
  }
  const xml = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const texts = Array.from(doc.getElementsByTagName('text'));
  return texts.map((node) => {
    const start = parseFloat(node.getAttribute('start')) || 0;
    const dur = parseFloat(node.getAttribute('dur')) || 0;
    return {
      start,
      end: start + dur,
      text: node.textContent.trim(),
    };
  });
}

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

async function onPlayerReady() {
  try {
    const transcript = await fetchTranscript(currentVideoId);
    renderTranscript(transcript);
  } catch (e) {
    console.error('Transcript error', e);
    renderTranscript([]);
  }
  startTranscriptSync();
}

function loadVideo() {
  const url = document.getElementById('videoURL').value.trim();
  const videoId = extractVideoID(url);
  if (videoId) {
    currentVideoId = videoId;
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
