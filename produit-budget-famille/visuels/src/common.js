// Données d'exemple affichées dans les visuels (cohérentes avec le fichier vendu)
const eur = v => v.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/ /g, ' ') + ' €';
const REVENUS = 3450, EPARGNE = 150;
const CATS = [
  ['Loyer / crédit immobilier', 900, 900], ['Électricité, gaz, eau', 140, 98.4],
  ['Internet et téléphones', 50, 29.99], ['Assurances', 80, 0],
  ['Crèche / nounou / garde', 250, 0], ['Cantine et périscolaire', 80, 64],
  ['Courses alimentaires', 550, 498.6], ['Couches, hygiène, puériculture', 60, 71.4],
  ['Vêtements enfants', 50, 32], ['Activités et loisirs enfants', 40, 25],
  ['Santé / pharmacie', 30, 12.5], ['Transport / carburant', 150, 118],
  ['Sorties et loisirs adultes', 60, 75], ['Cadeaux et anniversaires', 30, 0],
  ['Abonnements (streaming, etc.)', 25, 25], ['Imprévus', 50, 0],
];
const DEPENSES = [
  ['02/11/2026', 'Courses supermarché', 'Courses alimentaires', 87.4],
  ['03/11/2026', 'Paquet de couches', 'Couches, hygiène, puériculture', 18.9],
  ['05/11/2026', 'Loyer novembre', 'Loyer / crédit immobilier', 900],
  ['06/11/2026', 'Facture électricité', 'Électricité, gaz, eau', 98.4],
  ['07/11/2026', 'Plein d\'essence', 'Transport / carburant', 64],
  ['08/11/2026', 'Marché du samedi', 'Courses alimentaires', 42.3],
  ['09/11/2026', 'Cours de natation Léo', 'Activités et loisirs enfants', 25],
  ['10/11/2026', 'Pharmacie', 'Santé / pharmacie', 12.5],
  ['12/11/2026', 'Bodies 6 mois', 'Vêtements enfants', 32],
  ['14/11/2026', 'Restaurant entre amis', 'Sorties et loisirs adultes', 48],
];
function pct(c) { return c[1] ? c[2] / c[1] : 0; }
function etat(c) { const p = pct(c); return p > 1 ? 'rouge' : p >= 0.8 ? 'orange' : ''; }
function totalDep(cats = CATS) { return cats.reduce((s, c) => s + c[2], 0); }

