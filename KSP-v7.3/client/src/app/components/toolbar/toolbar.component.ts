import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { WindowRef } from '../../services/window-ref';

import { GlobalDataService } from "../../services/data.service";
import { WebSocketService } from "../../services/websocket.service";
import { BridgeService } from '../../services/bridge.service';
import { UserService } from '../../services/user.service';
import { FeedbackService } from '../../services/feedback.service';

import { SettingsDialogComponent } from '../settings-dialog/settings.dialog.component';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback.dialog.component';

@Component({
	selector: 'toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent {

	editable: false;
	hide = false;

	constructor(private globalDataService: GlobalDataService,
		private webSocketService: WebSocketService,
		private bridgeService: BridgeService,
		private dialog: MatDialog,
		private userService: UserService,
		private feedbackService: FeedbackService,	
		private window: WindowRef,
		private router: Router) {

		this.router.navigate(['view/welcome/home'], { skipLocationChange: true });
			
		this.webSocketService.register((message) => {
			console.log('Message received from server ');
			console.log(message);
			this.bridgeService.changeMessage({ 'token': 'document-indexed' });
			if (message.type === 'index') {
				//	this.bridgeService.changeMessage({ 'token': 'document-indexed' });
			}			
		});

		this.bridgeService.currentMessage.subscribe((message: any) => {			
			if (message.token === 'enable_reader_mode') {
				this.hide = true;
			}
			if (message.token === 'disable_reader_mode') {
				this.hide = false;
			}
		});
	}

	create() {
		this.router.navigate(['create/html'], { skipLocationChange: true });
	}

	edit() {
		//this.router.navigate(['blog/view', blogid], { skipLocationChange: true });
	}

	upload(file) {
		this.globalDataService.put('file', file);
		this.router.navigate(['upload/pdf'], { skipLocationChange: true });
	}

	settings() {
		const config = new MatDialogConfig();
		config.disableClose = true;
		config.autoFocus = true;
		config.width = '550px';
		config.data = {
			displayName: this.globalDataService.get('userDisplayName')
		};
		const titleDialog = this.dialog.open(SettingsDialogComponent, config);

		titleDialog.afterClosed().subscribe(formdata => {
			this.save(formdata);
		});
	}

	save(formdata) {
		console.log(formdata);
		this.userService.saveUser({
			displayName: formdata.displayName
		}).subscribe(
			(res: any) => {
				this.bridgeService.changeMessage({ 'token': 'user-info-updated', displayName: res.displayName });
			},
			error => {
				console.error('Error while updating user information');
			});
	}

	report() {
		const config = new MatDialogConfig();
		config.disableClose = false;
		config.autoFocus = true;
		config.width = '700px';
		const titleDialog = this.dialog.open(FeedbackDialogComponent, config);

		titleDialog.afterClosed().subscribe(formdata => {
			this.saveFeedback(formdata);
		});		
	}

	saveFeedback(formdata) {
		console.log(formdata);
		this.feedbackService.save({
			feedback: formdata.feedback
		}).subscribe(
			/*(res: any) => {
				this.bridgeService.changeMessage({ 'token': 'user-info-updated', displayName: res.displayName });
			},
			error => {
				console.error('Error while updating user information');
			}*/);
	}

}


