class Conversacion {
	constructor(ko, nombreInterlocutor, chat) {
		this.nombreInterlocutor = nombreInterlocutor;
		this.mensajes = ko.observableArray([]);
		this.textoAEnviar = ko.observable("");
		this.chat = chat;
		this.visible = ko.observable(true);
	}
	
	addMensaje(mensaje) {
		this.mensajes.push(mensaje);
	}
	
	enviar() {
		var mensaje = {
			type : "PARTICULAR",
			destinatario : this.nombreInterlocutor,
			texto : this.textoAEnviar()
		};
		this.chat.enviar(mensaje);
		var mensaje = new Mensaje(this.textoAEnviar());
		this.addMensaje(mensaje);
		
		
		
		var info = {
				textoAEnviar : this.textoAEnviar(),
				sender : "yoPrivado",
				recipient : this.nombreInterlocutor
		};
		var data = {
				data : JSON.stringify(info),
				url : "messages/msgPrivado",
				type : "put",
				contentType : 'application/json',
				success : function(response) {
					//alert("Mensaje Broadcast guardado en BBDD");
				},
				error : function(response) {
					alert("Error guardando msg en BD " + response.responseJSON.error);
				}
		};
		$.ajax(data);
		
		
		
		
	}
}