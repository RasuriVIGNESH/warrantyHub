package com.warrantyhub.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Document information associated with a device")
public class DocumentDTO {
    @Schema(description = "Unique identifier of the document", example = "1")
    private String id;

    @Schema(description = "Name of the document", example = "Purchase Receipt.pdf")
    private String name;

    @Schema(description = "Type of the document file", example = "application/pdf")
    private String fileType;

    @Schema(description = "URL to access the document file", example = "http://localhost:8080/api/documents/1/download")
    private String fileUrl;

    @Schema(description = "Size of the document file in bytes", example = "1024000")
    private Long fileSize;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Date when the document was uploaded", example = "2023-01-16")
    private LocalDate uploadDate;
}

