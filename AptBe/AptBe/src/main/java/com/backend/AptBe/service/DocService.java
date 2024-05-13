package com.backend.AptBe.service;


import java.util.List;
import com.backend.AptBe.token.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.AptBe.model.Doc;
import java.util.Optional;
import com.backend.AptBe.repo.DocRepo;
import com.backend.AptBe.model.User;
import org.mindrot.jbcrypt.BCrypt;
import java.util.Date;
import com.backend.AptBe.repo.UserRepo;



@Service
public class DocService {
    @Autowired
    private DocRepo docRepo;


    public Optional<Doc> getDocById(String _id)
    {
        return docRepo.findById(_id);
    }


    public Doc addDoc (User user,String docName)
    {
        System.out.println("DocName: "+docName);
        // Remove the quotes from the docName
        docName = docName.replace("\"", "");
        System.out.println("DocName: "+docName);
        System.out.println("User: "+user.get_id());
        List<Doc> exists = docRepo.findByOwner(user.get_id());
        System.out.println("Exists: "+exists);
        if(exists != null && exists.size() > 0)
        {
            for(Doc doc : exists)
            {
                if(doc.getName().equals(docName))
                {
                    System.out.println("Doc with this name already exists");
                    return null;
                }
            }
        }
            Doc newDoc = new Doc();
            newDoc.setOwner(user);
            Date now = new Date();
            newDoc.setCreationDate(now.toString());
            newDoc.setContent("");
            docName = docName.replace("\"", "");
            newDoc.setName(docName);
            try {
                docRepo.save(newDoc);
                return newDoc;
            } catch (Exception e) {
                return null;
            }

        
       
    }

    public boolean removeDoc(String _id)
    {
        _id = _id.replace("\"", "");
        Optional<Doc> optionalDoc = docRepo.findById(_id);
    if (optionalDoc.isPresent()) {
        Doc docDel = optionalDoc.get();
        System.out.println(docDel);
        System.out.println("ANA BABA YALA");
        docRepo.delete(docDel);
        return true;
    } else {
        // Handle the case where the document was not found
        System.out.println("No document found with ID: " + _id);
        return false;
    }
    }


    public boolean addEditor(String _id, User user)
    {
        Optional<Doc> docOptional = docRepo.findById(_id);
        if(docOptional.isPresent())
        {
            Doc doc = docOptional.get();
            doc.addEditor(user);
            try {
                docRepo.save(doc);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    public boolean addViewer(String _id, User user)
    {
        Optional<Doc> docOptional = docRepo.findById(_id);
        if(docOptional.isPresent())
        {
            Doc doc = docOptional.get();
            doc.addViewer(user);
            try {
                docRepo.save(doc);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    public boolean isOwner (String _id, User user)
    {
        Optional<Doc> docOptional = docRepo.findById(_id);
        if(docOptional.isPresent())
        {
            Doc doc = docOptional.get();
            if(doc.getOwner().equals(user))
            {
                return true;
            }
        }
        return false;
    }

    public boolean isEditor (String _id, User user)
    {
        Optional<Doc> docOptional = docRepo.findById(_id);
        if(docOptional.isPresent())
        {
            Doc doc = docOptional.get();
            for(User editor : doc.getEditors())
            {
                if(editor.equals(user))
                {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean isViewer (String _id, User user)
    {
        Optional<Doc> docOptional = docRepo.findById(_id);
        if(docOptional.isPresent())
        {
            Doc doc = docOptional.get();
            for(User viewer : doc.getViewers())
            {
                if(viewer.equals(user))
                {
                    return true;
                }
            }
        }
        return false;
    }

    public List<Doc> getDocsByOwner(String _id)
    {
        return docRepo.findByOwner(_id);
    }

    public List<Doc> getDocsByEditor(String _id)
    {
        return docRepo.findByEditors(_id);
    }

    public List<Doc> getDocsByViewer(String _id)
    {
        return docRepo.findByViewers(_id);
    }

    public List<Doc> getEditorViewerDocs(String _id)
    {
        List<Doc> editorDocs = docRepo.findByEditors(_id);
        List<Doc> viewerDocs = docRepo.findByViewers(_id);
        for(Doc doc : viewerDocs)
        {
            if(!editorDocs.contains(doc))
            {
                editorDocs.add(doc);
            }
        }
        return editorDocs;
    }
    
    public List<Doc> getAccessableDocs(String _id)
    {
        List<Doc> editorViewerDocs = getEditorViewerDocs(_id);
        List<Doc> ownerDocs = getDocsByOwner(_id);
        for(Doc doc : ownerDocs)
        {
            if(!editorViewerDocs.contains(doc))
            {
                editorViewerDocs.add(doc);
            }
        }
        return editorViewerDocs;
    }

 public boolean renameDoc(String _id, String newName)
{
    System.out.println("Renaming doc");
    System.out.println("ID: "+_id);
    System.out.println("NewName: "+newName);
    String ownerID = docRepo.findById(_id).get().getOwner().get_id();
    
    List<Doc> docs = docRepo.findByOwner(ownerID);
    for(Doc doc : docs)
    {
        if(doc.getName().equals(newName))
        {
            return false;
        }
    }

    Optional<Doc> docOptional = docRepo.findById(_id);
    if(docOptional.isPresent())
    {
        Doc doc = docOptional.get();
        doc.setName(newName);
        try {
            docRepo.save(doc);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    return false;
}
public boolean shareView(String _id, User user)
{
    System.out.println("Sharing view");
    System.out.println("User: "+user);
    System.out.println("Doc: "+_id);
    return shareDoc(_id,user,false);
}
public boolean shareEdit(String _id, User user)
{
    return shareDoc(_id,user,true);
}


public boolean shareDoc(String _id, User user,boolean isEditor)
{
    Optional<Doc> docOptional = docRepo.findById(_id);
    if(docOptional.isPresent())
    {
        Doc doc = docOptional.get();
        if(isEditor)
        {
            doc.addEditor(user);
        }
        else
        {
            doc.addViewer(user);
        }
        try {
            docRepo.save(doc);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    return false;
}

public List<Doc> getDocs(User user, String sortParam)
{
    if(sortParam.equals("me"))
    {
        return getDocsByOwner(user.get_id());
    }
    else if(sortParam.equals("others"))
    {
        return getEditorViewerDocs(user.get_id());
    }
    else if(sortParam.equals("all"))
    {
        return getAccessableDocs(user.get_id());
    }
    else
    {
        return null;
    }
}

public Doc getDoc(String _id)
{
    return docRepo.findById(_id).get();
}

public boolean saveDoc(String _id, String content)
{
    Optional<Doc> docOptional = docRepo.findById(_id);
    if(docOptional.isPresent())
    {
        Doc doc = docOptional.get();
        doc.setContent(content);
        try {
            docRepo.save(doc);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    return false;
}

}