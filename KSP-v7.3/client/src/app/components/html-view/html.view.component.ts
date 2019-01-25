import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from "@angular/material";

import { GlobalDataService } from "../../services/data.service";
import { BridgeService } from '../../services/bridge.service';
import { DocumentService } from '../../services/document.service';
import { HtmlDocumentFacade } from '../../facades/html.document.facade';

import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete.confirmation.dialog.component";

@Component({
	templateUrl: './html.view.component.html',
	styleUrls: ['./html.view.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class HTMLViewComponent implements OnInit {

	blog: any;
	reader_mode = false;
	loading = false;

	constructor(private documentService: DocumentService,
		private route: ActivatedRoute,
		private bridgeService: BridgeService,
		private dataService: GlobalDataService,
		private htmlDocumentFacade: HtmlDocumentFacade,
		private router: Router,
		private dialog: MatDialog,
		private globalDataService: GlobalDataService) {
	}

	ngOnInit() {	
		if(this.globalDataService.get('reader-mode') === true){
			this.reader_mode = true;
		}
		this.route.params.subscribe((params: any) => {
			this.getBlog(params.id);
		});				
	}

	getBlog(id) {
		this.bridgeService.changeMessage({ token: 'disable-edit' });
		this.loading = true;
		this.documentService.get(id).subscribe((res: any) => {
			let users = this.dataService.get('user-info');
			res.owner = users[res.owner] ? users[res.owner] : res.owner;
			this.blog = res;
		});

		this.documentService.download(id, 'arraybuffer').subscribe((res: any) => {
			this.blog.content = new TextDecoder("utf-8").decode(new Uint8Array(res))
			this.globalDataService.put('opened-blog', this.blog);
			this.bridgeService.changeMessage({ token: 'document-opened' });
			this.loading = false;
		});
	}

	edit(id) {
		this.router.navigate(['edit/html', id], { skipLocationChange: true });
	}

	delete(id) {
		const config = new MatDialogConfig();
		config.disableClose = true;
		config.autoFocus = true;
		config.width = '350px';
		const confirmationDialog = this.dialog.open(DeleteConfirmationDialogComponent, config);
		confirmationDialog.afterClosed().subscribe((decision) => {
			if (decision === true) {
				this.htmlDocumentFacade.delete(id);
			}
			return false;
		});
	}

	//@HostListener("window:scroll", ['$event']) 
	onScroll(event) {
		let progress = document.querySelector(".progress"), scroll;
		let scrollable = document.querySelector(".blog-area > .scrollable");
		//let scrollTop = event.currentTarget['scrollTop'];
		//let scrollHeight = event.currentTarget['scrollHeight'];
		//let clientHeight = event.currentTarget['clientHeight'];
		let scrollTop = scrollable['scrollTop'];
		let scrollHeight = scrollable['scrollHeight'];
		let clientHeight = scrollable['clientHeight'];
	//	scroll = (scrollTop) / (scrollHeight) * 100;
	    scroll = (scrollTop) / (scrollHeight - clientHeight) * 100;
		(<any>progress).style.setProperty("--scroll", scroll + "%");				
	}

	toggleReaderMode() {
		if(!this.reader_mode) {						
			this.bridgeService.changeMessage({ token: 'enable_reader_mode' });
			this.globalDataService.put('reader-mode', true);
			this.reader_mode = true;
		} else {
			this.reader_mode = false;
			this.bridgeService.changeMessage({ token: 'disable_reader_mode' });
			this.globalDataService.put('reader-mode', false);
		}
	}
	
}

