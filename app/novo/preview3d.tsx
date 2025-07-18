import React, { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'
import { Canvas } from '@react-three/fiber/native'
import { OrbitControls } from '@react-three/drei'
import {
    empacotar3D,
    Caminhao,
    MovelPosicionado3D
} from '../../src/services/empacotador'
import { lerRascunhoMudanca } from '../../src/storage/dados'

export default function Preview3D() {
    const [colocados, setColocados] = useState<MovelPosicionado3D[]>([])
    const [bau, setBau] = useState<Caminhao | null>(null)
    const size = Math.min(Dimensions.get('window').width, 300)

    useEffect(() => {
        lerRascunhoMudanca().then(r => {
            const dm = r.dadosMudanca
            const bauData: Caminhao = {
                larguraCm: Number(dm.larguraCm),
                profundidadeCm: Number(dm.profundidadeCm),
                alturaCm: Number(dm.alturaCm),
            }
            setBau(bauData)
            setColocados(empacotar3D(r.listaMoveis, bauData))
        })
    }, [])

    if (!bau) return null

    return (
        <View style={{ width: size, height: size }}>
            <Canvas camera={{ position: [bau.larguraCm, bau.alturaCm, bau.profundidadeCm] }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                <mesh position={[bau.larguraCm / 2, bau.alturaCm / 2, bau.profundidadeCm / 2]}>
                    <boxGeometry args={[bau.larguraCm, bau.alturaCm, bau.profundidadeCm]} />
                    <meshBasicMaterial color="gray" wireframe />
                </mesh>
                {colocados.map((m, i) => (
                    <mesh
                        key={m.id}
                        position={[m.x + m.rot.dx / 2, m.z + m.rot.dz / 2, m.y + m.rot.dy / 2]}
                    >
                        <boxGeometry args={[m.rot.dx, m.rot.dz, m.rot.dy]} />
                        <meshStandardMaterial color={i % 2 ? 'orange' : 'purple'} />
                    </mesh>
                ))}
            </Canvas>
        </View>
    )
}