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
      <div className="space-y-4">
        {profile.tribe.map((member, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700"
          >
            <FormInput
              placeholder="Name"
              value={member.name}
              onChange={e => updateTribeMember(i, 'name', e.target.value)}
            />
            <select
              className="bg-slate-900 border-none rounded-lg p-3 text-white"
              value={member.relationship}
              onChange={e => updateTribeMember(i, 'relationship', e.target.value)}
            >
              <option>Friend</option>
              <option>Colleague</option>
              <option>Partner</option>
            </select>
            <div className="flex gap-2">
              <FormInput
                placeholder="WhatsApp or Email"
                value={member.contact}
                onChange={e => updateTribeMember(i, 'contact', e.target.value)}
                className="flex-1"
              />
              {profile.tribe.length > 1 && (
                <button
                  onClick={() => removeTribeMember(i)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <MdDelete size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addTribeMember}
          className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary transition-all"
        >
          <MdAdd /> Add Social Mirror
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
  );
}

