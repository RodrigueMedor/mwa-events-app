import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PopupService {


    show(message) {
        alert(message);
    }

}