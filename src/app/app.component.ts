import { Component, EventEmitter, Output } from '@angular/core';
import { SprinklerService } from './sprinkler.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'sprinkler';

    constructor(public dialog: MatDialog) { }

    // refresh(){
        
    // }

    GETTHATCAT() {
        this.dialog.open(cat_popup);
    }
}

@Component({
    selector: 'cat',
    template: `
        <h1 mat-dialog-title>Quick! Cat alert!</h1>
        <div mat-dialog-content>
            <mat-form-field>
            <mat-label>zone closest to feline fiend</mat-label>
                <input #zone type = "number" matInput>
            </mat-form-field>
        </div>
        <div style = "margin:-2em 0em 0em 0.3em" mat-dialog-actions>
            <button mat-button mat-dialog-close (click)="override(zone.value)">Get it!</button>
        </div>
    `,
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatInputModule],
})
export class cat_popup {

    // @Output() refreshZonesList = new EventEmitter<void>();

    constructor(private sprinklerService: SprinklerService, private router:Router) { }

    override(z: string) {
        let zone = parseInt(z)
        this.sprinklerService.CAT(zone).subscribe(()=>{
            window.location.reload();
        });
    }
}

