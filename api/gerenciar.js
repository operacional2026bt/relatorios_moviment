import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Acesso negado' });
    const { acao, motorista, log, mat } = req.body;

    try {
        // Ação para o Administrador: Salvar ou Alterar
        if (acao === 'salvar_motorista') {
            await kv.hset(`motorista:${motorista.mat}`, {
                nome: motorista.nome,
                senha: motorista.senha || ''
            });
            return res.status(200).json({ status: 'ok' });
        }

        // Ação para o Administrador: Excluir
        if (acao === 'excluir_motorista') {
            await kv.del(`motorista:${mat}`);
            return res.status(200).json({ status: 'removido' });
        }

        // Ação do Motorista (Silencioso): Registrar Log
        if (acao === 'registrar_log') {
            const novoLog = { data: new Date().toISOString(), usuario: log.usuario, detalhes: log.texto };
            await kv.lpush('sistema:logs', JSON.stringify(novoLog));
            await kv.ltrim('sistema:logs', 0, 99); // Mantém os últimos 100
            return res.status(200).json({ status: 'logado' });
        }

        // Ação para o Administrador: Listar Logs
        if (acao === 'listar_logs') {
            const logs = await kv.lrange('sistema:logs', 0, -1);
            return res.status(200).json(logs);
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

