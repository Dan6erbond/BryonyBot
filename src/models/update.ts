import firebase from "firebase";

export default interface Update {
  podium: UpdateItem | null;
  new: UpdateItem[];
  sale: SaleItem[];
  date: Date;
  twitchPrime: SaleItem[];
}

export interface SaleItem extends UpdateItem {
  amount: number;
}

export interface UpdateItem {
  name: string;
  id: string;
  docRef: firebase.firestore.DocumentReference;
  data?: firebase.firestore.DocumentData;
}