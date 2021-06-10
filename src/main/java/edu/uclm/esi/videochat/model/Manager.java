package edu.uclm.esi.videochat.model;

import java.util.Enumeration;
import java.util.List;
import java.util.Vector;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import edu.uclm.esi.videochat.springdao.MessageRepository;

@Component
public class Manager {

	private ConcurrentHashMap<String, User> usersMap;
	private ConcurrentHashMap<String, HttpSession> sessions;

//	@Autowired
//	private MessageRepository messageRepo;
//	
//	public MessageRepository getMessageRepo() {
//		return messageRepo;
//	}

	private Manager() {

		this.usersMap = new ConcurrentHashMap<>();
		this.sessions = new ConcurrentHashMap<>();
	}

	private static class ManagerHolder {
		static Manager singleton = new Manager();
	}

	@Autowired
	public void print() {

		System.out.println("Creando manager");
	}

	@Bean
	public static Manager get() {
		return ManagerHolder.singleton;
	}

	public void add(User user) {
		usersMap.put(user.getName(), user);
	}

	public void remove(User user) {
		this.usersMap.remove(user.getName());
	}

	public String getAvatar(String name) {
		String imagen = "";
		Enumeration<User> eUsers = this.usersMap.elements();
		User selected = new User();
		while (eUsers.hasMoreElements()) {
			selected = eUsers.nextElement();
			if ((selected.getName()).equals(name)) {
				imagen = selected.getPicture();
			}
		}

		return imagen;
	}

	public List<String> getUsuariosConectados() {
		List<String> users = new Vector<>();
		Enumeration<User> eUsers = this.usersMap.elements();
		while (eUsers.hasMoreElements()) {
			String user = eUsers.nextElement().getName();
			// user.setPwd(null);
			users.add(user);
		}
		// users.remove(0);
		return users;
	}

	public HttpSession getSession(String sessionId) {
		return this.sessions.get(sessionId);
	}

	public void add(HttpSession session) {
		this.sessions.put(session.getId(), session);
	}

	public User findUser(String userName) {
		return this.usersMap.get(userName);
	}

}
