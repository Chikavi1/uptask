import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');
if ( tareas ) {

    tareas.addEventListener('click', e => {

        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            console.log(idTarea);

            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url,{ idTarea })
                .then((respuesta)=>{
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
            idTarea = tareaHTML.dataset.tarea;
            
            Swal.fire({
                title: 'estas seguro?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url,{ params: {idTarea }})
                    .then(function(respuesta){
                        if(respuesta.status === 200){
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )

                            actualizarAvance();
                        }
                    });
                }

            });

        }

        
    })
}

export default tareas;