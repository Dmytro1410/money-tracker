import { ITransactionFormNoteEditorProps } from '@/types/Transactions.ts';

export function NoteEditor({ note, onSetNote }: ITransactionFormNoteEditorProps) {
  return (
    <div className="w-full">
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Note</label>
      <input className="input" placeholder="optional" value={note} onChange={(e) => onSetNote(e.target.value)} />
    </div>
  );
}
