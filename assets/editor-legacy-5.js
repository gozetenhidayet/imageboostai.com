
function applyPhotoEnhancer(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const d=x.getImageData(0,0,c.width,c.height),px=d.data;
let minR=255,maxR=0,minG=255,maxG=0,minB=255,maxB=0;
for(let i=0;i<px.length;i+=4){
if(px[i]<minR)minR=px[i]; if(px[i]>maxR)maxR=px[i];
if(px[i+1]<minG)minG=px[i+1]; if(px[i+1]>maxG)maxG=px[i+1];
if(px[i+2]<minB)minB=px[i+2]; if(px[i+2]>maxB)maxB=px[i+2];
}
const rr=Math.max(1,maxR-minR),rg=Math.max(1,maxG-minG),rb=Math.max(1,maxB-minB);
for(let i=0;i<px.length;i+=4){
let r=(px[i]-minR)/rr*255,g=(px[i+1]-minG)/rg*255,b=(px[i+2]-minB)/rb*255;
const avg=(r+g+b)/3;
r=avg+(r-avg)*1.12; g=avg+(g-avg)*1.12; b=avg+(b-avg)*1.12;
px[i]=_clampByte(r);px[i+1]=_clampByte(g);px[i+2]=_clampByte(b);
}
x.putImageData(d,0,0);
return c.toDataURL('image/png');
});
}
function applyAIPhotoRestore(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
let d=x.getImageData(0,0,c.width,c.height);
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur(1.6px)';bctx.drawImage(im,0,0);
const blurred=bctx.getImageData(0,0,c.width,c.height).data;
let px=d.data;
for(let i=0;i<px.length;i+=4){
px[i]=px[i]*0.72+blurred[i]*0.28;
px[i+1]=px[i+1]*0.72+blurred[i+1]*0.28;
px[i+2]=px[i+2]*0.72+blurred[i+2]*0.28;
}
let minR=255,maxR=0,minG=255,maxG=0,minB=255,maxB=0;
for(let i=0;i<px.length;i+=4){
if(px[i]<minR)minR=px[i]; if(px[i]>maxR)maxR=px[i];
if(px[i+1]<minG)minG=px[i+1]; if(px[i+1]>maxG)maxG=px[i+1];
if(px[i+2]<minB)minB=px[i+2]; if(px[i+2]>maxB)maxB=px[i+2];
}
const rr=Math.max(1,maxR-minR),rg=Math.max(1,maxG-minG),rb=Math.max(1,maxB-minB);
for(let i=0;i<px.length;i+=4){
let r=(px[i]-minR)/rr*255,g=(px[i+1]-minG)/rg*255,b=(px[i+2]-minB)/rb*255;
b=Math.min(255,b*1.08); r=r*0.97;
px[i]=_clampByte(r);px[i+1]=_clampByte(g);px[i+2]=_clampByte(b);
}
x.putImageData(d,0,0);
const sharpBlurC=_canvas(im.width,im.height),sbctx=sharpBlurC.getContext('2d');
sbctx.filter='blur(1.4px)';sbctx.drawImage(c,0,0);
const sblurred=sbctx.getImageData(0,0,c.width,c.height).data;
const d2=x.getImageData(0,0,c.width,c.height),px2=d2.data;
for(let i=0;i<px2.length;i+=4){
px2[i]=_clampByte(px2[i]+(px2[i]-sblurred[i])*0.35);
px2[i+1]=_clampByte(px2[i+1]+(px2[i+1]-sblurred[i+1])*0.35);
px2[i+2]=_clampByte(px2[i+2]+(px2[i+2]-sblurred[i+2])*0.35);
}
x.putImageData(d2,0,0);
return c.toDataURL('image/png');
});
}
function applyRemoveBlur(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const orig=x.getImageData(0,0,c.width,c.height);
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur(2.2px)';bctx.drawImage(im,0,0);
const blurred=bctx.getImageData(0,0,c.width,c.height).data;
const px=orig.data;
for(let i=0;i<px.length;i+=4){
px[i]=_clampByte(px[i]+(px[i]-blurred[i])*1.35);
px[i+1]=_clampByte(px[i+1]+(px[i+1]-blurred[i+1])*1.35);
px[i+2]=_clampByte(px[i+2]+(px[i+2]-blurred[i+2])*1.35);
}
x.putImageData(orig,0,0);
return c.toDataURL('image/png');
});
}
function applyPortraitEnhancer(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
let d=x.getImageData(0,0,c.width,c.height);
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur(3.2px)';bctx.drawImage(im,0,0);
const blurred=bctx.getImageData(0,0,c.width,c.height).data;
let px=d.data;
for(let i=0;i<px.length;i+=4){
const r=px[i],g=px[i+1],b=px[i+2];
const max=Math.max(r,g,b),min=Math.min(r,g,b);
const isSkin=r>60&&g>30&&b>15&&(max-min)>10&&Math.abs(r-g)>=8&&r>g&&r>=b&&r<250;
if(isSkin){
const a=0.42;
px[i]=r*(1-a)+blurred[i]*a;
px[i+1]=g*(1-a)+blurred[i+1]*a;
px[i+2]=b*(1-a)+blurred[i+2]*a;
}
}
x.putImageData(d,0,0);
let d2=x.getImageData(0,0,c.width,c.height),px2=d2.data;
for(let i=0;i<px2.length;i+=4){
let r=px2[i]*1.04,g=px2[i+1]*1.03,b=px2[i+2]*1.02;
const lum=(r+g+b)/3/255;
const w=Math.max(0,1-lum*1.4);
r+=10*w;g+=10*w;b+=10*w;
px2[i]=_clampByte(r);px2[i+1]=_clampByte(g);px2[i+2]=_clampByte(b);
}
x.putImageData(d2,0,0);
return c.toDataURL('image/png');
});
}
function showWatermarkRemoverPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🧼 Watermark Remover';
if(!imageData){if(rx)rx.textContent='Upload a photo first, then paint over the watermark.';return;}
if(!rx)return;
window.__maskPainter=null;window.__lassoSelector=null;
rx.innerHTML='';
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
hint.textContent='Paint over your own watermark/logo area to blend it out (brush-select, same real removal engine as Object Remover):';
rx.appendChild(hint);
const painter=_mkMaskPainter({maxW:340});
window.__maskPainter=painter;
rx.appendChild(painter.element);
rx.appendChild(_mkBrushControls(painter,'wmr'));
const btn=document.createElement('button');btn.textContent='🧼 Remove';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:6px;';
btn.onclick=applyWatermarkRemover;
rx.appendChild(btn);
}
function applyWatermarkRemover(){ return applyObjectRemover(); }
function showAIBGGeneratorPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🪄 AI Background Generator';
if(!rx)return;
rx.innerHTML='';
const note=document.createElement('p');note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:10px;';
note.textContent='Real subject cutout (same AI model as Remove Background) composited over a studio backdrop. Curated backdrops, not text-to-image generation.';
rx.appendChild(note);
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;';
const styles={
'Studio Cyan':['#22d3ee','#5b4ce8','#111827'],
'Sunset':['#f093fb','#f5576c','#3b0764'],
'Forest':['#134e5e','#71b280','#0f172a'],
'Gold Hour':['#f6d365','#fda085','#7c2d12'],
'Cool Slate':['#4facfe','#00f2fe','#0f172a'],
'Rose Studio':['#ff9a9e','#fecfef','#4c0519'],
};
Object.keys(styles).forEach(function(name){
const stops=styles[name];
const btn=document.createElement('button');btn.textContent=name;
btn.style.cssText='height:46px;border-radius:8px;border:2px solid var(--border);cursor:pointer;font-size:11px;font-weight:700;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5);font-family:inherit;background:linear-gradient(135deg,'+stops[0]+','+stops[1]+' 55%,'+stops[2]+');';
btn.onclick=function(){applyAIBGGenerator(stops);};
grid.appendChild(btn);
});
rx.appendChild(grid);
}
function applyAIBGGenerator(stops){
stops=stops||['#22d3ee','#5b4ce8','#111827'];
return _applyCanvas(async im=>{
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
const g=x.createRadialGradient(c.width*.75,c.height*.2,20,c.width*.5,c.height*.5,Math.max(c.width,c.height)*.9);
g.addColorStop(0,stops[0]);g.addColorStop(.55,stops[1]);g.addColorStop(1,stops[2]);
x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
x.drawImage(cut,0,0,c.width,c.height);
return c.toDataURL('image/png');
});
}
function applyAIHeadshot(){
return _applyCanvas(async im=>{
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
const g=x.createLinearGradient(0,0,0,c.height);
g.addColorStop(0,'#eef2ff');g.addColorStop(1,'#c7d2fe');
x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
x.drawImage(cut,0,0,c.width,c.height);
let d=x.getImageData(0,0,c.width,c.height),px=d.data;
for(let i=0;i<px.length;i+=4){
px[i]=_clampByte(px[i]*1.05);
px[i+1]=_clampByte(px[i+1]*1.03);
px[i+2]=_clampByte(px[i+2]*1.02);
}
x.putImageData(d,0,0);
return c.toDataURL('image/png');
});
}
function showObjectAddPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='➕ Object Add';
if(!imageData){if(rx)rx.textContent='Upload a photo first, then place a sticker.';return;}
if(!rx)return;
rx.innerHTML='';
const note=document.createElement('p');note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
note.textContent='Pick a graphic and position it (sticker overlay, not AI-generated objects):';
rx.appendChild(note);
const stickers=['✨','🌟','❤️','🔥','🎉','😎','👑','🌈','⭐','🦋'];
const stickerRow=document.createElement('div');stickerRow.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;';
let chosen=stickers[0];
stickers.forEach(function(s,idx){
const b=document.createElement('button');b.textContent=s;b.type='button';
b.style.cssText='width:38px;height:38px;font-size:18px;border-radius:8px;border:2px solid '+(idx===0?'var(--accent)':'var(--border)')+';background:var(--bg3);cursor:pointer;';
b.onclick=function(){chosen=s;[...stickerRow.children].forEach(c2=>c2.style.borderColor='var(--border)');b.style.borderColor='var(--accent)';document.getElementById('oa-sticker').value=s;};
stickerRow.appendChild(b);
});
rx.appendChild(stickerRow);
const hidden=document.createElement('input');hidden.type='hidden';hidden.id='oa-sticker';hidden.value=chosen;rx.appendChild(hidden);
function mkSlider(id,label,def){
const d=document.createElement('div');d.style.cssText='margin-bottom:10px;';
const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';
l.innerHTML=label+': <span id="'+id+'v">'+def+'</span>%';
const sl=document.createElement('input');sl.type='range';sl.id=id;sl.min=0;sl.max=100;sl.value=def;
sl.style.cssText='width:100%;accent-color:var(--accent);';
sl.oninput=function(){document.getElementById(id+'v').textContent=this.value;};
d.appendChild(l);d.appendChild(sl);return d;
}
rx.appendChild(mkSlider('oa-x','Horizontal position',72));
rx.appendChild(mkSlider('oa-y','Vertical position',28));
rx.appendChild(mkSlider('oa-size','Size',8));
const btn=document.createElement('button');btn.textContent='➕ Place Sticker';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:4px;';
btn.onclick=applyObjectAdd;
rx.appendChild(btn);
}
function applyObjectAdd(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const sticker=document.getElementById('oa-sticker')?.value||'✨';
const px=(Number(document.getElementById('oa-x')?.value ?? 72))/100;
const py=(Number(document.getElementById('oa-y')?.value ?? 28))/100;
const sizePct=(Number(document.getElementById('oa-size')?.value ?? 8))/100;
const size=Math.max(24,c.width*sizePct);
x.font=size+'px Arial';
x.textAlign='center';x.textBaseline='middle';
x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=size*0.15;
x.fillText(sticker,c.width*px,c.height*py);
return c.toDataURL('image/png');
});
}
window.__ibaExtraPanels = {
'Object Add':showObjectAddPanel,
'Watermark Remover':showWatermarkRemoverPanel,
'AI Background Generator':showAIBGGeneratorPanel,
};
if(typeof _panelToolsMap!=='undefined'){ Object.assign(_panelToolsMap, window.__ibaExtraPanels); }
(function(){
const _origOpenTool=window.openTool;
window.openTool=function(name){
_origOpenTool(name);
const extraPanels=window.__ibaExtraPanels;
if(extraPanels[name]){
const rx=document.getElementById('resultText');
if(rx)rx.innerHTML='';
extraPanels[name]();
}
};
})();
