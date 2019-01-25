import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: 'settings.dialog.component.html',
    styleUrls: ['./settings.dialog.component.css']
})

export class SettingsDialogComponent implements OnInit {

    form: FormGroup;
    displayName: string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SettingsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
        if (data) {
            this.displayName = data.displayName;
        }
    }

    ngOnInit() {
        this.form = this.fb.group({
            displayName: [this.displayName, []],
            hideRequired: false,
            floatLabel: 'auto',
        });
    }

    submit() {
        if (this.validate()) {
            this.dialogRef.close(this.form.value);
        }
    }

    validate() {
        if (!this.form.value.displayName) {
            return false;
        }
        return true;
    }

    close() {
        this.dialogRef.close();
    }
}