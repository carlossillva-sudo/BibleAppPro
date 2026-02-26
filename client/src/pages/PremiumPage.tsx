import React from 'react';
import { Crown, Check, Star, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const features = [
    { icon: Zap, title: 'Leitura Offline', desc: 'Baixe a Bíblia completa para ler sem internet.', free: false, pro: true },
    { icon: Star, title: 'Destaques Ilimitados', desc: 'Marque quantos versículos quiser com cores.', free: '5/mês', pro: true },
    { icon: Shield, title: 'Sincronização', desc: 'Seus dados em todos os dispositivos.', free: false, pro: true },
    { icon: Crown, title: 'Temas Premium', desc: 'Acesse temas exclusivos como Sépia e Noite.', free: false, pro: true },
];

export const PremiumPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'yearly'>('yearly');

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-10">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                    <Crown className="h-4 w-4" /> Premium
                </div>
                <h1 className="text-4xl font-black tracking-tight">Eleve sua experiência bíblica</h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">Desbloqueie todos os recursos e leve sua jornada de fé para o próximo nível.</p>
            </header>

            {/* Plan toggle */}
            <div className="flex justify-center">
                <div className="bg-muted p-1 rounded-xl flex gap-1">
                    <button onClick={() => setSelectedPlan('monthly')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedPlan === 'monthly' ? 'bg-card shadow-md' : 'text-muted-foreground'}`}>
                        Mensal
                    </button>
                    <button onClick={() => setSelectedPlan('yearly')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedPlan === 'yearly' ? 'bg-card shadow-md' : 'text-muted-foreground'}`}>
                        Anual <span className="text-green-600 text-xs ml-1">-40%</span>
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="text-center space-y-2">
                <p className="text-5xl font-black">{selectedPlan === 'monthly' ? 'R$ 14,90' : 'R$ 8,90'}<span className="text-lg font-normal text-muted-foreground">/mês</span></p>
                {selectedPlan === 'yearly' && <p className="text-sm text-green-600 font-medium">Cobrado R$ 106,80/ano — Economia de R$ 72!</p>}
            </div>

            <div className="flex justify-center">
                <Button onClick={() => alert('Obrigado pelo interesse! Funcionalidade em breve.')} className="h-14 px-10 rounded-2xl text-lg font-bold gap-2 shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                    Assinar Premium <ArrowRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Comparison */}
            <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="grid grid-cols-3 text-center text-sm font-bold border-b bg-muted/50">
                    <div className="p-4 text-left">Recurso</div>
                    <div className="p-4">Gratuito</div>
                    <div className="p-4 text-primary">Premium</div>
                </div>
                {features.map((f, i) => (
                    <div key={i} className="grid grid-cols-3 text-center text-sm border-b last:border-b-0 hover:bg-accent/50 transition-colors">
                        <div className="p-4 text-left flex items-center gap-3">
                            <f.icon className="h-4 w-4 text-primary shrink-0" />
                            <div>
                                <p className="font-semibold">{f.title}</p>
                                <p className="text-xs text-muted-foreground">{f.desc}</p>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                            {f.free === true ? <Check className="h-5 w-5 text-green-500" /> : f.free === false ? <span className="text-muted-foreground">—</span> : <span className="text-xs text-muted-foreground">{f.free}</span>}
                        </div>
                        <div className="p-4 flex items-center justify-center">
                            <Check className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button onClick={() => navigate('/dashboard')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Continuar com plano gratuito →
                </button>
            </div>
        </div>
    );
};
