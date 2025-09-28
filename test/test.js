var val = require('../libs/unalib');
var assert = require('assert');


describe('unalib', function(){


  describe('funcion is_valid_phone', function(){

    it('deberia devolver true para 8297-8547', function(){

      assert.equal(val.is_valid_phone('8297-8547'), true);

    });

    it('deberia devolver false para 8297p-8547', function(){

      assert.equal(val.is_valid_phone('8297p-8547'), false);

    });

  });


  describe('funcion is_valid_url_image', function(){

    it('deberia devolver true para http://image.com/image.jpg', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.jpg'), true);

    });

    it('deberia devolver true para http://image.com/image.gif', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.gif'), true);

    });
    
  });

  describe('funcion is_valid_yt_video', function(){

    it('deberia devolver true para https://www.youtube.com/watch?v=qYwlqx-JLok', function(){

      assert.equal(val.is_valid_yt_video('https://www.youtube.com/watch?v=qYwlqx-JLok'), true);

    });

  });

  // ===== NUEVAS PRUEBAS DE SEGURIDAD =====

  describe('funcion isUrl', function(){

    it('deberia devolver true para https://example.com', function(){
      assert.equal(val.isUrl('https://example.com'), true);
    });

    it('deberia devolver true para http://test.com/path', function(){
      assert.equal(val.isUrl('http://test.com/path'), true);
    });

    it('deberia devolver false para texto normal', function(){
      assert.equal(val.isUrl('Hola mundo'), false);
    });

    it('deberia devolver false para string vacio', function(){
      assert.equal(val.isUrl(''), false);
    });

  });

  describe('funcion isSecureUrl', function(){

    it('deberia devolver true para https://example.com', function(){
      assert.equal(val.isSecureUrl('https://example.com'), true);
    });

    it('deberia devolver true para http://example.com', function(){
      assert.equal(val.isSecureUrl('http://example.com'), true);
    });

    it('deberia devolver false para javascript:alert', function(){
      assert.equal(val.isSecureUrl('javascript:alert("xss")'), false);
    });

    it('deberia devolver false para localhost', function(){
      assert.equal(val.isSecureUrl('https://localhost/image.jpg'), false);
    });

    it('deberia devolver false para 127.0.0.1', function(){
      assert.equal(val.isSecureUrl('https://127.0.0.1/image.jpg'), false);
    });

  });

  describe('funcion is_valid_url_image_secure', function(){

    it('deberia devolver true para https://example.com/image.jpg', function(){
      assert.equal(val.is_valid_url_image_secure('https://example.com/image.jpg'), true);
    });

    it('deberia devolver true para https://cdn.example.com/photo.png', function(){
      assert.equal(val.is_valid_url_image_secure('https://cdn.example.com/photo.png'), true);
    });

    it('deberia devolver true para https://images.com/pic.gif', function(){
      assert.equal(val.is_valid_url_image_secure('https://images.com/pic.gif'), true);
    });

    it('deberia devolver false para https://example.com/image sin extension', function(){
      assert.equal(val.is_valid_url_image_secure('https://example.com/image'), false);
    });

    it('deberia devolver false para https://localhost/image.jpg', function(){
      assert.equal(val.is_valid_url_image_secure('https://localhost/image.jpg'), false);
    });

    it('deberia devolver false para javascript:alert', function(){
      assert.equal(val.is_valid_url_image_secure('javascript:alert("xss")'), false);
    });

  });

  describe('funcion is_valid_yt_video_secure', function(){

    it('deberia devolver true para https://www.youtube.com/watch?v=ExcyTM9T7_8', function(){
      assert.equal(val.is_valid_yt_video_secure('https://www.youtube.com/watch?v=ExcyTM9T7_8'), true);
    });

    it('deberia devolver true para https://youtu.be/ExcyTM9T7_8', function(){
      assert.equal(val.is_valid_yt_video_secure('https://youtu.be/ExcyTM9T7_8'), true);
    });

    it('deberia devolver true para https://www.youtube.com/embed/ExcyTM9T7_8', function(){
      assert.equal(val.is_valid_yt_video_secure('https://www.youtube.com/embed/ExcyTM9T7_8'), true);
    });

    it('deberia devolver false para https://ww.youtube.com/watch?v=ExcyTM9T7_8', function(){
      assert.equal(val.is_valid_yt_video_secure('https://ww.youtube.com/watch?v=ExcyTM9T7_8'), false);
    });

    it('deberia devolver false para https://youtub.com/watch?v=ExcyTM9T7_8', function(){
      assert.equal(val.is_valid_yt_video_secure('https://youtub.com/watch?v=ExcyTM9T7_8'), false);
    });

    it('deberia devolver false para https://vimeo.com/video/123', function(){
      assert.equal(val.is_valid_yt_video_secure('https://vimeo.com/video/123'), false);
    });

  });

  describe('funcion sanitizeText', function(){

    it('deberia remover scripts maliciosos', function(){
      var input = '<script>alert("xss")</script>';
      var result = val.sanitizeText(input);
      assert.equal(result, '');
    });

    it('deberia remover iframes', function(){
      var input = '<iframe src="malicious.com"></iframe>';
      var result = val.sanitizeText(input);
      assert.equal(result, '');
    });

    it('deberia remover event handlers', function(){
      var input = '<img src="x" onerror="alert(1)">';
      var result = val.sanitizeText(input);
      assert.equal(result, '&lt;img src="x" "alert(1)"&gt;');
    });

    it('deberia remover protocolos javascript', function(){
      var input = 'javascript:alert("xss")';
      var result = val.sanitizeText(input);
      assert.equal(result, 'alert("xss")');
    });

    it('deberia escapar caracteres HTML', function(){
      var input = 'Texto con < y >';
      var result = val.sanitizeText(input);
      assert.equal(result, 'Texto con &lt; y &gt;');
    });

    it('deberia mantener texto normal', function(){
      var input = 'Hola mundo normal';
      var result = val.sanitizeText(input);
      assert.equal(result, 'Hola mundo normal');
    });

  });

  describe('funcion validateMessage - Validacion de URLs de Imagenes', function(){

    it('deberia procesar imagen valida correctamente', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://example.com/image.jpg', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert(resultObj.mensaje.includes('<img src="https://example.com/image.jpg"'));
      assert(resultObj.mensaje.includes('style="max-height: 400px;max-width: 400px;"'));
    });

    it('deberia procesar imagen PNG correctamente', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://cdn.example.com/photo.png', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert(resultObj.mensaje.includes('<img src="https://cdn.example.com/photo.png"'));
    });

    it('deberia rechazar imagen sin extension', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://example.com/image', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'URL inválida. Solo se permiten imágenes y videos de YouTube.');
    });

    it('deberia rechazar imagen con dominio local', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://localhost/image.jpg', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'URL inválida. Solo se permiten imágenes y videos de YouTube.');
    });

  });

  describe('funcion validateMessage - Validacion de URLs de Videos', function(){

    it('deberia procesar video de YouTube correctamente', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://www.youtube.com/watch?v=ExcyTM9T7_8', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert(resultObj.mensaje.includes('<iframe'));
      assert(resultObj.mensaje.includes('youtube.com/embed/ExcyTM9T7_8'));
    });

    it('deberia procesar youtu.be correctamente', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://youtu.be/ExcyTM9T7_8', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert(resultObj.mensaje.includes('<iframe'));
      assert(resultObj.mensaje.includes('youtube.com/embed/ExcyTM9T7_8'));
    });

    it('deberia rechazar video con dominio falso', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://ww.youtube.com/watch?v=ExcyTM9T7_8', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'URL inválida. Solo se permiten imágenes y videos de YouTube.');
    });

    it('deberia rechazar video de Vimeo', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'https://vimeo.com/video/123', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'URL inválida. Solo se permiten imágenes y videos de YouTube.');
    });

  });

  describe('funcion validateMessage - Prevencion de Inyeccion de Scripts', function(){

    it('deberia bloquear script malicioso', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: '<script>alert("xss")</script>', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, '');
    });

    it('deberia bloquear iframe malicioso', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: '<iframe src="malicious.com"></iframe>', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, '');
    });

    it('deberia bloquear event handler', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: '<img src="x" onerror="alert(1)">', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert(resultObj.mensaje.includes('&lt;img'));
      assert(!resultObj.mensaje.includes('onerror'));
    });

    it('deberia bloquear protocolo javascript', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'javascript:alert("xss")', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      // El protocolo javascript es sanitizado y removido, dejando solo el texto
      assert.equal(resultObj.mensaje, 'alert("xss")');
    });

    it('deberia permitir texto normal sanitizado', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: 'Hola <mundo>', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'Hola &lt;mundo&gt;');
    });

  });

  describe('funcion validateMessage - Casos Edge', function(){

    it('deberia manejar mensaje vacio', function(){
      var msg = JSON.stringify({ nombre: 'Test', mensaje: '', color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, '');
    });

    it('deberia manejar mensaje null', function(){
      var result = val.validateMessage(null);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, '');
    });

    it('deberia manejar mensaje undefined', function(){
      var result = val.validateMessage(undefined);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, '');
    });

    it('deberia manejar JSON invalido', function(){
      var result = val.validateMessage('json invalido');
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'Error al procesar el mensaje');
    });

    it('deberia rechazar mensaje demasiado largo', function(){
      var longMessage = 'a'.repeat(2001); // Usando el límite de 2000 caracteres
      var msg = JSON.stringify({ nombre: 'Test', mensaje: longMessage, color: '#000000' });
      var result = val.validateMessage(msg);
      var resultObj = JSON.parse(result);
      
      assert.equal(resultObj.mensaje, 'Mensaje demasiado largo');
    });

  });

});