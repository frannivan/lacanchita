package com.lacanchita.service;

import com.lacanchita.dto.response.MatchDetailDTO;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class OGImageService {

    public byte[] generateMatchImage(MatchDetailDTO match) throws IOException {
        int width = 1200;
        int height = 630;

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = image.createGraphics();

        // Enable anti-aliasing
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Background (Gradient Green)
        GradientPaint gp = new GradientPaint(0, 0, new Color(4, 120, 87), width, height, new Color(6, 78, 59));
        g2d.setPaint(gp);
        g2d.fillRect(0, 0, width, height);

        // Draw Pattern (Optional subtle overlay)
        g2d.setColor(new Color(255, 255, 255, 10));
        for (int i = 0; i < width; i += 40) {
            g2d.drawLine(i, 0, i, height);
        }

        // Fonts
        Font titleFont = new Font("Arial", Font.BOLD, 60);
        Font subtitleFont = new Font("Arial", Font.BOLD, 30);
        Font vsFont = new Font("Arial", Font.BOLD, 80);
        Font detailFont = new Font("Arial", Font.PLAIN, 30);

        // Header (Tournament)
        g2d.setColor(Color.WHITE);
        g2d.setFont(subtitleFont);
        drawCenteredString(g2d, match.getTorneoNombre().toUpperCase(), width / 2, 80);

        g2d.setFont(new Font("Arial", Font.PLAIN, 24));
        g2d.setColor(new Color(167, 243, 208)); // Emerald 200
        drawCenteredString(g2d, match.getCategoria().toUpperCase(), width / 2, 120);

        // VS Center
        g2d.setColor(new Color(255, 255, 255, 50));
        g2d.fillOval(width / 2 - 60, height / 2 - 60, 120, 120);

        g2d.setColor(Color.WHITE);
        g2d.setFont(vsFont);
        drawCenteredString(g2d, "VS", width / 2, height / 2 + 30);

        // Teams
        g2d.setFont(titleFont);

        // Local (Left)
        drawScaledCenteredString(g2d, match.getEquipoLocal(), width / 4, height / 2, 400, titleFont);
        g2d.setFont(new Font("Arial", Font.BOLD, 20));
        g2d.setColor(new Color(167, 243, 208));
        drawCenteredString(g2d, "LOCAL", width / 4, height / 2 + 50);

        // Visitor (Right)
        g2d.setColor(Color.WHITE);
        drawScaledCenteredString(g2d, match.getEquipoVisitante(), 3 * width / 4, height / 2, 400, titleFont);
        g2d.setFont(new Font("Arial", Font.BOLD, 20));
        g2d.setColor(new Color(167, 243, 208));
        drawCenteredString(g2d, "VISITANTE", 3 * width / 4, height / 2 + 50);

        // Footer Box
        g2d.setColor(new Color(255, 255, 255, 240));
        g2d.fillRoundRect(100, height - 150, width - 200, 100, 20, 20);

        // Details in Footer
        g2d.setColor(new Color(30, 41, 59)); // Slate 800
        g2d.setFont(detailFont);

        String cancha = "🏟️ " + match.getCanchaNombre();
        String fecha = "📅 " + match.getFecha() + "   ⏰ " + match.getHora();

        drawCenteredString(g2d, cancha, width / 4 + 50, height - 90);
        drawCenteredString(g2d, fecha, 3 * width / 4 - 50, height - 90);

        g2d.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }

    private void drawCenteredString(Graphics g, String text, int x, int y) {
        FontMetrics metrics = g.getFontMetrics(g.getFont());
        int xProps = x - (metrics.stringWidth(text) / 2);
        g.drawString(text, xProps, y);
    }

    private void drawScaledCenteredString(Graphics2D g, String text, int x, int y, int maxWidth, Font defaultFont) {
        g.setFont(defaultFont);
        FontMetrics metrics = g.getFontMetrics();
        int width = metrics.stringWidth(text);

        // Scale down if too wide
        while (width > maxWidth && g.getFont().getSize() > 20) {
            float newSize = g.getFont().getSize() * 0.9f; // Reduce by 10%
            g.setFont(g.getFont().deriveFont(newSize));
            metrics = g.getFontMetrics();
            width = metrics.stringWidth(text);
        }

        int xProps = x - (width / 2);
        g.drawString(text, xProps, y);
    }
}
