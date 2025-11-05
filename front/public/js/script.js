window.addEventListener("DOMContentLoaded", async () => {
  const img = document.getElementById("imagenEscuela");
  const overlays = document.getElementById("overlays");

  // Diccionario para traducir lo que devuelve Clarifai (inglés -> español)
  const traducciones = {
    table: "mesa",
    chair: "silla",
    book: "libro",
    person: "persona",
    picture: "cuadro"
    // agrega más según lo que detecte Clarifai
  };

  // Diccionario de palabras en español -> imagen en LSM
  const bancoImagenes = {
    libro: "libros_lsm.jpg",
    cuadro: "escritorio_lsm.jpg",
    persona: "persona_lsm.png",
    silla: "silla_lsm.png",
    mesa: "mesa_lsm.png",
    almohada: "almohada_lsm.png",
    casa: "casa_lsm.png",
    ventana: "ventana_lsm.png"
    // agrega las que tengas en /public/images/
  };

  const procesarImagen = async () => {
    try {
      const res = await fetch("/api/imageCalis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: img.src }),
      });

      const data = await res.json();
      overlays.innerHTML = "";
      const resultados = data.resultados || [];

      const imgWidth = img.width;
      const imgHeight = img.height;

      // Mapear y calcular dimensiones
      const boxes = resultados.map(obj => {
        const { top, left, bottom, right } = obj.boundingBox;
        const w = (parseFloat(right) - parseFloat(left)) * imgWidth;
        const h = (parseFloat(bottom) - parseFloat(top)) * imgHeight;
        const x = parseFloat(left) * imgWidth;
        const y = parseFloat(top) * imgHeight;

        // Traducción del nombre detectado
        const nombreIngles = obj.nombre.toLowerCase();
        const nombreEspanol = traducciones[nombreIngles] || nombreIngles;

        return { ...obj, x, y, w, h, nombreEspanol };
      });

      // ORDENAR POR ÁREA (mayor a menor)
      boxes.sort((a, b) => (b.w * b.h) - (a.w * a.h));

      // Crear elementos DOM para cada box ordenado
      boxes.forEach(obj => {
        const box = document.createElement("div");
        box.className = "bounding-box";
        box.style.cssText = `
          position: absolute;
          left: ${obj.x}px;
          top: ${obj.y}px;
          width: ${obj.w}px;
          height: ${obj.h}px;
          border: 2px solid #ff6b6b;
          background: transparent;
          cursor: pointer;
          pointer-events: all;
        `;

        // Buscar imagen en bancoImagenes con el nombre en español
        const traduccion = bancoImagenes[obj.nombreEspanol];

        if (traduccion) {
          // Crear tooltip (inicialmente oculto)
          const tooltip = document.createElement("div");
          tooltip.className = "lsm-tooltip";
          tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: none;
            z-index: 1000;
            white-space: nowrap;
            pointer-events: none;
            border: 1px solid #333;
          `;

          // Contenido
          const contenido = document.createElement("div");
          contenido.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          `;

          // Texto en español
          const label = document.createElement("div");
          label.textContent = `${obj.nombreEspanol} (${obj.confianza})`;
          label.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
          `;

          // Imagen de seña LSM
          const imgLSM = document.createElement("img");
          imgLSM.src = `/images/${traduccion}`;
          imgLSM.alt = `Seña LSM: ${obj.nombreEspanol}`;
          imgLSM.style.cssText = `
            width: 80px;
            height: 80px;
            object-fit: contain;
            background: white;
            border-radius: 6px;
            padding: 4px;
            border: 1px solid #ddd;
          `;

          imgLSM.onerror = () => {
            imgLSM.style.display = 'none';
            label.textContent += ' (sin seña disponible)';
          };

          contenido.appendChild(label);
          contenido.appendChild(imgLSM);
          tooltip.appendChild(contenido);

          // Eventos hover
          box.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
          });
          box.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });

          box.appendChild(tooltip);
        } else {
          // Tooltip simple solo con texto
          const tooltip = document.createElement("div");
          tooltip.className = "simple-tooltip";
          tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
            z-index: 1000;
            white-space: nowrap;
            pointer-events: none;
          `;
          tooltip.textContent = `${obj.nombreEspanol} (${obj.confianza})`;

          box.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
          });
          box.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });

          box.appendChild(tooltip);
        }

        overlays.appendChild(box);
      });
    } catch (err) {
      console.error("Error en detección automática:", err);
      document.getElementById("resultado").textContent = "Error al detectar objetos";
    }
  };

  if (img.complete) {
    procesarImagen();
  } else {
    img.onload = procesarImagen;
  }
});
