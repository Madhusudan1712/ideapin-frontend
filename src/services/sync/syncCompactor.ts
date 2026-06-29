import type { SyncOperation } from './sync.types';

/**
 * Compacts a list of sync operations by merging redundant changes for the same note:
 * - Sequential UPDATEs merge fields and use the latest timestamp.
 * - CREATE followed by UPDATEs compiles into a single CREATE with final values.
 * - CREATE followed by DELETE is discarded (note was never synced).
 * - UPDATE/CREATE followed by DELETE (where note pre-existed on server) becomes a single DELETE.
 */
export const compactQueue = (operations: SyncOperation[]): SyncOperation[] => {
  if (operations.length === 0) return [];

  // Group operations by noteId preserving chronological sequence
  const groups = new Map<string, SyncOperation[]>();
  for (const op of operations) {
    if (!groups.has(op.noteId)) {
      groups.set(op.noteId, []);
    }
    groups.get(op.noteId)!.push(op);
  }

  const compacted: SyncOperation[] = [];

  for (const [noteId, ops] of groups.entries()) {
    let hasCreate = false;
    let finalOp: SyncOperation | null = null;

    for (const op of ops) {
      if (op.type === 'CREATE') {
        hasCreate = true;
        finalOp = Object.assign({}, op);
      } else if (op.type === 'UPDATE') {
        if (finalOp) {
          finalOp = Object.assign({}, finalOp, {
            title: op.title !== undefined ? op.title : finalOp.title,
            content: op.content !== undefined ? op.content : finalOp.content,
            visibility: op.visibility !== undefined ? op.visibility : finalOp.visibility,
            isPinned: op.isPinned !== undefined ? op.isPinned : finalOp.isPinned,
            timestamp: op.timestamp, // Keep the latest edit timestamp
          });
        } else {
          finalOp = Object.assign({}, op);
        }
      } else if (op.type === 'DELETE') {
        if (hasCreate) {
          // Created and deleted offline - discard completely
          finalOp = null;
        } else {
          // Existing note deleted - replace queue with single DELETE operation
          finalOp = {
            operationId: op.operationId,
            type: 'DELETE',
            noteId,
            timestamp: op.timestamp,
          };
        }
      }
    }

    if (finalOp) {
      compacted.push(finalOp);
    }
  }

  return compacted;
};
