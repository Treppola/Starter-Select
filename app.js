const STARTERS = {
  fire: [
    { id: 4, name: 'Charmander', gen: 'I' },
    { id: 155, name: 'Cyndaquil', gen: 'II' },
    { id: 255, name: 'Torchic', gen: 'III' },
    { id: 390, name: 'Chimchar', gen: 'IV' },
    { id: 498, name: 'Tepig', gen: 'V' },
    { id: 653, name: 'Fennekin', gen: 'VI' },
    { id: 725, name: 'Litten', gen: 'VII' },
    { id: 813, name: 'Scorbunny', gen: 'VIII' },
    { id: 909, name: 'Fuecoco', gen: 'IX' },
    { id: 'pombon', name: 'Pombon', gen: 'X', spriteUrl: 'sprites/pombon.png' },
  ],
  grass: [
    { id: 1, name: 'Bulbasaur', gen: 'I' },
    { id: 152, name: 'Chikorita', gen: 'II' },
    { id: 252, name: 'Treecko', gen: 'III' },
    { id: 387, name: 'Turtwig', gen: 'IV' },
    { id: 495, name: 'Snivy', gen: 'V' },
    { id: 650, name: 'Chespin', gen: 'VI' },
    { id: 722, name: 'Rowlet', gen: 'VII' },
    { id: 810, name: 'Grookey', gen: 'VIII' },
    { id: 906, name: 'Sprigatito', gen: 'IX' },
    { id: 'browt', name: 'Browt', gen: 'X', spriteUrl: 'sprites/browt.png' },
  ],
  water: [
    { id: 7, name: 'Squirtle', gen: 'I' },
    { id: 158, name: 'Totodile', gen: 'II' },
    { id: 258, name: 'Mudkip', gen: 'III' },
    { id: 393, name: 'Piplup', gen: 'IV' },
    { id: 501, name: 'Oshawott', gen: 'V' },
    { id: 656, name: 'Froakie', gen: 'VI' },
    { id: 728, name: 'Popplio', gen: 'VII' },
    { id: 816, name: 'Sobble', gen: 'VIII' },
    { id: 912, name: 'Quaxly', gen: 'IX' },
    { id: 'gecqua', name: 'Gecqua', gen: 'X', spriteUrl: 'sprites/gecqua.png' },
  ],
};

const GENERATIONS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const TYPE_ORDER = ['fire', 'grass', 'water'];

const COLORS = {
  fire: '#D94432',
  fireDim: '#5C2219',
  grass: '#6BBF3B',
  grassDim: '#334F1E',
  water: '#3B82D6',
  waterDim: '#1E3456',
  surface: '#1c1c2e',
  text: 'rgba(255,255,255,0.9)',
  textDim: 'rgba(255,255,255,0.4)',
};

function getSpriteUrl(pokemon) {
  if (pokemon.spriteUrl) return pokemon.spriteUrl;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
}

const selectedCards = new Map();

const gridContainer = document.getElementById('grid-container');
const genLabelsContainer = document.getElementById('gen-labels');
const exportBtn = document.getElementById('btn-export');
const clearBtn = document.getElementById('btn-clear');

function renderGenLabels() {
  GENERATIONS.forEach((gen) => {
    const label = document.createElement('div');
    label.className = 'gen-label';
    label.textContent = `Gen ${gen}`;
    genLabelsContainer.appendChild(label);
  });
}

function renderGrid() {
  TYPE_ORDER.forEach((type) => {
    const row = document.createElement('div');
    row.className = 'type-row';

    STARTERS[type].forEach((pokemon, colIndex) => {
      const card = document.createElement('div');
      const cardId = `${type}-${pokemon.id}`;
      card.id = cardId;
      card.dataset.col = colIndex;
      card.style.setProperty('--col-index', colIndex);
      card.className = `poke-card poke-card--${type} poke-card--loading`;

      const img = document.createElement('img');
      img.className = 'poke-card__sprite';
      img.src = getSpriteUrl(pokemon);
      img.alt = pokemon.name;
      img.loading = 'lazy';
      img.draggable = false;
      img.crossOrigin = 'anonymous';

      img.addEventListener('load', () => {
        card.classList.remove('poke-card--loading');
      });

      img.addEventListener('error', () => {
        card.classList.remove('poke-card--loading');
        img.style.opacity = '0.3';
      });

      const nameEl = document.createElement('span');
      nameEl.className = 'poke-card__name';
      nameEl.textContent = pokemon.name;

      card.appendChild(img);
      card.appendChild(nameEl);
      card.addEventListener('click', () => toggleSelection(cardId, colIndex));

      row.appendChild(card);
    });

    gridContainer.appendChild(row);
  });
}

