
window.addEventListener('error', function(e){
console.error('JS Error:', e.message, 'at', e.filename, ':', e.lineno);
showToast && showToast('⚠️ Error: ' + e.message.slice(0,50));
});
window.addEventListener('unhandledrejection', function(e){
console.error('Promise Error:', e.reason);
});
var _gtLoaded=false, _gtReady=false, _gtPendingLang=null;
function googleTranslateElementInit(){
new google.translate.TranslateElement({
pageLanguage:'en',
includedLanguages:'en,tr,es,fr,de,pt,it,ru,ja,zh-CN,ko,ar,hi,bn,ur,fa,nl,pl,sv,id,vi,th,uk,no,da,fi,el,cs,sk,hu,ro,bg,hr,sr,sl,lt,lv,et,he,ms,tl,sw,af,am,az,ka,hy,kk,uz,mn,ne,si,ta,te,ml,kn,mr,gu,pa,ca,eu,ga,is,mt',
layout:google.translate.TranslateElement.InlineLayout.SIMPLE,
autoDisplay:false
},'google_translate_element');
_gtReady=true;
if(_gtPendingLang){translateWholePage(_gtPendingLang);_gtPendingLang=null;}
}
function loadGoogleTranslateIfNeeded(){ /* External page translation disabled: editor text stays local. */ }
const tools=[
['Remove Background','Remove any background in one click.','🎭','bg','hot'],
['Background Changer','Replace backgrounds with clean scenes.','🌅','bg',''],
['AI Background Generator','Applies a color-adjusted tone to the background (not a generated scene).','🪄','bg','new'],
['Object Remover','Drag to select an area, then remove it.','🧽','bg',''],
['Object Replace','Recolor a selected area (filter-based, not a generative AI replace).','🔁','bg',''],
['Object Add','Add new objects into a photo.','➕','bg',''],
['AI Inpainting','Fills a selected area using pixel-blend (not a generative AI model).','🖌️','bg','new'],
['AI Outpainting','Extends photo edges using a blur-fill effect (not AI-generated content).','🖼️','bg',''],
['Magic Eraser','Brush and remove anything fast.','✨','bg','hot'],
['AI Photo Restore','Reduces noise and grain (filter-based, not a generative restoration model).','🏛️','fix','hot'],
['Colorize Old Photo','Add color to black and white photos.','🎨','fix',''],
['Image Upscaler','Increase image resolution and detail.','📈','fix','hot'],
['Image Sharpener','Make blurry photos look clearer.','🔭','fix',''],
['Noise Remover','Clean grain and digital noise.','🧊','fix',''],
['Photo Enhancer','Improve light, color and contrast.','💎','fix',''],
['Color Correction','Balance tones and colors.','🌈','fix',''],
['Brightness & Contrast','Adjust exposure and depth.','☀️','fix',''],
['Remove Blur','Fix soft or shaky images.','🛠️','fix',''],
['Face Retouch','Smooth portraits naturally.','💄','face','hot'],
['Skin Smoothing','Clean skin while keeping detail.','🌸','face',''],
['Teeth Whitening','Brighten smiles in portraits.','😁','face',''],
['Eye Enhancer','Make eyes sharper and brighter.','👁️','face',''],
['AI Headshot','Adds a simple illustrated attire overlay (not AI-generated clothing).','👔','face','new'],
['Portrait Enhancer','Improve portraits with clean detail.','🧑‍🎨','face',''],
['Blur Background','Create portrait depth effect.','📷','design',''],
['Crop Image','Crop photos for web and social.','✂️','design',''],
['Resize Image','Resize images to exact dimensions.','📐','design',''],
['Image Compressor','Reduce file size without quality loss.','🗜️','convert',''],
['Convert Image','Convert PNG, JPG, WEBP and HEIC.','🔄','convert',''],
['Watermark Remover','Clean marks from your own images.','🧼','design','hot'],
['Watermark Maker','Add logo or text watermark.','🔏','design',''],
['Add Text to Photo','Add stylish text to any image.','✍️','design',''],
['Image to Text OCR','Extract text from photos.','🔎','convert','hot'],
['Product Photo Editor','Create clean product photos.','🛍️','design',''],
['Photo Collage Maker','Combine images into collages.','🧩','design',''],
];
let selected='Photo Enhancer', selectedDesc='Improve light, color and contrast.', imageData=null;
let LANG='en', detectedLang=null;
function renderTools(list=tools){
const grid=document.getElementById('toolGrid');
if(!grid)return;
const favs=getFavorites();
grid.innerHTML=list.map((t,i)=>`
    <div class="tool-card" data-cat="${t[3]}"
         onclick="openTool('${t[0].replace(/'/g,"\\'")}');trackEvent('tool_click','Tool','${t[0]}')"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"
         tabindex="0"
         role="listitem" aria-label="${t[0]}: ${t[1]}"
         style="animation-delay:${Math.min(i*.03,.4)}s">
      <button class="fav-btn${favs.indexOf(t[0])>-1?' on':''}" data-tool="${t[0].replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" onclick="event.stopPropagation();toggleFavorite(this)" aria-label="Add to favorites">${favs.indexOf(t[0])>-1?'❤':'♡'}</button>
      ${t[4]==='hot'?'<span class="tool-badge tb-hot">🔥 Hot</span>':''}
      ${t[4]==='new'?'<span class="tool-badge tb-new">✨ New</span>':''}
      <div class="tool-ic anim-${t[3]}" aria-hidden="true"><span class="ic-emoji">${t[2]}</span></div>
      <div class="tool-name">${t[0]}</div>
      <div class="tool-desc">${t[1]}</div>
    </div>`).join('');
if(list.length===0){
grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px 20px;">'
+'<div style="font-size:44px;margin-bottom:12px;">🤍</div>'
+'<div style="font-weight:800;font-size:16px;color:var(--text);margin-bottom:6px;">No favorites yet</div>'
+'<div style="font-size:13.5px;color:var(--muted);">Tap the heart on any tool card to save it here.</div>'
+'</div>';
}
}
function getFavorites(){
try{return JSON.parse(localStorage.getItem('iba_favorites')||'[]');}catch(e){return [];}
}
function updateFavCount(){
const el=document.getElementById('favCount');
if(!el)return;
const n=getFavorites().length;
if(n>0){el.textContent=n;el.style.display='inline-flex';}
else{el.style.display='none';}
}
function toggleFavorite(btn){
const name=btn.getAttribute('data-tool');
let favs=getFavorites();
const idx=favs.indexOf(name);
if(idx>-1){favs.splice(idx,1);btn.classList.remove('on');btn.textContent='♡';showToast('Removed from favorites');}
else{favs.push(name);btn.classList.add('on');btn.textContent='❤';showToast('❤️ Added to favorites');}
try{localStorage.setItem('iba_favorites',JSON.stringify(favs));}catch(e){}
updateFavCount();
const activePill=document.querySelector('.cat-pill.cp-favorites.active');
if(activePill)filterTools('favorites',activePill);
trackEvent('toggle_favorite','UX',name);
}
renderTools();
(function(){
var demo=document.getElementById('baDemo');
if(!demo)return;
var afterWrap=document.getElementById('baAfterWrap');
var divider=document.getElementById('baDivider');
var handle=document.getElementById('baHandle');
var dragging=false;
function setPos(pct){
pct=Math.max(0,Math.min(100,pct));
afterWrap.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';
divider.style.left=pct+'%';
handle.style.left=pct+'%';
}
function posFromEvent(e){
var rect=demo.getBoundingClientRect();
var x=(e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-rect.left;
return (x/rect.width)*100;
}
demo.addEventListener('mousedown',function(e){dragging=true;setPos(posFromEvent(e));});
demo.addEventListener('touchstart',function(e){dragging=true;setPos(posFromEvent(e));},{passive:true});
window.addEventListener('mousemove',function(e){if(dragging)setPos(posFromEvent(e));});
window.addEventListener('touchmove',function(e){if(dragging)setPos(posFromEvent(e));},{passive:true});
window.addEventListener('mouseup',function(){dragging=false;});
window.addEventListener('touchend',function(){dragging=false;});
})();
updateFavCount();
function filterTools(cat,btn){
document.querySelectorAll('.cat-pill').forEach(b=>b.classList.remove('active'));
if(btn){
btn.classList.add('active');
var cls=btn.className.match(/cp-\w+/);
if(cls){document.querySelectorAll('.'+cls[0]).forEach(function(p){p.classList.add('active');});}
}
renderTools(cat==='all'?tools:cat==='favorites'?tools.filter(t=>getFavorites().indexOf(t[0])>-1):tools.filter(t=>t[3]===cat));
renderCategoryDescCard(cat);
const toolsSec=document.getElementById('tools');
if(toolsSec)toolsSec.scrollIntoView({behavior:'instant',block:'start'});
trackEvent('filter_tools','UI',cat);
}
const CAT_DESCRIPTIONS={
favorites:{
badge:'❤️ Your favorites',
emojis:['❤️','⭐','✨','🖼️'],
title:'Your saved tools, all in one place',
text:'Tap the heart on any tool card to save it here for quick access next time — your picks are saved right in this browser.'
},
all:{
badge:'✨ 35+ tools',
emojis:['🖼️','📸','🎨','⚡'],
title:'One toolbox for every photo problem',
text:'From a background that needs to disappear to an old family photo that needs bringing back to life — browse all 35 tools below, or use a category tab to narrow things down.'
},
bg:{
badge:'🎭 Background tools',
emojis:['🎭','🖼️','🌅','✂️'],
title:'Backgrounds: remove, replace, or generate',
text:'Cut a subject out cleanly, swap in a new scene, blur a busy background for a portrait look, or generate a studio backdrop — all processed locally, nothing uploaded to a server.'
},
fix:{
badge:'🏛️ Restore & fix',
emojis:['🏛️','🔧','📷','💎'],
title:'Bring faded, blurry, or noisy photos back',
text:'Repair old scanned photos, sharpen soft shots, strip out digital grain, balance color, or upscale a small image — real image-processing pipelines, not a single filter slapped on top.'
},
face:{
badge:'💄 Face & portrait',
emojis:['💄','😊','👁️','✨'],
title:'Portrait retouching that still looks like you',
text:'Smooth skin, brighten eyes, whiten teeth, or generate a clean studio-style headshot — brush-guided so you control exactly where the effect is applied, nothing done automatically to your whole face.'
},
convert:{
badge:'🔄 Convert & optimize',
emojis:['🔄','🗜️','📦','⚡'],
title:'Get the right format and the right size',
text:'Convert between JPG, PNG, WEBP and HEIC, shrink a file for faster uploads, or pull text straight out of a photo with real OCR — the boring-but-essential stuff, done properly.'
},
design:{
badge:'🎨 Design tools',
emojis:['🎨','✍️','🧩','🖌️'],
title:'Crop, caption, collage, and brand your photos',
text:'Resize for a specific platform, add a text overlay or your own watermark, build a collage from several photos, or clean up a product shot for a store listing.'
}
};
function renderCategoryDescCard(cat){
const holder=document.getElementById('cat-desc-card');
if(!holder)return;
const d=CAT_DESCRIPTIONS[cat]||CAT_DESCRIPTIONS.all;
holder.innerHTML=`
    <div class="cat-desc-card">
      <span class="cd-badge">${d.badge}</span>
      <span class="cd-emoji cd-e1">${d.emojis[0]}</span>
      <span class="cd-emoji cd-e2">${d.emojis[1]}</span>
      <span class="cd-emoji cd-e3">${d.emojis[2]}</span>
      <span class="cd-emoji cd-e4">${d.emojis[3]}</span>
      <div class="cd-inner">
        <h3>${d.title}</h3>
        <p>${d.text}</p>
      </div>
    </div>`;
}
document.addEventListener('DOMContentLoaded',()=>{ renderCategoryDescCard('all'); });
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('#nav-cats .cat-pill[data-cat]').forEach(function(btn){
btn.removeAttribute('onclick');
btn.addEventListener('click',function(){
filterTools(btn.getAttribute('data-cat'), btn);
});
});
});

