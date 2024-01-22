import { Component,OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  translateX: number = 0;
  private destroy$ = new Subject<void>();

  moveCarousel(direction: number) {
    interval(500)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translateX += direction;
         // Establecer límites
         const maxTranslateX = 50; // Ajusta el límite máximo hacia la izquierda
         const minTranslateX = -950; // Ajusta el límite máximo hacia la derecha
 
         if (this.translateX > maxTranslateX) {
           this.translateX = maxTranslateX;
         }
 
         if (this.translateX < minTranslateX) {
           this.translateX = minTranslateX;
         }
      });
  }

  resetCarousel() {
    this.destroy$.next();
    this.translateX=0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
