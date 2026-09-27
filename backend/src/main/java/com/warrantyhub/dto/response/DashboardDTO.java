package com.warrantyhub.dto.response;
import lombok.*;
import java.math.BigDecimal;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DashboardDTO {
    private Stats stats;
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class Stats { private long totalDevices; private long activeCoverage; private long expiringSoon; private long expired; private BigDecimal protectedValue; private long missingDocuments; private int recordCompleteness; }
}
