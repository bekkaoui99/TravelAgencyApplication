package com.travelagency.travelagencyapplication.controller;


import com.travelagency.travelagencyapplication.dto.request.ClientRequest;
import com.travelagency.travelagencyapplication.dto.request.UploadClientImageRequest;
import com.travelagency.travelagencyapplication.dto.response.ClientResponse;
import com.travelagency.travelagencyapplication.security.service.IAuthenticationService;
import com.travelagency.travelagencyapplication.service.IClientService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/clients")
public class ClientController {

    private final IClientService clientService;
    private final IAuthenticationService authenticationService;

    public ClientController(IClientService clientService, IAuthenticationService authenticationService) {
        this.clientService = clientService;
        this.authenticationService = authenticationService;
    }

    @PostMapping
    public ClientResponse create(@ModelAttribute ClientRequest clientRequest) {
        return this.authenticationService.clientRegistration(clientRequest);
    }

//    @PostMapping("/uploadImage")
//    public ClientResponse uploadClientImage(@ModelAttribute UploadClientImageRequest clientRequest) {
//        return this.authenticationService.uploadClientImage(clientRequest.getId(), clientRequest.getClientImage());
//    }
//
//    @PostMapping("/{clientId}/uploadImage")
//    public ClientResponse uploadImage(@PathVariable String clientId, @RequestParam("imageFile") MultipartFile imageFile) {
//        return this.authenticationService.uploadClientImage(clientId, imageFile);
//    }

    @GetMapping("/list")
    public List<ClientResponse> getClients(){
        return this.clientService.findAll();
    }

    @GetMapping("/page")
    public Page<ClientResponse> getClients(
            @RequestParam(name = "pageNumber" , defaultValue = "0") int pageNumber ,
            @RequestParam(name = "pageSize" , defaultValue = "5") int pageSize){
        return this.clientService.findAll(pageNumber , pageSize);
    }

    @PutMapping("/{id}")
    public ClientResponse updateClient(@PathVariable  String id ,
                                       @ModelAttribute ClientRequest clientRequest){
        return this.clientService.update(clientRequest , id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteClient(@PathVariable  String id ){
        return new ResponseEntity<>(this.clientService.delete(id) , HttpStatus.OK) ;
    }

}
