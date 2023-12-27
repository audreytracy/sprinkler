import { Component, Input } from '@angular/core';
import { Zone } from '../Zone';
import { SprinklerService } from '../sprinkler.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
    @Input()
    zone:Zone;
    groups:number[];
    constructor(private sprinklerService:SprinklerService){}
    ngOnInit(){
        // this.sprinklerService.getGroups()}
    }
}
