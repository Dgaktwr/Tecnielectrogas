# Tecnielectrogas — avance web y operaciones

Sitio Next.js con páginas independientes para Bogotá y Cali, servicios a domicilio o en punto físico, formulario de solicitud por WhatsApp y panel administrativo para órdenes, agenda, técnicos y garantías.

## Ejecutar

1. `npm install`
2. Copiar `.env.example` a `.env.local` y configurar `ADMIN_USER`, `ADMIN_PASSWORD`, `WHATSAPP_BOGOTA` y `WHATSAPP_CALI`.
3. `npm run dev`

Los números de WhatsApp deben estar en formato internacional, solo dígitos, sin `+`. Como todavía no se han entregado los números oficiales, el botón público permanece desactivado. Al configurarlos, el formulario registra la solicitud localmente y abre `wa.me` con todos los detalles. El cliente debe pulsar **Enviar** en WhatsApp; la aplicación no puede verificar ese envío ni confirmar automáticamente la cita.

## Operaciones

El enlace **Panel administrativo** está en la cabecera y el pie de la web. En `npm run dev`, el panel se abre desde `localhost` sin credenciales para revisar y probar el avance. Fuera de ese entorno requiere `ADMIN_USER` y `ADMIN_PASSWORD`; si faltan, queda cerrado. El panel permite registrar técnicos por sede, ver el número de cada servicio y su electrodoméstico, asignar técnico, fecha, estado y notas, y definir manualmente garantías de **30 días, 3 meses o 6 meses**. La fecha de vencimiento se calcula desde la fecha de inicio registrada.

Los datos se guardan en `data/operaciones.json`, excluido de Git. Este almacenamiento sirve para el avance en un servidor local o persistente. Para desplegar en una plataforma sin disco persistente hay que migrarlo a una base de datos, definir copias de seguridad y reemplazar la autenticación básica por usuarios con sesiones y roles. El panel no recibe automáticamente mensajes entrantes de WhatsApp; un operador puede registrar manualmente los casos recibidos allí.

## Marca, SEO y seguridad

Se aplicó el manual de marca: paleta fija de siete colores (pizarra, papel, cobre, cobre claro, niebla, gris y verde), IBM Plex Sans/Mono (`next/font`, requiere internet al compilar), logos oficiales en `public/brand`, íconos y fotos del manual.

**El cable:** `src/components/public/brand-progress-line.tsx`. Nace en el punto del titular (`HeroTitle` / `BrandDot`, un solo `#brand-start` por página), corre por los márgenes, cruza entre secciones y cierra con el check del logo. Se dibuja con el scroll y pasa a cobre claro sobre secciones oscuras. Reglas para páginas nuevas: usar `<Section>` (marca cada bloque como sección), un único `HeroTitle` y `end` en la última sección.

**Fotos:** las de `public/brand/fotos` son imágenes de referencia del manual (llevan el rótulo "Imagen de referencia"). El manual exige fotos reales del equipo: reemplazar por los mismos nombres de archivo y quitar el rótulo en `brand-photo.tsx`.

Hay metadatos por página, sitemap, robots, cabeceras de seguridad, validación en servidor y control básico de solicitudes. Configura `NEXT_PUBLIC_SITE_URL` con el dominio final.

La integración con un CRM sigue preparada mediante `CRM_WEBHOOK_URL` y `CRM_WEBHOOK_TOKEN` opcionales; falta escoger proveedor, mapear campos y añadir seguimiento o reintentos de entrega. Antes de publicar hay que confirmar direcciones de los puntos físicos, zonas de cobertura, política de privacidad y texto legal de garantías.
