import { Component, OnInit } from '@angular/core';

import { GlobalDataService } from "./../../services/data.service";
import { UserService } from "./../../services/user.service";
import { BridgeService } from "./../../services/bridge.service";

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

	displayName: any;
	hide = false;

	constructor(private globalDataService: GlobalDataService,
		private userService: UserService,
		private dataService: GlobalDataService,
		private bridgeService: BridgeService) {
		this.bridgeService.currentMessage.subscribe((message: any) => {
			if (message.token === 'user-info-updated') {
				this.loadUserInfo();
			}
			if (message.token === 'enable_reader_mode') {
				this.hide = true;
			}
			if (message.token === 'disable_reader_mode') {
				this.hide = false;
			}
		});
	}

	ngOnInit() {
		this.loadUserInfo();
	}

	loadUserInfo() {	
					
		this.userService.getCurrentUser()
		.subscribe((res: any) => {
			this.globalDataService.put('userDisplayName', res.displayName);
			this.globalDataService.put('userName', res.userName); // id is username
			this.displayName = res.displayName;
		});
		
		this.userService.getAllUsers().subscribe((response: any) => {
			let users = {};
			response && response.forEach((user) => {
			  users[user.userName] = user.displayName ? user.displayName : user.userName;
			});
			this.dataService.put('user-info', users); // for global use
		});
	}

}


