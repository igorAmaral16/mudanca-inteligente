import AsyncStorage from '@react-native-async-storage/async-storage'

const CHAVE_RASCUNHO = '@MudancaInteligente:rascunho'
const CHAVE_PLANOS = '@MudancaInteligente:planos'

export type RascunhoMudanca = {
    dadosMudanca: Record<string, any>
    listaMoveis: Movel[]
}

export type Movel = {
    id: string
    nome: string
    larguraCm: number
    profundidadeCm: number
    alturaCm: number
    empilhavel: boolean
}

/** Salva ou atualiza o rascunho da mudança */
export async function salvarRascunhoMudanca(r: RascunhoMudanca) {
    try {
        await AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(r))
    } catch { /* silencia erro */ }
}

/** Lê o rascunho, ou retorna inicial vazio */
export async function lerRascunhoMudanca(): Promise<RascunhoMudanca> {
    try {
        const texto = await AsyncStorage.getItem(CHAVE_RASCUNHO)
        return texto ? JSON.parse(texto) : { dadosMudanca: {}, listaMoveis: [] }
    } catch {
        return { dadosMudanca: {}, listaMoveis: [] }
    }
}

/** Adiciona um móvel ao rascunho e retorna o rascunho atualizado */
export async function adicionarMovelRascunho(
    m: Omit<Movel, 'id'>
): Promise<RascunhoMudanca> {
    const r = await lerRascunhoMudanca()
    const novo: Movel = { id: Date.now().toString(), ...m }
    const atualizado = { ...r, listaMoveis: [...r.listaMoveis, novo] }
    await AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(atualizado))
    return atualizado
}

/** Salva o plano finalizado em histórico */
export async function salvarPlanoFinal(r: RascunhoMudanca) {
    try {
        const texto = await AsyncStorage.getItem(CHAVE_PLANOS)
        const arr = texto ? JSON.parse(texto) : []
        arr.push({ ...r, criadoEm: Date.now() })
        await AsyncStorage.setItem(CHAVE_PLANOS, JSON.stringify(arr))
    } catch { /* silencia erro */ }
}

/** Lista todos os planos salvos */
export async function listarPlanos(): Promise<any[]> {
    try {
        const texto = await AsyncStorage.getItem(CHAVE_PLANOS)
        return texto ? JSON.parse(texto) : []
    } catch {
        return []
    }
}
