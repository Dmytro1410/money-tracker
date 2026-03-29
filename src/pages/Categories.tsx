import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import type { Category, TransactionType } from '@/types';
import Modal from '@/components/ui/Modal';

const TYPES: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Расходы' },
  { value: 'income', label: 'Доходы' },
];

const ICONS = [
  '🛒', '🍽️', '🚗', '🏠', '💊', '👕', '🎮', '📚', '📱', '✈️', '🏋️', '📺',
  '💼', '💻', '📈', '🎁', '💰', '🏦', '🍔', '☕', '🚕', '🚌', '⛽', '🅿️',
  '💡', '💧', '📡', '💍', '👟', '🎬', '🎵', '🎓', '📖', '✏️', '⚽', '🎧',
  '☁️', '🏆', '💵', '🎨', '🤝', '📊', '💹', '🔬', '🩺', '🥦', '🏪', '📦',
  '🛍️', '🎪', '🐾', '🌿', '🍕', '🍣', '🛻', '🏖️', '🎭', '🧴', '🧹', '🔧',
];

const COLORS = [
  '#CFF008', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#14b8a6', '#a855f7',
];

interface CategoryFormData {
  name: string
  icon: string
  color: string
  type: TransactionType
  parent_id: string | null
}

const EMPTY_FORM: CategoryFormData = {
  name: '', icon: '📦', color: '#CFF008', type: 'expense', parent_id: null,
};

