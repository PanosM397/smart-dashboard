export interface Alert {
  _id: string;
  message: string;
  isActive: boolean;
  timestamp: Date;
  // ... any other relevant fields
}
