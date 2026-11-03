import './styles.css';
import { groups } from './content/de';
import { applyTheme } from './ui/card';
import { mountGame } from './ui/game';

applyTheme();

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  const stage = document.createElement('main');
  stage.className = 'stage';
  const liveRegion = document.createElement('div');
  liveRegion.className = 'visually-hidden';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  app.append(stage, liveRegion);
  mountGame(stage, liveRegion, groups);
}
