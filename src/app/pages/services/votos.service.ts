import { Injectable } from '@angular/core';
// Librerías
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { VotoI } from '../../model/voto.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VotosService {
  private votoCollection: AngularFirestoreCollection<VotoI>;
  private votos: Observable<VotoI[]>;
  constructor(db: AngularFirestore) {
    // Indicamos el nombre de la colección
    this.votoCollection = db.collection<VotoI>('voto');

    // Mapeamos la colección
    this.votos = this.votoCollection.snapshotChanges().pipe(
      map(
        actions => {
          return actions.map(a => {
            const id = a.payload.doc.id;
            const dato = a.payload.doc.data();
            return { id, ...dato }
          });
        }));

  }

  //Método listar
  getVotos() {
    return this.votos;
  }

  //Método buscar
  getVoto(id: string) {
    return this.votoCollection.doc<VotoI>(id).valueChanges();
  }

  // Método actualizar
  updateVoto(voto: VotoI, id: string) {
    return this.votoCollection.doc(id).update(voto);

  }


}
