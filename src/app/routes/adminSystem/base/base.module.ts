import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseRoutingModule } from './base-routing.module';
import { CodeComponent } from './code/code.component';
import { CodeEditComponent } from './code/edit/edit.component';
import { CodeGroupComponent } from './codeGroup/code.component';
import { CodeGroupEditComponent } from './codeGroup/edit/edit.component';
import { IconComponent } from './icon/icon.component';
import { CorporationComponent } from './corporation/corporation.component';
import { CorporationEditComponent } from './corporation/edit/edit.component';
import { FileComponent } from './file/file.component';
import { FileEditComponent } from './file/edit/edit.component';
import { FileDetailComponent } from './file/detail/detail.component';

const COMPONENTS = [CodeComponent, CodeEditComponent,
  CodeGroupComponent, CodeGroupEditComponent, IconComponent,
  CorporationComponent, CorporationEditComponent,
  FileComponent, FileEditComponent,

];
const COMPONENTS_NOROUNT = [FileDetailComponent];

@NgModule({
  imports: [
    SharedModule,
    BaseRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BaseModule { }
