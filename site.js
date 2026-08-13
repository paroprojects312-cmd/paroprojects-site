/* Paro Projects - GA4 conversion tracking.
   Fires an event for every call, quote, and review click so you can see in
   Analytics which parts of the site actually generate leads. */
(function () {
  function send(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    var where = el.getAttribute('data-cta');
    var href = el.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      send('phone_call_click', { location: where, page: location.pathname });
    } else if (href.indexOf('mailto:') === 0) {
      send('email_click', { location: where, page: location.pathname });
    } else if (where.indexOf('review') !== -1) {
      send('review_link_click', { location: where });
    } else {
      send('quote_cta_click', { location: where, page: location.pathname });
    }
  });

  // JobTread renders its own success state; watch for it and log the conversion.
  var form = document.querySelector('[data-jobtread-web-form]');
  if (form && 'MutationObserver' in window) {
    var parent = form.parentNode;
    new MutationObserver(function (muts, obs) {
      if (!document.body.contains(form)) {
        send('generate_lead', { form: 'jobtread_contact' });
        obs.disconnect();
      }
    }).observe(parent, { childList: true, subtree: true });
  }
})();
