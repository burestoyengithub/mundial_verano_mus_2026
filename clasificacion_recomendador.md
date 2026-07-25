# Sistema de clasificación y recomendador de partidas

## 1. Objetivo general

El torneo utiliza dos sistemas independientes:

1. **Sistema de clasificación basado en Elo**
   - Determina el nivel competitivo individual de cada jugador.
   - Se actualiza después de cada partida.
   - Es la métrica principal de rendimiento.

2. **Sistema recomendador de partidas**
   - Sugiere agrupaciones de jugadores para maximizar el beneficio global del torneo.
   - No obliga a jugar las partidas propuestas.
   - Busca favorecer la participación, diversidad y equilibrio.

La filosofía general del sistema es:

> El Elo mide rendimiento.  
> El recomendador mejora la calidad de la competición.  
> La diversidad actúa únicamente como criterio secundario.

---

# 2. Sistema de clasificación Elo

## 2.1. Conceptos generales

Cada jugador dispone de un Elo individual.

Características:

- Todos los jugadores empiezan con el mismo Elo inicial.
- El Elo se actualiza después de cada partida.
- Todas las partidas tienen exactamente el mismo valor.
- El factor K permanece constante durante todo el torneo.

Ejemplo:

```
Elo inicial = 1000
K = 32
```

---

# 2.2. Cálculo del resultado esperado

Aunque el Elo sea individual, las partidas se juegan por parejas.

Para calcular la probabilidad de victoria se utiliza el Elo medio de cada pareja.

Ejemplo:

Pareja A:

```
Jugador 1: 1500
Jugador 2: 1600
```

Elo medio:

\[
R_A=\frac{1500+1600}{2}=1550
\]


Pareja B:

```
Jugador 3: 1400
Jugador 4: 1500
```

Elo medio:

\[
R_B=\frac{1400+1500}{2}=1450
\]


---

La probabilidad esperada de victoria de una pareja es:

\[
E_A=
\frac{1}
{1+10^{(R_B-R_A)/400}}
\]


y para la pareja B:

\[
E_B=1-E_A
\]

---

# 2.3. Actualización del Elo

La fórmula utilizada es:

\[
ELO_{nuevo}=ELO_{actual}+K(S-E)
\]


donde:

- `K` es el factor constante del torneo.
- `S` es el resultado real.
- `E` es el resultado esperado.


Resultados:

Victoria:

\[
S=1
\]


Derrota:

\[
S=0
\]


---

Ejemplo:

Pareja A:

```
Elo esperado: 0.65
```

Gana la partida.

Con:

```
K = 32
```

Cambio:

\[
32(1-0.65)=11.2
\]


Cada jugador de la pareja ganadora recibe:

```
+11 Elo
```

Cada jugador de la pareja perdedora recibe:

```
-11 Elo
```

---

# 3. Índice de diversidad

La diversidad no modifica los resultados de las partidas ni el Elo durante la fase clasificatoria.

Su única función es añadir una pequeña bonificación al finalizar la fase clasificatoria.

El objetivo es premiar jugadores que han demostrado rendimiento jugando con diferentes personas.

---

# 3.1. Diversidad de compañeros

Cada jugador puede tener como máximo:

\[
11
\]

compañeros diferentes.


Se define:

\[
D_c=\frac{N_{comp}}{11}
\]


donde:

- \(N_{comp}\) es el número de compañeros distintos utilizados.
- \(D_c\) es la diversidad de compañeros.

Ejemplo:

Un jugador ha jugado con 9 personas diferentes:

\[
D_c=\frac{9}{11}=0.82
\]


---

# 3.2. Diversidad de rivales

Cada jugador puede enfrentarse como máximo a:

\[
11
\]

rivales diferentes.


Se define:

\[
D_r=\frac{N_{riv}}{11}
\]


donde:

- \(N_{riv}\) es el número de rivales distintos.
- \(D_r\) es la diversidad de rivales.

---

# 3.3. Índice global de diversidad

El índice final es:

\[
\boxed{
D=\frac{D_c+D_r}{2}
}
\]


Por tanto:

\[
0\leq D\leq1
\]


Interpretación:

| Índice | Interpretación |
|-|-|
|1.00|Máxima diversidad|
|0.75|Alta diversidad|
|0.50|Diversidad media|
|<0.50|Baja diversidad|

