package edu.uclm.esi.videochat.http;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import edu.uclm.esi.videochat.model.Email;
import edu.uclm.esi.videochat.model.Manager;
import edu.uclm.esi.videochat.model.Message;
import edu.uclm.esi.videochat.model.Token;
import edu.uclm.esi.videochat.model.User;
import edu.uclm.esi.videochat.springdao.MessageRepository;
import edu.uclm.esi.videochat.springdao.TokenRepository;
import edu.uclm.esi.videochat.springdao.UserRepository;


@RestController
@RequestMapping("messages")
public class MessagesController {
	
	@Autowired
	private MessageRepository msgRepo;
	
	
	@PutMapping("/msgBroadcast")
	public void msgBroadcast(@RequestBody Map<String, Object> mensaje) throws Exception {
		JSONObject jso = new JSONObject(mensaje);

		String contenido = jso.getString("mensajeQueVoyAEnviar");
		String sender = jso.getString("sender");
		//String enviador = jso.getString("sender");

		Message message = new Message();
//		Date date = new Date();
//		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
//		String strDate= formatter.format(date);
		long date = System.currentTimeMillis();
		message.setDate(date);
		message.setMessage(contenido);
		message.setRecipient("Broadcast");
		message.setSender(sender);

		
//		String picture = jso.optString("picture");
//		user.setPicture(picture);
		msgRepo.save(message);		
	}
	
	@PutMapping("/msgPrivado")
	public void msgPrivado(@RequestBody Map<String, Object> mensaje) throws Exception {
		JSONObject jso = new JSONObject(mensaje);

		String contenido = jso.getString("textoAEnviar");
		String sender = jso.getString("sender");
		String recipient = jso.getString("recipient");
		//String enviador = jso.getString("sender");

		Message message = new Message();
//		Date date = new Date();
//		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
//		String strDate= formatter.format(date);
		long date = System.currentTimeMillis();
		message.setDate(date);
		message.setMessage(contenido);
		message.setRecipient(recipient);
		message.setSender(sender);

		
//		String picture = jso.optString("picture");
//		user.setPicture(picture);
		msgRepo.save(message);		
	}
	
	
	
	@PostMapping(value = "/getHistorial")
	public List<Message> getHistorial(HttpServletRequest request, @RequestBody Map<String, Object> credenciales) throws Exception {
		JSONObject jso = new JSONObject(credenciales);
		String sender = jso.getString("sender");
		String recipient = jso.getString("recipient");

		List<Message> msg = msgRepo.findByRecipientAndSenderOrderByDate(recipient, sender);
		
//    	Message msg = new Message();
//    	msg.setSender(sender);
//    	msg.setRecipient(recipient);
   	

		return msg;
	}
	
	
//	@GetMapping(value = "/getHistorial")
//	public Message getHistorial(HttpServletRequest request, @RequestBody Map<String, Object> mensaje) throws Exception {
//		JSONObject jso = new JSONObject(mensaje);
//		String sender = jso.getString("sender");
//		String recipient = jso.getString("recipient");
//		
//		Message message = msgRepo.findBySenderAndRecipient(sender, recipient);
//		if (message==null)
//			throw new Exception("Incorrect get message");
//
//		return message;
//	}
	
	
//    @GetMapping("/getHistorial")
//    public String getHistorial(@RequestParam String sender, @RequestParam String recipient) {
// 
//    	//Message msg = msgRepo.findBySenderAndRecipient(sender, recipient);
//    	Message msg = new Message();
//    	msg.setSender(sender);
//    	msg.setRecipient(recipient);
//    	
////    	List<String> historial = new Vector<String>();
////    	historial.add(sender);
////    	historial.add(sender);
//    	
//        return sender;
// 
//    }
	
	
}
