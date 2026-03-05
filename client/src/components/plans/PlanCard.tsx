import React from 'react';
import { ChevronRight, Calendar, BookOpen, Trash2 } from 'lucide-react';
import { PlanProgress } from './PlanProgress';

export interface PlanData {
    id: string;
    title: string;
    description: string;
    totalDays: number;
    currentDay: number;
    category: string;
}

interface PlanCardProps {
    plan: PlanData;
    onContinue: (plan: PlanData) => void;
    onDelete: (id: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onContinue, onDelete }) => {
    const progress = Math.round((plan.currentDay / plan.totalDays) * 100);
    const isComplete = progress >= 100;

    return (
        <div className="group bg-card border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
            <div className={`h-1.5 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-primary/60'}`} />

            <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {plan.category}
                        </span>
                        <h3 className="font-bold text-lg leading-tight mt-2">{plan.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                            title="Excluir plano"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <PlanProgress current={plan.currentDay} total={plan.totalDays} />

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Dia {plan.currentDay} de {plan.totalDays}</span>
                    </div>

                    <button
                        onClick={() => onContinue(plan)}
                        className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors group/btn"
                    >
                        {isComplete ? 'Revisar' : 'Continuar'}
                        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
