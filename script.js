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
    resultsDiv.innerHTML = '<p style="color:red; text-align:center;">Error al cargar los datos. Verifica que pokemon.json y Objetos.json estén en la carpeta.</p>';
  }
}

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

// Iniciar carga de datos
loadData();

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
  const stats = [
    {name: "PS", value: p.field10, color: "#FF5959"},
    {name: "Ataque", value: p.field11, color: "#F5AC78"},
    {name: "Defensa", value: p.field12, color: "#FAE078"},
    {name: "At. Especial", value: p.field13, color: "#9DB7F5"},
    {name: "Def. Especial", value: p.field14, color: "#A7DB8D"},
    {name: "Velocidad", value: p.field15, color: "#FA92B2"}
  ];

  let html = `
    <div style="text-align:center; margin-bottom: 30px;">
      <img src="${p.field5}" class="main-sprite" alt="${p.field2}">
      <h2 style="font-size: 2.2rem; font-weight: 700; margin-bottom: 10px;">#${p.field4} ${p.field2}</h2>
      <div style="margin:15px 0;">
        <span class="type" style="background:${typeColors[p.field6]||'#666'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3)">
          <img src="${p.field7}" width="20" height="20" style="vertical-align:middle;"> ${p.field6}
        </span>
        ${p.field8 ? `<span class="type" style="background:${typeColors[p.field8]||'#666'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3)">
          <img src="${p.field9}" width="20" height="20" style="vertical-align:middle;"> ${p.field8}
        </span>` : ''}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 20px;">
      <div>
        <h3 style="color: var(--green); margin-bottom: 20px; border-bottom: 2px solid rgba(0,200,83,0.2); padding-bottom: 8px;">Estadísticas Base</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
  `;

  stats.forEach(stat => {
    const value = parseInt(stat.value) || 0;
    const percent = Math.min(100, (value / 255) * 100);
    html += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size: 0.95em;">
          <span style="color: #aaa;">${stat.name}</span>
          <strong style="color: #fff;">${value}</strong>
        </div>
        <div class="stats-bar">
          <div class="stats-fill" style="width:${percent}%; --stat-color: ${stat.color};"></div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
      
      <div>
        <h3 style="color: var(--green); margin-bottom: 20px; border-bottom: 2px solid rgba(0,200,83,0.2); padding-bottom: 8px;">Datos del Pokémon</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.95em; color: #e8ecf7;">
          <p><strong style="color: #aaa;">Categoría:</strong> ${p.field17 || '-'}</p>
          <p><strong style="color: #aaa;">Altura:</strong> ${p.field18 || '-'} | <strong style="color: #aaa;">Peso:</strong> ${p.field19 || '-'}</p>
          <p><strong style="color: #aaa;">Ratio Captura:</strong> ${p.field20 || '-'} | <strong style="color: #aaa;">Crecimiento:</strong> ${p.field21 || '-'}</p>
          <p><strong style="color: #aaa;">Habilidades:</strong> <span style="color: #00c853;">${p.field24 || '-'}</span> ${p.field25 ? ` / ${p.field25}` : ''} ${p.field26 ? ` / <em style="color:#ff80ab;">${p.field26} (Oculta)</em>` : ''}</p>
          <p><strong style="color: #aaa;">Objetos:</strong> ${p.field22 || '-'} ${p.field23 ? ` / ${p.field23}` : ''}</p>
          <p><strong style="color: #aaa;">Grupo Huevo:</strong> ${p.field27 || '-'} ${p.field28 ? ` / ${p.field28}` : ''}</p>
        </div>
      </div>
    </div>
  `;

  modalBody.innerHTML = html;
  modal.style.display = 'block';
}

function showObjectDetail(o) {
  const html = `
    <div style="text-align:center;">
      <img src="${o.field5}" style="width:180px; height:180px; image-rendering:pixelated; margin-bottom: 15px;">
      <h2 style="font-size: 2rem; font-weight: 700;">#${o.field2} ${o.field3}</h2>
    </div>
    <div style="margin-top: 25px;">
      <h3 style="color: var(--green); margin-bottom: 10px; border-bottom: 2px solid rgba(0,200,83,0.2); padding-bottom: 6px;">Descripción</h3>
      <p style="color: #e8ecf7; line-height: 1.6; font-size: 0.95em;">${o.field6 || 'Sin descripción'}</p>
    </div>
    <div style="margin-top: 25px;">
      <h3 style="color: var(--green); margin-bottom: 10px; border-bottom: 2px solid rgba(0,200,83,0.2); padding-bottom: 6px;">Precios</h3>
      <p style="font-size: 0.95em; color: #e8ecf7;"><strong style="color: #aaa;">Compra:</strong> ${o.field8 || '-'} pokedólares</p>
      <p style="font-size: 0.95em; color: #e8ecf7; margin-top: 6px;"><strong style="color: #aaa;">Venta:</strong> ${o.field7 || '-'} pokedólares</p>
    </div>
  `;
  modalBody.innerHTML = html;
  modal.style.display = 'block';
}
