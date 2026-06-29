import type { SyncOperation } from './sync.types';
import { compactQueue } from './syncCompactor';
import { apiRequest } from '../api';

const QUEUE_KEY = 'ideapin_sync_queue';
const CONFLICTS_KEY = 'ideapin_sync_conflicts';

class SyncQueue {
  private debounceTimer: any = null;
  private onSyncSuccessListeners: Set<(data: { updatedNotes: any[]; conflicts: string[] }) => void> = new Set();

  public getQueue(): SyncOperation[] {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  public saveQueue(queue: SyncOperation[]): void {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  public clearQueue(): void {
    localStorage.removeItem(QUEUE_KEY);
  }

  // Conflict lists management
  public getConflicts(): string[] {
    const raw = localStorage.getItem(CONFLICTS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  public setConflicts(conflicts: string[]): void {
    localStorage.setItem(CONFLICTS_KEY, JSON.stringify(conflicts));
  }

  public clearConflicts(): void {
    localStorage.removeItem(CONFLICTS_KEY);
  }

  public addConflict(noteId: string): void {
    const conflicts = this.getConflicts();
    if (!conflicts.includes(noteId)) {
      conflicts.push(noteId);
      this.setConflicts(conflicts);
    }
  }

  public removeConflict(noteId: string): void {
    const conflicts = this.getConflicts().filter((id) => id !== noteId);
    this.setConflicts(conflicts);
  }

  /**
   * Registers a sync success callback listener.
   */
  public subscribe(listener: (data: { updatedNotes: any[]; conflicts: string[] }) => void) {
    this.onSyncSuccessListeners.add(listener);
    return () => {
      this.onSyncSuccessListeners.delete(listener);
    };
  }

  /**
   * Enqueues a sync operation. If online, schedules a sync flush.
   */
  public enqueue(op: Omit<SyncOperation, 'operationId' | 'timestamp'>): void {
    const operation: SyncOperation = {
      ...op,
      operationId: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const queue = this.getQueue();
    queue.push(operation);
    this.saveQueue(queue);

    // If online, debounce sync flush
    if (navigator.onLine) {
      this.scheduleFlush();
    }
  }

  /**
   * Schedules a debounced sync trigger.
   */
  public scheduleFlush(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.flush().catch((err) => console.error('Auto sync flush failed:', err));
    }, 2500); // 2.5 seconds debounce
  }

  /**
   * Flushes the compacted queue to the server.
   */
  public async flush(): Promise<{ updatedNotes: any[]; conflicts: string[] } | null> {
    const queue = this.getQueue();
    if (queue.length === 0) return null;

    // Compact operations list before transmission
    const compacted = compactQueue(queue);

    // Clear local queue to prevent duplicate sends during async flight
    this.clearQueue();

    try {
      const response = await apiRequest('/sync', {
        method: 'POST',
        body: JSON.stringify({ operations: compacted }),
      });

      const data = response.data || response;
      const updatedNotes = data.updatedNotes || [];
      const conflicts = data.conflicts || [];

      // Merge conflicts returned by the server with existing conflicts
      const currentConflicts = new Set(this.getConflicts());
      if (conflicts && Array.isArray(conflicts)) {
        conflicts.forEach((id: string) => currentConflicts.add(id));
      }
      this.setConflicts(Array.from(currentConflicts));

      // Trigger active sync listeners (e.g., to notify Redux store)
      this.onSyncSuccessListeners.forEach((listener) => {
        listener({ updatedNotes, conflicts });
      });

      return { updatedNotes, conflicts };
    } catch (error) {
      // Restore compacted operations to the front of the queue on error to avoid data loss
      const currentQueue = this.getQueue();
      this.saveQueue([...compacted, ...currentQueue]);
      console.error('Sync flush failed:', error);
      throw error;
    }
  }
}

export const syncQueue = new SyncQueue();

// Register network reconnect listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncQueue.scheduleFlush();
  });
}
