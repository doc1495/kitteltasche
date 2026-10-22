
function seiteAnzeigen(seite) {
  document.getElementById("startseite").hidden =
    seite !== "startseite";

  document.getElementById("gewichtsrechner").hidden =
    seite !== "gewichtsrechner";

  document.getElementById("fluessigkeitsrechner").hidden =
    seite !== "fluessigkeitsrechner";
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

const istGitHubPages =
  window.location.hostname.endsWith(".github.io");

if (istGitHubPages && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((fehler) => {
        console.error("Offline-Funktion:", fehler);
      });
  });
}
// FLÜSSIGKEITSBEDARF NACH HOLLIDAY-SEGAR

const gewicht = document.getElementById("gewicht");
const tagesbedarf = document.getElementById("tagesbedarf");
const laufrate = document.getElementById("laufrate");

function fluessigkeitBerechnen() {

  const kg = Number(gewicht.value);

  if (
    !gewicht.value ||
    !Number.isFinite(kg) ||
    kg <= 0
  ) {
    tagesbedarf.textContent = "–";
    laufrate.textContent = "–";
    return;
  }

  let mlTag;

  if (kg <= 10) {

    mlTag = kg * 100;

  } else if (kg <= 20) {

    mlTag = 1000 + (kg - 10) * 50;

  } else {

    mlTag = 1500 + (kg - 20) * 20;

  }

  const mlStunde = mlTag / 24;

  tagesbedarf.textContent =
    mlTag.toLocaleString("de-DE", {
      maximumFractionDigits: 1
    }) + " ml/Tag";

  laufrate.textContent =
    mlStunde.toLocaleString("de-DE", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }) + " ml/h";

}

gewicht.addEventListener(
  "input",
  fluessigkeitBerechnen
);

function fluessigkeitZuruecksetzen() {
  gewicht.value = "";
  fluessigkeitBerechnen();
  gewicht.focus();
}

