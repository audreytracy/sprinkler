import { Component } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { SprinklerService } from '../sprinkler.service';
import { SchedItem } from '../SchedItem';


@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {

    names: string[] = []
    times: string[] = []
    zones: SchedItem[][] = []
    data = ""

    submit() {
        let ind_zones = this.data.split(",")
        let zone_ids: number[] = []
        let durations: number[] = []
        for (let i = 0; i < ind_zones.length; i++) {
            // ind_zones.forEach((zone_id) => { // each one looks like zone:duration
            zone_ids.push(ind_zones[i].split(':')[0].trim() as unknown as number);
            durations.push(ind_zones[i].split(':')[1].trim() as unknown as number);
        };
        let g = this.generateData(zone_ids, durations);
        this.sprinklerService.add_zone_sched(1, g).subscribe();
    }

    ngOnInit() {
        this.sprinklerService.get_zone_scheds().subscribe(array => {
            console.log(array.length)
            for (let i = 0; i < array.length; i++) {
                // const zones: Record<string, { order: number; duration: number }> = {};
                this.names.push(array[i]['name']);
                this.times.push(array[i]['time_start'])
                // this.sprinklerService.get_zone_list_scheds(i + 1).subscribe(array2 => {
                //     this.zones.push(array2)
                // })
            }
        });
        console.log(this.zones[1])
    }
    //     duration1 = 0;
    //     duration2 = 0;
    //     duration3 = 0;
    // // get number of zones
    // // 
    // // Create a function to generate the desired JSON structure
    //     possible_zones:number[] = []
    //     zone_id = {}
    //     zones1 = this.generateData(); // return these to just be lists of numbers because that is what we need for the drag n drop feature to work
    //     zones2 = this.generateData(); // once someone clicks submit (also need to add that submit button), THEN we convert this to the weird generate data format
    //     zones3 = this.generateData();
    //     zones4 = this.generateData();
    //     durations = []
    //     ngOnInit(){
    //         // this.sprinklerService.get_group_info(1).subscribe(()=>{});
    //         const zone_max = this.sprinklerService.get_num_zones();      
    //         for (let zone_id = 0; zone_id < zone_max; zone_id++) {
    //             this.possible_zones.push(zone_id);
    //         }
    //         zones1 = possible_zones;


    //     }

    constructor(private sprinklerService: SprinklerService) { }


    //     drop1(e: CdkDragDrop<string[]>) {
    //         moveItemInArray(this.zones1, e.previousIndex, e.currentIndex);
    //     }

    //     drop2(e: CdkDragDrop<string[]>) {
    //         moveItemInArray(this.zones2, e.previousIndex, e.currentIndex);
    //     }

    //     drop3(e: CdkDragDrop<string[]>) {
    //         moveItemInArray(this.zones3, e.previousIndex, e.currentIndex);
    //     }

    //     drop4(e: CdkDragDrop<string[]>) {
    //         moveItemInArray(this.zones4, e.previousIndex, e.currentIndex);
    //     }

    generateData(zone_ids: number[], durations: number[]) {
        const zones: Record<string, { order: number; duration: number }> = {};
        zone_ids.forEach((zone_id, index) => {
            zones[zone_id] = {
                order: index,
                duration: durations[index],
            }
        });

        const zone_sched = {
            name: this.names[0],
            zones,
            time_start: this.times[0]//new Date().toISOString(), // or set your desired start time logic here
        };

        return zone_sched;
    }
}
