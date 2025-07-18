import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Dimensions,
    ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

const CORES = {
    primario: '#e01a66',
    secundario: '#a81971',
    textoEscuro: '#333',
    fundo: '#fff',
    borda: '#ccc',
}

const CHAVE_RASCUNHO = '@MudancaInteligente:rascunho'

export default function TelaNovaMudanca() {
    const roteador = useRouter()
    const [rascunho, setRascunho] = useState<any>({
        etapaAtual: 0,
        nomeCliente: '',
        dataMudanca: '',
        nomeCaminhao: '',
        dimensoes: { larguraCm: '', profundidadeCm: '', alturaCm: '' },
        valorCobrado: '',
        listaMoveis: [],
    })
    const [movelDigitado, setMovelDigitado] = useState<any>({
        nome: '',
        larguraCm: '',
        profundidadeCm: '',
        alturaCm: '',
        empilhavel: false,
    })
    const [carregando, setCarregando] = useState(false)

    // Carregar rascunho
    useEffect(() => {
        ; (async () => {
            try {
                const texto = await AsyncStorage.getItem(CHAVE_RASCUNHO)
                if (texto) setRascunho(JSON.parse(texto))
            } catch { }
        })()
    }, [])

    // Salvar rascunho
    useEffect(() => {
        AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho)).catch(() => { })
    }, [rascunho])

    function mostrarAjuda(campo: string) {
        const mensagens: Record<string, string> = {
            nomeCliente: 'Nome completo do cliente.',
            dataMudanca: 'Data da mudança (DD/MM/AAAA).',
            nomeCaminhao: 'Referência do veículo.',
            larguraCm: 'Largura interna do baú em cm.',
            profundidadeCm: 'Profundidade interna do baú em cm.',
            alturaCm: 'Altura interna do baú em cm.',
            valorCobrado: 'Valor total em R$.',
        }
        Alert.alert('Ajuda', mensagens[campo] ?? '')
    }

    function avancarEtapa() {
        // validações omitidas para brevidade
        setRascunho((s: any) => ({ ...s, etapaAtual: s.etapaAtual + 1 }))
    }
    function voltarEtapa() {
        if (rascunho.etapaAtual === 0) return roteador.back()
        setRascunho((s: any) => ({ ...s, etapaAtual: s.etapaAtual - 1 }))
    }

    function aoAdicionarMovel() {
        if (!movelDigitado.nome.trim()) return Alert.alert('Preencha o nome.')
        setRascunho((s: any) => ({
            ...s,
            listaMoveis: [
                ...s.listaMoveis,
                { ...movelDigitado, id: Date.now().toString() },
            ],
        }))
        setMovelDigitado({ nome: '', larguraCm: '', profundidadeCm: '', alturaCm: '', empilhavel: false })
    }

    function salvarEFechar() {
        setCarregando(true)
        setTimeout(() => {
            AsyncStorage.removeItem(CHAVE_RASCUNHO)
            setCarregando(false)
            roteador.back()
        }, 500)
    }

    // layout de carrossel
    const largura = Dimensions.get('window').width
    return (
        <View style={styles.container}>
            {carregando && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color={CORES.primario} />
                </View>
            )}

            <ScrollView
                horizontal
                pagingEnabled
                scrollEnabled={false}
                contentOffset={{ x: largura * rascunho.etapaAtual, y: 0 }}
                style={{ flex: 1 }}
            >
                {/* ETAPA 1 */}
                <View style={styles.pagina}>
                    <Text style={styles.titulo}>Dados da Mudança</Text>

                    {(['nomeCliente', 'dataMudanca', 'nomeCaminhao', 'valorCobrado'] as const).map((campo) => (
                        <View key={campo} style={styles.campoContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={{
                                    nomeCliente: 'Nome do Cliente',
                                    dataMudanca: 'Data da Mudança',
                                    nomeCaminhao: 'Nome do Caminhão',
                                    valorCobrado: 'Valor Cobrado (R$)',
                                }[campo]}
                                value={rascunho[campo]}
                                onChangeText={(t) => setRascunho((s: any) => ({ ...s, [campo]: t }))}
                            />
                            <TouchableOpacity onPress={() => mostrarAjuda(campo)}>
                                <Ionicons name="help-circle-outline" size={20} color={CORES.secundario} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <Text style={styles.subtitulo}>Dimensões do Baú (cm)</Text>
                    {(['larguraCm', 'profundidadeCm', 'alturaCm'] as const).map((campo) => (
                        <View key={campo} style={styles.campoContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={{
                                    larguraCm: 'Largura',
                                    profundidadeCm: 'Profundidade',
                                    alturaCm: 'Altura',
                                }[campo]}
                                keyboardType="numeric"
                                value={rascunho.dimensoes[campo]}
                                onChangeText={(t) =>
                                    setRascunho((s: any) => ({
                                        ...s,
                                        dimensoes: { ...s.dimensoes, [campo]: t },
                                    }))
                                }
                            />
                            <TouchableOpacity onPress={() => mostrarAjuda(campo)}>
                                <Ionicons name="help-circle-outline" size={20} color={CORES.secundario} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* ETAPA 2 */}
                <View style={styles.pagina}>
                    <Text style={styles.titulo}>Itens a Carregar</Text>

                    <View style={styles.campoContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do Móvel"
                            value={movelDigitado.nome}
                            onChangeText={(t) => setMovelDigitado((m) => ({ ...m, nome: t }))}
                        />
                        <TouchableOpacity onPress={() => mostrarAjuda('')}>
                            <Ionicons name="help-circle-outline" size={20} color={CORES.secundario} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        {(['larguraCm', 'profundidadeCm', 'alturaCm'] as const).map((campo) => (
                            <TextInput
                                key={campo}
                                style={[styles.inputPequeno]}
                                placeholder={campo.replace('Cm', '')}
                                keyboardType="numeric"
                                value={(movelDigitado as any)[campo]}
                                onChangeText={(t) => setMovelDigitado((m) => ({ ...m, [campo]: t }))}
                            />
                        ))}
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setMovelDigitado((m) => ({ ...m, empilhavel: !m.empilhavel }))}
                        >
                            {movelDigitado.empilhavel ? (
                                <Ionicons name="checkbox-outline" size={20} color={CORES.secundario} />
                            ) : (
                                <Ionicons name="square-outline" size={20} color={CORES.borda} />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.labelCheckbox}>Permite empilhar</Text>
                    </View>
                    <TouchableOpacity style={styles.botaoSecundario} onPress={aoAdicionarMovel}>
                        <Text style={styles.textoBotaoSecundario}>+ Adicionar</Text>
                    </TouchableOpacity>

                    <ScrollView style={styles.lista}>
                        {rascunho.listaMoveis.map((m: any) => (
                            <View key={m.id} style={styles.itemLista}>
                                <Text style={styles.textoItem}>
                                    {m.nome} ({m.larguraCm}×{m.profundidadeCm}×{m.alturaCm}){' '}
                                    {m.empilhavel ? '[empilhável]' : ''}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* ETAPA 3 */}
                <View style={styles.pagina}>
                    <Text style={styles.titulo}>Revisão</Text>
                    <ScrollView>
                        <Text style={styles.subtitulo}>Dados Gerais</Text>
                        <Text style={styles.textoRevisao}>Cliente: {rascunho.nomeCliente}</Text>
                        <Text style={styles.textoRevisao}>Data: {rascunho.dataMudanca}</Text>
                        <Text style={styles.textoRevisao}>Caminhão: {rascunho.nomeCaminhao}</Text>
                        <Text style={styles.textoRevisao}>
                            Dimensões: {rascunho.dimensoes.larguraCm}×
                            {rascunho.dimensoes.profundidadeCm}×
                            {rascunho.dimensoes.alturaCm} cm
                        </Text>
                        <Text style={styles.textoRevisao}>Valor: R$ {rascunho.valorCobrado}</Text>

                        <Text style={styles.subtitulo}>Móveis</Text>
                        {rascunho.listaMoveis.map((m: any) => (
                            <Text key={m.id} style={styles.textoRevisao}>
                                • {m.nome} ({m.larguraCm}×{m.profundidadeCm}×{m.alturaCm}){' '}
                                {m.empilhavel ? '[empilhável]' : ''}
                            </Text>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Navegação */}
            <View style={styles.rodape}>
                <TouchableOpacity onPress={voltarEtapa} style={styles.botaoVoltar}>
                    <Ionicons name="chevron-back" size={24} color={CORES.textoEscuro} />
                    <Text style={styles.textoVoltar}>Voltar</Text>
                </TouchableOpacity>
                {rascunho.etapaAtual < 2 ? (
                    <TouchableOpacity onPress={avancarEtapa} style={styles.botaoAvancar}>
                        <Text style={styles.textoAvancar}>Próxima etapa</Text>
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.rodapeFinal}>
                        <TouchableOpacity onPress={() => Alert.alert('Download')}>
                            <Ionicons name="download-outline" size={28} color={CORES.secundario} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={salvarEFechar} style={styles.botaoSalvar}>
                            <Text style={styles.textoSalvar}>Fechar e salvar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    pagina: {
        width: Dimensions.get('window').width,
        padding: 24,
    },
    titulo: {
        fontSize: 24,
        fontWeight: '700',
        color: CORES.primario,
        marginBottom: 16,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: CORES.textoEscuro,
        marginTop: 12,
        marginBottom: 8,
    },
    campoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: CORES.borda,
        borderRadius: 8,
        padding: 12,
        backgroundColor: CORES.cinzaClaro || '#fafafa',
    },
    inputPequeno: {
        flex: 1,
        borderWidth: 1,
        borderColor: CORES.borda,
        borderRadius: 8,
        padding: 10,
        marginRight: 8,
        backgroundColor: CORES.cinzaClaro || '#fafafa',
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    checkbox: {
        marginRight: 8,
    },
    labelCheckbox: {
        fontSize: 16,
        color: CORES.textoEscuro,
    },
    botaoSecundario: {
        backgroundColor: CORES.cinzaClaro,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    textoBotaoSecundario: { color: CORES.textoEscuro, fontWeight: '600' },
    lista: { maxHeight: 150, marginTop: 12 },
    itemLista: {
        backgroundColor: CORES.cinzaClaro,
        padding: 10,
        borderRadius: 6,
        marginBottom: 6,
    },
    textoItem: { color: CORES.textoEscuro },
    rodape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderColor: CORES.borda,
    },
    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textoVoltar: {
        marginLeft: 4,
        color: CORES.textoEscuro,
        fontSize: 16,
    },
    botaoAvancar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.primario,
        padding: 12,
        borderRadius: 8,
    },
    textoAvancar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 4,
    },
    rodapeFinal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    botaoSalvar: {
        backgroundColor: CORES.secundario,
        padding: 12,
        borderRadius: 8,
        marginLeft: 16,
    },
    textoSalvar: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
