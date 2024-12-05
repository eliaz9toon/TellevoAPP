import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.page.html',
  styleUrls: ['./formulario-conductor.page.scss'],
})
export class FormularioConductorPage implements OnInit, AfterViewInit {
  @ViewChild(IonInput, { static: false }) ionInput!: IonInput;

  registerForm!: FormGroup; 
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      licenseNumber: ['', [Validators.required]],
      plateNumber: ['', [Validators.required]],
      vehicleBrand: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    if (this.ionInput) {
      console.log('IonInput disponible:', this.ionInput);
    }
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los mensajes de error

      // Muestra la alerta de SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Por favor, completa todos los campos requeridos correctamente.',
        confirmButtonText: 'Entendido'
      });

      return;
    }

    this.isSubmitting = true;
    setTimeout(() => {
      console.log('Formulario enviado:', this.registerForm.value);
      this.isSubmitting = false;
    }, 2000);
  }
}
