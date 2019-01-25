import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: 'delete.confirmation.dialog.component.html',
    styleUrls: ['./delete.confirmation.dialog.component.css']
})

export class DeleteConfirmationDialogComponent implements OnInit {

    form: FormGroup;  

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) {        
    }

    ngOnInit() {
        this.form = this.fb.group({ });
    }

    ignore() {
        this.dialogRef.close();
    }

}