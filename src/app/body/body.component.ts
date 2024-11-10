import { Component,OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule],
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
 
         if (this.translateX > maxTranslateX) { // corrige el posicionamiento en caso que pase por el limite izquierdo
           this.translateX = maxTranslateX;
         }
 
         if (this.translateX < minTranslateX) {  // corrige el posicionamiento en caso que pase por el limite derecha
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

  // Control hover imagenes 1 y 2
  isHoveringImage1 = false;
  isHoveringImage2 = false;

  onHover(image: string) {
    if (image === 'imagen-1') {
      this.isHoveringImage1 = true;
    } else if (image === 'imagen-2') {
      this.isHoveringImage2 = true;
    }
  }

  onLeave(image: string) {
    if (image === 'imagen-1') {
      this.isHoveringImage1 = false;
    } else if (image === 'imagen-2') {
      this.isHoveringImage2 = false;
    }
  }

}
