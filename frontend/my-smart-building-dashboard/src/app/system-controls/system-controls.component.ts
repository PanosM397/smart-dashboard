import { Component, OnInit } from '@angular/core';

 interface SystemControl {
  id: string;
  name: string;
  state: boolean;
  level?: number; // For systems with levels like lighting or temperature
}

// Example initial state
 const INITIAL_CONTROLS: SystemControl[] = [
  { id: 'hvac', name: 'HVAC', state: false },
  { id: 'lighting', name: 'Lighting', state: true, level: 75 },
  // Add more controls as needed
];


@Component({
  selector: 'app-system-controls',
  templateUrl: './system-controls.component.html',
  styleUrls: ['./system-controls.component.scss']
})
export class SystemControlsComponent implements OnInit {
  controls: SystemControl[] = [];


  constructor() {

   }

  ngOnInit() {
    this.controls = INITIAL_CONTROLS;
  }

  toggleControl(control: SystemControl) {
    control.state = !control.state;
    // Call a service to update the control state in the backend
  }

  changeLevel(control: SystemControl, event: any): void {
    const newLevel = event.value as number; // Cast the event value to number
    if (newLevel !== undefined && control.level !== undefined) {
      control.level = newLevel;
      // Call a service to update the control level in the backend
      // Example: this.yourService.updateSystemLevel(control.id, newLevel);
    } else {
      console.error('New level is undefined.');
    }
  }



  // ... Add more methods for other system controls
}