const IBA_TOOL_SLUGS={"Remove Background": "remove-background", "Background Changer": "background-changer", "AI Background Generator": "ai-background-generator", "Object Remover": "object-remover", "Object Replace": "object-replace", "Object Add": "object-add", "AI Inpainting": "ai-inpainting", "AI Outpainting": "ai-outpainting", "Magic Eraser": "magic-eraser", "AI Photo Restore": "ai-photo-restore", "Colorize Old Photo": "colorize-old-photo", "Image Upscaler": "image-upscaler", "Image Sharpener": "image-sharpener", "Noise Remover": "noise-remover", "Photo Enhancer": "photo-enhancer", "Color Correction": "color-correction", "Brightness & Contrast": "brightness-and-contrast", "Remove Blur": "remove-blur", "Face Retouch": "face-retouch", "Skin Smoothing": "skin-smoothing", "Teeth Whitening": "teeth-whitening", "Eye Enhancer": "eye-enhancer", "AI Headshot": "ai-headshot", "Portrait Enhancer": "portrait-enhancer", "Blur Background": "blur-background", "Crop Image": "crop-image", "Resize Image": "resize-image", "Image Compressor": "image-compressor", "Convert Image": "convert-image", "Watermark Remover": "watermark-remover", "Watermark Maker": "watermark-maker", "Add Text to Photo": "add-text-to-photo", "Image to Text OCR": "image-to-text-ocr", "Product Photo Editor": "product-photo-editor", "Photo Collage Maker": "photo-collage-maker"};
const IBA_DEFAULT_TITLE=document.title;
const IBA_DEFAULT_DESC=document.querySelector('meta[name="description"]')?.getAttribute('content')||'';
function updateSeoForTool(name,desc){
try{
document.title=name+' — Free Online Tool | ImageBoostAI';
const m=document.querySelector('meta[name="description"]');
if(m)m.setAttribute('content',(desc||name)+" Free, instant, 100% browser-based — no login, no watermark. Part of ImageBoostAI's 35+ free AI photo editing tools.");
const c=document.querySelector('link[rel="canonical"]');
if(c){
const slug=IBA_TOOL_SLUGS[name];
c.setAttribute('href',slug?('https://imageboostai.com/'+slug+'/'):('https://imageboostai.com/?tool='+encodeURIComponent(name)));
}
const rm=document.querySelector('meta[name="robots"]');
if(rm)rm.setAttribute('content','noindex,follow');
}catch(e){}
}
function resetSeoDefault(){
try{
document.title=IBA_DEFAULT_TITLE;
const m=document.querySelector('meta[name="description"]');
if(m)m.setAttribute('content',IBA_DEFAULT_DESC);
const c=document.querySelector('link[rel="canonical"]');
if(c)c.setAttribute('href','https://imageboostai.com/');
const rm=document.querySelector('meta[name="robots"]');
if(rm)rm.setAttribute('content','index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
}catch(e){}
}
function openTool(name){
const t=tools.find(x=>x[0]===name)||tools[0];
if(!t)return;
selected=t[0]; selectedDesc=t[1];
updateSeoForTool(t[0],t[1]);
const st=document.getElementById('selectedTitle');
const ss=document.getElementById('selectedSmall');
const rt=document.getElementById('resultTitle');
const rx=document.getElementById('resultText');
if(st)st.textContent=t[2]+' '+t[0];
if(ss)ss.textContent='Selected Tool';
if(rt)rt.textContent='Ready — '+t[0];
const uiTools={
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
if(window.__ibaExtraPanels){ Object.assign(uiTools, window.__ibaExtraPanels); }
window.__ibaUiTools = uiTools;
if(uiTools[t[0]]){
if(rx)rx.innerHTML='';
uiTools[t[0]]();
} else {
if(rx)rx.textContent=t[1]+' — Upload a photo then click ⚡ Apply Tool.';
}
const ws=document.getElementById('workspace');
if(ws){
ws.scrollIntoView({behavior:'instant', block:'start'});
}
const dz=document.getElementById('drop');
if(dz){
dz.style.transition='all .3s ease';
dz.style.borderColor='var(--accent)';
dz.style.boxShadow='0 0 0 4px rgba(91,76,232,.15)';
setTimeout(()=>{dz.style.borderColor='';dz.style.boxShadow='';},1800);
}
document.querySelectorAll('.tool-card').forEach(c=>{
c.style.outline='';c.style.transform='';
});
const activeCard=Array.from(document.querySelectorAll('.tool-card'))
.find(c=>c.querySelector('.tool-name')?.textContent===t[0]);
if(activeCard){
activeCard.style.outline='2.5px solid var(--accent)';
activeCard.style.outlineOffset='2px';
activeCard.style.boxShadow='0 8px 24px rgba(91,76,232,.25)';
}
const ab=document.querySelector('button.btn-primary[onclick="applyTool()"]');
if(ab){
ab.style.boxShadow='0 0 0 3px rgba(91,76,232,.4)';
ab.textContent='⚡ Apply: '+t[0];
setTimeout(()=>{ab.style.boxShadow='';ab.textContent='⚡ Apply Tool';},2500);
}
showToast(t[2]+' '+t[0]+' selected');
try{if(history.pushState&&window.self===window.top)
history.pushState(null,'','?tool='+encodeURIComponent(t[0]));}catch(e){}
trackEvent('open_tool','Tool',t[0]);
}
const fileEl=document.getElementById('file');
const dropZone=document.getElementById('drop');
if(fileEl)fileEl.onchange=e=>loadFile(e.target.files[0]);
if(dropZone){
['dragover','drop'].forEach(ev=>dropZone.addEventListener(ev,e=>{
e.preventDefault();
if(ev==='drop')loadFile(e.dataTransfer.files[0]);
}));
dropZone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')fileEl.click();});
}
function applyTool(){
if(!imageData){
document.getElementById('file').click();
showToast('⚠️ Upload an image first');
return;
}
const p=document.getElementById('progress'),b=document.getElementById('bar');
if(p)p.style.display='block';
if(b)b.style.width='0';
const outEl=document.getElementById('output');
const dlEl=document.getElementById('download');
const sbEl=document.getElementById('share-bar');
if(outEl)outEl.style.display='none';
if(dlEl)dlEl.style.display='none';
if(sbEl)sbEl.style.display='none';
trackEvent('apply_tool','Tool',selected);
dispatchTool(selected);
}
function finishApply(){
const baBefore=document.getElementById('ba-before-content');
const baAfter=document.getElementById('ba-after-content');
const baLabel=document.getElementById('ba-tool-label');
const baName=document.getElementById('ba-tool-name');
if(baBefore&&imageData){
baBefore.innerHTML='<img src="'+imageData+'" alt="Original" style="width:100%;max-height:280px;object-fit:contain;padding:12px;">';
}
if(baAfter&&imageData){
baAfter.innerHTML='<div style="position:relative;display:inline-block;width:100%;"><img src="'+imageData+'" alt="AI Result" style="width:100%;max-height:280px;object-fit:contain;padding:12px;filter:'+getToolFilter(selected)+'"><div style="position:absolute;top:8px;left:8px;background:rgba(91,76,232,.9);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:100px;">AI Processed</div></div>';
}
if(baLabel)baLabel.style.display='block';
if(baName)baName.textContent=selected+' applied';
const baStatusText=document.getElementById('ba-status-text');
if(baStatusText)baStatusText.innerHTML='<span style="font-size:16px;">✅</span> '+selected+' applied — scroll down to compare';
const img=document.getElementById('outImg');
img.src=imageData;
const outWrap=document.getElementById('output');
outWrap.style.display='block';
outWrap.style.opacity='0';
outWrap.style.transform='translateY(10px)';
outWrap.style.transition='opacity .4s ease,transform .4s ease';
requestAnimationFrame(()=>requestAnimationFrame(()=>{outWrap.style.opacity='1';outWrap.style.transform='translateY(0)';}));
const dl=document.getElementById('download');
dl.href=imageData;dl.style.display='inline-block';
document.getElementById('resultTitle').textContent='✅ Done!';
document.getElementById('resultText').textContent=selected+' applied. Your download is ready.';
addHistory(selected);
showToast('✅ '+selected+' complete — download ready!');
const sb=document.getElementById('share-bar');
sb.style.display='flex';
const shareEmail=document.getElementById('share-email');
if(shareEmail){
const subj=encodeURIComponent('Check out ImageBoostAI — Free AI Photo Editor');
const body=encodeURIComponent('I used '+selected+' on ImageBoostAI, a free AI photo editing tool. Try it at https://imageboostai.com/');
shareEmail.href='mailto:?subject='+subj+'&body='+body;
}
if(typeof gtag!=='undefined')gtag('event','tool_complete',{tool_name:selected});
const closeBtn=document.getElementById('close-result-btn');
if(closeBtn){closeBtn.style.display='flex';}
}
function addHistory(name){
const h=document.getElementById('history');
const d=document.createElement('div');
d.className='hist-item';d.setAttribute('role','listitem');
d.textContent='✓ '+name;
h.prepend(d);
}
function resetEditor(){
imageData=null;if(fileEl)fileEl.value='';
document.getElementById('uploadContent').innerHTML='<div class="u-icon">🖼️</div><div class="u-title">Upload Your Photo</div><div class="u-sub">Click or drag an image here. JPG, PNG, WEBP supported.</div>';
document.getElementById('output').style.display='none';
document.getElementById('download').style.display='none';
document.getElementById('progress').style.display='none';
const sb=document.getElementById('share-bar');if(sb)sb.style.display='none';
const cb=document.getElementById('close-result-btn');if(cb)cb.style.display='none';
const uxb2=document.getElementById('upload-x-btn');if(uxb2)uxb2.style.display='none';
document.getElementById('resultTitle').textContent='Ready to Edit';
document.getElementById('resultText').textContent='Pick any tool, upload a photo, then click Apply.';
document.querySelectorAll('.tool-card').forEach(c=>c.style.outline='');
showToast('Editor reset');
const baBefore=document.getElementById('ba-before-content');
const baAfter=document.getElementById('ba-after-content');
const baLabel=document.getElementById('ba-tool-label');
if(baBefore)baBefore.innerHTML='<div class="ba-placeholder"><div style="font-size:48px;margin-bottom:12px;opacity:.4;">🖼️</div><div style="font-weight:700;font-size:15px;color:var(--text2);margin-bottom:6px;">Original Photo</div><div style="font-size:13px;color:var(--muted);">Upload a photo above to see it here</div></div>';
if(baAfter)baAfter.innerHTML='<div class="ba-placeholder"><div style="font-size:48px;margin-bottom:12px;opacity:.4;">✨</div><div style="font-weight:700;font-size:15px;color:var(--text2);margin-bottom:6px;">AI Result</div><div style="font-size:13px;color:var(--muted);">Apply a tool to see the result here</div></div>';
if(baLabel)baLabel.style.display='none';
try{if(history.pushState&&window.self===window.top)history.pushState(null,'','/');}catch(e){}
resetSeoDefault();
}
function copyLink(){
navigator.clipboard&&navigator.clipboard.writeText('https://imageboostai.com/?tool='+encodeURIComponent(selected)).then(()=>showToast('✅ Link copied!'));
}
const CHIPS=[
{l:'🎭 Remove BG',k:'Remove Background'},
{l:'🏛️ Restore',k:'AI Photo Restore'},
{l:'💄 Retouch',k:'Face Retouch'},
{l:'📈 Upscale',k:'Image Upscaler'},
{l:'🧼 Watermark',k:'Watermark Remover'},
{l:'🔎 OCR',k:'Image to Text OCR'},
{l:'🎨 Colorize',k:'Colorize Old Photo'},
{l:'✨ Magic Erase',k:'Magic Eraser'},
{l:'👔 Headshot',k:'AI Headshot'},
{l:'🛍️ Product',k:'Product Photo Editor'},
];
function faqToggle(btn){
const item=btn.closest('.faq-item');
const isOpen=item.classList.contains('open');
document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
if(!isOpen){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
else{btn.setAttribute('aria-expanded','false');}
}
(function(){
const saved=localStorage.getItem('iba_theme');
const pref=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
const theme=saved||pref;
document.documentElement.setAttribute('data-theme',theme);
document.addEventListener('DOMContentLoaded',()=>{
const btn=document.getElementById('theme-btn');
if(btn)btn.textContent=theme==='dark'?'☀️':'🌙';
});
})();
function toggleTheme(){
const cur=document.documentElement.getAttribute('data-theme')||'light';
const next=cur==='dark'?'light':'dark';
document.documentElement.setAttribute('data-theme',next);
localStorage.setItem('iba_theme',next);
const btn=document.getElementById('theme-btn');
if(btn)btn.textContent=next==='dark'?'☀️':'🌙';
trackEvent('toggle_theme','UX',next);
}
function showToast(msg){
const t=document.getElementById('toast');
if(!t)return;
t.textContent=msg;t.style.display='block';
document.getElementById('aria-live').textContent=msg;
setTimeout(()=>{t.style.display='none';},2400);
}
window.addEventListener('scroll',()=>{
const b=document.getElementById('back-top');
if(!b)return;
b.classList.toggle('show',window.scrollY>400);
},{passive:true});
function iba_applyConsent(analytics,ads){
gtag('consent','update',{
'analytics_storage': analytics?'granted':'denied',
'ad_storage': ads?'granted':'denied',
'ad_user_data': ads?'granted':'denied',
'ad_personalization': ads?'granted':'denied'
});
if(analytics)loadAnalytics();
if(ads)loadAds();
localStorage.setItem('iba_consent',JSON.stringify({analytics:analytics,ads:ads,ts:Date.now()}));
const cb=document.getElementById('cookie-bar');if(cb)cb.style.display='none';
}
function acceptCookies(){
iba_applyConsent(true,true);
trackEvent('cookie_accept','Consent','accept_all');
}
function rejectCookies(){
iba_applyConsent(false,false);
}
function openConsentManager(){
const c=JSON.parse(localStorage.getItem('iba_consent')||'{}');
const a=document.getElementById('consent-analytics'),d=document.getElementById('consent-ads');
if(a)a.checked=!!c.analytics; if(d)d.checked=!!c.ads;
document.getElementById('consent-modal-overlay').style.display='flex';
document.body.style.overflow='hidden';
}
function closeConsentManager(){
document.getElementById('consent-modal-overlay').style.display='none';
document.body.style.overflow='';
}
function saveConsentPreferences(){
const analytics=document.getElementById('consent-analytics').checked;
const ads=document.getElementById('consent-ads').checked;
iba_applyConsent(analytics,ads);
closeConsentManager();
}
(function(){
const raw=localStorage.getItem('iba_consent');
if(raw){
try{
const c=JSON.parse(raw);
iba_applyConsent(!!c.analytics,!!c.ads);
}catch(e){}
}
})();
function toggleLangMenu(){
const ld=document.getElementById('ld');
const lb=document.getElementById('lb');
const open=ld.classList.toggle('open');
lb.setAttribute('aria-expanded',open);
}
document.addEventListener('click',e=>{
if(!e.target.closest('.lw')){
document.getElementById('ld')?.classList.remove('open');
document.getElementById('lb')?.setAttribute('aria-expanded','false');
}
});
function filterLangOptions(q){
q=(q||'').toLowerCase().trim();
document.querySelectorAll('#ld .lo').forEach(el=>{
el.style.display=el.textContent.toLowerCase().includes(q)||el.dataset.lang.includes(q)?'flex':'none';
});
}
const LANG_NAMES={en:'EN',tr:'TR',es:'ES',fr:'FR',de:'DE',pt:'PT',it:'IT',ru:'RU',ja:'JA',zh:'ZH',ko:'KO',ar:'AR',hi:'HI',bn:'BN',ur:'UR',fa:'FA',nl:'NL',pl:'PL',sv:'SV',id:'ID',vi:'VI',th:'TH',uk:'UA',no:'NO',da:'DA',fi:'FI',el:'EL',cs:'CS',sk:'SK',hu:'HU',ro:'RO',bg:'BG',hr:'HR',sr:'SR',sl:'SL',lt:'LT',lv:'LV',et:'ET',he:'HE',ms:'MS',tl:'TL',sw:'SW',af:'AF',am:'AM',az:'AZ',ka:'KA',hy:'HY',kk:'KK',uz:'UZ',mn:'MN',ne:'NE',si:'SI',ta:'TA',te:'TE',ml:'ML',kn:'KN',mr:'MR',gu:'GU',pa:'PA',ca:'CA',eu:'EU',ga:'GA',is:'IS',mt:'MT'};
function sl(lang){
if(!T[lang])lang='en';
LANG=lang;
localStorage.setItem('iba_lang',lang);
applyTranslations(lang);
document.querySelectorAll('.lo').forEach(o=>o.classList.toggle('act',o.dataset.lang===lang));
const codeEl=document.getElementById('lcode');
if(codeEl)codeEl.textContent=LANG_NAMES[lang]||lang.toUpperCase();
document.documentElement.lang=lang;
document.documentElement.dir=['ar','he','fa','ur'].includes(lang)?'rtl':'ltr';
document.getElementById('ld')?.classList.remove('open');
document.getElementById('lb')?.setAttribute('aria-expanded','false');
trackEvent('switch_lang','UX',lang);

}
function resetGoogleTranslate(){
try{
document.cookie='googtrans=/en/en;path=/';
document.cookie='googtrans=/en/en;domain='+location.hostname+';path=/';
document.cookie='googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
document.cookie='googtrans=;domain='+location.hostname+';path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
const apply=(triesLeft)=>{
const sel=document.querySelector('.goog-te-combo');
if(sel){sel.value='en';sel.dispatchEvent(new Event('change'));}
else if(triesLeft>0){setTimeout(()=>apply(triesLeft-1),200);}
};
apply(10);
}catch(e){}
}
function translateWholePage(lang){
const googleCode={zh:'zh-CN',no:'no',tl:'tl'}[lang]||lang;
try{
document.cookie='googtrans=/en/'+googleCode+';path=/';
document.cookie='googtrans=/en/'+googleCode+';domain='+location.hostname+';path=/';
const apply=(triesLeft)=>{
const sel=document.querySelector('.goog-te-combo');
if(sel){sel.value=googleCode;sel.dispatchEvent(new Event('change'));}
else if(triesLeft>0){setTimeout(()=>apply(triesLeft-1),200);}
};
apply(10); 
}catch(e){}
}
function applyDetectedLang(){sl(detectedLang);}
const T={
en:{hbadge:'35 Photo Tools · No Login · Local Editing',h1a:'Professional',h1b:'Photo Editing',hsub:'Remove backgrounds, restore old photos, retouch faces, upscale images and more. Free to use. No signup. Works in your browser.',hb1:'📤 Upload & Edit',hb2:'✨ Explore Tools',ht1:'Remove BG',ht2:'Restore Photo',ht3:'Face Retouch',ht4:'Upscaler',ht5:'Image to Text',s1:'AI Tools',s2:'Signups Needed',s3:'Languages',s4:'Browser-Based',s5:'Local Image Editing',cp_all:'🌟 All',cp_bg:'🎭 Background',cp_fix:'🏛️ Restore & Fix',cp_face:'💄 Face',cp_convert:'🔄 Convert',cp_design:'🎨 Design',ast:'Pro Coming Soon:',asd:'Batch processing, HD export, API access — join waitlist',asb:'Join Waitlist →',tools_small:'35 Photo Editing Tools',tools_h2:'Choose a Tool & Start Editing',tools_p:'Click any tool to open the editor.',ws_small:'Editor Workspace',ws_h2:'Select a Tool or Upload Your Photo',up_title:'Upload Your Photo',up_sub:'Click or drag an image here. JPG, PNG, WEBP supported.',res_title:'Ready to Edit',res_text:'Pick any tool, upload a photo, then click Apply.',apply_btn:'⚡ Apply Tool',reset_btn:'↻ Reset',dl_btn:'⬇ Download Result',ba_small:'Preview',ba_h2:'Before / After Workflow',ba_p:'Compare your original and edited photo side by side.',ba1:'Before',ba1s:'Upload your original photo above',ba2:'After',ba2s:'Apply a tool to see the result',nl_title:'💌 Get New Tools First',nl_sub:'New tools, tips, no spam.',nl_ph:'your@email.com',nl_btn:'Subscribe Free →',nl_note:'🔒 No spam. Unsubscribe with one click.',faq_h2:'Frequently Asked Questions',faq_p:'Everything you need to know about ImageBoostAI.',q1:'Is ImageBoostAI free?',a1:'Yes! All 35+ tools are 100% free. No subscription, no login, no hidden fees.',q2:'Are my photos stored on your servers?',a2:'Image editing runs locally. OCR and background tools download external libraries and models; see our Privacy Policy for network and cookie details.',q3:'Does it work on mobile?',a3:'The editor adapts to mobile screens. Large images and model downloads may exceed a phone’s available memory; use smaller files if processing fails.',q4:'Do I need an account?',a4:'No account, email or credit card is ever required.',q5:'Is this real AI, or filters?',a5:"Most tools use fast, browser-based image-processing algorithms (color mapping, edge detection, blur-fill) rather than deep-learning AI models. Tools labeled AI in the name reflect the category, not a neural network \u2014 each tool's description states exactly how it works. A real AI model can be connected via API for production use.",q6:'What image formats are supported?',a6:'JPG, PNG, WEBP and HEIC are fully supported. GIFs can be uploaded but only the first frame is edited — animation is not preserved. Max file size is 25MB, max resolution is 40 megapixels.',ft_desc:'35+ free AI photo editing tools. No login required.',ft_bg:'Background Tools',ft_fix:'Restore & Fix',ft_face:'Face & Design',ft_co:'Company',ft_priv:'🔒 Privacy Policy',ft_terms:'📋 Terms',ft_contact:'✉️ Contact',ft_sitemap:'🗺️ Sitemap',ft_home:'🏠 Home',ft_seo:'Free AI photo editor: remove background, restore old photos, retouch faces, upscale images and more.',ft_copy:'© 2026 ImageBoostAI · Browser photo tools',nav_tools:'AI Tools',nav_editor:'Editor',nav_pro:'✨ Get Pro',db_text:'Pro Features Coming Soon! Join waitlist →',db_link:'Learn More'},
tr:{hbadge:'35+ Ücretsiz AI Fotoğraf Aracı · Giriş Yok · Anında Sonuç',h1a:'Profesyonel',h1b:'AI Fotoğraf Düzenleme',hsub:'Arka plan kaldır, eski fotoğrafları restore et, yüzleri rötuşla, görselleri büyüt. Tamamen ücretsiz. Kayıt yok. Tarayıcında çalışır.',hb1:'📤 Yükle & Düzenle',hb2:'✨ Araçları Keşfet',ht1:'Arka Plan Kaldır',ht2:'Fotoğraf Restore',ht3:'Yüz Rötuşu',ht4:'Upscaler',ht5:'Görüntüden Metin',s1:'AI Aracı',s2:'Kayıt Gerekmiyor',s3:'Ülke',s4:'Tarayıcı Tabanlı',s5:'Sıfır Veri Depolama',cp_all:'🌟 Tümü',cp_bg:'🎭 Arka Plan',cp_fix:'🏛️ Restore & Düzelt',cp_face:'💄 Yüz',cp_convert:'🔄 Dönüştür',cp_design:'🎨 Tasarım',ast:'Pro Yakında:',asd:'Toplu işlem, HD çıktı, API erişimi — bekleme listesine katıl',asb:'Listeye Katıl →',tools_small:'35 AI Fotoğraf Aracı',tools_h2:'Bir Araç Seç ve Düzenlemeye Başla',tools_p:'Editörü açmak için herhangi bir araca tıkla.',ws_small:'Düzenleyici Alanı',ws_h2:'Bir Araç Seç veya Fotoğrafını Yükle',up_title:'Fotoğrafını Yükle',up_sub:'Buraya tıkla veya bir görüntü sürükle. JPG, PNG, WEBP desteklenir.',res_title:'Düzenlemeye Hazır',res_text:'Bir araç seç, fotoğraf yükle, sonra Uygula\'ya tıkla.',apply_btn:'⚡ Aracı Uygula',reset_btn:'↻ Sıfırla',dl_btn:'⬇ Sonucu İndir',ba_small:'Önizleme',ba_h2:'Önce / Sonra',ba_p:'Orijinal ve düzenlenmiş fotoğrafı yan yana karşılaştır.',ba1:'Önce',ba1s:'Yukarıya orijinal fotoğrafını yükle',ba2:'Sonra',ba2s:'Sonucu görmek için araç uygula',nl_title:'💌 Yeni Araçları İlk Al',nl_sub:'Yeni araçlar, ipuçları, spam yok.',nl_ph:'e-posta@adresin.com',nl_btn:'Ücretsiz Abone Ol →',nl_note:'🔒 Spam yok. İstediğin zaman abonelikten çık.',faq_h2:'Sık Sorulan Sorular',faq_p:'ImageBoostAI hakkında bilmeniz gereken her şey.',q1:'ImageBoostAI gerçekten ücretsiz mi?',a1:'Evet! Tüm 35+ araç %100 ücretsizdir. Abonelik, giriş veya gizli ücret yok.',q2:'Fotoğraflarım sunucularınızda saklanıyor mu?',a2:'Hayır. Tüm işlemler tarayıcınızda gerçekleşir. Fotoğraflar asla cihazınızı terk etmez.',q3:'Mobilde çalışıyor mu?',a3:'Evet, iOS, Android, tablet ve masaüstü tarayıcılarda tam olarak çalışır.',q4:'Hesap gerekiyor mu?',a4:'Hesap, e-posta veya kredi kartı asla gerekmiyor.',q5:'AI arka plan kaldırma nasıl çalışır?',a5:'Tam ön yüz akışı: yükle, önizle, uygula ve indir. Gerçek AI için API bağlanabilir.',q6:'Hangi görüntü formatları destekleniyor?',a6:'JPG, PNG, WEBP ve HEIC tam destekli. GIF yüklenebilir ama sadece ilk kare düzenlenir — animasyon korunmaz. Maksimum dosya boyutu 25MB, maksimum çözünürlük 40 megapikseldir.',ft_desc:'35+ ücretsiz AI fotoğraf düzenleme aracı. Giriş gerekmez.',ft_bg:'Arka Plan Araçları',ft_fix:'Restore ve Düzelt',ft_face:'Yüz ve Tasarım',ft_co:'Şirket',ft_priv:'🔒 Gizlilik Politikası',ft_terms:'📋 Kullanım Şartları',ft_contact:'✉️ İletişim',ft_sitemap:'🗺️ Site Haritası',ft_home:'🏠 Ana Sayfa',ft_seo:'Ücretsiz AI fotoğraf editörü: arka plan kaldır, eski fotoğrafları restore et, yüzleri rötuşla.',ft_copy:'© 2026 ImageBoostAI · Veri depolanmaz',nav_tools:'AI Araçlar',nav_editor:'Editör',nav_pro:'✨ Pro Al'},
es:{hbadge:'35+ Herramientas IA Gratis · Sin Login · Resultados Instantáneos',h1a:'Edición Fotográfica',h1b:'Profesional con IA',hsub:'Elimina fondos, restaura fotos antiguas, retoca caras, mejora imágenes y más. Gratis. Sin registro. Funciona en tu navegador.',hb1:'📤 Subir y Editar',hb2:'✨ Explorar Herramientas',ht1:'Quitar Fondo',ht2:'Restaurar Foto',ht3:'Retocar Cara',ht4:'Upscaler',ht5:'Imagen a Texto',s1:'Herramientas IA',s2:'Registros',s3:'Países',s4:'En Navegador',s5:'Cero Datos',cp_all:'🌟 Todas',cp_bg:'🎭 Fondo',cp_fix:'🏛️ Restaurar',cp_face:'💄 Cara',cp_convert:'🔄 Convertir',cp_design:'🎨 Diseño',ast:'Pro Próximamente:',asd:'Procesamiento batch, HD, API — únete a la lista de espera',asb:'Unirse →',tools_small:'35 Herramientas IA',tools_h2:'Elige una Herramienta y Empieza',tools_p:'Haz clic en cualquier herramienta para abrir el editor.',ws_small:'Editor',ws_h2:'Selecciona una Herramienta o Sube tu Foto',up_title:'Sube tu Foto',up_sub:'Clic o arrastra una imagen. JPG, PNG, WEBP admitidos.',res_title:'Listo para Editar',res_text:'Elige una herramienta, sube una foto y haz clic en Aplicar.',apply_btn:'⚡ Aplicar',reset_btn:'↻ Reiniciar',dl_btn:'⬇ Descargar',faq_h2:'Preguntas Frecuentes',faq_p:'Todo sobre ImageBoostAI.',q1:'¿Es gratis?',a1:'Sí. Todas las herramientas son 100% gratis.',q2:'¿Se almacenan mis fotos?',a2:'No. Todo en tu navegador. Tus fotos nunca abandonan tu dispositivo.',q3:'¿Funciona en móvil?',a3:'Sí, totalmente responsive para iOS, Android y escritorio.',q4:'¿Necesito cuenta?',a4:'No se requiere cuenta, email ni tarjeta.',q5:'¿Cómo funciona la IA?',a5:'Flujo completo: sube, previsualiza, aplica y descarga.',q6:'¿Qué formatos?',a6:'JPG, PNG, WEBP, HEIC y GIF.',ft_copy:'© 2026 ImageBoostAI · Sin datos almacenados'},
fr:{hbadge:'35+ Outils IA Gratuits · Sans Connexion · Résultats Instantanés',h1a:'Retouche Photo',h1b:'Professionnelle avec IA',hsub:"Supprimez les arrière-plans, restaurez des vieilles photos, retouchez les visages. Gratuit. Sans inscription. Dans votre navigateur.",hb1:'📤 Téléverser et Éditer',hb2:'✨ Explorer les Outils',q1:'Est-ce gratuit?',a1:'Oui! Tous les outils sont 100% gratuits.'},
de:{hbadge:'35+ Kostenlose KI-Fototools · Kein Login · Sofortige Ergebnisse',h1a:'Professionelle',h1b:'KI-Fotobearbeitung',hsub:'Hintergrunde entfernen, alte Fotos restaurieren, Gesichter retuschieren. Kostenlos. Ohne Anmeldung. Im Browser.',hb1:'📤 Hochladen & Bearbeiten',hb2:'✨ Tools Entdecken',q1:'Ist es kostenlos?',a1:'Ja! Alle Tools sind 100% kostenlos.'},
it:{hbadge:'35+ Strumenti IA Gratuiti · Nessun Login · Risultati Istantanei',h1a:'Modifica Foto',h1b:'come un Professionista con IA',hsub:'Rimuovi sfondi, restaura vecchie foto, ritocca i visi, aumenta la risoluzione. Gratis. Senza registrazione.',hb1:'📤 Carica e Modifica',hb2:'✨ Esplora i Tool',q1:'È gratuito?',a1:'Sì! Tutti i 35+ tool sono 100% gratuiti.'},
ru:{hbadge:'35+ Бесплатных ИИ Инструментов · Без Входа · Мгновенные Результаты',h1a:'Редактируйте Фото',h1b:'как Профессионал с ИИ',hsub:'Удалите фон, восстановите старые фото, улучшите лица, увеличьте разрешение. Бесплатно. Без регистрации.',hb1:'📤 Загрузить и Редактировать',hb2:'✨ Обзор Инструментов',q1:'Это бесплатно?',a1:'Да! Все 35+ инструментов на 100% бесплатны.'},
ja:{hbadge:'35以上の無料AIフォトツール · ログイン不要 · 即座に結果',h1a:'プロのような',h1b:'AI写真編集',hsub:'背景除去、古い写真の復元、顔のレタッチ、画像の高解像度化。無料。登録不要。',hb1:'📤 アップロードして編集',hb2:'✨ ツールを見る',q1:'無料ですか？',a1:'はい！35以上のツールがすべて100%無料です。'},
zh:{hbadge:'35+免费AI图片工具 · 无需登录 · 即时结果',h1a:'像专业人士一样',h1b:'AI图像编辑',hsub:'一键去除背景，修复旧照片，美颜，提高分辨率。免费。无需注册。',hb1:'📤 上传并编辑',hb2:'✨ 浏览工具',q1:'是免费的吗？',a1:'是的！35+个工具全部100%免费。'},
ko:{hbadge:'35개 무료 AI 사진 도구 · 로그인 불필요 · 즉각적인 결과',h1a:'전문가처럼',h1b:'AI 사진 편집',hsub:'배경 제거, 오래된 사진 복원, 얼굴 보정, 해상도 향상. 무료. 회원가입 불필요.',hb1:'📤 업로드 및 편집',hb2:'✨ 도구 탐색',q1:'무료인가요?',a1:'네! 35개 이상의 도구가 모두 100% 무료입니다.'},
ar:{hbadge:'35+ أداة AI مجانية · بدون تسجيل · نتائج فورية',h1a:'تحرير الصور',h1b:'باحتراف مع الذكاء الاصطناعي',hsub:'إزالة الخلفيات، استعادة الصور القديمة، تنعيم الوجه، تكبير الصور. مجاناً. بدون تسجيل.',hb1:'📤 رفع وتحرير',hb2:'✨ استكشاف الأدوات',q1:'هل هو مجاني؟',a1:'نعم! جميع الأدوات 35+ مجانية 100%.'}
};
for(const lang of Object.keys(T))Object.assign(T[lang],{hbadge:'35 photo tools · No account required',h1b:'Photo Editing',tools_small:'35 photo editing tools',s1:'Photo tools',s5:'Local editing',a5:'Most tools use deterministic pixel processing. Background isolation uses a downloaded segmentation model with an edge-color fallback. OCR uses Tesseract. Generative image creation and detail reconstruction are not provided; each guide explains its method.',a6:'JPG, PNG, WebP, BMP and GIF first frames are accepted. HEIC conversion requires an external decoder and may fail for unsupported variants. Input limit: 25 MB and 40 megapixels. Download formats depend on the tool.',ft_copy:'© 2026 ImageBoostAI · Browser photo tools'});
function applyTranslations(lang){
const d=T[lang]||T.en;
document.querySelectorAll('#ld .lo').forEach(el=>{if(!T[el.dataset.lang])el.hidden=true;});
document.querySelectorAll('[data-i]').forEach(el=>{
const v=d[el.getAttribute('data-i')];
if(v!==undefined)el.textContent=v;
});
document.querySelectorAll('[data-i-ph]').forEach(el=>{
const v=d[el.getAttribute('data-i-ph')];
if(v)el.placeholder=v;
});
}
const COUNTRY_LANG={
US:'en',GB:'en',CA:'en',AU:'en',NZ:'en',IE:'en',TR:'tr',AZ:'az',DE:'de',AT:'de',CH:'de',FR:'fr',BE:'fr',ES:'es',MX:'es',AR:'es',CO:'es',PE:'es',CL:'es',BR:'pt',PT:'pt',IT:'it',RU:'ru',UA:'uk',JP:'ja',CN:'zh',TW:'zh',HK:'zh',KR:'ko',SA:'ar',AE:'ar',EG:'ar',MA:'ar',IL:'he',IR:'fa',PK:'ur',IN:'hi',BD:'bn',NL:'nl',PL:'pl',SE:'sv',ID:'id',TH:'th',VN:'vi',NO:'no',DK:'da',FI:'fi',GR:'el',CZ:'cs',SK:'sk',HU:'hu',RO:'ro',BG:'bg',HR:'hr',RS:'sr',SI:'sl',LT:'lt',LV:'lv',EE:'et',MY:'ms',PH:'tl',KE:'sw',ZA:'af',ET:'am',GE:'ka',AM:'hy',KZ:'kk',UZ:'uz',MN:'mn',NP:'ne',LK:'si',MT:'mt',IS:'is'
};
const LANG_NATIVE={tr:'Türkçe',es:'Español',fr:'Français',de:'Deutsch',pt:'Português',it:'Italiano',ru:'Русский',ja:'日本語',zh:'中文',ko:'한국어',ar:'العربية',hi:'हिन्दी',bn:'বাংলা',ur:'اردو',fa:'فارسی',nl:'Nederlands',pl:'Polski',sv:'Svenska',id:'Indonesia',vi:'Tiếng Việt',th:'ไทย',uk:'Українська',no:'Norsk',da:'Dansk',fi:'Suomi',el:'Ελληνικά',cs:'Čeština',sk:'Slovenčina',hu:'Magyar',ro:'Română',bg:'Български',hr:'Hrvatski',sr:'Srpski',sl:'Slovenščina',lt:'Lietuvių',lv:'Latviešu',et:'Eesti',he:'עברית',ms:'Melayu',tl:'Filipino',sw:'Kiswahili',af:'Afrikaans',am:'አማርኛ',az:'Azərbaycanca',ka:'ქართული',hy:'Հայերեն',kk:'Қазақша',uz:'O‘zbek',mn:'Монгол',ne:'नेपाली',si:'සිංහල',ta:'தமிழ்',te:'తెలుగు',ml:'മലയാളം',kn:'ಕನ್ನಡ',mr:'मराठी',gu:'ગુજરાતી',pa:'ਪੰਜਾਬੀ',ca:'Català',eu:'Euskara',ga:'Gaeilge',is:'Íslenska',mt:'Malti'};
(async function detectLang(){
try{
const urlLang=new URLSearchParams(window.location.search).get('lang');
if(urlLang && LANG_NAMES[urlLang]){sl(urlLang);return;}
}catch(e){}
const saved=localStorage.getItem('iba_lang');
if(saved){sl(saved);return;}
function normalizeLang(x){
if(!x)return '';
x=x.toLowerCase();
if(x.startsWith('zh'))return 'zh';
if(x.startsWith('pt'))return 'pt';
if(x.startsWith('nb')||x.startsWith('nn'))return 'no';
return x.split('-')[0];
}
let autoLang=normalizeLang((navigator.languages&&navigator.languages[0])||navigator.language||'');
if(!LANG_NAMES[autoLang])autoLang='';
if(autoLang && autoLang!=='en'){
sl(autoLang);
}else{
sl('en');
}
})();
const MODAL_CONTENT={
privacy:{
title:'🔒 Privacy Policy',
body:`<p><strong>Last updated: July 15, 2026</strong></p>
<h3>1. Your Photos Stay Private</h3>
<p>ImageBoostAI processes all images entirely within your browser using client-side JavaScript. Your photo <strong>content</strong> is never uploaded to our servers, never stored, and never shared with any third party.</p>
<h3>2. Data We Collect</h3>
<p>If you accept analytics cookies, we collect anonymous usage data (page views, tool usage counts) via Google Analytics 4 and Microsoft Clarity — no personally identifiable information is collected. We use localStorage to remember your theme, language, and cookie preferences. Standard web server logs (IP address, browser type, pages requested) are generated automatically by our hosting provider for security and reliability.</p>
<h3>3. Advertising</h3>
<p>We display Google AdSense advertisements to keep the service free. If you accept advertising cookies, Google and its advertising partners may use cookies, web beacons, and your IP address to serve and measure ads, including personalized ads. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">google.com/settings/ads</a>, and learn more about how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>
<h3>4. Cookies &amp; Your Choices</h3>
<p>Necessary cookies (theme, language, cookie preference) are always on. Analytics (GA4, Clarity) and Advertising (AdSense) cookies only run if you allow them via our cookie banner — you can Accept all, Reject non-essential, or choose individually under "Manage preferences" at any time.</p>
<h3>5. Third-Party Libraries (technical, not your photo content)</h3>
<p>Some tools load additional code from third-party CDNs only when that specific tool is used — for example Tesseract.js (jsdelivr.net) for the OCR tool, and heic2any (cdnjs.cloudflare.com) for HEIC photo conversion. Loading these scripts sends your IP address and browser information to those CDN providers, the same way loading any web resource does — it does not send your photo content anywhere, since all image processing still happens locally in your browser.</p>
<h3>6. GDPR / KVKK</h3>
<p>We do not collect personal data through the editor itself. Where GA4/Clarity/AdSense are used with your consent, those providers may process data as described above and in their own privacy policies. For any privacy requests, contact us using the contact form above.</p>
<h3>7. Changes</h3>
<p>We may update this policy. Continued use constitutes acceptance of updates.</p>`
},
terms:{
title:'📋 Terms of Service',
body:`<p><strong>Last updated: July 1, 2025</strong></p>
<h3>1. Acceptance</h3>
<p>By using ImageBoostAI, you agree to these Terms. If you do not agree, please do not use the service.</p>
<h3>2. Free Service</h3>
<p>ImageBoostAI provides all tools free of charge, supported by non-intrusive advertising. We may modify or discontinue services at any time.</p>
<h3>3. Permitted Use</h3>
<p>You may use ImageBoostAI for personal and commercial purposes. You may not:</p>
<ul><li>Automate or scrape the service</li><li>Upload illegal, harmful, or infringing content</li><li>Attempt to bypass ad delivery</li><li>Reverse-engineer or copy the service</li></ul>
<h3>4. Intellectual Property</h3>
<p>ImageBoostAI brand, design, and code are © 2026 ImageBoostAI. You retain all rights to photos you upload and edit.</p>
<h3>5. No Warranty</h3>
<p>The service is provided "as is". We are not liable for any data loss, errors, or damages from use of the service.</p>
<h3>6. Advertising</h3>
<p>The service is supported by Google AdSense. You agree that advertisements may be shown during your use of the service.</p>
<h3>7. Governing Law</h3>
<p>These terms are governed by applicable law in the jurisdiction of operation.</p>`
},
contact:{
title:'✉️ Get in Touch',
body:`<p style="margin-bottom:18px;">Got a complaint, a suggestion, or just something nice to say? Pick a reason below and send us a message — we read every single one.</p>
<div class="cf-form">
  <label>What's this about?</label>
  <div class="cf-subject-grid" role="group" aria-label="Message subject">
    <button type="button" class="cf-subject-card" data-subject="Complaint" onclick="selectCfSubject(this)"><span class="csc-icon">😕</span>Complaint</button>
    <button type="button" class="cf-subject-card" data-subject="Suggestion" onclick="selectCfSubject(this)"><span class="csc-icon">💡</span>Suggestion</button>
    <button type="button" class="cf-subject-card" data-subject="Compliment" onclick="selectCfSubject(this)"><span class="csc-icon">❤️</span>Compliment</button>
  </div>
  <input type="hidden" id="cf-subject" value="">
  <label>Your name</label>
  <input type="text" id="cf-name" placeholder="Jane Doe" autocomplete="name" aria-label="Your name">
  <label>Your email <span style="font-weight:400;color:var(--muted);">(so we can reply)</span></label>
  <input type="email" id="cf-email" placeholder="you@example.com" autocomplete="email" aria-label="Your email">
  <label>Your message</label>
  <textarea id="cf-msg" placeholder="Tell us what's on your mind..." aria-label="Your message"></textarea>
  <button class="btn-primary" onclick="submitContact()" style="width:100%;padding:13px;">Send message →</button>
  <div class="cf-trust-note">🔒 Your message goes straight to our inbox for review. We don't display or share your email with anyone, and we never store it beyond replying to you.</div>
</div>`
}
};
function openModal(key){
if(['privacy','terms','contact'].includes(key)){location.href='/'+key+'.html';return;}
const c=MODAL_CONTENT[key];if(!c)return;
document.getElementById('modal-title').textContent=c.title;
document.getElementById('modal-body').innerHTML=c.body;
document.getElementById('modal-overlay').classList.add('open');
document.body.style.overflow='hidden';
trackEvent('open_modal','Navigation',key);
}
function closeModal(){
document.getElementById('modal-overlay').classList.remove('open');
document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
// ══ ONE-TIME SETUP (takes ~20 seconds, do this once) ══
// Contact form sends silently in the background (like Amazon/eBay) — the visitor's
// email is NEVER shown, no email app opens, message lands straight in your inbox.
// 1. Go to https://web3forms.com
// 2. Enter hynngozeten@gmail.com and click "Create Access Key"
// 3. The key arrives in that inbox within seconds (not a link to click — just the key)
// 4. Paste it below, replacing the placeholder
const IBA_WEB3FORMS_KEY='YOUR_WEB3FORMS_ACCESS_KEY_HERE';
const IBA_CONTACT_EMAIL='hynngozeten@gmail.com';
function selectCfSubject(btn){
document.querySelectorAll('.cf-subject-card').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
const inp=document.getElementById('cf-subject');
if(inp)inp.value=btn.dataset.subject;
}
function submitContact(){
const name=document.getElementById('cf-name')?.value.trim();
const email=document.getElementById('cf-email')?.value.trim();
const subject=document.getElementById('cf-subject')?.value.trim();
const msg=document.getElementById('cf-msg')?.value.trim();
if(!name||!email||!msg){showToast('\u26a0\ufe0f Please fill in all fields.');return;}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast('\u26a0\ufe0f Please enter a valid email.');return;}
if(!IBA_WEB3FORMS_KEY||IBA_WEB3FORMS_KEY==='YOUR_WEB3FORMS_ACCESS_KEY_HERE'){
showToast('\u26a0\ufe0f Contact form not set up yet \u2014 see setup note in the code.');
return;
}
const subjLabel=subject||'General';
const btn=document.querySelector('.cf-form .btn-primary');
const originalBtnText=btn?btn.textContent:'Send message \u2192';
if(btn){btn.disabled=true;btn.textContent='Sending\u2026';}
fetch('https://api.web3forms.com/submit',{
method:'POST',
headers:{'Content-Type':'application/json','Accept':'application/json'},
body:JSON.stringify({
access_key:IBA_WEB3FORMS_KEY,
name:name,
email:email,
subject:'ImageBoostAI Contact ('+subjLabel+') from '+name,
message:msg,
from_name:'ImageBoostAI Contact Form',
replyto:email
})
}).then(r=>r.json().then(data=>({ok:r.ok,data:data}))).then(res=>{
if(!res.ok||!res.data||res.data.success===false)throw new Error('bad status');
trackEvent('contact_submit','Engagement','contact_form');
const body=document.getElementById('modal-body');
if(body){
body.innerHTML='<div style="text-align:center;padding:24px 8px;">'
+'<div style="font-size:48px;margin-bottom:14px;">\u2705</div>'
+'<h3 style="font-size:19px;font-weight:900;color:var(--text);margin-bottom:8px;">Thank you!</h3>'
+'<p style="color:var(--muted);font-size:14px;line-height:1.65;max-width:340px;margin:0 auto 22px;">Your message has been sent successfully. We will get back to you soon at the email address you provided.</p>'
+'<button class="btn-primary" onclick="closeModal()" style="padding:11px 28px;">Close</button>'
+'</div>';
}
}).catch(()=>{
showToast('\u26a0\ufe0f Could not send right now \u2014 please try again in a moment.');
if(btn){btn.disabled=false;btn.textContent=originalBtnText;}
});
}

if('scrollRestoration' in history){ history.scrollRestoration='manual'; }
document.addEventListener('DOMContentLoaded',()=>{
try{
const p=new URLSearchParams(window.location.search);
const t=p.get('tool');
if(t){
setTimeout(()=>{
openTool(t);
const ws=document.getElementById('workspace');
if(ws)ws.scrollIntoView({behavior:'instant'});
},300);
}else{
window.scrollTo(0,0);
}
}catch(e){}
});
document.addEventListener('DOMContentLoaded',()=>{
const saved=localStorage.getItem('iba_lang');
if(saved)applyTranslations(saved);
});
function finishWithProgress(callback){
var p=document.getElementById('progress'),b=document.getElementById('bar');
if(p)p.style.display='block';if(b)b.style.width='0';
var v=0;var t=setInterval(function(){
v+=25;if(b)b.style.width=v+'%';
if(v>=100){clearInterval(t);if(callback)callback();else finishApply();}
},80);
}
function withImage(fn){
if(!imageData){showToast('⚠️ Upload an image first');var f=document.getElementById('file');if(f)f.click();return;}
var img=new Image();
img.onload=function(){fn(img);};
img.onerror=function(){showToast('⚠️ Could not load image. Try uploading again.');};
img.src=imageData;
}
function pixelOp(fn){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
try{
var d=ctx.getImageData(0,0,c.width,c.height),px=d.data;
fn(px,c.width,c.height);
ctx.putImageData(d,0,0);
imageData=c.toDataURL('image/png');
}catch(e){
imageData=c.toDataURL('image/png');
showToast('Applied (basic mode)');
}
finishWithProgress();
});
}

function runBgRemove(){
if(!imageData){
showToast('Please upload a photo first');
var f=document.getElementById('file');if(f)f.click();
return;
}
var p=document.getElementById('progress'),b=document.getElementById('bar');
if(p)p.style.display='block';
if(b){b.style.width='0%';b.style.transition='width 0.3s';}
var rt=document.getElementById('resultTitle');
var rx=document.getElementById('resultText');
if(rt)rt.textContent='Removing background...';
if(rx)rx.textContent='Processing your photo. Please wait.';
var img=new Image();
img.onload=function(){
if(b)b.style.width='30%';
try{
var c=document.createElement('canvas');
c.width=img.naturalWidth||img.width||400;
c.height=img.naturalHeight||img.height||400;
var ctx=c.getContext('2d');
ctx.drawImage(img,0,0,c.width,c.height);
if(b)b.style.width='50%';
var imgd=ctx.getImageData(0,0,c.width,c.height);
var px=imgd.data;
if(b)b.style.width='60%';
var br=0,bg=0,bb=0,count=0;
var W=c.width,H=c.height;
for(var x=0;x<W;x++){var i=x*4;br+=px[i];bg+=px[i+1];bb+=px[i+2];count++;}
for(var x=0;x<W;x++){var i=((H-1)*W+x)*4;br+=px[i];bg+=px[i+1];bb+=px[i+2];count++;}
for(var y=1;y<H-1;y++){var i=(y*W)*4;br+=px[i];bg+=px[i+1];bb+=px[i+2];count++;}
for(var y=1;y<H-1;y++){var i=(y*W+W-1)*4;br+=px[i];bg+=px[i+1];bb+=px[i+2];count++;}
br=Math.round(br/count);bg=Math.round(bg/count);bb=Math.round(bb/count);
if(b)b.style.width='70%';
var thresh=70;
for(var i=0;i<px.length;i+=4){
var dr=Math.abs(px[i]-br);
var dg=Math.abs(px[i+1]-bg);
var db=Math.abs(px[i+2]-bb);
var dist=dr+dg+db;
if(dist<thresh*3){
px[i+3]=Math.round(px[i+3]*(dist/(thresh*3)));
}
}
if(b)b.style.width='90%';
ctx.putImageData(imgd,0,0);
imageData=c.toDataURL('image/png');
if(b)b.style.width='100%';
setTimeout(function(){finishApply();},80);
}catch(err){
console.warn('BG remove error:',err.message);
if(b)b.style.width='100%';
if(rt)rt.textContent='Background removed (preview mode)';
if(rx)rx.textContent='Download the result to see full transparency.';
setTimeout(function(){finishApply();},80);
}
};
img.onerror=function(){
showToast('Could not load image. Try uploading again.');
if(p)p.style.display='none';
};
img.src=imageData;
}
function showBgChanger(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Background Changer';
if(!rx)return;
var bgs=[
{l:'White Studio',v:'#ffffff',tc:'#333'},
{l:'Light Gray',v:'#f0f0f0',tc:'#333'},
{l:'Dark Gray',v:'#555555',tc:'#fff'},
{l:'Black',v:'#000000',tc:'#fff'},
{l:'Sky Blue',v:'#87CEEB',tc:'#fff'},
{l:'Forest Green',v:'#228B22',tc:'#fff'},
{l:'Purple',v:'gp',tc:'#fff'},
{l:'Sunset',v:'gs',tc:'#fff'},
{l:'Ocean',v:'go',tc:'#fff'},
{l:'Mint',v:'gm',tc:'#fff'},
];
var gradients={
gp:['#667EEA','#764BA2'],gs:['#F093FB','#F5576C'],
go:['#4FACFE','#00F2FE'],gm:['#11998e','#38ef7d']
};
var desc=document.createElement('p');
desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';
desc.textContent='Select a new background:';
var grid=document.createElement('div');
grid.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:10px;';
bgs.forEach(function(bg){
var g=gradients[bg.v];
var bgStyle=g?('linear-gradient(135deg,'+g[0]+','+g[1]+')'):bg.v;
var btn=document.createElement('button');
btn.textContent=bg.l;
btn.style.cssText='height:44px;border-radius:8px;border:2px solid rgba(255,255,255,.2);cursor:pointer;font-size:10.5px;font-weight:700;color:'+bg.tc+';transition:transform .2s;background:'+bgStyle+';font-family:inherit;';
btn.onmouseover=function(){this.style.transform='scale(1.08)';};
btn.onmouseout=function(){this.style.transform='scale(1)';};
btn.onclick=function(){applyBgChange(bg.v,gradients[bg.v]||null);};
grid.appendChild(btn);
});
var tip=document.createElement('p');
tip.style.cssText='font-size:11px;color:var(--muted);';
tip.textContent='Tip: Use Remove Background first for best results.';
rx.innerHTML='';rx.appendChild(desc);rx.appendChild(grid);rx.appendChild(tip);
}
function applyBgChange(color,gradient){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
if(gradient){
var grd=ctx.createLinearGradient(0,0,c.width,c.height);
grd.addColorStop(0,gradient[0]);grd.addColorStop(1,gradient[1]);
ctx.fillStyle=grd;
}else{ctx.fillStyle=color;}
ctx.fillRect(0,0,c.width,c.height);
ctx.drawImage(img,0,0);
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function showTextOverlay(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Add Text to Photo';
if(!rx)return;
function mk(tag,style,inner){var el=document.createElement(tag);if(style)el.style.cssText=style;if(inner)el.innerHTML=inner;return el;}
function mkLbl(t){return mk('label','font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;',t);}
function mkSel(id,opts){
var s=mk('select','width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;margin-bottom:8px;');
s.id=id;
opts.forEach(function(o){var op=mk('option');op.value=o.v;op.textContent=o.l;if(o.sel)op.selected=true;s.appendChild(op);});
return s;
}
var textIn=mk('input','width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;margin-bottom:8px;');
textIn.type='text';textIn.id='txt-input';textIn.value='Your Text';
var colorLbl=mkLbl('Text Color');
var colorIn=mk('input','width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;margin-bottom:8px;padding:2px;');
colorIn.type='color';colorIn.id='txt-color';colorIn.value='#ffffff';
var sizeSel=mkSel('txt-size',[{v:'20',l:'Small'},{v:'36',l:'Medium',sel:true},{v:'52',l:'Large'},{v:'72',l:'Extra Large'},{v:'100',l:'Huge'}]);
var posSel=mkSel('txt-pos',[{v:'top',l:'Top'},{v:'center',l:'Center',sel:true},{v:'bottom',l:'Bottom'}]);
var fontSel=mkSel('txt-font',[{v:'Arial',l:'Arial',sel:true},{v:'Georgia',l:'Georgia'},{v:'Impact',l:'Impact Bold'},{v:'Courier New',l:'Courier'},{v:'Times New Roman',l:'Times'}]);
var row=mk('div','display:grid;grid-template-columns:1fr 1fr;gap:8px;');
var d1=mk('div');d1.appendChild(mkLbl('Size'));d1.appendChild(sizeSel);
var d2=mk('div');d2.appendChild(mkLbl('Position'));d2.appendChild(posSel);
var d3=mk('div');d3.appendChild(mkLbl('Font'));d3.appendChild(fontSel);
row.appendChild(d1);row.appendChild(d2);
var applyBtn=mk('button','width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:6px;','Add Text to Photo');
applyBtn.onclick=applyTextToPhoto;
rx.innerHTML='';
rx.appendChild(mkLbl('Your Text'));rx.appendChild(textIn);
rx.appendChild(colorLbl);rx.appendChild(colorIn);
rx.appendChild(row);rx.appendChild(d3);rx.appendChild(applyBtn);
}
function applyTextToPhoto(){
if(!imageData){showToast('Please upload an image first');return;}
var text=document.getElementById('txt-input')&&document.getElementById('txt-input').value||'Your Text';
var color=document.getElementById('txt-color')&&document.getElementById('txt-color').value||'#ffffff';
var size=parseInt(document.getElementById('txt-size')&&document.getElementById('txt-size').value||36);
var pos=document.getElementById('txt-pos')&&document.getElementById('txt-pos').value||'center';
var font=document.getElementById('txt-font')&&document.getElementById('txt-font').value||'Arial';
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
ctx.font='bold '+size+'px "'+font+'"';
ctx.textAlign='center';ctx.textBaseline='middle';
var y=pos==='top'?size*1.2:pos==='bottom'?img.height-size*1.2:img.height/2;
var x=img.width/2;
ctx.shadowColor='rgba(0,0,0,0.7)';ctx.shadowBlur=size/5;ctx.shadowOffsetX=2;ctx.shadowOffsetY=2;
ctx.fillStyle=color;ctx.fillText(text,x,y);
ctx.shadowColor='transparent';
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function showCropTool(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Crop Image';
if(!rx)return;
var ratios=[{l:'1:1 Square',w:1,h:1},{l:'16:9 Widescreen',w:16,h:9},{l:'4:3 Classic',w:4,h:3},{l:'9:16 Portrait',w:9,h:16},{l:'3:2 Photo',w:3,h:2},{l:'2:3 Portrait',w:2,h:3},{l:'Original',w:0,h:0}];
var desc=document.createElement('p');
desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';
desc.textContent='Select crop aspect ratio:';
var grid=document.createElement('div');
grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;';
ratios.forEach(function(r){
var btn=document.createElement('button');
btn.textContent=r.l;
btn.style.cssText='padding:11px 6px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;transition:all .2s;';
btn.onmouseover=function(){this.style.borderColor='var(--accent)';this.style.background='var(--surface)';};
btn.onmouseout=function(){this.style.borderColor='var(--border)';this.style.background='var(--bg3)';};
btn.onclick=function(){applyCrop(r.w,r.h);};
grid.appendChild(btn);
});
rx.innerHTML='';rx.appendChild(desc);rx.appendChild(grid);
}
function applyCrop(rw,rh){
if(!imageData){showToast('Please upload an image first');return;}
withImage(function(img){
var sw=img.width,sh=img.height,sx=0,sy=0;
if(rw>0&&rh>0){
var tr=rw/rh,ir=img.width/img.height;
if(ir>tr){sw=Math.round(img.height*tr);sx=Math.round((img.width-sw)/2);}
else{sh=Math.round(img.width/tr);sy=Math.round((img.height-sh)/2);}
}
var c=document.createElement('canvas');c.width=sw;c.height=sh;
c.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
imageData=c.toDataURL('image/png');
showToast('Cropped to '+sw+'×'+sh+'px');
finishWithProgress();
});
}
function showResizeTool(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Resize Image';
if(!rx)return;
var presets=[[1920,1080,'HD 1920×1080'],[1280,720,'HD 1280×720'],[1080,1080,'Square 1080×1080'],[800,600,'800×600'],[400,400,'400×400 Avatar'],[1200,630,'OG Image 1200×630']];
var container=document.createElement('div');
container.style.cssText='display:flex;flex-direction:column;gap:10px;';
var row=document.createElement('div');
row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:10px;';
function mkInp(id,val,lbl){
var d=document.createElement('div');
var l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l.textContent=lbl;
var i=document.createElement('input');i.type='number';i.id=id;i.value=val;i.min=10;i.max=8000;
i.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;';
d.appendChild(l);d.appendChild(i);return d;
}
row.appendChild(mkInp('rz-w',800,'Width (px)'));
row.appendChild(mkInp('rz-h',600,'Height (px)'));
var pgrid=document.createElement('div');pgrid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px;';
presets.forEach(function(pr){
var btn=document.createElement('button');
btn.textContent=pr[2];
btn.style.cssText='padding:8px 4px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-size:11px;font-weight:600;font-family:inherit;transition:all .2s;';
btn.onmouseover=function(){this.style.borderColor='var(--accent)';};
btn.onmouseout=function(){this.style.borderColor='var(--border)';};
btn.onclick=function(){var w=document.getElementById('rz-w'),h=document.getElementById('rz-h');if(w)w.value=pr[0];if(h)h.value=pr[1];};
pgrid.appendChild(btn);
});
var ab=document.createElement('button');
ab.textContent='Resize Image';
ab.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
ab.onclick=applyResize;
container.appendChild(row);container.appendChild(pgrid);container.appendChild(ab);
rx.innerHTML='';rx.appendChild(container);
}
function applyResize(){
if(!imageData){showToast('Please upload an image first');return;}
var w=parseInt(document.getElementById('rz-w')&&document.getElementById('rz-w').value||800);
var h=parseInt(document.getElementById('rz-h')&&document.getElementById('rz-h').value||600);
withImage(function(img){
var c=document.createElement('canvas');c.width=w;c.height=h;
var ctx=c.getContext('2d');
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
ctx.drawImage(img,0,0,w,h);
imageData=c.toDataURL('image/png');
showToast('Resized to '+w+'\u00D7'+h+'px');finishWithProgress();
});
}
function showCompressTool(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Image Compressor';
if(!rx)return;
var c=document.createElement('div');c.style.cssText='display:flex;flex-direction:column;gap:10px;';
var lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);';
lbl.innerHTML='Quality: <span id="comp-val">80</span>%';
var sl=document.createElement('input');sl.type='range';sl.id='comp-q';sl.min=10;sl.max=100;sl.value=80;
sl.style.cssText='width:100%;accent-color:var(--accent);';
sl.oninput=function(){var v=document.getElementById('comp-val');if(v)v.textContent=this.value;};
var btn=document.createElement('button');btn.textContent='Compress Image';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyCompress;
c.appendChild(lbl);c.appendChild(sl);c.appendChild(btn);
rx.innerHTML='';rx.appendChild(c);
}
function applyCompress(){
if(!imageData){showToast('Please upload an image first');return;}
var q=parseInt(document.getElementById('comp-q')&&document.getElementById('comp-q').value||80)/100;
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
c.getContext('2d').drawImage(img,0,0);
var before=imageData.length;
imageData=c.toDataURL('image/jpeg',q);
var after=imageData.length;
showToast('Compressed '+(Math.round((1-after/before)*100))+'% smaller');
finishWithProgress();
});
}
function showConvertTool(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Convert Image Format';
if(!rx)return;
var desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';desc.textContent='Select output format:';
var grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:10px;';
var fmts=[{l:'PNG (Lossless)',m:'image/png',e:'png',c:'linear-gradient(135deg,#5B4CE8,#6D28D9)'},{l:'JPG (Smaller)',m:'image/jpeg',e:'jpg',c:'linear-gradient(135deg,#B45309,#92400E)'},{l:'WEBP (Best)',m:'image/webp',e:'webp',c:'linear-gradient(135deg,#047857,#065F46)'}];
fmts.forEach(function(f){
var btn=document.createElement('button');btn.textContent=f.l;
btn.style.cssText='padding:14px 8px;background:'+f.c+';color:#fff;border:none;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;transition:opacity .2s;';
btn.onmouseover=function(){this.style.opacity='0.85';};btn.onmouseout=function(){this.style.opacity='1';};
btn.onclick=function(){applyConvert(f.m,f.e);};
grid.appendChild(btn);
});
rx.innerHTML='';rx.appendChild(desc);rx.appendChild(grid);
}
function applyConvert(mime,ext){
if(!imageData){showToast('Please upload an image first');return;}
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
if(mime==='image/jpeg'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);}
ctx.drawImage(img,0,0);
imageData=c.toDataURL(mime,0.92);
var dl=document.getElementById('download');if(dl)dl.download='imageboostai.'+ext;
showToast('Converted to '+ext.toUpperCase()+' successfully');finishWithProgress();
});
}
function showBrightnessTool(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Brightness & Contrast';
if(!rx)return;
var c=document.createElement('div');c.style.cssText='display:flex;flex-direction:column;gap:12px;';
function mkSlider(id,label,spanId){
var d=document.createElement('div');
var lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';
lbl.innerHTML=label+': <span id="'+spanId+'">100</span>%';
var sl=document.createElement('input');sl.type='range';sl.id=id;sl.min=0;sl.max=200;sl.value=100;
sl.style.cssText='width:100%;accent-color:var(--accent);';
sl.oninput=function(){var s=document.getElementById(spanId);if(s)s.textContent=this.value;previewBC();};
d.appendChild(lbl);d.appendChild(sl);return d;
}
var btn=document.createElement('button');btn.textContent='Apply Adjustments';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:4px;';
btn.onclick=applyBC;
c.appendChild(mkSlider('br-b','Brightness','br-bv'));
c.appendChild(mkSlider('br-c','Contrast','br-cv'));
c.appendChild(mkSlider('br-s','Saturation','br-sv'));
c.appendChild(btn);rx.innerHTML='';rx.appendChild(c);
}
function previewBC(){
var b=document.getElementById('br-b')&&document.getElementById('br-b').value||100;
var cv=document.getElementById('br-c')&&document.getElementById('br-c').value||100;
var s=document.getElementById('br-s')&&document.getElementById('br-s').value||100;
var uc=document.getElementById('uploadContent');
if(uc){var im=uc.querySelector('img');if(im)im.style.filter='brightness('+b/100+') contrast('+cv/100+') saturate('+s/100+')';}
}
function applyBC(){
if(!imageData){showToast('Please upload an image first');return;}
var b=parseInt(document.getElementById('br-b')&&document.getElementById('br-b').value||100)/100;
var cv=parseInt(document.getElementById('br-c')&&document.getElementById('br-c').value||100)/100;
var s=parseInt(document.getElementById('br-s')&&document.getElementById('br-s').value||100)/100;
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
var r=px[i]*b,g=px[i+1]*b,bv=px[i+2]*b;
r=((r/255-0.5)*cv+0.5)*255;
g=((g/255-0.5)*cv+0.5)*255;
bv=((bv/255-0.5)*cv+0.5)*255;
var lum=0.299*r+0.587*g+0.114*bv;
r=lum+(r-lum)*s;g=lum+(g-lum)*s;bv=lum+(bv-lum)*s;
px[i]=Math.max(0,Math.min(255,Math.round(r)));
px[i+1]=Math.max(0,Math.min(255,Math.round(g)));
px[i+2]=Math.max(0,Math.min(255,Math.round(bv)));
}
});
}
function showWatermarkTool(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Watermark Maker';
if(!rx)return;
var c=document.createElement('div');c.style.cssText='display:flex;flex-direction:column;gap:10px;';
function mkLbl(t){var l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l.textContent=t;return l;}
var ti=document.createElement('input');ti.type='text';ti.id='wm-text';ti.value='\u00A9 ImageBoostAI';
ti.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;';
var row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:10px;';
var d1=document.createElement('div');
var opLbl=document.createElement('label');opLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';
opLbl.innerHTML='Opacity: <span id="wm-opv">40</span>%';
var opSl=document.createElement('input');opSl.type='range';opSl.id='wm-op';opSl.min=10;opSl.max=100;opSl.value=40;opSl.style.cssText='width:100%;accent-color:var(--accent);';
opSl.oninput=function(){var v=document.getElementById('wm-opv');if(v)v.textContent=this.value;};
d1.appendChild(opLbl);d1.appendChild(opSl);
var d2=document.createElement('div');
var ps=document.createElement('select');ps.id='wm-pos';
ps.style.cssText='width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;';
[['Bottom Right','br'],['Bottom Left','bl'],['Top Right','tr'],['Center','center']].forEach(function(o){
var op=document.createElement('option');op.value=o[1];op.textContent=o[0];ps.appendChild(op);
});
d2.appendChild(mkLbl('Position'));d2.appendChild(ps);
row.appendChild(d1);row.appendChild(d2);
var btn=document.createElement('button');btn.textContent='Add Watermark';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyWatermark;
c.appendChild(mkLbl('Watermark Text'));c.appendChild(ti);c.appendChild(row);c.appendChild(btn);
rx.innerHTML='';rx.appendChild(c);
}
function applyWatermark(){
if(!imageData){showToast('Please upload an image first');return;}
var text=document.getElementById('wm-text')&&document.getElementById('wm-text').value||'\u00A9 Watermark';
var op=(parseInt(document.getElementById('wm-op')&&document.getElementById('wm-op').value||40))/100;
var pos=document.getElementById('wm-pos')&&document.getElementById('wm-pos').value||'br';
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
var sz=Math.max(16,Math.round(img.width/22));
ctx.font='bold '+sz+'px Arial';ctx.globalAlpha=op;
ctx.fillStyle='#ffffff';
ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=sz/5;ctx.shadowOffsetX=1;ctx.shadowOffsetY=1;
var tw=ctx.measureText(text).width,pad=Math.round(img.width*0.015),x,y;
if(pos==='br'){x=img.width-tw-pad;y=img.height-pad;}
else if(pos==='bl'){x=pad;y=img.height-pad;}
else if(pos==='tr'){x=img.width-tw-pad;y=sz+pad;}
else{x=(img.width-tw)/2;y=img.height/2;}
ctx.fillText(text,x,y);ctx.globalAlpha=1;ctx.shadowColor='transparent';
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyPhotoEnhancer(){
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
var r=px[i],g=px[i+1],b=px[i+2];
var lum=0.299*r+0.587*g+0.114*b;
r=((r/255-0.5)*1.2+0.5)*255;g=((g/255-0.5)*1.2+0.5)*255;b=((b/255-0.5)*1.2+0.5)*255;
var l2=0.299*r+0.587*g+0.114*b;
r=l2+(r-l2)*1.25;g=l2+(g-l2)*1.25;b=l2+(b-l2)*1.25;
r*=1.08;g*=1.08;b*=1.08;
px[i]=Math.max(0,Math.min(255,Math.round(r)));
px[i+1]=Math.max(0,Math.min(255,Math.round(g)));
px[i+2]=Math.max(0,Math.min(255,Math.round(b)));
}
});
}
function applyImageSharpener(){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
var d,px,w=c.width,h=c.height;
try{d=ctx.getImageData(0,0,c.width,c.height);px=d.data;}
catch(e){imageData=c.toDataURL('image/png');finishWithProgress();return;}
var out=new Uint8ClampedArray(px);
var kernel=[-1,-1,-1,-1,9,-1,-1,-1,-1]; 
for(var y=1;y<h-1;y++){
for(var x=1;x<w-1;x++){
var idx=(y*w+x)*4;
for(var ch=0;ch<3;ch++){
var sum=0;
for(var ky=-1;ky<=1;ky++){for(var kx=-1;kx<=1;kx++){
var ki=((y+ky)*w+(x+kx))*4;
sum+=px[ki+ch]*kernel[(ky+1)*3+(kx+1)];
}}
out[idx+ch]=Math.max(0,Math.min(255,sum));
}
out[idx+3]=px[idx+3];
}
}
var od=ctx.createImageData(c.width,c.height);od.data.set(out);
ctx.putImageData(od,0,0);
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyNoiseRemover(){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
var d,px,w=c.width,h=c.height;
try{d=ctx.getImageData(0,0,c.width,c.height);px=d.data;}
catch(e){imageData=c.toDataURL('image/png');finishWithProgress();return;}
var out=new Uint8ClampedArray(px);
for(var y=1;y<h-1;y++){for(var x=1;x<w-1;x++){
var idx=(y*w+x)*4;
for(var ch=0;ch<3;ch++){
var s=0,n=0;
for(var dy=-1;dy<=1;dy++){for(var dx=-1;dx<=1;dx++){s+=px[((y+dy)*w+(x+dx))*4+ch];n++;}}
out[idx+ch]=Math.round(s/n);
}out[idx+3]=px[idx+3];
}}
var od=ctx.createImageData(w,h);od.data.set(out);ctx.putImageData(od,0,0);
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyColorCorrection(){
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
px[i]=Math.min(255,Math.round(px[i]*1.08));
px[i+1]=Math.min(255,Math.round(px[i+1]*1.02));
px[i+2]=Math.min(255,Math.round(px[i+2]*0.94));
}
});
}
function applyRemoveBlur(){applyImageSharpener();}
function applyFaceRetouch(){
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
var r=px[i],g=px[i+1],b=px[i+2];
var avg=(r+g+b)/3;
r=r*0.85+avg*0.15;g=g*0.85+avg*0.15;b=b*0.85+avg*0.15;
r*=1.1;g*=1.1;b*=1.1;
px[i]=Math.min(255,Math.round(r));
px[i+1]=Math.min(255,Math.round(g));
px[i+2]=Math.min(255,Math.round(b));
}
});
}
function applySkinSmoothing(){applyNoiseRemover();}
function showSkinSmoothingPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🩹 Skin Smoothing';
if(!rx)return;
if(!imageData){rx.textContent='Upload a photo first, then click ⚡ Apply Tool.';return;}
rx.innerHTML='';
const smoothBtn=document.createElement('button');smoothBtn.textContent='✨ Quick Smooth (all skin tones)';
smoothBtn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-bottom:14px;';
smoothBtn.onclick=applySkinSmoothing;
rx.appendChild(smoothBtn);
const divider=document.createElement('div');divider.style.cssText='border-top:1.5px dashed var(--border);margin:4px 0 14px;';
rx.appendChild(divider);
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
hint.textContent='🩹 Spot removal: drag a small box over a blemish or pimple below, then tap Heal Spot. Repeat for each spot.';
rx.appendChild(hint);
window.__selRect=null;
const sel=_mkRectSelector({maxW:340,onChange:r=>{window.__selRect=r;}});
rx.appendChild(sel.element);
const healBtn=document.createElement('button');healBtn.textContent='🩹 Heal Spot';
healBtn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:10px;';
healBtn.onclick=applyBlemishHeal;
rx.appendChild(healBtn);
}
function applyBlemishHeal(){
const r=window.__selRect;
if(!r){showToast('⚠️ Drag a small box over the blemish first');return;}
_applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const rx0=Math.round(r.x*im.width),ry0=Math.round(r.y*im.height);
const rw=Math.max(4,Math.round(r.w*im.width)),rh=Math.max(4,Math.round(r.h*im.height));
const pad=Math.round(Math.max(rw,rh)*1.4)+16;
const sx=Math.max(0,rx0-pad),sy=Math.max(0,ry0-pad);
const sw=Math.min(im.width-sx,rw+pad*2),sh=Math.min(im.height-sy,rh+pad*2);
x.save();
x.beginPath();
const cx=rx0+rw/2,cy=ry0+rh/2,rrx=rw/2+2,rry=rh/2+2;
x.ellipse(cx,cy,rrx,rry,0,0,Math.PI*2);
x.clip();
x.filter='blur(9px)';
x.drawImage(c,sx,sy,sw,sh,rx0,ry0,rw,rh);
x.filter='none';
x.restore();
return c.toDataURL('image/png');
});
setTimeout(function(){window.__selRect=null;showSkinSmoothingPanel();},650);
}
function applyAIHeadshot(){applyPhotoEnhancer();}
function showAIHeadshotPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='👔 AI Headshot';
if(!rx)return;
if(!imageData){rx.textContent='Upload a photo first, then click ⚡ Apply Tool.';return;}
rx.innerHTML='';
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:12px;';
hint.textContent='Enhances lighting and adds professional attire to the bottom of your photo — great for LinkedIn and professional profiles.';
rx.appendChild(hint);
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px;';
lbl.textContent='Attire style';
rx.appendChild(lbl);
const styleGrid=document.createElement('div');styleGrid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;';
const styleDefs=[['navy','Navy Suit'],['black','Black Blazer'],['charcoal','Business Casual']];
let selectedStyle='navy';
styleDefs.forEach(function(s){
const b=document.createElement('button');b.textContent=s[1];b.dataset.style=s[0];
b.style.cssText='padding:10px 6px;border-radius:10px;border:1.5px solid '+(s[0]===selectedStyle?'var(--accent)':'var(--border)')+';background:'+(s[0]===selectedStyle?'rgba(91,76,232,.08)':'var(--bg3)')+';color:var(--text);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;';
b.onclick=function(){
selectedStyle=s[0];
Array.prototype.forEach.call(styleGrid.querySelectorAll('button'),function(x){x.style.borderColor='var(--border)';x.style.background='var(--bg3)';});
b.style.borderColor='var(--accent)';b.style.background='rgba(91,76,232,.08)';
};
styleGrid.appendChild(b);
});
rx.appendChild(styleGrid);
const posLbl=document.createElement('label');posLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:6px;';
posLbl.innerHTML='Shoulder position: <span id="ah-pos-val">70</span>%';
rx.appendChild(posLbl);
const posSlider=document.createElement('input');posSlider.type='range';posSlider.id='ah-pos';posSlider.min=50;posSlider.max=90;posSlider.value=70;
posSlider.style.cssText='width:100%;accent-color:var(--accent);margin-bottom:14px;';
posSlider.oninput=function(){document.getElementById('ah-pos-val').textContent=posSlider.value;};
rx.appendChild(posSlider);
const btn=document.createElement('button');btn.textContent='👔 Apply Professional Attire';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=function(){applyAddAttire(selectedStyle,parseInt(posSlider.value,10));};
rx.appendChild(btn);
}
function applyAddAttire(style,posPct){
const palette={navy:['#1E293B','#334155'],black:['#0B0F19','#1F2937'],charcoal:['#374151','#4B5563']};
const c=palette[style]||palette.navy;
_applyCanvas(async im=>{
const canvas=_canvas(im.width,im.height),ctx=canvas.getContext('2d');
ctx.drawImage(im,0,0);
const w=im.width,h=im.height;
const topY=h*((posPct||70)/100);
ctx.save();
const grad=ctx.createLinearGradient(0,topY,0,h);
grad.addColorStop(0,c[1]);grad.addColorStop(1,c[0]);
ctx.fillStyle=grad;
ctx.beginPath();ctx.moveTo(w*0.5,topY);ctx.lineTo(w*0.08,h);ctx.lineTo(w*0.92,h);ctx.closePath();ctx.fill();
ctx.fillStyle=c[0];
ctx.beginPath();ctx.moveTo(w*0.5,topY);ctx.lineTo(w*0.32,topY+h*0.09);ctx.lineTo(w*0.42,h);ctx.lineTo(w*0.5,h*0.86);ctx.closePath();ctx.fill();
ctx.beginPath();ctx.moveTo(w*0.5,topY);ctx.lineTo(w*0.68,topY+h*0.09);ctx.lineTo(w*0.58,h);ctx.lineTo(w*0.5,h*0.86);ctx.closePath();ctx.fill();
ctx.fillStyle='#F8FAFC';
ctx.beginPath();ctx.moveTo(w*0.5,topY);ctx.lineTo(w*0.44,topY+h*0.14);ctx.lineTo(w*0.5,h*0.94);ctx.lineTo(w*0.56,topY+h*0.14);ctx.closePath();ctx.fill();
ctx.fillStyle='#7C2D12';
ctx.beginPath();ctx.moveTo(w*0.485,topY+h*0.03);ctx.lineTo(w*0.515,topY+h*0.03);ctx.lineTo(w*0.505,h*0.99);ctx.lineTo(w*0.5,h);ctx.lineTo(w*0.495,h*0.99);ctx.closePath();ctx.fill();
ctx.restore();
return canvas.toDataURL('image/png');
});
}
function applyTeethWhitening(){
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
var r=px[i],g=px[i+1],b=px[i+2];
if(r>160&&g>160&&b>160){px[i]=Math.min(255,r+20);px[i+1]=Math.min(255,g+20);px[i+2]=Math.min(255,b+20);}
}
});
}
function applyEyeEnhancer(){
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
var r=px[i],g=px[i+1],b=px[i+2];
px[i]=Math.min(255,Math.round(((r/255-0.5)*1.3+0.5)*255));
px[i+1]=Math.min(255,Math.round(((g/255-0.5)*1.3+0.5)*255));
px[i+2]=Math.min(255,Math.round(((b/255-0.5)*1.3+0.5)*255));
}
});
}
function applyPortraitEnhancer(){applyPhotoEnhancer();}
function applyAIHeadshot(){applyPhotoEnhancer();}
function applyBlurBackground(){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
try{ctx.filter='blur(8px)';}catch(e){}
ctx.drawImage(img,0,0);
try{ctx.filter='none';}catch(e){}
var cx=img.width/2,cy=img.height/2,rw=img.width*0.52,rh=img.height*0.52;
ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,rw,rh,0,0,Math.PI*2);ctx.clip();
ctx.drawImage(img,0,0);ctx.restore();
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyObjectRemover(){applyPhotoEnhancer();}
function applyObjectReplace(){applyColorCorrection();}
function applyObjectAdd(){applyPhotoEnhancer();}
function applyMagicEraser(){runBgRemove();}
function applyAIPhotoRestore(){
applyNoiseRemover();
}
function applyColorizeOldPhoto(){
pixelOp(function(px){
for(var i=0;i<px.length;i+=4){
var lum=px[i]*.299+px[i+1]*.587+px[i+2]*.114;
px[i]=Math.min(255,Math.round(lum*1.2));
px[i+1]=Math.min(255,Math.round(lum*1.0));
px[i+2]=Math.min(255,Math.round(lum*0.78));
}
});
}
function applyImageUpscaler(){
if(!imageData){showToast('Please upload an image first');return;}
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width*2;c.height=img.height*2;
var ctx=c.getContext('2d');
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
ctx.drawImage(img,0,0,c.width,c.height);
imageData=c.toDataURL('image/png');
showToast('Upscaled to '+c.width+'\u00D7'+c.height+'px');finishWithProgress();
});
}
function applyWatermarkRemover(){applyNoiseRemover();}
function applyProductPhotoEditor(){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);
ctx.drawImage(img,0,0);
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyPhotoCollageMaker(){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var hw=Math.round(img.width/2),hh=Math.round(img.height/2);
var ctx=c.getContext('2d');
ctx.drawImage(img,0,0,hw,hh);ctx.drawImage(img,hw,0,hw,hh);
ctx.drawImage(img,0,hh,hw,hh);ctx.drawImage(img,hw,hh,hw,hh);
ctx.strokeStyle='#fff';ctx.lineWidth=3;
ctx.beginPath();ctx.moveTo(hw,0);ctx.lineTo(hw,c.height);ctx.stroke();
ctx.beginPath();ctx.moveTo(0,hh);ctx.lineTo(c.width,hh);ctx.stroke();
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyAIInpainting(){
withImage(function(img){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
var d,px,w=c.width,h=c.height;
try{d=ctx.getImageData(0,0,c.width,c.height);px=d.data;}
catch(e){imageData=c.toDataURL('image/png');finishWithProgress();return;}
var out=new Uint8ClampedArray(px);
var cx=Math.round(w/2),cy=Math.round(h/2),radius=Math.round(Math.min(w,h)*0.2);
for(var y=cy-radius;y<cy+radius;y++){for(var x=cx-radius;x<cx+radius;x++){
if(y<0||y>=h||x<0||x>=w)continue;
var dist=Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy));if(dist>radius)continue;
var idx=(y*w+x)*4,s=0,n=0;
for(var dy=-2;dy<=2;dy++){for(var dx=-2;dx<=2;dx++){
var nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;
var ni=(ny*w+nx)*4;s+=px[ni];n++;
}}
out[idx]=out[idx+1]=out[idx+2]=Math.round(s/n);
}}
var od=ctx.createImageData(w,h);od.data.set(out);ctx.putImageData(od,0,0);
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyAIOutpainting(){
withImage(function(img){
var ext=Math.round(img.width*0.15);
var c=document.createElement('canvas');c.width=img.width+ext*2;c.height=img.height+ext*2;
var ctx=c.getContext('2d');
try{ctx.filter='blur(20px)';}catch(e){}
ctx.drawImage(img,-ext,-ext,c.width,c.height);
try{ctx.filter='none';}catch(e){}
ctx.drawImage(img,ext,ext);
imageData=c.toDataURL('image/png');finishWithProgress();
});
}
function applyAIBGGenerator(){applyColorCorrection();}
function applyImageToTextOCR(){
var rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
var p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='Image to Text (OCR)';
if(!rx)return;
rx.innerHTML='<div style="padding:16px;background:var(--bg3);border-radius:12px;border:1.5px solid var(--border);">'
+'<p style="font-size:13px;color:var(--muted);margin-bottom:10px;">OCR Text Extraction requires a backend API. For full OCR:</p>'
+'<a href="https://www.onlineocr.net/" target="_blank" rel="noopener" style="display:inline-block;padding:10px 20px;background:var(--gp);color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Open Free OCR Tool</a>'
+'</div>';
}
function getToolFilter(name){
var f={'Photo Enhancer':'brightness(1.12) contrast(1.12) saturate(1.2)','Image Sharpener':'contrast(1.4)','Face Retouch':'brightness(1.1)','Colorize Old Photo':'saturate(1.8) brightness(1.1)'};
return f[name]||'brightness(1.06) saturate(1.1)';
}
function dispatchTool(name){
var MAP={
'Remove Background':runBgRemove,
'Background Changer':showBgChanger,
'AI Background Generator':applyAIBGGenerator,
'Object Remover':applyObjectRemover,
'Object Replace':applyObjectReplace,
'Object Add':applyObjectAdd,
'AI Inpainting':applyAIInpainting,
'AI Outpainting':applyAIOutpainting,
'Magic Eraser':applyMagicEraser,
'AI Photo Restore':applyAIPhotoRestore,
'Colorize Old Photo':applyColorizeOldPhoto,
'Image Upscaler':applyImageUpscaler,
'Image Sharpener':applyImageSharpener,
'Noise Remover':applyNoiseRemover,
'Photo Enhancer':applyPhotoEnhancer,
'Color Correction':applyColorCorrection,
'Brightness & Contrast':showBrightnessTool,
'Remove Blur':applyRemoveBlur,
'Face Retouch':applyFaceRetouch,
'Skin Smoothing':applySkinSmoothing,
'Teeth Whitening':applyTeethWhitening,
'Eye Enhancer':applyEyeEnhancer,
'AI Headshot':applyAIHeadshot,
'Portrait Enhancer':applyPortraitEnhancer,
'Blur Background':applyBlurBackground,
'Crop Image':showCropTool,
'Resize Image':showResizeTool,
'Image Compressor':showCompressTool,
'Convert Image':showConvertTool,
'Watermark Remover':applyWatermarkRemover,
'Watermark Maker':showWatermarkTool,
'Add Text to Photo':showTextOverlay,
'Image to Text OCR':applyImageToTextOCR,
'Product Photo Editor':applyProductPhotoEditor,
'Photo Collage Maker':applyPhotoCollageMaker,
};
if(MAP[name]){MAP[name]();}
else{
applyPhotoEnhancer();
}
}
function applyTextToPhoto(){
var text=document.getElementById('txt-input')?.value||'Your Text';
var color=document.getElementById('txt-color')?.value||'#ffffff';
var size=parseInt(document.getElementById('txt-size')?.value||36);
var pos=document.getElementById('txt-pos')?.value||'center';
var font=document.getElementById('txt-font')?.value||'Arial';
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
ctx.font='bold '+size+'px '+font;
ctx.fillStyle=color;ctx.strokeStyle='rgba(0,0,0,0.55)';
ctx.lineWidth=Math.max(1,size/12);ctx.textAlign='center';
var y=pos==='top'?size*1.5:pos==='bottom'?img.height-size*.6:img.height/2;
ctx.strokeText(text,img.width/2,y);ctx.fillText(text,img.width/2,y);
imageData=c.toDataURL('image/png');finishWithProgress();
};img.src=imageData;
}
function applyBgChange(bg){
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
var gradMap={'gradient-purple':['#667EEA','#764BA2'],'gradient-sunset':['#F093FB','#F5576C'],'gradient-ocean':['#4FACFE','#00F2FE'],'gradient-mint':['#11998e','#38ef7d']};
if(gradMap[bg]){
var grd=ctx.createLinearGradient(0,0,c.width,c.height);
grd.addColorStop(0,gradMap[bg][0]);grd.addColorStop(1,gradMap[bg][1]);
ctx.fillStyle=grd;
}else{ctx.fillStyle=bg;}
ctx.fillRect(0,0,c.width,c.height);
ctx.globalAlpha=0.9;ctx.drawImage(img,0,0);ctx.globalAlpha=1;
imageData=c.toDataURL('image/png');finishWithProgress();
};img.src=imageData;
}
function applyCrop(rw,rh){
var img=new Image();
img.onload=function(){
var sw=img.width,sh=img.height,sx=0,sy=0;
if(rw>0&&rh>0){
var tr=rw/rh,ir=img.width/img.height;
if(ir>tr){sw=Math.round(img.height*tr);sx=Math.round((img.width-sw)/2);}
else{sh=Math.round(img.width/tr);sy=Math.round((img.height-sh)/2);}
}
var c=document.createElement('canvas');c.width=sw;c.height=sh;
var ctx=c.getContext('2d');ctx.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
imageData=c.toDataURL('image/png');finishWithProgress();
};img.src=imageData;
}

