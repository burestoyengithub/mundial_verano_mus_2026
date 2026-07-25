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



    alert("Partida guardada");


});