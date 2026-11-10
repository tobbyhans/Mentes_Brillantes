export type AgeGroup = '4-6' | '7-9' | '10-12';
export type Topic = 'Animales' | 'Naturaleza' | 'Colores' | 'Formas' | 'Objetos';
export interface CakeQuestion {
  id: string;
  picture: string;
  prompt: string;
  choices: readonly [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
  topic: Topic;
}
export const AGE_OPTIONS: ReadonlyArray<{id:AgeGroup; years:string; label:string; detail:string; emoji:string}> = [
  {id:'4-6',years:'4–6 años',label:'Pequeños exploradores',detail:'Dibujos, colores y primeras preguntas',emoji:'🌈'},
  {id:'7-9',years:'7–9 años',label:'Curiosos de la naturaleza',detail:'Animales, objetos y descubrimientos',emoji:'🌼'},
  {id:'10-12',years:'10–12 años',label:'Mentes investigadoras',detail:'Ciencia, naturaleza y retos de lógica',emoji:'🔎'},
];
const BANK_4_6: CakeQuestion[] = [
  {
    "id": "a01",
    "picture": "butterfly",
    "prompt": "¿Qué animal ves en el dibujo?",
    "choices": [
      "Mariposa",
      "Tortuga",
      "Perro"
    ],
    "correctIndex": 0,
    "explanation": "Las mariposas tienen alas de colores y pueden volar.",
    "topic": "Animales"
  },
  {
    "id": "a02",
    "picture": "sun",
    "prompt": "¿De qué color solemos pintar el sol?",
    "choices": [
      "Morado",
      "Verde",
      "Amarillo"
    ],
    "correctIndex": 2,
    "explanation": "El sol suele representarse de amarillo en los dibujos.",
    "topic": "Colores"
  },
  {
    "id": "a03",
    "picture": "fish",
    "prompt": "¿Dónde vive este pez?",
    "choices": [
      "En el agua",
      "En la arena",
      "En un árbol"
    ],
    "correctIndex": 0,
    "explanation": "Los peces viven en el agua.",
    "topic": "Naturaleza"
  },
  {
    "id": "a04",
    "picture": "tree",
    "prompt": "¿Qué parte del árbol es verde?",
    "choices": [
      "Las hojas",
      "Las raíces",
      "El tronco"
    ],
    "correctIndex": 0,
    "explanation": "Muchos árboles tienen hojas verdes.",
    "topic": "Naturaleza"
  },
  {
    "id": "a05",
    "picture": "flower",
    "prompt": "¿Qué necesita una flor para crecer?",
    "choices": [
      "Juguetes",
      "Agua y luz",
      "Zapatos"
    ],
    "correctIndex": 1,
    "explanation": "Las plantas necesitan agua y luz para crecer.",
    "topic": "Naturaleza"
  },
  {
    "id": "a06",
    "picture": "ladybug",
    "prompt": "¿De qué color suele ser esta mariquita?",
    "choices": [
      "Azul sin puntos",
      "Gris a rayas",
      "Roja con puntos"
    ],
    "correctIndex": 2,
    "explanation": "Muchas mariquitas son rojas con puntos negros.",
    "topic": "Colores"
  },
  {
    "id": "a07",
    "picture": "rain",
    "prompt": "¿Qué cae de las nubes cuando llueve?",
    "choices": [
      "Confeti",
      "Agua",
      "Hojas"
    ],
    "correctIndex": 1,
    "explanation": "La lluvia está formada por gotas de agua.",
    "topic": "Naturaleza"
  },
  {
    "id": "a08",
    "picture": "apple",
    "prompt": "¿Qué objeto del dibujo se puede comer?",
    "choices": [
      "Una piedra",
      "Una manzana",
      "Una pelota"
    ],
    "correctIndex": 1,
    "explanation": "La manzana es una fruta.",
    "topic": "Objetos"
  },
  {
    "id": "a09",
    "picture": "bee",
    "prompt": "¿Qué produce la abeja?",
    "choices": [
      "Leche",
      "Pan",
      "Miel"
    ],
    "correctIndex": 2,
    "explanation": "Las abejas elaboran miel a partir del néctar.",
    "topic": "Animales"
  },
  {
    "id": "a10",
    "picture": "circle",
    "prompt": "¿Qué forma tiene este dibujo?",
    "choices": [
      "Triángulo",
      "Cuadrado",
      "Círculo"
    ],
    "correctIndex": 2,
    "explanation": "Un círculo es redondo y no tiene esquinas.",
    "topic": "Formas"
  },
  {
    "id": "a11",
    "picture": "triangle",
    "prompt": "¿Cuántos lados tiene esta figura?",
    "choices": [
      "Cinco",
      "Tres",
      "Cuatro"
    ],
    "correctIndex": 1,
    "explanation": "El triángulo tiene tres lados.",
    "topic": "Formas"
  },
  {
    "id": "a12",
    "picture": "turtle",
    "prompt": "¿Qué animal tiene un caparazón?",
    "choices": [
      "Mariposa",
      "Abeja",
      "Tortuga"
    ],
    "correctIndex": 2,
    "explanation": "Las tortugas tienen un caparazón que protege su cuerpo.",
    "topic": "Animales"
  },
  {
    "id": "a13",
    "picture": "rainbow",
    "prompt": "¿Qué aparece a veces cuando hay sol y lluvia?",
    "choices": [
      "Arcoíris",
      "Nieve",
      "Un volcán"
    ],
    "correctIndex": 0,
    "explanation": "La luz del sol puede formar un arcoíris al pasar por gotas de agua.",
    "topic": "Colores"
  },
  {
    "id": "a14",
    "picture": "cloud",
    "prompt": "¿Qué vemos flotando en el cielo?",
    "choices": [
      "Un zapato",
      "Una nube",
      "Una cuchara"
    ],
    "correctIndex": 1,
    "explanation": "Las nubes están formadas por gotitas de agua o cristales de hielo.",
    "topic": "Objetos"
  },
  {
    "id": "a15",
    "picture": "square",
    "prompt": "¿Cuántas esquinas tiene un cuadrado?",
    "choices": [
      "Cuatro",
      "Seis",
      "Dos"
    ],
    "correctIndex": 0,
    "explanation": "Un cuadrado tiene cuatro lados y cuatro esquinas.",
    "topic": "Formas"
  }
];

const BANK_7_9: CakeQuestion[] = [
  {
    "id": "b01",
    "picture": "bee",
    "prompt": "¿Cómo ayudan las abejas a muchas flores?",
    "choices": [
      "Les cortan las hojas",
      "Las pintan",
      "Las polinizan"
    ],
    "correctIndex": 2,
    "explanation": "Al visitar flores, las abejas transportan polen.",
    "topic": "Naturaleza"
  },
  {
    "id": "b02",
    "picture": "butterfly",
    "prompt": "¿En qué se convierte una oruga durante la metamorfosis?",
    "choices": [
      "Mariposa",
      "Pez",
      "Hormiga"
    ],
    "correctIndex": 0,
    "explanation": "Muchas orugas se transforman en mariposas o polillas.",
    "topic": "Animales"
  },
  {
    "id": "b03",
    "picture": "tree",
    "prompt": "¿Qué parte del árbol absorbe agua del suelo?",
    "choices": [
      "Las ramas",
      "Las raíces",
      "Las flores"
    ],
    "correctIndex": 1,
    "explanation": "Las raíces toman agua y minerales del suelo.",
    "topic": "Naturaleza"
  },
  {
    "id": "b04",
    "picture": "fish",
    "prompt": "¿Cómo respiran la mayoría de los peces?",
    "choices": [
      "Con plumas",
      "Con raíces",
      "Con branquias"
    ],
    "correctIndex": 2,
    "explanation": "Las branquias extraen oxígeno del agua.",
    "topic": "Animales"
  },
  {
    "id": "b05",
    "picture": "rain",
    "prompt": "¿Qué sucede cuando el vapor de agua se enfría en el cielo?",
    "choices": [
      "Se condensa",
      "Se convierte en arena",
      "Desaparece para siempre"
    ],
    "correctIndex": 0,
    "explanation": "La condensación ayuda a formar nubes.",
    "topic": "Naturaleza"
  },
  {
    "id": "b06",
    "picture": "sun",
    "prompt": "¿Cuál es la estrella de nuestro sistema solar?",
    "choices": [
      "Marte",
      "El Sol",
      "La Luna"
    ],
    "correctIndex": 1,
    "explanation": "El Sol es la estrella alrededor de la que gira la Tierra.",
    "topic": "Naturaleza"
  },
  {
    "id": "b07",
    "picture": "ladybug",
    "prompt": "¿Por qué son útiles muchas mariquitas en un jardín?",
    "choices": [
      "Construyen nidos de pájaros",
      "Hacen miel",
      "Comen pulgones"
    ],
    "correctIndex": 2,
    "explanation": "Muchas mariquitas se alimentan de pulgones.",
    "topic": "Animales"
  },
  {
    "id": "b08",
    "picture": "triangle",
    "prompt": "¿Cuál de estas figuras tiene exactamente tres lados?",
    "choices": [
      "Cuadrado",
      "Círculo",
      "Triángulo"
    ],
    "correctIndex": 2,
    "explanation": "Un triángulo tiene tres lados.",
    "topic": "Formas"
  },
  {
    "id": "b09",
    "picture": "recycle",
    "prompt": "¿Qué significa este símbolo de flechas?",
    "choices": [
      "Salida",
      "Reciclaje",
      "Prohibido jugar"
    ],
    "correctIndex": 1,
    "explanation": "El símbolo invita a separar y aprovechar materiales.",
    "topic": "Objetos"
  },
  {
    "id": "b10",
    "picture": "turtle",
    "prompt": "¿De qué grupo son las tortugas?",
    "choices": [
      "Insectos",
      "Aves",
      "Reptiles"
    ],
    "correctIndex": 2,
    "explanation": "Las tortugas son reptiles.",
    "topic": "Animales"
  },
  {
    "id": "b11",
    "picture": "rainbow",
    "prompt": "¿Qué descompone la luz blanca y hace visible un arcoíris?",
    "choices": [
      "Las gotas de agua",
      "Las piedras",
      "La madera"
    ],
    "correctIndex": 0,
    "explanation": "Las gotas de agua desvían y separan colores de la luz solar.",
    "topic": "Colores"
  },
  {
    "id": "b12",
    "picture": "apple",
    "prompt": "¿Qué parte de una planta suele contener semillas?",
    "choices": [
      "Tallo",
      "Fruto",
      "Raíz"
    ],
    "correctIndex": 1,
    "explanation": "Muchos frutos protegen semillas.",
    "topic": "Naturaleza"
  },
  {
    "id": "b13",
    "picture": "flower",
    "prompt": "¿Cómo se llama el proceso por el que el polen llega a otra flor?",
    "choices": [
      "Evaporación",
      "Congelación",
      "Polinización"
    ],
    "correctIndex": 2,
    "explanation": "La polinización permite la reproducción de muchas plantas.",
    "topic": "Naturaleza"
  },
  {
    "id": "b14",
    "picture": "cloud",
    "prompt": "¿De qué están formadas principalmente las nubes?",
    "choices": [
      "Gotitas de agua o hielo",
      "Humo de colores",
      "Algodón"
    ],
    "correctIndex": 0,
    "explanation": "Las nubes contienen diminutas gotas o cristales de hielo.",
    "topic": "Naturaleza"
  },
  {
    "id": "b15",
    "picture": "square",
    "prompt": "¿Cuántos ángulos rectos tiene un cuadrado?",
    "choices": [
      "Ninguno",
      "Uno",
      "Cuatro"
    ],
    "correctIndex": 2,
    "explanation": "Todos los ángulos del cuadrado miden 90 grados.",
    "topic": "Formas"
  }
];

const BANK_10_12: CakeQuestion[] = [
  {
    "id": "c01",
    "picture": "tree",
    "prompt": "¿Qué gas toman las plantas durante la fotosíntesis?",
    "choices": [
      "Helio",
      "Dióxido de carbono",
      "Oxígeno puro"
    ],
    "correctIndex": 1,
    "explanation": "Las plantas utilizan dióxido de carbono, agua y luz para fabricar azúcares.",
    "topic": "Naturaleza"
  },
  {
    "id": "c02",
    "picture": "bee",
    "prompt": "¿Qué transporta una abeja de una flor a otra?",
    "choices": [
      "Arena",
      "Sal",
      "Polen"
    ],
    "correctIndex": 2,
    "explanation": "El polen puede viajar adherido al cuerpo de un polinizador.",
    "topic": "Naturaleza"
  },
  {
    "id": "c03",
    "picture": "rain",
    "prompt": "¿Qué proceso convierte el agua líquida en vapor?",
    "choices": [
      "Evaporación",
      "Fusión",
      "Condensación"
    ],
    "correctIndex": 0,
    "explanation": "Al evaporarse, el agua pasa de líquido a gas.",
    "topic": "Naturaleza"
  },
  {
    "id": "c04",
    "picture": "fish",
    "prompt": "¿Qué estructura permite captar oxígeno disuelto en el agua?",
    "choices": [
      "Pelaje",
      "Branquias",
      "Alas"
    ],
    "correctIndex": 1,
    "explanation": "La mayoría de los peces intercambia gases mediante branquias.",
    "topic": "Animales"
  },
  {
    "id": "c05",
    "picture": "sun",
    "prompt": "¿Qué forma de energía reciben las plantas directamente del Sol?",
    "choices": [
      "Energía sonora",
      "Energía magnética",
      "Energía luminosa"
    ],
    "correctIndex": 2,
    "explanation": "La luz solar proporciona energía para la fotosíntesis.",
    "topic": "Naturaleza"
  },
  {
    "id": "c06",
    "picture": "recycle",
    "prompt": "¿Cuál es la mejor opción antes de reciclar un objeto útil?",
    "choices": [
      "Reutilizarlo",
      "Tirarlo al suelo",
      "Quemarlo"
    ],
    "correctIndex": 0,
    "explanation": "Reutilizar reduce residuos y la necesidad de nuevos materiales.",
    "topic": "Objetos"
  },
  {
    "id": "c07",
    "picture": "butterfly",
    "prompt": "¿Cómo se llama el cambio completo de oruga a mariposa?",
    "choices": [
      "Germinación",
      "Metamorfosis",
      "Erosión"
    ],
    "correctIndex": 1,
    "explanation": "La metamorfosis es un cambio de forma durante el desarrollo.",
    "topic": "Animales"
  },
  {
    "id": "c08",
    "picture": "rainbow",
    "prompt": "¿Qué fenómeno separa la luz blanca en varios colores?",
    "choices": [
      "Combustión",
      "Magnetismo",
      "Dispersión"
    ],
    "correctIndex": 2,
    "explanation": "La dispersión explica la separación de colores en un arcoíris.",
    "topic": "Colores"
  },
  {
    "id": "c09",
    "picture": "flower",
    "prompt": "¿Cuál es la función principal de una flor?",
    "choices": [
      "Reproducción",
      "Absorber agua del suelo",
      "Sujetar el tronco"
    ],
    "correctIndex": 0,
    "explanation": "Las flores participan en la reproducción de muchas plantas.",
    "topic": "Naturaleza"
  },
  {
    "id": "c10",
    "picture": "turtle",
    "prompt": "¿Por qué se clasifica a una tortuga como vertebrado?",
    "choices": [
      "Vive muchos años",
      "Tiene columna vertebral",
      "Tiene caparazón"
    ],
    "correctIndex": 1,
    "explanation": "Los vertebrados poseen columna vertebral.",
    "topic": "Animales"
  },
  {
    "id": "c11",
    "picture": "cloud",
    "prompt": "¿Qué provoca que el vapor se transforme en pequeñas gotas?",
    "choices": [
      "Calentamiento hasta hervir",
      "Evaporación del hielo",
      "Enfriamiento y condensación"
    ],
    "correctIndex": 2,
    "explanation": "Cuando el aire húmedo se enfría, el vapor puede condensarse.",
    "topic": "Naturaleza"
  },
  {
    "id": "c12",
    "picture": "square",
    "prompt": "¿Cuál es el área de un cuadrado de 4 cm de lado?",
    "choices": [
      "16 cm²",
      "8 cm²",
      "12 cm²"
    ],
    "correctIndex": 0,
    "explanation": "Área del cuadrado: lado por lado, 4 × 4 = 16 cm².",
    "topic": "Formas"
  },
  {
    "id": "c13",
    "picture": "triangle",
    "prompt": "¿Cuánto suman los ángulos interiores de un triángulo?",
    "choices": [
      "360°",
      "180°",
      "90°"
    ],
    "correctIndex": 1,
    "explanation": "En geometría plana, los tres ángulos interiores suman 180 grados.",
    "topic": "Formas"
  },
  {
    "id": "c14",
    "picture": "ladybug",
    "prompt": "¿Cuál es la función de un depredador de pulgones en un ecosistema?",
    "choices": [
      "Producir luz solar",
      "Crear rocas",
      "Regular poblaciones"
    ],
    "correctIndex": 2,
    "explanation": "Los depredadores ayudan a mantener el equilibrio de las poblaciones.",
    "topic": "Animales"
  },
  {
    "id": "c15",
    "picture": "apple",
    "prompt": "¿Cómo se llama la primera etapa en la que una semilla comienza a crecer?",
    "choices": [
      "Germinación",
      "Sedimentación",
      "Oxidación"
    ],
    "correctIndex": 0,
    "explanation": "La germinación es el inicio del crecimiento de una nueva planta.",
    "topic": "Naturaleza"
  }
];

export const QUESTION_BANKS: Record<AgeGroup, readonly CakeQuestion[]> = {
  '4-6': BANK_4_6, '7-9': BANK_7_9, '10-12': BANK_10_12,
};
