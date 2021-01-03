import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');
if(btnEliminar){
    btnEliminar.addEventListener('click',e => {

        const urlProyecto = e.target.dataset.proyectoUrl;
        console.log(urlProyecto);
        const url = `${location.origin}/proyectos/${urlProyecto}`;

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

                axios.delete(url,{ params: {urlProyecto} })
                .then(function(respuesta){
                    console.log(respuesta);
                    
                    Swal.fire(
                        'Deleted!',
                        respuesta.data,
                        'success'
                      );

                      setTimeout(()=>{
                          window.location.href = '/';
                      },1000);
                });
            }
          })
              
    })

    }

export default btnEliminar;