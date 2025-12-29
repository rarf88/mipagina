RF Automation Studio — Website (PRO)

✅ Qué incluye
- Sitio multi-página (ES) + carpeta /en (EN)
- Responsive real (móvil/tablet/escritorio/ultrawide)
- Visuales propios (SVG enterprise)
- Formularios funcionales conectables a n8n Webhook
- Configuración centralizada (config.js)

1) Configurar Webhook (n8n)
- En n8n crea un Webhook (POST).
- Copia la URL y pégala en config.js => WEBHOOK_URL
- Recomendación: añade nodos:
  - Set (normalizar campos)
  - Postgres (guardar lead)
  - Email/SMTP (notificar)
  - Slack/WhatsApp (opcional)

2) Cambiar correo y WhatsApp
- En config.js: EMAIL y WHATSAPP

3) Reemplazar logo
- Por defecto usa assets/rf-logo.svg
- Puedes reemplazarlo por PNG manteniendo el nombre o cambiando la ruta en el HTML.

Listo.
