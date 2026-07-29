# Bitácora cripto — deploy en Vercel

## 1. Subir el código a GitHub

Desde una terminal, parado en esta carpeta:

```bash
git init
git add .
git commit -m "Primera versión de Bitácora cripto"
```

Después creá un repositorio vacío en https://github.com/new (podés llamarlo `bitacora-cripto`, privado o público, da igual). GitHub te va a mostrar los comandos exactos, algo como:

```bash
git remote add origin https://github.com/TU-USUARIO/bitacora-cripto.git
git branch -M main
git push -u origin main
```

## 2. Conectar con Vercel

1. Entrá a https://vercel.com y logueate con tu cuenta de GitHub.
2. Click en "Add New" → "Project".
3. Elegí el repositorio `bitacora-cripto` que acabás de crear.
4. Antes de darle a "Deploy", abrí la sección **Environment Variables** y agregá dos:
   - Name: `ANTHROPIC_API_KEY` → Value: tu clave (la conseguís en https://console.anthropic.com)
   - Name: `APP_PASSWORD` → Value: la contraseña que quieras usar para acceder al análisis (inventá una, no hace falta que sea la misma que usás en otro lado)
5. Click en **Deploy**.

En un minuto Vercel te da una URL pública tipo `https://bitacora-cripto.vercel.app`. La clave de Anthropic nunca queda en el código ni visible para quien visite el sitio — vive solo en la configuración del proyecto en Vercel. Para usar "Analizar hallazgo", quien entre al sitio va a necesitar escribir la misma contraseña que pusiste en `APP_PASSWORD`.

## 3. Actualizaciones futuras

Cada vez que quieras cambiar algo: modificás el archivo local, y:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel redespliega solo, automáticamente, en cuanto detecta el push.

## Nota de seguridad

Con `APP_PASSWORD` configurada, nadie puede disparar análisis (ni gastar tu cuota de la API) sin conocer la contraseña — aunque la URL sea pública, solo ustedes dos pueden usar esa función. Ver los precios y el historial sigue siendo libre para cualquiera, ya que esos datos vienen de CoinGecko y no cuestan nada.

Un detalle a tener en cuenta: la contraseña viaja por HTTPS (Vercel lo fuerza por defecto), así que no viaja "en claro" por la red, pero sí queda visible en la pestaña de Network de las herramientas de desarrollador de quien la use — igual que pasa con casi cualquier login simple sin usuario/sesión. Para un uso de a dos, esto es más que suficiente.
