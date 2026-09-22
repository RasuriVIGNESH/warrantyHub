package com.warrantyhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "documents")
public class Document {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false,length = 500)
	private String fileURL;

	@Column(nullable = false)
	private String fileType;

	@Column(nullable = false)
	private Long fileSize;

	@Column(nullable = false)
	private LocalDate uploadDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "device_id", nullable = false)
	private Device device;

	public Document(String name,String URL, String fileType, Long fileSize,
					LocalDate uploadDate, Device device) {
		this.name = name;
		this.fileURL=URL;
		this.fileType = fileType;
		this.fileSize = fileSize;
		this.uploadDate = uploadDate;
		this.device = device;
	}


}

