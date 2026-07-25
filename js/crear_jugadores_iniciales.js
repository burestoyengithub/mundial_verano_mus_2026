const jugadoresIniciales = [
    "Bures",
    "Ana",
    "Bruno",
    "Jacobo",
    "Javi",
    "Helen",
    "Lucia",
    "Marta",
    "Pablo",
    "Pepa",
    "Sara",
    "Sarana"
];


async function crearJugadoresIniciales(){

    const coleccion = db.collection("players");


    for(const nombre of jugadoresIniciales){

        await coleccion.add({

            nombre: nombre,

            elo: 1000,

            partidas: 0,

            compañeros: [],

            rivales: [],

            creado: firebase.firestore.FieldValue.serverTimestamp()

        });


        console.log("Creado:", nombre);

    }


    console.log("Jugadores creados correctamente");

}


crearJugadoresIniciales();