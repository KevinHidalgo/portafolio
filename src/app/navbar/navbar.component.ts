import { CommonModule } from '@angular/common';
import { Component, OnInit,Output } from '@angular/core';
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
  isLightTheme = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isLightTheme = true;
      document.body.classList.add('light-theme');
    }
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    document.body.classList.toggle('light-theme', this.isLightTheme);
    localStorage.setItem('theme', this.isLightTheme ? 'light' : 'dark');
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
