// ======================================
// CONFIGURACIÓN ELO
// ======================================

const K_FACTOR = 32;


// ======================================
// ELO MEDIO DE UNA PAREJA
// ======================================

function getTeamElo(team){

    return (
        team[0].elo +
        team[1].elo
    ) / 2;

}



// ======================================
// RESULTADO ESPERADO
// ======================================

function expectedScore(
    eloA,
    eloB
){

    return (
        1 /
        (
            1 +
            Math.pow(
                10,
                (eloB - eloA) / 400
            )
        )
    );

}



// ======================================
// CAMBIO DE ELO
// ======================================

function calculateEloChange(
    elo,
    expected,
    result
){

    return Math.round(
        K_FACTOR *
        (
            result - expected
        )
    );

}



// ======================================
// ACTUALIZAR ELO DE UNA PARTIDA
// ======================================

function updateElo(
    parejaGanadora,
    parejaPerdedora
){


    const eloGanador =
        getTeamElo(
            parejaGanadora
        );


    const eloPerdedor =
        getTeamElo(
            parejaPerdedora
        );



    const esperadoGanador =
        expectedScore(
            eloGanador,
            eloPerdedor
        );


    const esperadoPerdedor =
        expectedScore(
            eloPerdedor,
            eloGanador
        );



    parejaGanadora.forEach(jugador=>{


        jugador.elo +=
            calculateEloChange(
                jugador.elo,
                esperadoGanador,
                1
            );


    });



    parejaPerdedora.forEach(jugador=>{


        jugador.elo +=
            calculateEloChange(
                jugador.elo,
                esperadoPerdedor,
                0
            );


    });


}



// ======================================
// ACTUALIZAR COMPAÑEROS Y RIVALES
// ======================================

function updateRelations(
    equipoA,
    equipoB
){


    const parejaA = equipoA;
    const parejaB = equipoB;



    // compañeros

    parejaA[0].compañeros.push(
        parejaA[1].id
    );


    parejaA[1].compañeros.push(
        parejaA[0].id
    );



    parejaB[0].compañeros.push(
        parejaB[1].id
    );


    parejaB[1].compañeros.push(
        parejaB[0].id
    );



    // rivales

    parejaA.forEach(a=>{


        parejaB.forEach(b=>{


            a.rivales.push(
                b.id
            );


            b.rivales.push(
                a.id
            );


        });


    });


}