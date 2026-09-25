import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { Medication } from '../../types';
import { Clock, Utensils, AlertTriangle, Calendar, PackageCheck, Edit3 } from 'lucide-react';

interface MedicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
  onEdit: (med: Medication) => void;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  isOpen,
  onClose,
  medication,
  onEdit,
}) => {
  if (!medication) return null;

  const isLowStock = medication.remainingQuantity <= medication.refillThreshold;
  const stockPercentage = Math.round(
    (medication.remainingQuantity / Math.max(1, medication.prescribedQuantity)) * 100
  );

  const getFoodRelationLabel = (rel: string) => {
    switch (rel) {
      case 'AFTER_FOOD':
        return 'After Food (खाने के बाद)';
      case 'BEFORE_FOOD':
        return 'Before Food (खाने से पहले)';
      case 'WITH_FOOD':
        return 'With Food (खाने के साथ)';
      default:
        return 'No Food Restriction';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Medication Details — ${medication.name}`}>
      <div className="space-y-4">
        {/* Header Summary */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/80 border border-slate-800">
          <div>
            <h3 className="font-outfit font-extrabold text-xl text-white">
              {medication.name} ({medication.dosage} {medication.dosageUnit})
            </h3>
            <p className="text-xs text-slate-400 mt-1">{medication.instructions}</p>
          </div>
          <Badge variant={medication.active ? 'success' : 'neutral'}>
            {medication.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Stock Level Card */}
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-teal-400" />
              Remaining Quantity
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                isLowStock ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {medication.remainingQuantity} / {medication.prescribedQuantity} {medication.dosageUnit}
            </span>
          </div>

          <ProgressIndicator
            value={stockPercentage}
            variant={isLowStock ? 'rose' : 'teal'}
          />

          {isLowStock && (
            <div className="flex items-center gap-1.5 p-2 rounded bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Refill Alert: Stock is below safety threshold ({medication.refillThreshold} units)!
            </div>
          )}
        </div>

        {/* Prescription Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Scheduled Timings
            </span>
            <div className="font-semibold text-white font-mono">
              {medication.scheduledTimes.join(', ')} ({medication.frequency})
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              Food Instruction
            </span>
            <div className="font-semibold text-white">
              {getFoodRelationLabel(medication.relationToFood)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Start Date
            </span>
            <div className="font-semibold text-white">{medication.startDate}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              End Date
            </span>
            <div className="font-semibold text-white">
              {medication.endDate || 'Ongoing / Indefinite'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(medication);
            }}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Medication</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
