/* Raw WebGL, no libraries.
   Layer 1: aurora shader (domain-warped noise) that follows the cursor.
   Layer 2: particle system that morphs between shapes as you scroll:
   sphere -> DNA helix -> torus knot -> galaxy -> wheat field -> sphere. Click to send a shockwave. */
(function () {
  var cv = document.getElementById('gl');
  if (!cv) return;
  var gl = cv.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = innerWidth < 700;
  var N = small ? 9000 : 26000;

  function shader(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  }
  function program(vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.warn(gl.getProgramInfoLog(p));
    return p;
  }

  /* ---------- aurora ---------- */
  var auroraP = program(
    'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',
    'precision highp float;uniform vec2 uRes,uM;uniform float uT,uS;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}' +
    'void main(){' +
    ' vec2 uv=gl_FragCoord.xy/uRes;vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;float t=uT*.06;' +
    ' vec2 q=vec2(fbm(p*1.6+t),fbm(p*1.6+vec2(5.2,1.3)-t));' +
    ' vec2 r=vec2(fbm(p*1.8+3.*q+vec2(1.7,9.2)+t*1.3),fbm(p*1.8+3.*q+vec2(8.3,2.8)-t));' +
    ' float f=fbm(p*1.5+3.5*r+uS*1.2);' +
    ' vec3 c1=vec3(.027,.075,.10),c2=vec3(.05,.35,.34),c3=vec3(.38,.2,.7),c4=vec3(.9,.45,.35);' +
    ' vec3 col=mix(c1,c2,smoothstep(.2,.8,f)*.7);' +
    ' col=mix(col,c3,smoothstep(.35,.9,length(q))*.35);' +
    ' col+=c4*pow(smoothstep(.55,1.,r.x),3.)*.18;' +
    ' vec2 m=(uM*uRes-.5*uRes)/uRes.y;col+=vec3(.2,.5,.55)*.2/(1.+14.*dot(p-m,p-m));' +
    ' col*=1.-1.1*dot(uv-.5,uv-.5);' +
    ' col+=(h(gl_FragCoord.xy+uT)-.5)*.02;' +
    ' gl_FragColor=vec4(col*.8,1.);}'
  );

  /* ---------- particles ---------- */
  var partP = program(
    'attribute vec3 aA,aB;attribute vec4 aR;' +
    'uniform float uMix,uT,uPx,uAsp,uPitch,uYaw,uPulseT,uDim;uniform vec2 uM,uOff,uClick;uniform float uScale;' +
    'varying vec3 vC;varying float vA;' +
    'vec3 pal(float k){k=fract(k)*5.;vec3 a=vec3(.94,.78,.4),b=vec3(.37,.84,.78),c=vec3(1.,.48,.42),d=vec3(.65,.55,1.),e=vec3(.36,.72,1.);' +
    ' if(k<1.)return mix(a,b,k);if(k<2.)return mix(b,c,k-1.);if(k<3.)return mix(c,d,k-2.);if(k<4.)return mix(d,e,k-3.);return mix(e,a,k-4.);}' +
    'void main(){' +
    ' float f=clamp(uMix*1.8-aR.x*.8,0.,1.);f=f*f*(3.-2.*f);' +
    ' vec3 p=mix(aA,aB,f);float sw=sin(3.14159*f);' +
    ' p+=sw*1.3*vec3(sin(aR.y*6.283+uT),cos(aR.z*6.283+uT*.8),sin(aR.w*6.283-uT*.6));' +
    ' p+=.03*vec3(sin(uT+aR.y*30.),cos(uT*.9+aR.z*30.),sin(uT*1.1+aR.w*30.));' +
    ' p*=uScale;' +
    ' float cy=cos(uYaw),sy=sin(uYaw),cx=cos(uPitch),sx=sin(uPitch);' +
    ' p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);' +
    ' p=vec3(p.x,cx*p.y-sx*p.z,sx*p.y+cx*p.z);' +
    ' p.z+=4.4;' +
    ' vec2 ndc=vec2(p.x*1.9/p.z/uAsp,p.y*1.9/p.z)+uOff;' +
    ' vec2 d=ndc-uM;d.x*=uAsp;float dist=length(d);vec2 dir=d/(dist+.0001);' +
    ' float near=exp(-dist*dist*14.);' +
    ' ndc+=dir*vec2(1./uAsp,1.)*near*.14;' +
    ' vec2 c=ndc-uClick;c.x*=uAsp;float cd=length(c);float age=uT-uPulseT;' +
    ' float ring=exp(-pow((cd-age*1.5)*7.,2.))*exp(-age*1.6)*step(0.,age);' +
    ' ndc+=normalize(c+.0001)*vec2(1./uAsp,1.)*ring*.22;' +
    ' gl_Position=vec4(ndc,0.,1.);' +
    ' gl_PointSize=uPx*(1.3+2.6*aR.y)*(4.2/p.z)*(1.+near*1.6+ring*2.5+sw*.5);' +
    ' vC=pal(aR.z+uT*.025+p.y*.08);' +
    ' vA=(.28+.72*aR.w)*(1.+near*1.4+ring*2.+sw*.6)*uDim;}',
    'precision mediump float;varying vec3 vC;varying float vA;' +
    'void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);a*=a;gl_FragColor=vec4(vC*vA,a*.85);}'
  );

  /* ---------- shapes ---------- */
  var rnd = Math.random, PI = Math.PI;
  function build(fn) {
    var a = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) { var v = fn(i, i / N); a[i * 3] = v[0]; a[i * 3 + 1] = v[1]; a[i * 3 + 2] = v[2]; }
    return a;
  }
  function jit(s) { return (rnd() - .5) * s; }
  var shapes = [
    /* 0 sphere */
    build(function (i, k) {
      var y = 1 - 2 * k, r = Math.sqrt(1 - y * y), th = PI * (1 + Math.sqrt(5)) * i, R = 1.45 + jit(.06);
      return [Math.cos(th) * r * R, y * R, Math.sin(th) * r * R];
    }),
    /* 1 DNA double helix with rungs */
    build(function (i, k) {
      var t = rnd() * 2 - 1, y = t * 2.2, ang = t * 6 * PI, R = .8;
      if (rnd() < .72) { var s = rnd() < .5 ? 0 : PI; return [Math.cos(ang + s) * R + jit(.1), y, Math.sin(ang + s) * R + jit(.1)]; }
      var m = rnd() * 2 - 1; return [Math.cos(ang) * R * m + jit(.04), y, Math.sin(ang) * R * m + jit(.04)];
    }),
    /* 2 torus knot */
    build(function (i, k) {
      var u = k * 2 * PI * 4 % (2 * PI), rr = (2 + Math.cos(3 * u)) * .62, ph = rnd() * 2 * PI, tr = .16 * Math.sqrt(rnd());
      return [rr * Math.cos(2 * u) + Math.cos(ph) * tr, rr * Math.sin(2 * u) + Math.sin(ph) * tr, Math.sin(3 * u) * .62 + jit(.1)];
    }),
    /* 3 galaxy */
    build(function (i, k) {
      var r = Math.pow(rnd(), .6) * 2.3, arm = (i % 3) * 2 * PI / 3, a = arm + r * 1.7 + jit(.5 / (r + .4));
      return [Math.cos(a) * r, jit(.35) * Math.exp(-r * .6), Math.sin(a) * r];
    }),
    /* 4 wheat field waves */
    build(function () {
      var x = (rnd() - .5) * 5, z = (rnd() - .5) * 5;
      return [x, Math.sin(x * 2.2) * Math.cos(z * 1.7) * .38 - .35, z];
    })
  ];
  var pitchBase = [.22, .12, .1, .75, .62];
  var offsetOn = [1, 1, 1, 0, 0];

  function buf(data) {
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b;
  }
  var sb = shapes.map(buf);
  var rr = new Float32Array(N * 4); for (var q = 0; q < rr.length; q++) rr[q] = rnd();
  var rb = buf(rr);
  var tri = buf(new Float32Array([-1, -1, 3, -1, -1, 3]));

  /* ---------- state ---------- */
  var mouse = { x: .7, y: .5, tx: .7, ty: .5 };
  var click = { x: 9, y: 9, t: -100 };
  var scrollU = 0, curU = 0, yawExtra = 0;
  var anchors = [];
  var ids = ['top', 'about', 'work', 'skills', 'certs', 'contact'];
  var seq = [0, 1, 2, 3, 4, 0];
  function measure() {
    anchors = ids.map(function (id) {
      var el = id === 'top' ? null : document.getElementById(id);
      return el ? el.getBoundingClientRect().top + scrollY : 0;
    });
  }
  function target() {
    var y = scrollY + innerHeight * .35, i = 0;
    for (var k = 0; k < anchors.length; k++) if (y >= anchors[k]) i = k;
    if (i >= anchors.length - 1) return seq.length - 1 + 0;
    var span = anchors[i + 1] - anchors[i], fr = span > 0 ? (y - anchors[i]) / span : 0;
    return i + Math.min(1, Math.max(0, (fr - .3) / .55));
  }
  addEventListener('pointermove', function (e) { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; }, { passive: true });
  addEventListener('pointerdown', function (e) {
    click.x = (e.clientX / innerWidth) * 2 - 1; click.y = 1 - (e.clientY / innerHeight) * 2; click.t = now();
  }, { passive: true });
  var dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75);
  function resize() {
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    measure();
  }
  addEventListener('resize', resize); resize();
  addEventListener('load', function () { setTimeout(measure, 300); });
  setInterval(measure, 2500);
  var t0 = performance.now();
  function now() { return (performance.now() - t0) / 1000; }

  function bindAttr(p, name, buffer, size) {
    var loc = gl.getAttribLocation(p, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return loc;
  }
  function U(p, n) { return gl.getUniformLocation(p, n); }
  var au = { res: U(auroraP, 'uRes'), m: U(auroraP, 'uM'), t: U(auroraP, 'uT'), s: U(auroraP, 'uS') };
  var pu = {}; ['uDim', 'uMix', 'uT', 'uPx', 'uAsp', 'uPitch', 'uYaw', 'uPulseT', 'uM', 'uOff', 'uClick', 'uScale'].forEach(function (n) { pu[n] = U(partP, n); });

  function draw() {
    var t = RM ? 3 : now();
    mouse.x += (mouse.tx - mouse.x) * .07; mouse.y += (mouse.ty - mouse.y) * .07;
    scrollU = target(); curU += (scrollU - curU) * (RM ? 1 : .07);
    var i = Math.min(Math.floor(curU), seq.length - 2), f = Math.min(1, Math.max(0, curU - i));
    var from = seq[i], to = seq[i + 1];
    var pitch = (pitchBase[from] + (pitchBase[to] - pitchBase[from]) * f) + (mouse.y - .5) * .35;
    var off = (offsetOn[from] + (offsetOn[to] - offsetOn[from]) * f);
    var asp = cv.width / cv.height;
    var offX = (asp > 1.1 ? .5 : 0) * off, offY = asp > 1.1 ? 0 : .35 * off;
    var yaw = t * .09 + (mouse.x - .5) * .9 + scrollY * .0011;

    gl.viewport(0, 0, cv.width, cv.height);
    gl.disable(gl.BLEND);
    gl.useProgram(auroraP);
    var l = bindAttr(auroraP, 'p', tri, 2);
    gl.uniform2f(au.res, cv.width, cv.height); gl.uniform2f(au.m, mouse.x, mouse.y);
    gl.uniform1f(au.t, t); gl.uniform1f(au.s, curU * .35);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(l);

    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(partP);
    var la = bindAttr(partP, 'aA', sb[from], 3), lb = bindAttr(partP, 'aB', sb[to], 3), lr = bindAttr(partP, 'aR', rb, 4);
    gl.uniform1f(pu.uMix, f); gl.uniform1f(pu.uT, t); gl.uniform1f(pu.uPx, dpr); gl.uniform1f(pu.uAsp, asp);
    gl.uniform1f(pu.uPitch, pitch); gl.uniform1f(pu.uYaw, yaw); gl.uniform1f(pu.uPulseT, click.t);
    gl.uniform2f(pu.uM, mouse.x * 2 - 1, mouse.y * 2 - 1);
    gl.uniform2f(pu.uOff, offX, offY); gl.uniform2f(pu.uClick, click.x, click.y);
    gl.uniform1f(pu.uScale, small ? .8 : 1);
    gl.uniform1f(pu.uDim, 1 - .45 * Math.min(1, scrollY / (innerHeight * .7)));
    gl.drawArrays(gl.POINTS, 0, N);
    gl.disableVertexAttribArray(la); gl.disableVertexAttribArray(lb); gl.disableVertexAttribArray(lr);
  }
  window.__glDraw = draw;
  document.documentElement.classList.add('gl-on');
  if (RM) { draw(); addEventListener('scroll', draw, { passive: true }); addEventListener('resize', draw); }
  else (function loop() { draw(); requestAnimationFrame(loop); })();
})();
