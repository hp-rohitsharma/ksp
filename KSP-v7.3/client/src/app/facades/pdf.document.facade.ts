import { Injectable } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { Observable } from 'rxjs';

@Injectable()
export class PDFDocumentFacade {

    constructor(private documentService: DocumentService) {
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

    
    
}


