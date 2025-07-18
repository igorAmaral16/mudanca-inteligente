export type Caminhao = {
  larguraCm: number
  profundidadeCm: number
  alturaCm: number
}

export type Movel = {
  id: string
  nome: string
  larguraCm: number
  profundidadeCm: number
  alturaCm: number
}

export type MovelPosicionado3D = Movel & {
  x: number
  y: number
  z: number
  rot: { dx: number; dy: number; dz: number }
}

type Box = {
  x: number; y: number; z: number
  dx: number; dy: number; dz: number
}

function gerarOrientacoes(m: Movel): Array<{ dx: number; dy: number; dz: number }> {
  const { larguraCm: dx, profundidadeCm: dy, alturaCm: dz } = m
  return [
    { dx, dy, dz },
    { dx, dz, dy },
    { dy, dx, dz },
    { dy, dz, dx },
    { dz, dx, dy },
    { dz, dy, dx },
  ]
}

export function empacotar3D(
  moveis: Movel[],
  bau: Caminhao
): MovelPosicionado3D[] {
  const livres: Box[] = [{
    x: 0, y: 0, z: 0,
    dx: bau.larguraCm, dy: bau.profundidadeCm, dz: bau.alturaCm
  }]
  const itens = [...moveis].sort(
    (a, b) => (b.larguraCm * b.profundidadeCm * b.alturaCm) - (a.larguraCm * a.profundidadeCm * a.alturaCm)
  )
  const colocados: MovelPosicionado3D[] = []

  for (const m of itens) {
    let encaixado: MovelPosicionado3D | null = null
    for (let i = 0; i < livres.length && !encaixado; i++) {
      const box = livres[i]
      for (const ori of gerarOrientacoes(m)) {
        if (ori.dx <= box.dx && ori.dy <= box.dy && ori.dz <= box.dz) {
          encaixado = {
            ...m,
            x: box.x, y: box.y, z: box.z,
            rot: ori
          }
          livres.splice(i, 1)
          const { x, y, z, dx, dy, dz } = box
          const { dx: w, dy: h, dz: d } = ori

          livres.push({ x, y, z: z + d, dx: w, dy: h, dz: dz - d })
          livres.push({ x, y: y + h, z, dx: w, dy: dy - h, dz: d })
          livres.push({ x: x + w, y, z, dx: dx - w, dy, dz })
          break
        }
      }
    }
    if (encaixado) colocados.push(encaixado)
  }
  return colocados
}