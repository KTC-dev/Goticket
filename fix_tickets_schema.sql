-- Fix for tickets table schema: add status column for reservation workflow.
ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'reserved';
