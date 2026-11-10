/** Ilustraciones estáticas servidas como imágenes. Nunca se inyecta SVG como HTML en el DOM. */
import robot from './catalog-illustrations/robot.svg';
import cakeQuiz from './catalog-illustrations/cakeQuiz.svg';
import lab from './catalog-illustrations/lab.svg';
import rocket from './catalog-illustrations/rocket.svg';
import code from './catalog-illustrations/code.svg';
import bridge from './catalog-illustrations/bridge.svg';
import snakesLadders from './catalog-illustrations/snakesLadders.svg';
import tiraTira from './catalog-illustrations/tiraTira.svg';
import art from './catalog-illustrations/art.svg';
import music from './catalog-illustrations/music.svg';

export const illustrations: Readonly<Record<string, string>> = {
  robot,
  cakeQuiz,
  lab,
  rocket,
  code,
  bridge,
  snakesLadders,
  tiraTira,
  art,
  music,
};