---

# 4. Clasificación final

Durante la fase clasificatoria:

- La clasificación permanece oculta.
- El Elo se actualiza internamente.
- La diversidad no afecta al ranking.

Al finalizar la fase:

1. Se eliminan jugadores que no hayan alcanzado el mínimo de partidas.

Requisito:

\[
partidas \geq 20
\]


2. Se calcula la puntuación final.


La fórmula es:

\[
\boxed{
ELO_{final}
=
ELO_{partidas}
+
10(D-0.8)
}
\]


donde:

- \(ELO_{partidas}\) es el Elo obtenido exclusivamente mediante resultados.
- \(D\) es el índice de diversidad.


---

Ejemplos:

Jugador con:

\[
D=1
\]


Obtiene:

\[
10(1-0.8)=+2
\]


Jugador con:

\[
D=0.8
\]


Obtiene:

\[
0
\]


Jugador con:

\[
D=0.5
\]


Obtiene:

\[
-3
\]


La bonificación es deliberadamente pequeña.

Su objetivo es únicamente resolver empates o situaciones muy igualadas.

---

# 5. Sistema recomendador de partidas

## 5.1. Objetivo

El recomendador recibe un conjunto de jugadores disponibles y genera una o varias partidas recomendadas.

Su objetivo es maximizar el beneficio global del torneo.

No busca únicamente crear la partida más equilibrada, sino mejorar:

- participación;
- diversidad;
- progreso hacia las 20 partidas;
- calidad competitiva.


---

# 5.2. Entrada

Función:

```javascript
recommendMatches(players)
```


Entrada:

```javascript
[
 jugador1,
 jugador2,
 jugador3,
 ...
]
```


Puede recibir cualquier número de jugadores disponibles.

---

# 5.3. Salida

El sistema devuelve una o varias partidas:

Ejemplo:

```javascript
[
{
 teamA:[
    jugador1,
    jugador2
 ],

 teamB:[
    jugador3,	
    jugador4
 ],

 resting:[
    jugador5
 ]
}
]
```

---

# 6. Función de puntuación del recomendador

Cada posible combinación recibe una puntuación:

\[
\boxed{
Score=
0.65P+
0.10C+
0.10R+
0.10E+
0.05D
}
\]


---

## 6.1. Necesidad de partidas (65%)

Es el factor principal.

Busca favorecer jugadores que todavía no han alcanzado las 20 partidas.

Para cada jugador:

\[
Necesidad=
\frac{20-partidas}{20}
\]


Los valores se limitan entre 0 y 1.

Una partida obtiene mayor puntuación si incluye jugadores con pocas partidas disputadas.

---

# 6.2. Diversidad de compañeros (10%)

Premia formar parejas que no se hayan repetido muchas veces.

Una pareja nueva obtiene mayor puntuación.

Una pareja muy utilizada obtiene una pequeña penalización.

---

# 6.3. Diversidad de rivales (10%)

Premia enfrentamientos entre jugadores que todavía no se han enfrentado mucho.

Busca evitar que siempre jueguen los mismos grupos.

---

# 6.4. Equilibrio Elo (10%)

Busca evitar partidas demasiado desequilibradas.

Se calcula comparando el Elo medio de ambas parejas.

La penalización es suave.

El Elo nunca debe dominar al resto de factores.

---

# 6.5. Mejora de diversidad (5%)

Mide cuánto aumenta la diversidad global de los jugadores si se realiza esa partida.

Se valora:

- nuevos compañeros;
- nuevos rivales;
- nuevas combinaciones.


---

# 7. Optimización global

El recomendador no busca la mejor partida individual.

Busca la mejor combinación de partidas.


Ejemplo:

Opción A:

```
Partida 1: Score 95
Partida 2: Score 50

Total: 145
```


Opción B:

```
Partida 1: Score 82
Partida 2: Score 80

Total: 162
```


Se selecciona la opción B.

---

# 8. Principios del sistema

El diseño sigue las siguientes reglas:

1. Llegar a las 20 partidas es la prioridad absoluta.
2. El Elo mide rendimiento, no participación.
3. La diversidad nunca debe dominar la clasificación.
4. El recomendador solo sugiere.
5. Los jugadores mantienen libertad para aceptar o rechazar partidas.
6. Las partidas nuevas y variadas son incentivadas, pero no obligatorias.