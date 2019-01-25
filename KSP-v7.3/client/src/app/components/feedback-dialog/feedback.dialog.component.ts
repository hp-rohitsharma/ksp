import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: 'feedback.dialog.component.html',
    styleUrls: ['./feedback.dialog.component.css']
})

export class FeedbackDialogComponent implements OnInit {

    form: FormGroup;
    feedback: string;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<FeedbackDialogComponent>,       
        @Inject(MAT_DIALOG_DATA) data) {
        if (data) {
            this.feedback = data.feedback;
        }
    }

    ngOnInit() {
        this.form = this.fb.group({
            feedback: [this.feedback, []]
        });
    }

    submit() {
        if (this.validate()) {
            this.dialogRef.close(this.form.value);
        }
    }

    validate() {
        if (!this.form.value.feedback) {
            return false;
        }
        return true;
    }

    close() {
        this.dialogRef.close();
    }
}