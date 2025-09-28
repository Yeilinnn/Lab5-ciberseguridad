// modulo de ejemplo.

module.exports = {


    // logica que valida si un telefono esta correcto...
    is_valid_phone: function (phone) {
      // inicializacion lazy
      var isValid = false;
      // expresion regular copiada de StackOverflow
      var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;
  
      // validacion Regex
      try {
        isValid = re.test(phone);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
      // fin del try-catch block
    },
  
    is_valid_url_image: function (url) {
  
      // inicializacion lazy
      var isValid = false;
      // expresion regular copiada de StackOverflow
      var re = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|bmp)/i;
  
      // validacion Regex
      try {
        isValid = re.test(url);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
      // fin del try-catch block
    },
  
    is_valid_yt_video: function (url) {
  
      // inicializacion lazy
      var isValid = false;
      // expresion regular copiada de StackOverflow
      var re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/i;
  
      // validacion Regex
      try {
        isValid = re.test(url);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
      // fin del try-catch block
    },
  
    getYTVideoId: function(url){
  
      return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
    },
  
    getEmbeddedCode: function (url){
      var id = this.getYTVideoId(url);
      var code = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+ '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      return code;
    },
  
    getImageTag: function(url){
      var tag = '<img src="'+url+'" style="max-height: 400px;max-width: 400px;">';
      return tag;
    },
  
    // Función para sanitizar texto y prevenir inyecciones
    sanitizeText: function(text) {
      if (!text || typeof text !== 'string') {
        return '';
      }
      
      // Remover caracteres peligrosos y scripts
      return text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') 
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') 
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') 
        .replace(/<embed\b[^>]*>/gi, '') 
        .replace(/<link\b[^>]*>/gi, '') 
        .replace(/<meta\b[^>]*>/gi, '') 
        .replace(/javascript:/gi, '') 
        .replace(/on\w+\s*=/gi, '') 
        .replace(/[<>]/g, function(match) { 
          return match === '<' ? '&lt;' : '&gt;';
        });
    },

    // Función para detectar si un texto es una URL
    isUrl: function(text) {
      if (!text || typeof text !== 'string') {
        return false;
      }
      
      // Detectar si el texto parece una URL
      var urlRegex = /^https?:\/\/[^\s]+$/i;
      return urlRegex.test(text.trim());
    },

    // Función para validar que la URL sea segura
    isSecureUrl: function(url) {
      if (!url || typeof url !== 'string') {
        return false;
      }
      
      // Solo permitir HTTP y HTTPS
      var secureProtocolRegex = /^https?:\/\//i;
      if (!secureProtocolRegex.test(url)) {
        return false;
      }
      
      // Bloquear URLs peligrosas
      var dangerousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /ftp:/i,
        /localhost/i,
        /127\.0\.0\.1/i,
        /0\.0\.0\.0/i
      ];
      
      for (var i = 0; i < dangerousPatterns.length; i++) {
        if (dangerousPatterns[i].test(url)) {
          return false;
        }
      }
      
      return true;
    },

    // Función mejorada para validar URLs de imágenes
    is_valid_url_image_secure: function(url) {
      if (!this.isSecureUrl(url)) {
        return false;
      }
      
      // Validación muy estricta para imágenes - debe terminar con extensión válida
      var imageRegex = /^https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)*\.(?:jpg|jpeg|png|gif|bmp|webp|svg)(?:\?[^\s]*)?$/i;
      return imageRegex.test(url);
    },

    // Función mejorada para validar URLs de YouTube
    is_valid_yt_video_secure: function(url) {
      if (!this.isSecureUrl(url)) {
        return false;
      }
      
      // Verificar que no sea un dominio similar pero falso
      // Usar regex para verificar dominios falsos específicos
      var fakeDomainRegex = /https?:\/\/(?:ww\.youtube\.com|youtub\.com|youtubee\.com)/i;
      if (fakeDomainRegex.test(url)) {
        return false;
      }
      
      // Validación muy estricta - solo dominios oficiales exactos de YouTube
      var youtubeRegex = /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/i;
      
      return youtubeRegex.test(url);
    },

    validateMessage: function(msg){
      // Handle invalid input
      if (!msg || typeof msg !== 'string') {
        return JSON.stringify({ mensaje: '' });
      }

      try {
        var obj = JSON.parse(msg);
        
        // Validar que el objeto tenga la estructura esperada
        if (!obj || typeof obj !== 'object' || !obj.mensaje) {
          return JSON.stringify({ mensaje: '' });
        }
        
        // Sanitizar el mensaje
        var originalMessage = obj.mensaje;
        var sanitizedMessage = this.sanitizeText(originalMessage);
        
        // Si el mensaje fue modificado por sanitización, usar el sanitizado
        if (sanitizedMessage !== originalMessage) {
          console.log("Mensaje sanitizado por seguridad");
          obj.mensaje = sanitizedMessage;
        }
        
        // Validar longitud del mensaje
        if (obj.mensaje.length > 2000) {
          console.log("Mensaje demasiado largo");
          return JSON.stringify({ mensaje: 'Mensaje demasiado largo' });
        }
  
        // Verificar si es una URL
        if(this.isUrl(obj.mensaje)){
          console.log("Es una URL, validando...")
          
          // Verificar si es una URL válida de imagen
          if(this.is_valid_url_image_secure(obj.mensaje)){
            console.log("Es una imagen válida!")
            obj.mensaje = this.getImageTag(obj.mensaje);
          }
          // Verificar si es una URL válida de video de YouTube
          else if(this.is_valid_yt_video_secure(obj.mensaje)){
            console.log("Es un video válido!")
            obj.mensaje = this.getEmbeddedCode(obj.mensaje);
          }
          else{
            console.log("URL inválida - solo se permiten imágenes y videos de YouTube")
            return JSON.stringify({ mensaje: 'URL inválida. Solo se permiten imágenes y videos de YouTube.' });
          }
        }
        else{
          console.log("Es un texto normal")
          // Para texto normal, asegurar que esté sanitizado
          obj.mensaje = sanitizedMessage;
        }
        
        return JSON.stringify(obj);
      } catch (e) {
        console.log('Error processing message:', e);
        return JSON.stringify({ mensaje: 'Error al procesar el mensaje' });
      }
    }
  
  
  
    
    
  
  // fin del modulo
  };
  