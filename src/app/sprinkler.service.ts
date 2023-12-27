import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Login } from './login.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Zone } from './Zone';
import { Sched } from './Sched';
import { SchedItem } from './SchedItem';
// import { Zone } from './Zone';

@Injectable({
    providedIn: 'root'
})
export class SprinklerService {
    // user_id = 0
    constructor(private http: HttpClient, private loginService: Login, private afAuth: AngularFireAuth) { }

    // water every few days
    // start time & duration of watering
    // returns list of contacts
    // group zones



    has_connected_pi(): Observable<boolean | null> {
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(null);
                } else {
                    const uid = user.uid;
                    return this.http.get<any>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}.json`).pipe(
                        map(responseData => {
                            if (responseData['has_connected_device'] == null) {
                                return false;
                            }
                            return responseData['has_connected_device'] as boolean;
                        })
                    );
                }
            }),
            // handle any potential errors and return false if necessary
            // catchError(() => of(false))
        );
    }
    get_next_zone_id(): Observable<number> {
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(-1);
                } else {
                    const uid = user.uid;
                    return this.http.get<any>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones.json`).pipe(
                        map(data => {
                            for (let i = 0; i < 16; i++) {
                                if (data[i] == null) {
                                    return i;
                                }
                            }
                            alert("Maximum number of zones is 16")
                            return -1;
                        }),
                        catchError(() => of(-1))
                    );
                }
            }),
            catchError(() => of(-1))
        );
    }

    add_zone(): Observable<boolean> {
        return this.get_next_zone_id().pipe(
            switchMap(next_zone_id => {
                if (next_zone_id === -1) {
                    return of(false);
                } else {
                    return this.loginService.currentUser().pipe(
                        switchMap(user => {
                            if (user == null) {
                                return of(false);
                            } else {
                                const uid = user.uid;
                                const nz = { 'id': next_zone_id, 'is_on': false, 'toggled': new Date().toLocaleString()};
                                return this.http.put<boolean>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones/${next_zone_id}.json`, nz).pipe(
                                    map(() => true),
                                    catchError(() => of(false))
                                );
                            }
                        }),
                        catchError(() => of(false))
                    );
                }
            }),
            catchError(() => of(false))
        );
    }

    get_group_info(zone:number){
        
    }

    delete_zone(id: number): Observable<boolean> {
        if (id === 0) return of(false);
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(false);
                } else {
                    const uid = user.uid;
                    return this.http.delete<boolean>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones/${id}.json`).pipe(
                        map(() => true),
                        catchError(() => of(false))
                    );
                }
            }),
            catchError(() => of(false))
        );
    }

    get_zones(): Observable<Zone[]> {
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of([]);
                } else {
                    const uid = user.uid;
                    return this.http.get<Zone[]>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones.json`).pipe(
                        map(responseData => {
                            const zone_array: Zone[] = [];
                            for (const key in responseData) {
                                if (responseData[key] != null)
                                    zone_array.push(responseData[key] as Zone);
                            }
                            return zone_array;
                        })
                    );
                }
            }),
            // handle any potential errors and return an empty array if necessary
            catchError(() => of([]))
        );
    }

    get_num_zones():number {
        this.get_zones().subscribe(zones => {
            return zones.length;
        })
        return -1;
    }

    get_zone_that_is_on(): Observable<number> {
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(-1);
                } else {
                    const uid = user.uid;
                    return this.http.get<Zone[]>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones.json`).pipe(
                        map(responseData => {
                            for (const key in responseData) {
                                if (responseData[key] != null && (responseData[key] as Zone).is_on) return key as any as number;
                            }
                            return -1;
                        })
                    );
                }
            }),
            catchError(() => of(-1))
        );
    }

    CAT(zone: number): Observable<boolean> {
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(false);
                }
                else {
                    return this.get_zone_that_is_on().pipe(
                        switchMap(zone_on => {
                            this.turn_zone_off(zone_on).subscribe();
                            const uid = user.uid;
                            return this.http.get<boolean>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones/${zone}.json`).pipe(
                                switchMap(e => {
                                    if (e !== null) {
                                        return this.http.put<boolean>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones/${zone}/is_on.json`, true).pipe(
                                            map(p => {
                                                if (p == null) return false;
                                                return true;
                                            }),
                                            catchError(() => of(false))
                                        );
                                    }
                                    else {
                                        alert("zone does not exist")
                                        return of(false);
                                    }
                                })
                            );
                        })
                    );
                }
            }),
            catchError(() => of(false))
        );
    }


    turn_zone_on(zone: number): Observable<boolean> {
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(false);
                } else {
                    return this.get_zone_that_is_on().pipe(
                        switchMap(zone_on => {
                            if (zone_on == -1) {
                                const uid = user.uid;
                                // alert("turning on zone " + zone);
                                const data = { 'id': zone, 'is_on': true, 'toggled':  new Date().toLocaleString()};

                                return this.http.put<boolean>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones/${zone}.json`, data).pipe(
                                    map(() => true),
                                    catchError(() => of(false))
                                );

                            } else {
                                alert("cannot turn on multiple zones at once, turn off zone " + zone_on);

                                return of(false);
                            }
                        })
                    );
                }
            }),
            catchError(() => of(false))
        );
    }

    turn_zone_off(zone: number): Observable<boolean> {
        if (zone == -1) return of(false);
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of(false);
                } else {
                    const uid = user.uid;
                    const data = { 'id': zone, 'is_on': false, 'toggled': new Date().toLocaleString()};

                    return this.http.put<Zone[]>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zones/${zone}.json`, data).pipe(map(responseData => { return false }));
                }
            }),
            catchError(() => of(false))
        );
    }

    add_zone_sched(sched_id: number, data:any): Observable<boolean> {
        return of(sched_id).pipe(
            switchMap(sched_id => {
                if (sched_id === -1) {
                    return of(false);
                } else {
                    return this.loginService.currentUser().pipe(
                        switchMap(user => {
                            if (user == null) {
                                return of(false);
                            } else {
                                const uid = user.uid;
                                return this.http.put<boolean>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zone_scheds/${sched_id}.json`, data).pipe(
                                    map(() => true),
                                    catchError(() => of(false))
                                );
                            }
                        }),
                        catchError(() => of(false))
                    );
                }
            }),
            catchError(() => of(false))
        );
    }

    get_zone_scheds(){
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of([]);
                } else {
                    const uid = user.uid;
                    return this.http.get<Sched[]>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zone_scheds.json`).pipe(
                        map(responseData => {
                            const scheds: Sched[] = [];
                            for (const key in responseData) {
                                if (responseData[key] != null)
                                scheds.push(responseData[key] as Sched);
                            }
                            return scheds;
                        })
                    );
                }
            }),
            // handle any potential errors and return an empty array if necessary
            catchError(() => of([]))
        );
    }

    
    get_zone_list_scheds(zone_sched_id:number){
        return this.loginService.currentUser().pipe(
            switchMap(user => {
                if (user == null) {
                    return of([]);
                } else {
                    const uid = user.uid;
                    return this.http.get<SchedItem[]>(`https://sprinkler-6d26c-default-rtdb.firebaseio.com/${uid}/zone_scheds/${zone_sched_id}/zones.json`).pipe(
                        map(responseData => {
                            const scheds: SchedItem[] = [];
                            for (const key in responseData) {
                                if (responseData[key] != null)
                                scheds.push(responseData[key] as SchedItem);
                            }
                            return scheds;
                        })
                    );
                }
            }),
            // handle any potential errors and return an empty array if necessary
            catchError(() => of([]))
        );
    }

}