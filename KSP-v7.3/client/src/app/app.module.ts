import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from "@angular/material";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TreeModule } from 'ng2-tree';

import { AppComponent } from './app.component';
import { ListSidebarComponent } from './components/list-sidebar/list-sidebar.component';
//import { TreeSidebarComponent } from './components/tree-sidebar/tree-sidebar.component';
//import { FolderView } from './components/tree-sidebar/folder-view/folder.view';
import { HeaderComponent } from './components/header/header.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

import { PDFViewComponent } from './components/pdf-view/pdf.view.component';
import { HTMLViewComponent } from './components/html-view/html.view.component';
import { HTMLCreateComponent } from './components/html-create/html.create.component';
import { HTMLEditComponent } from './components/html-edit/html.edit.component';
import { PDFUploadComponent } from './components/pdf-upload/pdf.upload.component';

import { TitleDialogComponent } from './components/meta-dialog/meta.dialog.component';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete.confirmation.dialog.component';
import { IgnoreConfirmationDialogComponent } from './components/ignore-confirmation-dialog/ignore.confirmation.dialog.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings.dialog.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback.dialog.component';

import { ViewRoutes } from './routes/views';

import { IndexService } from './services/index.service';
import { DocumentService } from './services/document.service';
import { UserService } from './services/user.service';
import { FeedbackService } from './services/feedback.service';
import { GlobalDataService } from './services/data.service';
import { OpenLinkService  } from './services/open.link.service';
import { WelcomeService  } from './services/welcome.service';


import { BridgeService } from './services/bridge.service';
import { DirectoryService } from './services/directory.service';
import { WebSocketService } from './services/websocket.service';
import { WindowRef } from './services/window-ref';

import { HtmlDocumentFacade } from './facades/html.document.facade';
import { PDFDocumentFacade } from './facades/pdf.document.facade';

import { SearchPipe } from './filters/search.pipe';
import { SortPipe } from './filters/sort.pipe';
import { SafeHtmlPipe } from './filters/safe.html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    SortPipe,
    SafeHtmlPipe,
    ToolbarComponent,
    HeaderComponent,
    ListSidebarComponent,
	WelcomeComponent,
   // FolderView,
    //TreeSidebarComponent,
    PDFViewComponent,
    HTMLViewComponent,
    HTMLCreateComponent,
    HTMLEditComponent,
    PDFUploadComponent,
    TitleDialogComponent,
    SettingsDialogComponent,
    FeedbackDialogComponent,
    DeleteConfirmationDialogComponent,
    IgnoreConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forRoot(ViewRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    PdfViewerModule,
    TreeModule
  ],
  entryComponents: [
    TitleDialogComponent,
    SettingsDialogComponent,
    FeedbackDialogComponent,
    DeleteConfirmationDialogComponent,
    IgnoreConfirmationDialogComponent
  ],
  providers: [
    IndexService,
    DocumentService,
    UserService,
    BridgeService,
    DirectoryService,
    WebSocketService,
    GlobalDataService,
    OpenLinkService,
    WelcomeService,
    HtmlDocumentFacade,
    FeedbackService,
    PDFDocumentFacade,
    WindowRef
  ],
  bootstrap: [
    AppComponent,
    ToolbarComponent,
    HeaderComponent,
	//WelcomeComponent,
    ListSidebarComponent]
    //TreeSidebarComponent]
})
export class AppModule { }
