import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListItemComponent} from "./list-item/list-item.component";
import {ListPomoComponent} from "./list-pomo/list-pomo.component";
import {FormsModule} from "@angular/forms";
import {ListsService} from "./lists.service";
import {ListRoutingModule} from "./lists-routing.module";
import { ListGuard } from './guards/list.guard';
import {ListDeactivateGuard} from "./guards/list-deactivate.guard";
import {ListsResolver} from "./guards/lists.resolver";


@NgModule({
    declarations: [
        ListItemComponent,
        ListPomoComponent
    ],
    imports: [
        CommonModule,
        ListRoutingModule,
        FormsModule
    ],
    exports: [
        ListItemComponent
    ],
    providers: [ListsService, ListGuard, ListDeactivateGuard, ListsResolver]
})
export class ListsModule {
}