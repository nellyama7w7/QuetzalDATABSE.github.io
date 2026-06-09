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
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

function filterPokemon(term) {
  if (!term) return renderResults(pokemonData);

  const filtered = pokemonData.filter(p => {
    const name = (p.field2 || '').toLowerCase();
    const number = (p.field4 || '').toLowerCase();
    const type1 = (p.field6 || '').toLowerCase();
    const type2 = (p.field8 || '').toLowerCase();
    return name.includes(term) || number.includes(term) || type1.includes(term) || type2.includes(term);
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

    const type1HTML = `<span class="type" style="background:${typeColors[type1] || '#666'}">${type1}</span>`;
    const type2HTML = type2 ? `<span class="type" style="background:${typeColors[type2] || '#666'}">${type2}</span>` : '';

    card.innerHTML = `
      <img src="${p.field5}" alt="${p.field2}">
      <h3>#${p.field4} ${p.field2}</h3>
      <div class="types">
        ${type1HTML}
        ${type2HTML}
      </div>
    `;

    // Click para abrir detalle
    card.addEventListener('click', () => showDetail(p));
    resultsDiv.appendChild(card);
  });
}

function showDetail(p) {
  const type1 = p.field6 || '';
  const type2 = p.field8 || '';

  modalBody.innerHTML = `
    <div style="text-align:center;">
      <img src="${p.field5}" alt="${p.field2}" style="width:220px;">
      <h2>#${p.field4} ${p.field2}</h2>
      <div class="types" style="margin:15px 0;">
        <span class="type" style="background:${typeColors[type1]||'#666'};font-size:1.1em;padding:8px 18px;">${type1}</span>
        ${type2 ? `<span class="type" style="background:${typeColors[type2]||'#666'};font-size:1.1em;padding:8px 18px;">${type2}</span>` : ''}
      </div>
    </div>

    <h3>Estadísticas</h3>
    <p><strong>PS:</strong> ${p.field10} | <strong>ATQ:</strong> ${p.field11} | <strong>DEF:</strong> ${p.field12}</p>
    <p><strong>VEL:</strong> ${p.field13} | <strong>A.ES:</strong> ${p.field14} | <strong>D.ES:</strong> ${p.field15}</p>

    <h3>Información</h3>
    <p><strong>Altura:</strong> ${p.field18} | <strong>Peso:</strong> ${p.field19}</p>
    <p><strong>Categoría:</strong> ${p.field17}</p>
    <p><strong>Habilidades:</strong> ${p.field24 || '-'} ${p.field26 ? ` / ${p.field26}` : ''}</p>
    <p><strong>Objeto:</strong> ${p.field22 || '-'}</p>
  `;

  modal.style.display = 'block';
}
