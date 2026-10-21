const FOOT = '<div class="foot"><span>Nid Serein · nid-serein</span><span>Usage personnel — ne pas revendre</span></div>';
const L = n => '<div class="lines">' + '<div></div>'.repeat(n) + '</div>';
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const J1 = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
function page(inner, cls = '') { return `<div class="page ${cls}">${inner}${FOOT}</div>`; }
function head(tag, title, sub, tcls = '') { return `<span class="tag ${tcls}">${tag}</span><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}`; }
