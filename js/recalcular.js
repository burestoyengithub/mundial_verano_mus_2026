console.log("recalcular.js cargado correctamente");

async function recalculateTournament(){

    // ============================
    // CARGAR JUGADORES
    // ============================

    const snapshotPlayers =
    await db.collection("players").get();

    const jugadores = {};

    snapshotPlayers.forEach(doc=>{

        const datos = doc.data();

        jugadores[doc.id]={

            id:doc.id,

            nombre:datos.nombre,

            elo:1000,

            partidas:0,

            compañeros:[],

            rivales:[]

        };

    });



    // ============================
    // LEER PARTIDAS
    // ============================

    const snapshotMatches =
    await db
    .collection("matches")
    .orderBy("fecha")
    .get();



    snapshotMatches.forEach(match=>{

        const datos =
        match.data();


        const equipoA =
        datos.equipoA.map(
            id=>jugadores[id]
        );


        const equipoB =
        datos.equipoB.map(
            id=>jugadores[id]
        );



        // ------------------------
        // Partidas
        // ------------------------

        [...equipoA,...equipoB]
        .forEach(j=>{

            j.partidas++;

        });



        // ------------------------
        // Compañeros
        // ------------------------

        equipoA.forEach(j=>{

            equipoA.forEach(c=>{

                if(
                    c.id!==j.id &&
                    !j.compañeros.includes(c.id)
                ){

                    j.compañeros.push(c.id);

                }

            });

        });



        equipoB.forEach(j=>{

            equipoB.forEach(c=>{

                if(
                    c.id!==j.id &&
                    !j.compañeros.includes(c.id)
                ){

                    j.compañeros.push(c.id);

                }

            });

        });



        // ------------------------
        // Rivales
        // ------------------------

        equipoA.forEach(j=>{

            equipoB.forEach(r=>{

                if(
                    !j.rivales.includes(r.id)
                ){

                    j.rivales.push(r.id);

                }

            });

        });



        equipoB.forEach(j=>{

            equipoA.forEach(r=>{

                if(
                    !j.rivales.includes(r.id)
                ){

                    j.rivales.push(r.id);

                }

            });

        });



        // ------------------------
        // ELO
        // ------------------------

        applyElo(
            equipoA,
            equipoB,
            datos.ganador
        );

    });



    // ============================
    // GUARDAR FIRESTORE
    // ============================

    const batch =
    db.batch();

    Object.values(jugadores)
    .forEach(j=>{

        const ref =
        db.collection("players")
        .doc(j.id);

        batch.update(ref,{

            elo:j.elo,

            partidas:j.partidas,

            compañeros:j.compañeros,

            rivales:j.rivales

        });

    });

    await batch.commit();

    console.log(
        "Torneo recalculado correctamente"
    );

}