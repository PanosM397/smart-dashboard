export interface Device {
  _id: number;
  name: string;
  status: 'On' | 'Off';
  type: string;
  location?: string;
}
