import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  postTask(data:any){
    return this.http.post<any>("http://localhost:3000/posts", data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  getTask(){
    return this.http.get<any>("http://localhost:3000/posts")
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  getTaskById(id: any){
    return this.http.get<any>("http://localhost:3000/posts/" + id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }


  updateTask(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/posts/" + id, data)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  deleteTask(id: number) {
    return this.http.delete<any>("http://localhost:3000/posts/" + id) // Added slash before id
      .pipe(map((res: any) => {
        return res;
      }))
  }


}
