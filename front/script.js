document.getElementById("detectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const imageUrl = document.getElementById("imageUrl").value;
    const respuesta = await fetch("/api/imageCalis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageUrl })
    });
    const data = await respuesta.json();
    const img = document.getElementById("image");
    const overlays = document.getElementById("overlays");
    overlays.innerHTML = "";

    img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Ordenar por área (de mayor a menor)
        const boxes = (data.resultados || []).map(obj => {
            const { top, left, bottom, right } = obj.boundingBox;
            const w = (parseFloat(right) - parseFloat(left)) * imgWidth;
            const h = (parseFloat(bottom) - parseFloat(top)) * imgHeight;
            return { ...obj, area: w * h, w, h, x: parseFloat(left) * imgWidth, y: parseFloat(top) * imgHeight };
        });

        // Ordena de mayor a menor área, luego invierte para que los chicos queden arriba
        boxes.sort((a, b) => a.area - b.area).reverse();

        boxes.forEach(obj => {
            const box = document.createElement("div");
            box.className = "bounding-box";
            box.style.left = `${obj.x}px`;
            box.style.top = `${obj.y}px`;
            box.style.width = `${obj.w}px`;
            box.style.height = `${obj.h}px`;
            box.setAttribute("data-label", `${obj.nombre} (${obj.confianza})`);

            

            overlays.appendChild(box);
        });
    };
    img.src = imageUrl;
});