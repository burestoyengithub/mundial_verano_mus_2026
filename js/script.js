// script.js


const nombreInput = document.getElementById(
    "nombreJugador"
);

const boton = document.getElementById(
    "btnJugador"
);

const lista = document.getElementById(
    "listaJugadores"
);



// Añadir jugador

boton.addEventListener(
"click",
async()=>{


    const nombre =
        nombreInput.value.trim();


    if(!nombre){
        alert("Introduce un nombre");
        return;
    }


    await db.collection("players").add({

        nombre: nombre,

        elo:1000,

        partidas:0,

        activo:true

    });


    nombreInput.value="";

});




// Mostrar jugadores en tiempo real

db.collection("players")
.onSnapshot(snapshot=>{


    lista.innerHTML="";


    snapshot.forEach(doc=>{


        const jugador = doc.data();


        const li=document.createElement("li");


        li.textContent =
            jugador.nombre +
            " - Elo: " +
            jugador.elo;


        lista.appendChild(li);


    });


});