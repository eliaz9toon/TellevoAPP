// home.page.ts
import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuarioLogin?: string | null;

  constructor(private animationController:AnimationController) { }

  ngOnInit() {
    this.usuarioLogin = localStorage.getItem('usuarioLogin');
  }


  
}