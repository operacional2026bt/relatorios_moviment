import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const { acao } = req.method === 'POST' ? req.body : req.query;

    try {
        if (acao === 'salvar_motorista') {
            const { matricula, nome, senha } = req.body;
            await kv.hset(`motorista:${matricula}`, { matricula, nome, senha });
            // Atualiza a lista global de matrículas para a listagem
            await kv.sadd('lista_matriculas', matricula);
            return res.status(200).json({ sucesso: true });
        }

        if (acao === 'listar_motoristas') {
            const matriculas = await kv.smembers('lista_matriculas');
            const motoristas = [];
            for (const mat of matriculas) {
                const dados = await kv.hgetall(`motorista:${mat}`);
                if (dados) motoristas.push(dados);
            }
            return res.status(200).json(motoristas);
        }

        if (acao === 'excluir_motorista') {
            const { matricula } = req.body;
            await kv.del(`motorista:${matricula}`);
            await kv.srem('lista_matriculas', matricula);
            return res.status(200).json({ sucesso: true });
        }

        if (acao === 'buscar_motorista') {
            const { matricula } = req.query;
            const dados = await kv.hgetall(`motorista:${matricula}`);
            return res.status(200).json(dados || null);
        }

        return res.status(400).json({ msg: 'Ação inválida' });
    } catch (error) {
        return res.status(500).json({ sucesso: false, msg: error.message });
    }
}
