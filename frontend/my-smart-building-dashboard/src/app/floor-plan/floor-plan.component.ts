import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Tooltip } from 'primeng/tooltip';
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
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrl: './floor-plan.component.scss',
})
export class FloorPlanComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  selectedFloor: string = '';
  selectedRoomId: string = '';
  selectedRoom: RoomData | null = null;
  roomsData: RoomsData = {
    room1F1: {
      name: 'Conference Room',
      energyConsumption: 100,
      roomTemperature: 22,
      humidity: 45,
      occupancy: 5,
    },
    room2F1: {
      name: 'Lounge 102',
      energyConsumption: 70,
      roomTemperature: 20,
      humidity: 43,
      occupancy: 3,
    },
    room3F1: {
      name: 'Lab 103',
      energyConsumption: 65,
      roomTemperature: 21,
      humidity: 47,
      occupancy: 6,
    },
    room1F2: {
      name: 'Office 201',
      energyConsumption: 80,
      roomTemperature: 22,
      humidity: 40,
      occupancy: 4,
    },
    room1F3: {
      name: 'Reception 301',
      energyConsumption: 75,
      roomTemperature: 23,
      humidity: 45,
      occupancy: 5,
    },
    room2F2: {
      name: 'Office 202',
      energyConsumption: 75,
      roomTemperature: 21,
      humidity: 40,
      occupancy: 4,
    },
    room3F2: {
      name: 'Meeting Room 203',
      energyConsumption: 60,
      roomTemperature: 22,
      humidity: 50,
      occupancy: 3,
    },
    room2F3: {
      name: 'Lounge 302',
      energyConsumption: 80,
      roomTemperature: 20,
      humidity: 45,
      occupancy: 2,
    },
    room3F3: {
      name: 'Workspace 303',
      energyConsumption: 55,
      roomTemperature: 23,
      humidity: 42,
      occupancy: 5,
    },
    // ... data for other rooms
  };

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

  @ViewChildren('mySvg') mySvgs!: QueryList<ElementRef<SVGElement>>;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private energyDataService: EnergyDataService,
    private roomService: RoomService
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

  onRoomClick(roomId: string, event: MouseEvent): void {
    console.log('SVG Clicked', roomId);
    // Listen for click events on the SVG
    this.mySvgs.forEach((svgRef) => {
      svgRef.nativeElement.addEventListener('click', (event) => {
        // Get the SVG's transformation matrix relative to the viewport
        const ctm = (svgRef.nativeElement as SVGSVGElement).getScreenCTM();

        // Transform the click event's coordinates to the SVG's coordinate system
        const svgPoint = (
          svgRef.nativeElement as SVGSVGElement
        ).createSVGPoint();
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;
        const { x, y } = ctm
          ? svgPoint.matrixTransform(ctm.inverse())
          : { x: 0, y: 0 };

        // Create a new SVG circle
        const circle = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '0');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '2');

        // Add the circle to the SVG
        svgRef.nativeElement.appendChild(circle);

        // Create an animation to expand and fade out the circle
        const animate = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'animate'
        );
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('from', '0');
        animate.setAttribute('to', '100');
        animate.setAttribute('dur', '1s');
        animate.setAttribute('begin', 'indefinite');
        animate.setAttribute('fill', 'freeze');
        circle.appendChild(animate);

        const animateOpacity = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'animate'
        );
        animateOpacity.setAttribute('attributeName', 'opacity');
        animateOpacity.setAttribute('from', '1');
        animateOpacity.setAttribute('to', '0');
        animateOpacity.setAttribute('dur', '1s');
        animateOpacity.setAttribute('begin', 'indefinite');
        animateOpacity.setAttribute('fill', 'freeze');
        circle.appendChild(animateOpacity);

        // Start the animation
        animate.beginElement();
        animateOpacity.beginElement();

        // Remove the circle after the animation
        setTimeout(() => {
          circle.remove();
        }, 1000);
      });

      this.energyDataService.getRealTimeData().subscribe(
        (data) => {
          // Directly use 'data' here. You might need a way to verify that this data belongs to the clicked room
          this.selectedRoom = data;
          console.log('Room data:', this.selectedRoom);
          // this.displayDialog = true;
        },
        (error) => {
          console.error('Error fetching real-time data:', error);
        }
      );

      // Notify other components about the room click
      this.roomService.selectRoom(roomId);
      console.log('Room clicked:', roomId);
    });
  }

  private triggerRippleEffect(event: MouseEvent): void {
    const rippleContainer = this.renderer.createElement('div');
    this.renderer.addClass(rippleContainer, 'ripple-container');
    const rippleEffect = this.renderer.createElement('span');
    this.renderer.addClass(rippleEffect, 'ripple');

    // Calculate and set position for ripple effect based on the clicked position
    const rect = (event.target as Element).getBoundingClientRect();
    const rippleX = event.clientX - rect.left;
    const rippleY = event.clientY - rect.top;
    this.renderer.setStyle(rippleEffect, 'left', `${rippleX}px`);
    this.renderer.setStyle(rippleEffect, 'top', `${rippleY}px`);

    this.renderer.appendChild(rippleContainer, rippleEffect);
    this.renderer.appendChild(event.target, rippleContainer);

    // Automatically remove the ripple effect after it has animated
    setTimeout(() => {
      this.renderer.removeChild(event.target, rippleContainer);
    }, 600); // Duration should match your CSS animation
  }

  highlightSvgRoom(roomId: string) {
    // Remove 'active' class from all rooms
    const roomElements = document.querySelectorAll('.room');
    console.log('roomElements', roomElements);
    roomElements.forEach((room) => room.classList.remove('active'));

    // Add 'active' class to the room that matches the room ID
    const roomToHighlight = Array.from(roomElements).find(
      (room) => room.getAttribute('data-room-id') === roomId
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
    const room = this.roomsData[roomId];
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
    const room = this.roomsData[roomId];
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
