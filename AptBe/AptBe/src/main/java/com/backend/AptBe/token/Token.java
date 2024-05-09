package com.backend.AptBe.token;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
import java.util.Date;


public class Token {

    
    private static final String secret = "81aad74d40510bfa195c82e414f41b716129c521da4f4e32aa4421408abb8ff5fmahagaabdomidofoudamohysetsuggestsortkindofrmabayr81aad74d40510bfa195c82e414f41b716129c521da4f4e32aa4421408abb8ff5";
    private static final long expirationMs = 86400000;
    


    private static SecretKey getTempKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String _id)
    {
        System.out.println(secret);
        System.out.println("ANA SECRET");
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
