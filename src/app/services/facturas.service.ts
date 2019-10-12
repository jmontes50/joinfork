import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_BACKEND } from './../../environments/environment.prod';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  arrayRespuestas: Array<any> = [];
  constructor(private _sHttp: HttpClient) { }

  getFacturas(): Observable<any> {
    return this._sHttp.get(`${URL_BACKEND}/facturas`);
  }
  postFactura(objFactura): Observable<any> {

    let objFacturaString = JSON.stringify(objFactura);
    // creando headers
    let misHeaders = new HttpHeaders().set("Content-Type", "application/json");

    return this._sHttp.post(`${URL_BACKEND}/facturas`,
      objFacturaString,
      { headers: misHeaders });
  }
  deleteFactura(id): Observable<any> {
    return this._sHttp.delete(`${URL_BACKEND}/facturas/${id}`);
  }

  deleteFacturas(arregloFacturas): Observable<any>{
    arregloFacturas.forEach(factura => {
      let response = this._sHttp.delete(`${URL_BACKEND}/facturas/${factura.id}`);
      this.arrayRespuestas.push(response);
      console.log(this.arrayRespuestas);
    });
    
    return forkJoin(this.arrayRespuestas);
  }

}
