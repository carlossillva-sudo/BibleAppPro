import React from 'react';

interface PlanProgressProps {
    current: number;
    total: number;
    showLabel?: boolean;
}

export const PlanProgress: React.FC<PlanProgressProps> = ({ current, total, showLabel = true }) => {
    const pct = Math.min(100, Math.round((current / total) * 100));

    return (
        <div className="space-y-1.5">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${pct >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                    <span>{pct}% concluído</span>
                    <span>{current}/{total} dias</span>
                </div>
            )}
        </div>
    );
};
