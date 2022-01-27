import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ValidationDialogComponent } from './dialogs/validation-dialog/validation-dialog.component';

const components = [ValidationDialogComponent];

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  entryComponents: [ValidationDialogComponent],
  declarations: [...components],
  exports: [...components]
})
export class SharedModule {}
