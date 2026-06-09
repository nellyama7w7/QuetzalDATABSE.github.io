fetch("pokemon.json")
  .then(response => response.json())
  .then(data => {

    // Eliminar la primera fila de encabezados
    pokemonData = data.slice(1);

    renderPokemon(pokemonData);
  });

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filtered = pokemonData.filter(pokemon =>
    pokemon.field2?.toLowerCase().includes(value)
  );

  renderPokemon(filtered);
});

function renderPokemon(list) {

  const container = document.getElementById("results");

  container.innerHTML = list.map(pokemon => `

    <div class="card">

      <h2>#${pokemon.field4 || ""} ${pokemon.field2 || ""}</h2>

      <div class="types">
        <span class="type">${pokemon.field6 || ""}</span>
        ${pokemon.field8 ? `<span class="type">${pokemon.field8}</span>` : ""}
      </div>

      <p><strong>HP:</strong> ${pokemon.field10 || ""}</p>
      <p><strong>Ataque:</strong> ${pokemon.field11 || ""}</p>
      <p><strong>Defensa:</strong> ${pokemon.field12 || ""}</p>

    </div>

  `).join("");

}
