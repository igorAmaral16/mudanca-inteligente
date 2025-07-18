// app/novo/index.tsx
import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { salvarRascunhoMudanca } from '../../src/storage/dados'

type DadosMudanca = {
    nomeCliente: string
    dataMudanca: string
    nomeCaminhao: string
    larguraCm: string
    profundidadeCm: string
    alturaCm: string
    valorCobrado: string
}

export default function DadosMudancaScreen() {
    const router = useRouter()
    const [dados, setDados] = useState<DadosMudanca>({
        nomeCliente: '',
        dataMudanca: '',
        nomeCaminhao: '',
        larguraCm: '',
        profundidadeCm: '',
        alturaCm: '',
        valorCobrado: '',
    })

    function validarECapturar(): void {
        // Validação defensiva
        for (const [chave, valor] of Object.entries(dados)) {
            if (!valor.trim()) {
                return Alert.alert('Erro', `Preencha o campo "${chave}"`)
            }
            if (
                ['larguraCm', 'profundidadeCm', 'alturaCm', 'valorCobrado'].includes(chave) &&
                isNaN(Number(valor))
            ) {
                return Alert.alert('Erro', `"${chave}" deve ser um número válido`)
            }
        }

        // Salva rascunho parcial
        salvarRascunhoMudanca({ dadosMudanca: dados, listaMoveis: [] })
        // Avança para próxima etapa
        router.push({ pathname: '/novo/moveis' })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>1. Dados da Mudança</Text>

            {[
                { key: 'nomeCliente', label: 'Nome do Cliente', keyboard: 'default' },
                { key: 'dataMudanca', label: 'Data (DD/MM/AAAA)', keyboard: 'default' },
                { key: 'nomeCaminhao', label: 'Nome do Caminhão', keyboard: 'default' },
                { key: 'larguraCm', label: 'Largura (cm)', keyboard: 'numeric' },
                { key: 'profundidadeCm', label: 'Profundidade (cm)', keyboard: 'numeric' },
                { key: 'alturaCm', label: 'Altura (cm)', keyboard: 'numeric' },
                { key: 'valorCobrado', label: 'Valor (R$)', keyboard: 'numeric' },
            ].map(({ key, label, keyboard }) => (
                <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={label}
                    keyboardType={keyboard}
                    value={(dados as any)[key]}
                    onChangeText={(t) => setDados((s) => ({ ...s, [key]: t }))}
                />
            ))}

            <TouchableOpacity style={styles.button} onPress={validarECapturar}>
                <Text style={styles.buttonText}>Próxima Etapa</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { padding: 24 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#e01a66' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#e01a66',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
