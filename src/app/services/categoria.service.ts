import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoriaService {
  recurosBaseURL: string = environment.URL_BASE + "/categoria";
  constructor(private http: HttpClient) {}

  activarRecurso(id) {
    return this.http.put(this.recurosBaseURL + id + "/activar", {});
  }

  agregarRecurso(recurso) {
    return this.http.post(this.recurosBaseURL, recurso);
  }
  modificarRecurso(recurso, id) {
    return this.http.put(this.recurosBaseURL + id, recurso);
  }
  eliminarRecurso(id) {
    return this.http.delete(this.recurosBaseURL + id);
  }
  obtenerRecurso(id) {
    return this.http.get(this.recurosBaseURL + id);
  }
  listarRecurso(ejemplo) {
    return this.http.get(this.recurosBaseURL, { params: ejemplo });
  }
}
