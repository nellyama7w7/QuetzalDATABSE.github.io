let pokemonData = [];

fetch('pokemon.json')
  .then(response => response.json())
  .then(data => {
    pokemonData = data.slice(1); // Saltamos el encabezado
    renderResults(pokemonData);
  })
  .catch(err => console.error(err));

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase().trim();
  filterPokemon(term);
});

function filterPokemon(term) {
  if (!term) {
    renderResults(pokemonData);
    return;
  }

  const filtered = pokemonData.filter(p => {
    const name = (p.field2 || '').toLowerCase();
    const number = (p.field4 || '').toLowerCase();
    const type1 = (p.field6 || '').toLowerCase();
    const type2 = (p.field8 || '').toLowerCase();

    return name.includes(term) || 
           number.includes(term) || 
           type1.includes(term) || 
           type2.includes(term);
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

    const type2HTML = p.field8 ? 
      `<span class="type" style="background:#666;">${p.field8}</span>` : '';

    card.innerHTML = `
      <img src="${p.field5}" alt="${p.field2}">
      <h3>#${p.field4} ${p.field2}</h3>
      <div class="types">
        <span class="type" style="background:#4CAF50;">${p.field6}</span>
        ${type2HTML}
      </div>
    `;

    resultsDiv.appendChild(card);
  });
}
