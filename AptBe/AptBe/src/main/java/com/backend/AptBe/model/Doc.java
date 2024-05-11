package com.backend.AptBe.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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
@Document(collection = "doc")
@AllArgsConstructor
@Validated
public class Doc {

    @Id
    private String _id;

    @NotBlank
    @Size(min = 1, max = 40)
    private String name;

    @DBRef
    private User owner;

    @NotBlank
    private String creationDate;

    private String content;

    @DBRef
    private List<User> editors;

    @DBRef
    private List<User> viewers;

    public Doc()
    {
        editors = new ArrayList<User>();
        viewers = new ArrayList<User>();
    }

    public void addEditor(User editor)
    {
        editors.add(editor);
    }

    public void addViewer(User viewer)
    {
        viewers.add(viewer);
    }

}
