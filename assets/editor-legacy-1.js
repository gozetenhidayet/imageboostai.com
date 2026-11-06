
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
'ad_storage':'denied',
'ad_user_data':'denied',
'ad_personalization':'denied',
'analytics_storage':'denied',
'wait_for_update':500
});
gtag('js',new Date());
function trackEvent(action,category,label){
if(typeof gtag!=='undefined'){
gtag('event',action,{event_category:category,event_label:label});
}
}
var IBA_GA_ID='G-2V873PRCTP';
var IBA_CLARITY_ID='PASTE_CLARITY_ID';
var IBA_ADSENSE_CLIENT='ca-pub-3359266836868361';
var iba_ga_loaded=false, iba_clarity_loaded=false, iba_ads_loaded=false;
function iba_loadScript(src,attrs){
var s=document.createElement('script');
s.src=src; s.async=true;
if(attrs)for(var k in attrs)s.setAttribute(k,attrs[k]);
document.head.appendChild(s);
return s;
}
function loadAnalytics(){
if(iba_ga_loaded)return; iba_ga_loaded=true;
iba_loadScript('https://www.googletagmanager.com/gtag/js?id='+IBA_GA_ID);
gtag('config',IBA_GA_ID,{send_page_view:true});
if(!iba_clarity_loaded && IBA_CLARITY_ID && IBA_CLARITY_ID.indexOf('PASTE_')!==0){
iba_clarity_loaded=true;
(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script",IBA_CLARITY_ID);
}
}
function loadAds(){
if(!window.IBA_ADS_ENABLED)return; // Enable only after account approval and required certified consent setup.
if(iba_ads_loaded)return; iba_ads_loaded=true;
iba_loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+IBA_ADSENSE_CLIENT,{crossorigin:'anonymous'});
(window.adsbygoogle=window.adsbygoogle||[]).push({
google_ad_client:IBA_ADSENSE_CLIENT,
enable_page_level_ads:true
});
}
