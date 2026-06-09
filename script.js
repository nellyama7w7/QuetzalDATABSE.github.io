let pokemonData = [];

// Cargar el JSON
fetch('pokemon.json')
  .then(response => response.json())
  .then(data => {
    // El primer objeto es el encabezado, lo ignoramos
    pokemonData = data.slice(1);
    renderAll();
  })
  .catch(err => console.error('Error cargando JSON:', err));

const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase().trim();
  filterPokemon(term);
});

function filterPokemon(term) {
  if (!term) {
    renderAll();
    return;
  }

  const filtered = pokemonData.filter(p => {
    const name = (p.field2 || '').toLowerCase();
    const nameUpper = (p.field3 || '').toLowerCase();
    const number = (p.field4 || '').toLowerCase();
    const type1 = (p.field6 || '').toLowerCase();
    const type2 = (p.field8 || '').toLowerCase();

    return name.includes(term) || 
           nameUpper.includes(term) || 
           number.includes(term) || 
           type1.includes(term) || 
           type2.includes(term);
  });

  renderResults(filtered);
}

function renderAll() {
  renderResults(pokemonData);
}

function renderResults(pokemons) {
  resultsDiv.innerHTML = '';

  if (pokemons.length === 0) {
    resultsDiv.innerHTML = '<p>No se encontraron Pokémon</p>';
    return;
  }

  pokemons.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const type2 = p.field8 ? `<span class="type" style="background:#666;">${p.field8}</span>` : '';
    
    card.innerHTML = `
      <h3>${p.field2}</h3>
      <div class="number">#${p.field4}</div>
      <div class="types">
        <span class="type" style="background:#4CAF50;">${p.field6}</span>
        ${type2}
      </div>
      <p>PS: ${p.field10} | ATQ: ${p.field11} | DEF: ${p.field12}</p>
    `;
    
    resultsDiv.appendChild(card);
  });
}
