function recommendScore(
    equipoA,
    equipoB
){

    const jugadores =
    [
        ...equipoA,
        ...equipoB
    ];


    // =====================
    // 70% NECESIDAD
    // =====================

    let necesidad = 0;


    jugadores.forEach(j=>{

        necesidad +=
        Math.min(
            1,
            j.partidas / 20
        );

    });


    necesidad =
    1 -
    necesidad / jugadores.length;



    // =====================
    // 10% DIVERSIDAD COMPAÑEROS
    // =====================

    let diversidadComp = 0;


    jugadores.forEach(j=>{

        diversidadComp +=
        (j.compañeros.length / 11);

    });


    diversidadComp /=
    jugadores.length;



    // =====================
    // 10% DIVERSIDAD RIVALES
    // =====================

    let diversidadRiv = 0;


    jugadores.forEach(j=>{

        diversidadRiv +=
        (j.rivales.length / 11);

    });


    diversidadRiv /=
    jugadores.length;



    // =====================
    // 10% EQUILIBRIO ELO
    // =====================


    const eloA =
    equipoA[0].elo +
    equipoA[1].elo;


    const eloB =
    equipoB[0].elo +
    equipoB[1].elo;


    const diferencia =
    Math.abs(
        eloA-eloB
    );


    const diversidadElo =
    1 -
    Math.min(
        diferencia/400,
        1
    );



    return (

        0.7*necesidad +

        0.1*diversidadComp +

        0.1*diversidadRiv +

        0.1*diversidadElo

    );

}




function recommendMatches(players){


    if(players.length < 4)
        return [];



    let mejores = [];



    // Generamos todas las combinaciones
    // posibles de equipos


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



            for(
                let k=0;
                k<restantes.length;
                k++
            ){

                for(
                    let l=k+1;
                    l<restantes.length;
                    l++
                ){


                    const parejaB =
                    [
                        restantes[k],
                        restantes[l]
                    ];



                    const score =
                    recommendScore(
                        parejaA,
                        parejaB
                    );



                    mejores.push({

                        equipoA:parejaA,

                        equipoB:parejaB,

                        score:score

                    });


                }
            }
        }
    }



    mejores.sort(
    (a,b)=>
    b.score-a.score
);


// Número de partidas necesarias

let numeroPartidas = 0;


if(players.length >= 4){

    numeroPartidas = 
    Math.floor(players.length / 4);

}


// máximo 3 partidas (12 jugadores)

numeroPartidas = Math.min(
    numeroPartidas,
    3
);


return mejores.slice(
    0,
    numeroPartidas
);
}