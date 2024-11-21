import { Component,OnDestroy, Renderer2,HostListener,AfterViewInit} from '@angular/core';
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
export class BodyComponent implements AfterViewInit{
  translateX: number = 0;
  private destroy$ = new Subject<void>();
  cells: HTMLElement[] = []; // Almacena todas las celdas de la cuadrícula

  ngAfterViewInit(): void {
    this.initializeGrid();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const content = document.querySelector('.content2') as HTMLElement;
    const descripcion = document.querySelector('.descripcion') as HTMLElement;
    const itemsExperience = document.querySelector('.items-Experience') as HTMLElement;
    const skills = document.querySelector('.skills') as HTMLElement;
    const rect = content.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      this.animateGrid();
      this.revealContent(descripcion);
      this.revealContent(itemsExperience);
      this.revealContent(skills);
    } 
  }

  constructor(private renderer: Renderer2) {}

   initializeGrid(): void {
    const gridOverlay = document.querySelector('.grid-overlay') as HTMLElement;
    if (gridOverlay) {
      for (let i = 0; i < 200; i++) {
        const cell = this.renderer.createElement('div');
        this.renderer.addClass(cell, 'grid-cell');
        this.renderer.setStyle(cell,'backgroundColor','rgba(0, 0, 0)'); // Color visible
        this.renderer.setStyle(cell,'border','1px solid rgba(41, 221, 35, 0.753)'); // Bordes visibles
        // Generar una opacidad inicial aleatoria
        const initialOpacity = Math.random();
        this.renderer.setStyle(cell, 'opacity', initialOpacity.toString());
        this.cells.push(cell);
        // Agregar celda al contenedor
        this.renderer.appendChild(gridOverlay, cell);
      }
    }else {
      console.error('No se encontró el contenedor .grid-overlay');
    }
  }

  animateGrid(): void {
    const gridOverlay = document.querySelector('.grid-overlay') as HTMLElement;
    this.cells.forEach((cell, index) => {

      // Programar la desaparición
      setTimeout(() => {
        this.renderer.setStyle(cell, 'opacity', '0');
      }, 100); // Pequeño retardo antes de iniciar la animación
    });
  }

  revealContent(element: HTMLElement): void {
    element.style.opacity = '1'; // Muestra el contenido
  }

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
