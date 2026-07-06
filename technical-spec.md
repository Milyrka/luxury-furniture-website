# MASSIV — technical scroll specification

- Стек: Next.js 14, GSAP ScrollTrigger, Lenis.
- 3D tier: A — CSS/GSAP, без WebGL.
- Desktop pin range: 300–340vh.
- Video scrub: coalesced seek queue, `top top` → `bottom bottom`, полный диапазон ролика без накопления незавершённых декодирований.
- Text reveal: начинается при входе секции в viewport и завершается к моменту фиксации.
- Горячий путь: только `transform` и `opacity`; без scroll-анимации CSS-фильтров.
- Мобильные устройства: без sticky/pin, естественный скролл, короткая scroll-coupled сцена.
- Reduced motion: без scrub, pin и параллакса; весь текст видим.
- Переходы: overlap crossfade последних 35vh главы.
