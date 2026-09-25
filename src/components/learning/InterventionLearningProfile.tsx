import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, Column } from '../ui/Table';
import { InterventionLearningEngine } from '../../services/InterventionLearningEngine';
import { DEMO_INTERVENTION_RESPONSES } from '../../data/learningDemoData';
import { InterventionResponse } from '../../types/learning';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface InterventionLearningProfileProps {
  patientId: string;
  patientName: string;
}

export const InterventionLearningProfile: React.FC<InterventionLearningProfileProps> = ({
  patientId,
  patientName,
}) => {
  const profile = InterventionLearningEngine.computePreferenceProfile(
    patientId,
    patientName,
    DEMO_INTERVENTION_RESPONSES
  );

  const responseTableColumns: Column<InterventionResponse>[] = [
    {
      header: 'Delivered Intervention Strategy',
      accessor: (r) => (
        <div>
          <div className="font-semibold text-white">
            {InterventionLearningEngine.getInterventionTitle(r.interventionType)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">{r.interventionType}</div>
        </div>
      ),
    },
    {
      header: 'Time Context',
      accessor: (r) => <span className="text-slate-300 text-xs">{r.contextWindow || 'General'}</span>,
    },
    {
      header: 'Patient Response',
      accessor: (r) => {
        if (r.response === 'responded') {
          return <Badge variant="success">Responded ({r.responseTime ? `${r.responseTime}s` : 'Instant'})</Badge>;
        }
        if (r.response === 'delayed_response') {
          return <Badge variant="warning">Delayed Response</Badge>;
        }
        if (r.response === 'no_response') {
          return <Badge variant="danger">No Response</Badge>;
        }
        return <Badge variant="neutral">Not Applicable</Badge>;
      },
    },
    {
      header: 'Subsequent Dose Event',
      accessor: (r) => (
        <span
          className={`font-mono font-bold text-xs ${
            r.subsequentMedicationEvent === 'COMPLETED' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {r.subsequentMedicationEvent}
        </span>
      ),
    },
    {
      header: 'Learning Outcome',
      accessor: (r) => {
        if (r.outcome === 'successful') {
          return (
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              Successful ({r.effectiveness}%)
            </span>
          );
        }
        if (r.outcome === 'unsuccessful') {
          return (
            <span className="flex items-center gap-1 text-red-400 font-bold text-xs">
              <XCircle className="w-3.5 h-3.5" />
              Unsuccessful ({r.effectiveness}%)
            </span>
          );
        }
        return <span className="text-amber-400 font-semibold text-xs">{r.outcome}</span>;
      },
    },
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-slate-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400 shrink-0" />
          <div>
            <div className="font-bold text-purple-300 text-sm">
              Adaptive Intervention Learning System
            </div>
            <div className="text-slate-400 text-xs">
              Prototype behavioral learning mechanism. Dynamically adapts intervention preferences based on deterministic historical patient response data.
            </div>
          </div>
        </div>
        <Badge variant="info" className="shrink-0 bg-purple-500/20 text-purple-300 border-purple-500/30">
          Prototype Behavioral Learning
        </Badge>
      </div>

      {/* Main Profile Grid: Previously Effective vs Low Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Previously Effective Interventions */}
        <Card variant="highlight" className="space-y-4">
          <h3 className="font-outfit font-bold text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Previously Effective Interventions</span>
          </h3>

          {profile.effectiveInterventions.length === 0 ? (
            <div className="text-slate-400 text-xs py-4">No high-response interventions recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {profile.effectiveInterventions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <Badge variant="success" className="font-mono">
                      {item.successRate}% Success Rate
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Low Response Interventions */}
        <Card variant="highlight" className="space-y-4">
          <h3 className="font-outfit font-bold text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Low-Response De-prioritized Interventions</span>
          </h3>

          {profile.lowResponseInterventions.length === 0 ? (
            <div className="text-slate-400 text-xs py-4">No low-response interventions identified.</div>
          ) : (
            <div className="space-y-3">
              {profile.lowResponseInterventions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <Badge variant="danger" className="font-mono">
                      {item.failureRate}% Failure Rate
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Preferred Intervention by Medication / Time Context */}
      <Card variant="default" className="space-y-4">
        <h3 className="font-outfit font-bold text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Clock className="w-5 h-5 text-teal-400" />
          <span>Preferred Intervention Strategy by Medication & Time Context</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.contextualPreferences.map((pref, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {pref.contextWindow}
                </span>
                <Badge variant="info">{pref.effectivenessScore}% Preferred</Badge>
              </div>
              <div className="font-bold text-teal-300 text-base">{pref.topInterventionTitle}</div>
              <p className="text-slate-300 text-xs leading-relaxed">{pref.reasoning}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Intervention Outcomes Table */}
      <Card variant="default" className="space-y-4">
        <h3 className="font-outfit font-bold text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Recent Intervention Outcomes Log</span>
        </h3>

        <Table
          columns={responseTableColumns}
          data={DEMO_INTERVENTION_RESPONSES}
          keyExtractor={(r) => r.id}
        />
      </Card>
    </div>
  );
};
