import { transition } from '../theme';

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Plays the card change: `incoming` is already mounted on top of `outgoing`. When it ends (or the
 * timer fallback fires, so the caller's lock can never get stuck) `outgoing` is removed and `done`
 * runs exactly once. The look is in styles.css, driven by the `transition` constants in theme.ts.
 */
export function playTransition(
  outgoing: HTMLElement,
  incoming: HTMLElement,
  reduced: boolean,
  done: () => void,
): void {
  const mode = reduced ? 'fade' : 'slide';
  const duration = reduced ? transition.reducedFadeMs : transition.durationMs;
  let finished = false;
  let timer = 0;

  const finish = (): void => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    incoming.removeEventListener('animationend', onEnd);
    incoming.classList.remove('card--in', `card--${mode}`);
    outgoing.remove();
    done();
  };
  const onEnd = (event: AnimationEvent): void => {
    if (event.target === incoming) finish();
  };

  incoming.addEventListener('animationend', onEnd);
  timer = window.setTimeout(finish, duration + transition.fallbackSlackMs);
  outgoing.classList.add('card--out', `card--${mode}`);
  incoming.classList.add('card--in', `card--${mode}`);
}
