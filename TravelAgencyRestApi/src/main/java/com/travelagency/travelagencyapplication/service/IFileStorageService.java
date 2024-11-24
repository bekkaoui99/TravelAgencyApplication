package com.travelagency.travelagencyapplication.service;

import com.cloudinary.utils.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IFileStorageService {

     String uploadFile(MultipartFile file);
     Set<String> uploadFile(Set<MultipartFile> files);

     String updateFile(String imageUrl, MultipartFile file);
     Set<String> updateFile(Set<String> imageUrl ,Set<MultipartFile> files);

     String deleteFile(String imageUrl);
     Set<String> deleteFile(Set<String> imageUrl);

}
