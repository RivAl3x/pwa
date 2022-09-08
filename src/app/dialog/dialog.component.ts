import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


export type DialogDataSubmitCallback<T> = (row: T) => void;

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: [
    `
      .w-100 {
        width: 100%;
      }
    `
  ]
})
export class DialogComponent {
  input: FormControl = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { callback: DialogDataSubmitCallback<any>; defaultValue: any },
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit() {
    if (this.data.defaultValue) {
      this.input.patchValue(this.data.defaultValue);
    }
  }
}
