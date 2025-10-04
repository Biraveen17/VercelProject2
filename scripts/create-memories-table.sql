-- Create memories table to store photo metadata
CREATE TABLE IF NOT EXISTS memories (
  id SERIAL PRIMARY KEY,
  blob_url TEXT NOT NULL,
  caption TEXT,
  uploader_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);
