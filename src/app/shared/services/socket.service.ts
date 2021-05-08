import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Event } from '../../event.enum';
import { environment } from '../../../environments/environment';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private appUrl;
  private socket: any;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
    this.appUrl = environment.BACKEND_WS_URL_CXR;
  }

  public initSocket(): void {
      this.socket = socketIo(this.appUrl);
  }

  public disconnectSocket(): void {
      // console.log("disconnect");
      if(this.socket) this.socket.disconnect();
  }

  public send(type: any, message: any): void {
      this.socket.emit(type, message);
  }

  public onMessage(type: any): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on(type, (data: any) => observer.next(data));
      });
  }

  public onEvent(event: any): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param RootObject - optional value to return as the observable RootObject
   */
  private handleError<T>(operation = 'operation', RootObject?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(`Backend returned code ${error.status}`);
        // `body was: ${error.error.message}`);
        this.log(error.error);
      }
      // return an observable with a user-facing error message
      return throwError(error.error);
    };
  };
  /** Log a HeroService message with the MessageService */
  private log(message: any) {
    console.table(message);
    // this.messageService.add('api service: ' + message);
  }

}
