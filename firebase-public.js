import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyAG3FCrtzDB8hU5YwvsvegG94ZeIw3HozQ",authDomain:"masjid-al-furqan-2026.firebaseapp.com",projectId:"masjid-al-furqan-2026",storageBucket:"masjid-al-furqan-2026.firebasestorage.app",messagingSenderId:"176201871976",appId:"1:176201871976:web:e38c8d50f69d5fca0b81dd"};
try{
 const db=getFirestore(initializeApp(firebaseConfig)); const snap=await getDoc(doc(db,"masjid","settings"));
 if(snap.exists()){
  const x=snap.data(), d=window.MASJID_CONFIG.defaults;
  if(x.jamaat) d.jamaat={...d.jamaat,...x.jamaat}; if(x.jummah) d.jummah=x.jummah;
  d.editable={...d.editable,...(x.editable||{})};
  window.dispatchEvent(new Event("masjid-data-updated"));
 }
}catch(e){console.warn("Using built-in Masjid information.",e)}
