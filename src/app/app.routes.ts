import { Routes } from '@angular/router';
import { Home } from './page/home/home';
import { Users } from './page/users/users';
import { Edit } from './page/edit/edit';
import { Create } from './page/create/create';
import { Login } from './page/login/login';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', component: Home, canActivate: [authGuard] },
    { path: 'users', component: Users, canActivate: [authGuard] },
    { path: 'edit/:id', component: Edit, canActivate: [authGuard] },
    { path: 'create', component: Create, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
