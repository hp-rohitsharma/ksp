import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { GlobalDataService } from "./data.service";


@Injectable()
export class OpenLinkService implements CanActivate {

  constructor(
    private router: Router,
    private globalDataService: GlobalDataService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log(state);
    console.log(route);
    let isEditing = this.globalDataService.get('isEditing');
		if(isEditing) {	
      alert('Hit Cancel To Ignore Changes');		
			return false;
		} else {
			return true;
		}
  }

}