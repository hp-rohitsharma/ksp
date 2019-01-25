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

@Component({
	templateUrl: './html.create.component.html',
	styleUrls: ['./html.create.component.css']
})

export class HTMLCreateComponent {

	constructor(private globalDataService: GlobalDataService,
		private documentService: DocumentService,
		private webSocketService: WebSocketService,
		private indexService: IndexService,
		private htmlDocumentFacade: HtmlDocumentFacade,
		private router: Router,
		private dialog: MatDialog,
		private bridgeService: BridgeService) {
	}

	emptyTitle= false;

	ngOnInit() {
		CKEDITOR.replace('editor1');
		CKEDITOR.config.height = 650;
		CKEDITOR.config.border = "1px solid gainsboro";
	}

	onFocus(){
		this.emptyTitle= false;
	}

	submit(formdata) {
		console.log(formdata);
		/*
				const config = new MatDialogConfig();
				config.disableClose = true;
				config.autoFocus = true;
				config.width = '250px';
				const titleDialog = this.dialog.open(TitleDialogComponent, config);
		
				titleDialog.afterClosed().subscribe(formdata => {
					if (!formdata.title) {
						return;
					}
					let html = CKEDITOR.instances.editor1.getData();
					let file = new File([new Blob([html])], 'file');
					this.save(formdata, file);			
				});*/

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

		this.htmlDocumentFacade.save(formData).subscribe((response: any) => {
			let id = response['_id'];
			this.bridgeService.changeMessage({ 'token': 'document-added', 'body': response, parent: parentId });
			/*let index = this.webSocketService.register((message) => {
				this.bridgeService.changeMessage({ 'token': 'document-indexed', 'id': id, 'message': message });				
				this.webSocketService.unRegister(index);
			});*/
			this.router.navigateByUrl('view/html/' + id, { skipLocationChange: true });
		});
	}

}

