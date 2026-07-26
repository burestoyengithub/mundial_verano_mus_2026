console.log("partidas.js cargado correctamente");

const selectsPartida = [
    document.getElementById("jugadorA1"),
    document.getElementById("jugadorA2"),
    document.getElementById("jugadorB1"),
    document.getElementById("jugadorB2")
];


let jugadoresDisponibles = [];


// ==============================
// CARGAR JUGADORES
// ==============================

db.collection("players")
.orderBy("nombre")
.onSnapshot(snapshot => {


    jugadoresDisponibles = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre
    }));


    actualizarSelectores();


});



// ==============================
// RELLENAR SELECTORES
// ==============================

function actualizarSelectores(){


    selectsPartida.forEach(select => {


        select.innerHTML =
        `<option value="">
        Seleccionar jugador
        </option>`;


        jugadoresDisponibles.forEach(jugador=>{


            const option =
            document.createElement("option");


            option.value = jugador.id;

            option.textContent =
            jugador.nombre;


            select.appendChild(option);


        });


    });


}

// ==============================
// ACTUALIZAR ELO
// ==============================

async function actualizarEloPartida(
    equipoA,
    equipoB,
    ganador
){

    const jugadoresIds =
    [
        ...equipoA,
        ...equipoB
    ];


    const datosJugadores = {};


    for(const id of jugadoresIds){

        const doc =
        await db.collection("players")
        .doc(id)
        .get();


        datosJugadores[id]={
            id:id,
            ...doc.data()
        };

    }



    const jugadoresA =
    equipoA.map(
        id=>datosJugadores[id]
    );


    const jugadoresB =
    equipoB.map(
        id=>datosJugadores[id]
    );



    const eloA =
    getTeamElo(jugadoresA);


    const eloB =
    getTeamElo(jugadoresB);



    const esperadoA =
    expectedScore(
        eloA,
        eloB
    );


    const esperadoB =
    expectedScore(
        eloB,
        eloA
    );



    const batch =
    db.batch();



    if(ganador==="A"){


        equipoA.forEach(id=>{


            const ref =
            db.collection("players")
            .doc(id);


            batch.update(ref,{

                elo:
                (datosJugadores[id].elo || 1000)
                +
                eloChange(
                    datosJugadores[id].elo || 1000,
                    esperadoA,
                    1
                )

            });


        });



        equipoB.forEach(id=>{


            const ref =
            db.collection("players")
            .doc(id);


            batch.update(ref,{

                elo:
                (datosJugadores[id].elo || 1000)
                +
                eloChange(
                    datosJugadores[id].elo || 1000,
                    esperadoB,
                    0
                )

            });


        });


    }
    else{


        equipoB.forEach(id=>{


            const ref =
            db.collection("players")
            .doc(id);


            batch.update(ref,{

                elo:
                (datosJugadores[id].elo || 1000)
                +
                eloChange(
                    datosJugadores[id].elo || 1000,
                    esperadoB,
                    1
                )

            });


        });



        equipoA.forEach(id=>{


            const ref =
            db.collection("players")
            .doc(id);


            batch.update(ref,{

                elo:
                (datosJugadores[id].elo || 1000)
                +
                eloChange(
                    datosJugadores[id].elo || 1000,
                    esperadoA,
                    0
                )

            });


        });


    }



    await batch.commit();

}

// ==============================
// GUARDAR PARTIDA
// ==============================


document
.getElementById("guardarPartida")
.addEventListener("click", async ()=>{


    const equipoA = [
        selectsPartida[0].value,
        selectsPartida[1].value
    ];


    const equipoB = [
        selectsPartida[2].value,
        selectsPartida[3].value
    ];



    if(
        equipoA.includes("") ||
        equipoB.includes("")
    ){

        alert("Selecciona los 4 jugadores");

        return;

    }



    const jugadores =
    [...equipoA,...equipoB];


    if(new Set(jugadores).size !== 4){

        alert("Un jugador no puede repetirse");

        return;

    }



    const ganador =
    document.querySelector(
        'input[name="ganador"]:checked'
    );


    if(!ganador){

        alert("Selecciona el ganador");

        return;

    }



    await db.collection("matches").add({

    fecha:
    firebase.firestore.FieldValue.serverTimestamp(),

    equipoA: equipoA,

    equipoB: equipoB,

    ganador:
    ganador.value

});

await recalculateTournament();

async function actualizarEstadisticasPartida(equipoA, equipoB){


    const batch = db.batch();


    // Equipo A
    for(const jugadorId of equipoA){


        const ref =
        db.collection("players").doc(jugadorId);


        const doc =
        await ref.get();


        const datos = doc.data();


        const nuevosCompaneros =
        new Set(datos.compañeros || []);


        const nuevosRivales =
        new Set(datos.rivales || []);



        // compañero
        equipoA.forEach(id=>{

            if(id !== jugadorId){
                nuevosCompaneros.add(id);
            }

        });



        // rivales
        equipoB.forEach(id=>{

            nuevosRivales.add(id);

        });



        batch.update(ref,{

            partidas:
            (datos.partidas || 0)+1,


            compañeros:
            Array.from(nuevosCompaneros),


            rivales:
            Array.from(nuevosRivales)

        });


    }



    // Equipo B
    for(const jugadorId of equipoB){


        const ref =
        db.collection("players").doc(jugadorId);


        const doc =
        await ref.get();


        const datos = doc.data();


        const nuevosCompaneros =
        new Set(datos.compañeros || []);


        const nuevosRivales =
        new Set(datos.rivales || []);



        equipoB.forEach(id=>{

            if(id !== jugadorId){
                nuevosCompaneros.add(id);
            }

        });



        equipoA.forEach(id=>{

            nuevosRivales.add(id);

        });



        batch.update(ref,{

            partidas:
            (datos.partidas || 0)+1,


            compañeros:
            Array.from(nuevosCompaneros),


            rivales:
            Array.from(nuevosRivales)

        });


    }


    await batch.commit();

}

    alert("Partida guardada");


});