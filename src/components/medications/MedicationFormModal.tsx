import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Medication, RelationToFood } from '../../types';

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medData: Omit<Medication, 'id'> | Medication) => void;
  initialData?: Medication | null;
}

export const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [dosageUnit, setDosageUnit] = useState('mg');
  const [category, setCategory] = useState('General');
  const [frequency, setFrequency] = useState('Once Daily');
  const [scheduledTimesStr, setScheduledTimesStr] = useState('08:00');
  const [relationToFood, setRelationToFood] = useState<RelationToFood>('AFTER_FOOD');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [prescribedQuantity, setPrescribedQuantity] = useState(30);
  const [remainingQuantity, setRemainingQuantity] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(5);
  const [active, setActive] = useState(true);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDosage(initialData.dosage);
      setDosageUnit(initialData.dosageUnit);
      setCategory(initialData.category || 'General');
      setFrequency(initialData.frequency);
      setScheduledTimesStr(initialData.scheduledTimes.join(', '));
      setRelationToFood(initialData.relationToFood);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate || '');
      setPrescribedQuantity(initialData.prescribedQuantity);
      setRemainingQuantity(initialData.remainingQuantity);
      setRefillThreshold(initialData.refillThreshold);
      setActive(initialData.active);
      setInstructions(initialData.instructions || '');
    } else {
      // Default reset
      setName('');
      setDosage('');
      setDosageUnit('mg');
      setCategory('General');
      setFrequency('Once Daily');
      setScheduledTimesStr('08:00');
      setRelationToFood('AFTER_FOOD');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setPrescribedQuantity(30);
      setRemainingQuantity(30);
      setRefillThreshold(5);
      setActive(true);
      setInstructions('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      alert('Please fill in Medication Name and Dosage');
      return;
    }

    const scheduledTimes = scheduledTimesStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t));

    if (scheduledTimes.length === 0) {
      alert('Please enter at least one valid time in HH:mm format (e.g. 08:00, 20:00)');
      return;
    }

    const medPayload = {
      ...(initialData ? { id: initialData.id } : {}),
      name: name.trim(),
      dosage: dosage.trim(),
      dosageUnit: dosageUnit.trim(),
      category: category.trim(),
      frequency: frequency.trim(),
      scheduledTimes,
      relationToFood,
      startDate,
      endDate: endDate || undefined,
      prescribedQuantity: Number(prescribedQuantity),
      remainingQuantity: Number(remainingQuantity),
      currentStock: Number(remainingQuantity),
      refillThreshold: Number(refillThreshold),
      active,
      instructions: instructions || `Take ${dosage} ${dosageUnit} ${relationToFood.replace('_', ' ').toLowerCase()}`,
    };

    onSubmit(medPayload as Medication);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Medication' : 'Add New Medication'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Name & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metformin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g. Diabetes"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dosage & Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dosage *</label>
            <input
              type="text"
              required
              placeholder="e.g. 500"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dosage Unit</label>
            <select
              value={dosageUnit}
              onChange={(e) => setDosageUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="mg">mg</option>
              <option value="g">g</option>
              <option value="mcg">mcg</option>
              <option value="ml">ml</option>
              <option value="tablets">tablets</option>
              <option value="capsules">capsules</option>
              <option value="puffs">puffs</option>
            </select>
          </div>
        </div>

        {/* Frequency & Scheduled Times */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Frequency</label>
            <input
              type="text"
              placeholder="e.g. Twice Daily"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Scheduled Times (HH:mm) *
            </label>
            <input
              type="text"
              required
              placeholder="08:00, 20:00"
              value={scheduledTimesStr}
              onChange={(e) => setScheduledTimesStr(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Relation to Food */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Relation to Food
          </label>
          <select
            value={relationToFood}
            onChange={(e) => setRelationToFood(e.target.value as RelationToFood)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="AFTER_FOOD">After Food (खाने के बाद)</option>
            <option value="BEFORE_FOOD">Before Food (खाने से पहले)</option>
            <option value="WITH_FOOD">With Food (खाने के साथ)</option>
            <option value="NONE">No Food Restriction</option>
          </select>
        </div>

        {/* Start & End Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quantities & Refill Threshold */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Prescribed Qty</label>
            <input
              type="number"
              min="1"
              value={prescribedQuantity}
              onChange={(e) => setPrescribedQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Remaining Qty</label>
            <input
              type="number"
              min="0"
              value={remainingQuantity}
              onChange={(e) => setRemainingQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Refill Trigger</label>
            <input
              type="number"
              min="1"
              value={refillThreshold}
              onChange={(e) => setRefillThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Active Switch */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="active-toggle"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
          />
          <label htmlFor="active-toggle" className="text-xs font-semibold text-slate-200 cursor-pointer">
            Active Prescription
          </label>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Save Changes' : 'Add Medication'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
