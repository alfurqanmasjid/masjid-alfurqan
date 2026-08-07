const CORE = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

const ORDER = [
    "Fajr",
    "Ishraq",
    "Chasht",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
    "Jummah"
];

function effectiveJamaat(){

    const s = MASJID_APP.settings;
    const t = PRAYER_API.timings || {};
    const c = TIME_UTILS;

    return{

        Fajr:s.jamaat.Fajr,

        Ishraq:s.jamaat.Ishraq,

        Chasht:s.jamaat.Chasht,

        Dhuhr:s.jamaat.Dhuhr,

        Asr:s.jamaat.Asr,

        Maghrib:s.jamaat.Maghrib || c.clean(t.Maghrib),

        Isha:s.jamaat.Isha,

        Jummah:s.jamaat.Jummah

    };

}

function nextInfo(){

    const e = effectiveJamaat();

    const c = TIME_UTILS;

    const now = c.nowParts();

    const nowMinutes = now.h*60 + now.m;

    const prayers = CORE
    .filter(p=>e[p])
    .map(p=>({

        key:p,

        time:e[p],

        minutes:c.toMin(e[p])

    }));

    let next = prayers.find(p=>p.minutes > nowMinutes);

    let tomorrow = false;

    if(!next){

        next = prayers[0];

        tomorrow = true;

    }

    return{

        ...next,

        tomorrow,

        seconds:c.secUntil(next.time,tomorrow)

    };

}
window.renderPrayerTable = function () {

    const t = PRAYER_API.timings;
    const c = TIME_UTILS;
    const l = MASJID_LANG;

    if (!t) return;

    const e = effectiveJamaat();
    const next = nextInfo();

    const adhan = {
        Fajr: c.clean(t.Fajr),
        Ishraq: "",
        Chasht: "",
        Dhuhr: c.clean(t.Dhuhr),
        Asr: c.clean(t.Asr),
        Maghrib: c.clean(t.Maghrib),
        Isha: c.clean(t.Isha),
        Jummah: ""
    };

    const rows = document.getElementById("prayerRows");

    rows.innerHTML = "";

    ORDER.forEach(prayer => {

        const tr = document.createElement("tr");

        if (prayer === next.key && !next.tomorrow) {
            tr.classList.add("active");
        }

        const icon = {
            Fajr: "🌅",
            Ishraq: "☀",
            Chasht: "🌤",
            Dhuhr: "☀",
            Asr: "🌇",
            Maghrib: "🌆",
            Isha: "🌙",
            Jummah: "🕌"
        }[prayer];

        const prayerName = l.prayerNames[l.current][prayer];

        const adhanTime = adhan[prayer]
            ? c.show(adhan[prayer])
            : "—";

        const jamaatTime = e[prayer]
            ? c.show(e[prayer])
            : "—";

        tr.innerHTML = `
            <td class="prayer-col">
                <span class="prayer-icon">${icon}</span>
                <span class="prayer-text">${prayerName}</span>
            </td>

            <td class="time ${adhan[prayer] ? "" : "muted-time"}">
                ${adhanTime}
            </td>

            <td class="time ${e[prayer] ? "" : "muted-time"}">
                ${jamaatTime}
            </td>
        `;

        rows.appendChild(tr);

    });

    document.getElementById("nextPrayerName").textContent =
        l.prayerNames[l.current][next.key] +
        (next.tomorrow
            ? (l.current === "ur" ? " (کل)" : " (Tomorrow)")
            : "");

    document.getElementById("nextPrayerTime").textContent =
        c.show(next.time);

    document.getElementById("nextCountdown").textContent =
        c.duration(next.seconds);

};
async function initPrayer() {

    try {

        const data = await PRAYER_API.loadToday();

        const hijri = data.date.hijri;

        const lang = MASJID_LANG;

        document.getElementById("hijriDate").textContent =
            lang.current === "ur"
                ? `${hijri.day} ${hijri.month.ar} ${hijri.year} ھ`
                : `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;

        renderPrayerTable();

    }

    catch (err) {

        console.error(err);

        document.getElementById("prayerRows").innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;padding:25px;">
                    Unable to load prayer timings.
                </td>
            </tr>
        `;

    }

}

initPrayer();

setInterval(() => {

    if (PRAYER_API.timings) {

        renderPrayerTable();

    }

},1000);