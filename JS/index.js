// Arreglo para almacenar los alumnos
const alumnos = [];

document.addEventListener("DOMContentLoaded", function() {
    const opcionFormulario = document.getElementById("seccionFormulario");
    const opcionListado = document.getElementById("seccionDatos");
    const formulario = document.getElementById("formulario");
    const listaAlumnos = document.getElementById("listaAlumnos");
    const agregarBoton = document.getElementById("agregar");
    const recargarBoton = document.getElementById("recargar");
    const buscarButton = document.getElementById("buscar");
    const busquedaInput = document.getElementById("busqueda");

    listaAlumnos.style.display = "none";
    busquedaInput.style.display = "none";
    buscarButton.style.display = "none";

    

    opcionFormulario.addEventListener("click", function() {
        formulario.style.display = "block";
        listaAlumnos.style.display = "none";
        busquedaInput.style.display = "none";
        buscarButton.style.display = "none";
        mostrarListaAlumnos();
    });

    opcionListado.addEventListener("click", function() {
        formulario.style.display = "none";
        listaAlumnos.style.display = "flex";
        busquedaInput.style.display = "flex";
        buscarButton.style.display = "flex";
        mostrarListaAlumnos();
    });

    agregarBoton.addEventListener("click", function() {
        const rut = document.getElementById("rut").value;
        const nombre = document.getElementById("nombre").value;
        const grupo = document.getElementById("grupo").value;
        const edad = parseInt(document.getElementById("edad").value);
        const materia1 = document.getElementById("materia1").value;
        const materia2 = document.getElementById("materia2").value;
        const materia3 = document.getElementById("materia3").value;
        const materia4 = document.getElementById("materia4").value;

        // Crear un objeto con las calificaciones para cada materia
        const calificaciones = {
            materia1: [0, 0, 0, 0],
            materia2: [0, 0, 0, 0],
            materia3: [0, 0, 0, 0],
            materia4: [0, 0, 0, 0]
        };

        const alumno = {
            rut: rut,
            nombre: nombre,
            edad: edad,
            materiasInscrito: [materia1, materia2, materia3, materia4],
            calificaciones: calificaciones,
            grupo: grupo,
        };

        if (rut === "" || nombre === "" || isNaN(edad)) {
            alert("Campos incompletos. Por favor, complete los campos de rut, nombre y edad.");
            return;
        }

        alumnos.push(alumno);

        alert("Alumno agregado exitosamente");
        // Limpiar con reset el formulario después de agregar
        document.getElementById("miFormulario").reset();
    });

    buscarButton.addEventListener("click", function() {
        const filtro = busquedaInput.value.toLowerCase();
    
        const alumnosFiltrados = alumnos.filter(function(alumno) {
            const nombreApellidoGrupo = `${alumno.nombre} ${alumno.grupo}`.toLowerCase();
            return nombreApellidoGrupo.includes(filtro);
        });
    
        mostrarAlumnosFiltrados(alumnosFiltrados);
    });

    recargarBoton.addEventListener("click", function() {
        mostrarListaAlumnosAside();
    })

    function mostrarListaAlumnos() {
        const lista = document.getElementById("listita");
        lista.innerHTML = "";
        for (const alumno of alumnos) {
            const promedio = calcularPromedioCalificaciones(alumno);
            const listItem = document.createElement("li");
            listItem.classList.add("listadoItem");

            // Crear un div para mostrar la información del alumno
            const infoDiv = document.createElement("div");
            infoDiv.innerHTML = `
                <strong>RUT:</strong> ${alumno.rut}<br>
                <strong>Nombre:</strong> ${alumno.nombre}<br>
                <strong>Edad:</strong> ${alumno.edad}<br>
                <strong>Grupo:</strong> ${alumno.grupo}<br>
                <strong>Materias:</strong> ${alumno.materiasInscrito.join("-")}<br><br>
                <strong>Calificaciones:</strong><br>
            `;

            // Agregar las calificaciones para cada materia
            for (const materia in alumno.calificaciones) {
                const notas = alumno.calificaciones[materia].join("-");
                infoDiv.innerHTML += `<strong>${materia}:</strong> ${notas}<br>`;
            }
            
            infoDiv.innerHTML += `<br><strong>Promedio:</strong> ${promedio.toFixed(2)}<br><br>`;

    
            // Crear un botón para editar
            const editarButton = document.createElement("button");
            editarButton.textContent = "Editar";
            editarButton.id = "botonEditar";
            

            // Agregar evento de clic al botón "Editar"
            editarButton.addEventListener("click", function() {
                // Ocultar la información del alumno
                infoDiv.style.display = "none";
                editarButton.style.display = "none";

                // Crear un formulario para editar los detalles
                const editarForm = document.createElement("form");
                const promedio = calcularPromedioCalificaciones(alumno);
                editarForm.id = "miFormulario2"; // Asigna un id al formulario
                editarForm.innerHTML = `
                    RUT: <input type="text" id="rut" value="${alumno.rut}"><br>
                    Nombre: <input type="text" id="nombre" value="${alumno.nombre}"><br>
                    Edad: <input type="number" id="edad" value="${alumno.edad}"><br>
                    Grupo: <input type="text" id="grupo" value="${alumno.grupo}"><br>
                    <div class="valores">
                    <label for="materias" class="form-label">Materias Inscrito:</label>
                    ${alumno.materiasInscrito.map(materia => `
                        <input type="text" class="etiquetaMaterias" value="${materia}">
                    `).join('')}
                    </div>
                    <div class="valores">
                    <label for="calificaciones" class="form-label">Calificaciones (son 4 calificaciones por materia):</label>
                    ${Object.keys(alumno.calificaciones).map(materia => `
                        ${alumno.calificaciones[materia].map((nota, index) => `
                            <input type="number" class="etiquetaNotas" id="${materia}-nota${index + 1}" value="${nota}" min="0" max="9">
                        `).join('')}
                    `).join('')}
                    </div>
                    Promedio: ${promedio.toFixed(2)}<br><br>
                    <button id="guardar" type="button">Guardar</button>`;

                    

                // Agregar evento de clic al botón "Guardar"
                const guardarButton = editarForm.querySelector("#guardar");
                guardarButton.addEventListener("click", function() {

                    editarButton.style.display = "block";

                    // Actualizar los detalles del alumno con los nuevos valores del formulario
                    alumno.rut = editarForm.querySelector("#rut").value;
                    alumno.nombre = editarForm.querySelector("#nombre").value;
                    alumno.edad = parseInt(editarForm.querySelector("#edad").value);
                    alumno.grupo = editarForm.querySelector("#grupo").value;
                    // Actualizar las calificaciones para cada materia
                    for (const materia in alumno.calificaciones) {
                        for (let i = 1; i <= 4; i++) {
                            const notaInput = editarForm.querySelector(`#${materia}-nota${i}`);
                            alumno.calificaciones[materia][i - 1] = parseInt(notaInput.value);
                        }
                    }
                    // Actualizar el array de materiasInscrito con los nuevos valores del formulario
                    const inputsMaterias = editarForm.querySelectorAll(".etiquetaMaterias");
                    alumno.materiasInscrito = Array.from(inputsMaterias).map(input => input.value);

                    // Mostrar nuevamente la información del alumno con los cambios guardados
                    infoDiv.style.display = "block";
                    mostrarListaAlumnos();

                    // Eliminar el formulario de edición
                    editarForm.remove();
                });
    
                // Agregar el formulario al elemento listItem
                listItem.appendChild(editarForm);
            });
    
            // Agregar el div con la información y el botón de edición al listItem
            listItem.appendChild(infoDiv);
            listItem.appendChild(editarButton);
    
            lista.appendChild(listItem);
        }
    }

    function calcularPromedioCalificaciones(alumno) {
        let totalCalificaciones = 0;
        let totalMaterias = 0;
    
        for (const materia in alumno.calificaciones) {
            const notas = alumno.calificaciones[materia];
            for (const nota of notas) {
                totalCalificaciones += nota;
                totalMaterias++;
            }
        }
    
        return totalMaterias > 0 ? totalCalificaciones / totalMaterias : 0;
    }

    function mostrarAlumnosFiltrados(alumnosFiltrados) {
        const lista = document.getElementById("listita");
        lista.innerHTML = "";
    
        for (const alumno of alumnosFiltrados) {
            const promedio = calcularPromedioCalificaciones(alumno);
            const listItem = document.createElement("li");
            listItem.classList.add("listadoItem");
    
            // Crear un div para mostrar la información del alumno
            const infoDiv = document.createElement("div");
            infoDiv.innerHTML = `
                <strong>RUT:</strong> ${alumno.rut}<br>
                <strong>Nombre:</strong> ${alumno.nombre}<br>
                <strong>Edad:</strong> ${alumno.edad}<br>
                <strong>Grupo:</strong> ${alumno.grupo}<br>
                <strong>Materias:</strong> ${alumno.materiasInscrito.join("-")}<br><br>
                <strong>Calificaciones:</strong><br>
            `;
            // Agregar las calificaciones para cada materia
            for (const materia in alumno.calificaciones) {
                const notas = alumno.calificaciones[materia].join("-");
                infoDiv.innerHTML += `<strong>${materia}:</strong> ${notas}<br>`;
            }
            
            infoDiv.innerHTML += `<br><strong>Promedio:</strong> ${promedio.toFixed(2)}<br><br>`;
    
            // Crear un botón para editar
            const editarButton = document.createElement("button");
            editarButton.textContent = "Editar";
            editarButton.id = "botonEditar";
    
            // Agregar evento de clic al botón "Editar"
            editarButton.addEventListener("click", function() {
                // Ocultar la información del alumno
                infoDiv.style.display = "none";
    
                // Crear un formulario para editar los detalles (código que ya tienes)
    
                // ...
    
                // Agregar el formulario al elemento listItem
                listItem.appendChild(editarForm);
            });
    
            // Agregar el div con la información y el botón de edición al listItem
            listItem.appendChild(infoDiv);
            listItem.appendChild(editarButton);
    
            lista.appendChild(listItem);
        }
    }
    
    function mostrarListaAlumnosAside() {
        const lista = document.getElementById("listota");
        lista.innerHTML = "";
        for (const alumno of alumnos) {
            const listItem = document.createElement("li");
            listItem.classList.add("listadoItem");
            listItem.innerHTML = `
                <strong>RUT:</strong> ${alumno.rut}<br>
                <strong>Nombre:</strong> ${alumno.nombre}<br>
                <strong>Edad:</strong> ${alumno.edad}<br>`;
            lista.appendChild(listItem);
        }
    }

    const promediosEdades = {
        promedioEdadTotal: promedioEdadTotal(),
        promedioEdadA: promedioEdadGrupo("A"),
        promedioEdadB: promedioEdadGrupo("B"),
        promedioEdadC: promedioEdadGrupo("C")
    }

    function promedioEdadGrupo(grupo) {
        const alumnosGrupo = alumnos.filter(alumno => alumno.grupo === grupo);
        if (alumnosGrupo.length === 0) {
            return 0;
        }
    
        const sumaEdades = alumnosGrupo.reduce((total, alumno) => total + alumno.edad, 0);
        return sumaEdades / alumnosGrupo.length;
    }
    
    // Calcular el promedio de edad de todos los alumnos
    function promedioEdadTotal() {
        if (alumnos.length === 0) {
            return 0;
        }
    
        const sumaEdades = alumnos.reduce((total, alumno) => total + alumno.edad, 0);
        return sumaEdades / alumnos.length;
    }

});