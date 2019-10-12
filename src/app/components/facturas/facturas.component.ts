import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacturasService } from './../../services/facturas.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit, OnDestroy {
  facturas;
  subscriptor: Subscription;
  facturasSeleccionadas: Array<any> = [];
  objFactura = {
    id: '',
    fact_nro: '',
    fact_rz: '',
    fact_fech: '',
    fact_ruc: ''
  }

  constructor(private _sFacturas: FacturasService,
    private _sRouter: Router) { }

  ngOnInit() {
    this.traerFacturas();
  }

  traerFacturas() {
    this.subscriptor = this._sFacturas.getFacturas()
      .subscribe((resultado) => {
        this.facturas = resultado;
      });
  }



  ngOnDestroy() {
    this.subscriptor.unsubscribe();
  }

  crearFactura() {
    this._sRouter.navigate(['facturas', 'crear']);
  }

  eliminarFactura(id) {
    Swal.fire({
      title: 'ar yu chur?',
      text: 'El proceso no tiene vuelta atrás!',
      type: 'warning',
      confirmButtonText: 'Sí, borrar!',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.value) {
        this._sFacturas.deleteFactura(id).subscribe((rpta) => {
          if (rpta.id) {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'La factura ha sido borrada con éxito',
              showConfirmButton: false,
              timer: 1500
            });
            this.traerFacturas();
          }
        })
      }
    })
  }

  seleccionarFactura(evento,factura){
    console.log('seleccionado!');
    if(evento.target.checked){
      this.facturasSeleccionadas.push(factura);
      console.log(this.facturasSeleccionadas);
    } else{
      for (let i = 0; i < this.facturasSeleccionadas.length; i++){
        if(factura.id === this.facturasSeleccionadas[i].id){
          this.facturasSeleccionadas.splice(i, 1);
          console.log(this.facturasSeleccionadas);
        }
      }
    } 
  }

  eliminarFacturas(){
    Swal.fire({
      title: 'ar yu chur de borrar las facturas seleccionadas?',
      text: 'El proceso no tiene vuelta atrás!',
      type: 'warning',
      confirmButtonText: 'Sí, borrar!',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.value) {
        this._sFacturas.deleteFacturas(this.facturasSeleccionadas).subscribe((rpta) => {
          if (rpta[0].id) {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'Las facturas ha sido borrada con éxito',
              showConfirmButton: false,
              timer: 1500
            });
            this.traerFacturas();
          }
          console.log(rpta);
        })
      }
    })
  }

  abrirModalEditar(id) {



    $("#modalEditar").modal("show");
  }
}