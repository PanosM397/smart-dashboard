import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EnergyDataService } from 'src/shared/energy-data.service';
import { RoomService } from 'src/shared/room.service';

interface RoomData {
  roomId?: string;
  name: string; // Add this line
  energyConsumption: number;
  roomTemperature: number;
  humidity: number;
  occupancy: number;
  // ... any other properties returned by your API
}

interface RoomsData {
  [key: string]: RoomData;
}

interface ElevatorData {
  status: string;
  nextMaintenance: Date;
  alerts: string[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit{
  private subscription!: Subscription;
  selectedFloor: string = '';
  selectedRoomId: string = '';
  selectedRoom: RoomData | null = null;

  elevatorData: ElevatorData = {
    status: 'Operational',
    nextMaintenance: new Date('2024-02-15'),
    alerts: ['Door sensor needs replacement'],
  };

  hoveredRoom: RoomData | null = null;
  tooltipPosition = { x: 0, y: 0 };

  roomsData1 = {
    floor1: [
      { id: 'room1', x: 11, y: 50, labelX: 70, labelY: 100, label: '101' },
      // ... other room data
    ],
    // ... data for other floors
  };

  displayDialog: boolean = false;

  displayElevatorDialog: boolean = false;

  constructor(
    private energyDataService: EnergyDataService,
    private roomService: RoomService,
  ) {}

  ngOnInit() {
    // Subscribe to room selection changes
    this.subscription = this.roomService.roomSelection$.subscribe((roomId) => {
      if (roomId) {
        this.highlightSvgRoom(roomId);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  onRoomClick(roomId: string): void {
    this.energyDataService.getRealTimeData().subscribe(
      (data) => {
        // Directly use 'data' here. You might need a way to verify that this data belongs to the clicked room
        this.selectedRoom = data;
        console.log('Room data:', this.selectedRoom);
        // this.displayDialog = true;
      },
      (error) => {
        console.error('Error fetching real-time data:', error);
      },
    );

    // Notify other components about the room click
    this.roomService.selectRoom(roomId);
    console.log('Room clicked:', roomId);
  }

  highlightSvgRoom(roomId: string) {
    // Remove 'active' class from all rooms
    const roomElements = document.querySelectorAll('.room');
    console.log('roomElements', roomElements);
    roomElements.forEach((room) => room.classList.remove('active'));

    // Add 'active' class to the room that matches the room ID
    const roomToHighlight = Array.from(roomElements).find(
      (room) => room.getAttribute('data-room-id') === roomId,
    );
    console.log('roomToHighlight', roomToHighlight);
    if (roomToHighlight) {
      roomToHighlight.classList.add('active');
    }
  }

  onFloorClick(floorId: string) {
    this.selectedFloor = floorId;
    // Logic to handle floor click event
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  showTooltip(event: MouseEvent, roomId: string) {
    const room = this.roomService.roomsData[roomId];
    const tooltipText = room
      ? `${room.name}\nEnergy: ${room.energyConsumption} kWh`
      : 'Room Info Unavailable';
    const tooltip = document.getElementById('svgTooltip');
    if (tooltip) {
      tooltip.textContent = tooltipText;
      tooltip.style.visibility = 'visible';
      tooltip.style.top = `${event.clientY}px`;
      tooltip.style.left = `${event.clientX}px`;
    }
  }

  hideTooltip() {
    const tooltip = document.getElementById('svgTooltip');
    if (tooltip) {
      tooltip.style.visibility = 'hidden';
    }
  }

  getRoomColor(roomId: string): string {
    const room = this.roomService.roomsData[roomId];
    if (!room) return '#ADD8E6'; // default color

    // Example: change color based on energy consumption
    if (room.energyConsumption >= 100) return '#FF6961'; // high consumption
    if (room.energyConsumption > 70 && room.energyConsumption < 80)
      return '#FDFD96'; // medium consumption
    return '#77DD77'; // low consumption
  }

  onElevatorClick() {
    // Example implementation: Open a dialog with elevator information
    this.displayElevatorDialog = true; // Assuming you have a boolean to control the dialog visibility
    console.log('Elevator Data:', this.elevatorData);
  }
}
