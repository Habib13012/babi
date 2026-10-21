# Budget Famille Sans Stress : même charte que les visuels Etsy (crème, vert, corail)
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
import datetime as dt

OUT = "/home/user/babi/boutique-generale/produits/naissance/Budget-Naissance-Arrivee-de-Bebe.xlsx"
FONT = "Arial"
TEAL, TEAL2, CREAM, INK, MUTED = "2E7D6B", "E3F2EE", "FBF6EE", "1F2A2E", "5E6B70"
CORAL, SUN, SUN2, CARD, WHITE = "E9785A", "FFF7D6", "FFFBEA", "F7F7F5", "FFFFFF"
RED, REDINK, ORANGE, GREEN = "F8D7DA", "9C0006", "FFE8CC", "D4EDDA"
EUR = '#,##0.00 €;-#,##0.00 €;"-"'
PCT = '0%;-0%;"-"'
line = Side(style="thin", color="ECE6DA")
soft = Border(bottom=line)
box = Border(left=line, right=line, top=line, bottom=line)

def fill(c): return PatternFill("solid", fgColor=c)
def font(size=10, bold=False, color=INK, italic=False): return Font(name=FONT, size=size, bold=bold, color=color, italic=italic)

def page(ws, widths, rows=60):
    ws.sheet_view.showGridLines = False
    ws.column_dimensions["A"].width = 3
    for col, w in widths.items(): ws.column_dimensions[col].width = w
    last = max(len(widths) + 2, 22)
    for r in range(1, rows + 1):
        for c in range(1, last + 1): ws.cell(row=r, column=c).fill = fill(CREAM)

def title(ws, text, sub=None, row=2):
    ws.cell(row=row, column=2, value=text).font = font(20, True, TEAL)
    ws.row_dimensions[row].height = 34
    if sub:
        ws.cell(row=row + 1, column=2, value=sub).font = font(11, color=MUTED)
        ws.row_dimensions[row + 1].height = 20

def header(ws, row, col, labels, height=26):
    for i, lab in enumerate(labels):
        c = ws.cell(row=row, column=col + i, value=lab)
        c.font = font(10, True, WHITE); c.fill = fill(TEAL)
        c.alignment = Alignment(horizontal="left" if i == 0 else "center", vertical="center", wrap_text=True)
    ws.row_dimensions[row].height = height

def cellstyle(c, bg=WHITE, fmt=None, f=None, align=None):
    c.fill = fill(bg); c.border = soft; c.font = f or font(10)
    c.alignment = Alignment(vertical="center", horizontal=align)
    if fmt: c.number_format = fmt

def card(ws, row, col1, col2, label, formula, fmt=None, good=False):
    """Carte KPI : libellé (petit, gris) au-dessus, valeur (grande, grasse)."""
    for r in (row, row + 1):
        if col2 > col1: ws.merge_cells(start_row=r, start_column=col1, end_row=r, end_column=col2)
        for c in range(col1, col2 + 1):
            cell = ws.cell(row=r, column=c); cell.fill = fill(TEAL2 if good else CARD)
            cell.border = Border(left=line if c == col1 else None, right=line if c == col2 else None,
                                 top=line if r == row else None, bottom=line if r == row + 1 else None)
    a = ws.cell(row=row, column=col1, value=label); a.font = font(9, True, MUTED)
    a.alignment = Alignment(vertical="bottom", indent=1)
    b = ws.cell(row=row + 1, column=col1, value=formula); b.font = font(15, True, TEAL if good else INK)
    b.alignment = Alignment(vertical="top", horizontal="left", indent=1)
    if fmt: b.number_format = fmt
    ws.row_dimensions[row].height = 20; ws.row_dimensions[row + 1].height = 28

