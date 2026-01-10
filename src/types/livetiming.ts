export interface IYearResponse {
  Year: number;
  Meetings: Meeting[];
}

export interface Meeting {
  Sessions: Session[];
  Key: number;
  Code: string;
  Number: number;
  Location: string;
  OfficialName: string;
  Name: string;
  Country: Country;
  Circuit: Circuit;
}

export interface Circuit {
  Key: number;
  ShortName: string;
}

export interface Country {
  Key: number;
  Code: string;
  Name: string;
}

export interface Session {
  Key: number;
  Type: string;
  Number?: number;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  GmtOffset: string;
  Path: string;
}

export interface IDriverListResponse {
  [key: string]: Driver;
}

export interface Driver {
  RacingNumber: string;
  BroadcastName: string;
  FullName: string;
  Tla: string;
  Line: number;
  TeamName: string;
  TeamColour?: string;
  FirstName: string;
  LastName: string;
  Reference?: string;
  HeadshotUrl?: string;
}
