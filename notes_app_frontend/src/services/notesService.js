/**
 * PUBLIC_INTERFACE
 * Notes service for CRUD operations against Supabase.
 * Tables/columns expected (create in Supabase):
 *   table: notes
 *   columns:
 *     id: uuid (primary key, default uuid_generate_v4())
 *     title: text
 *     content: text
 *     category: text
 *     updated_at: timestamp with time zone (or bigint if preferred)
 *
 * The UI uses:
 *   { id, title, content, category, updatedAt:number }
 */
import { supabase } from '../supabaseClient';

// Map DB row to UI note
function mapRowToNote(row) {
  // updated_at may be timestamp string; convert to ms number
  const updatedAtMs = row.updated_at
    ? new Date(row.updated_at).getTime()
    : Date.now();
  return {
    id: row.id,
    title: row.title || 'Untitled',
    content: row.content || '',
    category: row.category || 'General',
    updatedAt: updatedAtMs,
  };
}

// Map UI payload to DB insert/update row
function mapPayloadToRow(payload) {
  return {
    title: (payload.title || 'Untitled').trim(),
    content: payload.content ?? '',
    category: (payload.category || 'General').trim(),
    // For insert/update we set server-side updated_at with 'now()' using RPC or let DB default handle it.
    // If the table doesn't auto-manage updated_at, we set it here.
    updated_at: new Date().toISOString(),
  };
}

// PUBLIC_INTERFACE
export async function fetchNotes() {
  /** Fetch all notes ordered by updated_at desc. */
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapRowToNote);
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a new note and return the newly created note (with id). */
  const row = mapPayloadToRow(payload);
  const { data, error } = await supabase
    .from('notes')
    .insert(row)
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToNote(data);
}

// PUBLIC_INTERFACE
export async function updateNoteById(id, payload) {
  /** Update an existing note by id and return the updated note. */
  const row = mapPayloadToRow(payload);
  const { data, error } = await supabase
    .from('notes')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapRowToNote(data);
}

// PUBLIC_INTERFACE
export async function deleteNoteById(id) {
  /** Delete a note by id. Returns true if deleted. */
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
  return true;
}
