// app/novo/moveis.tsx
import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import {
    Movel,
    lerRascunhoMudanca,
    adicionarMovelRascunho,
} from '../../src/storage/dados'

type MovelInput = Omit<Movel, 'id'>

export default function MoveisScreen() {
    const router = useRouter()
    const [movel, setMovel] = useState<MovelInput>({
        nome: '',
        larguraCm: 0,
        profundidadeCm: 0,
        alturaCm: 0,
        empilhavel: false,
    })
    const [lista, setLista] = useState<Movel[]>([])

    // Carrega rascunho existente
    useEffect(() => {
        lerRascunhoMudanca().then((r) => setLista(r.listaMoveis))
    }, [])

    async function aoAdicionar() {
        if (!movel.nome.trim()) {
            return Alert.alert('Erro', 'Informe o nome do móvel')
        }
        if (movel.larguraCm <= 0 || movel.profundidadeCm <= 0 || movel.alturaCm <= 0) {
            return Alert.alert('Erro', 'Dimensões devem ser maiores que zero')
        }

        // Atualiza rascunho e lista local
        const atualizado = await adicionarMovelRascunho(movel)
        setLista(atualizado.listaMoveis)

        // Limpa campos
        setMovel({ nome: '', larguraCm: 0, profundidadeCm: 0, alturaCm: 0, empilhavel: false })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>2. Itens a Carregar</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do móvel"
                value={movel.nome}
                onChangeText={(t) => setMovel((s) => ({ ...s, nome: t }))}
            />

            <View style={styles.row}>
                {[
                    { key: 'larguraCm', label: 'Largura (cm)' },
                    { key: 'profundidadeCm', label: 'Profundidade (cm)' },
                    { key: 'alturaCm', label: 'Altura (cm)' },
                ].map(({ key, label }) => (
                    <TextInput
                        key={key}
                        style={[styles.inputSmall]}
                        placeholder={label}
                        keyboardType="numeric"
                        value={(movel as any)[key].toString()}
                        onChangeText={(t) =>
                            setMovel((s) => ({ ...s, [key]: Number(t) || 0 }))
                        }
                    />
                ))}
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() =>
                        setMovel((s) => ({ ...s, empilhavel: !s.empilhavel }))
                    }
                >
                    <Text>{movel.empilhavel ? '☑' : '☐'}</Text>
                </TouchableOpacity>
                <Text style={styles.label}>Permitir empilhar</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={aoAdicionar}>
                <Text style={styles.buttonText}>+ Adicionar</Text>
            </TouchableOpacity>

            <FlatList
                style={{ marginTop: 16 }}
                data={lista}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        • {item.nome} ({item.larguraCm}×{item.profundidadeCm}×
                        {item.alturaCm}) {item.empilhavel ? '[E]' : ''}
                    </Text>
                )}
                ListEmptyComponent={<Text>Nenhum móvel adicionado.</Text>}
            />

            <TouchableOpacity
                style={[styles.button, { marginTop: 24 }]}
                onPress={() => router.push({ pathname: '/novo/resumo' })}
            >
                <Text style={styles.buttonText}>Próxima Etapa</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: '700', color: '#e01a66' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginTop: 12,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    inputSmall: {
        width: '30%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { marginLeft: 8, lineHeight: 24 },
    button: {
        backgroundColor: '#e01a66',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    item: { marginTop: 6, fontSize: 16 },
})
