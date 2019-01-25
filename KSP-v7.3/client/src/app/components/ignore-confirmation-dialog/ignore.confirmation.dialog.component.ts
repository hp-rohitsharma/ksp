import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: 'ignore.confirmation.dialog.component.html',
    styleUrls: ['./ignore.confirmation.dialog.component.css']
})

export class IgnoreConfirmationDialogComponent implements OnInit {

    form: FormGroup;  

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<IgnoreConfirmationDialogComponent>) {        
    }

    ngOnInit() {
        this.form = this.fb.group({ });
    }

    ignoreChanges(value) {
        this.dialogRef.close(value);
    }

}