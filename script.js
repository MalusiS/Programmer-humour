// Reusable function for fetching JSON with error handling
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

let latestNum = null; // cache latest comic number

async function fetchRandomComic() {
  const container = document.getElementById('comic-container');

  try {
    // Get latest comic number if not cached
    if (!latestNum) {
      const latestData = await fetchJson('https://xkcd.now.sh/?comic=latest');
      latestNum = latestData.num;
    }

    // Pick a random comic number
    const randomNum = Math.floor(Math.random() * latestNum) + 1;

    // Fetch the random comic
    const data = await fetchJson(`https://xkcd.now.sh/?comic=${randomNum}`);

    // Render comic
    container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'comic-title';
    title.textContent = `#${data.num} – ${data.title}`;
    container.appendChild(title);

    const img = document.createElement('img');
    img.src = data.img;
    img.alt = data.alt;
    img.title = data.alt;
    container.appendChild(img);

  } catch (error) {
    console.error('Error fetching comic:', error);
    container.innerHTML = `<p style="color:red;">Failed to load comic. Try again later.</p>`;
  }
}

// Load first comic on page load
fetchRandomComic();

// Add button click handler
document.getElementById('new-comic-btn')
  .addEventListener('click', fetchRandomComic);
