import React from 'react';
import { MdAdd, MdDelete, MdShield } from 'react-icons/md';
import { OnboardingStepProps } from '../types';
import { FormInput } from '../shared/FormInput';
import { NavigationButtons } from '../shared/NavigationButtons';

export function Step6Tribe({ profile, setProfile, onNext, onPrev }: OnboardingStepProps) {
  const updateTribeMember = (index: number, field: keyof typeof profile.tribe[0], value: string) => {
    const newTribe = [...profile.tribe];
    newTribe[index] = { ...newTribe[index], [field]: value };
    setProfile({ ...profile, tribe: newTribe });
  };

  const removeTribeMember = (index: number) => {
    setProfile({
      ...profile,
      tribe: profile.tribe.filter((_, idx) => idx !== index)
    });
  };

  const addTribeMember = () => {
    setProfile({
      ...profile,
      tribe: [...profile.tribe, { name: '', relationship: 'Friend', contact: '' }]
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-6">
          {profile.tribe.map((member, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-200/60 dark:bg-white/5 dark:border-white/5 items-end transition-all hover:bg-white hover:border-primary/20 shadow-sm"
            >
              <div className="md:col-span-4">
                <FormInput
                  label="Name"
                  placeholder="Mirror name"
                  value={member.name}
                  onChange={e => updateTribeMember(i, 'name', e.target.value)}
                />
              </div>
              <div className="md:col-span-3 space-y-2.5">
                <label className="block text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 ml-1">Relationship</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all dark:bg-transparent dark:border-white/10 dark:text-white dark:focus:ring-primary/20"
                  value={member.relationship}
                  onChange={e => updateTribeMember(i, 'relationship', e.target.value)}
                >
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Partner">Partner</option>
                  <option value="Mentor">Mentor</option>
                </select>
              </div>
              <div className="md:col-span-4 flex items-end gap-3">
                <FormInput
                  label="Contact"
                  placeholder="WhatsApp or Email"
                  value={member.contact}
                  onChange={e => updateTribeMember(i, 'contact', e.target.value)}
                />
              </div>
              <div className="md:col-span-1 flex justify-center pb-2">
                {profile.tribe.length > 1 && (
                  <button
                    onClick={() => removeTribeMember(i)}
                    className="size-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addTribeMember}
            className="w-full py-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group dark:border-white/10 dark:hover:border-primary/50"
          >
            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all dark:bg-white/5">
              <MdAdd size={24} />
            </div>
            <span className="font-bold">Add Social Mirror</span>
          </button>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex items-start gap-4">
          <MdShield className="text-primary text-3xl" />
          <div>
            <h4 className="font-bold">Privacy Guaranteed</h4>
            <p className="text-sm text-slate-400">
              Tribe members only see your growth pulses, never your private journals or raw data.
            </p>
          </div>
        </div>
        <NavigationButtons onPrev={onPrev} onNext={onNext} nextLabel="Finalize Tribe" />
      </div>
    </div>
  );
}

