(function () {
  "use strict";
  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* cabecera fija + barra de progreso */
  var cab = document.querySelector(".cabecera");
  var barra = document.querySelector(".progreso");
  function alScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    if (cab) cab.classList.toggle("fija", y > 30);
    if (barra) barra.style.transform = "scaleX(" + (alto > 0 ? y / alto : 0) + ")";
  }
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  /* menú móvil */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".menu");
  if (burger && menu) {
    function cerrar() {
      menu.classList.remove("abierto");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    burger.addEventListener("click", function () {
      var abre = !menu.classList.contains("abierto");
      menu.classList.toggle("abierto", abre);
      burger.setAttribute("aria-expanded", abre ? "true" : "false");
      document.body.style.overflow = abre ? "hidden" : "";
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
  }

  /* revelado al entrar en pantalla */
  var objetivos = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducir) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visto"); io.unobserve(en.target); }
      });
    }, { threshold: 0.18 });
    objetivos.forEach(function (el) { io.observe(el); });
  } else {
    objetivos.forEach(function (el) { el.classList.add("visto"); });
  }

  /* ruta de 3 pasos: se traza cuando aparece */
  var ruta = document.querySelector(".ruta");
  if (ruta) {
    if ("IntersectionObserver" in window) {
      var ior = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { ruta.classList.add("dentro"); ior.disconnect(); }
      }, { threshold: 0.45 });
      ior.observe(ruta);
    } else { ruta.classList.add("dentro"); }
  }

  /* luz que sigue al cursor en las tarjetas de servicio */
  document.querySelectorAll(".svc").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", e.clientX - r.left + "px");
      t.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* preguntas frecuentes (acordeón) */
  document.querySelectorAll(".faq-item button").forEach(function (b) {
    b.addEventListener("click", function () {
      var item = b.parentElement.parentElement;
      var abre = !item.classList.contains("abierto");
      document.querySelectorAll(".faq-item.abierto").forEach(function (o) {
        o.classList.remove("abierto");
        o.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (abre) { item.classList.add("abierto"); b.setAttribute("aria-expanded", "true"); }
    });
  });

  /* auto del hero: leve parallax con el mouse (después de que llega) */
  var escena = document.querySelector(".escena");
  if (escena && !reducir && window.matchMedia("(hover:hover)").matches) {
    var luz = escena.querySelector(".luz");
    var listo = false;
    setTimeout(function () { listo = true; }, 2200);
    window.addEventListener("pointermove", function (e) {
      if (!listo) return;
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      var car = escena.querySelector(".auto-mov");
      car.style.transition = "transform .5s ease-out";
      car.style.animation = "none";
      car.style.transform = "translate(" + (x * -14) + "px," + (y * -6) + "px)";
      if (luz) luz.style.translate = "calc(-50% + " + (x * 24) + "px) calc(-50% + " + (y * 14) + "px)";
    }, { passive: true });
  }

  /* año del pie */
  document.querySelectorAll("[data-anio]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
