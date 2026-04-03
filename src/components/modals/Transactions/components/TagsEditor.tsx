import { ITransactionFormTagsEditorProps } from '@/models/Transactions.ts';

export function TagsEditor({ onSetTags, tags }: ITransactionFormTagsEditorProps) {
  return (
    <div>
      <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
        Tags
        <span className="text-white/20 normal-case tracking-normal">— separated by commas</span>
      </label>
      <input
        className="input"
        placeholder="food, work, family"
        value={tags}
        onChange={(e) => onSetTags(e.target.value)}
      />
    </div>
  );
}
