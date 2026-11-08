const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const C=[
['Google PromptWars Virtual','Certificate of Appreciation · Google for Developers','tech',['p01']],
['Deloitte Data Analytics Job Simulation','Forage · Jul 2026','tech',['p26']],
['GenAI Powered Data Analytics Job Simulation','Forage · Apr 2026','tech',['p24']],
['Introduction to Subagents','Anthropic','tech',['p10']],
['Google AI Educator: Intro to Gemini','Google','tech',['gemini'],1],
['Google AI Educator: Intro to Vibe Coding','Google','tech',['vibe'],1],
['Google AI Educator: K-12 Pedagogical Design (2.1)','Google','tech',['k12'],1],
['AI Tools and ChatGPT Workshop','be10x · 14 Jun 2026','tech',['p06']],
['Deloitte Cyber Job Simulation','Forage · Jun 2026','sec',['p18']],
['Cybersecurity Analyst Job Simulation: IAM','Forage · Jul 2026','sec',['p25']],
['IoT-Network Specialist Certificate, 60 hrs','Reliance Foundation Skilling Academy · Apr 2026','sec',['p14']],
['Kisan Drone Operator, NSQF Level 4','Agriculture Skill Council of India · Apr 2026','agri',['p15']],
['Certificate Course in Genetics','Reliance Foundation Skilling Academy · 2026','agri',['p20','p17']],
['Campus Ambassador','Cloud Junction','event',['amb'],1],
['Official PW Channel Partner','Physics Wallah, PW Ambassador Program · 12 Jul 2026','event',['p05']],
['Open Source Hackathon','Enginow · Participation','event',['oss']],
['Buildathon 2026','TechVerse Solutions · Participation','event',['p02']],
['Gemini QuizOff 2026','CampusCrew · Participation','event',['p03']],
['100K Milestone Honor','CampusCrew · 26 Jun 2026','event',['p13']],
['AI Quest','DeVriksh · Participation','event',['p08']],
['Enigma, COMPOSIT 31','IIT Kharagpur · Participation','event',['p07']],
['Excavate, COMPOSIT 31','IIT Kharagpur · Participation','event',['p22']],
['MUSE, Session Zero 2026','GDG on Campus, Heritage Institute · 29 May 2026','event',['p19']],
['Doubleslash 4.0','Jadavpur University · Participation','event',['dbl']]
];
const PR={
 "p01": "assets/proofs/p01.jpg",
 "p02": "assets/proofs/p02.jpg",
 "p03": "assets/proofs/p03.jpg",
 "p04": "assets/proofs/p04.jpg",
 "p05": "assets/proofs/p05.jpg",
 "p06": "assets/proofs/p06.jpg",
 "p07": "assets/proofs/p07.jpg",
 "p08": "assets/proofs/p08.jpg",
 "p09": "assets/proofs/p09.jpg",
 "p10": "assets/proofs/p10.jpg",
 "p11": "assets/proofs/p11.jpg",
 "p12": "assets/proofs/p12.jpg",
 "p13": "assets/proofs/p13.jpg",
 "p14": "assets/proofs/p14.jpg",
 "p15": "assets/proofs/p15.jpg",
 "p16": "assets/proofs/p16.jpg",
 "p17": "assets/proofs/p17.jpg",
 "p18": "assets/proofs/p18.jpg",
 "p19": "assets/proofs/p19.jpg",
 "p20": "assets/proofs/p20.jpg",
 "p21": "assets/proofs/p21.jpg",
 "p22": "assets/proofs/p22.jpg",
 "p23": "assets/proofs/p23.jpg",
 "p24": "assets/proofs/p24.jpg",
 "p25": "assets/proofs/p25.jpg",
 "p26": "assets/proofs/p26.jpg",
 "oss": "assets/proofs/oss.jpg",
 "dbl": "assets/proofs/dbl.jpg",
 "amb": "assets/proofs/amb.jpg",
 "k12": "assets/proofs/k12.jpg",
 "gemini": "assets/proofs/gemini.jpg",
 "vibe": "assets/proofs/vibe.jpg"
};
const grid=document.getElementById('certGrid');
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
let cur=[],ci=0,pi=0,flt='all';
function render(f){flt=f;cur=C.filter(c=>f==='all'||c[2]===f);grid.innerHTML=cur.map((c,i)=>`<button class="cert tilt3" data-i="${i}" aria-label="View proof: ${esc(c[0])}"><div class="th"><img class="${c[4]?'contain':''}" alt="" loading="lazy" src="${PR[c[3][0]]}"></div><span class="zoom">VIEW PROOF</span><div class="tx"><h4>${esc(c[0])}</h4><p>${esc(c[1])}</p></div></button>`).join('');bindTilt();grid.querySelectorAll('.cert').forEach(b=>b.onclick=()=>openLb(+b.dataset.i,0))}
const lb=document.getElementById('lb');
function showLb(){const c=cur[ci];document.getElementById('lbImg').src=PR[c[3][pi]];document.getElementById('lbImg').alt=c[0]+' certificate';document.getElementById('lbCap').innerHTML=esc(c[0])+'<small>'+esc(c[1])+(c[3].length>1?' · file '+(pi+1)+' of '+c[3].length:'')+' · '+(ci+1)+'/'+cur.length+'</small>'}
function openLb(i,p){ci=i;pi=p;showLb();lb.classList.add('on');document.getElementById('lbX').focus()}
function step(d){const c=cur[ci];if(d>0&&pi<c[3].length-1)pi++;else if(d<0&&pi>0)pi--;else{ci=(ci+d+cur.length)%cur.length;pi=0}showLb()}
document.getElementById('lbNext').onclick=()=>step(1);document.getElementById('lbPrev').onclick=()=>step(-1);
function closeLb(){lb.classList.remove('on');cur=C.filter(c=>flt==='all'||c[2]===flt)}
document.getElementById('lbX').onclick=closeLb;
lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
document.querySelectorAll('.filters button').forEach(b=>{const f=b.dataset.f,n=f==='all'?C.length:C.filter(c=>c[2]===f).length;b.innerHTML=b.textContent+' <span class="n">'+n+'</span>';b.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));render(f);document.getElementById('certStatus').textContent='Showing '+cur.length+' of '+C.length+' certificates';grid.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'})})});
/* ---- tilt ---- */
function tilt(el,max){el.addEventListener('pointermove',e=>{if(RM)return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateY(${x*max}deg) rotateX(${-y*max}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')}
function bindTilt(){document.querySelectorAll('.tilt3:not([data-b])').forEach(e=>{e.dataset.b=1;tilt(e,10)})}
document.querySelectorAll('.tilt').forEach(e=>tilt(e,12));
tilt(document.querySelector('.disc'),30);
render('all');
document.querySelectorAll('.copy').forEach(b=>b.onclick=async()=>{const m=document.getElementById('copied');try{await navigator.clipboard.writeText(b.dataset.c);m.textContent='Copied '+b.dataset.c}catch(e){m.textContent='Select and copy: '+b.dataset.c}});


/* ---- hobbies ---- */
document.querySelectorAll('.flip').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('on')));



/* ---- hero orbit, chips, buttons, sparks ---- */
(function(){
 const cols=['#efc765','#5fd6c6','#ff7a6b','#a58bff','#5db8ff','#ff74b8'];
 const pick=['Deloitte Cyber Job Simulation','GenAI Powered Data Analytics Job Simulation','Introduction to Subagents','Google PromptWars Virtual','Kisan Drone Operator, NSQF Level 4','IoT-Network Specialist Certificate, 60 hrs','Cybersecurity Analyst Job Simulation: IAM','Deloitte Data Analytics Job Simulation','Open Source Hackathon','Official PW Channel Partner','AI Tools and ChatGPT Workshop','Certificate Course in Genetics'];
 const ring=document.getElementById('ring');
 pick.forEach((t,i)=>{const gi=C.findIndex(c=>c[0]===t);if(gi<0)return;const b=document.createElement('button');b.className='orb';b.style.setProperty('--i',i);b.style.setProperty('--c',cols[i%6]);b.setAttribute('aria-label','View proof: '+t);b.innerHTML='<img alt="" src="'+PR[C[gi][3][0]]+'"><em>'+esc(t)+'</em>';b.onclick=()=>{cur=C;openLb(gi,0)};ring.appendChild(b)});
 document.getElementById('allProofs').onclick=()=>{cur=C;openLb(0,0)};
 const chips=document.getElementById('chips');
 ['Python','TypeScript','React','Electron','Claude agents','Cyber security','Drones','Guitar'].forEach((t,i)=>{const s=document.createElement('span');s.className='chip';s.style.setProperty('--c',cols[i%6]);s.textContent=t;chips.appendChild(s)});
 // ripple + magnetic
 document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.copy,.filters button');if(!b)return;const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height),s=document.createElement('span');s.className='rip';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});
 if(!RM)document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3-3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
 // cursor sparks
 if(RM)return;
 const cv=document.getElementById('sparks'),x=cv.getContext('2d');let P=[];
 function sz(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',sz);sz();
 addEventListener('pointermove',e=>{for(let k=0;k<2;k++)P.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*2.4,vy:(Math.random()-.5)*2.4-.6,l:1,c:cols[Math.random()*6|0],r:2+Math.random()*3})});
 (function loop(){x.clearRect(0,0,cv.width,cv.height);P=P.filter(p=>p.l>0);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l-=.025;x.globalAlpha=p.l;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r*p.l,0,7);x.fill()});requestAnimationFrame(loop)})();
})();

