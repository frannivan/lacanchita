package com.lacanchita.dto.request;

import com.lacanchita.entity.Usuario.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private Role role;
}
