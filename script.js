// Advanced version (Full Analytics + Location + CTA tracking)

const ANALYTICS_ENDPOINT = '';
const ANALYTICS_USE_GAS = false;

const stores = [
  { name: "원신흥점", lat: 36.3342, lng: 127.3406 },
  { name: "용문점", lat: 36.3387, lng: 127.3938 },
  { name: "용운점", lat: 36.3213, lng: 127.4589 },
  { name: "아산권곡점", lat: 36.7775, lng: 127.0189 },
  { name: "아산세교점", lat: 36.7838, lng: 127.0004 },
  { name: "천안신불당점", lat: 36.8086, lng: 127.1082 },
  { name: "홍성서우점", lat: 36.6014, lng: 126.6641 }
];

function getTodayKey(){
  const d=new Date();
  return d.toISOString().slice(0,10);
}

function getData(){
  return JSON.parse(localStorage.getItem("t1_data")||'{"total":0,"daily":{},"cta":{}}');
}

function saveData(d){
  localStorage.setItem("t1_data",JSON.stringify(d));
}

function trackView(){
  const d=getData();
  const key=getTodayKey();
  if(!sessionStorage.getItem("view")){
    d.total++;
    d.daily[key]=(d.daily[key]||0)+1;
    saveData(d);
    sessionStorage.setItem("view",1);
  }
  document.getElementById("todayViews").innerText=d.daily[key]||0;
  document.getElementById("totalViews").innerText=d.total||0;
}

function trackCTA(name){
  const d=getData();
  d.cta[name]=(d.cta[name]||0)+1;
  saveData(d);
}

function distance(a,b,c,d){
  const R=6371;
  const dLat=(c-a)*Math.PI/180;
  const dLon=(d-b)*Math.PI/180;
  const x=Math.sin(dLat/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*(2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)));
}

function findNearby(){
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude,longitude}=pos.coords;
    const sorted=stores.map(s=>({...s,dist:distance(latitude,longitude,s.lat,s.lng)}))
    .sort((a,b)=>a.dist-b.dist);
    alert("가장 가까운 매장: "+sorted[0].name);
  });
}

document.getElementById("findNearbyBtn")?.addEventListener("click",()=>{
  trackCTA("nearby");
  findNearby();
});

trackView();
