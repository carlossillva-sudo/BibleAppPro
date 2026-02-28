import React, { useState } from 'react';
import {
    Share2, Copy, Check, Users,
    Gift, Sparkles, Send, Facebook,
    Twitter, Instagram,
    Download, QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/ui/Button';

export const ShareAppPage: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [qrValue] = useState('https://bibleapp.pro/download?ref=user123'); // Simulated ref link

    const handleCopyLink = () => {
        navigator.clipboard.writeText(qrValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'BibleAppPro',
                    text: 'Minha jornada bíblica ficou muito mais profunda com o BibleAppPro. Experimente você também!',
                    url: qrValue,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-12 pb-32">
            <header className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Cresça com a Comunidade</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                    Espalhe a <span className="text-blue-600">Palavra.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                    Convide amigos e familiares para descobrirem uma nova forma de ler e viver as Escrituras.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* QR Code Card */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 rounded-[40px] p-8 flex flex-col items-center justify-center space-y-8 shadow-sm">
                    <div className="p-6 bg-slate-50 dark:bg-zinc-800 rounded-[32px] border-2 border-slate-100 dark:border-zinc-700 shadow-inner">
                        <QRCodeSVG
                            value={qrValue}
                            size={200}
                            level="H"
                            includeMargin={false}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-black">Seu QR Code</h3>
                        <p className="text-sm text-muted-foreground font-medium">Mostre no seu celular para alguém escanear instantaneamente.</p>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl gap-2 font-bold bg-slate-50 hover:bg-slate-100 border-2 text-slate-700">
                        <Download className="h-4 w-4" /> Baixar Imagem do QR
                    </Button>
                </div>

                {/* Main Sharing Interface */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Share Box */}
                    <div className="bg-blue-600 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight">Compartilhe seu link exclusivo</h2>
                                <p className="text-blue-100 font-medium">Ao compartilhar, você ajuda o BibleAppPro a chegar a mais pessoas buscando luz e orientação.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20 group">
                                    <span className="font-mono text-sm truncate opacity-80">{qrValue}</span>
                                    <button
                                        onClick={handleCopyLink}
                                        className="p-2 hover:bg-white/20 rounded-xl transition-all"
                                    >
                                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                    </button>
                                </div>
                                <Button
                                    onClick={handleShareNative}
                                    className="h-16 px-10 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-black text-lg gap-3"
                                >
                                    <Share2 className="h-5 w-5" /> Compartilhar
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-4 text-sm font-bold">
                                    <span>Enviar diretamente:</span>
                                    <button className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                                        <Send className="h-4 w-4" />
                                    </button>
                                    <button className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                                        <Facebook className="h-4 w-4" />
                                    </button>
                                    <button className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                                        <Twitter className="h-4 w-4" />
                                    </button>
                                    <button className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                                        <Instagram className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <Users className="absolute -right-10 -top-10 h-64 w-64 text-white/5 -rotate-12 pointer-events-none" />
                    </div>

                    {/* Rewards / Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-800 rounded-[32px] p-8 space-y-4">
                            <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                                <Gift className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-black">Presente Premium</h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Curiosidade: Usuários que compartilham o App tendem a completar 40% mais planos de leitura mensais. Inspire outros agora!
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-800 border-2 border-slate-100 dark:border-zinc-700 rounded-[32px] p-8 space-y-4">
                            <div className="bg-slate-200 dark:bg-zinc-700 w-12 h-12 rounded-2xl flex items-center justify-center">
                                <Send className="h-6 w-6 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-black">Impacto Global</h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Suas indicações ajudam a manter o BibleAppPro acessível para cristãos em todo o mundo. Obrigado por fazer parte disso!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-zinc-100 dark:border-zinc-800">
                <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <Users className="h-6 w-6 text-blue-600" /> Comunidade Ativa
                    </h3>
                    <p className="text-muted-foreground font-medium">Junte-se a milhares de cristãos que usam o BibleAppPro diarimente.</p>
                </div>
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 font-black gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    Ver Ranking de Indicação <QrCode className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