wb = Workbook()
CATS = ["Chambre", "Promenade et voiture", "Repas", "Toilette et soin", "Vêtements", "Santé", "Valise maternité", "Éveil et jouets"]
ITEMS = [  # article, catégorie, priorité, prix prévu (exemples)
 ("Lit bébé + matelas", "Chambre", "Indispensable", 180), ("Gigoteuses (x2)", "Chambre", "Indispensable", 50), ("Commode / table à langer", "Chambre", "Utile", 150),
 ("Babyphone", "Chambre", "Utile", 60), ("Veilleuse", "Chambre", "Optionnel", 20), ("Draps housse (x3)", "Chambre", "Indispensable", 30),
 ("Poussette", "Promenade et voiture", "Indispensable", 350), ("Siège auto (cosy)", "Promenade et voiture", "Indispensable", 150), ("Porte-bébé / écharpe", "Promenade et voiture", "Utile", 60),
 ("Sac à langer", "Promenade et voiture", "Utile", 40), ("Biberons (x4)", "Repas", "Indispensable", 40), ("Chauffe-biberon", "Repas", "Optionnel", 35),
 ("Stérilisateur", "Repas", "Utile", 50), ("Tire-lait", "Repas", "Optionnel", 80), ("Coussin d'allaitement", "Repas", "Utile", 40),
 ("Bavoirs (x6)", "Repas", "Indispensable", 15), ("Baignoire bébé", "Toilette et soin", "Utile", 30), ("Thermomètre de bain", "Toilette et soin", "Optionnel", 8),
 ("Serviettes à capuche (x2)", "Toilette et soin", "Indispensable", 25), ("Couches (premier mois)", "Toilette et soin", "Indispensable", 60), ("Liniment / produits de soin", "Toilette et soin", "Indispensable", 25),
 ("Bodies (x8)", "Vêtements", "Indispensable", 40), ("Pyjamas (x6)", "Vêtements", "Indispensable", 45), ("Bonnets et chaussettes", "Vêtements", "Indispensable", 15),
 ("Combinaison / nid d'ange", "Vêtements", "Utile", 40), ("Thermomètre bébé", "Santé", "Indispensable", 20), ("Mouche-bébé + sérum phy", "Santé", "Indispensable", 15),
 ("Trousse de soins", "Santé", "Utile", 20), ("Tenues maman maternité", "Valise maternité", "Indispensable", 60), ("Soutiens-gorge d'allaitement", "Valise maternité", "Utile", 40),
 ("Tapis d'éveil", "Éveil et jouets", "Utile", 50), ("Doudou", "Éveil et jouets", "Indispensable", 15), ("Transat", "Éveil et jouets", "Optionnel", 60),
]
MENSUEL = [("Couches et lingettes", 50), ("Lait infantile (si biberon)", 60), ("Mode de garde (reste à charge)", 300), ("Produits de soin", 15),
           ("Vêtements (renouvellement)", 30), ("Pharmacie", 15), ("Activités / éveil", 10), (None, None), (None, None)]

# Mode d'emploi
m = wb.active; m.title = "Mode d'emploi"
page(m, {"B": 6, "C": 60})
m["B2"] = "BUDGET NAISSANCE"; m["B2"].font = font(9, True, WHITE); m.merge_cells("B2:C2"); m["B2"].fill = fill(CORAL)
m["B2"].alignment = Alignment(indent=1, vertical="center"); m.row_dimensions[2].height = 22
m["B4"] = "Budget arrivée de bébé"; m["B4"].font = font(24, True, TEAL); m.merge_cells("B4:C4"); m.row_dimensions[4].height = 40
m["B5"] = "Tous les achats pour bébé, ce qu'ils coûtent et ce qu'il reste à acheter, plus le budget mensuel après la naissance."
m["B5"].font = font(11, color=MUTED); m["B5"].alignment = Alignment(wrap_text=True, vertical="center"); m.merge_cells("B5:C5"); m.row_dimensions[5].height = 40
m["B7"] = "Comment ça marche"; m["B7"].font = font(14, True, TEAL); m.row_dimensions[7].height = 30
steps = ["Onglet « Achats » : la liste est déjà remplie (33 articles). Adaptez les prix prévus, supprimez ou ajoutez des lignes.",
         "Quand vous achetez : notez le prix payé et choisissez « Neuf », « Occasion » ou « Offert ».",
         "Onglet « Synthèse » : budget prévu, dépensé, économies et articles restants, par catégorie, tout seul.",
         "Onglet « Budget mensuel » : estimez les dépenses de chaque mois après la naissance."]
for i, txt in enumerate(steps):
    r = 8 + i
    n = m.cell(row=r, column=2, value=i + 1); n.font = font(12, True, WHITE); n.fill = fill(CORAL); n.alignment = Alignment(horizontal="center", vertical="center")
    t = m.cell(row=r, column=3, value=txt); t.fill = fill(WHITE); t.font = font(10); t.alignment = Alignment(wrap_text=True, vertical="center", indent=1)
    m.row_dimensions[r].height = 40
m["B13"] = "Les prix indiqués sont des exemples indicatifs : remplacez-les par les vôtres. Cases jaunes = à remplir."
m["B13"].font = font(9, italic=True, color=MUTED); m.merge_cells("B13:C13"); m["B13"].alignment = Alignment(wrap_text=True); m.row_dimensions[13].height = 30

# Achats
a = wb.create_sheet("Achats")
N = 80
page(a, {"B": 32, "C": 22, "D": 15, "E": 14, "F": 14, "G": 13}, rows=N + 12)
title(a, "Liste des achats pour bébé", "Prix prévu, prix payé, et d'où vient l'article.")
header(a, 5, 2, ["Article", "Catégorie", "Priorité", "Prix prévu", "Prix payé", "Provenance"])
for r in range(6, 6 + N):
    for c in range(2, 8): cellstyle(a.cell(row=r, column=c), SUN if r % 2 == 0 else SUN2)
    for c in (5, 6): a.cell(row=r, column=c).number_format = EUR
    a.row_dimensions[r].height = 21
for i, (art, cat, pr, px) in enumerate(ITEMS):
    r = 6 + i
    a.cell(row=r, column=2, value=art); a.cell(row=r, column=3, value=cat); a.cell(row=r, column=4, value=pr); a.cell(row=r, column=5, value=px)