function toggleSelection(cardId, colIndex) {
  const cardEl = document.getElementById(cardId);

  if (cardEl.classList.contains('poke-card--selected')) {
    cardEl.classList.remove('poke-card--selected');
    if (selectedCards.has(colIndex)) {
      selectedCards.get(colIndex).delete(cardId);
      if (selectedCards.get(colIndex).size === 0) {
        selectedCards.delete(colIndex);
      }
    }
  } else {
    cardEl.classList.add('poke-card--selected');
    if (!selectedCards.has(colIndex)) {
      selectedCards.set(colIndex, new Set());
    }
    selectedCards.get(colIndex).add(cardId);
  }

  updateColumnDimming();
}

function updateColumnDimming() {
  document.querySelectorAll('.poke-card').forEach((card) => {
    const col = parseInt(card.dataset.col);
    const isSelected = card.classList.contains('poke-card--selected');
    if (selectedCards.has(col) && !isSelected) {
      card.classList.add('poke-card--dimmed');
    } else {
      card.classList.remove('poke-card--dimmed');
    }
  });
}

function clearAllSelections() {
  selectedCards.clear();
  document.querySelectorAll('.poke-card--selected').forEach((card) => {
    card.classList.remove('poke-card--selected');
  });
  document.querySelectorAll('.poke-card--dimmed').forEach((card) => {
    card.classList.remove('poke-card--dimmed');
  });
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function exportAsPng() {
  exportBtn.textContent = 'Exporting...';
  exportBtn.disabled = true;

  try {
    const scale = 2;
    const cardW = 130;
    const cardH = 165;
    const gap = 6;
    const padding = 12;
    const radius = 10;
    const spriteSize = 105;
    const cols = 10;
    const rows = 3;

    const gridW = cols * cardW + (cols - 1) * gap;
    const gridH = rows * cardH + (rows - 1) * gap;
    const totalW = gridW + padding * 2;
    const totalH = gridH + padding * 2;

    const canvas = document.createElement('canvas');
    canvas.width = totalW * scale;
    canvas.height = totalH * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    roundRect(ctx, 0, 0, totalW, totalH, 16);
    ctx.fillStyle = COLORS.surface;
    ctx.fill();

    const imagePromises = [];
    TYPE_ORDER.forEach((type) => {
      STARTERS[type].forEach((pokemon) => {
        imagePromises.push(
          loadImage(getSpriteUrl(pokemon)).then((img) => ({ key: `${type}-${pokemon.id}`, img }))
        );
      });
    });

    const imageResults = await Promise.all(imagePromises);
    const images = {};
    imageResults.forEach(({ key, img }) => { images[key] = img; });

    TYPE_ORDER.forEach((type, rowIdx) => {
      STARTERS[type].forEach((pokemon, colIdx) => {
        const cardId = `${type}-${pokemon.id}`;
        const x = padding + colIdx * (cardW + gap);
        const y = padding + rowIdx * (cardH + gap);
        const el = document.getElementById(cardId);
        const isSelected = el?.classList.contains('poke-card--selected');
        const isDimmed = el?.classList.contains('poke-card--dimmed');

        ctx.save();
        roundRect(ctx, x, y, cardW, cardH, radius);
        ctx.clip();

        ctx.fillStyle = isDimmed ? COLORS[type + 'Dim'] : COLORS[type];
        ctx.fill();

        const spriteImg = images[cardId];
        if (spriteImg) {
          const spriteX = x + (cardW - spriteSize) / 2;
          const spriteY = y + (cardH - spriteSize - 18) / 2;

          if (isDimmed) {
            ctx.globalAlpha = 0.35;
            ctx.filter = 'saturate(0.3) brightness(0.5)';
          }

          ctx.drawImage(spriteImg, spriteX, spriteY, spriteSize, spriteSize);
          ctx.globalAlpha = 1;
          ctx.filter = 'none';
        }

        ctx.font = '600 9px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = isDimmed ? COLORS.textDim : COLORS.text;
        ctx.fillText(pokemon.name.toUpperCase(), x + cardW / 2, y + cardH - 8);

        ctx.restore();
      });
    });

    const link = document.createElement('a');
    link.download = 'my-starters.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Export failed:', err);
    alert('Export failed. Please try again.');
  } finally {
    exportBtn.textContent = 'Export as PNG';
    exportBtn.disabled = false;
  }
}

exportBtn.addEventListener('click', exportAsPng);
clearBtn.addEventListener('click', clearAllSelections);

document.addEventListener('DOMContentLoaded', () => {
  renderGenLabels();
  renderGrid();
});
