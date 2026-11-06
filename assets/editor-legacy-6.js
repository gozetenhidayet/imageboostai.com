
  (function () {
    var STORAGE_KEY = "tnStickyWidgetDismissedUntil";
    var DISMISS_DAYS = 7; // kapatınca kaç gün tekrar göstermesin

    var widget = document.getElementById("tn-sticky-widget");
    if (!widget) return;

    try {
      var until = localStorage.getItem(STORAGE_KEY);
      if (until && Date.now() < parseInt(until, 10)) {
        widget.hidden = true;
      }
    } catch (e) {
      /* localStorage kapalıysa sessizce yoksay, widget normal görünsün */
    }

    var closeBtn = document.getElementById("tn-sticky-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        widget.hidden = true;
        try {
          var expires = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
          localStorage.setItem(STORAGE_KEY, String(expires));
        } catch (e) {}
      });
    }

    /* Avoid overlapping the site's cookie consent bar (also fixed to the
       bottom of the screen, full width) — sit above it while it's shown,
       then settle back to the default corner spot once it's dismissed. */
    var cookieBar = document.getElementById("cookie-bar");
    function adjustForCookieBar() {
      if (cookieBar && window.getComputedStyle(cookieBar).display !== "none") {
        widget.style.bottom = (cookieBar.offsetHeight + 16) + "px";
      } else {
        widget.style.bottom = "";
      }
    }
    adjustForCookieBar();
    if (cookieBar && window.MutationObserver) {
      new MutationObserver(adjustForCookieBar).observe(cookieBar, { attributes: true, attributeFilter: ["style"] });
    }
  })();
