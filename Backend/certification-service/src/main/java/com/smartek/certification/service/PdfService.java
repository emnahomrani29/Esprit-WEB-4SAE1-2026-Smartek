package com.smartek.certification.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.smartek.certification.entity.Certification;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] genererCertificat(Certification cert) throws Exception {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        // Fond coloré
        PdfContentByte canvas = writer.getDirectContentUnder();
        canvas.setColorFill(new BaseColor(240, 248, 255));
        canvas.rectangle(0, 0, document.getPageSize().getWidth(), document.getPageSize().getHeight());
        canvas.fill();

        // Bordure décorative
        canvas.setColorStroke(new BaseColor(30, 100, 200));
        canvas.setLineWidth(8);
        canvas.rectangle(20, 20, document.getPageSize().getWidth() - 40, document.getPageSize().getHeight() - 40);
        canvas.stroke();
        canvas.setColorStroke(new BaseColor(100, 160, 240));
        canvas.setLineWidth(2);
        canvas.rectangle(28, 28, document.getPageSize().getWidth() - 56, document.getPageSize().getHeight() - 56);
        canvas.stroke();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 36, Font.BOLD, new BaseColor(30, 100, 200));
        Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.ITALIC, BaseColor.DARK_GRAY);
        Font nameFont = new Font(Font.FontFamily.HELVETICA, 28, Font.BOLD, new BaseColor(20, 80, 160));
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 14, Font.NORMAL, BaseColor.DARK_GRAY);
        Font smallFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.GRAY);

        document.add(new Paragraph("\n\n"));

        // Titre
        Paragraph title = new Paragraph("CERTIFICAT DE RÉUSSITE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("\n"));

        Paragraph subtitle = new Paragraph("SMARTEK — Plateforme d'apprentissage", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subtitle);

        // Ligne séparatrice
        document.add(new Paragraph("\n"));
        LineSeparator ls = new LineSeparator();
        ls.setLineColor(new BaseColor(30, 100, 200));
        document.add(new Chunk(ls));
        document.add(new Paragraph("\n"));

        // Corps
        Paragraph certifie = new Paragraph("Ce certificat est décerné à", bodyFont);
        certifie.setAlignment(Element.ALIGN_CENTER);
        document.add(certifie);

        document.add(new Paragraph("\n"));

        Paragraph nom = new Paragraph(cert.getApprenantNom().toUpperCase(), nameFont);
        nom.setAlignment(Element.ALIGN_CENTER);
        document.add(nom);

        document.add(new Paragraph("\n"));

        Paragraph pour = new Paragraph("pour avoir réussi avec succès l'examen", bodyFont);
        pour.setAlignment(Element.ALIGN_CENTER);
        document.add(pour);

        document.add(new Paragraph("\n"));

        Font examFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLDITALIC, new BaseColor(30, 100, 200));
        Paragraph examen = new Paragraph("« " + cert.getExamenTitre() + " »", examFont);
        examen.setAlignment(Element.ALIGN_CENTER);
        document.add(examen);

        document.add(new Paragraph("\n"));

        Paragraph score = new Paragraph("Score obtenu : " + cert.getScore() + "%", bodyFont);
        score.setAlignment(Element.ALIGN_CENTER);
        document.add(score);

        document.add(new Paragraph("\n\n"));
        document.add(new Chunk(ls));
        document.add(new Paragraph("\n"));

        // Pied de page
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        Paragraph footer = new Paragraph(
            "Délivré le : " + cert.getDelivreeLe().format(fmt) +
            "     |     N° : " + cert.getNumeroCertificat(), smallFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }
}
