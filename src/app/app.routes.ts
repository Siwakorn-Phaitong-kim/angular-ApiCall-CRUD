import { Routes } from '@angular/router';
import { Home } from './page/home/home';
import { Users } from './page/users/users';
import { Edit } from './page/edit/edit';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'users', component: Users },
    { path: 'edit/:id', component: Edit },
    { path: '**', redirectTo: '' }
];
