package org.example.service;

import org.example.dto.RetroCardDTO;
import org.example.dto.UserDTO;

import java.util.List;

public interface RetroCardService {
    RetroCardDTO createRetroCard(RetroCardDTO retroCardDTO);
    RetroCardDTO getRetroCardById(Long id);
    List<RetroCardDTO> getAllRetroCards();
    RetroCardDTO updateRetroCard(Long id, RetroCardDTO retroCardDTO);
    void deleteRetroCard(Long id);
    RetroCardDTO likeRetroCard(Long id, UserDTO user);
    void clearBoard(UserDTO deletedBy);
}