class VideoChat {
	constructor(ko) {
		let self = this;
		this.ko = ko;
		
		this.videoLocalOn = false;
		
		this.mensajes = ko.observableArray([]);
		
		this.estado = ko.observable("No conectado");
		this.error = ko.observable();
		
		var zonaVideo = document.getElementById("zonaVideo");
		var bntLlamar = document.getElementById("btnLlamar");
		var bntColgar = document.getElementById("btnColgar");
		var bntHistorial = document.getElementById("btnHistorial");
		
		this.ws = new WebSocket("wss://" + window.location.host + "/wsSignaling");
		
		this.ws.onopen = function() {
			self.estado("Conectado al servidor de signaling");
			self.error("");
			self.addMensaje("Conectado al servidor de signaling", "green");
		}
		
		this.ws.onerror = function() {
			self.estado("");
			self.error("Desconectado del servidor de signaling");
			self.addMensaje("Desconectado del servidor de signaling", "red");
		}
		
		this.ws.onclose = function() {
			self.estado("");
			self.error("Desconectado del servidor de signaling");
			self.addMensaje("Desconectado del servidor de signaling", "red");
		}

		this.ws.onmessage = function(event) {
			var data = JSON.parse(event.data);
			
			if (data.type=="OFFER") {
				self.anunciarLlamada(data.remitente, data.sessionDescription);
				return;
			}
			
			
			if (data.type=="RECHAZO") {
				self.anunciarRechazo(data.remitente, data.sessionDescription);
				return;
			}
			
			
			if (data.type=="CANDIDATE" && data.candidate) {
				self.addMensaje("Recibido candidato desde Signaling", "blue");
				try {
					self.conexion.addIceCandidate(data.candidate);
				} catch (error) {
					self.addMensaje(error, "red");
				}
				return;
			}
			if (data.type=="ANSWER") {
				let sessionDescription = data.sessionDescription;
				let rtcSessionDescription = new RTCSessionDescription(sessionDescription);
				self.addMensaje("Añadiendo sessionDescription a la remoteDescription", "orange");
				self.conexion.setRemoteDescription(rtcSessionDescription);
				self.addMensaje("sessionDescription añadida a la remoteDescription", "orange");
				return;
			}
		}	
		
	}
	
	anunciarLlamada(remitente, sessionDescription) {
		this.addMensaje("Se recibe llamada de " + remitente + " con su sessionDescription", "black");
		let aceptar = window.confirm("Te llama " + remitente + ". ¿Contestar?\n");
		if (aceptar){
			this.aceptarLlamada(remitente, sessionDescription);
		}else{
			this.enviarRechazo(remitente, sessionDescription);			
		}
	}
	
	anunciarRechazo(remitente, sessionDescription) {
		this.addMensaje(remitente + " ha rechazado la llamada", "black");
		this.conexion.close();
		zonaVideo.style.display = 'none';
		window.alert(remitente+" ha rechazado la llamada");
	}
	
	
	enviarRechazo(remitente) {
		let self = this;
		let sdpConstraints = {};
		zonaVideo.style.display = 'none';
		self.encenderVideoLocal();
		// self.addMensaje("CONTROL DE MENSAJES1");
		
		setTimeout(function(){
			self.crearConexion();
			// self.addMensaje("CONTROL DE MENSAJES2");
		
			
		self.conexion.createOffer(
			function(sessionDescription) {
				
				self.conexion.setLocalDescription(sessionDescription);
				
				
				let msg = {
					type : "RECHAZO",
					sessionDescription : sessionDescription,
					recipient : remitente
				};
				self.ws.send(JSON.stringify(msg));
			},
			function(error) {
				self.addMensaje("Error en el rechazo");
			},
			sdpConstraints
			
		);
		
		},2000);
	}
	
	
	colgar(){
		zonaVideo.style.display = 'none';
		this.conexion.close();
	}
	
	aceptarLlamada(remitente, sessionDescription) {
		zonaVideo.style.display = 'block';
		let self = this;
		// self.zonaVideo = ko.observable(true);
			self.encenderVideoLocal();			
			setTimeout(function(){
				self.crearConexion();
				// self.addMensaje("CONTROL DE MENSAJES2");
		
		let rtcSessionDescription = new RTCSessionDescription(sessionDescription);
		self.addMensaje("Añadiendo sessionDescription a la remoteDescription", "grey");
		self.conexion.setRemoteDescription(rtcSessionDescription);
		self.addMensaje("sessionDescription añadida a la remoteDescription", "grey");
					
		self.addMensaje("Llamada aceptada", "black");
		self.addMensaje("Creando respuesta mediante el servidor Stun");
		
		let sdpConstraints = {};
		// let self = this;
		self.conexion.createAnswer(
			function(sessionDescription) {
				self.addMensaje("sessionDescription recibida del servidor stun");
				self.conexion.setLocalDescription(sessionDescription).then(
					function() {
						self.addMensaje("sessionDescription enlazada a la RTCPeerConnnection local");
						self.addMensaje("Enviando aceptación al servidor de Signaling");
						let msg = {
							type : "ANSWER",
							sessionDescription : sessionDescription
						};
						self.ws.send(JSON.stringify(msg));
						self.addMensaje("Respuesta enviada al servidor de Signaling");
					}
				);
			},
			function(error) {
				self.addMensaje("Error al crear oferta en el servidor Stun: " + error, red);
			},
			sdpConstraints
		);  
			},2000);			
	}
	

	
//	
// rechazarLlamada(remitente, sessionDescription) {
// this.addMensaje("Llamada de " + remitente + " rechazada");
// this.addMensaje("Implementar función rechazarLlamada", "red");
//
// let msg = {
// type : "OFFER",
// sessionDescription : sessionDescription,
// recipient : remitente
// };
// self.ws.send(JSON.stringify(msg));
//		
//		
// window.alert("LLAMADA RECHAZADA, REMITENTE: " + remitente);
// }
//	

