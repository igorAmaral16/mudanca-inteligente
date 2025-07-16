import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PLANOS = '@MudancaInteligente:planos';

export async function salvarPlanoLocal(plano: any): Promise<void> {
    try {
        const textoExistente = await AsyncStorage.getItem(CHAVE_PLANOS);
        const listaPlanos = textoExistente ? JSON.parse(textoExistente) : [];
        listaPlanos.push(plano);
        await AsyncStorage.setItem(CHAVE_PLANOS, JSON.stringify(listaPlanos));
    } catch (erro) {
        console.error('Falha ao salvar plano:', erro);
        throw new Error('Erro interno ao salvar plano.');
    }
}

export async function listarPlanosLocais(): Promise<any[]> {
    try {
        const textoExistente = await AsyncStorage.getItem(CHAVE_PLANOS);
        return textoExistente ? JSON.parse(textoExistente) : [];
    } catch (erro) {
        console.error('Falha ao listar planos:', erro);
        return [];
    }
}
