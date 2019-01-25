import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { GlobalDataService } from "../../services/data.service";
import { WebSocketService } from "../../services/websocket.service";
import { PDFDocumentFacade } from '../../facades/pdf.document.facade';
import { BridgeService } from '../../services/bridge.service';

import { TitleDialogComponent } from '../meta-dialog/meta.dialog.component';

@Component({
	templateUrl: './pdf.upload.component.html',
	styleUrls: ['./pdf.upload.component.css']
})

export class PDFUploadComponent {

	//private filesChangeEmiter : EventEmitter<FileList> = new EventEmitter();

	constructor(private globalDataService: GlobalDataService,
		private router: Router,
		private route: ActivatedRoute,
		private webSocketService: WebSocketService,
		private pdfDocumentFacade: PDFDocumentFacade,
		private dialog: MatDialog,
		private bridgeService: BridgeService) {
			
			//this.dropListener();
	}

	ngOnInit() {
		let file = this.globalDataService.get('file');
		setTimeout(() => { this.upload(file) });
	}

	upload(file) {

		const config = new MatDialogConfig();
		config.disableClose = true;
		config.autoFocus = true;
		config.width = '550px';
		config.data = {
			title: file.name
		};

		const titleDialog = this.dialog.open(TitleDialogComponent, config);

		titleDialog.afterClosed().subscribe(formdata => {			
			if(!formdata.title) {				
				return;
			}
			if(file.type !== 'application/pdf') {
				alert('Uploaded file is not PDF !!');
				return;
			}			
			this.save(formdata, file);
		});
	}

	save(formdata, file) {

		let selectedNode = this.globalDataService.get('selected-node');
		let parentId = selectedNode ? this.globalDataService.get('selected-node').node.id : 1;

		let doc = {
			title: formdata.title,
			type: file.type,
			owner: this.globalDataService.get('userName'),
			folderId: parentId
		};

		//TODO remove
		doc.owner = 'test';

		var formData = new FormData();
		formData.append('file', file);
		formData.append('metadata', JSON.stringify(doc));

		this.pdfDocumentFacade.save(formData).subscribe((response: any) => {
			var id = response['_id'];
			this.bridgeService.changeMessage({ 'token': 'document-added', 'body': response, parent: parentId });
			/*let index = this.webSocketService.register((message) => {
				this.bridgeService.changeMessage({ 'token': 'document-indexed', 'id': id, 'message': message });				
				this.webSocketService.unRegister(index);
			});*/
			this.router.navigateByUrl('view/pdf/' + id, { skipLocationChange: true });
		});

	}

/*	@HostListener('drop', ['$event']) public onDrop(evt){
		evt.preventDefault();
		evt.stopPropagation();
		//this.background = '#eee';
		let files = evt.dataTransfer.files;
		if(files.length > 0){
		  this.filesChangeEmiter.emit(files);
		}
	  }
*/

/*	@HostListener('dragenter', ['$event'])
   @HostListener('dragover', ['$event'])
  onDragOver(event) {
    //const { zone = 'zone' } = this.options;

    //if (this.dragService.accepts(zone)) {
       event.preventDefault();
    //}
  }

	//@HostListener("window:drop", ['$event']) 
	//@HostListener('dragover', ['$event']) 
	dropListener(event) {
		console.log(event);
		function drop(e) {
		console.log(e);
		}
		let canvas = document.querySelector(".canvas");
		//canvas.addEventListener("drop", drop, false);
	}

	@HostListener('drop', ['$event']) public onDrop(evt){
		evt.preventDefault();
		evt.stopPropagation();
		let files = evt.dataTransfer.files;
		console.log(evt);
		if(files.length > 0){
				 // this.background = '#eee'
		}
	  }*/
}


