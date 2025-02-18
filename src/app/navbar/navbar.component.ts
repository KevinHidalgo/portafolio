import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 🔹 Importa FormsModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobile: boolean = false;
  menuOpen: boolean=false;
  menu_icon: string='fas fa-bars';

  constructor() {
    this.checkScreenWidth();

    window.addEventListener('resize', () => this.checkScreenWidth());
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    
    if(this.menuOpen){
      this.menu_icon='fas fa-times';
    }else{
      this.menu_icon='fas fa-bars';
    }
    console.log(this.menu_icon);
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth <= 800;
  }
}
