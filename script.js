let pokemonData = [];

fetch("pokemon.json")
.then(response => response.json())
.then(data => {
pokemonData = data;
renderPokemon(data);
});

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
const value = searchInput.value.toLowerCase();

```
const filtered = pokemonData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(value)
);

renderPokemon(filtered);
```

});

function renderPokemon(list) {
const container = document.getElementById("results");

```
container.innerHTML = list.map(pokemon => `
    <div class="card">
        <h2>#${pokemon.dex} ${pokemon.name}</h2>

        <div class="types">
            <span class="type">${pokemon.type1}</span>
            ${pokemon.type2 ? `<span class="type">${pokemon.type2}</span>` : ""}
        </div>

        <p><strong>HP:</strong> ${pokemon.hp}</p>
        <p><strong>Ataque:</strong> ${pokemon.attack}</p>
        <p><strong>Defensa:</strong> ${pokemon.defense}</p>
    </div>
`).join("");
```

}
