const tablaProgreso =
document.getElementById(
    "progreso-jugadores"
);


const totalPartidas =
document.getElementById(
    "total-partidas"
);


const jugadoresCompletados =
document.getElementById(
    "jugadores-completados"
);



// Partidas totales

db.collection("matches")
.onSnapshot(snapshot=>{


    totalPartidas.textContent =
    snapshot.size;


});




// Progreso jugadores

db.collection("players")
.orderBy("nombre")
.onSnapshot(snapshot=>{


    tablaProgreso.innerHTML="";


    let completados = 0;


    snapshot.forEach(doc=>{


        const jugador =
        doc.data();



        if(jugador.partidas >= 20){

            completados++;

        }



        const fila =
        document.createElement("tr");


        fila.innerHTML = `

        <td>
        ${jugador.nombre}
        </td>


        <td>
        ${jugador.partidas} / 20
        </td>

        `;


        tablaProgreso.appendChild(fila);


    });



    jugadoresCompletados.textContent =
    completados;


});