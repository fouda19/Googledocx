package com.backend.AptBe.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Document(collection = "user")
@AllArgsConstructor
@Validated
public class User {
    
    @Id
    private String _id;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;   

    @NotBlank
    private String birthDay;

    @NotBlank
    private String birthMonth;

    @NotBlank
    private String birthYear;

    @NotBlank
    @Size(min = 8,max = 30)
    private String password;

    private List<String> activeTokens;

    public User()
    {
        activeTokens = new ArrayList<String>();
    }

    public void addToken(String token)
    {
        activeTokens.add(token);
    }

    public void removeToken(String token)
    {
        activeTokens.remove(token);
    }
}
