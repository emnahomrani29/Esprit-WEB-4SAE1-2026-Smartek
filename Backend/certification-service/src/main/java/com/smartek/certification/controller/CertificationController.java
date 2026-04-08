package com.smartek.certification.controller;

import com.smartek.certification.dto.CertificationDTO;
import com.smartek.certification.dto.CertificationRequest;
import com.smartek.certification.entity.Certification;
import com.smartek.certification.service.CertificationService;
import com.smartek.certification.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;
    private final PdfService pdfService;

    // Créer une certification (appelé par examen-service après réussite)
    @PostMapping
    public ResponseEntity<CertificationDTO> creer(@RequestBody CertificationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificationService.creer(req));
    }

    // Toutes les certifications (admin)
    @GetMapping
    public ResponseEntity<List<CertificationDTO>> getAll() {
        return ResponseEntity.ok(certificationService.getAll());
    }

    // Certifications d'un apprenant
    @GetMapping("/apprenant/{apprenantId}")
    public ResponseEntity<List<CertificationDTO>> getByApprenant(@PathVariable String apprenantId) {
        return ResponseEntity.ok(certificationService.getByApprenant(apprenantId));
    }

    // Télécharger le PDF d'une certification
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        try {
            Certification cert = certificationService.getEntityById(id);
            byte[] pdf = pdfService.genererCertificat(cert);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "certificat-" + cert.getNumeroCertificat() + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
