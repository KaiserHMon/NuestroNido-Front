# Corecciones a hacer:

- Boton de continuar con Google no funciona

- Revisar a donde se envian los mensajes de soporte y con que informacion

- Agregar favicon (que sea el mismo pajaro que se usa en el header de /)

- Agregar lo siguiente:

Add to page.tsx or your root layout.tsx
import Script from "next/script"

export default function Page() {
  return (
    <>
      <Script
        src="https://owlight-widget.vercel.app/widget-feedback.umd.js"
        data-theme="dark" 
        data-position="left" 
        data-lang="es" 
        strategy="lazyOnload"
      />
    </>
  )
}