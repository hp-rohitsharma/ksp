import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WelcomeService } from '../../services/welcome.service';

@Component({
	//selector : 'app-root',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {
	
	showWelcome = true;
	showDemo = false;
	
	constructor(private router: Router,
		private welcomeService: WelcomeService,
		private route: ActivatedRoute) {
		//console.log('hi');
	}

	ngOnInit() {
		// this.router.navigate(['create/html'], { skipLocationChange: true });

		this.route.params.subscribe((params: any) => {
			this.welcomeService.get(params.named).subscribe((res: any) => {								
			// 	this.blog = res;
			});
		});	
	}

	demo() {
		this.showWelcome = false
		this.showDemo = true;
		
	}
	
}


