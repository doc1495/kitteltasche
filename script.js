
function seiteAnzeigen(seite) {
  document.getElementById("startseite").hidden =
    seite !== "startseite";

  document.getElementById("gewichtsrechner").hidden =
    seite !== "gewichtsrechner";

  document.getElementById("fluessigkeitsrechner").hidden =
    seite !== "fluessigkeitsrechner";
    document.getElementById("nahrungsrechner").hidden =
  seite !== "nahrungsrechner";

  document.getElementById("neobilanz").hidden =
  seite !== "neobilanz";

document.getElementById("bilirubinrechner").hidden =
  seite !== "bilirubinrechner";

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



// NAHRUNGSAUFBAU – FRÜH- UND REIFGEBORENE

const neoTyp = document.getElementById("neo-typ");
const neoGewicht = document.getElementById("neo-gewicht");
const neoLebenstag = document.getElementById("neo-lebenstag");
const neoMahlzeiten = document.getElementById("neo-mahlzeiten");

const neoManuell = document.getElementById("neo-manuell");
const neoManuellBereich =
  document.getElementById("neo-manuell-bereich");
const neoZielmenge = document.getElementById("neo-zielmenge");

const neoVorschlag = document.getElementById("neo-vorschlag");
const neoTagesmenge = document.getElementById("neo-tagesmenge");
const neoEinzelmenge = document.getElementById("neo-einzelmenge");
const neoHinweis = document.getElementById("neo-hinweis");

// Tagesmengen: Index 0 entspricht Lebenstag 1
const schemaFrueh = [20, 50, 75, 100, 125, 150];
const schemaReif = [30, 60, 80, 100, 120, 150];

function neoBerechnen() {
  const gewichtText = neoGewicht.value.trim().replace(",", ".");
  const gewicht = Number(gewichtText);

  const tag = Number(neoLebenstag.value);
  const mahlzeiten = Number(neoMahlzeiten.value);

  neoManuellBereich.hidden = !neoManuell.checked;

  const schema =
    neoTyp.value === "frueh" ? schemaFrueh : schemaReif;

  // Ab Lebenstag 7 technisch letzten Wert fortführen
  const index = Math.min(tag - 1, schema.length - 1);
  const vorgeschlagen = schema[index];

  neoVorschlag.textContent =
    vorgeschlagen + " ml/kg/Tag";

  const zielText = neoZielmenge.value.trim().replace(",", ".");
  const ziel = neoManuell.checked
    ? (zielText === "" ? NaN : Number(zielText))
    : vorgeschlagen;

  neoTagesmenge.textContent = "–";
  neoEinzelmenge.textContent = "–";
  neoHinweis.textContent = "";

  if (
    gewichtText === "" ||
    !Number.isFinite(gewicht) ||
    gewicht <= 0 ||
    gewicht > 6000 ||
    !Number.isFinite(ziel) ||
    ziel < 0 ||
    ziel > 250
  ) {
    neoHinweis.textContent =
      "Bitte gültiges Gewicht und gültige Zielmenge eingeben.";
    return;
  }

  const kg = gewicht / 1000;
  const mlTag = kg * ziel;
  const mlMahlzeit = mlTag / mahlzeiten;

  function format(zahl) {
    return zahl.toLocaleString("de-DE", {
      maximumFractionDigits: 1
    });
  }

  neoTagesmenge.textContent =
    format(mlTag) + " ml/Tag";

  neoEinzelmenge.textContent =
    format(mlMahlzeit) + " ml";

  neoHinweis.textContent =
    format(ziel) + " ml/kg/Tag · " +
    mahlzeiten + " Mahlzeiten";
}

// Eingaben aktualisieren die Berechnung
[
  neoGewicht,
  neoZielmenge
].forEach((feld) => {
  feld.addEventListener("input", neoBerechnen);
});

[
  neoTyp,
  neoLebenstag,
  neoMahlzeiten,
  neoManuell
].forEach((feld) => {
  feld.addEventListener("change", neoBerechnen);
});

// Rechner zurücksetzen
function nahrungZuruecksetzen() {
  neoTyp.value = "frueh";
  neoGewicht.value = "";
  neoLebenstag.value = "1";
  neoMahlzeiten.value = "8";
  neoManuell.checked = false;
  neoZielmenge.value = "";

  neoBerechnen();
  neoGewicht.focus();
}

// Rechner beim Start initialisieren
neoBerechnen();


// FLÜSSIGKEITSBEDARF NEONATOLOGIE

const bilanzGeburtsgewicht =
  document.getElementById("bilanz-geburtsgewicht");
const bilanzGewicht =
  document.getElementById("bilanz-gewicht");
const bilanzLebenstag =
  document.getElementById("bilanz-lebenstag");
const bilanzManuell =
  document.getElementById("bilanz-manuell");
const bilanzManuellBereich =
  document.getElementById("bilanz-manuell-bereich");
const bilanzGesamt =
  document.getElementById("bilanz-gesamt");
const bilanzEnteral =
  document.getElementById("bilanz-enteral");
const bilanzSonstige =
  document.getElementById("bilanz-sonstige");

const bilanzVorschlag =
  document.getElementById("bilanz-vorschlag");
const bilanzRest =
  document.getElementById("bilanz-rest");
const bilanzRate =
  document.getElementById("bilanz-rate");
const bilanzHinweis =
  document.getElementById("bilanz-hinweis");

// Lokale Tabelle aus dem Foto, ml/kg/Tag
// Null = Wert nicht eindeutig verfügbar.
// Keine automatische Ergänzung fehlender Werte.

const neoFluessigkeit = {
  unter1000: [
    80, 90, 110, 130, 150,
    null, null, null, null, null
  ],
  bis2000: [
    70, 80, 100, 110, 120,
    130, 140, 150, 160, 170
  ],
  ueber2000: [
    60, 80, 90, 100, 110,
    120, 130, 140, 150, 160
  ]
};

function bilanzZahl(feld) {
  const text = feld.value.trim().replace(",", ".");
  if (text === "") return null;

  const zahl = Number(text);
  return Number.isFinite(zahl) ? zahl : null;
}

function bilanzFormat(zahl) {
  return zahl.toLocaleString("de-DE", {
    maximumFractionDigits: 1
  });
}

function bilanzBerechnen() {
  const geburt = bilanzZahl(bilanzGeburtsgewicht);
  const gewicht = bilanzZahl(bilanzGewicht);
  const lebenstag = Number(bilanzLebenstag.value);
  const enteral = bilanzZahl(bilanzEnteral);
  const sonstige = bilanzZahl(bilanzSonstige);

  bilanzManuellBereich.hidden = !bilanzManuell.checked;

  bilanzVorschlag.textContent = "–";
  bilanzRest.textContent = "–";
  bilanzRate.textContent = "–";
  bilanzHinweis.textContent = "";

  // Eingaben prüfen
  if (
    geburt === null ||
    gewicht === null ||
    geburt <= 0 ||
    gewicht <= 0 ||
    geburt > 6000 ||
    gewicht > 6000 ||
    enteral === null ||
    enteral < 0 ||
    sonstige === null ||
    sonstige < 0
  ) {
    bilanzHinweis.textContent =
      "Bitte gültige Gewichte und Zufuhrmengen eingeben.";
    return;
  }

  // Gewichtsklasse anhand des Geburtsgewichts
  let gruppe;

  if (geburt < 1000) {
    gruppe = neoFluessigkeit.unter1000;
  } else if (geburt <= 2000) {
    gruppe = neoFluessigkeit.bis2000;
  } else {
    gruppe = neoFluessigkeit.ueber2000;
  }

  const vorschlag = gruppe[lebenstag - 1];

  bilanzVorschlag.textContent =
    vorschlag === null
      ? "Kein eindeutiger Tabellenwert"
      : vorschlag + " ml/kg/Tag";

  // Automatisches oder manuelles Flüssigkeitsziel
  const ziel = bilanzManuell.checked
    ? bilanzZahl(bilanzGesamt)
    : vorschlag;

  if (
    ziel === null ||
    ziel < 0 ||
    ziel > 300
  ) {
    bilanzHinweis.textContent =
      "Kein gültiges Flüssigkeitsziel vorhanden. " +
      "Bitte gegebenenfalls manuell festlegen.";
    return;
  }

  const kg = gewicht / 1000;

  const gesamtMl = kg * ziel;
  const enteralMl = kg * enteral;

  const restMl = gesamtMl - enteralMl - sonstige;

  bilanzRest.textContent =
    bilanzFormat(restMl) + " ml/Tag";

  if (restMl < 0) {
    bilanzHinweis.textContent =
      "Achtung: Die geplante Flüssigkeitszufuhr " +
      "überschreitet das Gesamtziel um " +
      bilanzFormat(Math.abs(restMl)) + " ml/Tag.";
    return;
  }

  const rate = restMl / 24;

  bilanzRate.textContent =
    bilanzFormat(rate) + " ml/h";

  bilanzHinweis.textContent =
    "Gesamtziel: " +
    bilanzFormat(gesamtMl) +
    " ml/Tag. Enteral: " +
    bilanzFormat(enteralMl) +
    " ml/Tag. Sonstige Zufuhr: " +
    bilanzFormat(sonstige) +
    " ml/Tag.";
}

// Alle Eingaben verbinden
[
  bilanzGeburtsgewicht,
  bilanzGewicht,
  bilanzGesamt,
  bilanzEnteral,
  bilanzSonstige
].forEach((feld) => {
  feld.addEventListener("input", bilanzBerechnen);
});

[
  bilanzLebenstag,
  bilanzManuell
].forEach((feld) => {
  feld.addEventListener("change", bilanzBerechnen);
});

// Rechner zurücksetzen
function bilanzZuruecksetzen() {
  bilanzGeburtsgewicht.value = "";
  bilanzGewicht.value = "";
  bilanzLebenstag.value = "1";
  bilanzEnteral.value = "0";
  bilanzSonstige.value = "0";
  bilanzManuell.checked = false;
  bilanzGesamt.value = "";

  bilanzBerechnen();
  bilanzGeburtsgewicht.focus();
}

bilanzBerechnen();

/* =====================================
   BILIRUBIN NEO
   Lokales SOP-Schema
===================================== */

const biliSsw = document.getElementById("bili-ssw");
const biliSswTage = document.getElementById("bili-ssw-tage");
const biliAlter = document.getElementById("bili-alter");
const biliAlterEinheit = document.getElementById("bili-alter-einheit");
const biliWert = document.getElementById("bili-wert");
const biliEinheit = document.getElementById("bili-einheit");
const biliCoombs = document.getElementById("bili-coombs");

const biliGrenze = document.getElementById("bili-grenze");
const biliAbstand = document.getElementById("bili-abstand");
const biliStatus = document.getElementById("bili-status");
const biliWarnung = document.getElementById("bili-warnung");

const BILI_UMRECHNUNG = 17.104;

function biliZahl(feld) {
  const text = feld.value.trim().replace(",", ".");

  if (text === "") return null;

  const wert = Number(text);

  return Number.isFinite(wert) ? wert : null;
}

function biliFormat(wert) {
  return wert.toLocaleString("de-DE", {
    maximumFractionDigits: 1
  });
}

function bilirubinBerechnen() {

  const ssw = biliZahl(biliSsw);
  const sswTage = biliZahl(biliSswTage);
  const alter = biliZahl(biliAlter);
  const bilirubin = biliZahl(biliWert);

  // Ergebnisse zunächst zurücksetzen
  biliGrenze.textContent = "–";
  biliAbstand.textContent = "–";
  biliStatus.textContent = "";
  biliWarnung.textContent = "";

  // Pflichtangaben kontrollieren
  if (
  ssw === null ||
  sswTage === null ||
  alter === null
) {
  return;
}

  if (
    !Number.isInteger(ssw) ||
    ssw < 22 ||
    ssw > 44 ||
    !Number.isInteger(sswTage) ||
    sswTage < 0 ||
    sswTage > 6 ||
   alter < 0 ||
(bilirubin !== null && bilirubin < 0)
  ) {
    biliWarnung.textContent =
      "Bitte gültige Eingaben überprüfen.";
    return;
  }

  // Lebensalter in Stunden umrechnen
  const lebensstunden =
    biliAlterEinheit.value === "tage"
      ? alter * 24
      : alter;

  // Bilirubin immer in mg/dl umrechnen
  const bilirubinMg =
    biliEinheit.value === "umol"
      ? bilirubin / BILI_UMRECHNUNG
      : bilirubin;

  // Alterskorrektur nach lokalem Schema
  let altersabzug = 0;

  if (lebensstunden < 24) {
    altersabzug = 6;
  } else if (lebensstunden < 48) {
    altersabzug = 4;
  } else if (lebensstunden < 72) {
    altersabzug = 2;
  }

  // Coombs-Korrektur
  const coombsAbzug =
    biliCoombs.checked ? 2 : 0;

  // Vollendete aktuelle SSW
  const grenze =
    ssw - 20 - altersabzug - coombsAbzug;

  // Sicherheit: keine negativen Grenzwerte ausgeben
  if (grenze <= 0) {
    biliWarnung.textContent =
      "Keine klinisch sinnvoll interpretierbare " +
      "Grenze aus der lokalen Formel ableitbar. " +
      "Individuelle neonatologische Beurteilung erforderlich.";
    return;
  }

  // Fototherapiegrenze anzeigen
  biliGrenze.textContent =
    biliFormat(grenze) + " mg/dl";

 
  // Abstand nur berechnen, wenn Bilirubin eingegeben wurde
  if (bilirubin !== null) {

    const differenz = grenze - bilirubinMg;

    if (differenz > 0) {
      biliAbstand.textContent =
        biliFormat(differenz) +
        " mg/dl unter der Grenze";

      biliStatus.textContent =
        "Rechnerische Fototherapiegrenze nicht erreicht.";

    } else {
      biliAbstand.textContent =
        biliFormat(Math.abs(differenz)) +
        " mg/dl über der Grenze";

      biliStatus.textContent =
        "Rechnerische Fototherapiegrenze erreicht " +
        "oder überschritten. Klinische Beurteilung erforderlich.";
    }
  }


  // Warnhinweise
  const hinweise = [];

  if (lebensstunden < 24) {
    hinweise.push(
      "Ikterus innerhalb der ersten 24 Stunden: " +
      "zeitnahe Abklärung einer möglichen Hämolyse " +
      "und weiterer Ursachen erforderlich."
    );
  }

  if (lebensstunden > 14 * 24) {
    hinweise.push(
      "Prolongierter Ikterus beachten: " +
      "bei reifen Neugeborenen nach über 14 Tagen, " +
      "bei Frühgeborenen nach über 21 Tagen " +
      "insbesondere konjugiertes Bilirubin und " +
      "mögliche Cholestase abklären."
    );
  }

  biliWarnung.textContent = hinweise.join(" ");

}

// Automatische Neuberechnung
[
  biliSsw,
  biliSswTage,
  biliAlter,
  biliWert
].forEach((feld) => {
  feld.addEventListener("input", bilirubinBerechnen);
});

[
  biliAlterEinheit,
  biliCoombs
].forEach((feld) => {
  feld.addEventListener("change", bilirubinBerechnen);
});

// Einheit wechseln und bestehenden Wert umrechnen
biliEinheit.addEventListener("change", () => {

  const wert = biliZahl(biliWert);

  if (wert !== null && wert >= 0) {
    if (biliEinheit.value === "umol") {
      biliWert.value =
        (wert * BILI_UMRECHNUNG).toFixed(2);
    } else {
      biliWert.value =
        (wert / BILI_UMRECHNUNG).toFixed(2);
    }
  }

  bilirubinBerechnen();
});

// Zurücksetzen
function bilirubinZuruecksetzen() {
  biliSsw.value = "";
  biliSswTage.value = "";
  biliAlter.value = "";
  biliAlterEinheit.value = "stunden";
  biliWert.value = "";
  biliEinheit.value = "mg";
  biliCoombs.checked = false;

  bilirubinBerechnen();
  biliSsw.focus();
}

bilirubinBerechnen();




