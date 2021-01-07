package edu.uclm.esi.videochat.http;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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
	public void register(@RequestBody Map<String, Object> credenciales) throws Exception {
		JSONObject jso = new JSONObject(credenciales);
		String id = jso.getString("id");
		Long date = jso.getLong("date");
		String messageContenido = jso.getString("message");
		String recipient = jso.getString("recipient");
		String sender = jso.getString("sender");
		
		
		Message message = new Message();
		message.setId(id);
		message.setDate(date);
		message.setMessage(messageContenido);
		message.setRecipient(recipient);
		message.setSender(sender);
		
//		String picture = jso.optString("picture");
//		user.setPicture(picture);
		msgRepo.save(message);		
	}
	
}