/* ---- WebGL field: wheat-field terrain + drifting data nodes ---- */
(function(){
 if(!window.THREE)return;
 const cv=document.getElementById('gl');
 const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
 R.setPixelRatio(Math.min(devicePixelRatio,2));
 const S=new THREE.Scene();S.fog=new THREE.Fog(0x07131a,8,34);
 const cam=new THREE.PerspectiveCamera(55,1,.1,80);cam.position.set(0,4.2,10);
 const geo=new THREE.PlaneGeometry(60,40,70,46);geo.rotateX(-Math.PI/2);
 const mat=new THREE.MeshBasicMaterial({color:0x5fd6c6,wireframe:true,transparent:true,opacity:.22});
 const land=new THREE.Mesh(geo,mat);land.position.y=-2;S.add(land);
 const pos=geo.attributes.position,base=pos.array.slice();
 // wheat points
 const N=900,pg=new THREE.BufferGeometry(),pp=new Float32Array(N*3);
 for(let i=0;i<N;i++){pp[i*3]=(Math.random()-.5)*50;pp[i*3+1]=Math.random()*12-1;pp[i*3+2]=(Math.random()-.5)*30}
 pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
 const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xefc765,size:.06,transparent:true,opacity:.8}));S.add(pts);
 const cn=700,cg=new THREE.BufferGeometry(),cp=new Float32Array(cn*3),cc=new Float32Array(cn*3),pal=[[.94,.78,.4],[.37,.84,.78],[1,.48,.42],[.65,.55,1],[.36,.72,1],[1,.45,.72]];
 for(let i=0;i<cn;i++){cp[i*3]=(Math.random()-.5)*40;cp[i*3+1]=Math.random()*14-2;cp[i*3+2]=(Math.random()-.5)*24;const c=pal[i%6];cc.set(c,i*3)}
 cg.setAttribute('position',new THREE.BufferAttribute(cp,3));cg.setAttribute('color',new THREE.BufferAttribute(cc,3));
 const cpts=new THREE.Points(cg,new THREE.PointsMaterial({size:.1,vertexColors:true,transparent:true,opacity:.9}));S.add(cpts);
 // hero knot
 const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.5,.38,160,18),new THREE.MeshBasicMaterial({color:0xefc765,wireframe:true,transparent:true,opacity:.35}));
 knot.position.set(4.5,2.2,-2);S.add(knot);
 const ico=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,1),new THREE.MeshBasicMaterial({color:0x5fd6c6,wireframe:true}));
 ico.position.set(-5,3,-4);S.add(ico);
 const shapes=[];[[0xff7a6b,'oct',-7,-.5,-6],[0xa58bff,'tor',7,-.8,-5],[0x5db8ff,'tet',-3,5,-8],[0xff74b8,'oct',2,6.2,-9],[0xefc765,'tor',-9,3,-9],[0x5fd6c6,'tet',9,5,-7]].forEach(a=>{const g=a[1]=='oct'?new THREE.OctahedronGeometry(.8):a[1]=='tor'?new THREE.TorusGeometry(.7,.22,10,28):new THREE.TetrahedronGeometry(.9);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:a[0],wireframe:true,transparent:true,opacity:.75}));m.position.set(a[2],a[3],a[4]);S.add(m);shapes.push(m)});
 let mx=0,my=0,sy=0;
 addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 addEventListener('scroll',()=>sy=scrollY/Math.max(1,document.body.scrollHeight-innerHeight),{passive:true});
 function size(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();knot.visible=ico.visible=innerWidth>700;shapes.forEach(m=>m.visible=innerWidth>700)}
 addEventListener('resize',size);size();
 const t0=performance.now();
 function frame(){
  const t=(performance.now()-t0)/1000*(RM?0:1);
  for(let i=0;i<pos.count;i++){const x=base[i*3],z=base[i*3+2];pos.array[i*3+1]=Math.sin(x*.35+t*.8)*.5+Math.cos(z*.4+t*.6)*.5+Math.sin((x+z)*.15)*.8}
  pos.needsUpdate=true;
  pts.rotation.y=t*.02;cpts.rotation.y=-t*.03+mx*.6;cpts.rotation.x=my*.3;pts.position.y=Math.sin(t*.3)*.2;
  knot.rotation.x=t*.25+sy*6;knot.rotation.y=t*.2;shapes.forEach((m,i)=>{m.rotation.x=t*(.3+i*.05);m.rotation.y=t*(.4-i*.03);m.position.y+=Math.sin(t+i)*.004});ico.rotation.y=t*.3;ico.rotation.x=t*.2+sy*4;
  cam.position.x+=((mx*3)-cam.position.x)*.04;cam.position.y+=((4.2-my*1.5-sy*2.5)-cam.position.y)*.04;
  cam.lookAt(0,1.2-sy*1.5,0);
  R.render(S,cam);
  if(!RM)requestAnimationFrame(frame)
 }
 frame();
})();