for col, lst in ((3, '"' + ",".join(CATS) + '"'), (4, '"Indispensable,Utile,Optionnel"'), (7, '"Neuf,Occasion,Offert"')):
    dv = DataValidation(type="list", formula1=lst, allow_blank=True); a.add_data_validation(dv); dv.add(f"{chr(64 + col)}6:{chr(64 + col)}{5 + N}")
a.conditional_formatting.add(f"B6:G{5 + N}", FormulaRule(formula=['OR($G6="Neuf",$G6="Occasion",$G6="Offert")'], fill=fill(GREEN)))
a.freeze_panes = "A6"
R = f"6:{5 + N}"
ART, CAT, PRIO, PREV, PAYE, PROV = [f"Achats!${c}$6:${c}${5 + N}" for c in "BCDEFG"]

# Synthèse
s = wb.create_sheet("Synthèse")
page(s, {"B": 26, "C": 15, "D": 15, "E": 15, "F": 14, "G": 3}, rows=40)
title(s, "Synthèse du budget naissance")
card(s, 4, 2, 2, "Budget prévu", f"=SUM({PREV})", EUR)
card(s, 4, 3, 4, "Déjà dépensé", f"=SUM({PAYE})", EUR)
card(s, 4, 5, 6, "Articles restant à acheter", f'=COUNTA({ART})-COUNTIF({PROV},"Neuf")-COUNTIF({PROV},"Occasion")-COUNTIF({PROV},"Offert")', None, good=True)
card(s, 7, 2, 2, "Économisé (occasion / offert)", f'=SUMIFS({PREV},{PROV},"Occasion")-SUMIFS({PAYE},{PROV},"Occasion")+SUMIFS({PREV},{PROV},"Offert")', EUR, good=True)
card(s, 7, 3, 6, "Reste à prévoir (articles non achetés)", f'=SUM({PREV})-SUMIFS({PREV},{PROV},"<>")', EUR)
s.row_dimensions[6].height = 8; s.row_dimensions[9].height = 12
header(s, 10, 2, ["Catégorie", "Prévu", "Dépensé", "Écart", "Restants"])
for i, c in enumerate(CATS):
    r = 11 + i
    cellstyle(s.cell(row=r, column=2, value=c), WHITE, f=font(10, True))
    cellstyle(s.cell(row=r, column=3, value=f'=SUMIFS({PREV},{CAT},B{r})'), WHITE, EUR, align="right")
    cellstyle(s.cell(row=r, column=4, value=f'=SUMIFS({PAYE},{CAT},B{r})'), WHITE, EUR, align="right")
    cellstyle(s.cell(row=r, column=5, value=f'=SUMIFS({PREV},{CAT},B{r},{PROV},"<>")-D{r}'), WHITE, EUR, align="right")
    cellstyle(s.cell(row=r, column=6, value=f'=COUNTIFS({CAT},B{r},{ART},"<>")-COUNTIFS({CAT},B{r},{PROV},"<>")'), WHITE, "0", align="center")
    s.row_dimensions[r].height = 22
r = 11 + len(CATS)
cellstyle(s.cell(row=r, column=2, value="Total"), TEAL2, f=font(10, True, TEAL))
for col, L_ in ((3, "C"), (4, "D"), (5, "E"), (6, "F")):
    cellstyle(s.cell(row=r, column=col, value=f"=SUM({L_}11:{L_}{r - 1})"), TEAL2, "0" if col == 6 else EUR, font(10, True, TEAL), "center" if col == 6 else "right")
s.cell(row=r + 2, column=2, value="Écart = prévu − payé, sur les articles déjà achetés (positif = vous avez économisé).").font = font(9, italic=True, color=MUTED)

# Budget mensuel
b = wb.create_sheet("Budget mensuel")
page(b, {"B": 34, "C": 16}, rows=30)
title(b, "Budget mensuel après la naissance", "Estimez ce que bébé coûtera chaque mois.")
header(b, 5, 2, ["Dépense", "Par mois"])
for i, (n, v) in enumerate(MENSUEL):
    r = 6 + i
    cellstyle(b.cell(row=r, column=2, value=n), SUN); cellstyle(b.cell(row=r, column=3, value=v), SUN, EUR); b.row_dimensions[r].height = 22
r = 6 + len(MENSUEL)
cellstyle(b.cell(row=r, column=2, value="Total par mois"), TEAL2, f=font(10, True, TEAL))
cellstyle(b.cell(row=r, column=3, value=f"=SUM(C6:C{r - 1})"), TEAL2, EUR, font(10, True, TEAL))
cellstyle(b.cell(row=r + 1, column=2, value="Soit sur un an"), TEAL2, f=font(10, True, TEAL))
cellstyle(b.cell(row=r + 1, column=3, value=f"=C{r}*12"), TEAL2, EUR, font(10, True, TEAL))
b.cell(row=r + 3, column=2, value="Pensez à vérifier vos droits (CAF : prime de naissance, PAJE, complément de mode de garde) sur caf.fr.").font = font(9, italic=True, color=MUTED)

for ws in wb.worksheets:
    ws.sheet_properties.pageSetUpPr.fitToPage = True; ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 0
wb.save(OUT); print(OUT)
