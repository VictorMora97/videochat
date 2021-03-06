class Chat {
	
	constructor(ko) {
		let self = this;
		this.ko = ko;
				
		this.estado = ko.observable("");
		this.error = ko.observable();
		
		this.usuarios = ko.observableArray([]);
		this.mensajesRecibidos = ko.observableArray([]);
		this.conversaciones = ko.observableArray([]);
		this.conversacionRecuperada = ko.observableArray([]);
		
		this.destinatario = ko.observable();
		this.mensajeQueVoyAEnviar = ko.observable();
		
		var zonaVideo = document.getElementById("zonaVideo");
		var zonaHistorial = document.getElementById("zonaHistorial");
		

		
		this.chat = new WebSocket("wss://" + window.location.host + "/wsTexto");
		
		this.chat.onopen = function() {
			self.estado("Conectado al chat de texto");
			self.error("");
		}

		this.chat.onerror = function() {
			self.estado("");
			self.error("Chat de texto cerrado");
		}

		this.chat.onclose = function() {
			self.estado("");
			self.error("Chat de texto cerrado");
		}
		
		this.chat.onmessage = function(event) {
			var data = JSON.parse(event.data);
			if (data.type == "FOR ALL") {
				var mensaje = new Mensaje(data.message, data.time);
				self.mensajesRecibidos.push(mensaje);			
				
			} else if (data.type == "ARRIVAL") {
					
		        // lo que habia antes
// var usuario = new Usuario(data.userName, data.picture);
// self.usuarios.push(usuario);

				var userName = data.userName;
				// añadido: evitar redundancia de usuarios
				for (var i=0; i<self.usuarios().length; i++) {
					if (self.usuarios()[i].nombre == userName) {
						self.usuarios.splice(i, 1);
						break;
					}
				}		
				
				var usuario = new Usuario(data.userName, data.picture);
				self.usuarios.push(usuario);		
				
			} else if (data.type == "BYE") {
				var userName = data.userName;
				for (var i=0; i<self.usuarios().length; i++) {
					if (self.usuarios()[i].nombre == userName) {
						
						self.usuarios.splice(i, 1);
						break;
					}
				}
			} else if (data.type == "PARTICULAR") {
				var conversacionActual = self.buscarConversacion(data.remitente);
				if (conversacionActual!=null) {
					var mensaje = new Mensaje(data.message.message, data.message.time);
					conversacionActual.addMensaje(mensaje);
				} else {
					conversacionActual = new Conversacion(ko, data.remitente, self);
					var mensaje = new Mensaje(data.message.message, data.message.time);
					conversacionActual.addMensaje(mensaje);
					self.conversaciones.push(conversacionActual);
				}
				self.ponerVisible(data.remitente);
			} 
		}
	}
	
	close() {
		this.chat.close();
	}
	
 acabarLlamada(){
		
 zonaVideo.style.display = 'none';
 }
	
	
	enviar(mensaje) {
		this.chat.send(JSON.stringify(mensaje));
	}
	
	enviarATodos() {
		var mensaje = {
			type : "BROADCAST",
			message : this.mensajeQueVoyAEnviar()
		};
		this.chat.send(JSON.stringify(mensaje));	
		
		var info = {
				mensajeQueVoyAEnviar : this.mensajeQueVoyAEnviar(),
				sender : document.getElementById("yo").innerHTML
		};
		var data = {
				data : JSON.stringify(info),
				url : "messages/msgBroadcast",
				type : "put",
				contentType : 'application/json',
				success : function(response) {
					// alert("Mensaje Broadcast guardado en BBDD");
				},
				error : function(response) {
					alert("Error guardando msg en Chat.js " + response.responseJSON.error);
				}
		};
		$.ajax(data);    
		
		
	}

	buscarConversacion(nombreInterlocutor) {
		for (var i=0; i<this.conversaciones().length; i++) {
			if (this.conversaciones()[i].nombreInterlocutor==nombreInterlocutor)
				return this.conversaciones()[i];
		}
		return null;
	}
	
	setDestinatario(interlocutor) {
		this.destinatario(interlocutor);
		var conversacion = this.buscarConversacion(interlocutor.nombre);
		if (conversacion==null) {
			conversacion = new Conversacion(this.ko, interlocutor.nombre, this) ;
			this.conversaciones.push(conversacion);
		}
		this.ponerVisible(interlocutor.nombre);
	}
	
	
	
	
	
	
	
	// Nueva función eliminar mensajes

	eliminarChat(interlocutor){
		zonaHistorial.style.display = 'none';
		var info = {
				sender : document.getElementById("yo").innerHTML,
				recipient : interlocutor.nombre
		};
		var data = {
				data : JSON.stringify(info),
				url : "messages/deleteHistorial",
				type : "post",
				contentType : 'application/json',
				success : function(response) {			
				alert("Historial eliminado");
				},
				error : function(response) {
					alert("Error recuperando msg " + response);
				}
		};
		$.ajax(data); 
		
	}

	recuperarChat(interlocutor){
// if(zonaHistorial.style.display == 'none'){
			zonaHistorial.style.display = 'block';
// } else {
// zonaHistorial.style.display = 'none';
// }
		
		var listaMensajes = [];
		var prueba = document.getElementById("recuperado");
		prueba.innerHTML="";
		var info = {
				sender : document.getElementById("yo").innerHTML,
				recipient : interlocutor.nombre
		};
		var data = {
				data : JSON.stringify(info),
				url : "messages/getHistorial",
				type : "post",
				contentType : 'application/json',
				success : function(response) {
	
					response.sort(function(a,b) {
					    return parseFloat(a.date) - parseFloat(b.date);
					});
					
					for (var i = 0; i < response.length; i++) {
						var sender = response[i].sender;
						var recipient = response[i].recipient;
						var message = response[i].message;	
						var date = response[i].date;											
						var fecha = new Date(date);
						var MensajeRecuperado = "<strong>["+fecha.toLocaleString() +"] </strong> "+sender+": "+message+"<br>";					
						prueba.innerHTML+= MensajeRecuperado;
					}

				},
				error : function(response) {
					alert("Error recuperando msg " + response);
				}
		};
		$.ajax(data); 
		
	}


	crearHistorial(sender, recipient, message){
// msg = new Message();
// msg.setSender(sender);
// msg.setRecipient(recipient);
// msg.setMessage(message);
//		
// this.conversacionRecuperada.push(msg);
		
	}
	
	
	
	
	ponerVisible(nombreInterlocutor) {
		for (var i=0; i<this.conversaciones().length; i++) {
			var conversacion = this.conversaciones()[i];
			conversacion.visible(conversacion.nombreInterlocutor == nombreInterlocutor);
		}
	}
	
	addAvatar(userName, picture,listSize){
		
		for(var i=0; i<listSize; i++){
			var userNow = this.usuarios.pop();
			if(userNow.nombre!=userName){
				this.usuarios.unshift(new Usuario(userNow.nombre, userNow.foto));
				
			}else{
				this.usuarios.unshift(new Usuario(userNow.nombre, picture));
			}
		}
		

	}
	
	addUsuario(userName, picture) {
		this.usuarios.push(new Usuario(userName, picture));
	}
}