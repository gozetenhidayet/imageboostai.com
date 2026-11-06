
function _loadScriptOnce(src){
return new Promise((resolve,reject)=>{
const existing=document.querySelector('script[data-lazy-src="'+src+'"]');
if(existing){
if(existing.dataset.loaded==='1')return resolve();
existing.addEventListener('load',()=>resolve());
existing.addEventListener('error',reject);
return;
}
const s=document.createElement('script');
s.src=src; s.dataset.lazySrc=src;
s.onload=()=>{s.dataset.loaded='1';resolve();};
s.onerror=reject;
document.head.appendChild(s);
});
}
let _deeplabPromise=null;
function _ensureDeeplab(){
if(_deeplabPromise)return _deeplabPromise;
_deeplabPromise=(async()=>{
try{
await _loadScriptOnce('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js');
await _loadScriptOnce('https://cdn.jsdelivr.net/npm/@tensorflow-models/deeplab@0.2.2/dist/deeplab.min.js');
if(typeof deeplab==='undefined'||typeof tf==='undefined')return null;
const model=await deeplab.load({base:'pascal',quantizationBytes:2});
window.__deeplabReady=true;
return model;
}catch(e){ _deeplabPromise=null; return null; }
})();
return _deeplabPromise;
}
let _imglyPromise=null;
function _ensureImgly(){
if(_imglyPromise)return _imglyPromise;
_imglyPromise=(async()=>{
try{
const mod=await import('https://esm.sh/@imgly/background-removal@1.7.0');
window.__imglyRemoveBackground=(src)=>mod.default(src,{model:'small'});
window.__imglyReady=true;
return true;
}catch(e){ return false; }
})();
return _imglyPromise;
}
let _tesseractPromise=null;
function _ensureTesseract(){
if(_tesseractPromise)return _tesseractPromise;
_tesseractPromise=_loadScriptOnce('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js').catch(e=>{_tesseractPromise=null;throw e;});
return _tesseractPromise;
}
