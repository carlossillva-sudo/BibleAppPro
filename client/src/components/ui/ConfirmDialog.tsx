import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    itemName?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    itemName,
    confirmLabel = 'Confirmar exclusão',
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />

            {/* Painel */}
            <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Botão fechar */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    aria-label="Fechar"
                    disabled={isLoading}
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Ícone + título */}
                <div className="flex items-center gap-3">
                    <div className="bg-destructive/10 p-3 rounded-xl shrink-0">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <h2 id="confirm-dialog-title" className="text-lg font-bold">{title}</h2>
                </div>

                {/* Descrição */}
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

                {/* Nome do item */}
                {itemName && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                        <p className="text-sm font-bold text-destructive truncate">"{itemName}"</p>
                    </div>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-1">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 rounded-xl"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 rounded-xl gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                {confirmLabel}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
