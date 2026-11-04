// Counts page views and video plays for the morning report: the page, the day and where the link came from
// (?src=wa in a WhatsApp link, or the referring site). No cookies, nothing stored on the phone, and the database
// never sees the visitor's internet address (count_visit in migration 0032).
(function () {
  try {
    if (document.querySelector('meta[name="nest-mode"][content="preview"]')) return;
    var URL_ = 'https://tjdyxmechwstuthessgf.supabase.co/rest/v1/rpc/count_visit';
    var KEY = 'sb_publishable_gnLp7DbXk4nv-OymIT4WJQ_UkHgckG0';
    var q = new URLSearchParams(location.search);
    var src = q.get('src') || q.get('utm_source') || q.get('utm_campaign') || '';
    if (!src && document.referrer) {
      try {
        var h = new URL(document.referrer).hostname;
        if (h === location.hostname) src = 'site';
        else if (/whatsapp/.test(h)) src = 'wa';
        else if (/facebook|fb\./.test(h)) src = 'fb';
        else if (/instagram/.test(h)) src = 'ig';
        else if (/google/.test(h)) src = 'google';
        else src = 'other';
      } catch (e) {}
    }
    var hit = function (page) {
      fetch(URL_, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', apikey: KEY },
        body: JSON.stringify({ page: page, src: src || null }) }).catch(function () {});
    };
    hit(location.pathname.replace(/index\.html$/, '') || '/');
    var played = false;
    document.addEventListener('play', function (e) {
      if (!played && e.target && e.target.tagName === 'VIDEO') { played = true; hit('video'); }
    }, true);
  } catch (e) {}
})();
