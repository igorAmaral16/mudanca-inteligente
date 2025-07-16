export interface Caminhao {
  larguraCm: number;
  profundidadeCm: number;
  alturaCm: number;
}

export interface Movel {
  id: string;
  nome: string;
  larguraCm: number;
  profundidadeCm: number;
  alturaCm: number;
  empilhavel: boolean;
}

export interface MovelPosicionado extends Movel {
  posXcm: number;
  posYcm: number;
  posZcm: number;
}

export function empacotarMoveis(
  listaMoveis: Movel[],
  informacoesCaminhao: Caminhao
): MovelPosicionado[] {
  // Defensive: validar parâmetros
  if (!Array.isArray(listaMoveis)) throw new Error('Lista de móveis inválida.');
  const { larguraCm, profundidadeCm } = informacoesCaminhao;
  if (
    isNaN(larguraCm) || larguraCm <= 0 ||
    isNaN(profundidadeCm) || profundidadeCm <= 0
  ) {
    throw new Error('Dimensões do caminhão inválidas.');
  }

  const resultado: MovelPosicionado[] = [];
  let cursorX = 0;
  let cursorZ = 0;
  let alturaDaCamada = 0;

  for (const movel of listaMoveis) {
    // validar cada móvel
    if (
      isNaN(movel.larguraCm) || movel.larguraCm <= 0 ||
      isNaN(movel.profundidadeCm) || movel.profundidadeCm <= 0
    ) {
      console.warn('Móvel ignorado por dimensão inválida:', movel);
      continue;
    }

    // se não cabe na largura restante, nova linha
    if (cursorX + movel.larguraCm > larguraCm) {
      cursorX = 0;
      cursorZ += alturaDaCamada;
      alturaDaCamada = 0;
    }

    // se extrapola a profundidade total, paramos
    if (cursorZ + movel.profundidadeCm > profundidadeCm) {
      console.warn('Espaço esgotado no caminhão.');
      break;
    }

    // posiciona móvel
    resultado.push({
      ...movel,
      posXcm: cursorX,
      posYcm: 0,
      posZcm: cursorZ,
    });

    // atualiza cursores
    cursorX += movel.larguraCm;
    alturaDaCamada = Math.max(alturaDaCamada, movel.profundidadeCm);
  }

  return resultado;
}
