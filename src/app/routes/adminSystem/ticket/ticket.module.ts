import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TicketRoutingModule } from './ticket-routing.module';
import { MyTicketEditComponent } from './myTicket/edit/edit.component';
import { MyTicketListComponent } from './myTicket/list.component';


const COMPONENTS = [
  MyTicketListComponent, MyTicketEditComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    TicketRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TicketModule { }
