define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils'],
		function(ko, app, moduleUtils, accUtils) {

	function ChatViewModel() {
		var self = this;
		
		this.user = app.user;
		
		self.recipient = ko.observable();

		self.chat = ko.observable(new Chat(ko));
		
		self.videoChat = ko.observable(new VideoChat(ko));

		self.estadoChatDeTexto = self.chat().estado;
		self.estadoSignaling = self.videoChat().estado;
		self.errorChatDeTexto = self.chat().error;
		self.errorSignaling = self.videoChat().error;
		
		//HECHO POR MI PARA GUARDAR MENSAJES
		
		self.mensajeQueVoyAEnviar = ko.observable("");
		//self.name = ko.observable("");

		// Header Config
		self.headerConfig = ko.observable({'view':[], 'viewModel':null});
		moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
			self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()})
		})

		self.connected = function() {
			accUtils.announce('Chat page loaded.');
			document.title = "Chat";

			getUsuariosConectados();			
		};


//		self.enviarATodos = function(){  
//			//alert("Mensaje Broadcast guardado en BBDD");
//			var info = {
//					mensajeQueVoyAEnviar : self.mensajeQueVoyAEnviar()
//					//,sender : self.name()
//			};
//			var data = {
//					data : JSON.stringify(info),
//					url : "messages/msgBroadcast",
//					type : "put",
//					contentType : 'application/json',
//					success : function(response) {
//						alert("Mensaje Broadcast guardado en BBDD");
//					},
//					error : function(response) {
//						alert("Error: " + response.responseJSON.error);
//					}
//			};
//			$.ajax(data);    	  
//		}

		
		function getUsuariosConectados() {
			var data = {	
				url : "users/getUsuariosConectados",
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					for (var i=0; i<response.length; i++) {
						var userName = response[i].name;
						var picture = response[i].picture;
						self.chat().addUsuario(userName, picture);
					}
				},
				error : function(response) {
					self.error(response.responseJSON.error);
				}
			};
			$.ajax(data);
		}
		
		
		
		
		
		
		self.encenderVideoLocal = function() {
			self.videoChat().encenderVideoLocal();
		}
		
		self.crearConexion = function() {
			self.videoChat().crearConexion();
		}

		self.enviarOferta = function(destinatario) {
			self.videoChat().enviarOferta(destinatario.nombre);
		}
		
		self.disconnected = function() {
			self.chat().close();
		};

		self.transitionCompleted = function() {
			// Implement if needed
		};
		
		self.registerMsg = function(){
			self.chat().registerMsg();
		};
		
			
		
		
		
//		self.registerMsg = function() {
//			var info = {
//				date : self.name(),
//				message : self.email(),
//				recipient : self.pwd1(),
//				sender : self.pwd2()
//				//picture : self.picture()
//			};
//			var data = {
//					data : JSON.stringify(info),
//					url : "messages/msgBroadcast",
//					type : "put",
//					contentType : 'application/json',
//					success : function(response) {
//						alert("Mensaje guardado correctamente");
//						
//					},
//					error : function(response) {
//						alert("Error: " + response.responseJSON.error);
//					}
//			};
//			$.ajax(data);    	  
//		}
		
			
		
		
	}

	return ChatViewModel;
}
);
