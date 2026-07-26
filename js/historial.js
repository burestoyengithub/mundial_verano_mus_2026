console.log("historial.js cargado correctamente");

let nombresJugadores = {};


// ======================================
// CARGAR NOMBRES DE JUGADORES
// ======================================

db.collection("players")
.onSnapshot(snapshot=>{

    nombresJugadores = {};

    snapshot.forEach(doc=>{

        nombresJugadores[doc.id] =
        doc.data().nombre;

    });

});



// ======================================
// HISTORIAL ÚLTIMAS 5 PARTIDAS
// ======================================

db.collection("matches")
.orderBy("fecha","desc")
.limit(5)
.onSnapshot(renderizarHistorial);



// ======================================
// RENDERIZAR
// ======================================

async function renderizarHistorial(snapshot){

    const contenedor =
    document.getElementById("ultimas-partidas");


    contenedor.innerHTML = "";


    if(snapshot.empty){

        contenedor.innerHTML =
        "<p>No hay partidas registradas.</p>";

        return;

    }


    snapshot.forEach(doc=>{

        const partida =
        doc.data();


        const equipoA =
        partida.equipoA
        .map(id=>nombresJugadores[id] || id)
        .join(" + ");


        const equipoB =
        partida.equipoB
        .map(id=>nombresJugadores[id] || id)
        .join(" + ");


        const fecha = partida.fecha
        ? partida.fecha.toDate().toLocaleString("es-ES")
        : "";


        const div =
        document.createElement("div");


        div.className =
        "partida-card";


        div.innerHTML =

        `
        <p><strong>${fecha}</strong></p>

        <p>
        ${equipoA}
        </p>

        <p><strong>VS</strong></p>

        <p>
        ${equipoB}
        </p>

        <p>
        Ganador:
        <strong>
        Pareja ${partida.ganador}
        </strong>
        </p>

        <button onclick="cambiarGanador('${doc.id}')">
            Cambiar ganador
        </button>

        <button onclick="eliminarPartida('${doc.id}')">
            Eliminar partida
        </button>

        <hr>
        `;


        contenedor.appendChild(div);

    });

}




// ======================================
// ELIMINAR PARTIDA
// ======================================

async function eliminarPartida(id){

    if(
        !confirm(
            "¿Eliminar esta partida?"
        )
    ){
        return;
    }


    await db
    .collection("matches")
    .doc(id)
    .delete();


    await recalculateTournament();

}




// ======================================
// CAMBIAR GANADOR
// ======================================

async function cambiarGanador(id){

    const ref =
    db.collection("matches")
    .doc(id);


    const doc =
    await ref.get();


    const ganadorActual =
    doc.data().ganador;


    const nuevoGanador =
    ganadorActual === "A"
    ? "B"
    : "A";


    await ref.update({

        ganador:
        nuevoGanador

    });


    await recalculateTournament();

}