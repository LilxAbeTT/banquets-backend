package com.banquets.service;

import com.banquets.dto.LoginRequest;
import com.banquets.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