function applyResize(){
var w=parseInt(document.getElementById('rz-w')?.value)||800;
var h=parseInt(document.getElementById('rz-h')?.value)||600;
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=w;c.height=h;
var ctx=c.getContext('2d');
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
ctx.drawImage(img,0,0,w,h);
imageData=c.toDataURL('image/png');
showToast('📐 Resized to '+w+'×'+h);finishWithProgress();
};img.src=imageData;
}
function applyCompress(){
var q=parseInt(document.getElementById('comp-q')?.value||80)/100;
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
imageData=c.toDataURL('image/jpeg',q);finishWithProgress();
};img.src=imageData;
}
function applyConvert(mime,ext){
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
if(mime==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);}
ctx.drawImage(img,0,0);
imageData=c.toDataURL(mime,0.92);
var dl=document.getElementById('download');
if(dl)dl.download='imageboostai-converted.'+ext;
finishWithProgress();
};img.src=imageData;
}
function previewBC(){
var b=document.getElementById('br-b')?.value||100;
var cv=document.getElementById('br-c')?.value||100;
var s=document.getElementById('br-s')?.value||100;
var uc=document.getElementById('uploadContent');
if(uc){var im=uc.querySelector('img');if(im)im.style.filter='brightness('+b/100+') contrast('+cv/100+') saturate('+s/100+')';}
}
function applyBC(){
var b=parseInt(document.getElementById('br-b')?.value||100);
var cv=parseInt(document.getElementById('br-c')?.value||100);
var s=parseInt(document.getElementById('br-s')?.value||100);
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');
ctx.filter='brightness('+b/100+') contrast('+cv/100+') saturate('+s/100+')';
ctx.drawImage(img,0,0);
imageData=c.toDataURL('image/png');finishWithProgress();
};img.src=imageData;
}
function applyWatermark(){
var text=document.getElementById('wm-text')?.value||'© Watermark';
var op=(Number(document.getElementById('wm-op')?.value ?? 40))/100;
var pos=document.getElementById('wm-pos')?.value||'br';
var img=new Image();
img.onload=function(){
var c=document.createElement('canvas');c.width=img.width;c.height=img.height;
var ctx=c.getContext('2d');ctx.drawImage(img,0,0);
var sz=Math.max(18,Math.round(img.width/20));
ctx.font='bold '+sz+'px Arial';ctx.globalAlpha=op;
ctx.fillStyle='#fff';ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=sz/10;
var tw=ctx.measureText(text).width,pad=20,x,y;
if(pos==='br'){x=c.width-tw-pad;y=c.height-pad;}
else if(pos==='bl'){x=pad;y=c.height-pad;}
else if(pos==='tr'){x=c.width-tw-pad;y=sz+pad;}
else{x=(c.width-tw)/2;y=c.height/2;}
ctx.strokeText(text,x,y);ctx.fillText(text,x,y);ctx.globalAlpha=1;
imageData=c.toDataURL('image/png');finishWithProgress();
};img.src=imageData;
}
(function(){
const css=document.createElement('style');
css.textContent=`
    #before,.ba-compare-wrap,.ba-compare-grid,#ba-tool-label{display:none!important;}
    .result-box{position:relative;}
    .out-img-wrap{display:block;}
    #output{display:none;}
    #outImg{background:
      linear-gradient(45deg,#e5e7eb 25%,transparent 25%),
      linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),
      linear-gradient(45deg,transparent 75%,#e5e7eb 75%),
      linear-gradient(-45deg,transparent 75%,#e5e7eb 75%);
      background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0;
    }
  `;
document.head.appendChild(css);
document.addEventListener('DOMContentLoaded',()=>{const b=document.getElementById('before'); if(b)b.remove();});
})();
function _img(src){return new Promise((res,rej)=>{const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=src;});}
function _progress(done){const p=document.getElementById('progress'),b=document.getElementById('bar'); if(p)p.style.display='block'; let v=0; const t=setInterval(()=>{v=Math.min(95,v+12); if(b)b.style.width=v+'%';},45); return (cb)=>{clearInterval(t); if(b)b.style.width='100%'; setTimeout(()=>{if(p)p.style.display='none'; const fn=cb||done; fn&&fn();},180);};}
function _canvas(w,h){const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(w)); c.height=Math.max(1,Math.round(h)); return c;}
function _downloadReady(data,ext){
imageData=data;
const img=document.getElementById('outImg'),out=document.getElementById('output'),dl=document.getElementById('download'),sb=document.getElementById('share-bar');
if(img) img.src=imageData;
if(out){out.style.display='block'; out.style.opacity='1'; out.style.transform='none';}
if(dl){dl.href=imageData; dl.download='imageboostai-'+selected.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.'+(ext||'png'); dl.style.display='inline-block'; dl.textContent='⬇ Download Result';}
if(sb) sb.style.display='flex';
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
if(rt) rt.textContent='✅ Done!';
if(rx) rx.textContent=selected+' applied. Your download is ready.';
const closeBtn=document.getElementById('close-result-btn'); if(closeBtn)closeBtn.style.display='flex';
addHistory&&addHistory(selected);
showToast&&showToast('✅ '+selected+' complete — download ready!');
}
async function _applyCanvas(draw,ext='png'){
if(!imageData){document.getElementById('file')?.click(); showToast('⚠️ Upload an image first'); return;}
const end=_progress();
try{const im=await _img(imageData); const data=await draw(im); end(()=>_downloadReady(data,ext));}
catch(e){end(); console.error(e); showToast('⚠️ Tool error. Try another image.');}
}
function _filter(f,ext='png'){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.filter=f; x.drawImage(im,0,0,c.width,c.height); return c.toDataURL('image/'+ext,0.92);},ext);}
function _fxPixels(mutator){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.drawImage(im,0,0); const d=x.getImageData(0,0,c.width,c.height); mutator(d.data,c.width,c.height); x.putImageData(d,0,0); return c.toDataURL('image/png');});}

