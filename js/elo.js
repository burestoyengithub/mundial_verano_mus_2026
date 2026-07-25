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