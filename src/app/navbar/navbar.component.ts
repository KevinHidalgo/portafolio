import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 🔹 Importa FormsModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isMobile: boolean = false;
  menuOpen: boolean=false;
  menu_icon: string='fas fa-bars';
  isScrolled = false;
  isLightTheme: boolean = true; // por defecto en claro

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100; // Detecta si el usuario ha bajado más de 100px
  }

 

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isLightTheme = savedTheme === 'light';

    // Sincroniza el tema con el body
    document.body.classList.toggle('light-theme', this.isLightTheme);
    document.body.classList.toggle('dark-theme', !this.isLightTheme);
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;

    // Almacena el tema seleccionado en el localStorage
    localStorage.setItem('theme', this.isLightTheme ? 'light' : 'dark');

    // Cambia la clase de body según el tema
    document.body.classList.toggle('light-theme', this.isLightTheme);
    document.body.classList.toggle('dark-theme', !this.isLightTheme);
  }

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
