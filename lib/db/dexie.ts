import Dexie, { Table } from 'dexie';
import type { RecordT } from '../validators';

export class AppDB extends Dexie {
  records!: Table<RecordT, string>;
  constructor() {
    super('wo-wnsc-db');
    this.version(1).stores({
      records: 'id, company, refType, status, date, startDate, endDate, createdAt, updatedAt'
    });
  }
}

export const db = new AppDB();

export async function addRecord(rec: RecordT) {
  return db.records.add(rec);
}
export async function updateRecord(id: string, patch: Partial<RecordT>) {
  return db.records.update(id, patch);
}
export async function deleteRecord(id: string) {
  return db.records.delete(id);
}
export async function getAllRecords() {
  return db.records.toArray();
}
