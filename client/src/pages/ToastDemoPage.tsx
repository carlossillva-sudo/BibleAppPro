import React from 'react';
import { useToast } from '../contexts/ToastProvider';

const ToastDemoPage: React.FC = () => {
  const showToast = useToast();
  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Toast Provider Demo</h1>
      <p className="text-sm text-gray-700">
        Este exemplo mostra como usar o ToastProvider global. Use os botões para disparar diferentes
        tipos de toast.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => showToast('Informação: ação concluída', 'info')}
        >
          Info
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => showToast('Sucesso: operação concluída', 'success')}
        >
          Sucesso
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => showToast('Erro: algo deu errado', 'error')}
        >
          Erro
        </button>
      </div>
    </div>
  );
};

export default ToastDemoPage;
