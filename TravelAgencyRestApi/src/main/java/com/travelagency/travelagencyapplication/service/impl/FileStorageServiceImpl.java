package com.travelagency.travelagencyapplication.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.travelagency.travelagencyapplication.service.IFileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Service
public class FileStorageServiceImpl implements IFileStorageService {

    private final Cloudinary cloudinary;

    public FileStorageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }
    }

    public Set<String> uploadFile(Set<MultipartFile> files) {
        Set<String> cloudinaryResponseList = new HashSet<>();
        for (MultipartFile file : files) {
            String response = uploadFile(file);
            cloudinaryResponseList.add(response);
        }
        return cloudinaryResponseList;
    }

    public String updateFile(String imageUrl, MultipartFile file) {
        try {
            if(imageUrl == null){
                return uploadFile(file);
            }
            Map<String, Object> deleteResult = removeFileByUrl(imageUrl);

            if ("ok".equals(deleteResult.get("result"))) {
                return uploadFile(file);
            } else {
                throw new RuntimeException("File deleted failed .");
            }

        } catch (Exception e) {
            throw new RuntimeException("File update failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Set<String> updateFile(Set<String> imageUrls, Set<MultipartFile> files) {
        Set<String> images = new HashSet<>();
        for (String imageUrl : imageUrls){
            try {
                removeFileByUrl(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("File deleted failed");
            }
        }
        for (MultipartFile file : files){
            String uploadedFile = uploadFile(file);
            images.add(uploadedFile);
        }
        return images;
    }


    public String deleteFile(String imageUrl) {
        try {
            Map<String, Object> deleteResult = removeFileByUrl(imageUrl);
            return deleteResult.get("result").toString();
        } catch (Exception e) {
            throw new RuntimeException("File deletion failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Set<String> deleteFile(Set<String> imageUrl) {
        Set<String> images = new HashSet<>();
        for (String url : imageUrl){
            String deleteFile = deleteFile(url);
            images.add(deleteFile);
        }
        return images;
    }


    private Map<String, Object> removeFile(String publicId) {
        try {
            return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("File removal failed: " + e.getMessage(), e);
        }
    }

    private String getPublicIdFromUrl(URL url) {
        String path = url.getPath();
        return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    }

    private Map<String, Object> removeFileByUrl(String imageUrl) throws IOException {
        URL url = new URL(imageUrl);
        String publicId = getPublicIdFromUrl(url);
        return removeFile(publicId);
    }

}
