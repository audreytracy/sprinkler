import { Component, OnInit } from '@angular/core';
import { SprinklerService } from '../sprinkler.service';
import { Zone } from '../Zone';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css'],
  providers: [Location]
})
export class ZonesComponent implements OnInit {
    zones: Zone[];
    deviceConnected:boolean = false;
    ip_given:boolean = false;
    ip:string = "";
    url: SafeResourceUrl;
    view_inline:boolean = false;

    constructor(private sprinklerService: SprinklerService, private router : Router, private sanitizer: DomSanitizer) { }

    fetchData(){
        this.sprinklerService.has_connected_pi().subscribe(hasPi => {
            if(hasPi != null){
            console.log(hasPi);
            this.deviceConnected = hasPi;}
        });
        this.sprinklerService.get_zones().subscribe(data => {
            this.zones = data;
            console.log(data);
        })
    }

    submit_ip(){
        this.ip_given = true;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://' + this.ip + ':5000/');
        // document.getElementById("input")?.textContent
    }

    add(){
        this.sprinklerService.add_zone().subscribe(s=>{
            this.fetchData();
        });
    }

    ngOnInit(): void {
        this.fetchData();
    }

    refresh(){
        this.fetchData();
        this.fetchData();
    }

    toggle_view_inline(){
        this.view_inline = !this.view_inline;
    }
}
