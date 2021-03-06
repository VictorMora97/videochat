define(
		[ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils' ],
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

				// Header Config
				self.headerConfig = ko.observable({
					'view' : [],
					'viewModel' : null
				});
				moduleUtils.createView({
					'viewPath' : 'views/header.html'
				}).then(function(view) {
					self.headerConfig({
						'view' : view,
						'viewModel' : app.getHeaderModel()
					})
				})

				self.connected = function() {
					accUtils.announce('Chat page loaded.');
					document.title = "Chat";

					getUsuariosConectados();
				};

				function getAvatar(name, listSize) {
					var data = {
						url : "users/getAvatar/" + name,
						type : "get",
						contentType : 'application/json',
						success : function(response) {
							self.chat().addAvatar(name, response.responseText,
									listSize);
							//return response;
						},
						error : function(response) {
							self.chat().addAvatar(name, response.responseText,
									listSize);
							//self.error(response.responseJSON.error);
						}
					};
					$.ajax(data);
				}

				function getUsuariosConectados() {
					var data = {
						url : "users/getUsuariosConectados",
						type : "get",
						contentType : 'application/json',
						success : function(response) {
							var listSize = response.length;
							for (var i = 0; i < response.length; i++) {
								var userName = response[i];
								self.chat().addUsuario(userName, "");
								getAvatar(userName, listSize);

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

			}

			return ChatViewModel;
		});
