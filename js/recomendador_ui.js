const listaRecomendador =
document.getElementById("lista-recomendador");


const resultadoRecomendador =
document.getElementById("resultado-recomendador");


let jugadoresRecomendador = [];


// Cargar jugadores

db.collection("players")
.orderBy("nombre")
.onSnapshot(snapshot=>{


    jugadoresRecomendador =
    snapshot.docs.map(doc=>({

        id:doc.id,

        nombre:doc.data().nombre,

        partidas:doc.data().partidas || 0

    }));


    mostrarJugadores();


});




// Pintar checkboxes

function mostrarJugadores(){


    listaRecomendador.innerHTML="";


    jugadoresRecomendador.forEach(j=>{


        listaRecomendador.innerHTML += `

        <label>

        <input 
        type="checkbox"
        class="jugador-recomendador"
        value="${j.id}">

        ${j.nombre}
        (${j.partidas}/20)

        </label>

        <br>

        `;


    });


}



// Botón recomendar

document
.getElementById("generar-recomendacion")
.addEventListener("click",()=>{


    const seleccionados =
    Array.from(
        document.querySelectorAll(
        ".jugador-recomendador:checked"
        )
    )
    .map(x=>x.value);



    const recomendaciones =
    recomendarPartidas(
        seleccionados
    );


    mostrarResultado(
        recomendaciones
    );


});




// Mostrar resultado

function mostrarResultado(partidas){


    resultadoRecomendador.innerHTML="";


    if(partidas.length===0){

        resultadoRecomendador.innerHTML =
        "No hay suficientes jugadores";

        return;

    }



    partidas.forEach((p,index)=>{


        resultadoRecomendador.innerHTML += `

        <div>

        <h4>
        Partida ${index+1}
        </h4>


        <p>
        ${p.equipoA.join(" + ")}
        <br>
        VS
        <br>
        ${p.equipoB.join(" + ")}

        </p>


        </div>

        `;


    });


}