let pokemon = [], objetos = [], habilidades = [];
let currentTab = 'pokemon';

async function loadData() {
  pokemon = await fetch('pokemon.json').then(r => r.json());
  objetos = await fetch('objetos.json').then(r => r.json());
  habilidades = await fetch('habilidades.json').then(r => r.json());
  render();
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    document.getElementById('search').value = '';
    render();
  });
});

document.getElementById('search').addEventListener('input', render);

function render() {
  const term = document.getElementById('search').value.toLowerCase().trim();
  const container = document.getElementById('results');
  container.innerHTML = '';

  let data = currentTab === 'pokemon' ? pokemon : 
             currentTab === 'objetos' ? objetos : habilidades;

  const filtered = data.filter(item => {
    const text = Object.values(item).join(' ').toLowerCase();
    return text.includes(term);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No se encontraron resultados</p>';
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    if (currentTab === 'pokemon') {
      card.innerHTML = `
        <h3>#${item.No || item.field4} ${item.Pokemon || item.field2}</h3>
        <p><strong>Tipos:</strong> ${item.Type || item.field6} ${item.Type2 || item.field8 || ''}</p>
        <p>PS: ${item.PS} | ATQ: ${item.ATQ} | DEF: ${item.DEF}</p>
      `;
    } else if (currentTab === 'objetos') {
      card.innerHTML = `<h3>${item.Name || item.field2}</h3><p>${item.Descripcion || ''}</p>`;
    } else {
      card.innerHTML = `<h3>${item.Habilidad}</h3><p>${item.Descripcion}</p>`;
    }

    container.appendChild(card);
  });
}

loadData();
