import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class ReservasService {
  recurosBaseURL: string = environment.URL_BASE + "/reserva/";
  obtenerReservaURL: string = environment.URL_BASE + "/persona/";
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    usuario: "usuario2",
  });

  constructor(private http: HttpClient) {}
  activarRecurso(id) {
    return this.http.put(this.recurosBaseURL + id + "/activar", {});
  }

  agregarRecurso(recurso) {
    return this.http.post(this.recurosBaseURL, recurso, {
      headers: this.headers,
    });
  }
  modificarRecurso(recurso, id) {
    return this.http.put(this.recurosBaseURL + id, recurso, {
      headers: this.headers,
    });
  }
  eliminarRecurso(id) {
    return this.http.delete(this.recurosBaseURL + id, {
      headers: this.headers,
    });
  }
  obtenerRecurso(id) {
    return this.http.get(this.recurosBaseURL + id, {
      headers: this.headers,
    });
  }
  listarRecurso(ejemplo) {
    return this.http.get(this.recurosBaseURL, { params: ejemplo });
  }

  listarReserva(id, filtros) {
    /* return this.http.get(this.obtenerReservaURL + id + "/agenda", {
      params: filtros,
    }); */

    const url = "http://localhost:4200/assets/data.json";
    return this.http.get(url);
  }
}
