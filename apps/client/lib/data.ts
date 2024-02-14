import { PropertyInformation } from "@/types";

export const headerLinks = [
  {
    name: "Home",
    hash: "#home",
    route: "home",
  },
  {
    name: "Dashboard",
    hash: "#dashboard",
    route: "condo/dashboard",
  },
  {
    name: "Reservations",
    hash: "#reservation",
    route: "reservations",
  },
  {
    name: "Requests",
    hash: "#request",
    route: "requests",
  },
] as const;

// used for testing, will be removed later
export const Properties: PropertyInformation[] = [
  {
    name: "Larson-Jones",
    address: "174 Jaime Underpass, Margaretberg, MO 57717",
    occupancy: "Owned",
    units: 96,
    parking: 34,
    storage: 28,
  },
  {
    name: "Herrera-Bowman",
    address: "847 Williams Square, Moodyhaven, WI 15827",
    occupancy: "Owned",
    units: 59,
    parking: 6,
    storage: 11,
  },
  {
    name: "Price, King and Clark",
    address: "PSC 3082, Box 9321, APO AP 67579",
    occupancy: "Owned",
    units: 24,
    parking: 18,
    storage: 10,
  },
  {
    name: "Stewart LLC",
    address: "USCGC Martin, FPO AA 25091",
    occupancy: "Owned",
    units: 75,
    parking: 17,
    storage: 9,
  },
  {
    name: "Stanley Ltd",
    address: "2065 Patricia Plaza Suite 931, Kaylafurt, WV 34706",
    occupancy: "Owned",
    units: 6,
    parking: 20,
    storage: 19,
  },
] as const;
