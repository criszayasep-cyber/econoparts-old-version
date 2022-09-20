import { Injectable } from '@angular/core';
import { ConfiguracionService } from '../default/configuracion.service';
import { AuthService } from './auth.service';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    
    const tokenPayload = decode(ConfiguracionService.bearer);
    var roles = tokenPayload["role"];
    
    if(roles instanceof Array){
      if (
        !this.auth.isAuthenticated() || 
        (!roles.find(f => f==expectedRole) && !roles.find(f => f=="ROOT"))
      ) {
        this.router.navigate(['authentication']);
        return false;
      }
    }else{
      if (
        !this.auth.isAuthenticated() || 
        (roles!=expectedRole && roles!="ROOT")
      ) {
        this.router.navigate(['authentication']);
        return false;
      }
    }
    
    return true;
  }
}
