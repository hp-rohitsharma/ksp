import { Routes } from '@angular/router';

import { PDFViewComponent } from '../components/pdf-view/pdf.view.component';
import { HTMLViewComponent } from '../components/html-view/html.view.component';
import { HTMLCreateComponent } from '../components/html-create/html.create.component';
import { HTMLEditComponent } from '../components/html-edit/html.edit.component';
import { PDFUploadComponent } from '../components/pdf-upload/pdf.upload.component';
import { WelcomeComponent } from '../components/welcome/welcome.component';
import { OpenLinkService } from '../services/open.link.service';

export const ViewRoutes: Routes = [
  {
    path: 'view/pdf/:id',
    component: PDFViewComponent,
    canActivate: [OpenLinkService]
  },
  {
    path: 'view/html/:id',
    component: HTMLViewComponent,
    canActivate: [OpenLinkService]
  },
  {
    path: 'create/html',
    component: HTMLCreateComponent
  },
  {
    path: 'edit/html/:id',
    component: HTMLEditComponent
  },
  {
    path: 'upload/pdf',
    component: PDFUploadComponent
  },
  {
    path: 'view/welcome/:name',
    component: WelcomeComponent
  }
];

