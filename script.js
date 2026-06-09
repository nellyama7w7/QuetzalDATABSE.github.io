let pokemonData = [];

const typeColors = {
  "Planta": "#4CAF50", "Fuego": "#FF5722", "Agua": "#2196F3", "Electrico": "#FFEB3B",
  "Hielo": "#81D4FA", "Lucha": "#D32F2F", "Veneno": "#9C27B0", "Tierra": "#E67E22",
  "Volador": "#81D4FA", "Psiquico": "#E91E63", "Bicho": "#8BC34A", "Roca": "#795548",
  "Fantasma": "#673AB7", "Dragon": "#3F51B5", "Siniestro": "#212121", "Acero": "#607D8B",
  "Hada": "#FF80AB", "Normal": "#9E9E9E"
};

fetch('pokemon.json')
  .then(r => r.json())
  .then(data => {
    pokemonData = data.slice(1);
    renderResults(pokemonData);
  });

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase().trim();
  filterPokemon(term);
});

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

function filterPokemon(term) {
  if (!term) return renderResults(pokemonData);
  const filtered = pokemonData.filter(p => {
    const text = Object.values(p).join(' ').toLowerCase();
    return text.includes(term);
  });
  renderResults(filtered);
}

function renderResults(pokemons) {
  resultsDiv.innerHTML = '';
  if (pokemons.length === 0) {
    resultsDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;">No se encontraron Pokémon</p>';
    return;
  }

  pokemons.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const type1 = p.field6 || '';
    const type2 = p.field8 || '';

    card.innerHTML = `
      <img src="${p.field5}" alt="${p.field2}">
      <h3>#${p.field4} ${p.field2}</h3>
      <div class="types">
        <span class="type" style="background:${typeColors[type1]||'#666'}">
          <img src="${p.field7}" width="18" height="18"> ${type1}
        </span>
        ${type2 ? `<span class="type" style="background:${typeColors[type2]||'#666'}">
          <img src="${p.field9}" width="18" height="18"> ${type2}
        </span>` : ''}
      </div>
    `;

    card.addEventListener('click', () => showDetail(p));
    resultsDiv.appendChild(card);
  });
}

function showDetail(p) {
  let html = `
    <div style="text-align:center;">
      <img src="${p.field5}" class="main-sprite" alt="${p.field2}">
      <h2>#${p.field4} ${p.field2}</h2>
      <div style="margin:15px 0;">
        <span class="type" style="background:${typeColors[p.field6]||'#666'};font-size:1.1em;padding:8px 20px;">
          <img src="${p.field7}" width="24" height="24"> ${p.field6}
        </span>
        ${p.field8 ? `<span class="type" style="background:${typeColors[p.field8]||'#666'};font-size:1.1em;padding:8px 20px;">
          <img src="${p.field9}" width="24" height="24"> ${p.field8}
        </span>` : ''}
      </div>
    </div>

    <h3>Estadísticas Base</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
  `;

  const stats = [
    {name: "PS", value: p.field10, max: 255},
    {name: "ATQ", value: p.field11, max: 255},
    {name: "DEF", value: p.field12, max: 255},
    {name: "A.ES", value: p.field13, max: 255},
    {name: "D.ES", value: p.field14, max: 255},
    {name: "VEL", value: p.field15, max: 255}
  ];

  stats.forEach(stat => {
    const percent = Math.min(100, (parseInt(stat.value) / stat.max) * 100);
    html += `
      <div>
        <strong>${stat.name}:</strong> ${stat.value}
        <div class="stats-bar"><div class="stats-fill" style="width:${percent}%"></div></div>
      </div>
    `;
  });

  html += `</div>`;

  // Información general
  html += `
    <h3>Información</h3>
    <p><strong>Categoría:</strong> ${p.field17 || '-'}</p>
    <p><strong>Altura:</strong> ${p.field18 || '-'} | <strong>Peso:</strong> ${p.field19 || '-'}</p>
    <p><strong>Prob. Captura:</strong> ${p.field20 || '-'} | <strong>Crecimiento:</strong> ${p.field21 || '-'}</p>
    <p><strong>Habilidades:</strong> ${p.field24 || '-'} ${p.field25 ? ` / ${p.field25}` : ''} ${p.field26 ? ` / ${p.field26}` : ''}</p>
    <p><strong>Objetos:</strong> ${p.field22 || '-'} ${p.field23 ? ` / ${p.field23}` : ''}</p>
    <p><strong>Grupo Huevo:</strong> ${p.field27 || '-'} ${p.field28 ? ` / ${p.field28}` : ''}</p>
  `;

  modalBody.innerHTML = html;
  modal.style.display = 'block';
}
