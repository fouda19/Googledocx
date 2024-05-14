package com.Apt.Socket;



import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.google.gson.JsonObject;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.jsoup.nodes.Node;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import org.springframework.boot.autoconfigure.jms.JmsProperties.Listener.Session;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.ArrayList;
import org.json.JSONObject;
import com.google.gson.Gson;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import org.json.JSONObject;

public class Socket extends TextWebSocketHandler {
    private static Map<String, Set<WebSocketSession>> docSessionsMap = new HashMap<>();
    private static Map<String, String> docContentMap = new HashMap<>();
    private static Map<String, String> docContentTagsMap = new HashMap<>();
    private static Map<String,Integer> docCounterMap = new HashMap<>();
    private static Map<String, Integer> docCursorMap = new HashMap<>();
    private static Map<String, List<String>> docContentTagsList = new HashMap<>();
    private static Map<String, List<ArrayList<?>>> docChangesMap = new HashMap<>();

    @Override
    public synchronized void handleTextMessage(WebSocketSession session, TextMessage message) {
        // implement your message handling logic here
        //Synchronize el docId bs
        
        Pattern pattern = Pattern.compile("\"(.*?)\":(.*?)(,|\\})");
        Matcher matcher = pattern.matcher(message.getPayload());
        Integer indexInt = 0;
        String character = "";
        Integer counterInt = 0;
        Boolean isDelete = false;
        Boolean isAck = false;
        Boolean isBold = false;
        Boolean isItalic = false;
        Boolean isInsert = false;
        Boolean isBNull = false;
        Boolean isINull = false;
        while (matcher.find()) {
            String key = matcher.group(1);
            String value = matcher.group(2).trim();
            if (key.equals("index")) {
                 indexInt = Integer.parseInt(value);
            } else if (key.equals("character")) {
                 character = value;
                 character = character.replace("\"", "");
            } else if (key.equals("counter")) {
                 String tmp = value.replace("\"", "");
                 counterInt = Integer.parseInt(tmp);
            } else if (key.equals("isDelete")) {
                 isDelete = Boolean.parseBoolean(value);
            } else if (key.equals("isAck")) {
                 isAck = Boolean.parseBoolean(value);
            } else if (key.equals("isBold")) {
                if (value.equals("null")) {
                    isBNull = true;
                }
                 isBold = Boolean.parseBoolean(value);
            } else if (key.equals("isItalic")) {
                if (value.equals("null")) {
                    isINull = true;
                }
                 isItalic = Boolean.parseBoolean(value);
            }
            else if (key.equals("isInsert"))
            {
                isInsert = Boolean.parseBoolean(value);
            } 
            else {
                System.out.println("Invalid key: " + key);
            }
        }
        System.out.println("Index: " + indexInt);
        System.out.println("Character: " + character);
        System.out.println("Counter: " + counterInt);
        System.out.println("isDelete: " + isDelete);
        System.out.println("isAck: " + isAck);
        System.out.println("isBold: " + isBold);
        System.out.println("isItalic: " + isItalic);
        System.out.println("isInsert: " + isInsert);

        
        String documentId = (String) session.getAttributes().get("documentId");
        System.out.println("Document ID: " + documentId);
        String sessionId = session.getId();
        System.out.println("Session ID: " + sessionId);

        if (counterInt < docCounterMap.get(documentId)) {
            indexInt = docCursorMap.get(documentId) + 1;
            System.out.println("Counter is less than docCounterMap");
            System.out.println("Index: " + indexInt);
        } 
        if (counterInt == docCounterMap.get(documentId)) {
            docCursorMap.put(documentId, indexInt);
        }
        // String content = docContentMap.get(documentId);

        // docContentTagsList
        if(isDelete)
        {
            // content = content.substring(0, indexInt) + content.substring(indexInt + 1);
            System.out.println("Tags List Delete Before");
            // docContentTagsList.remove(indexInt);
            if (docContentTagsList.get(documentId) == null) {
                docContentTagsList.put(documentId, new ArrayList<>());
            }
            else
            {
                docContentTagsList.get(documentId).remove(indexInt);
            }
            // docContentTagsList.get(documentId).remove(indexInt);
            System.out.println("Tags List Delete");
            System.out.println(docContentTagsList.get(documentId));
            System.out.println("Delete");
            System.out.println("Index: " + indexInt);
            // System.out.println("Content: " + content);
        }
        else if(isInsert)
        {
            System.out.println("Insert");
            String tags = character;
            System.out.println("Tags List Insert Before");
            if (docContentTagsList.get(documentId) == null) {
                docContentTagsList.put(documentId, new ArrayList<>());
            }
            System.out.println(docContentTagsList.get(documentId));
            if(isBold)
            {
                tags = "<b>" + tags + "</b>";
            }
            if(isItalic)
            {
                tags = "<i>" + tags + "</i>";
            }
            System.out.println("Index NOWW " + indexInt);
            System.out.println("Size NOWW " + docContentTagsList.get(documentId).size());
            docContentTagsList.get(documentId).add(indexInt, tags);
            System.out.println("Tags List Insert");
            System.out.println(docContentTagsList.get(documentId));
            // content = content.substring(0, indexInt) + character + content.substring(indexInt);
           
            // System.out.println("Index: " + indexInt);
            // System.out.println("Content: " + content);
        }
        else
        {
            System.out.println("Update");
            System.out.println("Tags List Before Update");
            System.out.println(docContentTagsList.get(documentId));
            // Boolean isB = false;
            // Boolean isI = false;
            Boolean removeTag = false;
            // Boolean addTag = false;
            if (isBNull || isINull)
            {
                removeTag = true;
            }
            // else
            // {
            //     addTag = true;
            // }

            // if (docContentTagsList.get(documentId).get(indexInt).contains("<b>")) {
            //     isB = true;
            // }
            // if (docContentTagsList.get(documentId).get(indexInt).contains("<i>")) {
            //     isI = true;
            // }
            String removedOldTagsString = docContentTagsList.get(documentId).get(indexInt);
            if (removeTag)
            {
                if(isBNull)
                {
                    removedOldTagsString = removedOldTagsString.replace("<b>", "");
                    removedOldTagsString = removedOldTagsString.replace("</b>", "");
                }
                if(isINull)
                {
                    removedOldTagsString = removedOldTagsString.replace("<i>", "");
                    removedOldTagsString = removedOldTagsString.replace("</i>", "");
                }
            }
            else
            {
                if (isBold) {
                    removedOldTagsString = "<b>" + removedOldTagsString + "</b>";
                }
                if (isItalic) {
                    removedOldTagsString = "<i>" + removedOldTagsString + "</i>";
                }
            }
         
          
            docContentTagsList.get(documentId).set(indexInt, removedOldTagsString);
            System.out.println("Tags List Update");
            System.out.println(docContentTagsList.get(documentId));
           
        }
        // docContentMap.put(documentId, content);
        if (docContentTagsMap.get(documentId) == null) {
            String concatall;
            if (docContentTagsList.get(documentId) == null) {
                concatall = "";
            }
            else
            {
                concatall = String.join("", docContentTagsList.get(documentId));
            }
            docContentTagsMap.put(documentId, concatall);
        }else
        {
            String concatall = String.join("", docContentTagsList.get(documentId));
            docContentTagsMap.put(documentId, concatall);
        }
        Integer myCount = docCounterMap.get(documentId);
        myCount++;
        docCounterMap.put(documentId, myCount);

        Set<WebSocketSession> sessions = docSessionsMap.get(documentId);
        for (WebSocketSession s: sessions)
        {
            if(s.getId() == sessionId)
            {
                String messageToSend = "{\"type\": \"ack\", \"index\": \"" + indexInt + "\", \"character\": \"" + character + "\", \"counter\": \"" + myCount + "\", \"isDelete\": \"" + isDelete + "\", \"isAck\": \"" + true + "\", \"isBold\": \"" + isBold + "\", \"isItalic\": \"" + isItalic + "\"}";
                try {
                    s.sendMessage(new TextMessage(messageToSend));
                    System.out.println("Message sent ACK");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            else
            {
                String messageToSend = "{\"type\": \"update\", \"index\": \"" + indexInt + "\", \"character\": \"" + character + "\", \"counter\": \"" + myCount + "\", \"isDelete\": \"" + isDelete + "\", \"isAck\": \"" + false + "\", \"isBold\": \"" + isBold + "\", \"isItalic\": \"" + isItalic + "\"}";
                try {
                    s.sendMessage(new TextMessage(messageToSend));
                    System.out.println("Message sent UPDATE");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        docCursorMap.put(documentId, indexInt);

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
            String url = "http://172.20.10.2:3003/backend/documents/doc/" + documentId;
            response = restTemplate.getForObject(url, String.class);
            docContentTagsList.put(documentId, new ArrayList<>());
            docContentTagsMap.put(documentId, response);
            docCounterMap.put(documentId, 0);
            docChangesMap.put(documentId, new ArrayList<>());
        }
        String content = docContentTagsMap.get(documentId);
        if (content == null) {
            content = "";
            System.out.println("Content is null");
        }
        // Document doc = Jsoup.parse(content);
        // Elements elements = doc.body().children();

        // for (Element element : elements) {
        //     // If the element has no child elements with tags or only contains text
        //     if (element.children().isEmpty()) {
        //         docContentTagsList.get(documentId).add(element.toString());
        //     } else {
        //         // If it has nested elements, add the whole element
        //         docContentTagsList.get(documentId).add(element.outerHtml());
        //     }
        // }

        // Document doc = Jsoup.parseBodyFragment(content); 
        // // Parses only the body fragment
        // Node node = (Node) doc;
        
        Document doc = Jsoup.parseBodyFragment(content); // Parse only the body fragment
        // Elements elements = doc.body().children(); // Get direct children of the body element

        // Document doc = Jsoup.parseBodyFragment(html); // Parse only the body fragment

        // Traverse all nodes in the document body using NodeVisitor
        // Document doc = Jsoup.parseBodyFragment(html); // Correctly parse the fragment
        List<Node> nodes = doc.body().childNodes(); // Get all child nodes directly under the body

        for (Node node : nodes) {
            if (node instanceof org.jsoup.nodes.TextNode) {
                // Handling text nodes
                String text = ((org.jsoup.nodes.TextNode) node).getWholeText();//shlt trim
                System.out.println("Text: " + text);
                if (!text.isEmpty()) {
                    for (int i = 0; i < text.length(); i++) {
                        docContentTagsList.get(documentId).add(String.valueOf(text.charAt(i)));
                    }
                    // docContentTagsList.get(documentId).add(text);
                }
            } else if (node instanceof org.jsoup.nodes.Element) {
                // Handling element nodes
                docContentTagsList.get(documentId).add(node.outerHtml());
            }
        }

        // Pattern pattern = Pattern.compile("<.*?>|.");
     
        // Matcher matcher = pattern.matcher(content);

        // while (matcher.find()) {
        //     docContentTagsList.get(documentId).add(matcher.group());
        // }
        System.out.println("Tags List");
        System.out.println(docContentTagsList.get(documentId));

        System.out.println("Content");
        System.out.println(content);

        // Convert content with tags string to list of strings
     


        
        
        
        Integer counter = docCounterMap.get(documentId);
        String message = "{\"type\": \"init\", \"content\": \"" + content + "\", \"counter\": \"" + counter + "\"}";        session.sendMessage(new TextMessage(message));

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
        Set<WebSocketSession> sessions = docSessionsMap.get(documentId);

        Integer sizer = 0;
        System.out.println("Document ID: " + documentId);
        System.out.println("Session ID: " + session.getId());
        System.out.println("Document Sessions: " + docSessionsMap.get(documentId));
        System.out.println(sessions);

        if (sessions != null) {
            sizer = sessions.size();
            docSessionsMap.get(documentId).remove(session);
            System.out.println("Document Sessions: " + docSessionsMap.get(documentId).size());
            System.out.println("Document Sessions: " + docSessionsMap.get(documentId));
        }
        else
        {
            System.out.println("Document Sessions: 0");
        }
        
        if (docSessionsMap.get(documentId).size() == 0){
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://172.20.10.2:3003/backend/documents/saveDoc/" + documentId;
            String content = docContentTagsMap.get(documentId);
            // if (content == null) {
            //     content = "-1";

            // }
            String contentJsonFormat = "{\"content\": \"" + content + "\"}";
            String response = restTemplate.postForObject(url, contentJsonFormat, String.class);
            System.out.println(response);
            System.out.println("RESPONSEE FOOOOOO");
            docSessionsMap.remove(documentId);
            // docContentMap.remove(documentId);
            docContentTagsList.remove(documentId);
            docContentTagsMap.remove(documentId);
        }


        // implement your connection closing logic here
    }
}