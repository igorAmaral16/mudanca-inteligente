import React, { useEffect, useState } from 'react'
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import Preview3D from './preview3d'
import { lerRascunhoMudanca, salvarPlanoFinal } from '../../src/storage/dados'

export default function ResumoScreen() {
    const router = useRouter()
    const [rascunho, setRascunho] = useState<any>(null)

    useEffect(() => {
        lerRascunhoMudanca().then(setRascunho)
    }, [])

    if (!rascunho) return <Text>Carregando...</Text>

    function concluir() {
        salvarPlanoFinal(rascunho)
        Alert.alert('Sucesso', 'Mudança salva no histórico.')
        router.replace({ pathname: '/historico' })
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Revisão & Preview 3D</Text>
            <View style={styles.preview}><Preview3D /></View>
            <TouchableOpacity style={styles.button} onPress={concluir}>
                <Text style={styles.buttonText}>Salvar e Finalizar</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { padding: 24 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#e01a66' },
    preview: { alignItems: 'center', marginBottom: 24 },
    button: {
        backgroundColor: '#e01a66',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})