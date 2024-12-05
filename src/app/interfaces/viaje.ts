export interface Viaje {
  id?: string; // Agregar este campo para almacenar el ID de Firestore
  inicio: string;
  fin: string;
  costo: number;
  pasajeros: number;
  imagen: string;
}


  