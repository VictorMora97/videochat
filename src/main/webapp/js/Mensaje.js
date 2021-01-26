class Mensaje {
	constructor(texto, hora) {
		this.texto = texto;
		this.hora = hora ? hora : Date.now();
		var fecha = new Date(Date.now());
		this.horaFormateada = "["+fecha.toLocaleString()+"]";
	}
}