(function(root){
'use strict';
function dimensions(w,h){w=Number(w);h=Number(h);if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>16384||h>16384||w*h>40000000)throw Error('Use whole-number dimensions above zero, up to 16,384 per side and 40 megapixels total.');return {width:w,height:h};}
function mimeInfo(data){const m=/^data:(image\/(?:png|jpeg|webp));base64,/.exec(data);if(!m)throw Error('The browser could not encode this image. Reduce its dimensions and retry.');return {mime:m[1],ext:m[1]==='image/jpeg'?'jpg':m[1].split('/')[1],bytes:Math.floor((data.length-data.indexOf(',')-1)*3/4)-(data.endsWith('==')?2:data.endsWith('=')?1:0)};}
function number(value,fallback,min,max){const n=value==null||value===''?fallback:Number(value);if(!Number.isFinite(n)||n<min||n>max)throw Error('Choose a value between '+min+' and '+max+'.');return n;}
function autoLevels(pixels,strength=.65){const hist=[new Uint32Array(256),new Uint32Array(256),new Uint32Array(256)];let total=0;for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]===0)continue;total++;for(let c=0;c<3;c++)hist[c][pixels[i+c]]++;}if(!total)return pixels;const range=hist.map(h=>{let sum=0,lo=0,hi=255;for(let i=0;i<256;i++){sum+=h[i];if(sum>=total*.01){lo=i;break;}}sum=0;for(let i=255;i>=0;i--){sum+=h[i];if(sum>=total*.01){hi=i;break;}}return [lo,hi];});for(let i=0;i<pixels.length;i+=4){if(!pixels[i+3])continue;for(let c=0;c<3;c++){const [lo,hi]=range[c];if(hi-lo<8)continue;const v=pixels[i+c];pixels[i+c]=Math.max(0,Math.min(255,v*(1-strength)+(v-lo)*255/(hi-lo)*strength));}}return pixels;}
// Boundary propagation: selected pixels are filled from neighboring unselected pixels.
// This is deterministic local repair, not semantic/generative reconstruction.
function repair(pixels,mask,w,h){dimensions(w,h);const n=w*h,known=new Uint8Array(n),queued=new Uint8Array(n),queue=new Int32Array(n),out=new Uint8ClampedArray(pixels);let tail=0,selected=0;
for(let i=0;i<n;i++){known[i]=mask[i*4]<=8?1:0;if(!known[i])selected++;}
if(!selected)throw Error('Select an area to repair first.');if(selected===n)throw Error('Leave some surrounding image unselected so it can supply replacement pixels.');
function near(i,cb){const x=i%w;if(x)cb(i-1);if(x<w-1)cb(i+1);if(i>=w)cb(i-w);if(i<n-w)cb(i+w);}
for(let i=0;i<n;i++)if(!known[i]){let edge=false;near(i,j=>{if(known[j])edge=true;});if(edge){queue[tail++]=i;queued[i]=1;}}
for(let head=0;head<tail;head++){const i=queue[head],s=[0,0,0];let k=0;near(i,j=>{if(known[j]){k++;for(let c=0;c<3;c++)s[c]+=out[j*4+c];}});if(!k)continue;for(let c=0;c<3;c++)out[i*4+c]=s[c]/k;known[i]=1;near(i,j=>{if(!known[j]&&!queued[j]){queued[j]=1;queue[tail++]=j;}});}
for(let i=0;i<n;i++){const a=mask[i*4]/255;for(let c=0;c<3;c++)pixels[i*4+c]=pixels[i*4+c]*(1-a)+out[i*4+c]*a;}return pixels;}
const api={dimensions,mimeInfo,number,autoLevels,repair};root.IBAImageCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
