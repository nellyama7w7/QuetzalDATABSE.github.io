let pokemonData = [];
let objetosData = [];
let currentTab = 'pokemon';

const typeColors = {
  "Planta": "#4CAF50", "Fuego": "#FF5722", "Agua": "#2196F3", "Electrico": "#FFEB3B",
  "Hielo": "#81D4FA", "Lucha": "#D32F2F", "Veneno": "#9C27B0", "Tierra": "#E67E22",
  "Volador": "#81D4FA", "Psiquico": "#E91E63", "Bicho": "#8BC34A", "Roca": "#795548",
  "Fantasma": "#673AB7", "Dragon": "#3F51B5", "Siniestro": "#212121", "Acero": "#607D8B",
  "Hada": "#FF80AB", "Normal": "#9E9E9E"
};

async function loadData() {
  try {
    const [pokemonRes, objetosRes] = await Promise.all([
      fetch('pokemon.json'),
      fetch('Objetos.json')
    ]);
    
    const pokemonJson = await pokemonRes.json();
    const objetosJson = await objetosRes.json();
    
    pokemonData = pokemonJson.slice(1);
    objetosData = objetosJson.slice(1);
    
    renderResults(pokemonData);
  } catch (e) {
    console.error("Error cargando archivos:", e);
    resultsDiv.innerHTML = '<p style="color:red;">Error al cargar los datos. Verifica que pokemon.json y Objetos.json estén en la carpeta.</p>';
  }
}

loadData();

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    searchInput.value = '';
    renderCurrentTab();
  });
});

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase().trim();
  filterCurrentTab(term);
});

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

function renderCurrentTab() {
  if (currentTab === 'pokemon') renderResults(pokemonData);
  else renderObjects(objetosData);
}

function filterCurrentTab(term) {
  if (!term) return renderCurrentTab();
  
  if (currentTab === 'pokemon') {
    const filtered = pokemonData.filter(p => Object.values(p).join(' ').toLowerCase().includes(term));
    renderResults(filtered);
  } else {
    const filtered = objetosData.filter(o => Object.values(o).join(' ').toLowerCase().includes(term));
    renderObjects(filtered);
  }
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
          <img src="${p.field7}" alt="${type1}">
        </span>
        ${type2 ? `<span class="type" style="background:${typeColors[type2]||'#666'}">
          <img src="${p.field9}" alt="${type2}">
        </span>` : ''}
      </div>
    `;

    card.addEventListener('click', () => showPokemonDetail(p));
    resultsDiv.appendChild(card);
  });
}

function renderObjects(objetos) {
  resultsDiv.innerHTML = '';
  if (objetos.length === 0) {
    resultsDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;">No se encontraron Objetos</p>';
    return;
  }

  objetos.forEach(o => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${o.field5}" alt="${o.field3}" style="width:110px;height:110px;">
      <h3>#${o.field2} ${o.field3}</h3>
      <p style="font-size:0.9em; margin:8px 0 4px 0; color:#ccc;">${o.field6 ? o.field6.substring(0, 80) + '...' : ''}</p>
      <p style="font-size:0.85em;color:#aaa;">
        <strong>Compra:</strong> ${o.field8} | <strong>Venta:</strong> ${o.field7}
      </p>
    `;

    card.addEventListener('click', () => showObjectDetail(o));
    resultsDiv.appendChild(card);
  });
}

function showPokemonDetail(p) {
  // (Código completo del modal de Pokémon)
  let html = `
    <div style="text-align:center;">
      <img src="${p.field5}" class="main-sprite" alt="${p.field2}">
      <h2>#${p.field4} ${p.field2}</h2>
      <div style="margin:20px 0;">
        <span class="type" style="background:${typeColors[p.field6]||'#666'};font-size:1.1em;padding:8px 18px;">
          <img src="${p.field7}" width="24" height="24" style="vertical-align:middle;"> ${p.field6}
        </span>
        ${p.field8 ? `<span class="type" style="background:${typeColors[p.field8]||'#666'};font-size:1.1em;padding:8px 18px;">
          <img src="${p.field9}" width="24" height="24" style="vertical-align:middle;"> ${p.field8}
        </span>` : ''}
      </div>
    </div>

    <h3>Estadísticas Base</h3>
    <div style="display: flex; flex-direction: column; gap: 14px; max-width: 420px; margin: 0 auto;">
  `;

  const stats = [
    {name: "PS", value: p.field10},
    {name: "Ataque", value: p.field11},
    {name: "Defensa", value: p.field12},
    {name: "Ataque Especial", value: p.field13},
    {name: "Defensa Especial", value: p.field14},
    {name: "Velocidad", value: p.field15}
  ];

  stats.forEach(stat => {
    const value = parseInt(stat.value) || 0;
    const percent = Math.min(100, (value / 255) * 100);
    html += `
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <strong>${stat.name}</strong>
          <span>${value}</span>
        </div>
        <div class="stats-bar"><div class="stats-fill" style="width:${percent}%"></div></div>
      </div>
    `;
  });

  html += `</div>`;

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

function showObjectDetail(o) {
  const html = `
    <div style="text-align:center;">
      <img src="${o.field5}" style="width:180px; height:180px; image-rendering:pixelated;">
      <h2>#${o.field2} ${o.field3}</h2>
    </div>
    <h3>Descripción</h3>
    <p>${o.field6 || 'Sin descripción'}</p>
    <h3>Precios</h3>
    <p><strong>Compra:</strong> ${o.field8 || '-'}</p>
    <p><strong>Venta:</strong> ${o.field7 || '-'}</p>
  `;
  modalBody.innerHTML = html;
  modal.style.display = 'block';
}
