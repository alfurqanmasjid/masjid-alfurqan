const BASE=window.MASJID_CONFIG.defaults;
let DATA=JSON.parse(localStorage.getItem("furqanAdminPrototype")||"null")||structuredClone(BASE);
let lang=localStorage.getItem("furqanLang")||"ur";
let timings=null, hijri=null;
const order=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const L={
ur:{alerts:"نماز الرٹس",admin:"ایڈمن",welcome:"خوش آمدید",nextJamaat:"اگلی جماعت",today:"آج",prayerTimes:"نماز کے اوقات",jummah:"جمعہ",jummahSub:"خطبہ / نماز",updates:"تازہ معلومات",announcements:"اعلانات",programs:"پروگرام",bayanEvents:"بیان و تقریبات",ramadan:"رمضان",ramadanTimetable:"رمضان ٹائم ٹیبل",eid:"عید",eidPrayer:"عید کی نماز",janazah:"جنازہ",janazahNotice:"جنازہ اطلاع",nikah:"نکاح",nikahInfo:"نکاح معلومات",duas:"دعائیں",commonDuas:"مسنون دعائیں",gallery:"گیلری",masjidGallery:"مسجد کی تصاویر",donate:"عطیات",donationDetails:"ڈونیشن تفصیلات",location:"مقام",findUs:"مسجد کا مقام",directions:"راستہ دیکھیں",people:"انتظامیہ",imamCommittee:"امام و کمیٹی",contact:"رابطہ",contactMasjid:"مسجد الفرقان سے رابطہ",adhan:"اذان",jamaat:"جماعت",sehri:"سحری",iftar:"افطار",taraweeh:"تراویح",noInfo:"فی الحال کوئی معلومات نہیں",tomorrow:"کل",notifyGranted:"نماز الرٹس فعال ہوگئے",notifyDenied:"براؤزر نوٹیفکیشن کی اجازت نہیں ملی",startsIn:"جماعت شروع ہونے میں",minutes:"منٹ",proceed:"مسجد کی طرف تشریف لائیں",silent:"نماز شروع ہوگئی — موبائل سائلنٹ کریں"},
en:{alerts:"Prayer Alerts",admin:"Admin",welcome:"Welcome to",nextJamaat:"Next Jamaat",today:"Today",prayerTimes:"Prayer Times",jummah:"Jummah",jummahSub:"Khutbah / Prayer",updates:"Latest",announcements:"Announcements",programs:"Programs",bayanEvents:"Bayan & Events",ramadan:"Ramadan",ramadanTimetable:"Ramadan Timetable",eid:"Eid",eidPrayer:"Eid Prayer",janazah:"Janazah",janazahNotice:"Janazah Notice",nikah:"Nikah",nikahInfo:"Nikah Information",duas:"Duas",commonDuas:"Common Duas",gallery:"Gallery",masjidGallery:"Masjid Gallery",donate:"Donate",donationDetails:"Donation Details",location:"Location",findUs:"Find Us",directions:"Get Directions",people:"People",imamCommittee:"Imam & Committee",contact:"Contact",contactMasjid:"Contact Masjid Al-Furqan",adhan:"Adhan",jamaat:"Jamaat",sehri:"Sehri",iftar:"Iftar",taraweeh:"Taraweeh",noInfo:"No information currently",tomorrow:"Tomorrow",notifyGranted:"Prayer alerts enabled",notifyDenied:"Browser notification permission was not granted",startsIn:"Jamaat starts in",minutes:"minutes",proceed:"Please proceed towards the masjid",silent:"Prayer has started — please silence your phone"}
};
const N={ur:{Fajr:"فجر",Dhuhr:"ظہر",Asr:"عصر",Maghrib:"مغرب",Isha:"عشاء"},en:{Fajr:"Fajr",Dhuhr:"Dhuhr",Asr:"Asr",Maghrib:"Maghrib",Isha:"Isha"}};
const $=id=>document.getElementById(id);
function clean(v){return String(v||"").split(" ")[0].slice(0,5)}
function show(hm){if(!hm)return"—";let[h,m]=hm.split(":").map(Number);let a=h>=12?"PM":"AM";h=h%12||12;return `${h}:${String(m).padStart(2,"0")} ${a}`}
function mins(hm){let[h,m]=hm.split(":").map(Number);return h*60+m}
function nowK(){let p=new Intl.DateTimeFormat("en-US",{timeZone:DATA.timezone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(new Date()),o={};p.forEach(x=>o[x.type]=x.value);return{h:+o.hour,mi:+o.minute,s:+o.second}}
function secUntil(hm,tmr=false){let n=nowK(),[h,m]=hm.split(":").map(Number),s=h*3600+m*60-(n.h*3600+n.mi*60+n.s);return tmr?s+86400:s}
function dur(s){s=Math.max(0,Math.floor(s));return [Math.floor(s/3600),Math.floor((s%3600)/60),s%60].map(x=>String(x).padStart(2,"0")).join(":")}
function eff(){let o={};order.forEach(k=>o[k]=DATA.jamaatTimes[k]||clean(timings?.[k]));return o}
function applyLang(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==="ur"?"rtl":"ltr";
 document.querySelectorAll("[data-i18n]").forEach(el=>{let k=el.dataset.i18n;if(L[lang][k])el.textContent=L[lang][k]});
 $("langBtn").textContent=lang==="ur"?"EN":"UR";
 $("brandName").textContent=lang==="ur"?DATA.mosqueNameUr:DATA.mosqueNameEn;
 $("heroName").textContent=$("brandName").textContent;
 $("brandLoc").textContent=lang==="ur"?DATA.locationUr:DATA.locationEn;
 $("heroLocation").textContent=$("brandLoc").textContent;
 if(hijri)$("hijriDate").textContent=lang==="ur"?`${hijri.day} ${hijri.month.ar} ${hijri.year}ھ`:`${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
}
async function loadPrayer(){
 try{
  let u=`https://api.aladhan.com/v1/timings/${Math.floor(Date.now()/1000)}?latitude=${DATA.latitude}&longitude=${DATA.longitude}&method=${DATA.calculationMethod}&school=${DATA.school}`;
  let r=await fetch(u,{cache:"no-store"}),j=await r.json();timings=j.data.timings;hijri=j.data.date.hijri;applyLang();renderPrayer()
 }catch(e){console.error(e)}
}
function nextInfo(){let e=eff(),n=nowK(),m=n.h*60+n.mi,next=order.find(k=>e[k]&&mins(e[k])>m),tmr=false;if(!next){next="Fajr";tmr=true}return{e,next,tmr,sec:secUntil(e[next],tmr)}}
function renderPrayer(){
 if(!timings)return;let {e,next,tmr,sec}=nextInfo();let g=$("prayerGrid");g.innerHTML="";
 order.forEach(k=>{let c=document.createElement("article");c.className="prayer-card"+(k===next&&!tmr?" active":"");c.innerHTML=`<h3>${N[lang][k]}</h3><div class="p-row"><span>${L[lang].adhan}</span><strong>${show(clean(timings[k]))}</strong></div><div class="p-row"><span>${L[lang].jamaat}</span><strong>${show(e[k])}</strong></div>`;g.appendChild(c)});
 $("nextName").textContent=N[lang][next]+(tmr?` (${L[lang].tomorrow})`:"");$("nextAt").textContent=`${L[lang].jamaat}: ${show(e[next])}`;$("countdown").textContent=dur(sec);$("jummahTime").textContent=show(DATA.jummah);handleAlert(next,sec)
}
let notifiedKey="";
function handleAlert(next,sec){
 const banner=$("alertBanner"),m=Math.ceil(sec/60);let msg="";
 if(sec<=60&&sec>=0)msg=L[lang].silent;else if(m<=5)msg=`🕌 ${L[lang].proceed} — ${m} ${L[lang].minutes}`;else if(m<=10)msg=`🔔 ${N[lang][next]} ${L[lang].startsIn} ${m} ${L[lang].minutes}`;
 if(msg){banner.textContent=msg;banner.classList.remove("hidden");let key=`${next}-${m}`;if(Notification?.permission==="granted"&&key!==notifiedKey){new Notification("Masjid Al-Furqan",{body:msg});notifiedKey=key}}else banner.classList.add("hidden")
}
function cards(id,arr){let el=$(id);el.innerHTML="";(arr||[]).forEach(x=>{let c=document.createElement("article");c.className="card";c.innerHTML=`${x.date?`<div class="meta">${x.date}</div>`:""}<h3>${lang==="ur"?(x.titleUr||x.titleEn):(x.titleEn||x.titleUr)}</h3><p>${lang==="ur"?(x.bodyUr||x.bodyEn||""):(x.bodyEn||x.bodyUr||"")}</p>`;el.appendChild(c)})}
function renderSections(){
 cards("announcements",DATA.announcements);cards("events",DATA.events);
 let r=DATA.ramadan;$("ramadanBox").innerHTML=r.enabled?`<div class="info-line"><span>${L[lang].sehri}</span><strong>${show(r.sehri)}</strong></div><div class="info-line"><span>${L[lang].iftar}</span><strong>${show(r.iftar)}</strong></div><div class="info-line"><span>${L[lang].taraweeh}</span><strong>${show(r.taraweeh)}</strong></div><p>${lang==="ur"?r.noteUr:r.noteEn}</p>`:`<p>${L[lang].noInfo}</p>`;
 let e=DATA.eid;$("eidBox").innerHTML=e.enabled?`<div class="info-line"><span>${L[lang].eidPrayer}</span><strong>${show(e.time)}</strong></div><p>${lang==="ur"?e.noteUr:e.noteEn}</p>`:`<p>${L[lang].noInfo}</p>`;
 let j=DATA.janazah;$("janazahBox").innerHTML=j.enabled?`<h4>${lang==="ur"?j.titleUr:j.titleEn}</h4><p>${lang==="ur"?j.bodyUr:j.bodyEn}</p>`:`<p>${lang==="ur"?j.titleUr:j.titleEn}</p>`;
 let n=DATA.nikah;$("nikahBox").innerHTML=n.enabled?`<h4>${lang==="ur"?n.titleUr:n.titleEn}</h4><p>${lang==="ur"?n.bodyUr:n.bodyEn}</p>`:`<p>${L[lang].noInfo}</p>`;
 let dg=$("duasGrid");dg.innerHTML="";DATA.duas.forEach(d=>{let c=document.createElement("article");c.className="dua-card";c.innerHTML=`<h3>${lang==="ur"?d.titleUr:d.titleEn}</h3><div class="dua-ar" dir="rtl">${d.arabic}</div><div class="dua-trans">${lang==="ur"?d.transUr:d.transEn}</div>`;dg.appendChild(c)});
 let gal=$("gallery");gal.innerHTML="";DATA.gallery.forEach(src=>{let im=document.createElement("img");im.src=src;im.onclick=()=>window.open(src,"_blank");gal.appendChild(im)});
 let d=DATA.donation;$("donationBox").innerHTML=`<img class="qr" src="${d.qrImage}" alt="Donation QR"><div class="info-line"><span>Bank</span><strong>${d.bankName}</strong></div><div class="info-line"><span>Title</span><strong>${d.accountTitle}</strong></div><div class="info-line"><span>IBAN</span><strong>${d.iban}</strong></div>`;
 $("mapFrame").src=DATA.map.embedUrl;$("directionsBtn").href=DATA.map.directionsUrl;
 cards("committee",DATA.committee.map(p=>({titleUr:p.nameUr,titleEn:p.nameEn,bodyUr:p.roleUr+(p.phone?` • ${p.phone}`:""),bodyEn:p.roleEn+(p.phone?` • ${p.phone}`:"")})));
 let cl=$("contactLinks");cl.innerHTML="";let c=DATA.contact;[[c.phone,c.phone?`tel:${c.phone}`:"","Phone"],[c.whatsapp,c.whatsapp?`https://wa.me/${c.whatsapp.replace(/\D/g,"")}`:"","WhatsApp"],[c.email,c.email?`mailto:${c.email}`:"","Email"]].forEach(([v,h,l])=>{if(v){let a=document.createElement("a");a.href=h;a.target="_blank";a.textContent=l;cl.appendChild(a)}})
}
function tick(){$("clock").textContent=new Intl.DateTimeFormat("en-US",{timeZone:DATA.timezone,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(new Date());$("gregDate").textContent=new Intl.DateTimeFormat(lang==="ur"?"ur-PK":"en-GB",{timeZone:DATA.timezone,weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());if(timings)renderPrayer()}
$("langBtn").onclick=()=>{lang=lang==="ur"?"en":"ur";localStorage.setItem("furqanLang",lang);applyLang();renderSections();if(timings)renderPrayer()};
$("notifyBtn").onclick=async()=>{if(!("Notification"in window)){alert("Notifications are not supported in this browser.");return}let p=await Notification.requestPermission();alert(p==="granted"?L[lang].notifyGranted:L[lang].notifyDenied)};
applyLang();renderSections();loadPrayer();tick();setInterval(tick,1000);setInterval(loadPrayer,6*60*60*1000);
