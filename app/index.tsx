// app/index.tsx
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
    const router = useRouter()

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <Text style={styles.titulo}>📦 Mudança Inteligente</Text>

            <TouchableOpacity
                style={[styles.botao, styles.botaoPrimario]}
                onPress={() => router.push({ pathname: './novo' })}
                activeOpacity={0.8}
            >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.textoBotao}>Nova Mudança</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botao, styles.botaoSecundario]}
                onPress={() => router.push({ pathname: '/historico' })}
                activeOpacity={0.8}
            >
                <Ionicons name="folder-open-outline" size={24} color="#fff" />
                <Text style={styles.textoBotao}>Histórico</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#e01a66',
        marginBottom: 40,
    },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
        justifyContent: 'center',
    },
    botaoPrimario: {
        backgroundColor: '#e01a66',
    },
    botaoSecundario: {
        backgroundColor: '#a81971',
    },
    textoBotao: {
        color: '#ffffff',
        fontSize: 18,
        marginLeft: 12,
        fontWeight: '600',
    },
})
