export interface SyncOperation {
  operationId: string; // client-generated UUID
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  noteId: string;
  title?: string;
  content?: string;
  visibility?: 'private' | 'public';
  isPinned?: boolean;
  timestamp: number; // millisecond timestamp of the edit action
}

export interface SyncResponse {
  updatedNotes: any[];
  conflicts: string[]; // Conflicted note IDs
}

export interface SyncQueueStorage {
  getQueue(): SyncOperation[];
  saveQueue(queue: SyncOperation[]): void;
  clearQueue(): void;
}