// Fenêtre de tableur stylisée
function sheet({title = 'Budget-Famille-Sans-Stress', tabs = ['Mode d\'emploi', 'Paramètres', 'Dépenses', 'Tableau de bord', 'Défi 30 jours'], active, body, compact = false}) {
  return `<div class="win ${compact ? 'compact' : ''}">
    <div class="winbar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
      <span class="fname"><span class="xl">X</span>${title}.xlsx</span></div>
    <div class="grid">${body}</div>
    <div class="tabs">${tabs.map(t => `<span class="tab ${t === active ? 'on' : ''}">${t}</span>`).join('')}</div>
  </div>`;
}
function dashboardBody({cats = CATS, highlight = -1, rows = cats.length} = {}) {
  const dep = totalDep(cats), reste = REVENUS - dep;
  const kpi = (l, v, cls = '') => `<div class="kpi ${cls}"><span>${l}</span><b>${v}</b></div>`;
  return `<div class="sh-title">Tableau de bord du mois <small>novembre 2026</small></div>
  <div class="kpis">${kpi('Total revenus', eur(REVENUS))}${kpi('Total dépensé', eur(dep))}
    ${kpi('Reste à vivre', eur(reste), 'good')}${kpi('Objectif d\'épargne', reste >= EPARGNE ? 'Atteint ✓' : 'Pas encore', 'good')}</div>
  <table class="t"><tr><th>Catégorie</th><th>Budget prévu</th><th>Dépensé</th><th>Reste</th><th>% utilisé</th></tr>
  ${cats.slice(0, rows).map((c, i) => `<tr class="${etat(c)} ${i === highlight ? 'hl' : ''}"><td>${c[0]}</td><td class="n">${eur(c[1])}</td><td class="n">${c[2] ? eur(c[2]) : '-'}</td><td class="n">${eur(c[1] - c[2])}</td><td class="n">${Math.round(pct(c) * 100)}%</td></tr>`).join('')}
  </table>`;
}
function journalBody({deps = DEPENSES, typing = null, dropdown = false} = {}) {
  let rows = deps.map(d => `<tr><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td class="n">${eur(d[3])}</td></tr>`).join('');
  if (typing) rows += `<tr class="typing"><td>${typing[0] || ''}</td><td>${typing[1] || ''}${typing.caret === 1 ? '<i class="caret"></i>' : ''}</td>
    <td class="dd">${typing[2] || ''}${typing.caret === 2 ? '<i class="caret"></i>' : ''}<span class="arrow">▾</span>${dropdown ? ddList(typing.ddSel) : ''}</td>
    <td class="n">${typing[3] || ''}${typing.caret === 3 ? '<i class="caret"></i>' : ''}</td></tr>`;
  for (let i = 0; i < 4; i++) rows += '<tr class="empty"><td></td><td></td><td></td><td></td></tr>';
  return `<div class="sh-title">Journal des dépenses</div>
  <table class="t in"><tr><th style="width:15%">Date</th><th style="width:33%">Description</th><th>Catégorie</th><th style="width:15%">Montant</th></tr>${rows}</table>`;
}
function ddList(sel) {
  const items = ['Courses alimentaires', 'Couches, hygiène, puériculture', 'Vêtements enfants', 'Activités et loisirs enfants', 'Santé / pharmacie', 'Transport / carburant', 'Sorties et loisirs adultes'];
  return `<div class="ddlist">${items.map(t => `<div class="${t === sel ? 'sel' : ''}">${t}</div>`).join('')}</div>`;
}
const DEFIS = ["Inventaire du frigo avant les courses", "Liste de courses, et on s'y tient", "Repas « fond de placard »", "Suspendre un abonnement inutile", "Journée sans dépense", "Goûter des enfants fait maison", "Comparer forfait mobile et box", "Vendre un vêtement trop petit", "Batch cooking : 3 repas d'avance", "Sortie gratuite en famille", "Vérifier ses droits CAF", "5 produits en marque distributeur", "Éteindre les veilles", "Journée sans dépense", "Emprunter au lieu d'acheter", "Pique-nique au lieu du resto", "Appli anti-gaspi", "Faire le point sur ses assurances", "Douches plus courtes", "Journée sans dépense", "Troc de vêtements entre parents", "Cuisiner avec les restes", "Supprimer une appli d'achat", "Menus de la semaine", "Comparer le prix au kilo", "Après-midi jeux de société", "Journée sans dépense", "Revoir le budget courses", "Virer l'économie sur l'épargne", "Bilan et petite fête en famille"];
const ECO = [12, 8, 9.5, 13.99, 15, 6, 10, 7, 18, 20, 0, 6.4, 3, 12, 15, 25, 8.5, 0, 4, 10];
function defiBody({done = 12} = {}) {
  const total = ECO.slice(0, done).reduce((a, b) => a + b, 0);
  return `<div class="sh-title">Défi 30 jours d'économies en famille</div>
  <div class="kpis two"><div class="kpi good"><span>Jours réussis</span><b>${done} / 30</b></div><div class="kpi good"><span>Total économisé</span><b>${eur(total)}</b></div></div>
  <table class="t defi"><tr><th style="width:8%">Jour</th><th>Défi du jour</th><th style="width:16%">Réussi ?</th><th style="width:18%">Économie</th></tr>
  ${DEFIS.slice(0, 14).map((d, i) => `<tr class="${i < done ? 'ok' : ''}"><td class="c">${i + 1}</td><td>${d}</td><td class="c">${i < done ? 'Oui ✓' : ''}</td><td class="n">${i < done && ECO[i] ? eur(ECO[i]) : ''}</td></tr>`).join('')}
  </table>`;
}
// Bilan annuel (édition 12 mois)
const ABR = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
function bilanBody({months = 6} = {}) {
  const dep = [2310, 2195, 2402, 2260, 2588, 2140].slice(0, months);
  const cats = [['Loyer / crédit', 900, [900, 900, 900, 900, 900, 900]], ['Courses', 550, [512, 534, 571, 498, 603, 520]],
    ['Crèche / nounou', 250, [250, 250, 250, 250, 250, 250]], ['Couches & puériculture', 60, [58, 49, 66, 52, 71, 55]],
    ['Transport', 150, [132, 118, 141, 160, 125, 119]], ['Activités enfants', 40, [40, 25, 40, 40, 65, 40]],
    ['Cadeaux & anniversaires', 30, [0, 45, 0, 20, 30, 0]], ['Sorties adultes', 60, [48, 70, 55, 30, 82, 41]]];
  const k = v => v ? Math.round(v).toLocaleString('fr-FR').replace(/ /g, ' ') + ' €' : '-';
  const th = ABR.map(a => `<th style="text-align:right">${a}</th>`).join('');
  const cell = (v, i, b) => i < months ? `<td class="n" style="${b && v > b ? 'background:var(--red);color:var(--redink);font-weight:700' : ''}">${k(v)}</td>` : '<td class="n" style="color:#bbb">-</td>';
  return `<div class="sh-title">Bilan annuel <small>2027</small></div>
  <table class="t bil"><tr><th>Synthèse</th>${th}</tr>
  <tr><td><b>Revenus</b></td>${ABR.map(() => `<td class="n">${k(3450)}</td>`).join('')}</tr>
  <tr><td><b>Dépenses</b></td>${ABR.map((_, i) => cell(dep[i], i)).join('')}</tr>
  <tr style="background:var(--teal2)"><td style="color:var(--teal)"><b>Reste à vivre</b></td>${ABR.map((_, i) => i < months ? `<td class="n" style="color:var(--teal);font-weight:700">${k(3450 - dep[i])}</td>` : '<td class="n" style="color:#bbb">-</td>').join('')}</tr></table>
  <table class="t bil" style="margin-top:14px"><tr><th>Catégorie</th>${th}</tr>
  ${cats.map(c => `<tr><td>${c[0]}</td>${ABR.map((_, i) => cell(c[2][i], i, c[1])).join('')}</tr>`).join('')}</table>`;
}
