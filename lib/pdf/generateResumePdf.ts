import { jsPDF } from "jspdf";
import { ResumeFormData } from "@/types/resume";

export function generateResumePdf(data: ResumeFormData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const { personal, experience, education, skills } = data;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let yOffset = 20;

  const checkPageBreak = (neededHeight: number) => {
    if (yOffset + neededHeight > pageHeight - margin) {
      doc.addPage();
      yOffset = margin;
      return true;
    }
    return false;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const name = personal.name || "YOUR NAME";
  const nameWidth = doc.getTextWidth(name);
  doc.text(name, (pageWidth - nameWidth) / 2, yOffset);
  yOffset += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const contactInfo = [
    personal.email,
    personal.phone,
    personal.linkedin && "LinkedIn",
    personal.portfolio && "Portfolio",
  ]
    .filter(Boolean)
    .join("  |  ");
  const contactWidth = doc.getTextWidth(contactInfo);
  doc.text(contactInfo, (pageWidth - contactWidth) / 2, yOffset);
  yOffset += 10;

  if (experience && experience.length > 0 && experience[0].company) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PROFESSIONAL EXPERIENCE", margin, yOffset);
    yOffset += 2;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 5;

    experience.forEach((exp) => {
      checkPageBreak(25);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(exp.role, margin, yOffset);

      const dateText = `${exp.startDate} - ${exp.endDate}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.setFont("helvetica", "normal");
      doc.text(dateText, pageWidth - margin - dateWidth, yOffset);
      yOffset += 4.5;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(exp.company, margin, yOffset);
      doc.setTextColor(0, 0, 0);
      yOffset += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const descLines = doc.splitTextToSize(exp.description, contentWidth);
      descLines.forEach((line: string) => {
        checkPageBreak(5);
        doc.text(line, margin, yOffset);
        yOffset += 4.5;
      });
      yOffset += 4;
    });
    yOffset += 2;
  }

  if (education && education.length > 0 && education[0].school) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("EDUCATION", margin, yOffset);
    yOffset += 2;
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 5;

    education.forEach((edu) => {
      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(edu.school, margin, yOffset);

      const yearWidth = doc.getTextWidth(edu.year);
      doc.setFont("helvetica", "normal");
      doc.text(edu.year, pageWidth - margin - yearWidth, yOffset);
      yOffset += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(edu.degree, margin, yOffset);
      yOffset += 8;
    });
  }

  if (skills && skills.length > 0) {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("SKILLS", margin, yOffset);
    yOffset += 2;
    doc.line(margin, yOffset, pageWidth - margin, yOffset);
    yOffset += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const skillsText = skills.join(", ");
    const skillsLines = doc.splitTextToSize(skillsText, contentWidth);
    skillsLines.forEach((line: string) => {
      checkPageBreak(5);
      doc.text(line, margin, yOffset);
      yOffset += 4.5;
    });
  }

  const filename = `${(personal.name || "resume").toLowerCase().replace(/\s+/g, "_")}_resume.pdf`;
  doc.save(filename);
}
