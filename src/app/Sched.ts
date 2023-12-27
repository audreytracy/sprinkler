export interface Sched {
    name: string;
    time_start: string;
    zones: {
      [key: number]: {
        duration: string; // Change to the actual type of 'duration'
        order: number;
      };
    };
  }