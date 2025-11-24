// --- IMPORTS ---
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

// Ya NO necesitas fetch
// import fetch from "node-fetch";

// --- CONFIG ---
const PAT = "9f21389fa2944ae59a142621d67bf588";
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "general-image-detection";
const MODEL_VERSION_ID = "1580bb1932594c93b7e2e04456af7c6f";

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

// --- DICCIONARIO LOCAL ---
const diccionario = {
  dog: "perro",
  cat: "gato",
  person: "persona",
  car: "coche",
  stool: "taburete",
  armchair: "sillón",
  chair: "silla",
  houseplant: "planta",
  flowerpot: "maceta"
};

// --- FUNCIÓN DE TRADUCCIÓN SOLO DICCIONARIO ---
async function traducirTexto(texto) {
  const lower = texto.toLowerCase();

  if (diccionario[lower]) {
    return diccionario[lower];
  }

  // Si no está traducido, regresa el texto original
  return texto;
}

// --- CONTROLLER ---
export const imageDetection = async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "Falta URL de la imagen" });
  }

  console.log("Recibiendo imagen:", imageUrl);

  stub.PostModelOutputs(
    {
      user_app_id: { user_id: USER_ID, app_id: APP_ID },
      model_id: MODEL_ID,
      version_id: MODEL_VERSION_ID,
      inputs: [{ data: { image: { url: imageUrl, allow_duplicate_url: true } } }],
    },
    metadata,
    async (err, response) => {
      if (err) return res.status(500).json({ error: err.message });

      if (response.status.code !== 10000)
        return res.status(500).json({ error: response.status.description });

      try {
        const regiones = response.outputs[0].data.regions || [];
        const resultados = [];

        for (const region of regiones) {
          const bbox = region.region_info.bounding_box;
          const nombreOriginal = region.data.concepts[0].name;
          const nombreTraducido = await traducirTexto(nombreOriginal);

          resultados.push({
            nombre: nombreTraducido,
            nombreOriginal,
            nombreTraducido,
            confianza: region.data.concepts[0].value.toFixed(4),
            boundingBox: {
              top: bbox.top_row.toFixed(3),
              left: bbox.left_col.toFixed(3),
              bottom: bbox.bottom_row.toFixed(3),
              right: bbox.right_col.toFixed(3),
            },
          });
        }

        res.json({ resultados });
      } catch (e) {
        res.status(500).json({ error: "Error al procesar: " + e.message });
      }
    }
  );
};
