import { Injectable } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { GlobalDataService } from "../services/data.service";
import { BridgeService } from '../services/bridge.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class HtmlDocumentFacade {

    constructor(private documentService: DocumentService,
        private bridgeService: BridgeService,
        private router: Router,
        private dataService: GlobalDataService) {
    }

    save(formData: FormData): Observable<any> {

        return this.documentService.add(formData)
            .map((response: Response) => {
                return response;
            });
    }

    
    update(id: any, formData: FormData): Observable<any> {
        return this.documentService.update(id, formData)
            .map((response: Response) => {
                return response;
            });
    }

    delete(id) {
        this.documentService.delete(id).subscribe((res: any) => {           
            if (id === this.dataService.get('opened-blog')._id) {
                this.router.navigate(['/'], { skipLocationChange: true });
            }
            this.bridgeService.changeMessage({ 'token': 'document-deleted', 'id': id });
        });
    }
    
}


