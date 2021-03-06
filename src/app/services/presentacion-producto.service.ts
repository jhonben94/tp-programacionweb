import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class PresentacionProductoService {
  recurosBaseURL: string = environment.URL_BASE + "/presentacionProducto/";
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    usuario: "usuario2",
    "Access-Control-Allow-Origin": "*",
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
}
