document.addEventListener('DOMContentLoaded', () => {
  const inputEmail = document.getElementById('email')
  const btnSubmit = document.getElementById('btnSubmit')

  if (inputEmail && btnSubmit) {
    btnSubmit.addEventListener('click', async (e) => {
      e.preventDefault()

      const email = inputEmail.value.trim()
      if (!email) {
        alert('Campo email vacío, favor completar')
        return
      }

      try {
        const respuesta = await fetch('/api/products/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        })
        const datos = await respuesta.json()

        console.log(datos, respuesta.status)

        if (respuesta.status === 200) {
          location.href = `/teams?id=${datos.trainer.id}&teamID=${datos.trainer.teamID}`
        } else {
          alert(datos.error || 'Error en el inicio de sesión')
        }
      } catch (error) {
        console.error('Error en la solicitud:', error)
        alert('Hubo un problema con la solicitud. Inténtalo de nuevo más tarde.')
      }
    })
  } else {
    console.error('No se encontraron los elementos input o button en el DOM.')
  }
})
