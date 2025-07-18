import React, { useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const CORES = {
    primario: '#e01a66',
    secundario: '#a81971',
    textoEscuro: '#333',
    fundo: '#ffffff',
    cinzaClaro: '#f2f2f2',
}

export default function HomeScreen() {
    const roteador = useRouter()
    const [estaCarregando, setEstaCarregando] = useState(false)

    function navegarPara(caminho: string) {
        setEstaCarregando(true)
        setTimeout(() => {
            setEstaCarregando(false)
            roteador.push(caminho)
        }, 300) // simula transição
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={CORES.fundo} />
            <Text style={styles.titulo}>Mudança Inteligente</Text>

            <TouchableOpacity
                style={styles.botao}
                onPress={() => navegarPara('/novo')}
                activeOpacity={0.8}
            >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.textoBotao}>Nova Mudança.</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botao, styles.botaoSecundario]}
                onPress={() => navegarPara('/historico')}
                activeOpacity={0.8}
            >
                <Ionicons name="folder-open-outline" size={24} color="#fff" />
                <Text style={styles.textoBotao}>Planos Salvos.</Text>
            </TouchableOpacity>

            {estaCarregando && (
                <View style={styles.overlayCarregando}>
                    <ActivityIndicator size="large" color={CORES.primario} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CORES.fundo,
        padding: 24,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 32,
        fontWeight: '700',
        color: CORES.primario,
        textAlign: 'center',
        marginBottom: 40,
    },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.primario,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 16,
    },
    botaoSecundario: {
        backgroundColor: CORES.secundario,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    overlayCarregando: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
