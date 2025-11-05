function mostrarLeccion(tipo) {
  let contenido = document.getElementById("contenido");
  if (tipo === "inicio") {
    contenido.innerHTML = `
      <h2>Bienvenido 👋</h2>
      <p>Explora las lecciones de saludos, colores y números.</p>
    `;
  } else if (tipo === "saludos") {
    contenido.innerHTML = `
      <h2>Saludos</h2>
      <p>Hola 👋</p>
      <p>Buenos días ☀️</p>
      <p>Buenas noches 🌙</p>
    `;
  } else if (tipo === "colores") {
    contenido.innerHTML = `
      <h2>Colores</h2>
      <p>Rojo 🔴</p>
      <p>Verde 🟢</p>
      <p>Azul 🔵</p>
    `;
  } else if (tipo === "numeros") {
    contenido.innerHTML = `
      <h2>Números</h2>
      <p>Uno (1)</p>
      <p>Dos (2)</p>
      <p>Tres (3)</p>
    `;
  }
}

// Mostrar inicio por defecto
window.onload = () => mostrarLeccion("inicio");
