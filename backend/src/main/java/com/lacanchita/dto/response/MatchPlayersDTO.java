package com.lacanchita.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MatchPlayersDTO {
    private List<PlayerDTO> localPlayers;
    private List<PlayerDTO> visitorPlayers;
}
