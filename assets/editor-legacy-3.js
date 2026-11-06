
function _clampByte(v){return v<0?0:v>255?255:v;}
function showImageSharpenerPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🔬 Image Sharpener';
if(!rx)return;
rx.innerHTML='';
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);';
lbl.innerHTML='Sharpness: <span id="sharp-val">50</span>%';
const sl=document.createElement('input');sl.type='range';sl.id='sharp-amt';sl.min=0;sl.max=100;sl.value=50;
sl.style.cssText='width:100%;accent-color:var(--accent);margin:8px 0 12px;';
sl.oninput=function(){document.getElementById('sharp-val').textContent=this.value;};
const btn=document.createElement('button');btn.textContent='🔬 Sharpen';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyImageSharpener;
rx.appendChild(lbl);rx.appendChild(sl);rx.appendChild(btn);
}
function applyImageSharpener(){
return _applyCanvas(async im=>{
const amount=(Number(document.getElementById('sharp-amt')?.value ?? 50))/100;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const orig=x.getImageData(0,0,c.width,c.height);
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur(2px)';bctx.drawImage(im,0,0);
const blurred=bctx.getImageData(0,0,c.width,c.height).data;
const px=orig.data;const k=amount*1.6;
for(let i=0;i<px.length;i+=4){
px[i]=_clampByte(px[i]+(px[i]-blurred[i])*k);
px[i+1]=_clampByte(px[i+1]+(px[i+1]-blurred[i+1])*k);
px[i+2]=_clampByte(px[i+2]+(px[i+2]-blurred[i+2])*k);
}
x.putImageData(orig,0,0);
return c.toDataURL('image/png');
});
}
function showNoiseRemoverPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🧹 Noise Remover';
if(!rx)return;
rx.innerHTML='';
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);';
lbl.innerHTML='Strength: <span id="nr-val">50</span>%';
const sl=document.createElement('input');sl.type='range';sl.id='nr-amt';sl.min=0;sl.max=100;sl.value=50;
sl.style.cssText='width:100%;accent-color:var(--accent);margin:8px 0 12px;';
sl.oninput=function(){document.getElementById('nr-val').textContent=this.value;};
const btn=document.createElement('button');btn.textContent='🧹 Remove Noise';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyNoiseRemover;
rx.appendChild(lbl);rx.appendChild(sl);rx.appendChild(btn);
}
function applyNoiseRemover(){
return _applyCanvas(async im=>{
const amount=(Number(document.getElementById('nr-amt')?.value ?? 50))/100;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const orig=x.getImageData(0,0,c.width,c.height);
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur('+(1+amount*3.5)+'px)';bctx.drawImage(im,0,0);
const blurred=bctx.getImageData(0,0,c.width,c.height).data;
const px=orig.data;const a=amount*0.75;
for(let i=0;i<px.length;i+=4){
px[i]=px[i]*(1-a)+blurred[i]*a;
px[i+1]=px[i+1]*(1-a)+blurred[i+1]*a;
px[i+2]=px[i+2]*(1-a)+blurred[i+2]*a;
}
x.putImageData(orig,0,0);
return c.toDataURL('image/png');
});
}
function showColorCorrectionPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🎨 Color Correction';
if(!rx)return;
rx.innerHTML='';
function mkSlider(id,label,spanId,min,max,def){
const d=document.createElement('div');d.style.cssText='margin-bottom:10px;';
const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';
l.innerHTML=label+': <span id="'+spanId+'">'+def+'</span>';
const sl=document.createElement('input');sl.type='range';sl.id=id;sl.min=min;sl.max=max;sl.value=def;
sl.style.cssText='width:100%;accent-color:var(--accent);';
sl.oninput=function(){document.getElementById(spanId).textContent=this.value;};
d.appendChild(l);d.appendChild(sl);return d;
}
const autoBtn=document.createElement('button');autoBtn.textContent='✨ Auto-Enhance (one click)';
autoBtn.style.cssText='width:100%;padding:11px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:700;font-size:13px;font-family:inherit;margin-bottom:12px;';
autoBtn.onclick=function(){
['cc-exp','cc-shad','cc-high','cc-temp','cc-tint'].forEach(id=>{});
document.getElementById('cc-exp').value=10;document.getElementById('cc-expv').textContent=10;
document.getElementById('cc-shad').value=15;document.getElementById('cc-shadv').textContent=15;
document.getElementById('cc-high').value=-10;document.getElementById('cc-highv').textContent=-10;
document.getElementById('cc-temp').value=5;document.getElementById('cc-tempv').textContent=5;
document.getElementById('cc-tint').value=0;document.getElementById('cc-tintv').textContent=0;
applyColorCorrection();
};
rx.appendChild(autoBtn);
rx.appendChild(mkSlider('cc-exp','Exposure','cc-expv',-100,100,0));
rx.appendChild(mkSlider('cc-shad','Shadows','cc-shadv',-100,100,0));
rx.appendChild(mkSlider('cc-high','Highlights','cc-highv',-100,100,0));
rx.appendChild(mkSlider('cc-temp','Temperature (cool↔warm)','cc-tempv',-100,100,0));
rx.appendChild(mkSlider('cc-tint','Tint (green↔magenta)','cc-tintv',-100,100,0));
const btn=document.createElement('button');btn.textContent='🎨 Apply';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:4px;';
btn.onclick=applyColorCorrection;
rx.appendChild(btn);
}
function applyColorCorrection(){
return _applyCanvas(async im=>{
const exposure=(Number(document.getElementById('cc-exp')?.value ?? 0))/100;
const shadows=(Number(document.getElementById('cc-shad')?.value ?? 0))/100;
const highlights=(Number(document.getElementById('cc-high')?.value ?? 0))/100;
const temp=(Number(document.getElementById('cc-temp')?.value ?? 0))/100;
const tint=(Number(document.getElementById('cc-tint')?.value ?? 0))/100;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const d=x.getImageData(0,0,c.width,c.height),px=d.data;
const expMul=Math.pow(2,exposure);
for(let i=0;i<px.length;i+=4){
let r=px[i]*expMul,g=px[i+1]*expMul,b=px[i+2]*expMul;
const lum=(r+g+b)/3/255;
if(shadows!==0){const w=Math.max(0,1-lum*1.4);r+=shadows*70*w;g+=shadows*70*w;b+=shadows*70*w;}
if(highlights!==0){const w=Math.max(0,lum*1.4-0.4);r+=highlights*70*w;g+=highlights*70*w;b+=highlights*70*w;}
r+=temp*32;b-=temp*32;
r+=tint*16;b+=tint*16;g-=tint*16;
px[i]=_clampByte(r);px[i+1]=_clampByte(g);px[i+2]=_clampByte(b);
}
x.putImageData(d,0,0);
return c.toDataURL('image/png');
});
}
function applySkinSmoothing(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const orig=x.getImageData(0,0,c.width,c.height);
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur(4px)';bctx.drawImage(im,0,0);
const blurred=bctx.getImageData(0,0,c.width,c.height).data;
const px=orig.data;
for(let i=0;i<px.length;i+=4){
const r=px[i],g=px[i+1],b=px[i+2];
const max=Math.max(r,g,b),min=Math.min(r,g,b);
const isSkin=r>60&&g>30&&b>15&&(max-min)>10&&Math.abs(r-g)>=8&&r>g&&r>=b&&r<250;
if(isSkin){
const a=0.55;
px[i]=r*(1-a)+blurred[i]*a;
px[i+1]=g*(1-a)+blurred[i+1]*a;
px[i+2]=b*(1-a)+blurred[i+2]*a;
}
}
x.putImageData(orig,0,0);
return c.toDataURL('image/png');
});
}
function _mkBrushSelectEffectPanel(toolTitle,hint,applyFnName){
return function(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent=toolTitle;
if(!rx)return;
window.__maskPainter=null;window.__lassoSelector=null;
if(!imageData){rx.textContent='Upload a photo first, then paint over the area.';return;}
rx.innerHTML='';
const hintEl=document.createElement('p');hintEl.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
hintEl.textContent=hint;
rx.appendChild(hintEl);
const painter=_mkMaskPainter({maxW:340});
window.__maskPainter=painter;
rx.appendChild(painter.element);
rx.appendChild(_mkBrushControls(painter,'fx'));
const btn=document.createElement('button');btn.textContent='✨ Apply';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:6px;';
btn.onclick=function(){window[applyFnName]();};
rx.appendChild(btn);
};
}
const showFaceRetouchPanel=_mkBrushSelectEffectPanel('💆 Face Retouch','Paint over the skin/face area to retouch (brush-select, not automatic face detection):','applyFaceRetouch');
const showTeethWhiteningPanel=_mkBrushSelectEffectPanel('😁 Teeth Whitening','Paint over the teeth:','applyTeethWhitening');
const showEyeEnhancerPanel=_mkBrushSelectEffectPanel('👁️ Eye Enhancer','Paint over the eyes:','applyEyeEnhancer');
function _applyMaskedFilter(filterCss,blendAmount){
const painter=window.__maskPainter;
if(!painter||!painter.hasPaint()){showToast('⚠️ Paint over the area first');return;}
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const maskCanvas=painter.getFullResMask(im.width,im.height);
const maskData=maskCanvas.getContext('2d').getImageData(0,0,im.width,im.height).data;
const fxC=_canvas(im.width,im.height),fctx=fxC.getContext('2d');
fctx.filter=filterCss;fctx.drawImage(im,0,0);fctx.filter='none';
const fxData=fctx.getImageData(0,0,im.width,im.height).data;
const d=x.getImageData(0,0,im.width,im.height),px=d.data;
for(let i=0;i<maskData.length;i+=4){
const a=(maskData[i]/255)*blendAmount;
if(a>0.02){
px[i]=px[i]*(1-a)+fxData[i]*a;
px[i+1]=px[i+1]*(1-a)+fxData[i+1]*a;
px[i+2]=px[i+2]*(1-a)+fxData[i+2]*a;
}
}
x.putImageData(d,0,0);
return c.toDataURL('image/png');
});
}
function applyFaceRetouch(){return _applyMaskedFilter('blur(3px) brightness(1.05) contrast(0.94)',0.75);}
function applyTeethWhitening(){return _applyMaskedFilter('brightness(1.25) saturate(0.6) contrast(1.05)',0.85);}
function applyEyeEnhancer(){return _applyMaskedFilter('contrast(1.3) saturate(1.25) brightness(1.08)',0.8);}
function showAIOutpaintingPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🖼️ Extend Canvas (Outpainting)';
if(!rx)return;
rx.innerHTML='';
const note=document.createElement('p');
note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.5;background:var(--bg3);padding:8px 10px;border-radius:8px;';
note.innerHTML='⚠️ <b>Honest note:</b> real AI outpainting (generating brand-new content) needs a generative model. This extends the canvas using a mirrored/blurred continuation of the edges — works well for simple backgrounds, less so for busy scenes.';
rx.appendChild(note);
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);';
lbl.innerHTML='Extend by: <span id="op-val">20</span>%';
const sl=document.createElement('input');sl.type='range';sl.id='op-amt';sl.min=5;sl.max=50;sl.value=20;
sl.style.cssText='width:100%;accent-color:var(--accent);margin:8px 0 12px;';
sl.oninput=function(){document.getElementById('op-val').textContent=this.value;};
const btn=document.createElement('button');btn.textContent='🖼️ Extend Canvas';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyAIOutpainting;
rx.appendChild(lbl);rx.appendChild(sl);rx.appendChild(btn);
}
function _flipH(img){const c=_canvas(img.width,img.height),x=c.getContext('2d');x.translate(img.width,0);x.scale(-1,1);x.drawImage(img,0,0);return c;}
function _flipV(img){const c=_canvas(img.width,img.height),x=c.getContext('2d');x.translate(0,img.height);x.scale(1,-1);x.drawImage(img,0,0);return c;}
function applyAIOutpainting(){
return _applyCanvas(async im=>{
const amt=(Number(document.getElementById('op-amt')?.value ?? 20))/100;
const padX=Math.round(im.width*amt),padY=Math.round(im.height*amt);
const c=_canvas(im.width+padX*2,im.height+padY*2),x=c.getContext('2d');
const flipHc=_flipH(im),flipVc=_flipV(im),flipHVc=_flipV(flipHc);
x.filter='blur(9px)';
x.drawImage(flipHc,im.width-padX,0,padX,im.height,0,padY,padX,im.height);
x.drawImage(flipHc,0,0,padX,im.height,padX+im.width,padY,padX,im.height);
x.drawImage(flipVc,0,im.height-padY,im.width,padY,padX,0,im.width,padY);
x.drawImage(flipVc,0,0,im.width,padY,padX,padY+im.height,im.width,padY);
x.drawImage(flipHVc,im.width-padX,im.height-padY,padX,padY,0,0,padX,padY);
x.drawImage(flipHVc,0,im.height-padY,padX,padY,padX+im.width,0,padX,padY);
x.drawImage(flipHVc,im.width-padX,0,padX,padY,0,padY+im.height,padX,padY);
x.drawImage(flipHVc,0,0,padX,padY,padX+im.width,padY+im.height,padX,padY);
x.filter='none';
x.drawImage(im,padX,padY);
return c.toDataURL('image/png');
});
}
function showColorizeOldPhotoPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🎨 Colorize Old Photo';
if(!rx)return;
rx.innerHTML='';
const note=document.createElement('p');note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:10px;';
note.textContent='Pick a tone (this is a manual tint, not automatic per-object AI colorization):';
rx.appendChild(note);
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:10px;';
[['Sepia','#c9a06a'],['Warm','#e0a868'],['Cool Blue','#7a9bc4'],['Vintage Rose','#c98a94']].forEach(function(t){
const btn=document.createElement('button');btn.textContent=t[0];
btn.style.cssText='height:40px;border-radius:8px;border:2px solid var(--border);cursor:pointer;font-size:10.5px;font-weight:700;color:#1a1a1a;text-shadow:0 1px 1px rgba(255,255,255,.4);background:'+t[1]+';font-family:inherit;';
btn.onclick=function(){document.getElementById('cz-color').value=_rgbToHex(t[1]);applyColorizeOldPhoto();};
grid.appendChild(btn);
});
rx.appendChild(grid);
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;';
const d1=document.createElement('div');
const l1=document.createElement('label');l1.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l1.textContent='Custom Color';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='cz-color';colorIn.value='#c9a06a';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;padding:2px;';
d1.appendChild(l1);d1.appendChild(colorIn);
const d2=document.createElement('div');
const l2=document.createElement('label');l2.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l2.innerHTML='Intensity: <span id="cz-iv">70</span>%';
const intensity=document.createElement('input');intensity.type='range';intensity.id='cz-amt';intensity.min=10;intensity.max=100;intensity.value=70;intensity.style.cssText='width:100%;accent-color:var(--accent);';
intensity.oninput=function(){document.getElementById('cz-iv').textContent=this.value;};
d2.appendChild(l2);d2.appendChild(intensity);
row.appendChild(d1);row.appendChild(d2);rx.appendChild(row);
const btn=document.createElement('button');btn.textContent='🎨 Colorize';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyColorizeOldPhoto;
rx.appendChild(btn);
}
function _rgbToHex(c){return c;}
function applyColorizeOldPhoto(){
return _applyCanvas(async im=>{
const hexColor=document.getElementById('cz-color')?.value||'#c9a06a';
const amount=(Number(document.getElementById('cz-amt')?.value ?? 70))/100;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
x.globalCompositeOperation='color';
x.globalAlpha=amount;
x.fillStyle=hexColor;
x.fillRect(0,0,c.width,c.height);
x.globalCompositeOperation='source-over';x.globalAlpha=1;
return c.toDataURL('image/png');
});
}
(function(){
const _origShowBlurBackgroundPanel=showBlurBackgroundPanel;
window.showBlurBackgroundPanel=function(){
_origShowBlurBackgroundPanel();
const rx=document.getElementById('resultText');
if(!rx)return;
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin:10px 0 4px;';lbl.textContent='Blur Type';
const sel=document.createElement('select');sel.id='bb-type';
sel.style.cssText='width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;margin-bottom:8px;';
[['gaussian','Gaussian (standard)'],['lens','Lens (soft + bright)'],['motion','Motion (directional)']].forEach(function(o){
const op=document.createElement('option');op.value=o[0];op.textContent=o[1];sel.appendChild(op);
});
const amountLabel=rx.querySelector('label');
if(amountLabel&&amountLabel.parentElement){amountLabel.parentElement.insertBefore(lbl,amountLabel);amountLabel.parentElement.insertBefore(sel,amountLabel);}
else{rx.insertBefore(sel,rx.firstChild);rx.insertBefore(lbl,sel);}
};
})();
function applyBlurBackground(){
return _applyCanvas(async im=>{
const amount=(Number(document.getElementById('bb-amount')?.value ?? 50))/100;
const type=document.getElementById('bb-type')?.value||'gaussian';
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
const radius=Math.max(2,Math.round(Math.max(im.width,im.height)*0.05*amount));
if(type==='motion'){
const steps=14,maxOffset=radius*1.6;
x.globalAlpha=1/steps;
for(let s=0;s<steps;s++){
const off=(s/(steps-1)-0.5)*maxOffset;
x.drawImage(im,off,0);
}
x.globalAlpha=1;
}else if(type==='lens'){
x.filter='blur('+(radius*1.25)+'px) brightness(1.05) saturate(1.08)';
x.drawImage(im,0,0);x.filter='none';
}else{
x.filter='blur('+radius+'px)';
x.drawImage(im,0,0);x.filter='none';
}
x.drawImage(cut,0,0,im.width,im.height);
return c.toDataURL('image/png');
});
}
(function(){
const _origShowBgChangerPanel=showBgChangerPanel;
window.showBgChangerPanel=function(){
_origShowBgChangerPanel();
const rx=document.getElementById('resultText');
if(!rx)return;
const divider=document.createElement('p');divider.style.cssText='font-size:12px;font-weight:700;color:var(--muted);margin:10px 0 6px;';
divider.textContent='Or browse free stock photos by theme:';
rx.appendChild(divider);
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:6px;';
[['🌿 Nature','nature landscape'],['🏢 Office','modern office'],['💡 Studio','studio lighting backdrop'],['🪵 Wood','wood texture'],['🌆 City','city skyline'],['⚪ Abstract','abstract gradient']].forEach(function(t){
const btn=document.createElement('button');btn.textContent=t[0];
btn.style.cssText='padding:9px 4px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-size:11.5px;font-weight:600;font-family:inherit;';
btn.onclick=function(){window.open('https://unsplash.com/s/photos/'+encodeURIComponent(t[1]),'_blank');};
grid.appendChild(btn);
});
rx.appendChild(grid);
const tip=document.createElement('p');tip.style.cssText='font-size:11px;color:var(--muted);';
tip.textContent='Opens Unsplash in a new tab — download a free photo, then use "Choose Image…" above.';
rx.appendChild(tip);
};
})();
const _panelToolsMap={
'Add Text to Photo':showTextOverlayPanel,
'Background Changer':showBgChangerPanel,
'Crop Image':showCropToolPanel,
'Resize Image':showResizeToolPanel,
'Image Compressor':showCompressToolPanel,
'Convert Image':showConvertToolPanel,
'Brightness & Contrast':showBrightnessToolPanel,
'Watermark Maker':showWatermarkToolPanel,
'Object Remover':showObjectRemoverPanel,
'Object Replace':showObjectRecolorPanel,
'Blur Background':showBlurBackgroundPanel,
'Image Sharpener':showImageSharpenerPanel,
'Noise Remover':showNoiseRemoverPanel,
'Color Correction':showColorCorrectionPanel,
'Face Retouch':showFaceRetouchPanel,
'Teeth Whitening':showTeethWhiteningPanel,
'Eye Enhancer':showEyeEnhancerPanel,
'AI Outpainting':showAIOutpaintingPanel,
'Colorize Old Photo':showColorizeOldPhotoPanel,
'Image to Text OCR':showOCRTool,
'Magic Eraser':showObjectRemoverPanel,
'AI Inpainting':showObjectRemoverPanel,
'Image Upscaler':showImageUpscalerPanel,
'Skin Smoothing':showSkinSmoothingPanel,
'AI Headshot':showAIHeadshotPanel,
};
const IBA_MAX_FILE_MB=25;
const IBA_MAX_MEGAPIXELS=40;
async function loadFile(f){
if(!f)return;
const isHeic=/\.(heic|heif)$/i.test(f.name)||f.type==='image/heic'||f.type==='image/heif';
const isGif=f.type==='image/gif'||/\.gif$/i.test(f.name);
if(!f.type.startsWith('image/')&&!isHeic){showToast('⚠️ Please upload an image file');return;}
const maxBytes=IBA_MAX_FILE_MB*1024*1024;
if(f.size>maxBytes){
showToast('⚠️ File is too large ('+(f.size/1024/1024).toFixed(1)+'MB). Max size is '+IBA_MAX_FILE_MB+'MB.');
return;
}
if(isGif){
showToast('⚠️ GIF uploaded — only the first frame will be edited. Animation is not preserved.');
}
if(isHeic){
showToast('⏳ Loading HEIC converter…');
try{ await _loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js'); }
catch(e){ showToast('⚠️ Could not load HEIC support — check your connection and try again.'); return; }
if(typeof heic2any==='undefined'){ showToast('⚠️ HEIC support failed to load, please try again.'); return; }
showToast('⏳ Converting HEIC photo…');
try{ f=await heic2any({blob:f,toType:'image/jpeg',quality:0.92}); }
catch(e){ showToast('⚠️ Could not convert this HEIC file. Try exporting as JPG first.'); return; }
}
const _mpUrl=URL.createObjectURL(f);
const _mpImg=new Image();
await new Promise((resolve)=>{
_mpImg.onload=()=>{
const mp=(_mpImg.naturalWidth*_mpImg.naturalHeight)/1000000;
URL.revokeObjectURL(_mpUrl);
if(mp>IBA_MAX_MEGAPIXELS){
showToast('⚠️ Image is '+mp.toFixed(1)+'MP — max supported is '+IBA_MAX_MEGAPIXELS+'MP. Please downscale first.');
f=null;
}
resolve();
};
_mpImg.onerror=()=>{ URL.revokeObjectURL(_mpUrl); resolve(); };
_mpImg.src=_mpUrl;
});
if(!f)return;
if(!f||!f.type.startsWith('image/')){showToast('⚠️ Please upload an image file');return;}
const r=new FileReader();
r.onload=()=>{
imageData=r.result;
window.__originalUpload=r.result;
document.getElementById('uploadContent').innerHTML='<img src="'+imageData+'" alt="Uploaded photo" style="max-width:100%;max-height:280px;border-radius:16px;object-fit:contain;">';
showToast('✅ Image uploaded');
trackEvent&&trackEvent('image_upload','Tool',selected);
const uxb=document.getElementById('upload-x-btn');if(uxb)uxb.style.display='flex';
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
if(_panelToolsMap[selected]){
if(rx)rx.innerHTML='';
_panelToolsMap[selected]();
if(rt)rt.textContent='Ready — '+selected;
}else{
if(rt)rt.textContent='Image uploaded';
if(rx)rx.textContent='Now apply '+selected+'.';
}
};
r.readAsDataURL(f);
}
window.__undoStack=[];
window.__redoStack=[];
const _MAX_HISTORY=12;
function _pushUndo(prevImageData){
if(!prevImageData)return;
window.__undoStack.push(prevImageData);
if(window.__undoStack.length>_MAX_HISTORY)window.__undoStack.shift();
window.__redoStack=[];
_updateUndoRedoButtons();
}
function _refreshResultView(){
const out=document.getElementById('output');
if(out){
out.innerHTML='';
const img=document.createElement('img');
img.id='outImg';img.alt='Edited photo result';img.src=imageData;
img.style.cssText='display:block;width:100%;max-height:420px;object-fit:contain;border-radius:16px;';
out.appendChild(img);
out.style.display='block';
}
const dl=document.getElementById('download');
if(dl){dl.href=imageData;dl.style.display='inline-block';}
}
function _updateUndoRedoButtons(){
const u=document.getElementById('undo-btn'),r=document.getElementById('redo-btn');
if(u)u.disabled=window.__undoStack.length===0;
if(r)r.disabled=window.__redoStack.length===0;
}
function doUndo(){
if(window.__undoStack.length===0){showToast('⚠️ Nothing to undo');return;}
window.__redoStack.push(imageData);
imageData=window.__undoStack.pop();
_refreshResultView();
_refreshActiveToolPanel();
_updateUndoRedoButtons();
showToast('↶ Undone — tool controls reset, adjust and apply again');
}
function doRedo(){
if(window.__redoStack.length===0){showToast('⚠️ Nothing to redo');return;}
window.__undoStack.push(imageData);
imageData=window.__redoStack.pop();
_refreshResultView();
_refreshActiveToolPanel();
_updateUndoRedoButtons();
showToast('↷ Redone — tool controls reset, adjust and apply again');
}
function _refreshActiveToolPanel(){
if(_panelToolsMap[selected]){
const rx=document.getElementById('resultText');
if(rx)rx.innerHTML='';
_panelToolsMap[selected]();
}
}
function _downloadReady(data,ext){
_pushUndo(imageData);
imageData=data;
const out=document.getElementById('output'),dl=document.getElementById('download'),sb=document.getElementById('share-bar');
if(out){
out.innerHTML='';
const img=document.createElement('img');
img.id='outImg';img.alt='Edited photo result';img.src=data;
img.style.cssText='display:block;width:100%;max-height:420px;object-fit:contain;border-radius:16px;';
out.appendChild(img);
out.style.display='block';out.style.opacity='1';out.style.transform='none';
}
if(dl){dl.href=imageData;dl.download='imageboostai-'+selected.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.'+(ext||'png');dl.style.display='inline-block';dl.textContent='⬇ Download Result';}
if(sb)sb.style.display='flex';
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
if(rt)rt.textContent='✅ Done!';
if(rx)rx.textContent=selected+' applied. Your download is ready.';
const closeBtn=document.getElementById('close-result-btn');if(closeBtn)closeBtn.style.display='flex';
addHistory&&addHistory(selected);
showToast&&showToast('✅ '+selected+' complete — download ready!');
}
function toggleFullscreen(){
const ws=document.getElementById('workspace');
if(!document.fullscreenElement){
const req=ws.requestFullscreen||ws.webkitRequestFullscreen||ws.msRequestFullscreen;
if(req){const p=req.call(ws);if(p&&p.catch)p.catch(()=>showToast('⚠️ Fullscreen not supported in this browser'));}
ws.classList.add('fs-active');
}else{
const exit=document.exitFullscreen||document.webkitExitFullscreen||document.msExitFullscreen;
if(exit)exit.call(document);
ws.classList.remove('fs-active');
}
}
document.addEventListener('fullscreenchange',()=>{
const ws=document.getElementById('workspace'),btn=document.getElementById('fullscreen-btn');
if(!document.fullscreenElement){if(ws)ws.classList.remove('fs-active');if(btn)btn.textContent='⛶ Fullscreen';}
else if(btn)btn.textContent='⛶ Exit Fullscreen';
});
function _mkRectSelector(opts){
const maxW=(opts&&opts.maxW)||340;
const wrap=document.createElement('div');
wrap.style.cssText='position:relative;display:inline-block;max-width:100%;border-radius:10px;overflow:hidden;cursor:crosshair;user-select:none;border:1.5px solid var(--border);touch-action:none;';
const canvas=document.createElement('canvas');
canvas.style.cssText='display:block;max-width:100%;';
wrap.appendChild(canvas);
let img=null,rect=null;
const HANDLE_R=9;
function draw(){
if(!img)return;
const ctx=canvas.getContext('2d');
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img,0,0,canvas.width,canvas.height);
if(rect){
const rx0=rect.x*canvas.width,ry0=rect.y*canvas.height,rw=rect.w*canvas.width,rh=rect.h*canvas.height;
ctx.save();
ctx.strokeStyle='#5b4ce8';ctx.lineWidth=2;ctx.setLineDash([6,4]);
ctx.strokeRect(rx0,ry0,rw,rh);
ctx.fillStyle='rgba(91,76,232,.18)';
ctx.fillRect(rx0,ry0,rw,rh);
ctx.setLineDash([]);
const pts=[[rx0,ry0],[rx0+rw/2,ry0],[rx0+rw,ry0],[rx0,ry0+rh/2],[rx0+rw,ry0+rh/2],[rx0,ry0+rh],[rx0+rw/2,ry0+rh],[rx0+rw,ry0+rh]];
pts.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],HANDLE_R*0.6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#5b4ce8';ctx.stroke();});
ctx.restore();
}
}
img=new Image();
img.onload=function(){
const scale=Math.min(1,maxW/img.width);
canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
draw();
};
img.src=imageData;
let mode=null,startX=0,startY=0,startRect=null;
function posFromEvent(e){
const r=canvas.getBoundingClientRect();
const cx=(e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-r.left;
const cy=(e.touches?(e.touches[0]||e.changedTouches[0]).clientY:e.clientY)-r.top;
return{x:Math.max(0,Math.min(1,cx/r.width)),y:Math.max(0,Math.min(1,cy/r.height))};
}
function hitTestHandle(p){
if(!rect)return null;
const px=p.x*canvas.width,py=p.y*canvas.height;
const rx0=rect.x*canvas.width,ry0=rect.y*canvas.height,rw=rect.w*canvas.width,rh=rect.h*canvas.height;
const handles={
nw:[rx0,ry0],n:[rx0+rw/2,ry0],ne:[rx0+rw,ry0],
w:[rx0,ry0+rh/2],e:[rx0+rw,ry0+rh/2],
sw:[rx0,ry0+rh],s:[rx0+rw/2,ry0+rh],se:[rx0+rw,ry0+rh]
};
for(const k in handles){
const h=handles[k];
if(Math.hypot(px-h[0],py-h[1])<HANDLE_R+4)return k;
}
if(px>=rx0&&px<=rx0+rw&&py>=ry0&&py<=ry0+rh)return 'move';
return null;
}
function down(e){
const p=posFromEvent(e);
const hit=rect?hitTestHandle(p):null;
if(rect&&hit){
mode=hit;startX=p.x;startY=p.y;startRect={x:rect.x,y:rect.y,w:rect.w,h:rect.h};
}else{
mode='new';startX=p.x;startY=p.y;rect={x:p.x,y:p.y,w:0,h:0};
}
e.preventDefault();
}
function move(e){
if(!mode)return;
const p=posFromEvent(e);
if(mode==='new'){
rect={x:Math.min(startX,p.x),y:Math.min(startY,p.y),w:Math.abs(p.x-startX),h:Math.abs(p.y-startY)};
}else if(mode==='move'){
const dx=p.x-startX,dy=p.y-startY;
let nx=startRect.x+dx,ny=startRect.y+dy;
nx=Math.max(0,Math.min(1-startRect.w,nx));ny=Math.max(0,Math.min(1-startRect.h,ny));
rect={x:nx,y:ny,w:startRect.w,h:startRect.h};
}else{
let{x,y,w,h}=startRect;
const dx=p.x-startX,dy=p.y-startY;
if(mode.includes('w')){x=startRect.x+dx;w=startRect.w-dx;}
if(mode.includes('e')){w=startRect.w+dx;}
if(mode.includes('n')){y=startRect.y+dy;h=startRect.h-dy;}
if(mode.includes('s')){h=startRect.h+dy;}
if(w<0){x=x+w;w=-w;}
if(h<0){y=y+h;h=-h;}
rect={x:Math.max(0,x),y:Math.max(0,y),w:Math.min(w,1-Math.max(0,x)),h:Math.min(h,1-Math.max(0,y))};
}
draw();
e.preventDefault();
}
function up(){
if(mode==='new'&&rect&&(rect.w<0.02||rect.h<0.02))rect=null;
mode=null;draw();
}
canvas.addEventListener('mousedown',down);
canvas.addEventListener('mousemove',move);
window.addEventListener('mouseup',up);
canvas.addEventListener('touchstart',down,{passive:false});
canvas.addEventListener('touchmove',move,{passive:false});
canvas.addEventListener('touchend',up);
return{element:wrap,getRect:()=>rect,reset:()=>{rect=null;draw();}};
}
function showImageUpscalerPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='📈 Image Upscaler';
if(!rx)return;
rx.innerHTML='';
const desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';
desc.textContent='Choose a scale factor (smooth resize + sharpening — not true AI super-resolution):';
rx.appendChild(desc);
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;';
[['2×','2'],['4×','4'],['8×','8']].forEach(function(o){
const btn=document.createElement('button');btn.textContent=o[0];
btn.style.cssText='padding:14px 8px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:700;font-size:16px;font-family:inherit;';
btn.onclick=function(){applyImageUpscaler(parseInt(o[1]));};
grid.appendChild(btn);
});
rx.appendChild(grid);
}
function applyImageUpscaler(factor){
factor=factor||2;
return _applyCanvas(async im=>{
const maxDim=6000; 
let w=im.width*factor,h=im.height*factor;
if(Math.max(w,h)>maxDim){const s=maxDim/Math.max(w,h);w*=s;h*=s;}
w=Math.round(w);h=Math.round(h);
const c=_canvas(w,h),x=c.getContext('2d');
x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
x.drawImage(im,0,0,w,h);
const orig=x.getImageData(0,0,w,h);
const blurC=_canvas(w,h),bctx=blurC.getContext('2d');
bctx.filter='blur(1.4px)';bctx.drawImage(c,0,0);
const blurred=bctx.getImageData(0,0,w,h).data;
const px=orig.data;
for(let i=0;i<px.length;i+=4){
px[i]=_clampByte(px[i]+(px[i]-blurred[i])*0.5);
px[i+1]=_clampByte(px[i+1]+(px[i+1]-blurred[i+1])*0.5);
px[i+2]=_clampByte(px[i+2]+(px[i+2]-blurred[i+2])*0.5);
}
x.putImageData(orig,0,0);
showToast('📈 Upscaled '+factor+'× to '+w+'×'+h);
return c.toDataURL('image/png');
});
}
