import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApicallsService {

  constructor(private http: HttpClient) {

  }

  // For Response Beautifier
  private extractData(res: any) {
    let body = res;
    return body || { };
  }
  

  menu(){     //Data for Currency Exchange
      return this.http.get(environment.MENU).pipe(
          map(this.extractData),
          catchError(this.handleError)
        );
  }

  popper(currency: any){     //Data for Currency Exchange
      return this.http.get(environment.CONVERSION_DROPDOWN+currency).pipe(
          map(this.extractData),
          catchError(this.handleError)
        );
  }

  historicalData(currency: any, toConvertCurrency: any, period: any, type: any): Observable<any> {   //Getting Historical Data for  Specified Currency and Period
      if(type=='fiat') type= 'local';
      return this.http.get(environment.HISTORICAL_DATA+type+'/'+currency+'-'+toConvertCurrency+'?period='+period).pipe(
          map(this.extractData),
          catchError(this.handleError)
        );
  }

  currencyTabData(crypto: any): Observable<any> {   //Getting Historical Data for  Specified Currency and Period
      return this.http.get(environment.CURRENCY_TAB+crypto).pipe(
          map(this.extractData),
          catchError(this.handleError)
        );
  }


  // For Error Beautifier
  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.create(errMsg);
  }
}
