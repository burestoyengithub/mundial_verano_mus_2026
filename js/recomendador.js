// =====================================================
// CALCULA NECESIDAD DE UN JUGADOR
// =====================================================

function playerNeed(player){

    return Math.max(
        0,
        Math.min(
            1,
            (20 - player.partidas) / 20
        )
    );

}



// =====================================================
// DIVERSIDAD DE COMPAÑEROS
// =====================================================

function companionDiversity(team){


    const a = team[0];
    const b = team[1];


    if(
        !a.compañeros.includes(b.id)
    ){

        return 1;

    }


    return 0;

}



// =====================================================
// DIVERSIDAD DE RIVALES
// =====================================================

function rivalDiversity(teamA,teamB){


    let nuevos = 0;


    teamA.forEach(a=>{


        teamB.forEach(b=>{


            if(
                !a.rivales.includes(b.id)
            ){

                nuevos++;

            }


        });


    });


    return nuevos / 4;

}



// =====================================================
// EQUILIBRIO ELO
// =====================================================

function eloBalance(teamA,teamB){


    const eloA =
        (teamA[0].elo + teamA[1].elo) / 2;


    const eloB =
        (teamB[0].elo + teamB[1].elo) / 2;



    const diferencia =
        Math.abs(
            eloA - eloB
        );



    return 1 -
        Math.min(
            diferencia / 600,
            1
        );

}



// =====================================================
// GANANCIA DE DIVERSIDAD
// =====================================================

function diversityGain(teamA,teamB){


    const jugadores =
    [
        ...teamA,
        ...teamB
    ];


    let nuevasRelaciones = 0;



    jugadores.forEach(a=>{


        jugadores.forEach(b=>{


            if(a.id===b.id)
                return;



            const yaExiste =

                a.compañeros.includes(b.id)
                ||
                a.rivales.includes(b.id);



            if(!yaExiste){

                nuevasRelaciones++;

            }


        });


    });



    // máximo 12 relaciones nuevas

    return Math.min(
        nuevasRelaciones / 12,
        1
    );

}



// =====================================================
// SCORE GLOBAL DE UNA PARTIDA
// =====================================================

function recommendScore(
    equipoA,
    equipoB
){


    const jugadores =
    [
        ...equipoA,
        ...equipoB
    ];



    // ---------------------
    // 65% NECESIDAD
    // ---------------------

    let necesidad = 0;


    jugadores.forEach(j=>{

        necesidad +=
        playerNeed(j);

    });


    necesidad /=
    jugadores.length;



    // ---------------------
    // COMPONENTES
    // ---------------------

    const compañeros =
        (
            companionDiversity(equipoA)
            +
            companionDiversity(equipoB)
        )
        /2;



    const rivales =
        rivalDiversity(
            equipoA,
            equipoB
        );



    const elo =
        eloBalance(
            equipoA,
            equipoB
        );



    const diversidad =
        diversityGain(
            equipoA,
            equipoB
        );



    return (

        0.65 * necesidad

        +

        0.10 * compañeros

        +

        0.10 * rivales

        +

        0.10 * elo

        +

        0.05 * diversidad

    );

}



// =====================================================
// GENERAR TODAS LAS PARTIDAS POSIBLES
// =====================================================

function generatePossibleMatches(players){


    let matches=[];



    for(let i=0;i<players.length;i++){

        for(let j=i+1;j<players.length;j++){


            const parejaA =
            [
                players[i],
                players[j]
            ];



            const restantes =
                players.filter(
                    p =>
                    !parejaA.includes(p)
                );



            for(let k=0;k<restantes.length;k++){


                for(let l=k+1;l<restantes.length;l++){


                    const parejaB =
                    [
                        restantes[k],
                        restantes[l]
                    ];



                    matches.push({

                        equipoA:parejaA,

                        equipoB:parejaB,

                        jugadores:
                        [
                            ...parejaA,
                            ...parejaB
                        ],

                        score:
                        recommendScore(
                            parejaA,
                            parejaB
                        )

                    });


                }

            }


        }

    }



    return matches;

}



// =====================================================
// RECOMENDADOR PRINCIPAL
// =====================================================

function recommendMatches(players){


    if(players.length < 4)
        return [];



    let posibles =
        generatePossibleMatches(players);



    posibles.sort(
        (a,b)=>
        b.score-a.score
    );



    let seleccionadas=[];

    let usados=[];



    posibles.forEach(partida=>{


        const conflicto =
            partida.jugadores.some(
                j =>
                usados.includes(j.id)
            );



        if(!conflicto){

            seleccionadas.push(partida);



            partida.jugadores.forEach(j=>{

                usados.push(j.id);

            });

        }


    });



    return seleccionadas;

}