import './styles.css';
import { applyTheme, createStartCard } from './ui/card';

applyTheme();

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  const stage = document.createElement('main');
  stage.className = 'stage';
  stage.append(createStartCard());
  app.append(stage);
}