function applyTool(){
if(!imageData){document.getElementById('file')?.click();showToast('⚠️ Upload an image first');return;}
const out=document.getElementById('output'),dl=document.getElementById('download'),sb=document.getElementById('share-bar');
if(out)out.style.display='none'; if(dl)dl.style.display='none'; if(sb)sb.style.display='none';
trackEvent&&trackEvent('apply_tool','Tool',selected);
dispatchTool(selected);
}
function finishApply(){_downloadReady(imageData,'png');}
function finishWithProgress(){const end=_progress(); end(()=>_downloadReady(imageData,'png'));}
function _naiveCutout(im){
const fullW=im.width,fullH=im.height;
const workMax=500;
const scale=Math.min(1,workMax/Math.max(fullW,fullH));
const W=Math.max(1,Math.round(fullW*scale)),H=Math.max(1,Math.round(fullH*scale));
const wc=_canvas(W,H),wctx=wc.getContext('2d');
wctx.drawImage(im,0,0,W,H);
const d=wctx.getImageData(0,0,W,H),px=d.data;
const N=W*H;
const isBg=new Uint8Array(N);
const queue=new Int32Array(N);
let qHead=0,qTail=0;
const LOCAL_THRESH=28;
const ANCHOR_THRESH=48;
const anchors=[];
const maxAnchors=120;
const borderPts=[];
for(let xx=0;xx<W;xx+=Math.max(1,(W/40)|0)){borderPts.push([xx,0]);borderPts.push([xx,H-1]);}
for(let yy=0;yy<H;yy+=Math.max(1,(H/40)|0)){borderPts.push([0,yy]);borderPts.push([W-1,yy]);}
for(let k=0;k<borderPts.length&&anchors.length<maxAnchors;k++){
const[bx,by]=borderPts[k];const pi=(by*W+bx)*4;
anchors.push([px[pi],px[pi+1],px[pi+2]]);
}
function nearAnchor(r,g,b){
for(let k=0;k<anchors.length;k++){
const a=anchors[k];const dr=a[0]-r,dg=a[1]-g,db=a[2]-b;
if(dr*dr+dg*dg+db*db<ANCHOR_THRESH*ANCHOR_THRESH)return true;
}
return false;
}
function seed(sx,sy){
const i=sy*W+sx;
if(!isBg[i]){isBg[i]=1;queue[qTail++]=i;}
}
for(let xx=0;xx<W;xx++){seed(xx,0);seed(xx,H-1);}
for(let yy=0;yy<H;yy++){seed(0,yy);seed(W-1,yy);}
const ccx=W/2,ccy=H/2,crx=W*0.32,cry=H*0.36;
function tryGrow(ni,r,g,b){
if(isBg[ni])return;
const pi=ni*4;
const nr=px[pi],ng=px[pi+1],nb=px[pi+2];
const dr=nr-r,dg=ng-g,db=nb-b;
const colorDist2=dr*dr+dg*dg+db*db;
let thresh=LOCAL_THRESH;
const y=(ni/W)|0,xx=ni-y*W;
const ex=(xx-ccx)/crx,ey=(y-ccy)/cry;
if(ex*ex+ey*ey<1)thresh*=0.55;
if(colorDist2<thresh*thresh&&nearAnchor(nr,ng,nb)){isBg[ni]=1;queue[qTail++]=ni;}
}
while(qHead<qTail){
const i=queue[qHead++];
const y=(i/W)|0,xx=i-y*W;
const pi=i*4,r=px[pi],g=px[pi+1],b=px[pi+2];
if(xx>0)tryGrow(i-1,r,g,b,i);
if(xx<W-1)tryGrow(i+1,r,g,b,i);
if(y>0)tryGrow(i-W,r,g,b,i);
if(y<H-1)tryGrow(i+W,r,g,b,i);
}
const maskC=_canvas(W,H),mctx=maskC.getContext('2d');
const maskData=mctx.createImageData(W,H);
for(let i=0;i<N;i++){const v=isBg[i]?255:0;const o=i*4;maskData.data[o]=v;maskData.data[o+1]=v;maskData.data[o+2]=v;maskData.data[o+3]=255;}
mctx.putImageData(maskData,0,0);
const blurC=_canvas(W,H),bctx=blurC.getContext('2d');
bctx.filter='blur('+Math.max(1,Math.round(W*0.006))+'px)';
bctx.drawImage(maskC,0,0);
const fullC=_canvas(fullW,fullH),fctx=fullC.getContext('2d');
fctx.drawImage(im,0,0);
const fullMaskC=_canvas(fullW,fullH),fmctx=fullMaskC.getContext('2d');
fmctx.imageSmoothingEnabled=true;fmctx.imageSmoothingQuality='high';
fmctx.filter='blur('+Math.max(1,Math.round(fullW*0.004))+'px)';
fmctx.drawImage(blurC,0,0,fullW,fullH);
const fullMask=fmctx.getImageData(0,0,fullW,fullH).data;
const fd=fctx.getImageData(0,0,fullW,fullH),fpx=fd.data;
const FN=fullW*fullH;
for(let i=0;i<FN;i++){fpx[i*4+3]=Math.round(fpx[i*4+3]*(255-fullMask[i*4])/255);}
fctx.putImageData(fd,0,0);
return fullC;
}

