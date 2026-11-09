const grid = document.querySelector('#game-grid');
const filters = document.querySelector('#category-filters');
const searchInput = document.querySelector('#game-search');
const emptyState = document.querySelector('#empty-state');
const playSection = document.querySelector('#play-area');
const gameFrame = document.querySelector('#game-frame');
const playingTitle = document.querySelector('#playing-title');
let games = [];
let activeCategory = 'All games';

async function loadGames() {
  try {
    const response = await fetch('./games.json');
    if (!response.ok) throw new Error(`Could not load games (${response.status})`);
    games = await response.json();
    renderFilters();
    renderGames();
  } catch (error) {
    grid.innerHTML = '<p class="empty-state">Could not load the game library. Please try again later.</p>';
    console.error(error);
  }
}

function renderFilters() {
  const categories = ['All games', ...new Set(games.map(game => game.category).filter(Boolean))];
  filters.replaceChildren(...categories.map(category => {
    const button = document.createElement('button');
    button.className = `filter-button${category === activeCategory ? ' selected' : ''}`;
    button.type = 'button';
    button.textContent = category;
    button.setAttribute('aria-pressed', category === activeCategory);
    button.addEventListener('click', () => {
      activeCategory = category;
      renderFilters();
      renderGames();
    });
    return button;
  }));
}

function renderGames() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleGames = games.filter(game => {
    const matchesCategory = activeCategory === 'All games' || game.category === activeCategory;
    const searchable = `${game.title} ${game.description} ${game.category}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  grid.replaceChildren(...visibleGames.map(game => {
    const card = document.createElement('article');
    card.className = 'game-card';

    const cover = document.createElement('div');
    cover.className = 'game-cover';
    cover.style.setProperty('--cover-a', game.color?.[0] || '#333451');
    cover.style.setProperty('--cover-b', game.color?.[1] || '#222638');
    const icon = document.createElement('span');
    icon.className = 'game-icon';
    icon.textContent = game.icon || '🎮';
    const tag = document.createElement('span');
    tag.className = 'game-tag';
    tag.textContent = game.category || 'Game';
    cover.append(icon, tag);

    const content = document.createElement('div');
    content.className = 'card-content';
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = game.title;
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = game.description || 'Jump in and start playing.';
    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';
    const count = document.createElement('span');
    count.className = 'game-count';
    count.textContent = 'Browser game';
    const play = document.createElement('button');
    play.className = 'play-button';
    play.type = 'button';
    play.innerHTML = 'Play <span aria-hidden="true">▶</span>';
    play.addEventListener('click', () => openGame(game));
    bottom.append(count, play);
    content.append(title, description, bottom);
    card.append(cover, content);
    return card;
  }));
  emptyState.hidden = visibleGames.length > 0;
}

function openGame(game) {
  let parsedUrl;
  try {
    parsedUrl = new URL(game.iframe, window.location.href);
  } catch {
    return;
  }
  if (!['https:', 'http:'].includes(parsedUrl.protocol)) return;
  playingTitle.textContent = game.title;
  gameFrame.src = parsedUrl.href;
  playSection.hidden = false;
  playSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelector('#close-game').addEventListener('click', () => {
  gameFrame.src = 'about:blank';
  playSection.hidden = true;
});
searchInput.addEventListener('input', renderGames);
loadGames();
