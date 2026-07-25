function recomendarPartidas(jugadores){

    let candidatos = [...jugadores];


    if(candidatos.length < 4){

        return [];

    }


    // Mezclar candidatos
    candidatos.sort(
        ()=>Math.random()-0.5
    );


    let partidas=[];


    while(candidatos.length >=4){


        const grupo =
        candidatos.splice(0,4);


        partidas.push({

            equipoA:[
                grupo[0],
                grupo[1]
            ],

            equipoB:[
                grupo[2],
                grupo[3]
            ]

        });


    }


    return partidas;

}