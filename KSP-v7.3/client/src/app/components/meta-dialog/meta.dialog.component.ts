import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: 'meta.dialog.component.html',
    styleUrls: ['./meta.dialog.component.css']
})

export class TitleDialogComponent implements OnInit {

    form: FormGroup;
    title: string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TitleDialogComponent>,       
        @Inject(MAT_DIALOG_DATA) data) {
        if (data) {
            this.title = data.title;
        }
    }

    ngOnInit() {
        this.form = this.fb.group({
            title: [this.title, []]
        });
    }

    submit() {
        if (this.validate()) {
            this.dialogRef.close(this.form.value);
        }
    }

    validate() {
        if (!this.form.value.title) {
            return false;
        }
        return true;
    }

    close() {
        this.dialogRef.close();
    }
}