package edu.uclm.esi.videochat.springdao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import edu.uclm.esi.videochat.model.Message;
//import edu.uclm.esi.videochat.model.User;


public interface MessageRepository extends CrudRepository <Message, String> {

	@Query(value = "SELECT count(*) FROM message where recipient=:recipient and sender=:sender", nativeQuery = true)
	public int checkPassword(@Param("recipient") String recipient,@Param("sender") String sender);
//	
	//public Message findBySender(String sender);
	public List<Message> findByRecipientAndSenderOrderByDate(String recipient, String sender);
	//public Message findByRecipientAndSender(String recipient, String sender);
	
	

	
	
	
}
