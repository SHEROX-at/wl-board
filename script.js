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

                        let minutes;

                        if (d.departureTime.countdown !== undefined) {
                            minutes = d.departureTime.countdown;
                        } else if (d.departureTime.timePlanned) {
                            const date = new Date(d.departureTime.timePlanned);
                            minutes = Math.round((date - new Date()) / 60000);
                        }

                        if (minutes >= 0) {
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

        // sortieren
        list.sort((a, b) => a.minutes - b.minutes);

        departures = list;
        currentIndex = 0;

    } catch (e) {
        console.log("Fehler");
    }
}

function showNext() {
    if (departures.length === 0) return;

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

    // wenn weg → nächste
    if (d.minutes <= 0) {
        currentIndex = (currentIndex + 1) % departures.length;
    }
}

// Daten alle 15s holen
setInterval(loadData, 15000);

// Anzeige jede Sekunde aktualisieren
setInterval(() => {
    showNext();

    if (departures.length > 0) {
        departures.forEach(d => d.minutes--);
    }
}, 1000);

loadData();
