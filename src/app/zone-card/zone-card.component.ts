import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SprinklerService } from '../sprinkler.service';
import { Zone } from '../Zone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zone-card',
  templateUrl: './zone-card.component.html',
  styleUrls: ['./zone-card.component.css']
})
export class ZoneCardComponent {

    @Input()
    zone:Zone;
    @Output() refreshZonesList = new EventEmitter<void>();
    show_details:boolean = false;

    constructor(private sprinklerService:SprinklerService, private router:Router){}

    turn_on(){
        this.sprinklerService.turn_zone_on(this.zone.id).subscribe(r => {
            if(r){
                this.zone.is_on = true;
            }
            this.refreshZonesList.emit();
        });
    }
    turn_off(){
        this.sprinklerService.turn_zone_off(this.zone.id).subscribe(r => {
            this.zone.is_on = false;
            this.refreshZonesList.emit();
            // alert("turning off zone " + this.zone.id);
        });
    }
    delete(){
        if(this.zone.id == 0){
            alert("Notice: Zone 0 cannot be deleted");
        }
        else if(confirm("Warning: You are deleting zone " + this.zone.id).valueOf()){
            this.sprinklerService.delete_zone(this.zone.id).subscribe( v => {
                this.refreshZonesList.emit();
            }
            );
        }
    }

    toggle_deets(){
        this.show_details = !this.show_details;
    }
}
