import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Acesso negado' });
    const { acao, motorista, log, mat } = req.body;

    try {
        // 1. SALVAR OU EDITAR MOTORISTA
        if (acao === 'salvar_motorista') {
            await kv.hset(`motorista:${motorista.mat}`, {
                nome: motorista.nome,
                senha: motorista.senha || ''
            });
            return res.status(200).json({ status: 'ok' });
        }

        // 2. EXCLUIR MOTORISTA
        if (acao === 'excluir_motorista') {
            await kv.del(`motorista:${mat}`);
            return res.status(200).json({ status: 'removido' });
        }

        // 3. LISTAR TODOS OS MOTORISTAS (O que estava faltando!)
        if (acao === 'listar_todos_motoristas') {
            const chaves = await kv.keys('motorista:*');
            const todos = [];
            for (const chave of chaves) {
                const dados = await kv.hgetall(chave);
                if (dados) {
                    todos.push({ mat: chave.split(':')[1], nome: dados.nome, senha: dados.senha });
                }
            }
            return res.status(200).json(todos);
        }

        // 4. REGISTRAR LOG (Vindo do index.html)
        if (acao === 'registrar_log') {
            const novoLog = { data: new Date().toISOString(), usuario: log.usuario, detalhes: log.texto };
            await kv.lpush('sistema:logs', JSON.stringify(novoLog));
            await kv.ltrim('sistema:logs', 0, 99);
            return res.status(200).json({ status: 'logado' });
        }

        // 5. LISTAR LOGS
        if (acao === 'listar_logs') {
            const logs = await kv.lrange('sistema:logs', 0, -1);
            return res.status(200).json(logs);
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
