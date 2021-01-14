package edu.uclm.esi.videochat.springdao;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import edu.uclm.esi.videochat.model.Message;
//import edu.uclm.esi.videochat.model.User;


public interface MessageRepository extends CrudRepository <Message, String> {

	@Query(value = "SELECT count(*) FROM message where sender=:sender", nativeQuery = true)
//	
	//public Message findBySender(String sender);
	public Optional<Message> findBySender(String sender);
	
}
