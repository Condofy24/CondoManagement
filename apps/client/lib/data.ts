import { PropertyInformation } from "@/types";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUser, FaRegCalendarAlt } from "react-icons/fa";

// used for testing, will be removed later
export const Properties: PropertyInformation[] = [
  {
    name: "Larson-Jones",
    address: "174 Jaime Underpass, Margaretberg, MO 57717",
    units: 5,
    parking: 10,
    storage: 5,
  },
  {
    name: "Herrera-Bowman",
    address: "847 Williams Square, Moodyhaven, WI 15827",
    units: 10,
    parking: 6,
    storage: 10,
  },
  {
    name: "Price, King and Clark",
    address: "PSC 3082, Box 9321, APO AP 67579",
    units: 20,
    parking: 10,
    storage: 10,
  },
  {
    name: "Stewart LLC",
    address: "USCGC Martin, FPO AA 25091",
    units: 8,
    parking: 10,
    storage: 5,
  },
  {
    name: "Stanley Ltd",
    address: "2065 Patricia Plaza Suite 931, Kaylafurt, WV 34706",
    units: 7,
    parking: 7,
    storage: 5,
  },
] as const;

export const unitStatuses = [
  {
    label: "Available",
    value: "available",
    icon: IoMdCheckmarkCircleOutline,
  },
  {
    label: "Owned",
    value: "owned",
    icon: FaUser,
  },
  {
    label: "Rented",
    value: "rented",
    icon: FaRegCalendarAlt,
  },
];
