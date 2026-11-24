/* Luana Bomfanti · Nail Designer — interações */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5541987186365";

  /* Header elevation on scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Year in footer */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Booking form -> WhatsApp */
  var form = document.getElementById("booking-form");
  if (form) {
    var nameInput = document.getElementById("nome");
    var serviceInput = document.getElementById("servico");
    var dayInput = document.getElementById("dia");
    var error = document.getElementById("form-error");

    // Do not allow past days in the date picker
    var today = new Date();
    var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    if (dayInput) dayInput.min = iso;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = nameInput.value.trim();
      var service = serviceInput.value;
      var day = dayInput.value;

      if (!name || !service || !day) {
        showError(true);
        if (!name) nameInput.focus();
        else if (!service) serviceInput.focus();
        else dayInput.focus();
        return;
      }

      showError(false);

      var parts = day.split("-");
      var formattedDay = parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : day;

      var message =
        "Olá, Luana! Meu nome é " + name + " e gostaria de agendar " +
        service.toLowerCase() + " para o dia " + formattedDay +
        ". Vi seu site e amei o trabalho! 💅";

      window.open(
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
        "_blank",
        "noopener"
      );
    });

    [nameInput, serviceInput, dayInput].forEach(function (field) {
      field.addEventListener("input", function () {
        if (error && !error.hidden) showError(false);
      });
    });

    function showError(show) {
      if (!error) return;
      error.hidden = !show;
    }
  }

  /* Reveal on scroll (subtle, respects reduced motion) */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".section-head, .card, .tile, .review, .booking-card, .location, .g-badge"
    );
    targets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = Number(el.dataset.delay || 0);
          el.style.transitionDelay = delay + "ms";
          el.style.opacity = "1";
          el.style.transform = "none";
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el, i) {
      var siblings = el.parentElement ? el.parentElement.children : [];
      var index = Array.prototype.indexOf.call(siblings, el);
      if (el.classList.contains("card") || el.classList.contains("review")) {
        el.dataset.delay = String(Math.min(index, 3) * 70);
      }
      observer.observe(el);
    });
  }
})();