/* ---- skill sphere ---- */
(function(){
 const cv=document.getElementById('sphere'),x=cv.getContext('2d');
 const W=['Python','TypeScript','React','Node.js','Electron','C++','C','Git','GitHub','Claude','Gemini','GenAI','Prompting','Agents','Data Analysis','IAM','Cyber Security','IoT','Drones','Genetics','AgriTech','Open Source','CSS','HTML','JavaScript','npm','Full Stack'];
 const P=W.map((w,i)=>{const k=(i+.5)/W.length,ph=Math.acos(1-2*k),th=Math.PI*(1+Math.sqrt(5))*i;return{w,x:Math.cos(th)*Math.sin(ph),y:Math.cos(ph),z:Math.sin(th)*Math.sin(ph)}});
 let ax=.003,ay=.004,drag=false,lx=0,ly=0,s=0;
 function size(){const r=cv.getBoundingClientRect();cv.width=r.width*2;cv.height=r.height*2;s=cv.width/2}
 addEventListener('resize',size);size();
 cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
 cv.addEventListener('pointerup',()=>drag=false);
 cv.addEventListener('pointermove',e=>{if(!drag)return;ay=(e.clientX-lx)*.0008;ax=-(e.clientY-ly)*.0008;lx=e.clientX;ly=e.clientY});
 function draw(){
  const cx=Math.cos(ax),sx=Math.sin(ax),cy=Math.cos(ay),sy=Math.sin(ay);
  for(const p of P){let y=p.y*cx-p.z*sx,z=p.y*sx+p.z*cx;let X=p.x*cy+z*sy;z=-p.x*sy+z*cy;p.x=X;p.y=y;p.z=z}
  x.clearRect(0,0,cv.width,cv.height);
  [...P].sort((a,b)=>a.z-b.z).forEach(p=>{const d=(p.z+1)/2,f=(.8+.5*d)*s*.07;x.globalAlpha=.25+.75*d;x.font=`500 ${f}px "JetBrains Mono",monospace`;x.textAlign='center';x.fillStyle=d>.6?'#efc765':'#5fd6c6';x.fillText(p.w,s+p.x*s*.78,s+p.y*s*.78)});
  if(!drag){ax*=.98;ay=ay*.98+(RM?0:.0006)*.02}
  if(!RM)requestAnimationFrame(draw)
 }
 if(RM){ax=ay=0;draw()}else draw();
})();
