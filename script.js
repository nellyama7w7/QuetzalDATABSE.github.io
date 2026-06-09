function showDetail(p) {
  let html = `
    <div style="text-align:center;">
      <img src="${p.field5}" class="main-sprite" alt="${p.field2}">
      <h2>#${p.field4} ${p.field2}</h2>
      <div style="margin:20px 0;">
        <span class="type" style="background:${typeColors[p.field6]||'#666'};font-size:1.1em;padding:8px 18px;">
          <img src="${p.field7}" width="18" height="18" style="vertical-align:middle;"> ${p.field6}
        </span>
        ${p.field8 ? `<span class="type" style="background:${typeColors[p.field8]||'#666'};font-size:1.1em;padding:8px 18px;">
          <img src="${p.field9}" width="18" height="18" style="vertical-align:middle;"> ${p.field8}
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
