import { animate, style, transition, trigger } from '@angular/animations';

export const StepperFadeInOut = trigger('fadeInOut', [
  transition(':enter', [style({ height: 0, opacity: 0 }), animate(300, style({ opacity: 1 }))]),
  transition(':leave', [animate(100, style({ height: 0, opacity: 0 }))]),
]);
