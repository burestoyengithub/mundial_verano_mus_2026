console.log("elo.js cargado correctamente");

const K_FACTOR = 32;


// ======================================
// ELO MEDIO DE UNA PAREJA
// ======================================

function getTeamElo(jugadores){

    return (
        jugadores[0].elo +
        jugadores[1].elo
    ) / 2;

}



// ======================================
// RESULTADO ESPERADO
// ======================================

function expectedScore(
    eloA,
    eloB
){

    return 1 /
    (
        1 +
        Math.pow(
            10,
            (eloB - eloA) / 400
        )
    );

}



// ======================================
// CAMBIO ELO
// ======================================

function eloChange(
    elo,
    esperado,
    resultado
){

    return Math.round(
        K_FACTOR *
        (
            resultado - esperado
        )
    );

}
// ======================================
// APLICAR ELO A UNA PARTIDA
// ======================================

function applyElo(equipoA, equipoB, ganador){

    const eloA = getTeamElo(equipoA);
    const eloB = getTeamElo(equipoB);

    const esperadoA = expectedScore(
        eloA,
        eloB
    );

    const esperadoB = expectedScore(
        eloB,
        eloA
    );

    const resultadoA =
        ganador === "A" ? 1 : 0;

    const resultadoB =
        ganador === "B" ? 1 : 0;

    const cambioA = eloChange(
        eloA,
        esperadoA,
        resultadoA
    );

    const cambioB = eloChange(
        eloB,
        esperadoB,
        resultadoB
    );

    equipoA.forEach(j=>{
        j.elo += cambioA;
    });

    equipoB.forEach(j=>{
        j.elo += cambioB;
    });

}