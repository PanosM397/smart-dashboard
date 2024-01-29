import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { RoomService } from 'src/shared/room.service';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface RoomData {
  roomId?: string;
  mattertagId?: string;
  name: string;
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

declare global {
  interface Window {
    MP_SDK: any;
  }
}
@Component({
  selector: 'app-matterport-viewer',
  templateUrl: './matterport-viewer.component.html',
  styleUrls: ['./matterport-viewer.component.scss'],
})
export class MatterportViewerComponent implements AfterViewInit {
  @Input() roomId!: string;

  mpSDK: any;

  constructor(private roomService: RoomService) {}

  ngAfterViewInit() {
    this.connectSdk();
    this.roomService.roomSelection$.subscribe((roomId) => {
      if (roomId) {
        this.focusOnMatterportRoom(roomId);
        console.log('Room selected:', roomId);
      }
    });
  }

  async connectSdk() {


    const sdkKey = 'pkhmft8p3rz08940i2p3eg8ra';
    const iframe = document.getElementById('showcase-iframe') as HTMLIFrameElement;
    if (!iframe) {
      console.error('IFrame not found');
      return;
    }

    try {
      console.log('Connecting to Matterport SDK...');
      this.mpSDK = await (window as any).MP_SDK.connect(iframe, sdkKey, '');
      console.log('Connected to Matterport SDK');
      await this.onShowcaseConnect(this.mpSDK);
    } catch (e) {
      console.error('Error connecting to Matterport SDK:', e);
    }
  }


  async onShowcaseConnect(mpSdk: any) {
    console.log('onShowcaseConnect');
    try {
      const modelData =  mpSdk.Model.getData();
      console.log('Model sid:' + modelData.sid);

      mpSdk.on('tag.select', (tag: any) => this.onTagSelect(tag));

      const roomsData = this.roomService.getRoomsData();
      console.log('roomsData:', roomsData);
      const mattertagsDescriptors = this.createMattertagsDescriptors(roomsData);
      this.addMattertags(mattertagsDescriptors);
    } catch (e) {
      console.error(e);
    }
  }

  onTagSelect(tag: any): void {
    const roomId = this.findRoomIdByMattertagId(tag.sid);
    if (roomId) {
      this.roomService.selectRoom(roomId);
      this.highlightSvgRoom(roomId);
      console.log('Mattertag selected:', tag.sid, 'Room ID:', roomId);
    }
  }

  findRoomIdByMattertagId(mattertagId: string): string | null {
    // Logic to find the corresponding room ID by Mattertag ID
    const roomsData = this.roomService.getRoomsData();
    const roomEntry = Object.entries(roomsData).find(
      ([_, roomData]) => roomData.mattertagId === mattertagId,
    );
    return roomEntry ? roomEntry[0] : null;
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

  // onRoomClick(roomId: string) {
  //   // Call the function to focus on the Matterport room
  //   this.focusOnMatterportRoom(roomId);
  // }

  focusOnMatterportRoom(roomId: string) {
    const roomData = this.roomService.getRoomsData()[roomId];
    console.log('roomData:', roomData);
    const mattertagId = roomData?.mattertagId;

    console.log(
      `Focusing on Matterport room: ${roomId}, Mattertag ID: ${mattertagId}`,
    );

    if (this.mpSDK && mattertagId) {
      this.mpSDK.Mattertag.navigateToTag(
        mattertagId,
        this.mpSDK.Mattertag.Transition.FLY,
      )
        .then(() => {
          console.log(`Navigated to Mattertag with ID: ${mattertagId}`);
        })
        .catch((error: any) => {
          console.error('Error navigating to Mattertag:', error);
        });
    } else {
      console.error(`Error: No valid Mattertag ID found for ${roomId}`);
    }
  }

  createMattertagsDescriptors(roomsData: { [x: string]: any }) {
    // Transform room data into Matterport Tag descriptors
    console.log('roomsData:', roomsData);

    return Object.keys(roomsData).map((roomId) => {
      const room = roomsData[roomId];
      console.log('room:', room);
      const descriptor = {
        label: room.name,
        description:
          `Energy Consumption: ${room.energyConsumption} kWh\n` +
          `Temperature: ${room.roomTemperature} °C\n` +
          `Humidity: ${room.humidity}%\n` +
          `Occupancy: ${room.occupancy} people`,
        anchorPosition: { x: -5.391, y: -3.84, z: -0.037 },
        stemVector: { x: -0.025, y: 0.999, z: 0.02 },
        color: {
          // Example color, you could customize this per room if desired
          r: 0.0,
          g: 0.0,
          b: 1.0,
        },
        // You can include additional properties such as icon here if desired
      };

      console.log('descriptor:', descriptor); // Check each descriptor

      return descriptor;
    });
  }

  addMattertags(mattertagsDescriptors: any[]) {
    this.mpSDK.Tag.add(...mattertagsDescriptors).then((ids: any) => {
      console.log('Added Mattertags with IDs:', ids);

      ids.forEach((id: any, index: number) => {
        const roomLabel = mattertagsDescriptors[index].label;
        // Use a method to find corresponding room ID (e.g., 'room1F1') by label
        const roomId = this.findRoomIdByLabel(roomLabel);
        console.log(`Room ID for ${roomLabel}: ${roomId}`);
        if (roomId) {
          this.roomService.updateRoomData(roomId, { mattertagId: id });
          console.log(
            `Updated room data for ${roomId}:`,
            this.roomService.getRoomsData()[roomId].mattertagId,
          );
        }
      });
    });
  }

  findRoomIdByLabel(label: string): string | null {
    // Assuming you have a way to find the roomId by the room label
    // This depends on how you've set up your room data structure
    // Example:
    const roomEntry = Object.entries(this.roomService.getRoomsData()).find(
      ([_, roomData]) => roomData.name === label,
    );
    return roomEntry ? roomEntry[0] : null;
  }
}
