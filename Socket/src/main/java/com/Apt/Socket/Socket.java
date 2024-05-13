package com.Apt.Socket;



import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.springframework.web.client.RestTemplate;

public class Socket extends TextWebSocketHandler {
    private static Map<String, Set<WebSocketSession>> docSessionsMap = new HashMap<>();
    private static Map<String, String> docContentMap = new HashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        // implement your message handling logic here
        System.out.println("Message received");
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connection established");
        System.out.println("MDDDD");
        System.out.println(session.getAttributes());
        
        String documentId = (String) session.getAttributes().get("documentId");
        System.out.println("DMMMM");
        String sessionID = session.getId();
        System.out.println("Session ID: " + sessionID);

        System.out.println("Document ID: " + documentId);
        String response = "";
        if (!docSessionsMap.containsKey(documentId)) {
            docSessionsMap.put(documentId, new HashSet<>());
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://192.168.100.4:3003/backend/documents/doc/" + documentId;
            response = restTemplate.getForObject(url, String.class);
            docContentMap.put(documentId, response);
        }
        String content = docContentMap.get(documentId);
        String message = "{\"type\": \"init\", \"content\": \"" + content + "\"}";
        session.sendMessage(new TextMessage(message));

        docSessionsMap.get(documentId).add(session);
        System.out.println("Document Sessions: " + docSessionsMap.get(documentId).size());
        System.out.println("Document Sessions: " + docSessionsMap.get(documentId));
        
        System.out.println(response);
        System.out.println("RESPONSEE FOOOOOO2");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed");
        String documentId = (String) session.getAttributes().get("documentId");
        docSessionsMap.get(documentId).remove(session);
        System.out.println("Document Sessions: " + docSessionsMap.get(documentId).size());
        System.out.println("Document Sessions: " + docSessionsMap.get(documentId));
        if (docSessionsMap.get(documentId).size() == 0) {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://192.168.100.4:3003/backend/documents/saveDoc/" + documentId;
            String content = docContentMap.get(documentId);
            String response = restTemplate.postForObject(url, content, String.class);
            System.out.println(response);
            System.out.println("RESPONSEE FOOOOOO");
            docSessionsMap.remove(documentId);
            docContentMap.remove(documentId);
        }


        // implement your connection closing logic here
    }
}