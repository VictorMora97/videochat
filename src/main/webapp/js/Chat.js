class Chat {
	
	constructor(ko) {
		let self = this;
		this.ko = ko;
				
		this.estado = ko.observable("");
		this.error = ko.observable();
		
		this.usuarios = ko.observableArray([]);
		this.mensajesRecibidos = ko.observableArray([]);
		this.conversaciones = ko.observableArray([]);
		
		this.destinatario = ko.observable();
		this.mensajeQueVoyAEnviar = ko.observable();
		
		var zonaVideo = document.getElementById("zonaVideo");
		
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
					
		        //lo que habia antes
//				var usuario = new Usuario(data.userName, data.picture);
//				self.usuarios.push(usuario);			

				var userName = data.userName;
				//añadido: evitar redundancia de usuarios	
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
	
//	acabarLlamada(){
//		
//		zonaVideo.style.display = 'none';
//	}
//	
	
	enviar(mensaje) {
		this.chat.send(JSON.stringify(mensaje));
	}
	
	enviarATodos() {
		var mensaje = {
			type : "BROADCAST",
			message : this.mensajeQueVoyAEnviar()
		};
		this.chat.send(JSON.stringify(mensaje));
		//this.registerMsg(mensaje);
	}

	
//	registerMsg(mensaje) {
//		var info = {
//			id : "prueba",
//			date : "prueba",//self.date,
//			message : "prueba",    //self.message,
//			recipient : "prueba",    //self.recipient,
//			sender : "prueba"    //self.sender
//			//picture : self.picture()
//		};
//		var data = {
//				data : JSON.stringify(mensaje),
//				url : "messages/msgBroadcast",
//				type : "put",
//				contentType : 'application/json',
//				success : function(response) {
//					alert("Mensaje guardado correctamente");
//					
//				},
//				error : function(response) {
//					alert("ERROR GUARDANDO MSG " + response.responseJSON.error);
//				}
//		};
//		$.ajax(data);    	  
//	}
//	

	
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
			conversacion = new Conversacion(this.ko, interlocutor.nombre, this);
			this.conversaciones.push(conversacion);
		}
		this.ponerVisible(interlocutor.nombre);
	}
	
	ponerVisible(nombreInterlocutor) {
		for (var i=0; i<this.conversaciones().length; i++) {
			var conversacion = this.conversaciones()[i];
			conversacion.visible(conversacion.nombreInterlocutor == nombreInterlocutor);
		}
	}
	
	addUsuario(userName, picture) {
		this.usuarios.push(new Usuario(userName, picture));
	}
}
	