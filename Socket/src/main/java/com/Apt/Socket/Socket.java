package com.Apt.Socket;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


@ServerEndpoint("/editor/{documentId}")
@Component
public class Socket {
    private static Map<String, Set<Session>> docSessionsMap = new HashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("documentId") String documentId) {
        
        if (!docSessionsMap.containsKey(documentId)) {
            docSessionsMap.put(documentId, new HashSet<>());

        }
        docSessionsMap.get(documentId).add(session);
    }
    String url = "http://localhost:3003/backend/documents/hello";
    ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    System.out.println(response.getBody());


    
}
