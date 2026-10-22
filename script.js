
function seiteAnzeigen(seite) {
  document.getElementById("startseite").hidden =
    seite !== "startseite";

  document.getElementById("gewichtsrechner").hidden =
    seite !== "gewichtsrechner";
}

const geburt = document.getElementById("geburt");
const aktuell = document.getElementById("aktuell");
const differenz = document.getElementById("differenz");

function berechnen() {
  const g = Number(geburt.value);
  const a = Number(aktuell.value);

  if (
    !geburt.value ||
    !aktuell.value ||
    !Number.isFinite(g) ||
    !Number.isFinite(a) ||
    g <= 0 ||
    a <= 0
  ) {
    ergebnis.textContent = "–";
    differenz.textContent = ""; return;
  }

  const prozent = ((g - a) / g) * 100;
  const wert = Math.abs(prozent)
    .toFixed(1)
    .replace(".", ",");

  if (prozent > 0) {
    ergebnis.textContent = wert + " % Gewichtsverlust";
  } else if (prozent < 0) {
    ergebnis.textContent = wert + " % Gewichtszunahme";
  } else {
    ergebnis.textContent = "Keine Gewichtsänderung";
  }
const gramm = Math.round(Math.abs(g - a));

differenz.textContent =
  gramm + " g " +
  (g > a ? "abgenommen" :
   g < a ? "zugenommen" : "Veränderung");
}

geburt.addEventListener("input", berechnen);
aktuell.addEventListener("input", berechnen);
function zuruecksetzen() {
  geburt.value = "";
  aktuell.value = "";
  berechnen();
  geburt.focus();
}


