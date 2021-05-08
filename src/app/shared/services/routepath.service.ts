import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoutePath {
    private subject = new Subject<any>();
    sendMessage(message: any) {
        // console.log("Hello",message)
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        console.log("getmessage",);
        return this.subject.asObservable();
    }
}
