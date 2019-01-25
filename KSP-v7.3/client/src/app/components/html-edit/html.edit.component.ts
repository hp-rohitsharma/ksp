import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { DocumentService } from '../../services/document.service';
import { HtmlDocumentFacade } from '../../facades/html.document.facade';
import { IndexService } from '../../services/index.service';
import { GlobalDataService } from '../../services/data.service';
import { BridgeService } from '../../services/bridge.service';
import { WebSocketService } from '../../services/websocket.service';

import { TitleDialogComponent } from '../meta-dialog/meta.dialog.component';
import { IgnoreConfirmationDialogComponent } from '../ignore-confirmation-dialog/ignore.confirmation.dialog.component';

@Component({
	templateUrl: './html.edit.component.html',
	styleUrls: ['./html.edit.component.css']
})

export class HTMLEditComponent {

	constructor(private globalDataService: GlobalDataService,
		private documentService: DocumentService,
		private webSocketService: WebSocketService,
		private indexService: IndexService,
		private htmlDocumentFacade: HtmlDocumentFacade,
	//	private ignoreConfirmationDialogComponent: IgnoreConfirmationDialogComponent,
		private router: Router,
		private dialog: MatDialog,
		private bridgeService: BridgeService) {
			this.bridgeService.currentMessage.subscribe((message: any) => {				
				if (message.token === 'enable_reader_mode') {
					this.reader_mode = true;
				}
				if (message.token === 'disable_reader_mode') {
					this.reader_mode = false;
				}
			});
	}

	emptyTitle = false;	
	title = "";
	reader_mode = false;

	ngOnInit() {
		CKEDITOR.replace('editor1');
		CKEDITOR.config.height = 600;
		const blog = this.globalDataService.get('opened-blog');
		CKEDITOR.instances.editor1.setData(blog.content);
		this.title = blog.title;
		this.globalDataService.put('isEditing', true);
	}

	onFocus() {
		this.emptyTitle = false;
	}

	submit(formdata) {		
		if (!formdata.title) {
			this.emptyTitle = true;
			return;
		}
		let html = CKEDITOR.instances.editor1.getData();
		let file = new File([new Blob([html])], 'file');
		this.save(formdata, file);
	}

	save(formdata, file) {

		let selectedNode = this.globalDataService.get('selected-node');
		let parentId = selectedNode ? this.globalDataService.get('selected-node').node.id : 1;

		let doc = {
			title: formdata.title,
			type: 'text/html',
			owner: this.globalDataService.get('userName'),
			folderId: parentId
		};

		//TODO remove
		doc.owner = 'test';

		let formData = new FormData();
		formData.append('file', file);
		formData.append('metadata', JSON.stringify(doc));

		const blog = this.globalDataService.get('opened-blog');

		this.htmlDocumentFacade.update(blog._id, formData).subscribe((response: any) => {
			//let id = response['_id'];
			this.bridgeService.changeMessage({ 'token': 'document-updated', 'body': response, parent: parentId });			
			this.router.navigateByUrl('view/html/' + blog._id, { skipLocationChange: true });
		});

		this.globalDataService.put('isEditing', false);
	}


	cancel() {
		const config = new MatDialogConfig();
		config.disableClose = true;
		config.autoFocus = true;
		config.width = '350px';
		const confirmationDialog = this.dialog.open(IgnoreConfirmationDialogComponent, config);
		confirmationDialog.afterClosed().subscribe((ignoreChanges) => {
			if (ignoreChanges === true) {
				const blog = this.globalDataService.get('opened-blog');
				this.router.navigateByUrl('view/html/' + blog._id, { skipLocationChange: true });
				this.globalDataService.put('isEditing', false);
			}
			return false;
		});
	}
}

