export interface User {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  role: string;
  image?: string;
  maidenName?: string;
  gender?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  address?: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  company?: {
    department: string;
    name: string;
    title: string;
    address?: any;
  };
  crypto?: {
    coin: string;
    wallet: string;
    network: string;
  };
}
