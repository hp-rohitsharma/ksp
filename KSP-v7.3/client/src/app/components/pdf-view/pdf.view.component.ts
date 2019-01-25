import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DocumentService } from '../../services/document.service';
import { GlobalDataService } from "../../services/data.service";
import { BridgeService } from '../../services/bridge.service';

@Component({
	templateUrl: './pdf.view.component.html',
	styleUrls: ['./pdf.view.component.css']
})

export class PDFViewComponent implements OnInit {

	blog: any;
	pdfSource: Uint8Array;
	fileURL: any;
	loading = false;

	constructor(private documentService: DocumentService,
		private route: ActivatedRoute,
		private bridgeService: BridgeService,
		private domSanitizer: DomSanitizer,	
		private dataService: GlobalDataService,	
		private globalDataService: GlobalDataService) {
	}

	ngOnInit() {

		let isEditing = this.globalDataService.get('isEditing');
		if(isEditing) {
			alert('editing');
			return false;
		} else {
			this.route.params.subscribe((params: any) => {
				this.getBlog(params.id);
			});
		}

		/*this.route.params.subscribe((params: any) => {
			this.getBlog(params.id);
		});*/
	}

	getBlog(id) {
		this.bridgeService.changeMessage({ token: 'disbale-edit' });
		this.loading = true;
		this.documentService.get(id).subscribe((res: any) => {
			let users = this.dataService.get('user-info');
			res.owner = users[res.owner] ? users[res.owner] : res.owner;
			this.blog = res;
		});
		this.documentService.download(id, 'arraybuffer').subscribe((res: any) => {
			var file = new Blob([res], { type: 'application/pdf' });
			this.fileURL = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file) + '#view=FitH&toolbar=0&navpanes=0');
			console.log('pdf loaded');
			this.globalDataService.put('opened-blog', this.blog);
			this.bridgeService.changeMessage({ token: 'document-opened' });
			this.loading = false;
		});
	}

}

