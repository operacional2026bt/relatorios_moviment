import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Só aceita requisições do tipo POST por segurança
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { acao, motorista, log, mat } = req.body;

    try {
        // Ação para o Administrador: Salvar ou Alterar Motorista
        if (acao === 'salvar_motorista') {
            await kv.hset(`motorista:${motorista.mat}`, {
                nome: motorista.nome,
                senha: motorista.senha || ''
            });
            return res.status(200).json({ status: 'sucesso' });
        }

        // Ação para o Administrador: Excluir Motorista
        if (acao === 'excluir_motorista') {
            await kv.del(`motorista:${mat}`);
            return res.status(200).json({ status: 'removido' });
        }

        // Ação do Motorista: Registrar Log ao copiar relatório
        if (acao === 'registrar_log') {
            const novoLog = {
                data: new Date().toISOString(),
                usuario: log.usuario,
                detalhes: log.texto
            };
            // Adiciona o log no topo da lista
            await kv.lpush('sistema:logs', JSON.stringify(novoLog));
            // Mantém apenas os últimos 100 logs para não sobrecarregar
            await kv.ltrim('sistema:logs', 0, 99);
            return res.status(200).json({ status: 'logado' });
        }

        // Ação para o Administrador: Listar Logs para análise
        if (acao === 'listar_logs') {
            const logs = await kv.lrange('sistema:logs', 0, -1);
            return res.status(200).json(logs);
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
