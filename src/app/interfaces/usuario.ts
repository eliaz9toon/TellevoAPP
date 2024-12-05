// src/app/interfaces/usuario.ts
export interface Usuario {
    email: string;
    pass: string;  // Asegúrate de que esta propiedad esté aquí
    tipo: string; // Ajusta los tipos según sea necesario
    nombre?: string; // Opcional, si necesitas almacenar el nombre
    foto?: string;   // Opcional, si necesitas almacenar la foto
  }
  
  