	encenderVideoLocal() {
		let self = this;
		
		let constraints = {
			video : true,
			audio : false
		};
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia(
			constraints, 
			function(stream) {
				let widgetVideoLocal = document.getElementById("widgetVideoLocal");
				self.localStream = stream;
				widgetVideoLocal.srcObject = stream;
				self.videoLocalOn = true;
				self.addMensaje("Vídeo local conectado", "green");
			}, 
			function(error) {
				self.addMensaje("Error al cargar vídeo local: " + error, "red");
			}
		);
	}
	
	crearConexion() {
		
		let self = this;
		let servers = { 
			iceServers : [ 
				// { "url" : "stun:stun.1.google.com:19302" }
				{ 
					urls : "turn:localhost",
					username : "webrtc",
					credential : "turnserver"
				}
			]
		};
		this.conexion = new RTCPeerConnection(servers);
		this.addMensaje("RTCPeerConnection creada");
		
		this.addMensaje("Asociando pistas locales a la RTCPeerConnection");
		let localTracks = this.localStream.getTracks();
		localTracks.forEach(track =>
			{
				this.conexion.addTrack(track, this.localStream);
			}
		);
		
		this.conexion.onicecandidate = function(event) {
			if (event.candidate) {
				self.addMensaje("self.conexion.onicecandidate (<i>recibido candidate desde el Stun</i>)");
				let msg = {
					type : "CANDIDATE",
					candidate : event.candidate
				};
				self.ws.send(JSON.stringify(msg));
				self.addMensaje("Candidate enviado al servidor de Signaling");
			}  else {
				self.addMensaje("Recibidos todos los candidates desde el Stun");
			}
		}
		
		this.conexion.oniceconnectionstatechange = function(event) {
			self.addMensaje("self.conexion.oniceconnectionstatechange: " + self.conexion.iceConnectionState, "DeepPink");
		}
			
		this.conexion.onicegatheringstatechange = function(event) {
			self.addMensaje("self.conexion.onicegatheringstatechange: " + self.conexion.iceGatheringState, "DeepPink");
		}
		
		this.conexion.onsignalingstatechange = function(event) {
			self.addMensaje("self.conexion.onsignalingstatechange: " + self.conexion.signalingState, "DeepPink");
		}
	
		this.conexion.onnegotiationneeded = function(event) {
			self.addMensaje("Negociación finalizada: self.conexion.onnegotiationneeded", "black");
			self.addMensaje("Listo para enviar oferta", "black");
		}
			
		this.conexion.ontrack = function(event) {
			self.addMensaje("Asociando pistas remotas a la RTCPeerConnection");
			let widgetVideoRemoto = document.getElementById("widgetVideoRemoto");
			widgetVideoRemoto.srcObject = event.streams[0];
			self.addMensaje("Vídeo remoto conectado");
		}
		
		this.conexion.onremovetrack = function(event) {
			self.addMensaje("self.conexion.onremovetrack");
		}
	}	
	
	
	enviarOferta(destinatario) {

		zonaVideo.style.display = 'block';
		
		let self = this;
		let sdpConstraints = {};
		
		self.encenderVideoLocal();
		// self.addMensaje("CONTROL DE MENSAJES1");
		
		setTimeout(function(){
			self.crearConexion();
			// self.addMensaje("CONTROL DE MENSAJES2");
		
		self.addMensaje("Creando oferta en el servidor Stun");
		self.conexion.createOffer(
			function(sessionDescription) {
				self.addMensaje("sessionDescription recibida del servidor Stun");
				self.conexion.setLocalDescription(sessionDescription);
				self.addMensaje("sessionDescription enlazada a la RTCPeerConnnection local");
				self.addMensaje("Enviando oferta a " + self.destinatario + " mediante el servidor de Signaling");
				let msg = {
					type : "OFFER",
					sessionDescription : sessionDescription,
					recipient : destinatario
				};
				self.ws.send(JSON.stringify(msg));
				self.addMensaje("Oferta enviada al servidor de signaling");
			},
			function(error) {
				self.addMensaje("Error al crear oferta en el servidor Stun", true);
			},
			sdpConstraints
		);
		
		
		},3000);
		
		
	}

	addMensaje(texto, color) {
		let mensaje = {
			texto : texto,
			color : color ? color : "blue"
		};
		this.mensajes.push(mensaje);
	}
}