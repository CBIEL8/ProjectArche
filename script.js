// JavaScript to load a YouTube video from a URL
function extractVideoID(url) {
  const regex = /(?:v=|\/embed\/|\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function loadVideo() {
  const url = document.getElementById('videoURL').value.trim();
  const videoId = extractVideoID(url);
  const player = document.getElementById('player');
  if (videoId) {
    player.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    player.textContent = 'Invalid YouTube URL';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loadVideo').addEventListener('click', loadVideo);
});