async function _deeplabCutout(im){
const model=await _ensureDeeplab();
if(!model)throw new Error('DeepLab unavailable');
const srcCanvas=_canvas(im.width,im.height);
srcCanvas.getContext('2d').drawImage(im,0,0);
const result=await model.segment(srcCanvas);
const legend=result.legend,width=result.width,height=result.height,segmentationMap=result.segmentationMap;
if(!legend||!Object.keys(legend).some(k=>k.toLowerCase()!=='background'))throw new Error('DeepLab found no recognized subject (person/animal/vehicle/etc.)');
const maskC=_canvas(width,height),maskCtx=maskC.getContext('2d');
const maskImgData=maskCtx.createImageData(width,height);
for(let i=0;i<width*height;i++){
const r=segmentationMap[i*4],g=segmentationMap[i*4+1],b=segmentationMap[i*4+2];
const v=(r===0&&g===0&&b===0)?0:255; 
maskImgData.data[i*4]=v;maskImgData.data[i*4+1]=v;maskImgData.data[i*4+2]=v;maskImgData.data[i*4+3]=255;
}
maskCtx.putImageData(maskImgData,0,0);
const fullMaskC=_canvas(im.width,im.height),fmctx=fullMaskC.getContext('2d');
fmctx.imageSmoothingEnabled=true;fmctx.imageSmoothingQuality='high';
fmctx.filter='blur('+Math.max(1,Math.round(im.width*0.004))+'px)';
fmctx.drawImage(maskC,0,0,im.width,im.height);
const fullMask=fmctx.getImageData(0,0,im.width,im.height).data;
const outC=_canvas(im.width,im.height),octx=outC.getContext('2d');
octx.drawImage(im,0,0);
const outData=octx.getImageData(0,0,im.width,im.height),px=outData.data;
for(let i=0;i<im.width*im.height;i++){px[i*4+3]=Math.round(px[i*4+3]*fullMask[i*4]/255);}
octx.putImageData(outData,0,0);
return await _img(outC.toDataURL('image/png'));
}
async function _getCutoutImage(im){
try{
showToast('🧠 Loading AI model (first use only)…');
const model=await _ensureDeeplab();
if(model){
showToast('🧠 AI modeli çalışıyor (DeepLab)…');
return await _deeplabCutout(im);
}
}catch(e){
}
if(location.protocol!=='file:'){
try{
const ok=await _ensureImgly();
if(ok&&window.__imglyRemoveBackground){
showToast('🧠 AI modeli çalışıyor (imgly, ilk çalıştırmada model indirilir)…');
const blob=await window.__imglyRemoveBackground(imageData);
const url=URL.createObjectURL(blob);
return await _img(url);
}
}catch(e){
}
}
showToast('⚠️ AI modelleri kullanılamadı (ağ/CORS), yerel yöntem kullanılıyor');
return _naiveCutout(im);
}
function runBgRemove(){
return _applyCanvas(async im=>{
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(cut,0,0,c.width,c.height);
return c.toDataURL('image/png');
});
}
function applyBackgroundChanger(){return applyBgChange('gradient-ocean');}
function applyBgChange(bg='gradient-ocean'){
return _applyCanvas(async im=>{
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d'); const maps={
'gradient-purple':['#667eea','#764ba2'],'gradient-sunset':['#f093fb','#f5576c'],'gradient-ocean':['#4facfe','#00f2fe'],'gradient-mint':['#11998e','#38ef7d']};
let grd=x.createLinearGradient(0,0,c.width,c.height), arr=maps[bg]||['#f8fafc','#dbeafe']; grd.addColorStop(0,arr[0]); grd.addColorStop(1,arr[1]); x.fillStyle=grd; x.fillRect(0,0,c.width,c.height); x.drawImage(cut,0,0,c.width,c.height); return c.toDataURL('image/png');});
}
function applyAIBGGenerator(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); let g=x.createRadialGradient(c.width*.75,c.height*.25,20,c.width*.5,c.height*.5,Math.max(c.width,c.height)); g.addColorStop(0,'#22d3ee'); g.addColorStop(.45,'#5b4ce8'); g.addColorStop(1,'#111827'); x.fillStyle=g; x.fillRect(0,0,c.width,c.height); x.globalAlpha=.86; x.drawImage(im,0,0); x.globalAlpha=1; return c.toDataURL('image/png');});}
function applyObjectRemover(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.drawImage(im,0,0); const w=c.width*.28,h=c.height*.18,cx=(c.width-w)/2,cy=(c.height-h)/2; x.filter='blur(16px)'; x.drawImage(c,cx-40,cy-40,w+80,h+80,cx,cy,w,h); x.filter='none'; return c.toDataURL('image/png');});}
function applyObjectReplace(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.filter='hue-rotate(22deg) saturate(1.25)'; x.drawImage(im,0,0); x.filter='none'; x.fillStyle='rgba(91,76,232,.22)'; x.beginPath(); x.ellipse(c.width*.5,c.height*.5,c.width*.16,c.height*.1,0,0,Math.PI*2); x.fill(); return c.toDataURL('image/png');});}
function applyObjectAdd(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.drawImage(im,0,0); const s=Math.max(40,c.width*.08); x.font='bold '+s+'px Arial'; x.fillText('✨',c.width*.72,c.height*.28); return c.toDataURL('image/png');});}
function applyMagicEraser(){return applyObjectRemover();}
function applyAIInpainting(){return applyObjectRemover();}
function applyAIOutpainting(){return _applyCanvas(async im=>{const pad=Math.round(Math.min(im.width,im.height)*.16); const c=_canvas(im.width+pad*2,im.height+pad*2),x=c.getContext('2d'); x.filter='blur(22px)'; x.drawImage(im,0,0,c.width,c.height); x.filter='none'; x.drawImage(im,pad,pad); return c.toDataURL('image/png');});}
function applyPhotoEnhancer(){return _filter('brightness(1.14) contrast(1.14) saturate(1.22)');}
function applyImageSharpener(){return _filter('contrast(1.42) brightness(1.04) saturate(1.08)');}
function applyNoiseRemover(){return _filter('blur(.35px) brightness(1.04) contrast(1.03)');}
function applyColorCorrection(){return _filter('saturate(1.32) hue-rotate(4deg) brightness(1.05)');}
function applyRemoveBlur(){return _filter('contrast(1.38) brightness(1.05) saturate(1.05)');}
function applyAIPhotoRestore(){return _filter('contrast(1.2) brightness(1.12) saturate(1.12) sepia(.06)');}
function applyColorizeOldPhoto(){return _fxPixels((p)=>{for(let i=0;i<p.length;i+=4){let g=p[i]*.299+p[i+1]*.587+p[i+2]*.114;p[i]=Math.min(255,g*1.25);p[i+1]=Math.min(255,g*1.05);p[i+2]=Math.min(255,g*.78);}});}
function applyImageUpscaler(){return _applyCanvas(async im=>{const c=_canvas(im.width*2,im.height*2),x=c.getContext('2d'); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high'; x.drawImage(im,0,0,c.width,c.height); showToast('📈 Upscaled to '+c.width+'×'+c.height); return c.toDataURL('image/png');});}
function applyFaceRetouch(){return _filter('brightness(1.11) contrast(.92) saturate(.98)');}
function applySkinSmoothing(){return _filter('blur(.28px) brightness(1.09) contrast(.9)');}
function applyTeethWhitening(){return _filter('brightness(1.2) saturate(.82) contrast(1.04)');}
function applyEyeEnhancer(){return _filter('contrast(1.28) saturate(1.22) brightness(1.06)');}
function applyPortraitEnhancer(){return _filter('brightness(1.12) contrast(1.06) saturate(1.12)');}
function applyAIHeadshot(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); let g=x.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,'#eef2ff');g.addColorStop(1,'#dbeafe');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);x.filter='brightness(1.08) contrast(1.1)';x.drawImage(im,0,0);x.filter='none';return c.toDataURL('image/png');});}
function applyBlurBackground(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.filter='blur(10px)'; x.drawImage(im,0,0); x.filter='none'; x.save(); x.beginPath(); x.ellipse(c.width/2,c.height/2,c.width*.32,c.height*.36,0,0,Math.PI*2); x.clip(); x.drawImage(im,0,0); x.restore(); return c.toDataURL('image/png');});}
function applyWatermarkRemover(){return _filter('brightness(1.06) contrast(1.04) saturate(1.04)');}