export default function Categories() {
  const profile = useAuthStore((s) => s.profile);
  const qc = useQueryClient();

  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Загружаем все категории пользователя + системные
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${profile!.id},is_system.eq.true`)
        .order('name');
      if (error) throw error;
      return data as Category[];
    },
  });

  const parents = categories.filter((c) => !c.parent_id && c.type === activeType);
  const children = categories.filter((c) => c.parent_id && c.type === activeType);

  // Сохранение (создание или редактирование)
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error('Введите название');
      const payload = {
        user_id: profile!.id,
        name: form.name.trim(),
        icon: form.icon,
        color: form.color,
        type: form.type,
        parent_id: form.parent_id || null,
        is_system: false,
      };
      if (editing) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories-all'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: (e: Error) => setError(e.message),
  });

  // Удаление
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories-all'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  function openAdd(parentId?: string) {
    setEditing(null);
    setForm({ ...EMPTY_FORM, type: activeType, parent_id: parentId ?? null });
    setError(null);
    setShowModal(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({
      name: cat.name, icon: cat.icon, color: cat.color, type: cat.type, parent_id: cat.parent_id,
    });
    setError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const parentOfEditing = editing?.parent_id
    ? categories.find((c) => c.id === editing.parent_id)
    : null;

  return (
    <div className="p-7 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-800 text-white tracking-tight">Категории</h1>
          <p className="text-sm text-white/30 font-500 mt-0.5">Управление категориями и подкатегориями</p>
        </div>
        <button className="btn-primary" onClick={() => openAdd()}>
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          Добавить
        </button>
      </div>

      {/* Type tabs */}
      <div className="flex rounded-xl overflow-hidden border border-white/8 bg-ink-700 self-start w-fit">
        {TYPES.map((t) => (
          <button
            key={t.value}
            className={`px-6 py-2.5 text-sm transition-colors ${
              activeType === t.value ? 'bg-lime text-ink-800 font-700' : 'text-white/40 hover:text-white/70 font-600'
            }`}
            onClick={() => setActiveType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Category tree */}
      {isLoading ? (
        <p className="text-white/25 text-sm text-center py-10">Загрузка…</p>
      ) : (
        <div className="space-y-2">
          {parents.map((parent) => {
            const subs = children.filter((c) => c.parent_id === parent.id);
            const expanded = expandedIds.has(parent.id);
            const isSystem = parent.is_system;

            return (
              <div key={parent.id} className="card overflow-hidden">
                {/* Parent row */}
                <div className="flex items-center gap-3 px-4 py-3.5 group">
                  {/* Expand toggle */}
                  <button
                    className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                    onClick={() => toggleExpand(parent.id)}
                  >
                    {subs.length > 0 ? (
                      <svg
                        fill="none"
                        height="12"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}
                        viewBox="0 0 24 24"
                        width="12"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    ) : <span className="w-2 h-2 rounded-full bg-white/10 block" />}
                  </button>

                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${parent.color}22` }}
                  >
                    {parent.icon}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-700 text-white">{parent.name}</p>
                    <p className="text-2xs text-white/25 font-500">
                      {subs.length > 0 ? `${subs.length} подкатегорий` : 'Нет подкатегорий'}
                      {isSystem && <span className="ml-2 text-lime/60">системная</span>}
                    </p>
                  </div>

                  {/* Color dot */}
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: parent.color }} />

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="btn-icon w-7 h-7 text-xs"
                      title="Добавить подкатегорию"
                      onClick={() => openAdd(parent.id)}
                    >
                      <svg
                        fill="none"
                        height="12"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        width="12"
                      >
                        <line x1="12" x2="12" y1="5" y2="19" />
                        <line x1="5" x2="19" y1="12" y2="12" />
                      </svg>
                    </button>
                    {!isSystem && (
                      <>
                        <button
                          className="btn-icon w-7 h-7 text-xs"
                          title="Редактировать"
                          onClick={() => openEdit(parent)}
                        >
                          <svg
                            fill="none"
                            height="12"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="12"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="btn-icon w-7 h-7 text-xs hover:text-red-400 hover:bg-red-400/10"
                          title="Удалить"
                          onClick={() => deleteMutation.mutate(parent.id)}
                        >
                          <svg
                            fill="none"
                            height="12"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="12"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Subcategory rows */}
                {expanded && subs.length > 0 && (
                  <div className="border-t border-white/5">
                    {subs.map((sub, i) => (
                      <div
                        key={sub.id}
                        className={`flex items-center gap-3 px-4 py-2.5 group hover:bg-white/3 transition-colors ${i < subs.length - 1 ? 'border-b border-white/3' : ''}`}
                      >
                        {/* Indent line */}
                        <div className="w-5 flex-shrink-0 flex items-center justify-center">
                          <div className="w-px h-4 bg-white/10" />
                        </div>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: `${sub.color}22` }}
                        >
                          {sub.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-600 text-white/70">{sub.name}</p>
                          {sub.is_system && <p className="text-2xs text-lime/50 font-500">системная</p>}
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: sub.color }} />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!sub.is_system && (
                            <>
                              <button className="btn-icon w-7 h-7 text-xs" onClick={() => openEdit(sub)}>
                                <svg
                                  fill="none"
                                  height="12"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  width="12"
                                >
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                className="btn-icon w-7 h-7 text-xs hover:text-red-400 hover:bg-red-400/10"
                                onClick={() => deleteMutation.mutate(sub.id)}
                              >
                                <svg
                                  fill="none"
                                  height="12"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  width="12"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                  <path d="M10 11v6M14 11v6" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {parents.length === 0 && (
            <div
              className="card p-10 text-center cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => openAdd()}
            >
              <p className="text-white/30 text-sm font-500">Нет категорий</p>
              <p className="text-lime text-xs font-700 mt-2">Добавить первую →</p>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={showModal}
        title={editing ? `Редактировать${parentOfEditing ? ' подкатегорию' : ' категорию'}` : form.parent_id ? 'Новая подкатегория' : 'Новая категория'}
        onClose={closeModal}
      >
        <div className="space-y-4">
          {/* Если подкатегория — показываем родителя */}
          {form.parent_id && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
              <span className="text-sm">{categories.find((c) => c.id === form.parent_id)?.icon}</span>
              <span className="text-sm text-white/50 font-500">
                Подкатегория для:
                {' '}
                <span
                  className="text-white/80 font-700"
                >
                  {categories.find((c) => c.id === form.parent_id)?.name}
                </span>
              </span>
            </div>
          )}

          {/* Тип (только для корневых категорий) */}
          {!form.parent_id && !editing && (
            <div>
              <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Тип</label>
              <div className="flex rounded-xl overflow-hidden border border-white/8 bg-ink-700">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    className={`flex-1 py-2.5 text-sm transition-colors ${
                      form.type === t.value ? 'bg-lime text-ink-800 font-700' : 'text-white/40 hover:text-white/70 font-600'
                    }`}
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Название */}
          <div>
            <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Название</label>
            <input
              autoFocus
              className="input"
              placeholder="Например: Кафе и рестораны"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          {/* Иконка */}
          <div>
            <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
              Иконка — выбрано:
              {' '}
              <span className="text-white normal-case tracking-normal">{form.icon}</span>
            </label>
            <div
              className="grid grid-cols-10 gap-1 max-h-32 overflow-y-auto p-1 rounded-xl border border-white/8 bg-ink-700"
            >
              {ICONS.map((ico) => (
                <button
                  key={ico}
                  className={`h-8 rounded-lg text-base flex items-center justify-center transition-colors ${
                    form.icon === ico ? 'bg-lime/20 ring-1 ring-lime/50' : 'hover:bg-white/8'
                  }`}
                  onClick={() => setForm((f) => ({ ...f, icon: ico }))}
                >
                  {ico}
                </button>
              ))}
            </div>
          </div>

          {/* Цвет */}
          <div>
            <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Цвет</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex-shrink-0"
                  style={{
                    background: c,
                    outline: form.color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${form.color}22` }}
            >
              {form.icon}
            </div>
            <div>
              <p className="text-sm font-700 text-white">{form.name || 'Название категории'}</p>
              <p className="text-2xs text-white/30 font-500">{form.type === 'expense' ? 'Расход' : 'Доход'}</p>
            </div>
          </div>

          {error && <p className="text-xs font-500 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button className="btn-ghost flex-1" onClick={closeModal}>Отмена</button>
            <button
              className="btn-primary flex-1"
              disabled={saveMutation.isPending || !form.name.trim()}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? 'Сохранение…' : editing ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
