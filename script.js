const API = "/api/wl?rbl=602009";

let departures = [];
let currentIndex = 0;

async function loadData() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        let list = [];

        if (data.data.monitors && data.data.monitors.length > 0) {

            data.data.monitors.forEach(m => {
                m.lines.forEach(l => {

                    l.departures.departure.forEach(d => {

                        let minutes = null;

                        // countdown vorhanden
                        if (d.departureTime.countdown !== undefined) {
                            minutes = d.departureTime.countdown;
                        }

                        // fallback → geplante zeit berechnen
                        else if (d.departureTime.timePlanned) {
                            const date = new Date(d.departureTime.timePlanned);
                            minutes = Math.round((date - new Date()) / 60000);
                        }

                        if (minutes !== null && minutes >= 0) {
                            list.push({
                                line: l.name,
                                dest: l.towards.toUpperCase(),
                                minutes: minutes,
                                platform: "2"
                            });
                        }

                    });

                });
            });

        }

        // SORTIEREN (wichtig!)
        list.sort((a, b) => a.minutes - b.minutes);

        departures = list;
        currentIndex = 0;

    } catch (e) {
        console.log("Fehler", e);
    }
}

function showNext() {
    const elTime = document.getElementById("time");

    if (departures.length === 0) {
        elTime.innerText = "--";
        return;
    }

    const d = departures[currentIndex];

    document.getElementById("line").innerText = d.line;
    document.getElementById("destination").innerText = d.dest;
    document.getElementById("time").innerText = d.minutes;
    document.getElementById("platform").innerText = "Gleis " + d.platform;

    const star = document.getElementById("star");

    if (d.minutes <= 1) {
        star.classList.add("active-star");
        star.style.opacity = 1;
    } else {
        star.classList.remove("active-star");
        star.style.opacity = 0;
    }

    // wenn zug weg → nächste anzeigen
    if (d.minutes <= 0) {
        currentIndex = (currentIndex + 1) % departures.length;
    }
}

// countdown runterzählen + anzeigen
setInterval(() => {
    showNext();

    departures.forEach(d => d.minutes--);

}, 1000);

// neue daten holen
setInterval(loadData, 15000);

loadData();
