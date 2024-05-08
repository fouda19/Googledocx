package com.backend.AptBe.token;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
import java.util.Date;


public class Token {

    @Value("${jwtSecret}")
    private static String  secret;
    
    @Value("${jwtExpirationMs}")
    private static long expirationMs;

    private SecretKey getTempKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String _id)
    {
        return Jwts.builder()
        .setSubject(_id)
        .setIssuedAt(new Date())
        .setExpiration(new Date((new Date()).getTime() + expirationMs))
        .signWith(getTempKey(), SignatureAlgorithm.HS256)
        .compact();
    }

    public String getIdFromToken(String token)
    {
        return Jwts.parserBuilder()
        .setSigningKey(getTempKey())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
    }
    
}