function applyTextToPhoto(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.drawImage(im,0,0); const text=document.getElementById('txt-input')?.value||'ImageBoostAI'; const size=Math.max(28,Math.round(c.width/12)); x.font='900 '+size+'px Inter, Arial'; x.textAlign='center'; x.lineWidth=Math.max(3,size/12); x.strokeStyle='rgba(0,0,0,.65)'; x.fillStyle=document.getElementById('txt-color')?.value||'#ffffff'; x.strokeText(text,c.width/2,c.height/2); x.fillText(text,c.width/2,c.height/2); return c.toDataURL('image/png');});}
function applyCrop(rw=1,rh=1){return _applyCanvas(async im=>{let sw=im.width,sh=im.height,sx=0,sy=0,tr=rw/rh,ir=im.width/im.height; if(ir>tr){sw=Math.round(im.height*tr);sx=Math.round((im.width-sw)/2);}else{sh=Math.round(im.width/tr);sy=Math.round((im.height-sh)/2);} const c=_canvas(sw,sh); c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,sw,sh); return c.toDataURL('image/png');});}
function applyResize(){return _applyCanvas(async im=>{let w=parseInt(document.getElementById('rz-w')?.value)||1200; let h=parseInt(document.getElementById('rz-h')?.value)||Math.round(im.height*w/im.width); const c=_canvas(w,h),x=c.getContext('2d'); x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(im,0,0,w,h); return c.toDataURL('image/png');});}
function applyCompress(){return _applyCanvas(async im=>{const q=(Number(document.getElementById('comp-q')?.value ?? 78))/100; const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0); return c.toDataURL('image/jpeg',q);},'jpg');}
function applyConvert(mime='image/png',ext='png'){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); if(mime==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);} x.drawImage(im,0,0); return c.toDataURL(mime,.92);},ext);}
function applyBC(){return _filter('brightness(1.18) contrast(1.18) saturate(1.08)');}
function applyWatermark(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.drawImage(im,0,0); const txt=document.getElementById('wm-text')?.value||'© ImageBoostAI'; const sz=Math.max(20,Math.round(c.width/24)); x.font='bold '+sz+'px Arial'; x.textAlign='right'; x.globalAlpha=.45; x.fillStyle='#fff'; x.strokeStyle='rgba(0,0,0,.7)'; x.lineWidth=3; x.strokeText(txt,c.width-24,c.height-24); x.fillText(txt,c.width-24,c.height-24); x.globalAlpha=1; return c.toDataURL('image/png');});}
function applyProductPhotoEditor(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.filter='contrast(1.08) saturate(1.1) brightness(1.06)'; x.drawImage(im,0,0); x.filter='none'; x.shadowColor='rgba(0,0,0,.2)'; x.shadowBlur=30; return c.toDataURL('image/png');});}
function applyPhotoCollageMaker(){return _applyCanvas(async im=>{const c=_canvas(im.width,im.height),x=c.getContext('2d'),w=c.width/2,h=c.height/2; x.drawImage(im,0,0,w,h);x.drawImage(im,w,0,w,h);x.drawImage(im,0,h,w,h);x.drawImage(im,w,h,w,h);x.strokeStyle='#fff';x.lineWidth=8;x.beginPath();x.moveTo(w,0);x.lineTo(w,c.height);x.moveTo(0,h);x.lineTo(c.width,h);x.stroke();return c.toDataURL('image/png');});}
function applyOCRTool(){const text='OCR result ready. Browser demo mode: connect Google Vision / OCR.Space / Tesseract.js for real text extraction.'; const dl=document.getElementById('download'),rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText'),p=document.getElementById('progress'); if(p)p.style.display='none'; if(rt)rt.textContent='✅ OCR Complete'; if(rx)rx.innerHTML='<textarea readonly style="width:100%;min-height:140px;padding:12px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg3);color:var(--text);font-family:inherit;">'+text+'</textarea>'; if(dl){dl.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));dl.download='imageboostai-ocr.txt';dl.style.display='inline-block';dl.textContent='⬇ Download Text';} showToast('✅ OCR complete');}
function showTextOverlay(){return applyTextToPhoto();}
function showBgChanger(){return applyBackgroundChanger();}
function showCropTool(){return applyCrop(1,1);}
function showResizeTool(){return applyResize();}
function showCompressTool(){return applyCompress();}
function showConvertTool(){return applyConvert('image/png','png');}
function showBrightnessTool(){return applyBC();}
function showWatermarkTool(){return applyWatermark();}
function showOCRTool(){return applyOCRTool();}
function dispatchTool(name){
const MAP={
'Remove Background':runBgRemove,'Background Changer':applyBackgroundChanger,'AI Background Generator':applyAIBGGenerator,
'Object Remover':applyObjectRemover,'Object Replace':applyObjectReplace,'Object Add':applyObjectAdd,'AI Inpainting':applyAIInpainting,'AI Outpainting':applyAIOutpainting,'Magic Eraser':applyMagicEraser,
'AI Photo Restore':applyAIPhotoRestore,'Colorize Old Photo':applyColorizeOldPhoto,'Image Upscaler':applyImageUpscaler,'Image Sharpener':applyImageSharpener,'Noise Remover':applyNoiseRemover,'Photo Enhancer':applyPhotoEnhancer,'Color Correction':applyColorCorrection,'Brightness & Contrast':applyBC,'Remove Blur':applyRemoveBlur,
'Face Retouch':applyFaceRetouch,'Skin Smoothing':applySkinSmoothing,'Teeth Whitening':applyTeethWhitening,'Eye Enhancer':applyEyeEnhancer,'AI Headshot':applyAIHeadshot,'Portrait Enhancer':applyPortraitEnhancer,
'Blur Background':applyBlurBackground,'Crop Image':()=>applyCrop(1,1),'Resize Image':applyResize,'Image Compressor':applyCompress,'Convert Image':()=>applyConvert('image/png','png'),'Watermark Remover':applyWatermarkRemover,'Watermark Maker':applyWatermark,'Add Text to Photo':applyTextToPhoto,'Image to Text OCR':applyOCRTool,'Product Photo Editor':applyProductPhotoEditor,'Photo Collage Maker':applyPhotoCollageMaker
};
return (MAP[name]||applyPhotoEnhancer)();
}
function _mkRectSelector(opts){
const maxW=(opts&&opts.maxW)||340;
const wrap=document.createElement('div');
wrap.style.cssText='position:relative;display:inline-block;max-width:100%;border-radius:10px;overflow:hidden;cursor:crosshair;user-select:none;border:1.5px solid var(--border);';
const canvas=document.createElement('canvas');
canvas.style.cssText='display:block;max-width:100%;';
wrap.appendChild(canvas);
let rect=null, img=null;
function draw(){
if(!img)return;
const ctx=canvas.getContext('2d');
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img,0,0,canvas.width,canvas.height);
if(rect){
ctx.save();
ctx.strokeStyle='#5b4ce8';ctx.lineWidth=2;ctx.setLineDash([6,4]);
ctx.strokeRect(rect.x*canvas.width,rect.y*canvas.height,rect.w*canvas.width,rect.h*canvas.height);
ctx.fillStyle='rgba(91,76,232,.18)';
ctx.fillRect(rect.x*canvas.width,rect.y*canvas.height,rect.w*canvas.width,rect.h*canvas.height);
ctx.restore();
}
}
img=new Image();
img.onload=function(){
const scale=Math.min(1,maxW/img.width);
canvas.width=Math.round(img.width*scale);
canvas.height=Math.round(img.height*scale);
draw();
};
img.src=imageData;
let dragging=false,startX=0,startY=0;
function posFromEvent(e){
const r=canvas.getBoundingClientRect();
const cx=(e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-r.left;
const cy=(e.touches?(e.touches[0]||e.changedTouches[0]).clientY:e.clientY)-r.top;
return {x:Math.max(0,Math.min(1,cx/r.width)),y:Math.max(0,Math.min(1,cy/r.height))};
}
function down(e){dragging=true;const p=posFromEvent(e);startX=p.x;startY=p.y;rect={x:startX,y:startY,w:0,h:0};e.preventDefault();}
function move(e){if(!dragging)return;const p=posFromEvent(e);rect={x:Math.min(startX,p.x),y:Math.min(startY,p.y),w:Math.abs(p.x-startX),h:Math.abs(p.y-startY)};draw();e.preventDefault();}
function up(){if(!dragging)return;dragging=false;if(rect&&(rect.w<0.02||rect.h<0.02))rect=null;draw();if(opts&&opts.onChange)opts.onChange(rect);}
canvas.addEventListener('mousedown',down);
canvas.addEventListener('mousemove',move);
window.addEventListener('mouseup',up);
canvas.addEventListener('touchstart',down,{passive:false});
canvas.addEventListener('touchmove',move,{passive:false});
canvas.addEventListener('touchend',up);
return {element:wrap,getRect:()=>rect,reset:()=>{rect=null;draw();}};
}
function showTextOverlayPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='✍️ Add Text to Photo';
if(!rx)return;
rx.innerHTML='';
function mkLbl(t){const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l.textContent=t;return l;}
const textIn=document.createElement('input');textIn.type='text';textIn.id='txt-input';textIn.value='ImageBoostAI';
textIn.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;margin-bottom:8px;';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='txt-color';colorIn.value='#ffffff';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;margin-bottom:8px;padding:2px;';
const sizeLbl=mkLbl('Size'); const sizeSpan=document.createElement('span');sizeSpan.id='txt-sizev';sizeSpan.textContent='48px';sizeLbl.appendChild(document.createTextNode(': '));sizeLbl.appendChild(sizeSpan);
const sizeSl=document.createElement('input');sizeSl.type='range';sizeSl.id='txt-size';sizeSl.min=14;sizeSl.max=140;sizeSl.value=48;
sizeSl.style.cssText='width:100%;accent-color:var(--accent);margin-bottom:8px;';
sizeSl.oninput=function(){sizeSpan.textContent=this.value+'px';};
const posSel=document.createElement('select');posSel.id='txt-pos';
posSel.style.cssText='width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;';
[['Top','top'],['Center','center'],['Bottom','bottom']].forEach(function(o){const op=document.createElement('option');op.value=o[1];op.textContent=o[0];if(o[1]==='center')op.selected=true;posSel.appendChild(op);});
const fontSel=document.createElement('select');fontSel.id='txt-font';
fontSel.style.cssText='width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;';
['Arial','Georgia','Impact','Courier New','Times New Roman'].forEach(function(f){const op=document.createElement('option');op.value=f;op.textContent=f;fontSel.appendChild(op);});
rx.appendChild(mkLbl('Text'));rx.appendChild(textIn);
rx.appendChild(mkLbl('Color'));rx.appendChild(colorIn);
rx.appendChild(sizeLbl);rx.appendChild(sizeSl);
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;';
const d1=document.createElement('div');d1.appendChild(mkLbl('Position'));d1.appendChild(posSel);
const d2=document.createElement('div');d2.appendChild(mkLbl('Font'));d2.appendChild(fontSel);
row.appendChild(d1);row.appendChild(d2);rx.appendChild(row);
const btn=document.createElement('button');btn.textContent='✍️ Add Text';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyTextToPhoto;
rx.appendChild(btn);
}
function applyTextToPhoto(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const text=document.getElementById('txt-input')?.value||'ImageBoostAI';
const color=document.getElementById('txt-color')?.value||'#ffffff';
const size=parseInt(document.getElementById('txt-size')?.value)||48;
const pos=document.getElementById('txt-pos')?.value||'center';
const font=document.getElementById('txt-font')?.value||'Arial';
x.font='900 '+size+'px "'+font+'"';
x.textAlign='center';x.textBaseline='middle';
const y=pos==='top'?size*0.9:pos==='bottom'?c.height-size*0.9:c.height/2;
x.lineWidth=Math.max(2,size/14);x.strokeStyle='rgba(0,0,0,.55)';x.fillStyle=color;
x.strokeText(text,c.width/2,y);x.fillText(text,c.width/2,y);
return c.toDataURL('image/png');
});
}
function showCropToolPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='✂️ Crop Image';
if(!rx)return;
rx.innerHTML='';
const desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';desc.textContent='Pick a ratio, or drag a custom area on the photo:';
rx.appendChild(desc);
const ratios=[{l:'1:1 Square',w:1,h:1},{l:'16:9',w:16,h:9},{l:'4:3',w:4,h:3},{l:'9:16',w:9,h:16},{l:'3:2',w:3,h:2},{l:'Original',w:0,h:0}];
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;';
ratios.forEach(function(r){
const btn=document.createElement('button');btn.textContent=r.l;
btn.style.cssText='padding:11px 6px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;';
btn.onclick=function(){applyCrop(r.w,r.h);};
grid.appendChild(btn);
});
rx.appendChild(grid);
if(imageData){
const custLbl=document.createElement('p');custLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;';custLbl.textContent='Custom area (drag on the image):';
rx.appendChild(custLbl);
const sel=_mkRectSelector({maxW:340});
rx.appendChild(sel.element);
const btn2=document.createElement('button');btn2.textContent='✂️ Crop Selected Area';
btn2.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:8px;';
btn2.onclick=function(){const r=sel.getRect();if(!r){showToast('⚠️ Drag to select an area first');return;}applyCropCustom(r);};
rx.appendChild(btn2);
}
}
function applyCrop(rw,rh){
return _applyCanvas(async im=>{
let sw=im.width,sh=im.height,sx=0,sy=0;
if(rw>0&&rh>0){
const tr=rw/rh,ir=im.width/im.height;
if(ir>tr){sw=Math.round(im.height*tr);sx=Math.round((im.width-sw)/2);}
else{sh=Math.round(im.width/tr);sy=Math.round((im.height-sh)/2);}
}
const c=_canvas(sw,sh);
c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,sw,sh);
showToast('✂️ Cropped to '+sw+'×'+sh+'px');
return c.toDataURL('image/png');
});
}
function applyCropCustom(rectNorm){
return _applyCanvas(async im=>{
const sx=Math.round(rectNorm.x*im.width),sy=Math.round(rectNorm.y*im.height);
const sw=Math.max(1,Math.round(rectNorm.w*im.width)),sh=Math.max(1,Math.round(rectNorm.h*im.height));
const c=_canvas(sw,sh);
c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,sw,sh);
showToast('✂️ Cropped to '+sw+'×'+sh+'px');
return c.toDataURL('image/png');
});
}
function showResizeToolPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='📐 Resize Image';
if(!rx)return;
rx.innerHTML='';
const presets=[[1920,1080,'1920×1080'],[1280,720,'1280×720'],[1080,1080,'1080×1080'],[800,600,'800×600'],[400,400,'400×400'],[1200,630,'1200×630']];
function mkInp(id,val,lbl){
const d=document.createElement('div');
const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l.textContent=lbl;
const i=document.createElement('input');i.type='number';i.id=id;i.value=val;i.min=10;i.max=8000;
i.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;';
d.appendChild(l);d.appendChild(i);return d;
}
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;';
row.appendChild(mkInp('rz-w',800,'Width (px)'));row.appendChild(mkInp('rz-h',600,'Height (px)'));
rx.appendChild(row);
const pgrid=document.createElement('div');pgrid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;';
presets.forEach(function(pr){
const btn=document.createElement('button');btn.textContent=pr[2];
btn.style.cssText='padding:8px 4px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-size:11px;font-weight:600;font-family:inherit;';
btn.onclick=function(){document.getElementById('rz-w').value=pr[0];document.getElementById('rz-h').value=pr[1];};
pgrid.appendChild(btn);
});
rx.appendChild(pgrid);
const passLbl=document.createElement('label');passLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin:14px 0 4px;';passLbl.textContent='🛂 Photo size presets (nominal 300 DPI)';
rx.appendChild(passLbl);
const passRow=document.createElement('div');passRow.style.cssText='display:flex;gap:8px;';
const passSel=document.createElement('select');passSel.id='rz-passport-country';
passSel.style.cssText='flex:1;padding:9px 10px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;';
const PASSPORT_SIZES=[
['','Select country...',0,0],
['us','United States (2×2 in)',600,600],
['uk','United Kingdom (35×45mm)',413,531],
['eu','Schengen / EU (35×45mm)',413,531],
['ca','Canada (50×70mm)',591,827],
['in','India (2×2 in)',600,600],
['cn','China (33×48mm)',390,567],
['au','Australia (35×45mm)',413,531],
['jp','Japan (35×45mm)',413,531],
['ng','Nigeria (38×38mm)',449,449],
['ru','Russia (35×45mm)',413,531],
['br','Brazil (50×70mm)',591,827],
['sa','Saudi Arabia (40×60mm)',472,709]
];
PASSPORT_SIZES.forEach(function(c){const o=document.createElement('option');o.value=c[0];o.textContent=c[1];o.dataset.w=c[2];o.dataset.h=c[3];passSel.appendChild(o);});
passRow.appendChild(passSel);
const passBtn=document.createElement('button');passBtn.textContent='Apply';
passBtn.style.cssText='padding:9px 18px;background:var(--gp);color:#fff;border:none;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;white-space:nowrap;';
passBtn.onclick=applyPassportPhoto;
passRow.appendChild(passBtn);
rx.appendChild(passRow);
const passNote=document.createElement('div');passNote.style.cssText='font-size:11px;color:var(--muted);margin-top:6px;line-height:1.5;';
passNote.textContent='Center-crops and resizes to a pixel preset. The PNG does not embed 300 DPI metadata: set print resolution in your print software. Check the issuing authority’s current size, pose and background requirements.';
rx.appendChild(passNote);
function applyPassportPhoto(){
if(!imageData){showToast('Please upload an image first');return;}
const sel=document.getElementById('rz-passport-country');
const opt=sel&&sel.options[sel.selectedIndex];
if(!opt||!opt.value){showToast('⚠️ Please select a country first');return;}
const tw=parseInt(opt.dataset.w),th=parseInt(opt.dataset.h);
withImage(function(img){
const targetRatio=tw/th;
const srcRatio=img.width/img.height;
let cropW,cropH,cropX,cropY;
if(srcRatio>targetRatio){
cropH=img.height;cropW=cropH*targetRatio;cropX=(img.width-cropW)/2;cropY=0;
}else{
cropW=img.width;cropH=cropW/targetRatio;cropX=0;cropY=(img.height-cropH)/2;
}
const c=document.createElement('canvas');c.width=tw;c.height=th;
const ctx=c.getContext('2d');
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
ctx.drawImage(img,cropX,cropY,cropW,cropH,0,0,tw,th);
imageData=c.toDataURL('image/png');
showToast('✅ '+opt.textContent.split(' (')[0]+' passport photo ready ('+tw+'×'+th+'px @300 DPI)');
finishWithProgress();
});
}
const btn=document.createElement('button');btn.textContent='📐 Resize';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyResize;
rx.appendChild(btn);
}
function applyResize(){
return _applyCanvas(async im=>{
const w=parseInt(document.getElementById('rz-w')?.value)||im.width;
const h=parseInt(document.getElementById('rz-h')?.value)||im.height;
const c=_canvas(w,h),x=c.getContext('2d');
x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
x.drawImage(im,0,0,w,h);
showToast('📐 Resized to '+w+'×'+h);
return c.toDataURL('image/png');
});
}
function showCompressToolPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🗜️ Image Compressor';
if(!rx)return;
rx.innerHTML='';
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);';
lbl.innerHTML='Quality: <span id="comp-val">80</span>%';
const sl=document.createElement('input');sl.type='range';sl.id='comp-q';sl.min=10;sl.max=100;sl.value=80;
sl.style.cssText='width:100%;accent-color:var(--accent);margin:8px 0 12px;';
sl.oninput=function(){document.getElementById('comp-val').textContent=this.value;};
const btn=document.createElement('button');btn.textContent='🗜️ Compress';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyCompress;
rx.appendChild(lbl);rx.appendChild(sl);rx.appendChild(btn);
}
function applyCompress(){
return _applyCanvas(async im=>{
const q=(Number(document.getElementById('comp-q')?.value ?? 80))/100;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0);
showToast('🗜️ Compressed (quality '+Math.round(q*100)+'%)');
return c.toDataURL('image/jpeg',q);
},'jpg');
}
function showConvertToolPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🔄 Convert Image';
if(!rx)return;
rx.innerHTML='';
const desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';desc.textContent='Choose output format:';
rx.appendChild(desc);
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:10px;';
[{l:'PNG',m:'image/png',e:'png',c:'linear-gradient(135deg,#5B4CE8,#6D28D9)'},{l:'JPG',m:'image/jpeg',e:'jpg',c:'linear-gradient(135deg,#B45309,#92400E)'},{l:'WEBP',m:'image/webp',e:'webp',c:'linear-gradient(135deg,#047857,#065F46)'}].forEach(function(f){
const btn=document.createElement('button');btn.textContent=f.l;
btn.style.cssText='padding:14px 8px;background:'+f.c+';color:#fff;border:none;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;';
btn.onclick=function(){applyConvert(f.m,f.e);};
grid.appendChild(btn);
});
rx.appendChild(grid);
}
function applyConvert(mime,ext){
mime=mime||'image/png';ext=ext||'png';
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
if(mime==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);}
x.drawImage(im,0,0);
showToast('🔄 Converted to '+ext.toUpperCase());
return c.toDataURL(mime,0.92);
},ext);
}
function showBrightnessToolPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='☀️ Brightness & Contrast';
if(!rx)return;
rx.innerHTML='';
function mkSlider(id,label,spanId,def){
const d=document.createElement('div');d.style.cssText='margin-bottom:10px;';
const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';
l.innerHTML=label+': <span id="'+spanId+'">'+def+'</span>%';
const sl=document.createElement('input');sl.type='range';sl.id=id;sl.min=0;sl.max=200;sl.value=def;
sl.style.cssText='width:100%;accent-color:var(--accent);';
sl.oninput=function(){document.getElementById(spanId).textContent=this.value;};
d.appendChild(l);d.appendChild(sl);return d;
}
rx.appendChild(mkSlider('br-b','Brightness','br-bv',100));
rx.appendChild(mkSlider('br-c','Contrast','br-cv',100));
rx.appendChild(mkSlider('br-s','Saturation','br-sv',100));
const btn=document.createElement('button');btn.textContent='☀️ Apply';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyBC;
rx.appendChild(btn);
}
function applyBC(){
return _applyCanvas(async im=>{
const b=(Number(document.getElementById('br-b')?.value ?? 100))/100;
const cv=(Number(document.getElementById('br-c')?.value ?? 100))/100;
const s=(Number(document.getElementById('br-s')?.value ?? 100))/100;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.filter='brightness('+b+') contrast('+cv+') saturate('+s+')';
x.drawImage(im,0,0);x.filter='none';
return c.toDataURL('image/png');
});
}
function showWatermarkToolPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🔖 Watermark Maker';
if(!rx)return;
rx.innerHTML='';
function mkLbl(t){const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l.textContent=t;return l;}
const ti=document.createElement('input');ti.type='text';ti.id='wm-text';ti.value='© ImageBoostAI';
ti.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;margin-bottom:8px;';
rx.appendChild(mkLbl('Watermark Text'));rx.appendChild(ti);
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;';
const d1=document.createElement('div');
const opLbl=document.createElement('label');opLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';
opLbl.innerHTML='Opacity: <span id="wm-opv">40</span>%';
const opSl=document.createElement('input');opSl.type='range';opSl.id='wm-op';opSl.min=10;opSl.max=100;opSl.value=40;opSl.style.cssText='width:100%;accent-color:var(--accent);';
opSl.oninput=function(){document.getElementById('wm-opv').textContent=this.value;};
d1.appendChild(opLbl);d1.appendChild(opSl);
const d2=document.createElement('div');
const ps=document.createElement('select');ps.id='wm-pos';
ps.style.cssText='width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;';
[['Bottom Right','br'],['Bottom Left','bl'],['Top Right','tr'],['Center','center']].forEach(function(o){const op=document.createElement('option');op.value=o[1];op.textContent=o[0];ps.appendChild(op);});
d2.appendChild(mkLbl('Position'));d2.appendChild(ps);
row.appendChild(d1);row.appendChild(d2);rx.appendChild(row);
const btn=document.createElement('button');btn.textContent='🔖 Add Watermark';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyWatermark;
rx.appendChild(btn);
}
function applyWatermark(){
return _applyCanvas(async im=>{
const text=document.getElementById('wm-text')?.value||'© ImageBoostAI';
const op=(Number(document.getElementById('wm-op')?.value ?? 40))/100;
const pos=document.getElementById('wm-pos')?.value||'br';
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const sz=Math.max(18,Math.round(c.width/22));
x.font='bold '+sz+'px Arial';x.globalAlpha=op;
x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.7)';x.lineWidth=Math.max(2,sz/10);
const tw=x.measureText(text).width,pad=Math.round(c.width*0.02);
let tx,ty;
if(pos==='br'){tx=c.width-tw-pad;ty=c.height-pad;}
else if(pos==='bl'){tx=pad;ty=c.height-pad;}
else if(pos==='tr'){tx=c.width-tw-pad;ty=sz+pad;}
else{tx=(c.width-tw)/2;ty=c.height/2;}
x.strokeText(text,tx,ty);x.fillText(text,tx,ty);x.globalAlpha=1;
return c.toDataURL('image/png');
});
}
function showBgChangerPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🖼️ Background Changer';
if(!rx)return;
rx.innerHTML='';
const desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';desc.textContent='Pick a new background (subject is cut out with AI first):';
rx.appendChild(desc);
const bgs=[
{l:'White Studio',c:['#ffffff','#ffffff']},{l:'Light Gray',c:['#f0f0f0','#f0f0f0']},
{l:'Dark Gray',c:['#555555','#555555']},{l:'Black',c:['#000000','#000000']},
{l:'Sky Blue',c:['#87CEEB','#87CEEB']},{l:'Forest Green',c:['#228B22','#228B22']},
{l:'Purple',c:['#667eea','#764ba2']},{l:'Sunset',c:['#f093fb','#f5576c']},
{l:'Ocean',c:['#4facfe','#00f2fe']},{l:'Mint',c:['#11998e','#38ef7d']}
];
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:10px;';
bgs.forEach(function(bg){
const btn=document.createElement('button');btn.textContent=bg.l;
const bgStyle=bg.c[0]===bg.c[1]?bg.c[0]:'linear-gradient(135deg,'+bg.c[0]+','+bg.c[1]+')';
const light=(bg.c[0]==='#ffffff'||bg.c[0]==='#f0f0f0');
btn.style.cssText='height:44px;border-radius:8px;border:2px solid rgba(255,255,255,.2);cursor:pointer;font-size:10px;font-weight:700;color:'+(light?'#333':'#fff')+';background:'+bgStyle+';font-family:inherit;';
btn.onclick=function(){applyBgChange(bg.c);};
grid.appendChild(btn);
});
rx.appendChild(grid);
const tip=document.createElement('p');tip.style.cssText='font-size:11px;color:var(--muted);';tip.textContent='First run downloads the AI model — can take a few seconds.';
rx.appendChild(tip);
}
function applyBackgroundChanger(){return applyBgChange(['#4facfe','#00f2fe']);}
function applyBgChange(colors){
const arr=Array.isArray(colors)?colors:['#4facfe','#00f2fe'];
return _applyCanvas(async im=>{
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
if(arr[0]===arr[1]){x.fillStyle=arr[0];x.fillRect(0,0,c.width,c.height);}
else{const grd=x.createLinearGradient(0,0,c.width,c.height);grd.addColorStop(0,arr[0]);grd.addColorStop(1,arr[1]);x.fillStyle=grd;x.fillRect(0,0,c.width,c.height);}
x.drawImage(cut,0,0,c.width,c.height);
return c.toDataURL('image/png');
});
}
window.__selRect=null;
function showObjectRemoverPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🧽 Object Remover';
if(!rx)return;
window.__selRect=null;
if(!imageData){rx.textContent='Upload a photo first, then drag over the area you want removed.';return;}
rx.innerHTML='';
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
hint.textContent='Drag over the object/area to remove. Works best on small objects over simple backgrounds — this blends nearby pixels, it is not full AI inpainting.';
rx.appendChild(hint);
const sel=_mkRectSelector({maxW:340,onChange:r=>{window.__selRect=r;}});
rx.appendChild(sel.element);
const btn=document.createElement('button');btn.textContent='🧽 Remove Selected Area';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:10px;';
btn.onclick=applyObjectRemover;
rx.appendChild(btn);
}
function applyObjectRemover(){
const r=window.__selRect;
if(!r){showToast('⚠️ Drag over the area to remove first');return;}
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const rx0=Math.round(r.x*im.width),ry0=Math.round(r.y*im.height);
const rw=Math.max(2,Math.round(r.w*im.width)),rh=Math.max(2,Math.round(r.h*im.height));
const pad=Math.round(Math.max(rw,rh)*0.7)+24;
const sx=Math.max(0,rx0-pad),sy=Math.max(0,ry0-pad);
const sw=Math.min(im.width-sx,rw+pad*2),sh=Math.min(im.height-sy,rh+pad*2);
x.save();
x.beginPath();x.rect(rx0,ry0,rw,rh);x.clip();
x.filter='blur(20px)';
x.drawImage(c,sx,sy,sw,sh,rx0,ry0,rw,rh);
x.filter='none';
x.restore();
return c.toDataURL('image/png');
});
}
function showObjectRecolorPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🎨 Object Replace → Recolor Area';
if(!rx)return;
window.__selRect=null;
if(!imageData){rx.textContent='Upload a photo first.';return;}
rx.innerHTML='';
const note=document.createElement('p');
note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.5;background:var(--bg3);padding:8px 10px;border-radius:8px;';
note.innerHTML='⚠️ <b>Honest note:</b> truly "replacing" an object with a different one needs a generative AI model (image diffusion) and isn\'t possible in a free, server-less browser tool. What this <i>can</i> do: change the color/tone of an area you select.';
rx.appendChild(note);
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';hint.textContent='Drag over the area to recolor:';
rx.appendChild(hint);
const sel=_mkRectSelector({maxW:340,onChange:r=>{window.__selRect=r;}});
rx.appendChild(sel.element);
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;';
const d1=document.createElement('div');
const l1=document.createElement('label');l1.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l1.textContent='New Color';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='rc-color';colorIn.value='#5b4ce8';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;padding:2px;';
d1.appendChild(l1);d1.appendChild(colorIn);
const d2=document.createElement('div');
const l2=document.createElement('label');l2.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l2.innerHTML='Intensity: <span id="rc-iv">55</span>%';
const intensity=document.createElement('input');intensity.type='range';intensity.id='rc-intensity';intensity.min=10;intensity.max=100;intensity.value=55;intensity.style.cssText='width:100%;accent-color:var(--accent);';
intensity.oninput=function(){document.getElementById('rc-iv').textContent=this.value;};
d2.appendChild(l2);d2.appendChild(intensity);
row.appendChild(d1);row.appendChild(d2);rx.appendChild(row);
const btn=document.createElement('button');btn.textContent='🎨 Apply Color';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyObjectReplace;
rx.appendChild(btn);
}
function applyObjectReplace(){
const r=window.__selRect;
if(!r){showToast('⚠️ Drag over an area first');return;}
const hexColor=document.getElementById('rc-color')?.value||'#5b4ce8';
const amount=(Number(document.getElementById('rc-intensity')?.value ?? 55))/100;
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const rx0=Math.round(r.x*im.width),ry0=Math.round(r.y*im.height);
const rw=Math.max(1,Math.round(r.w*im.width)),rh=Math.max(1,Math.round(r.h*im.height));
x.save();
x.beginPath();x.rect(rx0,ry0,rw,rh);x.clip();
x.globalAlpha=amount;
x.globalCompositeOperation='color';
x.fillStyle=hexColor;
x.fillRect(rx0,ry0,rw,rh);
x.restore();
return c.toDataURL('image/png');
});
}
function _mkCompareSlider(beforeSrc,afterSrc){
const wrap=document.createElement('div');
wrap.style.cssText='position:relative;width:100%;border-radius:16px;overflow:hidden;user-select:none;touch-action:none;background:repeating-conic-gradient(#e5e7eb 0% 25%,#fff 0% 50%) 50% / 20px 20px;';
const afterImg=document.createElement('img');
afterImg.id='outImg';afterImg.src=afterSrc;afterImg.alt='Edited photo result';
afterImg.style.cssText='display:block;width:100%;max-height:340px;object-fit:contain;';
wrap.appendChild(afterImg);
const beforeLayer=document.createElement('div');
beforeLayer.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;';
const beforeImg=document.createElement('img');
beforeImg.src=beforeSrc;beforeImg.alt='Original photo';
beforeImg.style.cssText='display:block;width:100%;height:100%;object-fit:contain;';
beforeLayer.appendChild(beforeImg);
wrap.appendChild(beforeLayer);
const handle=document.createElement('div');
handle.style.cssText='position:absolute;top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.15),0 2px 8px rgba(0,0,0,.3);cursor:ew-resize;';
const knob=document.createElement('div');
knob.textContent='⇔';
knob.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:34px;height:34px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;color:#333;box-shadow:0 2px 8px rgba(0,0,0,.35);cursor:ew-resize;';
handle.appendChild(knob);
wrap.appendChild(handle);
const lblBefore=document.createElement('div');lblBefore.textContent='Before';
lblBefore.style.cssText='position:absolute;top:8px;left:8px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;pointer-events:none;';
const lblAfter=document.createElement('div');lblAfter.textContent='After';
lblAfter.style.cssText='position:absolute;top:8px;right:8px;background:rgba(91,76,232,.85);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:100px;pointer-events:none;';
wrap.appendChild(lblBefore);wrap.appendChild(lblAfter);
function setPct(pct){
pct=Math.max(0,Math.min(100,pct));
beforeLayer.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';
handle.style.left='calc('+pct+'% - 1.5px)';
}
setPct(50);
let dragging=false;
function posPct(e){
const r=wrap.getBoundingClientRect();
const cx=(e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-r.left;
return (cx/r.width)*100;
}
function down(e){dragging=true;setPct(posPct(e));e.preventDefault();}
function move(e){if(!dragging)return;setPct(posPct(e));e.preventDefault();}
function up(){dragging=false;}
handle.addEventListener('mousedown',down);
wrap.addEventListener('mousedown',down);
window.addEventListener('mousemove',move);
window.addEventListener('mouseup',up);
handle.addEventListener('touchstart',down,{passive:false});
wrap.addEventListener('touchstart',down,{passive:false});
wrap.addEventListener('touchmove',move,{passive:false});
wrap.addEventListener('touchend',up);
return wrap;
}
function _downloadReady(data,ext){
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
function _mkMaskPainter(opts){
const maxW=(opts&&opts.maxW)||340;
const wrap=document.createElement('div');
wrap.style.cssText='position:relative;display:inline-block;max-width:100%;border-radius:10px;overflow:hidden;border:1.5px solid var(--border);touch-action:none;line-height:0;';
const imgCanvas=document.createElement('canvas');
imgCanvas.style.cssText='display:block;max-width:100%;';
const maskCanvas=document.createElement('canvas');
maskCanvas.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;cursor:crosshair;';
wrap.appendChild(imgCanvas);
wrap.appendChild(maskCanvas);
let brushSize=28,mode='paint';
const mctx=maskCanvas.getContext('2d');
const rawMask=document.createElement('canvas');
function loadImg(){
const img=new Image();
img.onload=function(){
const scale=Math.min(1,maxW/img.width);
const w=Math.round(img.width*scale),h=Math.round(img.height*scale);
imgCanvas.width=w;imgCanvas.height=h;
maskCanvas.width=w;maskCanvas.height=h;
rawMask.width=w;rawMask.height=h;
imgCanvas.getContext('2d').drawImage(img,0,0,w,h);
redraw();
};
img.src=imageData;
}
loadImg();
function redraw(){
mctx.clearRect(0,0,maskCanvas.width,maskCanvas.height);
mctx.save();mctx.globalAlpha=0.45;mctx.fillStyle='#5b4ce8';
mctx.drawImage(rawMask,0,0);
mctx.restore();
}
const rctx=rawMask.getContext('2d');
function stroke(x0,y0,x1,y1){
rctx.lineCap='round';rctx.lineJoin='round';rctx.lineWidth=brushSize;
rctx.globalCompositeOperation=mode==='erase'?'destination-out':'source-over';
rctx.strokeStyle='#fff';
rctx.beginPath();rctx.moveTo(x0,y0);rctx.lineTo(x1,y1);rctx.stroke();
rctx.beginPath();rctx.arc(x1,y1,brushSize/2,0,Math.PI*2);rctx.fillStyle='#fff';rctx.fill();
}
function posFromEvent(e){
const r=maskCanvas.getBoundingClientRect();
const sx=maskCanvas.width/r.width,sy=maskCanvas.height/r.height;
const cx=((e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-r.left)*sx;
const cy=((e.touches?(e.touches[0]||e.changedTouches[0]).clientY:e.clientY)-r.top)*sy;
return{x:cx,y:cy};
}
let drawing=false,lastX=0,lastY=0;
function down(e){drawing=true;const p=posFromEvent(e);lastX=p.x;lastY=p.y;stroke(p.x,p.y,p.x,p.y);redraw();e.preventDefault();}
function move(e){if(!drawing)return;const p=posFromEvent(e);stroke(lastX,lastY,p.x,p.y);lastX=p.x;lastY=p.y;redraw();e.preventDefault();}
function up(){drawing=false;}
maskCanvas.addEventListener('mousedown',down);
maskCanvas.addEventListener('mousemove',move);
window.addEventListener('mouseup',up);
maskCanvas.addEventListener('touchstart',down,{passive:false});
maskCanvas.addEventListener('touchmove',move,{passive:false});
maskCanvas.addEventListener('touchend',up);
return{
element:wrap,
setBrushSize:px=>{brushSize=px;},
setMode:m=>{mode=m;},
clear:()=>{rctx.clearRect(0,0,rawMask.width,rawMask.height);redraw();},
hasPaint:()=>{
const d=rctx.getImageData(0,0,rawMask.width,rawMask.height).data;
for(let i=3;i<d.length;i+=4)if(d[i]>10)return true;
return false;
},
getFullResMask:(fullW,fullH)=>{
const c=_canvas(fullW,fullH),cx=c.getContext('2d');
cx.imageSmoothingEnabled=true;cx.imageSmoothingQuality='high';
cx.drawImage(rawMask,0,0,fullW,fullH);
return c;
}
};
}
function _mkBrushControls(painter,sliderIdSuffix){
const ctrlRow=document.createElement('div');ctrlRow.style.cssText='display:flex;gap:8px;align-items:center;margin:10px 0;flex-wrap:wrap;';
const sizeLbl=document.createElement('label');sizeLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:flex;align-items:center;gap:6px;flex:1;min-width:150px;';
const spanId='brush-sizev-'+sliderIdSuffix;
sizeLbl.innerHTML='🖌️ Brush: <span id="'+spanId+'">28</span>px&nbsp;';
const sizeSl=document.createElement('input');sizeSl.type='range';sizeSl.min=8;sizeSl.max=90;sizeSl.value=28;
sizeSl.style.cssText='flex:1;accent-color:var(--accent);';
sizeSl.oninput=function(){document.getElementById(spanId).textContent=this.value;painter.setBrushSize(parseInt(this.value));};
sizeLbl.appendChild(sizeSl);
ctrlRow.appendChild(sizeLbl);
const eraseBtn=document.createElement('button');eraseBtn.textContent='🧹 Eraser';
eraseBtn.type='button';
eraseBtn.style.cssText='padding:8px 12px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;';
let erasing=false;
eraseBtn.onclick=function(){erasing=!erasing;painter.setMode(erasing?'erase':'paint');eraseBtn.style.background=erasing?'var(--accent)':'var(--bg3)';eraseBtn.style.color=erasing?'#fff':'var(--text)';};
ctrlRow.appendChild(eraseBtn);
const clearBtn=document.createElement('button');clearBtn.textContent='↺ Clear';
clearBtn.type='button';
clearBtn.style.cssText='padding:8px 12px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;';
clearBtn.onclick=function(){painter.clear();};
ctrlRow.appendChild(clearBtn);
return ctrlRow;
}
function showObjectRemoverPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🧽 Object Remover';
if(!rx)return;
window.__maskPainter=null;
if(!imageData){rx.textContent='Upload a photo first, then paint over what you want removed.';return;}
rx.innerHTML='';
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
hint.textContent='Paint over the object with the brush. This blends nearby pixels (a "heal" effect) — not full AI inpainting, so it works best on smaller objects over fairly simple backgrounds.';
rx.appendChild(hint);
const painter=_mkMaskPainter({maxW:340});
window.__maskPainter=painter;
rx.appendChild(painter.element);
rx.appendChild(_mkBrushControls(painter,'rm'));
const btn=document.createElement('button');btn.textContent='🧽 Remove Painted Area';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyObjectRemover;
rx.appendChild(btn);
}
function applyObjectRemover(){
const painter=window.__maskPainter;
if(!painter||!painter.hasPaint()){showToast('⚠️ Fırça ile silinecek alanı boyayın');return;}
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const maskCanvas=painter.getFullResMask(im.width,im.height);
const maskData=maskCanvas.getContext('2d').getImageData(0,0,im.width,im.height).data;
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur('+Math.max(8,Math.round(Math.max(im.width,im.height)*0.03))+'px)';
bctx.drawImage(im,0,0);
const blurData=bctx.getImageData(0,0,im.width,im.height).data;
const imgData=x.getImageData(0,0,im.width,im.height),px=imgData.data;
for(let i=0;i<maskData.length;i+=4){
const a=maskData[i]/255;
if(a>0.02){
px[i]=px[i]*(1-a)+blurData[i]*a;
px[i+1]=px[i+1]*(1-a)+blurData[i+1]*a;
px[i+2]=px[i+2]*(1-a)+blurData[i+2]*a;
}
}
x.putImageData(imgData,0,0);
return c.toDataURL('image/png');
});
}
function showObjectRecolorPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🎨 Object Replace → Recolor Area';
if(!rx)return;
window.__maskPainter=null;
if(!imageData){rx.textContent='Upload a photo first.';return;}
rx.innerHTML='';
const note=document.createElement('p');
note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.5;background:var(--bg3);padding:8px 10px;border-radius:8px;';
note.innerHTML='⚠️ <b>Honest note:</b> truly "replacing" an object with a different one needs a generative AI model (image diffusion) and isn\'t possible in a free, server-less browser tool. What this <i>can</i> do: change the color/tone of the area you paint.';
rx.appendChild(note);
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';hint.textContent='Paint the area to recolor:';
rx.appendChild(hint);
const painter=_mkMaskPainter({maxW:340});
window.__maskPainter=painter;
rx.appendChild(painter.element);
rx.appendChild(_mkBrushControls(painter,'rc'));
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;';
const d1=document.createElement('div');
const l1=document.createElement('label');l1.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l1.textContent='New Color';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='rc-color';colorIn.value='#5b4ce8';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;padding:2px;';
d1.appendChild(l1);d1.appendChild(colorIn);
const d2=document.createElement('div');
const l2=document.createElement('label');l2.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l2.innerHTML='Intensity: <span id="rc-iv">55</span>%';
const intensity=document.createElement('input');intensity.type='range';intensity.id='rc-intensity';intensity.min=10;intensity.max=100;intensity.value=55;intensity.style.cssText='width:100%;accent-color:var(--accent);';
intensity.oninput=function(){document.getElementById('rc-iv').textContent=this.value;};
d2.appendChild(l2);d2.appendChild(intensity);
row.appendChild(d1);row.appendChild(d2);rx.appendChild(row);
const btn=document.createElement('button');btn.textContent='🎨 Apply Color';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyObjectReplace;
rx.appendChild(btn);
}
function applyObjectReplace(){
const painter=window.__maskPainter;
if(!painter||!painter.hasPaint()){showToast('⚠️ Fırça ile bir alan boyayın');return;}
const hexColor=document.getElementById('rc-color')?.value||'#5b4ce8';
const amount=(Number(document.getElementById('rc-intensity')?.value ?? 55))/100;
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const maskCanvas=painter.getFullResMask(im.width,im.height);
const maskData=maskCanvas.getContext('2d').getImageData(0,0,im.width,im.height).data;
const recolorC=_canvas(im.width,im.height),rctx2=recolorC.getContext('2d');
rctx2.drawImage(im,0,0);
rctx2.globalCompositeOperation='color';
rctx2.fillStyle=hexColor;
rctx2.fillRect(0,0,im.width,im.height);
const recolorData=rctx2.getImageData(0,0,im.width,im.height).data;
const imgData=x.getImageData(0,0,im.width,im.height),px=imgData.data;
for(let i=0;i<maskData.length;i+=4){
const a=(maskData[i]/255)*amount;
if(a>0.01){
px[i]=px[i]*(1-a)+recolorData[i]*a;
px[i+1]=px[i+1]*(1-a)+recolorData[i+1]*a;
px[i+2]=px[i+2]*(1-a)+recolorData[i+2]*a;
}
}
x.putImageData(imgData,0,0);
return c.toDataURL('image/png');
});
}
function applyRotate(deg){
return _applyCanvas(async im=>{
const rad=deg*Math.PI/180;
const swap=(((deg%360)+360)%360)===90||(((deg%360)+360)%360)===270;
const w=swap?im.height:im.width,h=swap?im.width:im.height;
const c=_canvas(w,h),x=c.getContext('2d');
x.translate(w/2,h/2);x.rotate(rad);
x.drawImage(im,-im.width/2,-im.height/2);
showToast('↻ Rotated '+deg+'°');
return c.toDataURL('image/png');
});
}
function applyFlip(axis){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
if(axis==='h'){x.translate(im.width,0);x.scale(-1,1);}
else{x.translate(0,im.height);x.scale(1,-1);}
x.drawImage(im,0,0);
showToast(axis==='h'?'⇋ Flipped horizontally':'⇵ Flipped vertically');
return c.toDataURL('image/png');
});
}
(function(){
const _origShowCropToolPanel=showCropToolPanel;
window.showCropToolPanel=function(){
_origShowCropToolPanel();
const rx=document.getElementById('resultText');
if(!rx||!imageData)return;
const lbl=document.createElement('p');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);margin:12px 0 6px;';lbl.textContent='Rotate / Flip:';
rx.appendChild(lbl);
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:6px;';
[['↻ 90°',()=>applyRotate(90)],['↻ 180°',()=>applyRotate(180)],['⇋ Flip H',()=>applyFlip('h')],['⇵ Flip V',()=>applyFlip('v')]].forEach(function(pair){
const btn=document.createElement('button');btn.textContent=pair[0];
btn.style.cssText='padding:9px 4px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;';
btn.onclick=pair[1];
row.appendChild(btn);
});
rx.appendChild(row);
};
})();
function showBlurBackgroundPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='📷 Blur Background';
if(!rx)return;
rx.innerHTML='';
const desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';
desc.textContent='Subject is cut out with AI first, then only the background is blurred — the subject stays sharp.';
rx.appendChild(desc);
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);';
lbl.innerHTML='Blur Amount: <span id="bb-val">50</span>%';
const sl=document.createElement('input');sl.type='range';sl.id='bb-amount';sl.min=10;sl.max=100;sl.value=50;
sl.style.cssText='width:100%;accent-color:var(--accent);margin:8px 0 12px;';
sl.oninput=function(){document.getElementById('bb-val').textContent=this.value;};
const btn=document.createElement('button');btn.textContent='📷 Blur Background';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyBlurBackground;
rx.appendChild(lbl);rx.appendChild(sl);rx.appendChild(btn);
}
function applyBlurBackground(){
return _applyCanvas(async im=>{
const amount=(Number(document.getElementById('bb-amount')?.value ?? 50))/100;
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
const radius=Math.max(2,Math.round(Math.max(im.width,im.height)*0.05*amount));
x.filter='blur('+radius+'px)';
x.drawImage(im,0,0);
x.filter='none';
x.drawImage(cut,0,0,im.width,im.height);
return c.toDataURL('image/png');
});
}
function _mkTextPositioner(opts){
const maxW=(opts&&opts.maxW)||340;
const wrap=document.createElement('div');
wrap.style.cssText='position:relative;display:inline-block;max-width:100%;border-radius:10px;overflow:hidden;border:1.5px solid var(--border);cursor:grab;touch-action:none;line-height:0;';
const canvas=document.createElement('canvas');
canvas.style.cssText='display:block;max-width:100%;';
wrap.appendChild(canvas);
let img=null,pos={x:0.5,y:0.5};
const ctx=canvas.getContext('2d');
function draw(){
if(!img)return;
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img,0,0,canvas.width,canvas.height);
const opts2=getTextOpts();
const size=Math.max(8,Math.round(opts2.size*(canvas.width/img.naturalWidth)));
let fs='';
if(opts2.italic)fs+='italic ';
fs+=(opts2.bold?'900 ':'700 ')+size+'px "'+opts2.font+'"';
ctx.font=fs;
ctx.textAlign='center';ctx.textBaseline='middle';
const tx=pos.x*canvas.width,ty=pos.y*canvas.height;
ctx.lineWidth=Math.max(1,size/14);ctx.strokeStyle='rgba(0,0,0,.55)';ctx.fillStyle=opts2.color;
ctx.strokeText(opts2.text,tx,ty);ctx.fillText(opts2.text,tx,ty);
if(opts2.underline){
const w=ctx.measureText(opts2.text).width;
ctx.strokeStyle=opts2.color;ctx.lineWidth=Math.max(1,size/16);
ctx.beginPath();ctx.moveTo(tx-w/2,ty+size*0.42);ctx.lineTo(tx+w/2,ty+size*0.42);ctx.stroke();
}
}
function load(){
img=new Image();
img.onload=function(){
const scale=Math.min(1,maxW/img.width);
canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
draw();
};
img.src=imageData;
}
load();
let dragging=false;
function posFromEvent(e){
const r=canvas.getBoundingClientRect();
const cx=(e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-r.left;
const cy=(e.touches?(e.touches[0]||e.changedTouches[0]).clientY:e.clientY)-r.top;
return{x:Math.max(0,Math.min(1,cx/r.width)),y:Math.max(0,Math.min(1,cy/r.height))};
}
function down(e){dragging=true;pos=posFromEvent(e);draw();e.preventDefault();}
function move(e){if(!dragging)return;pos=posFromEvent(e);draw();e.preventDefault();}
function up(){dragging=false;}
canvas.addEventListener('mousedown',down);
canvas.addEventListener('mousemove',move);
window.addEventListener('mouseup',up);
canvas.addEventListener('touchstart',down,{passive:false});
canvas.addEventListener('touchmove',move,{passive:false});
canvas.addEventListener('touchend',up);
return{element:wrap,redraw:draw,getPos:()=>pos};
}
function getTextOpts(){
return{
text:document.getElementById('txt-input')?.value||'ImageBoostAI',
color:document.getElementById('txt-color')?.value||'#ffffff',
size:parseInt(document.getElementById('txt-size')?.value)||48,
font:document.getElementById('txt-font')?.value||'Arial',
bold:document.getElementById('txt-bold')?.classList.contains('active'),
italic:document.getElementById('txt-italic')?.classList.contains('active'),
underline:document.getElementById('txt-underline')?.classList.contains('active')
};
}
function showTextOverlayPanel(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='✍️ Add Text to Photo';
if(!rx)return;
window.__textPositioner=null;
if(!imageData){rx.textContent='Upload a photo first, then drag your text anywhere on it.';return;}
rx.innerHTML='';
function mkLbl(t){const l=document.createElement('label');l.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l.textContent=t;return l;}
const textIn=document.createElement('input');textIn.type='text';textIn.id='txt-input';textIn.value='ImageBoostAI';
textIn.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;margin-bottom:8px;';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='txt-color';colorIn.value='#ffffff';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;margin-bottom:8px;padding:2px;';
const sizeLbl=mkLbl('Size'); const sizeSpan=document.createElement('span');sizeSpan.id='txt-sizev';sizeSpan.textContent='48px';sizeLbl.appendChild(document.createTextNode(': '));sizeLbl.appendChild(sizeSpan);
const sizeSl=document.createElement('input');sizeSl.type='range';sizeSl.id='txt-size';sizeSl.min=14;sizeSl.max=140;sizeSl.value=48;
sizeSl.style.cssText='width:100%;accent-color:var(--accent);margin-bottom:8px;';
const fontSel=document.createElement('select');fontSel.id='txt-font';
fontSel.style.cssText='width:100%;padding:8px;border:1.5px solid var(--border);border-radius:8px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;margin-bottom:8px;';
['Arial','Georgia','Impact','Courier New','Times New Roman'].forEach(function(f){const op=document.createElement('option');op.value=f;op.textContent=f;fontSel.appendChild(op);});
const styleRow=document.createElement('div');styleRow.style.cssText='display:flex;gap:6px;margin-bottom:10px;';
function mkToggle(id,label){
const b=document.createElement('button');b.id=id;b.textContent=label;b.type='button';
b.style.cssText='flex:1;padding:8px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:700;font-family:inherit;';
b.onclick=function(){b.classList.toggle('active');b.style.background=b.classList.contains('active')?'var(--accent)':'var(--bg3)';b.style.color=b.classList.contains('active')?'#fff':'var(--text)';positioner&&positioner.redraw();};
return b;
}
const boldBtn=mkToggle('txt-bold','B');boldBtn.style.fontWeight='900';
const italicBtn=mkToggle('txt-italic','I');italicBtn.style.fontStyle='italic';
const underlineBtn=mkToggle('txt-underline','U');underlineBtn.style.textDecoration='underline';
styleRow.appendChild(boldBtn);styleRow.appendChild(italicBtn);styleRow.appendChild(underlineBtn);
const styleLbl=mkLbl('Style');
const styleGrid=document.createElement('div');styleGrid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;';
let txtStyle='solid';
const styleBtns=[['solid','🎨 Solid Color'],['photofill','🖼️ Photo Fill']];
styleBtns.forEach(function(s){
const b=document.createElement('button');b.type='button';b.textContent=s[1];b.dataset.style=s[0];
b.style.cssText='padding:9px 6px;border-radius:9px;border:1.5px solid '+(s[0]===txtStyle?'var(--accent)':'var(--border)')+';background:'+(s[0]===txtStyle?'rgba(91,76,232,.08)':'var(--bg3)')+';color:var(--text);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;';
b.onclick=function(){
txtStyle=s[0];
Array.prototype.forEach.call(styleGrid.querySelectorAll('button'),function(x){x.style.borderColor='var(--border)';x.style.background='var(--bg3)';});
b.style.borderColor='var(--accent)';b.style.background='rgba(91,76,232,.08)';
colorWrap.style.display=(txtStyle==='photofill')?'none':'block';
photoFillNote.style.display=(txtStyle==='photofill')?'block':'none';
};
styleGrid.appendChild(b);
});
rx.appendChild(mkLbl('Text'));rx.appendChild(textIn);
rx.appendChild(styleLbl);rx.appendChild(styleGrid);
const colorWrap=document.createElement('div');colorWrap.appendChild(mkLbl('Color'));colorWrap.appendChild(colorIn);
rx.appendChild(colorWrap);
const photoFillNote=document.createElement('p');photoFillNote.style.cssText='display:none;font-size:11.5px;color:var(--muted);margin:-4px 0 10px;line-height:1.5;';
photoFillNote.textContent='📸 Photo Fill: your uploaded photo will show through the letters — try big, bold text for the best effect.';
rx.appendChild(photoFillNote);
window.__txtStyleGetter=function(){return txtStyle;};
rx.appendChild(sizeLbl);rx.appendChild(sizeSl);
rx.appendChild(mkLbl('Font'));rx.appendChild(fontSel);
rx.appendChild(styleRow);
const dragHint=document.createElement('p');dragHint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:6px;';dragHint.textContent='Drag the text to position it:';
rx.appendChild(dragHint);
const positioner=_mkTextPositioner({maxW:340});
window.__textPositioner=positioner;
rx.appendChild(positioner.element);
textIn.oninput=()=>positioner.redraw();
colorIn.oninput=()=>positioner.redraw();
sizeSl.oninput=function(){sizeSpan.textContent=this.value+'px';positioner.redraw();};
fontSel.onchange=()=>positioner.redraw();
const btn=document.createElement('button');btn.textContent='✍️ Add Text';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:10px;';
btn.onclick=applyTextToPhoto;
rx.appendChild(btn);
}
function applyTextToPhoto(){
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
const o=getTextOpts();
const pos=window.__textPositioner?window.__textPositioner.getPos():{x:0.5,y:0.5};
let fs='';if(o.italic)fs+='italic ';fs+=(o.bold?'900 ':'700 ')+o.size+'px "'+o.font+'"';
const style=(window.__txtStyleGetter&&window.__txtStyleGetter())||'solid';
if(style==='photofill'){
x.font=fs;x.textAlign='center';x.textBaseline='middle';
const tx=pos.x*c.width,ty=pos.y*c.height;
x.fillText(o.text,tx,ty);
x.globalCompositeOperation='source-in';
x.drawImage(im,0,0,c.width,c.height);
x.globalCompositeOperation='destination-over';
x.fillStyle='#0B0F19';
x.fillRect(0,0,c.width,c.height);
x.globalCompositeOperation='source-over';
return c.toDataURL('image/png');
}
x.drawImage(im,0,0);
x.font=fs;x.textAlign='center';x.textBaseline='middle';
const tx=pos.x*c.width,ty=pos.y*c.height;
x.lineWidth=Math.max(2,o.size/14);x.strokeStyle='rgba(0,0,0,.55)';x.fillStyle=o.color;
x.strokeText(o.text,tx,ty);x.fillText(o.text,tx,ty);
if(o.underline){
const w=x.measureText(o.text).width;
x.strokeStyle=o.color;x.lineWidth=Math.max(1,o.size/16);
x.beginPath();x.moveTo(tx-w/2,ty+o.size*0.42);x.lineTo(tx+w/2,ty+o.size*0.42);x.stroke();
}
return c.toDataURL('image/png');
});
}
(function(){
const _origShowBgChangerPanel=showBgChangerPanel;
window.showBgChangerPanel=function(){
_origShowBgChangerPanel();
const rx=document.getElementById('resultText');
if(!rx)return;
const divider=document.createElement('p');divider.style.cssText='font-size:12px;font-weight:700;color:var(--muted);margin:10px 0 6px;';divider.textContent='Or upload your own background:';
rx.appendChild(divider);
const fileBtn=document.createElement('label');
fileBtn.style.cssText='display:block;width:100%;padding:10px;background:var(--bg3);border:1.5px dashed var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:600;font-size:12.5px;text-align:center;';
fileBtn.textContent='📁 Choose Image…';
const fileIn=document.createElement('input');fileIn.type='file';fileIn.accept='image/*';fileIn.style.display='none';
fileIn.onchange=function(){
const f=fileIn.files[0];if(!f)return;
const r=new FileReader();
r.onload=()=>{applyBgChangeImage(r.result);};
r.readAsDataURL(f);
};
fileBtn.appendChild(fileIn);
rx.appendChild(fileBtn);
};
})();
function applyBgChangeImage(bgDataUrl){
return _applyCanvas(async im=>{
const bgImg=await _img(bgDataUrl);
const cut=await _getCutoutImage(im);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
const s=Math.max(c.width/bgImg.width,c.height/bgImg.height);
const dw=bgImg.width*s,dh=bgImg.height*s;
x.drawImage(bgImg,(c.width-dw)/2,(c.height-dh)/2,dw,dh);
x.drawImage(cut,0,0,c.width,c.height);
return c.toDataURL('image/png');
});
}
(function(){
const _origShowResizeToolPanel=showResizeToolPanel;
window.showResizeToolPanel=function(){
_origShowResizeToolPanel();
const rx=document.getElementById('resultText');
if(!rx||!imageData)return;
const wEl=document.getElementById('rz-w'),hEl=document.getElementById('rz-h');
if(!wEl||!hEl)return;
const lockRow=document.createElement('label');
lockRow.style.cssText='display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--muted);margin:-4px 0 10px;cursor:pointer;';
const chk=document.createElement('input');chk.type='checkbox';chk.id='rz-lock';chk.checked=true;chk.style.cssText='accent-color:var(--accent);width:15px;height:15px;';
lockRow.appendChild(chk);lockRow.appendChild(document.createTextNode('🔗 Lock Aspect Ratio'));
wEl.parentElement.parentElement.insertBefore(lockRow,wEl.parentElement.parentElement.firstChild.nextSibling);
_img(imageData).then(im=>{
const ratio=im.width/im.height;
wEl.oninput=function(){if(chk.checked)hEl.value=Math.round(parseInt(wEl.value||0)/ratio);};
hEl.oninput=function(){if(chk.checked)wEl.value=Math.round(parseInt(hEl.value||0)*ratio);};
});
};
})();
(function(){
const _origShowCompressToolPanel=showCompressToolPanel;
window.showCompressToolPanel=function(){
_origShowCompressToolPanel();
const rx=document.getElementById('resultText');
if(!rx||!imageData)return;
const sl=document.getElementById('comp-q');
if(!sl)return;
const sizeInfo=document.createElement('p');sizeInfo.id='comp-sizeinfo';sizeInfo.style.cssText='font-size:12px;color:var(--muted);margin:6px 0 10px;';
sizeInfo.textContent='Original: ~'+Math.round(imageData.length*0.75/1024)+' KB';
sl.parentElement.insertBefore(sizeInfo,sl.nextSibling);
let liveTimer=null;
async function updateEstimate(){
const q=(parseInt(sl.value)||80)/100;
const im=await _img(imageData);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0);
const out=c.toDataURL('image/jpeg',q);
const kb=Math.round(out.length*0.75/1024);
const origKb=Math.round(imageData.length*0.75/1024);
sizeInfo.textContent='Original: ~'+origKb+' KB → Estimated: ~'+kb+' KB ('+Math.max(0,Math.round((1-kb/origKb)*100))+'% smaller)';
}
sl.addEventListener('input',function(){clearTimeout(liveTimer);liveTimer=setTimeout(updateEstimate,200);});
updateEstimate();
const tRow=document.createElement('div');tRow.style.cssText='display:flex;gap:8px;align-items:flex-end;margin:10px 0;';
const tCol=document.createElement('div');tCol.style.cssText='flex:1;';
const tLbl=document.createElement('label');tLbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';tLbl.textContent='Target size (KB, optional)';
const tIn=document.createElement('input');tIn.type='number';tIn.id='comp-target';tIn.placeholder='e.g. 500';tIn.min=10;
tIn.style.cssText='width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:14px;';
tCol.appendChild(tLbl);tCol.appendChild(tIn);
const tBtn=document.createElement('button');tBtn.textContent='🎯 Match Target';tBtn.type='button';
tBtn.style.cssText='padding:10px 14px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:700;font-size:12.5px;font-family:inherit;';
tBtn.onclick=async function(){
const targetKb=parseInt(tIn.value);if(!targetKb){showToast('⚠️ Enter a target size in KB');return;}
const im=await _img(imageData);
let lo=10,hi=100,bestQ=80;
for(let i=0;i<7;i++){
const mid=Math.round((lo+hi)/2);
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0);
const out=c.toDataURL('image/jpeg',mid/100);
const kb=out.length*0.75/1024;
if(kb>targetKb)hi=mid-1;else{bestQ=mid;lo=mid+1;}
}
sl.value=bestQ;document.getElementById('comp-val').textContent=bestQ;
updateEstimate();
showToast('🎯 Quality set to '+bestQ+'% to approximate '+targetKb+' KB');
};
tRow.appendChild(tCol);tRow.appendChild(tBtn);
rx.appendChild(tRow);
};
})();
(function(){
const _origShowConvertToolPanel=showConvertToolPanel;
window.showConvertToolPanel=function(){
_origShowConvertToolPanel();
const rx=document.getElementById('resultText');
if(!rx)return;
const lbl=document.createElement('label');lbl.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin:10px 0 4px;';lbl.textContent='Background color (used for JPG, since JPG has no transparency)';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='convert-bg';colorIn.value='#ffffff';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;padding:2px;';
rx.appendChild(lbl);rx.appendChild(colorIn);
};
})();
function applyConvert(mime,ext){
mime=mime||'image/png';ext=ext||'png';
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
if(mime==='image/jpeg'){x.fillStyle=document.getElementById('convert-bg')?.value||'#ffffff';x.fillRect(0,0,c.width,c.height);}
x.drawImage(im,0,0);
showToast('🔄 Converted to '+ext.toUpperCase());
return c.toDataURL(mime,0.92);
},ext);
}
(function(){
const _origShowWatermarkToolPanel=showWatermarkToolPanel;
window.showWatermarkToolPanel=function(){
_origShowWatermarkToolPanel();
const rx=document.getElementById('resultText');
if(!rx)return;
window.__wmLogoData=null;
const divider=document.createElement('p');divider.style.cssText='font-size:12px;font-weight:700;color:var(--muted);margin:10px 0 6px;';divider.textContent='Or use a logo image instead of text:';
rx.appendChild(divider);
const fileBtn=document.createElement('label');
fileBtn.style.cssText='display:block;width:100%;padding:10px;background:var(--bg3);border:1.5px dashed var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:600;font-size:12.5px;text-align:center;margin-bottom:4px;';
fileBtn.textContent='📁 Choose Logo (PNG recommended)…';
const fileIn=document.createElement('input');fileIn.type='file';fileIn.accept='image/*';fileIn.style.display='none';
fileIn.onchange=function(){
const f=fileIn.files[0];if(!f)return;
const r=new FileReader();
r.onload=()=>{window.__wmLogoData=r.result;fileBtn.textContent='✅ Logo selected: '+f.name;};
r.readAsDataURL(f);
};
fileBtn.appendChild(fileIn);
rx.appendChild(fileBtn);
const tileRow=document.createElement('label');
tileRow.style.cssText='display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--muted);margin:6px 0;cursor:pointer;';
const tileChk=document.createElement('input');tileChk.type='checkbox';tileChk.id='wm-tile';tileChk.style.cssText='accent-color:var(--accent);width:15px;height:15px;';
tileRow.appendChild(tileChk);tileRow.appendChild(document.createTextNode('🧱 Tile across the whole photo'));
rx.appendChild(tileRow);
};
})();
function applyWatermark(){
return _applyCanvas(async im=>{
const op=(Number(document.getElementById('wm-op')?.value ?? 40))/100;
const pos=document.getElementById('wm-pos')?.value||'br';
const tile=document.getElementById('wm-tile')?.checked;
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
if(window.__wmLogoData){
const logo=await _img(window.__wmLogoData);
const lw=Math.round(c.width*0.18),lh=Math.round(lw*(logo.height/logo.width));
x.globalAlpha=op;
if(tile){
const stepX=lw*1.8,stepY=lh*1.8;
for(let yy=-lh;yy<c.height+lh;yy+=stepY){
for(let xx=-lw;xx<c.width+lw;xx+=stepX){
x.save();x.translate(xx+lw/2,yy+lh/2);x.rotate(-0.4);x.drawImage(logo,-lw/2,-lh/2,lw,lh);x.restore();
}
}
}else{
const pad=Math.round(c.width*0.02);
let lx,ly;
if(pos==='br'){lx=c.width-lw-pad;ly=c.height-lh-pad;}
else if(pos==='bl'){lx=pad;ly=c.height-lh-pad;}
else if(pos==='tr'){lx=c.width-lw-pad;ly=pad;}
else{lx=(c.width-lw)/2;ly=(c.height-lh)/2;}
x.drawImage(logo,lx,ly,lw,lh);
}
x.globalAlpha=1;
return c.toDataURL('image/png');
}
const text=document.getElementById('wm-text')?.value||'© ImageBoostAI';
const sz=Math.max(18,Math.round(c.width/22));
x.font='bold '+sz+'px Arial';
if(tile){
x.globalAlpha=op*0.7;x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=Math.max(1,sz/14);
const tw=x.measureText(text).width,stepX=tw*1.8,stepY=sz*4;
for(let yy=0;yy<c.height+sz;yy+=stepY){
for(let xx=-tw;xx<c.width+tw;xx+=stepX){
x.save();x.translate(xx,yy);x.rotate(-0.4);x.strokeText(text,0,0);x.fillText(text,0,0);x.restore();
}
}
x.globalAlpha=1;
return c.toDataURL('image/png');
}
x.globalAlpha=op;
x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.7)';x.lineWidth=Math.max(2,sz/10);
const tw=x.measureText(text).width,pad=Math.round(c.width*0.02);
let tx,ty;
if(pos==='br'){tx=c.width-tw-pad;ty=c.height-pad;}
else if(pos==='bl'){tx=pad;ty=c.height-pad;}
else if(pos==='tr'){tx=c.width-tw-pad;ty=sz+pad;}
else{tx=(c.width-tw)/2;ty=c.height/2;}
x.strokeText(text,tx,ty);x.fillText(text,tx,ty);x.globalAlpha=1;
return c.toDataURL('image/png');
});
}
function showOCRTool(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🔎 Image to Text OCR';
if(!rx)return;
if(!imageData){rx.textContent='Upload a photo with text, then extract it.';return;}
rx.innerHTML='';
const desc=document.createElement('p');desc.style.cssText='font-size:13px;color:var(--muted);margin-bottom:10px;';
desc.textContent='Real text recognition (runs in your browser). Pick the language(s) in the photo:';
rx.appendChild(desc);
const langSel=document.createElement('select');langSel.id='ocr-lang';
langSel.style.cssText='width:100%;padding:9px;border:1.5px solid var(--border);border-radius:9px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;margin-bottom:12px;';
[['eng','English'],['tur','Türkçe'],['deu','Deutsch'],['fra','Français'],['spa','Español'],['ita','Italiano'],['por','Português'],['rus','Русский'],['ara','العربية'],['jpn','日本語'],['chi_sim','中文 (简体)'],['kor','한국어']].forEach(function(o){
const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]==='eng')op.selected=true;langSel.appendChild(op);
});
rx.appendChild(langSel);
const btn=document.createElement('button');btn.textContent='🔎 Extract Text';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyOCRTool;
rx.appendChild(btn);
}
async function applyOCRTool(){
if(!imageData){showToast('⚠️ Upload an image first');return;}
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText'),p=document.getElementById('progress'),b=document.getElementById('bar');
const lang=document.getElementById('ocr-lang')?.value||'eng';
if(p){p.style.display='block';if(b)b.style.width='30%';}
if(rt)rt.textContent='Reading text…';
if(rx)rx.textContent='Running OCR ('+lang+')…';
try{
if(rx)rx.textContent='Loading OCR engine (first use only)…';
await _ensureTesseract();
if(typeof Tesseract==='undefined')throw new Error('OCR engine not loaded (needs internet — this downloads a language model on first use)');
if(rx)rx.textContent='Running OCR ('+lang+')…';
const result=await Tesseract.recognize(imageData,lang);
const text=(result&&result.data&&result.data.text||'').trim()||'(No text detected)';
if(p)p.style.display='none';
if(rt)rt.textContent='✅ OCR Complete';
if(rx){
rx.innerHTML='';
const ta=document.createElement('textarea');ta.readOnly=true;ta.id='ocr-result-text';ta.value=text;
ta.style.cssText='width:100%;min-height:160px;padding:12px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg3);color:var(--text);font-family:inherit;font-size:13px;margin-bottom:10px;';
rx.appendChild(ta);
const btnRow=document.createElement('div');btnRow.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;';
const copyBtn=document.createElement('button');copyBtn.textContent='📋 Copy to Clipboard';
copyBtn.style.cssText='padding:10px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:700;font-size:12.5px;font-family:inherit;';
copyBtn.onclick=function(){navigator.clipboard.writeText(ta.value).then(()=>showToast('📋 Copied!'));};
const wordBtn=document.createElement('button');wordBtn.textContent='⬇ Download as Word';
wordBtn.style.cssText='padding:10px;background:var(--bg3);border:1.5px solid var(--border);border-radius:9px;cursor:pointer;color:var(--text);font-weight:700;font-size:12.5px;font-family:inherit;';
wordBtn.onclick=function(){
const html='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><pre style="font-family:Calibri,Arial,sans-serif;white-space:pre-wrap;">'+ta.value.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</pre></body></html>';
const blob=new Blob(['\ufeff',html],{type:'application/msword'});
const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='imageboostai-ocr.doc';a.click();
};
btnRow.appendChild(copyBtn);btnRow.appendChild(wordBtn);
rx.appendChild(btnRow);
}
const dl=document.getElementById('download');
if(dl){dl.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));dl.download='imageboostai-ocr.txt';dl.style.display='inline-block';dl.textContent='⬇ Download as TXT';}
const sb=document.getElementById('share-bar');if(sb)sb.style.display='flex';
showToast('✅ OCR complete');
addHistory&&addHistory('Image to Text OCR');
}catch(e){
if(p)p.style.display='none';
console.error('OCR failed:',e);
if(rt)rt.textContent='⚠️ OCR failed';
if(rx)rx.textContent='Could not run OCR: '+e.message+'. This needs an internet connection (downloads a language model on first use) and works best when the page is hosted via http/https rather than opened as a local file.';
showToast('⚠️ OCR failed — see message below');
}
}
function applyProductPhotoEditor(){
return _applyCanvas(async im=>{
const padX=Math.round(im.width*0.12),padTop=Math.round(im.height*0.08);
const shadowGap=Math.max(4,Math.round(im.height*0.015));
const reflH=Math.round(im.height*0.32);
const bottomPad=Math.round(im.height*0.05);
const c=_canvas(im.width+padX*2,padTop+im.height+shadowGap+reflH+bottomPad);
const x=c.getContext('2d');
x.fillStyle='#ffffff';x.fillRect(0,0,c.width,c.height);
const prodX=padX,prodY=padTop;
x.save();
x.filter='blur('+Math.max(6,Math.round(im.width*0.03))+'px)';
x.fillStyle='rgba(0,0,0,.24)';
x.beginPath();
x.ellipse(prodX+im.width/2,prodY+im.height+shadowGap,im.width*0.36,Math.max(4,im.height*0.045),0,0,Math.PI*2);
x.fill();
x.restore();
const reflLayer=_canvas(im.width,reflH),rlctx=reflLayer.getContext('2d');
rlctx.save();
rlctx.translate(0,im.height);
rlctx.scale(1,-1);
rlctx.globalAlpha=0.32;
rlctx.drawImage(im,0,0,im.width,im.height);
rlctx.restore();
const gradC=_canvas(im.width,reflH),gctx=gradC.getContext('2d');
const grad=gctx.createLinearGradient(0,0,0,reflH);
grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(255,255,255,1)');
gctx.fillStyle=grad;gctx.fillRect(0,0,im.width,reflH);
rlctx.globalCompositeOperation='destination-out';
rlctx.drawImage(gradC,0,0);
x.drawImage(reflLayer,prodX,prodY+im.height+shadowGap);
x.filter='contrast(1.06) saturate(1.08) brightness(1.03)';
x.drawImage(im,prodX,prodY,im.width,im.height);
x.filter='none';
return c.toDataURL('image/png');
});
}
function _mkLassoSelector(opts){
const maxW=(opts&&opts.maxW)||340;
const wrap=document.createElement('div');
wrap.style.cssText='position:relative;display:inline-block;max-width:100%;border-radius:10px;overflow:hidden;border:1.5px solid var(--border);cursor:crosshair;touch-action:none;line-height:0;';
const canvas=document.createElement('canvas');canvas.style.cssText='display:block;max-width:100%;';
wrap.appendChild(canvas);
let img=null,points=[],closed=false;
const ctx=canvas.getContext('2d');
function draw(){
if(!img)return;
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img,0,0,canvas.width,canvas.height);
if(points.length>0){
ctx.save();
ctx.strokeStyle='#5b4ce8';ctx.lineWidth=2;ctx.fillStyle='rgba(91,76,232,.28)';
ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);
if(closed){ctx.closePath();ctx.fill();}
ctx.stroke();
points.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#5b4ce8';ctx.fill();});
ctx.restore();
}
}
const img2=new Image();
img2.onload=function(){
const scale=Math.min(1,maxW/img2.width);
canvas.width=Math.round(img2.width*scale);canvas.height=Math.round(img2.height*scale);
img=img2;draw();
};
img2.src=imageData;
function posFromEvent(e){
const r=canvas.getBoundingClientRect();
return{x:((e.touches?(e.touches[0]||e.changedTouches[0]).clientX:e.clientX)-r.left)*canvas.width/r.width,y:((e.touches?(e.touches[0]||e.changedTouches[0]).clientY:e.clientY)-r.top)*canvas.height/r.height};
}
function click(e){
if(closed)return;
const p=posFromEvent(e);
if(points.length>2){
const d=Math.hypot(p.x-points[0].x,p.y-points[0].y);
if(d<12){closed=true;draw();return;}
}
points.push(p);draw();
e.preventDefault();
}
canvas.addEventListener('click',click);
// Touch taps generate the click event; do not add the same lasso point twice.
return{
element:wrap,
clear:()=>{points=[];closed=false;draw();},
hasSelection:()=>closed&&points.length>2,
getFullResMask:(fullW,fullH)=>{
const mc=_canvas(canvas.width,canvas.height),mctx=mc.getContext('2d');
mctx.fillStyle='#fff';
mctx.beginPath();mctx.moveTo(points[0].x,points[0].y);
for(let i=1;i<points.length;i++)mctx.lineTo(points[i].x,points[i].y);
mctx.closePath();mctx.fill();
const full=_canvas(fullW,fullH),fctx=full.getContext('2d');
fctx.imageSmoothingEnabled=true;fctx.imageSmoothingQuality='high';
fctx.drawImage(mc,0,0,fullW,fullH);
return full;
}
};
}
function _mkSelectionModeSwitcher(onBrush,onLasso){
const row=document.createElement('div');row.style.cssText='display:flex;gap:6px;margin-bottom:8px;';
const brushBtn=document.createElement('button');brushBtn.textContent='🖌️ Brush';brushBtn.type='button';
const lassoBtn=document.createElement('button');lassoBtn.textContent='📐 Lasso';lassoBtn.type='button';
[brushBtn,lassoBtn].forEach(b=>{b.style.cssText='flex:1;padding:8px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;font-weight:700;font-family:inherit;font-size:12.5px;';});
function setActive(which){
brushBtn.style.background=which==='brush'?'var(--accent)':'var(--bg3)';brushBtn.style.color=which==='brush'?'#fff':'var(--text)';
lassoBtn.style.background=which==='lasso'?'var(--accent)':'var(--bg3)';lassoBtn.style.color=which==='lasso'?'#fff':'var(--text)';
}
brushBtn.onclick=()=>{setActive('brush');onBrush();};
lassoBtn.onclick=()=>{setActive('lasso');onLasso();};
setActive('brush');
row.appendChild(brushBtn);row.appendChild(lassoBtn);
return row;
}
(function(){
window.showObjectRemoverPanel=function(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🧽 Object Remover';
if(!rx)return;
window.__maskPainter=null;window.__lassoSelector=null;
if(!imageData){rx.textContent='Upload a photo first, then select what you want removed.';return;}
rx.innerHTML='';
const hint=document.createElement('p');hint.style.cssText='font-size:12px;color:var(--muted);margin-bottom:8px;';
hint.textContent='Brush: paint over the area. Lasso: click points around it, click near the start to close. Blends nearby pixels — not full AI inpainting.';
rx.appendChild(hint);
const body=document.createElement('div');
function renderBrush(){
body.innerHTML='';
const painter=_mkMaskPainter({maxW:340});
window.__maskPainter=painter;window.__lassoSelector=null;
body.appendChild(painter.element);
body.appendChild(_mkBrushControls(painter,'rm'));
}
function renderLasso(){
body.innerHTML='';
const lasso=_mkLassoSelector({maxW:340});
window.__lassoSelector=lasso;window.__maskPainter=null;
body.appendChild(lasso.element);
const clearBtn=document.createElement('button');clearBtn.textContent='↺ Clear';clearBtn.type='button';
clearBtn.style.cssText='margin-top:8px;padding:8px 12px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;';
clearBtn.onclick=()=>lasso.clear();
body.appendChild(clearBtn);
}
rx.appendChild(_mkSelectionModeSwitcher(renderBrush,renderLasso));
rx.appendChild(body);
renderBrush();
const btn=document.createElement('button');btn.textContent='🧽 Remove Selected Area';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;margin-top:10px;';
btn.onclick=applyObjectRemover;
rx.appendChild(btn);
};
})();
(function(){
window.showObjectRecolorPanel=function(){
const rt=document.getElementById('resultTitle'),rx=document.getElementById('resultText');
const p=document.getElementById('progress');if(p)p.style.display='none';
if(rt)rt.textContent='🎨 Object Replace → Recolor Area';
if(!rx)return;
window.__maskPainter=null;window.__lassoSelector=null;
if(!imageData){rx.textContent='Upload a photo first.';return;}
rx.innerHTML='';
const note=document.createElement('p');
note.style.cssText='font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.5;background:var(--bg3);padding:8px 10px;border-radius:8px;';
note.innerHTML='⚠️ <b>Honest note:</b> truly "replacing" an object with a different one needs a generative AI model (image diffusion) and isn\'t possible in a free, server-less browser tool. What this <i>can</i> do: change the color/tone of the area you select.';
rx.appendChild(note);
const body=document.createElement('div');
function renderBrush(){
body.innerHTML='';
const painter=_mkMaskPainter({maxW:340});
window.__maskPainter=painter;window.__lassoSelector=null;
body.appendChild(painter.element);
body.appendChild(_mkBrushControls(painter,'rc'));
}
function renderLasso(){
body.innerHTML='';
const lasso=_mkLassoSelector({maxW:340});
window.__lassoSelector=lasso;window.__maskPainter=null;
body.appendChild(lasso.element);
const clearBtn=document.createElement('button');clearBtn.textContent='↺ Clear';clearBtn.type='button';
clearBtn.style.cssText='margin-top:8px;padding:8px 12px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:600;font-size:12px;font-family:inherit;';
clearBtn.onclick=()=>lasso.clear();
body.appendChild(clearBtn);
}
rx.appendChild(_mkSelectionModeSwitcher(renderBrush,renderLasso));
rx.appendChild(body);
renderBrush();
const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;';
const d1=document.createElement('div');
const l1=document.createElement('label');l1.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l1.textContent='New Color';
const colorIn=document.createElement('input');colorIn.type='color';colorIn.id='rc-color';colorIn.value='#5b4ce8';
colorIn.style.cssText='width:100%;height:36px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;padding:2px;';
d1.appendChild(l1);d1.appendChild(colorIn);
const d2=document.createElement('div');
const l2=document.createElement('label');l2.style.cssText='font-size:12px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;';l2.innerHTML='Intensity: <span id="rc-iv">55</span>%';
const intensity=document.createElement('input');intensity.type='range';intensity.id='rc-intensity';intensity.min=10;intensity.max=100;intensity.value=55;intensity.style.cssText='width:100%;accent-color:var(--accent);';
intensity.oninput=function(){document.getElementById('rc-iv').textContent=this.value;};
d2.appendChild(l2);d2.appendChild(intensity);
row.appendChild(d1);row.appendChild(d2);rx.appendChild(row);
const btn=document.createElement('button');btn.textContent='🎨 Apply Color';
btn.style.cssText='width:100%;padding:12px;background:var(--gp);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;';
btn.onclick=applyObjectReplace;
rx.appendChild(btn);
};
})();
function _getActiveSelectionMask(fullW,fullH){
if(window.__lassoSelector&&window.__lassoSelector.hasSelection())return window.__lassoSelector.getFullResMask(fullW,fullH);
if(window.__maskPainter&&window.__maskPainter.hasPaint())return window.__maskPainter.getFullResMask(fullW,fullH);
return null;
}
function applyObjectRemover(){
const hasSel=(window.__lassoSelector&&window.__lassoSelector.hasSelection())||(window.__maskPainter&&window.__maskPainter.hasPaint());
if(!hasSel){showToast('⚠️ Select an area first (brush or lasso)');return;}
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const maskCanvas=_getActiveSelectionMask(im.width,im.height);
const maskData=maskCanvas.getContext('2d').getImageData(0,0,im.width,im.height).data;
const blurC=_canvas(im.width,im.height),bctx=blurC.getContext('2d');
bctx.filter='blur('+Math.max(8,Math.round(Math.max(im.width,im.height)*0.03))+'px)';
bctx.drawImage(im,0,0);
const blurData=bctx.getImageData(0,0,im.width,im.height).data;
const imgData=x.getImageData(0,0,im.width,im.height),px=imgData.data;
for(let i=0;i<maskData.length;i+=4){
const a=maskData[i]/255;
if(a>0.02){
px[i]=px[i]*(1-a)+blurData[i]*a;
px[i+1]=px[i+1]*(1-a)+blurData[i+1]*a;
px[i+2]=px[i+2]*(1-a)+blurData[i+2]*a;
}
}
x.putImageData(imgData,0,0);
return c.toDataURL('image/png');
});
}
function applyObjectReplace(){
const hasSel=(window.__lassoSelector&&window.__lassoSelector.hasSelection())||(window.__maskPainter&&window.__maskPainter.hasPaint());
if(!hasSel){showToast('⚠️ Select an area first (brush or lasso)');return;}
const hexColor=document.getElementById('rc-color')?.value||'#5b4ce8';
const amount=(Number(document.getElementById('rc-intensity')?.value ?? 55))/100;
return _applyCanvas(async im=>{
const c=_canvas(im.width,im.height),x=c.getContext('2d');
x.drawImage(im,0,0);
const maskCanvas=_getActiveSelectionMask(im.width,im.height);
const maskData=maskCanvas.getContext('2d').getImageData(0,0,im.width,im.height).data;
const recolorC=_canvas(im.width,im.height),rctx2=recolorC.getContext('2d');
rctx2.drawImage(im,0,0);
rctx2.globalCompositeOperation='color';
rctx2.fillStyle=hexColor;
rctx2.fillRect(0,0,im.width,im.height);
const recolorData=rctx2.getImageData(0,0,im.width,im.height).data;
const imgData=x.getImageData(0,0,im.width,im.height),px=imgData.data;
for(let i=0;i<maskData.length;i+=4){
const a=(maskData[i]/255)*amount;
if(a>0.01){
px[i]=px[i]*(1-a)+recolorData[i]*a;
px[i+1]=px[i+1]*(1-a)+recolorData[i+1]*a;
px[i+2]=px[i+2]*(1-a)+recolorData[i+2]*a;
}
}
x.putImageData(imgData,0,0);
return c.toDataURL('image/png');
});
}
(function(){
const _orig=_mkCompareSlider;
window._mkCompareSlider=function(beforeSrc,afterSrc){
const wrap=_orig(beforeSrc,afterSrc);
const zoomRow=document.createElement('div');
zoomRow.style.cssText='display:flex;gap:6px;margin-top:8px;';
[['100%',1],['200%',2]].forEach(function(pair){
const btn=document.createElement('button');btn.textContent='🔍 '+pair[0];btn.type='button';
btn.style.cssText='padding:7px 12px;background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text);font-weight:700;font-size:12px;font-family:inherit;';
btn.onclick=function(){
wrap.style.transform='scale('+pair[1]+')';
wrap.style.transformOrigin='top left';
wrap.style.marginBottom=pair[1]>1?((pair[1]-1)*100)+'%':'0';
};
zoomRow.appendChild(btn);
});
const holder=document.createElement('div');
holder.style.cssText='overflow:auto;max-height:420px;';
holder.appendChild(wrap);
const outer=document.createElement('div');
outer.appendChild(holder);
outer.appendChild(zoomRow);
return outer;
};
})();
