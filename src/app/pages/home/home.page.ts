import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { VotoI } from 'src/app/model/voto.interface';
import { VotosService } from '../services/votos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  votos: VotoI[];
  voto: VotoI;
  total:number;

  constructor
    (
      private apiService: VotosService,
      private loadingCtrl: LoadingController,
      private alertController: AlertController
    ) { }

  ngOnInit() {

    this.listarVotos();
  }

  listarVotos() {
    this.apiService.getVotos().subscribe(resp => {
      this.votos = resp;
      var acumulador = 0;
  
      for(let i = 0; i < this.votos.length ; i++){
        acumulador = acumulador + this.votos[i].cantidad;
      }
  
      this.total = acumulador;
    });
  
  }

  async modificar(id) {
    const carga = await this.loadingCtrl.create({
      message: "Cargando ..."
    });
    await carga.present();
    this.apiService.updateVoto(this.voto, id).then(() => {
      carga.dismiss();
    })
  }

  cargarVotoMas1(id){
    // Cargamos el candidato
    this.apiService.getVoto(id).subscribe(resp => {
      this.voto = resp;
      this.voto.cantidad = this.voto.cantidad + 1;
    });
  }

  cargarVotoMenos1(id){
    // Cargamos el candidato
    this.apiService.getVoto(id).subscribe(resp => {
      this.voto = resp;
      
      if(this.voto.cantidad != 0){
        this.voto.cantidad = this.voto.cantidad - 1;
      }

    });
  }

  agregarVoto(id) {
    this.cargarVotoMas1(id);
    this.modificar(id);
  }

  eliminarVoto(id){
    this.cargarVotoMenos1(id);
    this.modificar(id);
  }

  async mensajeOk(titulo, mensaje) {
    const alert = await this.alertController.create({
        header: titulo,
        message: mensaje,
        buttons: ["OK"],
    })
    await alert.present();
    //Que se cierre cuando aprete el botón
    await alert.onDidDismiss();
}

mensaje(nombre, cantidad){
  this.mensajeOk("Votos","¡" + nombre + " Tiene " + cantidad + " votos!");
}


}
