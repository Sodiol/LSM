import fetch from "node-fetch";
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;
async function traducirTexto(texto, idiomaDestino = "es") {
  try {
    const resp = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texto, source: "auto", target: idiomaDestino }),
    });

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

    const data = await resp.json();
    return data.translatedText;
  } catch (error) {
    console.error("Error al traducir:", error.message);
    return texto; // devuelvo texto original si falla
  }
}

(async () => {
  const resultado = await traducirTexto("dog");
  console.log("Resultado final:", resultado);
})();
