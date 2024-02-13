import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '.././environments/environment.prod';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface RoomData {
  roomId?: string;
  mattertagId?: string;
  name: string; // Add this line
  energyConsumption: number;
  roomTemperature: number;
  humidity: number;
  occupancy: number;
  anchorPosition: Position;
  stemVector: Position;
}

interface RoomsData {
  [key: string]: RoomData;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  roomsData: RoomsData = {
    room1F1: {
      // roomId: 'room1F1',
      name: 'room1F1',
      energyConsumption: 100,
      roomTemperature: 22,
      humidity: 45,
      occupancy: 5,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room2F1: {
      name: 'room2F1',
      energyConsumption: 70,
      roomTemperature: 20,
      humidity: 43,
      occupancy: 3,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room3F1: {
      name: 'room3F1',
      energyConsumption: 65,
      roomTemperature: 21,
      humidity: 47,
      occupancy: 6,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room1F2: {
      name: 'room1F2',
      energyConsumption: 80,
      roomTemperature: 22,
      humidity: 40,
      occupancy: 4,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room1F3: {
      name: 'room1F3',
      energyConsumption: 75,
      roomTemperature: 23,
      humidity: 45,
      occupancy: 5,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room2F2: {
      name: 'room2F2',
      energyConsumption: 75,
      roomTemperature: 21,
      humidity: 40,
      occupancy: 4,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room3F2: {
      name: 'room3F2',
      energyConsumption: 60,
      roomTemperature: 22,
      humidity: 50,
      occupancy: 3,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room2F3: {
      name: 'room2F3',
      energyConsumption: 80,
      roomTemperature: 20,
      humidity: 45,
      occupancy: 2,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    room3F3: {
      name: 'room3F3',
      energyConsumption: 55,
      roomTemperature: 23,
      humidity: 42,
      occupancy: 5,
      anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
      stemVector: { x: -0.025, y: 0.999, z: 0.02 },
    },
    // ... data for other rooms
  };

  private roomSelectionSource = new BehaviorSubject<string | null>(null);

  // Observable room selection stream
  roomSelection$ = this.roomSelectionSource.asObservable();

  // Method to update the selected room
  selectRoom(roomId: string) {
    this.roomSelectionSource.next(roomId);
  }

  getRoomsData(): RoomsData {
    return this.roomsData;
  }

  updateRoomData(roomId: string, data: any) {
    console.log('updateRoomData', roomId, data);
    if (this.roomsData[roomId]) {
      this.roomsData[roomId] = { ...this.roomsData[roomId], ...data };
      console.log('updated room data', this.roomsData[roomId]);
    }
  }
}
